import { AnswerType } from '../data/questions'
import { HealthCalculations } from '../hooks/useHealthCalculations'

export const calculateScore = (answers: AnswerType, bmi: number): number => {
  // Your score calculation logic here
  // Make sure this function always returns a number
  // For example:
  let score = 0;
  // ... (your scoring logic)
  return score;
}

export const getTrafficLightColor = (score: number) => {
  if (score >= 80) return "green"
  if (score >= 60) return "amber"
  return "red"
}

export const getFeedback = (category: string, value: string | number | string[], score: number) => {
  const color = getTrafficLightColor(score)
  const feedbackMap: { [key: string]: { [key: string]: { feedback: string, color: string } } } = {
    bmi: {
      "Normal weight": { feedback: "Your BMI is within the healthy range. This reduces your risk of various health issues. Keep up the good work!", color: "green" },
      "Underweight": { feedback: "Your BMI suggests you're underweight. This may increase your risk of certain health problems. Consider consulting a nutritionist to ensure you're getting adequate nutrition.", color: "red" },
      "Overweight": { feedback: "Your BMI suggests you're overweight. This increases your risk of various health issues. Focus on a balanced diet and regular exercise to move towards a healthier weight.", color: "amber" },
      "Obese": { feedback: "Your BMI suggests obesity. This significantly increases your risk of various health problems. It's important to consult with a healthcare professional to develop a safe and effective weight management plan.", color: "red" }
    },
    bodyFat: {
      green: { feedback: "Your body fat percentage is within a healthy range. This is great for overall health and physical performance.", color: "green" },
      amber: { feedback: "Your body fat percentage is slightly outside the ideal range. Consider adjusting your diet and exercise routine to optimize your body composition.", color: "amber" },
      red: { feedback: "Your body fat percentage is outside the healthy range. This can increase health risks. Consider consulting a nutritionist or fitness professional for personalized advice.", color: "red" }
    },
    activityLevel: {
      moderate: { feedback: "Your activity level is good. Aim to maintain or increase your exercise frequency to 5 days per week for optimal health benefits.", color: "green" },
      green: { feedback: "Your activity level is excellent. Regular exercise helps maintain cardiovascular health, strengthens muscles and bones, and improves mental well-being.", color: "green" },
      amber: { feedback: "You're on the right track with your activity level. Try to increase your activity for better health outcomes. Aim for at least 150 minutes of moderate-intensity exercise per week.", color: "amber" },
      red: { feedback: "Your activity level is low. Regular exercise is important for health. Start with small, achievable goals and gradually increase your activity level.", color: "red" }
    },
    // Add more categories as needed
  }

  if (feedbackMap[category] && feedbackMap[category][value as string]) {
    return feedbackMap[category][value as string]
  }

  // Default feedback if not found in the map
  return { feedback: "No specific feedback available for this category.", color: "gray" }
}

export const getItemScore = (item: string, value: string | number | string[]): number => {
  const scoreMap: { [key: string]: { [key: string]: number } } = {
    activityLevel: { sedentary: 20, light: 40, moderate: 60, active: 80, veryActive: 100 },
    exerciseIntensity: { light: 40, moderate: 60, vigorous: 100, "very-intense": 80 },
    exerciseDuration: { "less-than-30": 40, "30-45": 60, "45-60": 80, "60+": 100 },
    diet: { unhealthy: 20, average: 60, healthy: 80, "very-healthy": 100 },
    lastMeal: { "before-6pm": 100, "6pm-8pm": 80, "8pm-10pm": 60, "after-10pm": 40 },
    mealFrequency: { "1-2": 60, "3-4": 100, "5+": 80 },
    sleepDuration: { "less-than-6": 20, "6-7": 60, "7-8": 100, "more-than-8": 80 },
    sleepQuality: { poor: 20, fair: 60, good: 80, excellent: 100 },
    recovery: { poor: 20, fair: 60, good: 80, excellent: 100 },
    stress: { "very-high": 20, high: 40, moderate: 60, low: 100 },
    mentalHealth: { often: 20, sometimes: 40, rarely: 80, never: 100 },
    socializing: { rarely: 20, occasionally: 40, regularly: 80, frequently: 100 },
  }

  if (scoreMap[item] && typeof value === 'string' && scoreMap[item][value]) {
    return scoreMap[item][value]
  }

  return 50 // Default score for items not in the scoreMap
}

export const getHealthGoalAdvice = (goals: string[]) => {
  const adviceMap: { [key: string]: string } = {
    "weight-loss": "To support your weight loss goal, focus on creating a calorie deficit through a combination of diet and exercise. Aim for a balanced diet rich in protein, fiber, and nutrients, and incorporate both cardio and strength training exercises.",
    "muscle-gain": "For muscle gain, ensure you're consuming adequate protein and calories to support muscle growth. Focus on progressive overload in your strength training routine and allow for proper rest and recovery between workouts.",
    "endurance": "To improve endurance, gradually increase the duration and intensity of your cardiovascular exercises. Incorporate interval training and ensure you're fueling your body with complex carbohydrates and staying well-hydrated.",
    "overall-health": "For overall health improvement, aim for a balanced approach. Focus on a varied, nutrient-rich diet, regular exercise including both cardio and strength training, adequate sleep, and stress management techniques.",
  }

  return goals.map(goal => adviceMap[goal] || "Set specific, measurable, achievable, relevant, and time-bound (SMART) goals based on your health priorities. Consider consulting with a healthcare professional or certified trainer for personalized advice.")
}

export const getGeneralAdvice = (sectionTitle: string) => {
  const adviceMap: { [key: string]: string } = {
    "Exercise Habits": "Regular physical activity is crucial for maintaining good health. Aim for at least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity aerobic activity per week, along with muscle-strengthening activities at least twice a week.",
    "Diet and Nutrition": "A balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats is essential for overall health. Remember to stay hydrated and be mindful of portion sizes.",
    "Rest and Recovery": "Adequate rest and recovery are vital for both physical and mental health. Aim for 7-9 hours of quality sleep per night and include rest days in your exercise routine.",
    "Mental Health": "Mental health is just as important as physical health. Practice stress-management techniques, maintain social connections, and don't hesitate to seek professional help if you're struggling with mental health issues."
  }
  return adviceMap[sectionTitle] || "Focus on maintaining a balanced approach to all aspects of your health for optimal well-being."
}

export const analyzeAnswers = (answers: AnswerType): string => {
  // Implement your analysis logic here
  // You may need to adjust this function to handle different answer types (string, number, or string[])
  let analysisResult = "Based on your answers:\n\n";

  for (const [questionId, answer] of Object.entries(answers)) {
    analysisResult += `${questionId}: ${Array.isArray(answer) ? answer.join(", ") : answer}\n`;
  }

  // Add more sophisticated analysis logic here

  return analysisResult;
}
