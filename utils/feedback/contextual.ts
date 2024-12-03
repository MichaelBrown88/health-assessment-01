import type { AnswerType } from '@/types/results';
import type { ContextualAnalysis } from '@/types/feedback';

export function getContextualAnalyses(section: string, answers: AnswerType): ContextualAnalysis[] {
  const analyses: ContextualAnalysis[] = [];

  switch (section) {
    case 'Exercise':
      // Recovery + Exercise Intensity combinations
      if (answers.exerciseIntensity === 'vigorous' && answers.recovery === 'poor') {
        analyses.push({
          severity: 'warning',
          title: 'Recovery-Exercise Balance',
          description: 'Your high-intensity exercise combined with poor recovery significantly increases injury risk.',
          recommendations: [
            'Reduce workout intensity until recovery improves',
            'Add extra rest days between intense sessions',
            'Focus on proper warm-up and cool-down routines'
          ]
        });
      } else if (answers.exerciseIntensity === 'vigorous' && answers.recovery === 'fair') {
        analyses.push({
          severity: 'info',
          title: 'Recovery Attention Needed',
          description: 'While your recovery is fair, high-intensity exercise may require additional recovery focus.',
          recommendations: [
            'Consider adding extra rest days between intense sessions',
            'Implement proper post-workout recovery techniques',
            'Monitor your fatigue levels closely'
          ]
        });
      }

      // Exercise Type + Recovery
      if (answers.exerciseType?.includes('strength') && answers.recovery === 'poor') {
        analyses.push({
          severity: 'warning',
          title: 'Strength Training Recovery',
          description: 'Poor recovery with strength training increases injury risk and limits progress.',
          recommendations: [
            'Ensure 48 hours between strength sessions for same muscle groups',
            'Focus on proper form and technique',
            'Consider splitting workouts by muscle groups'
          ]
        });
      }

      // Exercise Duration + Intensity + Recovery
      if (answers.exerciseDuration === '60+' && 
          answers.exerciseIntensity === 'vigorous' && 
          answers.recovery === 'fair') {
        analyses.push({
          severity: 'info',
          title: 'Workout Load Management',
          description: 'Long, intense workouts with moderate recovery may need adjustment.',
          recommendations: [
            'Consider shorter, more focused sessions',
            'Alternate intensity levels',
            'Monitor fatigue and performance'
          ]
        });
      }

      // Activity Level + Exercise Intensity
      if (answers.activityLevel === 'light' && answers.exerciseIntensity === 'very-intense') {
        analyses.push({
          severity: 'warning',
          title: 'Exercise Progression',
          description: 'Your exercise intensity may be too high for your current activity level.',
          recommendations: [
            'Start with moderate intensity exercises',
            'Build base fitness gradually',
            'Focus on proper form and technique'
          ]
        });
      }

      // Sleep + Exercise Intensity
      if (answers.sleepDuration === 'less-than-6' && answers.exerciseIntensity === 'vigorous') {
        analyses.push({
          severity: 'warning',
          title: 'Sleep-Exercise Balance',
          description: 'High-intensity exercise with limited sleep significantly impacts recovery and performance.',
          recommendations: [
            'Prioritize getting at least 7 hours of sleep',
            'Consider reducing exercise intensity temporarily',
            'Focus on sleep hygiene and consistent bedtime'
          ]
        });
      }
      break;

    case 'Diet & Nutrition':
      // Carb + Exercise combinations
      if (answers.carbPreference === 'low-carb') {
        if (answers.exerciseIntensity === 'vigorous' || answers.exerciseDuration === '60+') {
          analyses.push({
            severity: 'info',
            title: 'Carb Intake for Exercise',
            description: 'While low-carb diets can be healthy, your exercise intensity/duration might benefit from more carbs.',
            recommendations: [
              'Consider adding carbs around your workout times',
              'Monitor energy levels during exercise',
              'Try carb cycling (more carbs on intense workout days)'
            ]
          });
        }
      }

      // Meal Timing + Sleep
      if (answers.lastMeal === 'after-10pm' && answers.sleepQuality === 'poor') {
        analyses.push({
          severity: 'warning',
          title: 'Late Night Eating Impact',
          description: 'Late night eating appears to significantly affect your sleep quality.',
          recommendations: [
            'Have your last meal at least 3 hours before bedtime',
            'Choose lighter dinner options',
            'Consider earlier dinner times'
          ]
        });
      } else if (answers.lastMeal === 'after-10pm' && answers.sleepQuality === 'fair') {
        analyses.push({
          severity: 'info',
          title: 'Meal Timing Consideration',
          description: 'Your late meals might be affecting sleep quality.',
          recommendations: [
            'Try to eat dinner earlier when possible',
            'Avoid heavy meals close to bedtime',
            'Monitor how different meal times affect your sleep'
          ]
        });
      }

      // Meal Frequency + Activity Level
      if (answers.mealFrequency === '1-2' && answers.activityLevel === 'moderate') {
        analyses.push({
          severity: 'info',
          title: 'Meal Timing for Activity',
          description: 'More frequent meals could better support your activity level.',
          recommendations: [
            'Add pre and post-workout snacks',
            'Space meals evenly throughout the day',
            'Include protein with each meal'
          ]
        });
      }

      // Diet Quality + Activity Level
      if (answers.diet === 'unhealthy' && answers.activityLevel === 'moderate') {
        analyses.push({
          severity: 'warning',
          title: 'Nutrition Support for Activity',
          description: 'Your current diet may not adequately support your activity level.',
          recommendations: [
            'Focus on whole, nutrient-dense foods',
            'Include protein with each meal',
            'Add more fruits and vegetables to your diet'
          ]
        });
      }
      break;

    case 'Rest & Recovery':
      // Sleep Duration + Quality + Exercise
      if (answers.sleepDuration === 'less-than-6' && 
          answers.exerciseIntensity === 'vigorous' && 
          answers.recovery === 'fair') {
        analyses.push({
          severity: 'warning',
          title: 'Recovery Risk Factors',
          description: 'Multiple factors are affecting your recovery capacity.',
          recommendations: [
            'Prioritize sleep improvement first',
            'Temporarily reduce exercise intensity',
            'Focus on recovery techniques'
          ]
        });
      }

      // Sleep Quality + Stress + Exercise
      if (answers.sleepQuality === 'fair' && 
          answers.stress === 'high' && 
          answers.exerciseIntensity === 'vigorous') {
        analyses.push({
          severity: 'warning',
          title: 'Stress-Exercise Balance',
          description: 'High stress and moderate sleep quality may impact exercise recovery.',
          recommendations: [
            'Consider stress management techniques',
            'Adjust workout intensity based on stress levels',
            'Prioritize sleep quality improvement'
          ]
        });
      }

      // Basic Sleep Combinations
      if (answers.sleepDuration === 'less-than-6' && answers.sleepQuality === 'poor') {
        analyses.push({
          severity: 'warning',
          title: 'Sleep Optimization Priority',
          description: 'Both sleep duration and quality need immediate attention.',
          recommendations: [
            'Establish a consistent sleep schedule',
            'Create a relaxing bedtime routine',
            'Aim for 7-8 hours of sleep nightly'
          ]
        });
      } else if (answers.sleepDuration === '6-7' && answers.sleepQuality === 'fair') {
        analyses.push({
          severity: 'info',
          title: 'Sleep Enhancement',
          description: 'While you are getting some rest, there is room to improve both sleep duration and quality.',
          recommendations: [
            'Try to add 30-60 minutes to your sleep duration',
            'Improve sleep environment (dark, quiet, cool)',
            'Limit screen time before bed'
          ]
        });
      }
      break;

    case 'Mental Health':
      // Severe Mental Health Warning
      if (answers.mentalHealth === 'often' && answers.stress === 'very-high') {
        analyses.push({
          severity: 'warning',
          title: 'Mental Health Priority Alert',
          description: 'Your responses indicate significant mental health challenges that need attention.',
          recommendations: [
            'Consider speaking with a mental health professional',
            'Reach out to trusted friends or family for support',
            'Focus on basic self-care routines'
          ]
        });
      }

      // Mental Health + Physical Activity
      if (answers.mentalHealth === 'often' && answers.activityLevel === 'sedentary') {
        analyses.push({
          severity: 'warning',
          title: 'Movement for Mental Health',
          description: 'Low physical activity may be contributing to mental health challenges.',
          recommendations: [
            'Start with short daily walks',
            'Try gentle exercises like yoga or stretching',
            'Consider outdoor activities for natural light exposure'
          ]
        });
      }

      // Mental Health + Diet + Sleep
      if (answers.mentalHealth === 'often' && 
          answers.diet === 'unhealthy' && 
          answers.sleepQuality === 'poor') {
        analyses.push({
          severity: 'warning',
          title: 'Lifestyle Impact on Mental Health',
          description: 'Poor nutrition and sleep patterns may be affecting your mental wellbeing.',
          recommendations: [
            'Focus on regular, balanced meals',
            'Establish a consistent sleep schedule',
            'Consider speaking with a healthcare provider about these challenges'
          ]
        });
      }

      // Social Isolation + Mental Health
      if (answers.mentalHealth === 'often' && answers.socializing === 'rarely') {
        analyses.push({
          severity: 'warning',
          title: 'Social Connection',
          description: 'Limited social interaction may be impacting your mental wellbeing.',
          recommendations: [
            'Start with small social interactions',
            'Consider joining support groups or community activities',
            'Stay connected with friends/family through calls or messages'
          ]
        });
      }

      // Stress + Work-Life Balance
      if (answers.stress === 'very-high' && answers.workLife === 'poor') {
        analyses.push({
          severity: 'warning',
          title: 'Work-Life Stress Impact',
          description: 'High stress levels and poor work-life balance need attention.',
          recommendations: [
            'Set clear boundaries between work and personal time',
            'Take regular breaks during work hours',
            'Practice stress management techniques'
          ]
        });
      }

      // Recovery + Mental Health
      if (answers.mentalHealth === 'often' && answers.recovery === 'poor') {
        analyses.push({
          severity: 'warning',
          title: 'Recovery and Mental Wellbeing',
          description: 'Poor recovery may be affecting your mental health, or vice versa.',
          recommendations: [
            'Prioritize rest and relaxation',
            'Consider mindfulness or meditation practices',
            'Create a calming evening routine'
          ]
        });
      }

      // Exercise + Mental Health (Positive reinforcement)
      if (answers.mentalHealth === 'sometimes' && 
          answers.exerciseFrequency === '3-4' && 
          answers.exerciseType?.includes('cardio')) {
        analyses.push({
          severity: 'info',
          title: 'Exercise Benefits',
          description: 'Your regular cardio exercise is a great tool for managing mental health.',
          recommendations: [
            'Continue your exercise routine',
            'Consider adding variety to your workouts',
            'Track how different activities affect your mood'
          ]
        });
      }

      // Multiple Lifestyle Factors
      if (answers.mentalHealth === 'often' && 
          answers.sleepQuality === 'poor' && 
          answers.stress === 'very-high' && 
          answers.socializing === 'rarely') {
        analyses.push({
          severity: 'warning',
          title: 'Multiple Health Factors',
          description: 'Several lifestyle factors are potentially affecting your mental wellbeing.',
          recommendations: [
            'Start with improving one area at a time',
            'Consider professional support for guidance',
            'Focus on establishing basic self-care routines'
          ]
        });
      }
      break;
  }

  return analyses;
} 