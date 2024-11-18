import { onCall } from 'firebase-functions/v2/https';
import { auth } from '../firebase-admin';

export const checkFirstRun = onCall({
  region: 'asia-east1'
}, async () => {
  try {
    const usersList = await auth.listUsers(1);
    return {
      success: true,
      isFirstRun: usersList.users.length === 0
    };
  } catch (error) {
    console.error('Error in checkFirstRun:', error);
    return {
      success: false,
      isFirstRun: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
});
