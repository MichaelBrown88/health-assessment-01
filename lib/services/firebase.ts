import { 
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export class FirebaseService {
  private collection: string;

  constructor(collectionName: string) {
    this.collection = collectionName;
  }

  protected getCollectionRef() {
    return collection(db, this.collection);
  }

  protected getDocRef(id: string) {
    return doc(db, this.collection, id);
  }

  async getById<T = DocumentData>(id: string): Promise<T | null> {
    const docRef = this.getDocRef(id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
  }

  async getAll<T = DocumentData>(): Promise<T[]> {
    const querySnapshot = await getDocs(this.getCollectionRef());
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  }

  async query<T = DocumentData>(constraints: QueryConstraint[]): Promise<T[]> {
    const q = query(this.getCollectionRef(), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  }

  async create<T extends DocumentData>(id: string, data: T): Promise<void> {
    await setDoc(this.getDocRef(id), data);
  }

  async update(id: string, data: Partial<DocumentData>): Promise<void> {
    await updateDoc(this.getDocRef(id), data);
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(this.getDocRef(id));
  }
}

// Create specific service instances for each collection
export const usersService = new FirebaseService('users');
export const assessmentsService = new FirebaseService('assessments');
export const leadsService = new FirebaseService('leads');

// Example of extending the base service for custom functionality
export class AssessmentsService extends FirebaseService {
  constructor() {
    super('assessments');
  }

  async getByUserId<T = DocumentData>(userId: string): Promise<T[]> {
    return this.query<T>([where('userId', '==', userId)]);
  }

  async getLatestByUserId<T = DocumentData>(userId: string): Promise<T | null> {
    const results = await this.query<T>([
      where('userId', '==', userId),
      where('createdAt', '<=', new Date())
    ]);
    return results.length > 0 ? results[0] : null;
  }
} 