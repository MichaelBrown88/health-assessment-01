import { SectionFeedback } from '@/types/results'

export const getSafeAnswer = (answer: string | number | string[] | null | undefined): string => {
  if (answer === undefined || answer === null) {
    return '';
  }
  if (typeof answer === 'string') {
    return answer;
  }
  if (Array.isArray(answer)) {
    return answer.join(', ');
  }
  try {
    return String(answer);
  } catch {
    return '';
  }
};

export const getSectionFeedback = (item: string, value: string): SectionFeedback => {
  // Implement feedback logic based on item type
  switch (item) {
    case 'activityLevel':
      return {
        item,
        score: value === 'sedentary' ? 20 : value === 'light' ? 40 : value === 'moderate' ? 60 : 80,
        color: value === 'sedentary' ? 'red' : value === 'light' ? 'amber' : 'green',
        feedback: `Your activity level is ${value}`,
        recommendations: getActivityRecommendation(value)
      };
    case 'exerciseIntensity':
      return {
        item,
        score: getItemScore(item, value),
        color: getTrafficLightColor(getItemScore(item, value)),
        feedback: getFeedbackText(value, item),
        recommendations: getExerciseRecommendations(value)
      };
    // Add other cases
    default:
      return {
        item,
        score: 50,
        color: 'amber',
        feedback: `Your ${item} is ${value}`,
        recommendations: 'Consider consulting a health professional for personalized advice.'
      };
  }
};

export const getMealFeedback = (value: string): SectionFeedback => {
  return {
    item: 'lastMeal',
    score: 50,
    color: 'amber',
    feedback: `Your last meal was ${value}`,
    recommendations: 'Consider timing your meals throughout the day.'
  };
};

function getActivityRecommendation(level: string): string {
  switch (level) {
    case 'sedentary':
      return 'Try to incorporate more movement into your daily routine.';
    case 'light':
      return 'Consider increasing your activity level gradually.';
    case 'moderate':
      return 'You\'re on the right track! Consider adding variety to your activities.';
    default:
      return 'Maintain your active lifestyle while ensuring proper recovery.';
  }
} 