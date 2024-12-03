import type { TrafficLightColor } from '@/types/health';
import type { FeedbackMap } from '@/types/feedback';

export function getTrafficLightColor(value: string | undefined | null, type: keyof FeedbackMap): TrafficLightColor {
  if (!value || value === '') return 'amber';

  const normalizedValue = value.toLowerCase().trim();

  // Activity Level
  if (type === 'activityLevel') {
    switch (normalizedValue) {
      case 'sedentary': return 'red';
      case 'light': return 'amber';
      case 'moderate': return 'green';
      case 'active': return 'green';
      case 'very-active': return 'green';
      default: return 'amber';
    }
  }

  // Exercise Intensity
  if (type === 'exerciseIntensity') {
    switch (normalizedValue) {
      case 'light': return 'amber';
      case 'moderate': return 'green';
      case 'vigorous': return 'green';
      case 'very-intense': return 'amber';
      default: return 'amber';
    }
  }

  // Exercise Duration
  if (type === 'exerciseDuration') {
    switch (normalizedValue) {
      case 'less-than-30': return 'amber';
      case '30-45': return 'green';
      case '45-60': return 'green';
      case '60+': return 'amber';
      default: return 'amber';
    }
  }

  // Diet Quality
  if (type === 'diet') {
    switch (normalizedValue) {
      case 'poor': return 'red';
      case 'fair': return 'amber';
      case 'good': return 'green';
      case 'excellent': return 'green';
      default: return 'amber';
    }
  }

  // Meal Frequency
  if (type === 'mealFrequency') {
    switch (normalizedValue) {
      case '1-2': return 'red';
      case '2-3': return 'amber';
      case '3-4': return 'green';
      case '4-5': return 'green';
      case '5+': return 'amber';
      default: return 'amber';
    }
  }

  // Last Meal Timing
  if (type === 'lastMeal') {
    switch (normalizedValue) {
      case 'before-6pm': return 'green';
      case '6pm-8pm': return 'green';
      case '8pm-10pm': return 'amber';
      case 'after-10pm': return 'red';
      default: return 'amber';
    }
  }

  // Sleep Duration
  if (type === 'sleepDuration') {
    switch (normalizedValue) {
      case 'less-than-6': return 'red';
      case '6-7': return 'amber';
      case '7-8': return 'green';
      case '8-9': return 'green';
      case 'more-than-9': return 'amber';
      default: return 'amber';
    }
  }

  // Sleep Quality
  if (type === 'sleepQuality') {
    switch (normalizedValue) {
      case 'poor': return 'red';
      case 'fair': return 'amber';
      case 'good': return 'green';
      case 'excellent': return 'green';
      default: return 'amber';
    }
  }

  // Recovery
  if (type === 'recovery') {
    switch (normalizedValue) {
      case 'poor': return 'red';
      case 'fair': return 'amber';
      case 'good': return 'green';
      case 'excellent': return 'green';
      default: return 'amber';
    }
  }

  // Stress Level
  if (type === 'stress') {
    switch (normalizedValue) {
      case 'very-high': return 'red';
      case 'high': return 'red';
      case 'moderate': return 'amber';
      case 'low': return 'green';
      case 'very-low': return 'green';
      default: return 'amber';
    }
  }

  // Mental Health
  if (type === 'mentalHealth') {
    switch (normalizedValue) {
      case 'often': return 'red';
      case 'sometimes': return 'amber';
      case 'rarely': return 'green';
      case 'never': return 'green';
      default: return 'amber';
    }
  }

  // Social Activity
  if (type === 'socializing') {
    switch (normalizedValue) {
      case 'rarely': return 'red';
      case 'occasionally': return 'amber';
      case 'regularly': return 'green';
      case 'frequently': return 'green';
      default: return 'amber';
    }
  }

  return 'amber';
} 