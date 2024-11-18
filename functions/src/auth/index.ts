import { onCall } from 'firebase-functions/v2/https';
import { auth } from '../firebase-admin';

interface SetAdminRoleRequest {
  email: string;
}

interface SetAdminRoleResponse {
  success: boolean;
}

export const setAdminRole = onCall<SetAdminRoleRequest, Promise<SetAdminRoleResponse>>({
  region: 'asia-east1'
}, async (request) => {
  if (!request.auth?.token?.admin) {
    throw new Error('Only existing admins can create new admins');
  }

  try {
    const user = await auth.getUserByEmail(request.data.email);
    await auth.setCustomUserClaims(user.uid, { admin: true });
    return { success: true };
  } catch (error) {
    console.error('Error setting admin role:', error);
    throw new Error('Error setting admin role');
  }
});
