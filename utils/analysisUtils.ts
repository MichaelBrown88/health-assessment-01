import { AnswerType } from '@/types/Question'
import { ContextualAnalysis } from '@/types/ContextualAnalysis'
import { HealthCalculations } from '@/types/results'

export function getContextualAnalysis(
  category: 'exercise' | 'mental-health' | 'nutrition' | 'body-composition',
  answers: AnswerType,
  healthCalculations?: HealthCalculations
): ContextualAnalysis[] {
  const analyses: ContextualAnalysis[] = [];

  console.log(`Analyzing ${category} with answers:`, answers);

  switch (category) {
    case 'body-composition':
      if (healthCalculations) {
        // Underweight trying to lose weight
        if (healthCalculations.bmiCategory === 'Underweight' && 
            Array.isArray(answers.goals) && 
            answers.goals.includes('weight-loss')) {
          analyses.push({
            warning: true,
            severity: 'alert',
            title: 'Weight Loss Goal Warning',
            feedback: 'Weight loss may not be appropriate given your current BMI.',
            recommendations: [
              'Consider focusing on building lean mass instead',
              'Consult with a healthcare provider about healthy weight goals',
              'Focus on nutrient-dense foods to support health'
            ]
          });
        }

        // Very low body fat with weight loss goal
        if (healthCalculations.bodyFat !== null && 
            Array.isArray(answers.goals) && 
            answers.goals.includes('weight-loss') &&
            ((answers.gender === 'male' && healthCalculations.bodyFat < 8) || 
             (answers.gender === 'female' && healthCalculations.bodyFat < 15))) {
          analyses.push({
            warning: true,
            severity: 'alert',
            title: 'Body Fat Warning',
            feedback: 'Your body fat percentage is already quite low. Further reduction could be harmful.',
            recommendations: [
              'Consider maintaining current body composition',
              'Focus on performance goals instead of weight loss',
              'Ensure adequate nutrition for health'
            ]
          });
        }
      }
      break;

    case 'exercise':
      // High intensity with poor recovery
      if (answers.exerciseIntensity === 'vigorous' && answers.recovery === 'poor') {
        analyses.push({
          warning: true,
          severity: 'warning',
          title: 'Exercise Recovery Warning',
          feedback: 'High-intensity training combined with poor recovery increases injury risk.',
          recommendations: [
            'Reduce training intensity temporarily',
            'Focus on sleep quality and nutrition',
            'Add more rest days between intense sessions'
          ]
        });
      }

      // Sedentary with high-intensity goals
      if (answers.activityLevel === 'sedentary' && 
          answers.exerciseIntensity === 'vigorous') {
        analyses.push({
          warning: true,
          severity: 'warning',
          title: 'Exercise Progression Warning',
          feedback: 'Starting intense exercise from a sedentary lifestyle increases injury risk.',
          recommendations: [
            'Start with lower intensity activities',
            'Build base fitness gradually',
            'Consider working with a fitness professional'
          ]
        });
      }
      break;

    case 'mental-health':
      // High stress with poor sleep
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

      // High stress with intense exercise
      if (answers.stress === 'very-high' && 
          answers.exerciseIntensity === 'vigorous') {
        analyses.push({
          warning: true,
          severity: 'warning',
          title: 'Stress-Exercise Impact',
          feedback: 'High stress combined with intense exercise may impair recovery.',
          recommendations: [
            'Consider reducing exercise intensity temporarily',
            'Focus on stress management',
            'Ensure adequate recovery between sessions'
          ]
        });
      }
      break;

    case 'nutrition':
      // Poor diet with high-intensity training
      if (answers.dietQuality === 'poor' && 
          answers.exerciseIntensity === 'vigorous') {
        analyses.push({
          warning: true,
          severity: 'warning',
          title: 'Nutrition-Exercise Mismatch',
          feedback: 'Your current diet may not support your exercise intensity.',
          recommendations: [
            'Focus on nutrient-rich foods',
            'Ensure adequate protein intake',
            'Consider working with a nutrition professional'
          ]
        });
      }

      // Late eating with sleep issues
      if (answers.lastMeal === 'after-10pm' && 
          answers.sleepQuality === 'poor') {
        analyses.push({
          warning: true,
          severity: 'warning',
          title: 'Meal Timing Impact',
          feedback: 'Late meals may be affecting your sleep quality.',
          recommendations: [
            'Try to eat dinner earlier',
            'Allow 2-3 hours between dinner and bedtime',
            'Consider lighter evening meals'
          ]
        });
      }
      break;
  }

  console.log(`Analysis results for ${category}:`, analyses);
  return analyses;
}
