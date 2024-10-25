import { AnswerType } from '../data/questions'
import { HealthCalculations } from '../types/HealthCalculations'

export const calculateScore = (answers: AnswerType, healthCalculations: HealthCalculations): number => {
  let score = 0;
  const maxScore = 100;

  const scoreMap = {
    activityLevel: { sedentary: 2, light: 7, moderate: 17, active: 22, veryActive: 25 },
    exerciseIntensity: { light: 1, moderate: 2, vigorous: 3, "very-intense": 2 },
    exerciseDuration: { "less-than-30": 1, "30-45": 2, "45-60": 3, "60+": 3 },
    diet: { unhealthy: 0, average: 7, healthy: 13, "very-healthy": 20 },
    lastMeal: { "less-than-2": 2, "2-4": 3, "4-6": 1, "more-than-6": 0, "after-10pm": 0 },
    mealFrequency: { "1-2": 1, "3-4": 3, "5-6": 2, "more-than-6": 1 },
    sleepDuration: { "less-than-6": 0, "6-7": 4, "7-8": 8, "more-than-8": 7 },
    sleepQuality: { poor: 0, fair: 2, good: 5, excellent: 7 },
    recovery: { poor: 0, fair: 2, good: 4, excellent: 5 },
    stress: { "very-high": 0, high: 1, moderate: 3, low: 5 },
    mentalHealth: { often: 0, sometimes: 2, rarely: 4, never: 5 },
    socializing: { rarely: 0, occasionally: 2, regularly: 4, frequently: 5 },
  };

  for (const [key, value] of Object.entries(answers)) {
    if (key in scoreMap && typeof value === 'string') {
      score += scoreMap[key as keyof typeof scoreMap][value as keyof (typeof scoreMap)[keyof typeof scoreMap]] || 0;
    }
  }

  // BMI score calculation
  if (healthCalculations.bmi !== null) {
    if (healthCalculations.bmi < 18.5 || healthCalculations.bmi >= 30) {
      score += 0;
    } else if (healthCalculations.bmi >= 25) {
      score += 3;
    } else {
      score += 7;
    }
  }

  return Math.min(Math.round((score / maxScore) * 100), 100);
}

export const getTrafficLightColor = (score: number): string => {
  if (score >= 80) return "green";
  if (score >= 60) return "amber";
  return "red";
};

export const getSectionFeedback = (item: string, value: string) => {
  const score = getItemScore(item, value);
  const color = getTrafficLightColor(score);
  const feedbackData = feedbackMap[item]?.[value] || { feedback: "No specific feedback available.", recommendations: "No specific recommendations available." };

  return {
    score,
    color,
    feedback: feedbackData.feedback,
    recommendations: feedbackData.recommendations,
  };
};

export const getItemScore = (item: string, value: string): number => {
  const scoreMap: { [key: string]: { [key: string]: number } } = {
    activityLevel: { sedentary: 20, light: 40, moderate: 60, active: 80, veryActive: 100 },
    exerciseIntensity: { light: 40, moderate: 60, vigorous: 100, "very-intense": 80 },
    exerciseDuration: { "less-than-30": 40, "30-45": 60, "45-60": 80, "60+": 100 },
    diet: { unhealthy: 20, average: 60, healthy: 80, "very-healthy": 100 },
    lastMeal: { "less-than-2": 80, "2-4": 100, "4-6": 60, "more-than-6": 40, "after-10pm": 20 },
    mealFrequency: { "1-2": 40, "3-4": 100, "5-6": 80, "more-than-6": 60 },
    sleepDuration: { "less-than-6": 20, "6-7": 60, "7-8": 100, "more-than-8": 80 },
    sleepQuality: { poor: 20, fair: 60, good: 80, excellent: 100 },
    recovery: { poor: 20, fair: 60, good: 80, excellent: 100 },
    stress: { "very-high": 20, high: 40, moderate: 60, low: 100 },
    mentalHealth: { often: 20, sometimes: 40, rarely: 80, never: 100 },
    socializing: { rarely: 20, occasionally: 40, regularly: 80, frequently: 100 },
  };

  return scoreMap[item]?.[value] || 50;
}

const feedbackMap: { [key: string]: { [key: string]: { feedback: string; recommendations: string } } } = {
  activityLevel: {
    sedentary: {
      feedback: "Your activity level is very low, which can lead to various health issues.",
      recommendations: "Start with small changes like taking short walks or using stairs instead of elevators. Gradually increase your activity level over time."
    },
    light: {
      feedback: "You have a light activity level, which is a good start but there's room for improvement.",
      recommendations: "Try to incorporate more movement into your daily routine. Aim for at least 150 minutes of moderate-intensity exercise per week."
    },
    moderate: {
      feedback: "Your moderate activity level is good for maintaining health.",
      recommendations: "Keep up the good work! Consider adding some variety to your routine or increasing intensity for even better health benefits."
    },
    active: {
      feedback: "You have an active lifestyle, which is great for overall health.",
      recommendations: "Maintain this level of activity and ensure you're also including strength training and flexibility exercises in your routine."
    },
    veryActive: {
      feedback: "Your very active lifestyle is excellent for health and fitness.",
      recommendations: "Ensure you're allowing adequate time for rest and recovery to prevent burnout or injury."
    }
  },
  exerciseIntensity: {
    light: {
      feedback: "Light intensity exercise is a good start, especially if you're new to exercise or recovering from injury.",
      recommendations: "Gradually increase the intensity of your workouts as your fitness improves. Aim for moderate intensity most of the time."
    },
    moderate: {
      feedback: "Moderate intensity exercise is great for overall health and fitness.",
      recommendations: "This is a good level to maintain. Consider adding some vigorous intensity sessions for additional cardiovascular benefits."
    },
    vigorous: {
      feedback: "Vigorous intensity exercise provides excellent cardiovascular benefits.",
      recommendations: "Ensure you're not overdoing it. Mix in some moderate intensity sessions and adequate recovery time."
    },
    "very-intense": {
      feedback: "Very intense exercise can provide significant fitness gains but also carries higher risk of injury.",
      recommendations: "Be sure to balance this with adequate recovery time and lower intensity sessions. Consider consulting a fitness professional to ensure safe training practices."
    }
  },
  exerciseDuration: {
    "less-than-30": {
      feedback: "Exercising for less than 30 minutes may not be sufficient for optimal health benefits.",
      recommendations: "Try to gradually increase your exercise duration. Aim for at least 30 minutes per session, 5 days a week."
    },
    "30-45": {
      feedback: "Exercising for 30-45 minutes is a good start for maintaining health.",
      recommendations: "Consider increasing your exercise duration to 45-60 minutes for enhanced health benefits."
    },
    "45-60": {
      feedback: "Exercising for 45-60 minutes provides substantial health benefits.",
      recommendations: "This is an excellent duration. Maintain this level and focus on consistency and intensity."
    },
    "60+": {
      feedback: "Exercising for over 60 minutes can provide significant health and fitness benefits.",
      recommendations: "Ensure you're allowing adequate recovery time and not overtraining. Mix up your routines to prevent boredom and plateau."
    }
  },
  diet: {
    unhealthy: {
      feedback: "An unhealthy diet can lead to numerous health issues and reduced quality of life.",
      recommendations: "Start by incorporating more fruits and vegetables into your diet. Gradually reduce processed foods and sugary drinks."
    },
    average: {
      feedback: "An average diet provides basic nutrition but there's room for improvement.",
      recommendations: "Focus on increasing your intake of whole foods, lean proteins, and healthy fats. Reduce consumption of processed foods."
    },
    healthy: {
      feedback: "A healthy diet is crucial for maintaining good health and preventing diseases.",
      recommendations: "Keep up the good work! Consider fine-tuning your diet by exploring a variety of nutrient-dense foods and ensuring proper portion control."
    },
    "very-healthy": {
      feedback: "A very healthy diet is excellent for overall health, energy levels, and disease prevention.",
      recommendations: "Maintain this level of nutrition. Stay informed about the latest nutritional research and consider consulting a dietitian for personalized advice."
    }
  },
  sleepDuration: {
    "less-than-6": {
      feedback: "Sleeping less than 6 hours regularly can have serious negative impacts on your health and cognitive function.",
      recommendations: "Prioritize sleep by setting a consistent sleep schedule. Aim to gradually increase your sleep duration to at least 7 hours per night."
    },
    "6-7": {
      feedback: "While 6-7 hours of sleep might feel sufficient, most adults benefit from 7-9 hours of sleep.",
      recommendations: "Try to add an extra 30-60 minutes to your sleep duration. Establish a relaxing bedtime routine to improve sleep quality."
    },
    "7-8": {
      feedback: "Sleeping 7-8 hours is within the recommended range for most adults.",
      recommendations: "Maintain this sleep duration. Focus on improving sleep quality by ensuring a dark, quiet, and cool sleeping environment."
    },
    "more-than-8": {
      feedback: "Sleeping more than 8 hours regularly is fine for some individuals, but for others it might indicate underlying health issues.",
      recommendations: "If you feel well-rested, this amount of sleep may be right for you. However, if you often feel tired despite long sleep, consult a healthcare professional."
    }
  },
  sleepQuality: {
    poor: {
      feedback: "Poor sleep quality can significantly impact your overall health and daily functioning.",
      recommendations: "Establish a consistent sleep schedule, create a relaxing bedtime routine, and ensure your sleeping environment is conducive to good sleep. Consider limiting screen time before bed."
    },
    fair: {
      feedback: "Fair sleep quality is a good starting point, but there's room for improvement.",
      recommendations: "Try to identify factors that might be disrupting your sleep, such as noise, light, or temperature. Consider relaxation techniques like meditation before bed."
    },
    good: {
      feedback: "Good sleep quality is important for physical and mental restoration.",
      recommendations: "Maintain your current sleep habits. Consider fine-tuning your sleep environment or pre-sleep routine for even better quality rest."
    },
    excellent: {
      feedback: "Excellent sleep quality is optimal for health, cognitive function, and overall well-being.",
      recommendations: "Keep up your great sleep habits. Stay consistent with your sleep schedule, even on weekends, to maintain this high-quality sleep."
    }
  },
  recovery: {
    poor: {
      feedback: "Poor recovery can lead to increased risk of injury and decreased performance.",
      recommendations: "Ensure you're allowing adequate time for rest and recovery between workouts. Consider incorporating active recovery techniques like foam rolling or stretching."
    },
    fair: {
      feedback: "Fair recovery is a good starting point, but there's room for improvement.",
      recommendations: "Try to increase your recovery time between workouts. Consider incorporating passive recovery techniques like massage or heat therapy."
    },
    good: {
      feedback: "Good recovery is important for both physical and mental health.",
      recommendations: "Maintain your current recovery habits. Consider fine-tuning your recovery routine for even better results."
    },
    excellent: {
      feedback: "Excellent recovery is optimal for both physical and mental health.",
      recommendations: "Keep up your great recovery habits. Stay consistent with your recovery routine, even on weekends, to maintain this high-quality recovery."
    }
  },
  stress: {
    "very-high": {
      feedback: "Very high stress levels can have serious negative impacts on your health and well-being.",
      recommendations: "Prioritize stress management techniques such as meditation, deep breathing, or yoga. Consider seeking professional help if stress feels overwhelming."
    },
    high: {
      feedback: "High stress levels can negatively impact your health and well-being.",
      recommendations: "Incorporate regular stress-reduction activities into your routine, such as exercise, mindfulness, or hobbies you enjoy."
    },
    moderate: {
      feedback: "Moderate stress levels are manageable but could be improved.",
      recommendations: "Continue practicing stress management techniques and look for ways to further reduce stressors in your life."
    },
    low: {
      feedback: "Low stress levels are beneficial for mental and physical health.",
      recommendations: "Maintain your current stress management practices. Stay vigilant for potential stressors and address them proactively."
    }
  },
  mentalHealth: {
    often: {
      feedback: "Frequent mental health challenges can significantly impact your overall well-being.",
      recommendations: "Consider seeking professional help. Prioritize self-care activities and maintain strong social connections."
    },
    sometimes: {
      feedback: "Occasional mental health challenges are common, but there's room for improvement.",
      recommendations: "Develop coping strategies for difficult times. Consider talking to a mental health professional for additional support."
    },
    rarely: {
      feedback: "Infrequent mental health challenges suggest good overall mental well-being.",
      recommendations: "Continue your current practices. Stay aware of your mental state and seek help if challenges become more frequent."
    },
    never: {
      feedback: "Reporting no mental health challenges is positive, but it's important to stay vigilant.",
      recommendations: "Maintain your mental health practices. Remember it's okay to seek help if you do face challenges in the future."
    }
  },
  socializing: {
    rarely: {
      feedback: "Limited social interaction can negatively impact mental health and well-being.",
      recommendations: "Try to increase your social activities gradually. Consider joining clubs or groups aligned with your interests."
    },
    occasionally: {
      feedback: "Occasional socializing is a good start, but increasing frequency could be beneficial.",
      recommendations: "Look for opportunities to socialize more regularly. Reach out to friends or family members for catch-ups."
    },
    regularly: {
      feedback: "Regular socializing is great for mental health and social well-being.",
      recommendations: "Maintain your current level of social interaction. Consider deepening existing relationships or exploring new social circles."
    },
    frequently: {
      feedback: "Frequent socializing is excellent for mental health and social well-being.",
      recommendations: "Continue your active social life. Ensure you're also allowing time for personal reflection and self-care."
    }
  },
  lastMeal: {
    "less-than-2": {
      feedback: "Eating within the last 2 hours is good for maintaining steady energy levels.",
      recommendations: "Continue eating regular meals. Ensure your meals are balanced with proteins, complex carbs, and healthy fats."
    },
    "2-4": {
      feedback: "Eating 2-4 hours ago is ideal for most people.",
      recommendations: "Maintain this eating pattern. If you feel hungry between meals, consider healthy snacks to keep energy levels stable."
    },
    "4-6": {
      feedback: "It's been a while since your last meal, which might affect your energy levels.",
      recommendations: "Try to eat more regularly. Aim for meals every 3-4 hours to maintain steady energy and blood sugar levels."
    },
    "more-than-6": {
      feedback: "Long gaps between meals can lead to overeating and energy fluctuations.",
      recommendations: "Try to eat more frequently. Consider adding healthy snacks between meals to maintain steady energy levels."
    },
    "after-10pm": {
      feedback: "Eating late at night can disrupt sleep patterns and may lead to weight gain.",
      recommendations: "Try to have your last meal at least 2-3 hours before bedtime. If you're hungry late at night, opt for a light, protein-rich snack."
    }
  },
  mealFrequency: {
    "1-2": {
      feedback: "Eating only 1-2 meals per day may not provide consistent energy throughout the day.",
      recommendations: "Consider increasing your meal frequency. Aim for 3-4 balanced meals per day to maintain steady energy levels."
    },
    "3-4": {
      feedback: "Eating 3-4 meals per day is ideal for most people.",
      recommendations: "Continue this meal frequency. Ensure each meal is balanced with proteins, complex carbs, and healthy fats."
    },
    "5-6": {
      feedback: "Eating 5-6 meals per day can be beneficial, especially for athletes or those with specific health goals.",
      recommendations: "If this meal frequency works for you, continue. Ensure portion sizes are appropriate to avoid overconsumption."
    },
    "more-than-6": {
      feedback: "Eating more than 6 meals per day is uncommon and may lead to overconsumption.",
      recommendations: "Consider reducing meal frequency unless advised by a healthcare professional. Focus on nutrient-dense, balanced meals."
    }
  },
};

export const getHealthGoalAdvice = (goals: string[]) => {
  const adviceMap: { [key: string]: string } = {
    "weight-loss": "To support your weight loss goal, focus on creating a calorie deficit through a combination of diet and exercise. Aim for a balanced diet rich in protein, fiber, and nutrients, and incorporate both cardio and strength training exercises.",
    "muscle-gain": "For muscle gain, ensure you're consuming adequate protein and calories to support muscle growth. Focus on progressive overload in your strength training routine and allow for proper rest and recovery between workouts.",
    "endurance": "To improve endurance, gradually increase the duration and intensity of your cardiovascular exercises. Incorporate interval training and ensure you're fueling your body with complex carbohydrates and staying well-hydrated.",
    "overall-health": "For overall health improvement, aim for a balanced approach. Focus on a varied, nutrient-rich diet, regular exercise including both cardio and strength training, adequate sleep, and stress management techniques.",
  };

  return goals.map(goal => adviceMap[goal] || "Set specific, measurable, achievable, relevant, and time-bound (SMART) goals based on your health priorities. Consider consulting with a healthcare professional or certified trainer for personalized advice.")
}

export const formatTitle = (title: string): string => {
  return title
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

