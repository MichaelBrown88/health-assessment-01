import * as admin from 'firebase-admin';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { db } from '../firebase-admin';
import { logError, logInfo } from '../utils/logging';

interface AssessmentData {
  metrics: {
    overallScore: number;
  };
}

export const onAssessmentComplete = onDocumentCreated({
  document: 'assessments/{assessmentId}',
  region: 'asia-east1',
  memory: '256MiB'
}, async (event) => {
  try {
    if (!event.data) {
      logError(new Error('No data available'), 'onAssessmentComplete');
      return;
    }

    const assessment = event.data.data() as AssessmentData;
    const statsRef = db.collection('statistics').doc('assessments');
    
    await db.runTransaction(async (transaction: admin.firestore.Transaction) => {
      const statsDoc = await transaction.get(statsRef);
      const stats = statsDoc.data() || { total: 0, scores: {} };
      
      stats.total += 1;
      const scoreRange = Math.floor(assessment.metrics.overallScore / 10) * 10;
      stats.scores[scoreRange] = (stats.scores[scoreRange] || 0) + 1;
      
      transaction.set(statsRef, stats, { merge: true });
    });

    logInfo('Assessment statistics updated', { 
      assessmentId: event.params.assessmentId 
    });
  } catch (error) {
    logError(error, 'onAssessmentComplete');
    throw error;
  }
});
