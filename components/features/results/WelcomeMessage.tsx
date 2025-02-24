'use client'

interface WelcomeMessageProps {
  contactInfo: { name: string } | null;
  user: any; // Replace with proper user type from your auth context
}

export function WelcomeMessage({ contactInfo, user }: WelcomeMessageProps) {
  const getWelcomeMessage = () => {
    const isReturningUser = user || sessionStorage.getItem('previousAssessment');
    const name = contactInfo?.name || user?.displayName || '';

    if (!name) return "Your Health Analysis Results";
    
    if (isReturningUser) {
      return (
        <div className="text-center space-y-2">
          <h2 className="text-lg font-medium text-blue-300">Welcome back, {name}</h2>
          <h1 className="text-3xl font-bold">Your Latest Health Analysis</h1>
        </div>
      );
    }

    return (
      <div className="text-center space-y-2">
        <h2 className="text-lg font-medium text-blue-300">Thanks for completing your assessment, {name}</h2>
        <h1 className="text-3xl font-bold">Here's Your Health Analysis</h1>
      </div>
    );
  };

  return getWelcomeMessage();
} 