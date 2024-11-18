import { onCall, CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import { db } from '../firebase-admin';
import type { AdminDashboardStats } from './types';
import type { Assessment } from '../types/assessment';
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';

interface FirestoreAssessment {
  metrics: {
    overallScore: number;
  };
  createdAt: Timestamp;
}

const assessmentConverter: FirestoreDataConverter<Assessment> = {
  toFirestore(assessment: Assessment): DocumentData {
    return assessment;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Assessment {
    const data = snapshot.data() as FirestoreAssessment;
    return {
      metrics: data.metrics,
      createdAt: data.createdAt
    };
  }
};

export const getAdminDashboardStats = onCall<any, Promise<AdminDashboardStats>>({
  region: 'asia-east1',
  memory: '256MiB',
  cors: ['http://localhost:3000', 'https://your-production-domain.com']
}, async (request: CallableRequest<any>) => {
  if (!request.auth?.token?.admin) {
    throw new HttpsError('permission-denied', 'Only admins can access dashboard stats');
  }

  try {
    const assessmentsRef = db.collection('assessments').withConverter(assessmentConverter);
    const [usersSnapshot, assessmentsSnapshot] = await Promise.all([
      db.collection('users').get(),
      assessmentsRef.get()
    ]);

    const totalUsers = usersSnapshot.size;
    const totalAssessments = assessmentsSnapshot.size;

    let totalScore = 0;
    assessmentsSnapshot.docs.forEach(doc => {
      const assessment = doc.data();
      totalScore += assessment.metrics?.overallScore || 0;
    });

    const averageScore = totalAssessments > 0 ? totalScore / totalAssessments : 0;

    const stats: AdminDashboardStats = {
      totalUsers,
      totalAssessments,
      averageScore,
      userDemographics: {
        ageGroups: {},
        genderDistribution: {},
        fitnessLevels: {}
      },
      assessmentTrends: [],
      conversionRate: 0,
      retentionRate: 0
    };

    return stats;
  } catch (error) {
    console.error('Error getting admin stats:', error);
    throw new HttpsError('internal', 'Error fetching admin statistics');
  }
});
