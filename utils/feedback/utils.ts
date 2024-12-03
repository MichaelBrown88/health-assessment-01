import type { FeedbackItem, FeedbackMap } from '@/types/feedback';
import { feedbackData } from './data';

export function getFeedbackText(type: keyof FeedbackMap, value: string | undefined | null): FeedbackItem {
  if (!value || value === '') {
    return {
      feedback: "This aspect has not been assessed yet.",
      recommendations: "Complete this section of the assessment for personalized feedback."
    };
  }

  const normalizedValue = value.toLowerCase().trim();
  const feedbackMap = feedbackData[type];
  
  if (!feedbackMap) {
    console.warn(`No feedback map found for type: ${type}`);
    return {
      feedback: `No specific feedback available for ${type}.`,
      recommendations: "Please complete this section for personalized recommendations."
    };
  }

  const feedback = feedbackMap[normalizedValue];
  if (!feedback) {
    console.warn(`No feedback found for value: ${normalizedValue} in type: ${type}`);
    return {
      feedback: `Your ${type} is ${value}.`,
      recommendations: "Complete the assessment for personalized recommendations."
    };
  }

  return feedback;
}

export function normalizeValue(value: string | undefined | null): string {
  if (!value || value === '') return '';
  return value.toLowerCase().trim().replace(/\s+/g, '-');
}

export function formatDisplayValue(value: string | undefined | null): string {
  if (!value || value === '') return 'Not Assessed';
  
  const normalizedValue = value.toLowerCase().trim();
  
  // Handle special cases
  const specialFormats: Record<string, string> = {
    'less-than-30': 'Less than 30 min',
    'less-than-6': 'Less than 6 hrs',
    'more-than-9': 'More than 9 hrs',
    'before-6pm': 'Before 6 PM',
    'after-10pm': 'After 10 PM',
    'very-active': 'Very Active',
    'very-high': 'Very High',
    'very-low': 'Very Low'
  };

  if (specialFormats[normalizedValue]) {
    return specialFormats[normalizedValue];
  }

  // Handle time ranges
  if (normalizedValue.includes('pm')) {
    return normalizedValue.split('-')
      .map(time => time.replace('pm', ' PM'))
      .join(' - ');
  }

  // Handle numeric ranges
  if (normalizedValue.includes('-')) {
    return normalizedValue.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('-');
  }

  // Default case: capitalize first letter
  return value.charAt(0).toUpperCase() + value.slice(1);
} 