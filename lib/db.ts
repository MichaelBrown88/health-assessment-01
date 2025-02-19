import { db } from '@/lib/firebase';
import { 
  doc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  where, 
  addDoc, 
  increment 
} from 'firebase/firestore';
import type {AssessmentResult} from '@/types';

export interface AssessmentData {
  userId: string;
  timestamp: number;
  answers: Record<string, string | number | boolean | string[]>;
  metrics: {
    bmi: number | null;
    weight: number | null;
    height: number | null;
    bodyFat: number | null;
    overallScore: number;
  };
  analysis: {
    exercise: string | null;
    nutrition: string | null;
    mentalHealth: string | null;
  };
  healthCalculations: Record<string, string | number | null>;
}

export const saveAssessmentResult = async (
  userId: string, 
  data: {
    answers: Record<string, string | number | boolean | string[]>;
    healthCalculations: Record<string, string | number | null>;
    score: number;
    summary: Record<string, string | null>;
    timestamp: number;
  }
) => {
  const assessmentRef = doc(db, 'users', userId, 'assessments', data.timestamp.toString());
  await setDoc(assessmentRef, {
    ...data,
    resultSnapshot: {
      answers: data.answers,
      healthCalculations: data.healthCalculations,
      score: data.score,
      summary: data.summary
    }
  });
};

export async function getUserAssessments(userId: string): Promise<AssessmentResult[]> {
  try {
    const assessmentsRef = collection(db, 'users', userId, 'assessments');
    const q = query(assessmentsRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    
    const assessments = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        timestamp: data.timestamp,
        metrics: data.metrics,
        answers: data.answers
      } as AssessmentResult;
    });
    
    return assessments;
  } catch (error) {
    console.error('Error fetching assessments:', error);
    throw error;
  }
}

export async function clearUserAssessments(userId: string) {
  try {
    const assessmentsRef = collection(db, 'users', userId, 'assessments');
    const snapshot = await getDocs(assessmentsRef);
    
    const deletePromises = snapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);
    console.log('All assessments cleared');
  } catch (error) {
    console.error('Error clearing assessments:', error);
    throw error;
  }
}

export async function convertLeadToUser(email: string, userId: string) {
  try {
    console.log('Starting lead conversion process...', { email, userId });
    
    // Query for all leads with matching email (there might be multiple assessments)
    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    console.log('Found leads for email:', { 
      email, 
      leadCount: querySnapshot.size,
      hasLeads: !querySnapshot.empty 
    });

    let assessmentCount = 0;
    let lastAssessmentDate = null;

    if (!querySnapshot.empty) {
      // Process all leads for this email
      const savePromises = querySnapshot.docs.map(async (leadDoc) => {
        const leadData = leadDoc.data();
        console.log('Processing lead document:', { 
          leadId: leadDoc.id,
          hasAnswers: !!leadData.answers,
          hasAssessmentResults: !!leadData.assessmentResults,
          status: leadData.status
        });

        // Save assessment data to user's assessments
        if (leadData.answers && leadData.assessmentResults) {
          const timestamp = leadData.timestamp || Date.now();
          const assessmentRef = doc(db, 'users', userId, 'assessments', timestamp.toString());
          
          console.log('Saving assessment to user profile:', {
            userId,
            assessmentId: timestamp.toString(),
            score: leadData.assessmentResults.score
          });

          try {
            await setDoc(assessmentRef, {
              userId,
              answers: leadData.answers,
              healthCalculations: leadData.assessmentResults.healthCalculations,
              score: leadData.assessmentResults.score,
              summary: leadData.assessmentResults.summary,
              timestamp,
              metrics: leadData.metrics || {
                overallScore: leadData.assessmentResults.score,
                exerciseScore: leadData.assessmentResults.healthCalculations.exerciseScore || 0,
                nutritionScore: leadData.assessmentResults.healthCalculations.nutritionScore || 0,
                mentalHealthScore: leadData.assessmentResults.healthCalculations.mentalHealthScore || 0,
                sleepScore: leadData.assessmentResults.healthCalculations.sleepScore || 0
              },
              createdAt: serverTimestamp()
            });
            console.log('Successfully saved assessment to user profile');

            assessmentCount++;
            lastAssessmentDate = timestamp;

            // Update lead status
            await updateDoc(doc(db, 'leads', leadDoc.id), {
              status: 'converted',
              userId: userId,
              convertedAt: serverTimestamp()
            });
            console.log('Successfully updated lead status to converted');
          } catch (error) {
            console.error('Error saving assessment or updating lead:', {
              error,
              errorMessage: error instanceof Error ? error.message : 'Unknown error',
              userId,
              leadId: leadDoc.id
            });
            throw error;
          }
        }
      });

      // Wait for all saves to complete
      await Promise.all(savePromises);
      console.log('All lead conversions completed successfully');

      // Update user profile stats
      const userRef = doc(db, 'users', userId);
      try {
        const updateData: any = {
          'stats.assessmentsCompleted': increment(assessmentCount),
          lastActive: serverTimestamp()
        };

        if (lastAssessmentDate) {
          updateData['stats.lastAssessmentDate'] = lastAssessmentDate;
        }

        await updateDoc(userRef, updateData);
        
        console.log('Successfully updated user stats:', {
          userId,
          assessmentsCompleted: assessmentCount,
          lastAssessmentDate
        });
      } catch (error) {
        console.error('Error updating user stats:', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          userId
        });
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in lead conversion process:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      email,
      userId
    });
    throw error;
  }
}
