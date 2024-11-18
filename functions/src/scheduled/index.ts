import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db } from '../firebase-admin';
import { logError, logInfo } from '../utils/logging';

export const updateDailyAnalytics = onSchedule({
  schedule: '0 0 * * *',
  region: 'asia-east1',
  memory: '256MiB',
  timeoutSeconds: 60,
  retryCount: 3,
  labels: {
    environment: 'production'
  }
}, async (event) => {
  try {
    const [usersSnapshot, assessmentsSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('assessments').get()
    ]);

    const analyticsData = {
      timestamp: Date.now(),
      totalUsers: usersSnapshot.size,
      totalAssessments: assessmentsSnapshot.size,
    };

    await db.collection('analytics').doc('daily').set(analyticsData);
    logInfo('Daily analytics updated successfully', analyticsData);
    
    return;
  } catch (error) {
    logError(error, 'updateDailyAnalytics');
    throw error;
  }
});
