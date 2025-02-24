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
import { calculateScore } from './scoring';

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
    activityLevel: { 
      sedentary: 2, 
      light: 5, 
      moderate: 8, 
      active: 10, 
      veryActive: 12 
    },
    exerciseIntensity: { 
      light: 2, 
      moderate: 4, 
      vigorous: 6, 
      "very-intense": 5 
    },
    exerciseDuration: { 
      "less-than-30": 2, 
      "30-45": 4, 
      "45-60": 6, 
      "60+": 5 
    }
  };

  // Activity Level (max 12 points)
  if (answers.activityLevel && typeof answers.activityLevel === 'string') {
    score += scoreMap.activityLevel[answers.activityLevel] || 0;
  }

  // Exercise Intensity (max 6 points)
  if (answers.exerciseIntensity && typeof answers.exerciseIntensity === 'string') {
    score += scoreMap.exerciseIntensity[answers.exerciseIntensity] || 0;
  }

  // Exercise Duration (max 6 points)
  if (answers.exerciseDuration && typeof answers.exerciseDuration === 'string') {
    score += scoreMap.exerciseDuration[answers.exerciseDuration] || 0;
  }

  // Exercise Type (max 6 points)
  if (Array.isArray(answers.exerciseType)) {
    const types = answers.exerciseType as string[];
    score += Math.min(6, types.length * 2); // 2 points per type, max 6 points
  }

  return {
    score: Math.min(30, score), // Cap at 30 points
    label: "Exercise",
    description: "Based on activity level, exercise intensity, duration, and type",
    color: getScoreColor(score),
    recommendations: getExerciseRecommendations(score, answers)
  };
}

function calculateNutritionScore(answers: AnswerType): PillarScore {
  let score = 0;
  const scoreMap = {
    diet: { 
      unhealthy: 0, 
      average: 8, 
      healthy: 12, 
      "very-healthy": 15 
    },
    mealFrequency: { 
      "1-2": 2, 
      "3-4": 5, 
      "5+": 4 
    },
    lastMeal: { 
      "before-6pm": 5, 
      "6pm-8pm": 5, 
      "8pm-10pm": 3, 
      "after-10pm": 1 
    }
  };

  // Diet Quality (max 15 points)
  if (answers.diet && typeof answers.diet === 'string') {
    score += scoreMap.diet[answers.diet] || 0;
  }

  // Meal Frequency (max 5 points)
  if (answers.mealFrequency && typeof answers.mealFrequency === 'string') {
    score += scoreMap.mealFrequency[answers.mealFrequency] || 0;
  }

  // Last Meal Timing (max 5 points)
  if (answers.lastMeal && typeof answers.lastMeal === 'string') {
    score += scoreMap.lastMeal[answers.lastMeal] || 0;
  }

  // Goals alignment (max 5 points)
  if (Array.isArray(answers.goals)) {
    const hasNutritionGoals = answers.goals.some(goal => 
      ['weight-loss', 'muscle-gain', 'overall-health'].includes(goal)
    );
    if (hasNutritionGoals) score += 5;
  }

  return {
    score: Math.min(30, score), // Cap at 30 points
    label: "Nutrition",
    description: "Based on diet quality, meal timing, and eating patterns",
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
    sleepQuality: { 
      poor: 0, 
      fair: 4, 
      good: 7, 
      excellent: 10 
    },
    recovery: { 
      poor: 0, 
      fair: 3, 
      good: 7, 
      excellent: 10 
    }
  };

  // Sleep Duration (max 10 points)
  if (answers.sleepDuration && typeof answers.sleepDuration === 'string') {
    score += scoreMap.sleepDuration[answers.sleepDuration] || 0;
  }

  // Sleep Quality (max 10 points)
  if (answers.sleepQuality && typeof answers.sleepQuality === 'string') {
    score += scoreMap.sleepQuality[answers.sleepQuality] || 0;
  }

  // Recovery (max 10 points)
  if (answers.recovery && typeof answers.recovery === 'string') {
    score += scoreMap.recovery[answers.recovery] || 0;
  }

  return {
    score: Math.min(30, score), // Cap at 30 points
    label: "Recovery",
    description: "Based on sleep quality, duration, and physical recovery",
    color: getScoreColor(score),
    recommendations: getRecoveryRecommendations(score, answers)
  };
}

function calculateMentalHealthScore(answers: AnswerType): PillarScore {
  let score = 0;
  const scoreMap = {
    stress: { 
      "very-high": 0, 
      high: 3, 
      moderate: 6, 
      low: 10 
    },
    mentalHealth: { 
      often: 0, 
      sometimes: 3, 
      rarely: 6, 
      never: 10 
    },
    socializing: { 
      rarely: 0, 
      occasionally: 3, 
      regularly: 7, 
      frequently: 10 
    }
  };

  // Stress Levels (max 10 points)
  if (answers.stress && typeof answers.stress === 'string') {
    score += scoreMap.stress[answers.stress] || 0;
  }

  // Mental Health (max 10 points)
  if (answers.mentalHealth && typeof answers.mentalHealth === 'string') {
    score += scoreMap.mentalHealth[answers.mentalHealth] || 0;
  }

  // Social Activity (max 10 points)
  if (answers.socializing && typeof answers.socializing === 'string') {
    score += scoreMap.socializing[answers.socializing] || 0;
  }

  return {
    score: Math.min(30, score), // Cap at 30 points
    label: "Mental Health",
    description: "Based on stress levels, emotional well-being, and social connection",
    color: getScoreColor(score),
    recommendations: getMentalHealthRecommendations(score, answers)
  };
}

// Recommendation generator functions
function getExerciseRecommendations(score: number, answers: AnswerType): string[] {
  const recommendations: string[] = [];
  
  // Activity Level Recommendations
  if (answers.activityLevel === 'sedentary') {
    recommendations.push("Start with daily walks and light physical activity");
    recommendations.push("Aim to break up long periods of sitting with movement breaks");
  } else if (answers.activityLevel === 'light') {
    recommendations.push("Gradually increase your activity to 3-4 days per week");
    recommendations.push("Consider adding structured exercise to your routine");
  }

  // Exercise Intensity Recommendations
  if (answers.exerciseIntensity === 'light') {
    recommendations.push("Gradually incorporate more moderate-intensity exercises");
    recommendations.push("Try interval training to safely increase intensity");
  } else if (answers.exerciseIntensity === 'very-intense') {
    recommendations.push("Ensure adequate recovery between intense workouts");
    recommendations.push("Mix high-intensity days with lighter recovery sessions");
  }

  // Exercise Duration Recommendations
  if (answers.exerciseDuration === 'less-than-30') {
    recommendations.push("Aim to gradually increase workout duration to 30-45 minutes");
    recommendations.push("Break up exercise into multiple shorter sessions if needed");
  }

  // Exercise Type Recommendations
  if (Array.isArray(answers.exerciseType)) {
    const types = answers.exerciseType as string[];
    if (!types.includes('strength')) {
      recommendations.push("Consider adding strength training to your routine");
    }
    if (!types.includes('cardio')) {
      recommendations.push("Include some cardiovascular exercise for heart health");
    }
    if (!types.includes('flexibility')) {
      recommendations.push("Add flexibility work to improve mobility and prevent injury");
    }
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}

function getNutritionRecommendations(score: number, answers: AnswerType): string[] {
  const recommendations: string[] = [];

  // Diet Quality Recommendations
  if (answers.diet === 'unhealthy') {
    recommendations.push("Focus on incorporating more whole, unprocessed foods");
    recommendations.push("Increase fruit and vegetable intake");
  } else if (answers.diet === 'average') {
    recommendations.push("Gradually replace processed foods with whole food alternatives");
    recommendations.push("Plan meals ahead to ensure balanced nutrition");
  }

  // Meal Frequency Recommendations
  if (answers.mealFrequency === '1-2') {
    recommendations.push("Consider eating smaller, more frequent meals throughout the day");
    recommendations.push("Ensure adequate calorie intake across your meals");
  } else if (answers.mealFrequency === '5+') {
    recommendations.push("Monitor portion sizes to maintain healthy total calorie intake");
  }

  // Meal Timing Recommendations
  if (answers.lastMeal === 'after-10pm') {
    recommendations.push("Try to eat your last meal at least 2-3 hours before bedtime");
    recommendations.push("Plan earlier dinner times to improve sleep quality");
  }

  // Goals-based Recommendations
  if (Array.isArray(answers.goals)) {
    if (answers.goals.includes('weight-loss')) {
      recommendations.push("Focus on portion control and nutrient-dense foods");
    }
    if (answers.goals.includes('muscle-gain')) {
      recommendations.push("Ensure adequate protein intake with each meal");
    }
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}

function getRecoveryRecommendations(score: number, answers: AnswerType): string[] {
  const recommendations: string[] = [];

  // Sleep Duration Recommendations
  if (answers.sleepDuration === 'less-than-5') {
    recommendations.push("Prioritize getting more sleep - aim for at least 7 hours");
    recommendations.push("Establish a consistent bedtime routine");
  } else if (answers.sleepDuration === '5-7') {
    recommendations.push("Try to add an extra 30-60 minutes to your sleep duration");
    recommendations.push("Maintain consistent sleep and wake times");
  } else if (answers.sleepDuration === 'more-than-9') {
    recommendations.push("Assess your sleep quality and energy levels");
    recommendations.push("Consider adjusting your sleep schedule if feeling groggy");
  }

  // Sleep Quality Recommendations
  if (answers.sleepQuality === 'poor') {
    recommendations.push("Create a dark, quiet, and cool sleep environment");
    recommendations.push("Avoid screens and stimulating activities before bed");
  } else if (answers.sleepQuality === 'fair') {
    recommendations.push("Establish a relaxing pre-sleep routine");
    recommendations.push("Consider factors that might be disrupting your sleep");
  }

  // Recovery Recommendations
  if (answers.recovery === 'poor') {
    recommendations.push("Include dedicated rest days in your exercise routine");
    recommendations.push("Focus on proper post-exercise nutrition and hydration");
  } else if (answers.recovery === 'fair') {
    recommendations.push("Implement active recovery techniques like light stretching");
    recommendations.push("Monitor your exercise intensity and rest intervals");
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}

function getMentalHealthRecommendations(score: number, answers: AnswerType): string[] {
  const recommendations: string[] = [];

  // Stress Level Recommendations
  if (answers.stress === 'very-high' || answers.stress === 'high') {
    recommendations.push("Consider stress-reduction techniques like meditation or deep breathing");
    recommendations.push("Identify and address major sources of stress in your life");
  } else if (answers.stress === 'moderate') {
    recommendations.push("Practice regular stress management techniques");
    recommendations.push("Build in regular breaks and relaxation time");
  }

  // Mental Health Recommendations
  if (answers.mentalHealth === 'often') {
    recommendations.push("Consider speaking with a mental health professional");
    recommendations.push("Develop coping strategies for anxiety and low mood");
  } else if (answers.mentalHealth === 'sometimes') {
    recommendations.push("Practice self-care and emotional awareness");
    recommendations.push("Establish a support system for challenging times");
  }

  // Social Activity Recommendations
  if (answers.socializing === 'rarely') {
    recommendations.push("Try to increase social connections, even if virtually");
    recommendations.push("Join groups or activities aligned with your interests");
  } else if (answers.socializing === 'occasionally') {
    recommendations.push("Schedule regular social activities with friends or family");
    recommendations.push("Look for opportunities to expand your social network");
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}

// Export the main functions directly where they're defined
export function calculateHealthScore(answers: AnswerType, healthCalculations: HealthCalculations): HealthPillarScores {
  const scores = {
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

  // Ensure each pillar score is capped at 30
  Object.keys(scores).forEach(key => {
    scores[key as keyof HealthPillarScores].score = Math.min(30, scores[key as keyof HealthPillarScores].score);
  });

  return scores;
}

export function getOverallScore(pillarScores: HealthPillarScores): number {
  // Convert pillar scores to health calculations format
  const healthCalculations = {
    exerciseScore: pillarScores.exercise.score * (100/30),
    nutritionScore: pillarScores.nutrition.score * (100/30),
    mentalHealthScore: pillarScores.mentalHealth.score * (100/30),
    sleepScore: pillarScores.recovery.score * (100/30),
    bmi: null
  };

  return calculateScore({}, healthCalculations);
} 