import type { Assessment } from "@/types/assessment"

const getTimestampNumber = (timestamp: number | Date | { seconds: number; nanoseconds: number }): number => {
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }
  if (typeof timestamp === 'number') {
    return timestamp;
  }
  return timestamp.seconds * 1000;
};

export const calculateStreak = (assessments: Assessment[]): number => {
  if (assessments.length === 0) return 0;
  
  const sortedAssessments = [...assessments].sort((a, b) => {
    const dateA = getTimestampNumber(a.timestamp);
    const dateB = getTimestampNumber(b.timestamp);
    return dateB - dateA;
  });

  let streak = 1;
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  
  for (let i = 1; i < sortedAssessments.length; i++) {
    const currentDate = getTimestampNumber(sortedAssessments[i-1].timestamp);
    const prevDate = getTimestampNumber(sortedAssessments[i].timestamp);
    
    if (currentDate - prevDate <= oneDay) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const calculateCompletionRate = (assessments: Assessment[]): number => {
  if (assessments.length === 0) return 0;
  
  const totalPossibleDays = 30; // Assuming we're measuring against a 30-day period
  const completedDays = assessments.length;
  
  return Math.round((completedDays / totalPossibleDays) * 100);
};

export const compareMetrics = (current: Assessment, previous: Assessment) => {
  const metrics = Object.keys(current.metrics);
  let improved = 0;
  let declined = 0;
  let unchanged = 0;

  metrics.forEach(metric => {
    if (current.metrics[metric] > previous.metrics[metric]) {
      improved++;
    } else if (current.metrics[metric] < previous.metrics[metric]) {
      declined++;
    } else {
      unchanged++;
    }
  });

  return { improved, declined, unchanged };
};
