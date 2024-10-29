export const formatRecovery = (value: string): string => {
  const mapping: Record<string, string> = {
    'poor': 'Poor',
    'fair': 'Fair',
    'good': 'Good',
    'excellent': 'Excellent'
  };
  return mapping[value] || value;
};
