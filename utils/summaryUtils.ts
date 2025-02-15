import type { HealthCalculations } from '@/types'

interface SummaryInput {
  exercise: number;
  nutrition: number;
  sleep: number;
  mentalHealth: number;
  healthCalculations?: HealthCalculations;
}

interface SectionFeedback {
  message: string;
  recommendations?: string[];
}

interface StructuredSummary {
  bodyComposition?: SectionFeedback;
  exercise?: SectionFeedback;
  nutrition?: SectionFeedback;
  sleep?: SectionFeedback;
  mentalHealth?: SectionFeedback;
}

export function generateStructuredSummary(data: SummaryInput): StructuredSummary {
  const summary: StructuredSummary = {};

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

  return summary;
}

function generateBodyCompositionMessage(healthCalcs: HealthCalculations): string {
  const { bmi, bmiCategory } = healthCalcs
  if (!bmi || !bmiCategory) return "Unable to calculate body composition metrics."
  
  return `Your BMI of ${bmi.toFixed(1)} puts you in the ${bmiCategory} category. ${
    bmiCategory === "Normal" 
      ? "This is within the healthy range."
      : "This suggests room for improvement in your body composition."
  }`
}

function generateBodyCompositionRecommendations(healthCalcs: HealthCalculations): string[] {
  const { bmiCategory } = healthCalcs
  const recommendations = []
  
  switch(bmiCategory) {
    case "Underweight":
      recommendations.push("Focus on nutrient-dense foods to gain healthy weight")
      recommendations.push("Consider strength training to build muscle mass")
      break
    case "Overweight":
    case "Obese":
      recommendations.push("Create a sustainable caloric deficit through diet and exercise")
      recommendations.push("Focus on whole, unprocessed foods")
      break
    default:
      recommendations.push("Maintain your healthy habits")
      recommendations.push("Consider body composition goals beyond BMI")
  }
  
  return recommendations
}

function generateExerciseFeedback(score: number): string {
  if (score >= 80) return "Your exercise habits are excellent! You're maintaining a good balance of activity."
  if (score >= 60) return "You have a decent exercise routine, but there's room for improvement."
  return "Your exercise level could use some improvement to better support your health goals."
}

function generateExerciseRecommendations(score: number): string[] {
  const recommendations = []
  if (score < 80) {
    recommendations.push("Try to increase your activity level gradually")
    recommendations.push("Consider incorporating more structured exercise into your routine")
  }
  if (score < 60) {
    recommendations.push("Start with short walks and gradually increase duration")
    recommendations.push("Consider consulting a fitness professional for guidance")
  }
  return recommendations
}
