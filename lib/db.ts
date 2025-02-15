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
  addDoc 
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
    wellbeing: string | null;
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
    // Query for the lead with matching email
    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const leadDoc = querySnapshot.docs[0];
      const leadData = leadDoc.data();

      // Save assessment data to user's assessments
      if (leadData.answers && leadData.assessmentResults) {
        await saveAssessmentResult(userId, {
          answers: leadData.answers,
          healthCalculations: leadData.assessmentResults.healthCalculations,
          score: leadData.assessmentResults.score,
          summary: leadData.assessmentResults.summary,
          timestamp: leadData.timestamp || Date.now()
        });
      }

      // Update lead status
      await updateDoc(doc(db, 'leads', leadDoc.id), {
        status: 'converted',
        userId: userId,
        convertedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error converting lead:', error);
    throw error;
  }
}

export const saveLeadData = async (data: {
  name: string;
  email: string;
  answers: Record<string, string | number | boolean | string[]>;
  assessmentResults: {
    score: number;
    healthCalculations: Record<string, string | number | null>;
    summary: Record<string, string>;
  };
  timestamp: number;
}) => {
  const leadsRef = collection(db, 'leads');
  const docRef = await addDoc(leadsRef, {
    ...data,
    status: 'new',
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...data };
};
