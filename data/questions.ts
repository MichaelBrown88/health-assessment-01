export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'boolean' | 'single' | 'multiple' | 'scale';
  description?: string;
  placeholder?: string;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  condition?: (answers: AnswerType) => boolean;
  optional?: boolean;
}

export interface AnswerType {
  [key: string]: string | number | boolean | string[];
}

// Map old question types to new ones
const mapQuestionType = (type: 'radio' | 'checkbox' | 'slider'): Question['type'] => {
  switch (type) {
    case 'radio': return 'single';
    case 'checkbox': return 'multiple';
    case 'slider': return 'scale';
    default: return 'single';
  }
};

export const questions: Question[] = [
  { 
    id: "age", 
    text: "What is your age?", 
    type: "scale",
    min: 18,
    max: 100,
    step: 1,
    minLabel: "18 years",
    maxLabel: "100 years"
  },
  {
    id: "gender",
    text: "What is your gender?",
    type: "single",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
  },
  { 
    id: "height", 
    text: "What is your height in cm?", 
    type: "scale",
    min: 140,
    max: 220,
    step: 1,
    minLabel: "140 cm",
    maxLabel: "220 cm"
  },
  { 
    id: "weight", 
    text: "What is your weight in kg?", 
    type: "scale",
    min: 40,
    max: 200,
    step: 0.1,
    minLabel: "40 kg",
    maxLabel: "200 kg"
  },
  { 
    id: "bodyFat", 
    text: "What is your body fat percentage?",
    description: "Optional - leave empty for automatic estimation",
    type: "scale",
    min: 5,
    max: 50,
    step: 0.1,
    minLabel: "5%",
    maxLabel: "50%",
    optional: true
  },
  {
    id: "activityLevel",
    text: "What is your activity level?",
    type: "single",
    options: [
      { value: "sedentary", label: "Sedentary (little to no exercise)" },
      { value: "light", label: "Lightly active (light exercise 1-2 days/week)" },
      { value: "moderate", label: "Moderately active (moderate exercise 3-5 days/week)" },
      { value: "active", label: "Active (hard exercise 6-7 days/week)" },
      { value: "veryActive", label: "Very active (very hard exercise, physical job or training twice a day)" },
    ],
  },
  {
    id: "exerciseIntensity",
    text: "How intense are your typical workouts?",
    type: "single",
    options: [
      { value: "light", label: "Light (minimal sweating, normal heart rate)" },
      { value: "moderate", label: "Moderate (light sweating, elevated heart rate)" },
      { value: "vigorous", label: "Vigorous (heavy sweating, rapid heart rate)" },
      { value: "very-intense", label: "Very intense (profuse sweating, very rapid heart rate)" },
    ],
    condition: (answers: AnswerType) => answers.activityLevel !== "sedentary"
  },
  {
    id: "exerciseDuration",
    text: "On average, how long is each of your exercise sessions?",
    type: "single",
    options: [
      { value: "less-than-30", label: "Less than 30 minutes" },
      { value: "30-45", label: "30-45 minutes" },
      { value: "45-60", label: "45-60 minutes" },
      { value: "60+", label: "More than 60 minutes" },
    ],
    condition: (answers: AnswerType) => answers.activityLevel !== "sedentary"
  },
  {
    id: "exerciseType",
    text: "What type(s) of exercise do you primarily do?",
    type: "multiple",
    options: [
      { value: "cardio", label: "Cardio (running, cycling, swimming)" },
      { value: "strength", label: "Strength training" },
      { value: "resistance", label: "Resistance training" },
      { value: "flexibility", label: "Flexibility (yoga, pilates)" },
      { value: "mixed", label: "Mixed (combination of different types)" },
    ],
    condition: (answers: AnswerType) => answers.activityLevel !== "sedentary"
  },
  {
    id: "goals",
    text: "What are your primary health goals?",
    type: "multiple",
    options: [
      { value: "weight-loss", label: "Weight loss" },
      { value: "muscle-gain", label: "Muscle gain" },
      { value: "endurance", label: "Improve endurance" },
      { value: "overall-health", label: "Improve overall health" },
    ],
  },
  {
    id: "diet",
    text: "How would you describe your overall diet and eating habits?",
    type: "single",
    options: [
      { value: "unhealthy", label: "Mostly unhealthy (processed foods, high in sugar and fat, few fruits and vegetables)" },
      { value: "average", label: "Average (mix of healthy and unhealthy foods, some fruits and vegetables)" },
      { value: "healthy", label: "Mostly healthy (whole foods, balanced meals, regular fruits and vegetables)" },
      { value: "very-healthy", label: "Very healthy and balanced (nutrient-dense foods, portion control, plenty of fruits and vegetables)" },
    ],
  },
  {
    id: "carbPreference",
    text: "What is your preference for carbohydrate intake in your diet?",
    type: "single",
    options: [
      { value: "low-carb", label: "Low-carb: I prefer to eat fewer carbohydrates" },
      { value: "moderate-carb", label: "Moderate-carb: I like to have a balanced mix of carbohydrates, protein, and fats" },
      { value: "high-carb", label: "High-carb: I enjoy eating a lot of carbohydrates in my diet" },
    ],
  },
  {
    id: "lastMeal",
    text: "When do you typically eat your last meal of the day?",
    type: "single",
    options: [
      { value: "before-6pm", label: "Before 6 PM" },
      { value: "6pm-8pm", label: "Between 6 PM and 8 PM" },
      { value: "8pm-10pm", label: "Between 8 PM and 10 PM" },
      { value: "after-10pm", label: "After 10 PM" },
    ],
  },
  {
    id: "mealFrequency",
    text: "How many meals do you typically eat per day?",
    type: "single",
    options: [
      { value: "1-2", label: "1-2 meals" },
      { value: "3-4", label: "3-4 meals" },
      { value: "5+", label: "5 or more meals" },
    ],
  },
  {
    id: "sleepDuration",
    text: "How many hours do you typically sleep per night?",
    description: "Consider your average sleep duration over the past month",
    type: "single",
    options: [
      { value: "less-than-5", label: "Less than 5 hours" },
      { value: "5-7", label: "5-7 hours" },
      { value: "7-9", label: "7-9 hours" },
      { value: "more-than-9", label: "More than 9 hours" },
    ],
  },
  {
    id: "sleepQuality",
    text: "How would you describe your sleep quality?",
    type: "single",
    options: [
      { value: "poor", label: "Poor (wake up regularly throughout the night)" },
      { value: "fair", label: "Fair (some disruptions, but generally okay)" },
      { value: "good", label: "Good (few disruptions, feel mostly rested)" },
      { value: "excellent", label: "Excellent (deep, undisrupted sleep, wake up refreshed)" },
    ],
  },
  {
    id: "recovery",
    text: "How well do you feel your body recovers after physical activity?",
    type: "single",
    options: [
      { value: "poor", label: "Poor (often feel sore and fatigued for days)" },
      { value: "fair", label: "Fair (some lingering soreness, but manageable)" },
      { value: "good", label: "Good (minimal soreness, feel ready for next workout)" },
      { value: "excellent", label: "Excellent (quick recovery, rarely feel sore)" },
    ],
  },
  {
    id: "stress",
    text: "How would you rate your stress levels?",
    type: "single",
    options: [
      { value: "very-high", label: "Very high" },
      { value: "high", label: "High" },
      { value: "moderate", label: "Moderate" },
      { value: "low", label: "Low" },
    ],
  },
  {
    id: "mentalHealth",
    text: "How often do you feel down or anxious?",
    type: "single",
    options: [
      { value: "often", label: "Often (most days)" },
      { value: "sometimes", label: "Sometimes (a few times a week)" },
      { value: "rarely", label: "Rarely (a few times a month)" },
      { value: "never", label: "Never or almost never" },
    ],
  },
  {
    id: "socializing",
    text: "How often do you engage in social activities or spend time with friends/family?",
    type: "single",
    options: [
      { value: "rarely", label: "Rarely (less than once a month)" },
      { value: "occasionally", label: "Occasionally (1-2 times a month)" },
      { value: "regularly", label: "Regularly (1-2 times a week)" },
      { value: "frequently", label: "Frequently (3 or more times a week)" },
    ],
  },
]
