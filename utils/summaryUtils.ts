interface FeedbackRule {
  condition: (score: number) => boolean;
  feedback: (score: number) => {
    score: number;
    message: string;
    recommendations: string[];
  };
}

interface HealthCalculations {
  bmi: number | null;
  bmiCategory: string | null;
  recommendedCalories: number | null;
  proteinGrams: number | null;
  carbGrams: number | null;
  fatGrams: number | null;
  idealWeightLow: number | null;
  idealWeightHigh: number | null;
}

const exerciseFeedback: FeedbackRule[] = [
  {
    condition: (score: number) => score >= 80,
    feedback: (score: number) => ({
      score,
      message: "Your exercise habits are excellent. You're maintaining a consistent and balanced routine.",
      recommendations: [
        "Consider adding variety to prevent plateaus",
        "Focus on recovery to maintain performance",
        "Set new challenging goals"
      ]
    })
  },
  {
    condition: (score: number) => score >= 60,
    feedback: (score: number) => ({
      score,
      message: "You have a good foundation for exercise, but there's room to increase intensity or frequency.",
      recommendations: [
        "Gradually increase workout intensity",
        "Add one more session per week",
        "Include both cardio and strength training"
      ]
    })
  },
  {
    condition: (score: number) => score < 60,
    feedback: (score: number) => ({
      score,
      message: "Your exercise routine needs attention. Consider establishing a regular workout schedule.",
      recommendations: [
        "Start with 2-3 sessions per week",
        "Begin with walking or light exercises",
        "Set realistic, achievable goals"
      ]
    })
  }
];

// Add similar arrays for other sections
const nutritionFeedback: FeedbackRule[] = [
  // ... nutrition feedback rules
];

const sleepFeedback: FeedbackRule[] = [
  // ... sleep feedback rules
];

const mentalHealthFeedback: FeedbackRule[] = [
  // ... mental health feedback rules
];

export function generateStructuredSummary(scores: {
  exercise: number;
  nutrition: number;
  sleep: number;
  mentalHealth: number;
  healthCalculations?: HealthCalculations;
}) {
  const summary = {
    exercise: exerciseFeedback.find(rule => rule.condition(scores.exercise))?.feedback(scores.exercise),
    nutrition: nutritionFeedback.find(rule => rule.condition(scores.nutrition))?.feedback(scores.nutrition),
    sleep: sleepFeedback.find(rule => rule.condition(scores.sleep))?.feedback(scores.sleep),
    mentalHealth: mentalHealthFeedback.find(rule => rule.condition(scores.mentalHealth))?.feedback(scores.mentalHealth),
    bodyComposition: scores.healthCalculations ? {
      score: scores.healthCalculations.bmi || 0,
      message: `Your BMI is ${scores.healthCalculations.bmi?.toFixed(1)} (${scores.healthCalculations.bmiCategory}). 
                To reach your goals, aim for ${scores.healthCalculations.recommendedCalories} calories per day with 
                ${scores.healthCalculations.proteinGrams}g protein, ${scores.healthCalculations.carbGrams}g carbs, 
                and ${scores.healthCalculations.fatGrams}g healthy fats.`,
      recommendations: [
        `Target weight range: ${scores.healthCalculations.idealWeightLow?.toFixed(1)} - ${scores.healthCalculations.idealWeightHigh?.toFixed(1)} kg`,
        `Daily calorie target: ${scores.healthCalculations.recommendedCalories} calories`,
        `Macronutrient split: ${scores.healthCalculations.proteinGrams}g protein, ${scores.healthCalculations.carbGrams}g carbs, ${scores.healthCalculations.fatGrams}g fats`
      ]
    } : null
  };

  return summary;
}
