import type { HealthCalculations } from '@/types/results'
import type { SectionFeedback } from '@/types/summary'

interface SummaryInput {
  exercise: number
  nutrition: number
  sleep: number
  mentalHealth: number
  healthCalculations: HealthCalculations
}

interface StructuredSummary {
  strengths?: SectionFeedback
  improvements?: SectionFeedback
  bodyComposition?: SectionFeedback
  exercise?: SectionFeedback
  nutrition?: SectionFeedback
  sleep?: SectionFeedback
  mentalHealth?: SectionFeedback
}

export function generateStructuredSummary(data: SummaryInput): StructuredSummary {
  const summary: StructuredSummary = {};
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Analyze Exercise
  if (data.exercise >= 80) {
    strengths.push("Exercise habits are excellent");
  } else if (data.exercise < 60) {
    improvements.push("Exercise routine needs attention");
  }

  // Analyze Nutrition
  if (data.nutrition >= 80) {
    strengths.push("Nutrition habits are optimal");
  } else if (data.nutrition < 60) {
    improvements.push("Dietary habits need improvement");
  }

  // Analyze Sleep
  if (data.sleep >= 80) {
    strengths.push("Sleep habits support optimal recovery");
  } else if (data.sleep < 60) {
    improvements.push("Sleep quality needs attention");
  }

  // Analyze Mental Health
  if (data.mentalHealth >= 80) {
    strengths.push("Mental wellbeing is well-maintained");
  } else if (data.mentalHealth < 60) {
    improvements.push("Mental wellbeing needs focus");
  }

  // Add strengths section if any exist
  if (strengths.length > 0) {
    summary.strengths = {
      message: "Your areas of strength:",
      recommendations: strengths.map(strength => `✓ ${strength}`)
    };
  }

  // Add improvements section if any exist
  if (improvements.length > 0) {
    summary.improvements = {
      message: "Areas that need attention:",
      recommendations: improvements.map(improvement => `! ${improvement}`)
    };
  }

  // Body Composition feedback
  if (data.healthCalculations?.bmi) {
    summary.bodyComposition = {
      message: generateBodyCompositionMessage(data.healthCalculations),
      recommendations: generateBodyCompositionRecommendations(data.healthCalculations)
    };
  }

  // Exercise feedback
  if (data.exercise !== undefined) {
    summary.exercise = {
      message: generateExerciseFeedback(data.exercise),
      recommendations: generateExerciseRecommendations(data.exercise)
    };
  }

  // Nutrition feedback
  if (data.nutrition !== undefined) {
    summary.nutrition = {
      message: generateNutritionFeedback(data.nutrition),
      recommendations: generateNutritionRecommendations(data.nutrition)
    };
  }

  // Sleep feedback
  if (data.sleep !== undefined) {
    summary.sleep = {
      message: generateSleepFeedback(data.sleep),
      recommendations: generateSleepRecommendations(data.sleep)
    };
  }

  // Mental Health feedback
  if (data.mentalHealth !== undefined) {
    summary.mentalHealth = {
      message: generateMentalHealthFeedback(data.mentalHealth),
      recommendations: generateMentalHealthRecommendations(data.mentalHealth)
    };
  }

  return summary;
}

function generateBodyCompositionMessage(healthCalcs: HealthCalculations): string {
  const { bmiCategory, bodyFat, gender } = healthCalcs;
  
  if (bodyFat !== null) {
    const idealRanges = {
      male: { min: 10, max: 20 },
      female: { min: 18, max: 28 }
    };
    const range = gender === 'male' ? idealRanges.male : idealRanges.female;
    
    if (bodyFat >= range.min && bodyFat <= range.max) {
      return "Your body composition is within a healthy range.";
    } else if (bodyFat < range.min) {
      return "Your body fat percentage is below the recommended range.";
    } else {
      return "Your body fat percentage is above the recommended range.";
    }
  }
  
  // If no body fat data, use BMI
  switch(bmiCategory) {
    case "Underweight":
      return "Your BMI indicates you may be underweight.";
    case "Normal":
      return "Your BMI is within a healthy range.";
    case "Overweight":
      return "Your BMI indicates you may be overweight.";
    case "Obese":
      return "Your BMI indicates obesity. Consider consulting a healthcare provider.";
    default:
      return "Body composition data incomplete.";
  }
}

function generateExerciseFeedback(score: number): string {
  if (score >= 80) return "Your exercise habits are excellent and support optimal health.";
  if (score >= 60) return "Your exercise routine is good but has room for improvement.";
  return "Your exercise habits need attention to better support your health.";
}

function generateNutritionFeedback(score: number): string {
  if (score >= 80) return "Your nutrition habits support optimal health and performance.";
  if (score >= 60) return "Your diet is generally healthy but could be optimized further.";
  return "Your nutrition needs attention to better support your health goals.";
}

function generateSleepFeedback(score: number): string {
  if (score >= 80) return "Your sleep habits support optimal recovery and health.";
  if (score >= 60) return "Your sleep is adequate but could be improved.";
  return "Your sleep habits need attention to support better recovery.";
}

function generateMentalHealthFeedback(score: number): string {
  if (score >= 80) return "Your mental wellbeing practices support optimal health.";
  if (score >= 60) return "Your mental health is generally good but could be strengthened.";
  return "Your mental wellbeing needs attention for better overall health.";
}

function generateBodyCompositionRecommendations(healthCalcs: HealthCalculations): string[] {
  const { bmiCategory, bodyFat, gender } = healthCalcs;
  const recommendations: string[] = [];
  
  if (bodyFat !== null) {
    const idealRanges = {
      male: { min: 10, max: 20 },
      female: { min: 18, max: 28 }
    };
    const range = gender === 'male' ? idealRanges.male : idealRanges.female;
    
    if (bodyFat < range.min) {
      recommendations.push("Consider increasing healthy fat intake");
      recommendations.push("Focus on building lean muscle mass");
      recommendations.push("Ensure adequate caloric intake");
    } else if (bodyFat > range.max) {
      recommendations.push("Focus on gradual fat loss through diet and exercise");
      recommendations.push("Incorporate resistance training");
      recommendations.push("Prioritize protein intake");
    }
  }
  
  switch(bmiCategory) {
    case "Underweight":
      recommendations.push("Focus on nutrient-dense foods to gain healthy weight");
      recommendations.push("Consider strength training to build muscle mass");
      recommendations.push("Consult with a healthcare provider about healthy weight gain");
      break;
    case "Overweight":
    case "Obese":
      if (!recommendations.length) { // Only add if not already added from body fat
        recommendations.push("Create a sustainable caloric deficit");
        recommendations.push("Focus on whole, unprocessed foods");
        recommendations.push("Consider working with a healthcare provider");
      }
      break;
    case "Normal":
      if (!recommendations.length) {
        recommendations.push("Maintain your healthy habits");
        recommendations.push("Focus on body composition goals");
        recommendations.push("Regular exercise and balanced nutrition");
      }
      break;
  }
  
  return recommendations;
}

function generateExerciseRecommendations(score: number): string[] {
  if (score >= 80) {
    return [
      "Maintain your excellent exercise routine",
      "Consider periodization for continued progress",
      "Focus on performance goals"
    ];
  }
  if (score >= 60) {
    return [
      "Increase exercise frequency or intensity gradually",
      "Add variety to your workouts",
      "Consider working with a fitness professional"
    ];
  }
  return [
    "Start with manageable exercise goals",
    "Focus on consistency over intensity",
    "Consider getting professional guidance"
  ];
}

function generateNutritionRecommendations(score: number): string[] {
  if (score >= 80) {
    return [
      "Maintain your healthy eating habits",
      "Fine-tune nutrient timing",
      "Consider seasonal adjustments to your diet"
    ];
  }
  if (score >= 60) {
    return [
      "Increase variety in food choices",
      "Focus on meal timing and portions",
      "Consider tracking nutrients"
    ];
  }
  return [
    "Focus on whole, unprocessed foods",
    "Establish regular meal times",
    "Consider consulting a nutrition professional"
  ];
}

function generateSleepRecommendations(score: number): string[] {
  if (score >= 80) {
    return [
      "Maintain your healthy sleep routine",
      "Adjust sleep based on activity level",
      "Monitor sleep quality"
    ];
  }
  if (score >= 60) {
    return [
      "Optimize your sleep environment",
      "Establish a consistent bedtime routine",
      "Limit screen time before bed"
    ];
  }
  return [
    "Prioritize sleep hygiene",
    "Create a relaxing bedtime routine",
    "Consider sleep tracking"
  ];
}

function generateMentalHealthRecommendations(score: number): string[] {
  if (score >= 80) {
    return [
      "Maintain your mental wellness practices",
      "Continue stress management techniques",
      "Stay connected with support system"
    ];
  }
  if (score >= 60) {
    return [
      "Develop additional coping strategies",
      "Practice regular mindfulness",
      "Build stronger social connections"
    ];
  }
  return [
    "Consider professional support",
    "Establish stress management routine",
    "Build a support network"
  ];
}
