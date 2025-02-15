import type { AnswerType } from '@/types/assessment';

interface SleepFeedback {
  message: string;
  recommendations: string[];
  severity: 'info' | 'warning' | 'alert';
}

export function generateSleepFeedback(answers: AnswerType): SleepFeedback {
  const sleepDuration = answers.sleepDuration as string;
  
  switch (sleepDuration) {
    case 'less-than-5':
      return {
        message: "Your sleep duration is significantly below the recommended range, which can seriously impact your health and well-being.",
        recommendations: [
          "Prioritize getting more sleep by establishing a consistent bedtime routine",
          "Aim to gradually increase your sleep duration by 30 minutes each week",
          "Consider consulting a healthcare provider about your sleep patterns",
          "Avoid caffeine and screens in the hours before bedtime"
        ],
        severity: 'alert'
      };
      
    case '5-7':
      return {
        message: "You're getting less than the optimal amount of sleep, which may affect your performance and health.",
        recommendations: [
          "Try to add an extra 30-60 minutes to your sleep schedule",
          "Create a relaxing bedtime routine to help you fall asleep earlier",
          "Maintain consistent sleep and wake times, even on weekends",
          "Ensure your bedroom is dark, quiet, and cool for optimal sleep"
        ],
        severity: 'warning'
      };
      
    case '7-9':
      return {
        message: "You're getting the ideal amount of sleep, which is great for your overall health and well-being!",
        recommendations: [
          "Continue maintaining your healthy sleep schedule",
          "Focus on sleep quality by optimizing your sleep environment",
          "Consider tracking your sleep patterns to maintain consistency",
          "Pay attention to how refreshed you feel upon waking"
        ],
        severity: 'info'
      };
      
    case 'more-than-9':
      return {
        message: "While getting enough sleep is important, regularly sleeping more than 9 hours might indicate other health considerations.",
        recommendations: [
          "Consider if you're truly feeling refreshed after sleep",
          "Maintain a consistent sleep schedule rather than oversleeping",
          "Evaluate your sleep quality with a healthcare provider",
          "Track your energy levels throughout the day"
        ],
        severity: 'warning'
      };
      
    default:
      return {
        message: "We don't have enough information about your sleep patterns.",
        recommendations: [
          "Track your sleep duration for a few weeks",
          "Aim for 7-9 hours of sleep per night",
          "Establish a consistent sleep schedule"
        ],
        severity: 'info'
      };
  }
} 