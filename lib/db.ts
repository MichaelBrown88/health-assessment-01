import { db } from './firebase';
import { doc, setDoc, collection, addDoc, getDoc, getDocs } from 'firebase/firestore';

export async function saveAssessmentResult(userId: string, assessmentData: any) {
  const userRef = doc(db, 'users', userId);
  const assessmentRef = collection(userRef, 'assessments');
  return addDoc(assessmentRef, {
    ...assessmentData,
    createdAt: new Date().toISOString()
  });
}
