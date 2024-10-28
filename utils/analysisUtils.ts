import { AnswerType } from '@/types/Question'
import { ContextualAnalysis } from '@/types/ContextualAnalysis'

export function getContextualAnalysis(
  category: 'exercise' | 'wellbeing' | 'nutrition',
  answers: AnswerType
): ContextualAnalysis[] {
  const analyses: ContextualAnalysis[] = [];

  console.log(`Analyzing ${category} with answers:`, answers);

  switch (category) {
    case 'exercise':
      if (answers.exerciseIntensity === 'vigorous' && answers.recovery === 'poor') {
        analyses.push({
          warning: true,
          severity: 'warning',
          title: 'Exercise Intensity Warning',
          feedback: 'Your high-intensity training combined with poor recovery could lead to overtraining.',
          recommendations: [
            'Consider reducing training intensity temporarily',
            'Focus on sleep quality and nutrition',
            'Add more rest days between intense sessions'
          ]
        });
      }
      break;

    case 'wellbeing':
      if (answers.stress === 'very-high' && answers.sleepQuality === 'poor') {
        analyses.push({
          warning: true,
          severity: 'warning',
          title: 'Stress-Sleep Impact',
          feedback: 'High stress levels appear to be affecting your sleep quality.',
          recommendations: [
            'Consider stress management techniques',
            'Establish a calming bedtime routine',
            'Consider speaking with a mental health professional'
          ]
        });
      }
      break;

    case 'nutrition':
      if (answers.activityLevel === 'veryActive' && answers.mealFrequency === '1-2') {
        analyses.push({
          warning: true,
          severity: 'warning',
          title: 'Nutrition Timing Concern',
          feedback: 'Your meal frequency may not support your high activity level.',
          recommendations: [
            'Consider increasing meal frequency',
            'Focus on post-workout nutrition',
            'Plan meals around your training schedule'
          ]
        });
      }
      break;
  }

  console.log(`Analysis results for ${category}:`, analyses);
  return analyses;
}
