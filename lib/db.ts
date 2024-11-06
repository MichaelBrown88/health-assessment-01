import { db } from '@/lib/firebase';
import { 
  doc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  setDoc 
} from 'firebase/firestore';
import type { AssessmentResult } from '@/types';

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
