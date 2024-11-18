import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import cors from 'cors';

// Initialize admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Initialize cors middleware
const corsHandler = cors({ origin: true });

export const getAdminAnalytics = functions.https.onRequest((request, response) => {
  return corsHandler(request, response, async () => {
    try {
      // Verify admin status
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Check if user is admin
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(decodedToken.uid)
        .get();

      if (!userDoc.exists || !userDoc.data()?.isAdmin) {
        response.status(403).json({ error: 'Forbidden' });
        return;
      }

      // Your analytics logic here
      const analytics = {
        users: {
          total: 0,
          premium: 0,
          activeToday: 0
        },
        assessments: {
          total: 0,
          averageScore: 0,
          completionRate: 0
        },
        features: {
          aiUsage: {
            total: 0,
            uniqueUsers: 0,
            averagePerUser: 0
          }
        }
      };

      response.status(200).json(analytics);
    } catch (error) {
      console.error('Function error:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  });
});
