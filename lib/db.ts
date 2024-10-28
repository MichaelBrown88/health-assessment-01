import { db } from './firebase';
import { doc, collection, addDoc } from 'firebase/firestore';

// Only import what you're actually using
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { setDoc } from 'firebase/firestore';

// Only export what you're actually using
export const saveUserResponse = async (userId: string, data: Record<string, unknown>) => {
  const userRef = doc(db, 'responses', userId);
  await setDoc(userRef, data);
};

// Replace 'any' with proper types
interface YourDataType {
  // Define your data structure
  // For example:
  title?: string;
  description?: string;
  // Add other fields as needed
}

// Use the interface instead of 'any'
export const addData = async (data: YourDataType) => {
  try {
    // Create a reference to your collection
    const collectionRef = collection(db, 'your-collection-name');
    
    // Add the document to your collection
    const docRef = await addDoc(collectionRef, data);
    
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};

// If you need to get a specific document reference
export const getDocRef = (collectionName: string, docId: string) => {
  return doc(db, collectionName, docId);
};

// Export all interfaces that are used externally
export interface FeedbackItem {
  score: number;
  color: string;
  feedback: string;
  recommendations: string;
  item: string;
}

export interface SummaryItem {
  title: string;
  score: number;
  feedbackItems: FeedbackItem[];
}

export interface HealthCalculations {
  bmi: number | null;
  // Add other health calculation fields
}

export interface AssessmentResult {
  userId: string;
  score: number;
  healthCalculations: HealthCalculations;
  summary: SummaryItem[];
  date: Date;
}

export const saveAssessmentResult = async (result: AssessmentResult) => {
  try {
    const assessmentsRef = collection(db, 'assessments');
    const docRef = await addDoc(assessmentsRef, {
      ...result,
      date: new Date(),
    });
    console.log('Assessment saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving assessment: ', error);
    throw error;
  }
};
