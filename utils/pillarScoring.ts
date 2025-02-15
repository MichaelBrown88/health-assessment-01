import type { 
  HealthPillar, 
  PillarScore, 
  BodyCompositionMetrics,
  HealthPillarScores,
  ExerciseMetrics,
  NutritionMetrics,
  RecoveryMetrics,
  MentalHealthMetrics
} from '@/types/scoring';
import type { AnswerType } from '@/types/Question';
import type { HealthCalculations } from '@/types/results';

// Calculate body composition score (20 points max)
function calculateBodyCompositionScore(metrics: BodyCompositionMetrics): PillarScore {
  let score = 0;
  const { bmi, bodyFat, gender, age } = metrics;

  // BMI scoring (max 8 points)
  if (bmi >= 18.5 && bmi < 25) {
    score += 8;
  } else if (bmi >= 25 && bmi < 27) {
    score += 6;
  } else if (bmi >= 27 && bmi < 30) {
    score += 4;
  } else {
    score += 2;
  }

  // Body fat scoring (max 12 points)
  if (bodyFat !== null) {
    const idealRanges = {
      male: { min: 10, max: 20 },
      female: { min: 18, max: 28 }
    };
    
    const range = gender === 'male' ? idealRanges.male : idealRanges.female;
    
    if (bodyFat >= range.min && bodyFat <= range.max) {
      score += 12;
    } else if (bodyFat < range.min + 3 || bodyFat > range.max - 3) {
      score += 8;
    } else if (bodyFat < range.min + 5 || bodyFat > range.max - 5) {
      score += 4;
    }
  } else {
    // If no body fat data, weight BMI more heavily
    if (bmi >= 18.5 && bmi < 25) {
      score += 6;
    } else if (bmi >= 25 && bmi < 27) {
      score += 4;
    }
  }

  return {
    score,
    label: "Body Composition",
    description: "Based on BMI, body fat percentage, and overall composition",
    color: getScoreColor(score),
    recommendations: getBodyCompositionRecommendations(score, metrics)
  };
}

// Helper function to get color based on score
function getScoreColor(score: number): string {
  if (score >= 16) return "emerald-500"; // 80%+
  if (score >= 12) return "yellow-500"; // 60%+
  return "red-500";
}

function getBodyCompositionRecommendations(score: number, metrics: BodyCompositionMetrics): string[] {
  const recommendations: string[] = [];
  const { bmi, bodyFat, gender } = metrics;

  // BMI-based recommendations
  if (bmi < 18.5) {
    recommendations.push("Focus on nutrient-dense foods to gain healthy weight");
    recommendations.push("Consider strength training to build muscle mass");
  } else if (bmi >= 25 && bmi < 30) {
    recommendations.push("Create a moderate caloric deficit through diet and exercise");
    recommendations.push("Focus on whole, unprocessed foods");
  } else if (bmi >= 30) {
    recommendations.push("Consult with a healthcare provider about weight management");
    recommendations.push("Start with low-impact exercises and gradually increase intensity");
  }

  // Body fat recommendations
  if (bodyFat !== null) {
    const maleRange = { min: 10, max: 20 };
    const femaleRange = { min: 18, max: 28 };
    const range = gender === 'male' ? maleRange : femaleRange;

    if (bodyFat > range.max) {
      recommendations.push("Focus on building lean muscle through resistance training");
      recommendations.push("Ensure adequate protein intake");
    } else if (bodyFat < range.min) {
      recommendations.push("Consider increasing healthy fat intake");
      recommendations.push("Monitor energy levels and recovery");
    }
  }

  // If score is good but could be better
  if (score >= 15 && score < 20) {
    recommendations.push("Maintain current healthy habits");
    recommendations.push("Consider fine-tuning nutrition and exercise for optimal results");
  }

  // If no specific recommendations were added
  if (recommendations.length === 0) {
    recommendations.push("Maintain your current healthy body composition");
    recommendations.push("Regular exercise and balanced nutrition will help sustain your progress");
  }

  return recommendations;
}

function calculateExerciseScore(answers: AnswerType): PillarScore {
  let score = 0;
  const scoreMap = {
    activityLevel: { sedentary: 2, light: 5, moderate: 8, active: 10, veryActive: 12 },
    exerciseIntensity: { light: 1, moderate: 2, vigorous: 4, "very-intense": 3 },
    exerciseDuration: { "less-than-30": 1, "30-45": 2, "45-60": 3, "60+": 4 }
  };

  // Activity Level (max 12 points)
  if (answers.activityLevel && typeof answers.activityLevel === 'string') {
    score += scoreMap.activityLevel[answers.activityLevel] || 0;
  }

  // Exercise Intensity (max 4 points)
  if (answers.exerciseIntensity && typeof answers.exerciseIntensity === 'string') {
    score += scoreMap.exerciseIntensity[answers.exerciseIntensity] || 0;
  }

  // Exercise Duration (max 4 points)
  if (answers.exerciseDuration && typeof answers.exerciseDuration === 'string') {
    score += scoreMap.exerciseDuration[answers.exerciseDuration] || 0;
  }

  return {
    score,
    label: "Exercise",
    description: "Based on activity level, exercise intensity, and duration",
    color: getScoreColor(score),
    recommendations: getExerciseRecommendations(score, answers)
  };
}

function calculateNutritionScore(answers: AnswerType): PillarScore {
  let score = 0;
  const scoreMap = {
    diet: { unhealthy: 0, average: 6, healthy: 10, "very-healthy": 12 },
    mealFrequency: { "1-2": 1, "3-4": 4, "5-6": 3, "more-than-6": 2 },
    lastMeal: { "less-than-2": 2, "2-4": 4, "4-6": 2, "more-than-6": 1, "after-10pm": 0 }
  };

  // Diet Quality (max 12 points)
  if (answers.diet && typeof answers.diet === 'string') {
    score += scoreMap.diet[answers.diet] || 0;
  }

  // Meal Frequency (max 4 points)
  if (answers.mealFrequency && typeof answers.mealFrequency === 'string') {
    score += scoreMap.mealFrequency[answers.mealFrequency] || 0;
  }

  // Last Meal Timing (max 4 points)
  if (answers.lastMeal && typeof answers.lastMeal === 'string') {
    score += scoreMap.lastMeal[answers.lastMeal] || 0;
  }

  return {
    score,
    label: "Nutrition",
    description: "Based on diet quality, meal timing, and frequency",
    color: getScoreColor(score),
    recommendations: getNutritionRecommendations(score, answers)
  };
}

function calculateRecoveryScore(answers: AnswerType): PillarScore {
  let score = 0;
  const scoreMap = {
    sleepDuration: { 
      "less-than-5": 0,
      "5-7": 5,
      "7-9": 10,
      "more-than-9": 7
    },
    sleepQuality: { poor: 0, fair: 3, good: 6, excellent: 8 },
    recovery: { poor: 0, fair: 2, good: 3, excellent: 4 }
  };

  // Sleep Duration (max 8 points)
  if (answers.sleepDuration && typeof answers.sleepDuration === 'string') {
    score += scoreMap.sleepDuration[answers.sleepDuration] || 0;
  }

  // Sleep Quality (max 8 points)
  if (answers.sleepQuality && typeof answers.sleepQuality === 'string') {
    score += scoreMap.sleepQuality[answers.sleepQuality] || 0;
  }

  // Recovery (max 4 points)
  if (answers.recovery && typeof answers.recovery === 'string') {
    score += scoreMap.recovery[answers.recovery] || 0;
  }

  return {
    score,
    label: "Recovery",
    description: "Based on sleep quality, duration, and recovery",
    color: getScoreColor(score),
    recommendations: getRecoveryRecommendations(score, answers)
  };
}

function calculateMentalHealthScore(answers: AnswerType): PillarScore {
  let score = 0;
  const scoreMap = {
    stress: { "very-high": 0, high: 2, moderate: 4, low: 6 },
    mentalHealth: { often: 0, sometimes: 2, rarely: 4, never: 6 },
    socializing: { rarely: 0, occasionally: 2, regularly: 4, frequently: 6 },
    workLifeBalance: { poor: 0, fair: 1, good: 1.5, excellent: 2 }
  };

  // Stress Levels (max 6 points)
  if (answers.stress && typeof answers.stress === 'string') {
    score += scoreMap.stress[answers.stress] || 0;
  }

  // Mental Health (max 6 points)
  if (answers.mentalHealth && typeof answers.mentalHealth === 'string') {
    score += scoreMap.mentalHealth[answers.mentalHealth] || 0;
  }

  // Social Activity (max 6 points)
  if (answers.socializing && typeof answers.socializing === 'string') {
    score += scoreMap.socializing[answers.socializing] || 0;
  }

  // Work-Life Balance (max 2 points)
  if (answers.workLifeBalance && typeof answers.workLifeBalance === 'string') {
    score += scoreMap.workLifeBalance[answers.workLifeBalance] || 0;
  }

  return {
    score,
    label: "Mental Health",
    description: "Based on stress, mental wellbeing, and social factors",
    color: getScoreColor(score),
    recommendations: getMentalHealthRecommendations(score, answers)
  };
}

// Recommendation generator functions
function getExerciseRecommendations(score: number, answers: AnswerType): string[] {
  const recommendations: string[] = [];
  
  if (score < 10) {
    recommendations.push("Start with light physical activity like walking");
    recommendations.push("Aim for 10-15 minutes of exercise, 3 times per week");
  } else if (score < 15) {
    recommendations.push("Gradually increase your activity level");
    recommendations.push("Mix cardio and strength training exercises");
  } else if (score < 18) {
    recommendations.push("Consider adding variety to your workouts");
    recommendations.push("Focus on progressive overload in your training");
  } else {
    recommendations.push("Maintain your excellent exercise routine");
    recommendations.push("Consider new challenges to prevent plateaus");
  }
  
  return recommendations;
}

function getNutritionRecommendations(score: number, answers: AnswerType): string[] {
  const recommendations: string[] = [];
  
  if (score < 10) {
    recommendations.push("Focus on eating more whole, unprocessed foods");
    recommendations.push("Establish regular meal times");
  } else if (score < 15) {
    recommendations.push("Increase protein and fiber intake");
    recommendations.push("Consider tracking your meals for better awareness");
  } else if (score < 18) {
    recommendations.push("Fine-tune your meal timing and portions");
    recommendations.push("Experiment with healthy meal prep strategies");
  } else {
    recommendations.push("Maintain your excellent nutrition habits");
    recommendations.push("Consider seasonal adjustments to your diet");
  }
  
  return recommendations;
}

function getRecoveryRecommendations(score: number, answers: AnswerType): string[] {
  const recommendations: string[] = [];
  
  if (score < 10) {
    recommendations.push("Prioritize getting at least 7 hours of sleep");
    recommendations.push("Create a consistent bedtime routine");
  } else if (score < 15) {
    recommendations.push("Focus on sleep quality improvements");
    recommendations.push("Consider relaxation techniques before bed");
  } else if (score < 18) {
    recommendations.push("Optimize your sleep environment");
    recommendations.push("Balance activity with adequate rest periods");
  } else {
    recommendations.push("Maintain your excellent recovery routine");
    recommendations.push("Monitor sleep quality during stressful periods");
  }
  
  return recommendations;
}

function getMentalHealthRecommendations(score: number, answers: AnswerType): string[] {
  const recommendations: string[] = [];
  
  if (score < 10) {
    recommendations.push("Consider speaking with a mental health professional");
    recommendations.push("Practice basic stress management techniques");
  } else if (score < 15) {
    recommendations.push("Incorporate regular mindfulness practices");
    recommendations.push("Build stronger social connections");
  } else if (score < 18) {
    recommendations.push("Maintain work-life balance");
    recommendations.push("Continue developing stress resilience");
  } else {
    recommendations.push("Share your positive mental health practices");
    recommendations.push("Stay mindful of early stress indicators");
  }
  
  return recommendations;
}

// Export the main functions directly where they're defined
export function calculateHealthScore(answers: AnswerType, healthCalculations: HealthCalculations): HealthPillarScores {
  return {
    bodyComposition: calculateBodyCompositionScore({
      bmi: healthCalculations.bmi || 0,
      bodyFat: healthCalculations.bodyFat,
      weight: Number(answers.weight),
      height: Number(answers.height),
      gender: String(answers.gender),
      age: Number(answers.age)
    }),
    exercise: calculateExerciseScore(answers),
    nutrition: calculateNutritionScore(answers),
    recovery: calculateRecoveryScore(answers),
    mentalHealth: calculateMentalHealthScore(answers)
  };
}

export function getOverallScore(pillarScores: HealthPillarScores): number {
  const totalScore = Object.values(pillarScores).reduce(
    (sum, pillar) => sum + pillar.score,
    0
  );
  return Math.round(totalScore);
} 