import type { SectionFeedback } from '@/types/results';
import { getFeedbackColor, getFeedbackText } from '@/utils/feedback';
import type { FeedbackMap } from '@/types/feedback';

export function getExerciseFeedback(value: string, type: keyof FeedbackMap): SectionFeedback {
  const score = getItemScore(value, type);
  const color = getFeedbackColor(value, type);
  const feedbackText = getFeedbackText(type, value);
  
  return {
    score,
    color,
    feedback: feedbackText?.feedback || `Your ${type} is ${value}`,
    recommendations: feedbackText?.recommendations || getExerciseRecommendations(value, type)
  };
}

export function getMealFeedback(value: string): SectionFeedback {
  const color = getFeedbackColor(value, 'lastMeal' as keyof FeedbackMap);
  const feedbackText = getFeedbackText('lastMeal' as keyof FeedbackMap, value);

  return {
    score: 50,
    color,
    feedback: feedbackText?.feedback || `Your last meal was ${value}`,
    recommendations: feedbackText?.recommendations || 'Consider timing your meals throughout the day.'
  };
}

export function getActivityRecommendation(level: string): string {
  const feedbackText = getFeedbackText('activityLevel' as keyof FeedbackMap, level);
  return feedbackText?.recommendations || 'Maintain your active lifestyle while ensuring proper recovery.';
}

function getItemScore(value: string, type: string): number {
  const scoreMap: Record<string, Record<string, number>> = {
    exerciseIntensity: {
      'light': 60,
      'moderate': 80,
      'vigorous': 100,
      'very-intense': 90
    },
    exerciseDuration: {
      'less-than-30': 60,
      '30-45': 80,
      '45-60': 100,
      '60+': 90
    }
  };

  return scoreMap[type]?.[value] || 50;
}

function getExerciseRecommendations(value: string, type: string): string {
  const recommendationMap: Record<string, Record<string, string>> = {
    exerciseIntensity: {
      'light': 'Consider gradually increasing intensity for better results.',
      'moderate': 'Good balance. Mix in some higher intensity sessions when ready.',
      'vigorous': 'Ensure proper recovery between intense sessions.',
      'very-intense': 'Monitor recovery closely and consider periodization.'
    },
    exerciseDuration: {
      'less-than-30': 'Try to extend sessions gradually for better results.',
      '30-45': 'Good duration. Focus on session quality.',
      '45-60': 'Excellent duration for most goals.',
      '60+': 'Ensure intensity remains high throughout longer sessions.'
    }
  };

  return recommendationMap[type]?.[value] || 'Maintain consistent effort and track progress.';
} 