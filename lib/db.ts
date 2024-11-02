import { db } from '@/lib/firebase';
import { doc, collection, getDocs, query, orderBy, deleteDoc, addDoc, where, limit } from 'firebase/firestore';
import type { AssessmentResult } from '@/types';

interface AssessmentData {
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

export const saveAssessmentResult = async (data: AssessmentData) => {
  if (!data.userId) return;

  // Sanitize the data before saving
  const sanitizedData = {
    ...data,
    metrics: {
      ...data.metrics,
      bmi: data.metrics.bmi || null,
      weight: data.metrics.weight || null,
      height: data.metrics.height || null,
      bodyFat: data.metrics.bodyFat || null,
      overallScore: data.metrics.overallScore
    }
  };

  const userRef = doc(db, 'users', data.userId);
  const assessmentRef = collection(userRef, 'assessments');
  
  // Check for existing assessment within the last minute
  const lastMinute = new Date(Date.now() - 60000);
  const q = query(
    assessmentRef,
    where('timestamp', '>', lastMinute.getTime()),
    limit(1)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    await addDoc(assessmentRef, sanitizedData);
  }
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
