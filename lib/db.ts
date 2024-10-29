import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  orderBy,
  query,
  Timestamp
} from 'firebase/firestore';
import type { AssessmentResult } from '@/types';

export async function saveAssessmentResult(result: AssessmentResult): Promise<void> {
  if (!result.userId) throw new Error('User ID is required');
  
  // Generate a deterministic ID based on timestamp to prevent duplicates
  const id = new Date(result.timestamp).getTime().toString();
  
  const resultRef = doc(db, 'users', result.userId, 'assessments', id);
  
  try {
    await setDoc(resultRef, {
      ...result,
      timestamp: Timestamp.fromDate(result.timestamp),
    });
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }
}

export async function getUserAssessments(userId: string): Promise<AssessmentResult[]> {
  try {
    console.log('Fetching assessments for user:', userId);
    
    const q = query(
      collection(db, 'users', userId, 'assessments'),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    console.log('Found documents:', snapshot.size);
    
    const assessments = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Document data:', data);
      return {
        id: doc.id,
        userId: data.userId,
        timestamp: data.timestamp.toDate(),
        answers: data.answers,
        metrics: data.metrics,
        analysis: data.analysis,
        healthCalculations: data.healthCalculations
      } as AssessmentResult;
    });

    console.log('Processed assessments:', assessments);
    return assessments;
  } catch (error) {
    console.error('Error fetching assessments:', error);
    throw error;
  }
}
