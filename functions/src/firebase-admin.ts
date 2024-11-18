import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

// Export only what we're using
export const auth = admin.auth();
export const db = admin.firestore();

// Export the admin SDK itself for other uses
export default admin;
