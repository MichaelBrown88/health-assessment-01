import { Timestamp } from 'firebase-admin/firestore';

export interface Assessment {
  metrics: {
    overallScore: number;
  };
  createdAt: Timestamp;
}
