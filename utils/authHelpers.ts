export const handleAuthError = (error: unknown) => {
  console.error('Auth error:', error);
  throw error;
};

export const handleAuthSuccess = (router: any, user: any) => {
  router.push('/welcome');
}; 