import type { AnswerType, HealthCalculations } from '@/types/health';

export function generateSummary(healthCalcs: HealthCalculations, answers?: AnswerType) {
  const strengths: string[] = [];
  const improvements: string[] = [];
  const nextSteps: string[] = [];

  // Add strengths based on scores and calculations
  if (healthCalcs.exerciseScore >= 70) {
    strengths.push('Strong activity level and exercise habits');
  }
  if (healthCalcs.nutritionScore >= 70) {
    strengths.push('Healthy eating habits and nutrition choices');
  }
  if (healthCalcs.sleepScore >= 70) {
    strengths.push('Good sleep quality and recovery patterns');
  }
  if (healthCalcs.wellbeingScore >= 70) {
    strengths.push('Effective stress management and mental wellbeing');
  }

  // Add improvements based on scores
  if (healthCalcs.exerciseScore < 60) {
    improvements.push('Increase daily activity level and structured exercise');
  }
  if (healthCalcs.nutritionScore < 60) {
    improvements.push('Improve nutrition and eating habits');
  }
  if (healthCalcs.sleepScore < 60) {
    improvements.push('Enhance sleep quality and recovery practices');
  }
  if (healthCalcs.wellbeingScore < 60) {
    improvements.push('Focus on stress management and mental wellbeing');
  }

  // Add next steps based on scores and current status
  if (healthCalcs.exerciseScore < 70) {
    nextSteps.push("Start with small, manageable increases in daily movement and activity.");
  }
  if (healthCalcs.nutritionScore < 70) {
    nextSteps.push("Focus on incorporating more whole, nutrient-rich foods into your meals.");
  }
  if (healthCalcs.sleepScore < 70) {
    nextSteps.push("Establish a consistent sleep schedule and bedtime routine.");
  }
  if (healthCalcs.wellbeingScore < 70) {
    nextSteps.push("Practice regular stress management techniques and prioritize mental health.");
  }

  // Add default next step if none were added
  if (nextSteps.length === 0) {
    nextSteps.push("Maintain your current healthy habits while looking for ways to optimize further.");
  }

  // Add tracking reminder
  nextSteps.push("Track your progress regularly and make adjustments based on the feedback in each section.");

  return {
    strengths: strengths.length > 0 ? strengths : ["Complete the assessment to identify your strengths"],
    improvements: improvements.length > 0 ? improvements : ["Complete the assessment to identify areas for improvement"],
    nextSteps
  };
}

interface StructuredSummaryInput {
  exercise: number;
  nutrition: number;
  sleep: number;
  mentalHealth: number;
  healthCalculations: HealthCalculations;
  answers: AnswerType;
}

export function generateStructuredSummary(input: StructuredSummaryInput) {
  const { exercise, nutrition, sleep, mentalHealth, healthCalculations, answers } = input;
  
  const sections = {
    exercise: {
      message: exercise >= 70 
        ? "Your exercise habits show a strong commitment to physical activity."
        : "There's room to enhance your exercise routine for better results.",
      recommendations: exercise >= 70 
        ? ["Maintain your consistent activity level", "Consider adding variety to your workouts", "Focus on proper form and recovery"]
        : ["Start with manageable increases in activity", "Find activities you enjoy", "Build a consistent routine"]
    },
    nutrition: {
      message: nutrition >= 70
        ? "Your nutrition habits support good health and energy levels."
        : "Improving your nutrition could enhance your overall wellbeing.",
      recommendations: nutrition >= 70
        ? ["Continue making balanced food choices", "Maintain meal timing consistency", "Stay hydrated throughout the day"]
        : ["Focus on whole, nutrient-rich foods", "Plan your meals ahead", "Monitor portion sizes"]
    },
    sleep: {
      message: sleep >= 70
        ? "Your sleep patterns support good recovery and energy levels."
        : "Enhancing your sleep quality could improve your overall health.",
      recommendations: sleep >= 70
        ? ["Maintain your consistent sleep schedule", "Continue good sleep hygiene", "Monitor energy levels"]
        : ["Establish a regular sleep schedule", "Create a relaxing bedtime routine", "Optimize your sleep environment"]
    },
    mentalHealth: {
      message: mentalHealth >= 70
        ? "Your mental wellbeing practices show good self-awareness."
        : "Supporting your mental health could enhance overall wellbeing.",
      recommendations: mentalHealth >= 70
        ? ["Continue stress management practices", "Maintain social connections", "Practice regular self-care"]
        : ["Develop stress management techniques", "Build a support system", "Consider professional guidance"]
    }
  };

  return sections;
}
