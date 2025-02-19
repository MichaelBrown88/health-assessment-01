import { Assessment } from '@/types/assessment';
import { getTimestampNumber } from '@/utils/date';

const ONE_DAY = 24 * 60 * 60 * 1000; // milliseconds in a day

export const calculateStreak = (assessments: Assessment[] | null): number => {
  if (!assessments || assessments.length === 0) return 0;
  
  const sortedAssessments = [...assessments].sort((a, b) => {
    const dateA = getTimestampNumber(a.createdAt);
    const dateB = getTimestampNumber(b.createdAt);
    return dateB - dateA;
  });

  let streak = 1;
  let currentDate = getTimestampNumber(sortedAssessments[0].createdAt);

  for (let i = 1; i < sortedAssessments.length; i++) {
    const prevDate = getTimestampNumber(sortedAssessments[i].createdAt);
    const dayDiff = Math.round((currentDate - prevDate) / ONE_DAY);

    if (dayDiff === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateCompletionRate = (assessments: Assessment[] | null): number => {
  if (!assessments || assessments.length === 0) return 0;
  
  const sortedAssessments = [...assessments].sort((a, b) => {
    const dateA = getTimestampNumber(a.createdAt);
    const dateB = getTimestampNumber(b.createdAt);
    return dateA - dateB;
  });

  const firstDate = getTimestampNumber(sortedAssessments[0].createdAt);
  const lastDate = getTimestampNumber(sortedAssessments[sortedAssessments.length - 1].createdAt);
  const totalDays = Math.ceil((lastDate - firstDate) / ONE_DAY) + 1;

  return Math.round((assessments.length / totalDays) * 100);
};

export const compareMetrics = (current: Assessment, previous: Assessment) => {
  if (!current || !previous) {
    return {
      improved: 0,
      unchanged: 0,
      declined: 0
    };
  }

  let improved = 0;
  let unchanged = 0;
  let declined = 0;

  // Compare overall scores
  if (current.metrics.overallScore > previous.metrics.overallScore) improved++;
  else if (current.metrics.overallScore < previous.metrics.overallScore) declined++;
  else unchanged++;

  // Compare individual metrics
  const metricKeys = ['exerciseScore', 'nutritionScore', 'mentalHealthScore', 'sleepScore'] as const;
  
  metricKeys.forEach(key => {
    if (current.metrics[key] > previous.metrics[key]) improved++;
    else if (current.metrics[key] < previous.metrics[key]) declined++;
    else unchanged++;
  });

  return {
    improved,
    unchanged,
    declined
  };
};
