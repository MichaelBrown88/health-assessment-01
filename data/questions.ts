export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  question: string;
  subText?: string;
  type: 'radio' | 'checkbox' | 'slider';
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  condition?: (answers: AnswerType) => boolean;
  optional?: boolean;
}

export interface AnswerType {
  [key: string]: string | number | string[];
}

export const questions: Question[] = [
  { 
    id: "age", 
    question: "What is your age?", 
    type: "slider",
    min: 18,
    max: 100,
    step: 1,
    defaultValue: 30
  },
  {
    id: "gender",
    question: "What is your gender?",
    type: "radio",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
  },
  { 
    id: "height", 
    question: "What is your height in cm?", 
    type: "slider",
    min: 140,
    max: 220,
    step: 1,
    defaultValue: 175
  },
  { 
    id: "weight", 
    question: "What is your weight in kg?", 
    type: "slider",
    min: 40,
    max: 200,
    step: 0.1,
    defaultValue: 70
  },
  { 
    id: "bodyFat", 
    question: "What is your body fat percentage?",
    subText: "Optional - leave empty for automatic estimation",
    type: "slider",
    min: 5,
    max: 50,
    step: 0.1,
    defaultValue: 20,
    optional: true
  },
  {
    id: "activityLevel",
    question: "What is your activity level?",
    type: "radio",
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
    question: "How intense are your typical workouts?",
    type: "radio",
    options: [
      { value: "light", label: "Light (minimal sweating, normal heart rate)" },
      { value: "moderate", label: "Moderate (light sweating, elevated heart rate)" },
      { value: "vigorous", label: "Vigorous (heavy sweating, rapid heart rate)" },
      { value: "very-intense", label: "Very intense (profuse sweating, very rapid heart rate)" },
    ],
    condition: (answers: AnswerType) => answers.activityLevel !== "sedentary",
  },
  {
    id: "exerciseDuration",
    question: "On average, how long is each of your exercise sessions?",
    type: "radio",
    options: [
      { value: "less-than-30", label: "Less than 30 minutes" },
      { value: "30-45", label: "30-45 minutes" },
      { value: "45-60", label: "45-60 minutes" },
      { value: "60+", label: "More than 60 minutes" },
    ],
    condition: (answers: AnswerType) => answers.activityLevel !== "sedentary",
  },
  {
    id: "exerciseType",
    question: "What type(s) of exercise do you primarily do?",
    type: "checkbox",
    options: [
      { value: "cardio", label: "Cardio (running, cycling, swimming)" },
      { value: "strength", label: "Strength training" },
      { value: "resistance", label: "Resistance training" },
      { value: "flexibility", label: "Flexibility (yoga, pilates)" },
      { value: "mixed", label: "Mixed (combination of different types)" },
    ],
    condition: (answers: AnswerType) => answers.activityLevel !== "sedentary",
  },
  {
    id: "goals",
    question: "What are your primary health goals?",
    type: "checkbox",
    options: [
      { value: "weight-loss", label: "Weight loss" },
      { value: "muscle-gain", label: "Muscle gain" },
      { value: "endurance", label: "Improve endurance" },
      { value: "overall-health", label: "Improve overall health" },
    ],
  },
  {
    id: "diet",
    question: "How would you describe your overall diet and eating habits?",
    type: "radio",
    options: [
      { value: "unhealthy", label: "Mostly unhealthy (processed foods, high in sugar and fat, few fruits and vegetables)" },
      { value: "average", label: "Average (mix of healthy and unhealthy foods, some fruits and vegetables)" },
      { value: "healthy", label: "Mostly healthy (whole foods, balanced meals, regular fruits and vegetables)" },
      { value: "very-healthy", label: "Very healthy and balanced (nutrient-dense foods, portion control, plenty of fruits and vegetables)" },
    ],
  },
  {
    id: "carbPreference",
    question: "What is your preference for carbohydrate intake in your diet?",
    type: "radio",
    options: [
      { value: "low-carb", label: "Low-carb: I prefer to eat fewer carbohydrates" },
      { value: "moderate-carb", label: "Moderate-carb: I like to have a balanced mix of carbohydrates, protein, and fats" },
      { value: "high-carb", label: "High-carb: I enjoy eating a lot of carbohydrates in my diet" },
    ],
  },
  {
    id: "lastMeal",
    question: "When do you typically eat your last meal of the day?",
    type: "radio",
    options: [
      { value: "before-6pm", label: "Before 6 PM" },
      { value: "6pm-8pm", label: "Between 6 PM and 8 PM" },
      { value: "8pm-10pm", label: "Between 8 PM and 10 PM" },
      { value: "after-10pm", label: "After 10 PM" },
    ],
  },
  {
    id: "mealFrequency",
    question: "How many meals do you typically eat per day?",
    type: "radio",
    options: [
      { value: "1-2", label: "1-2 meals" },
      { value: "3-4", label: "3-4 meals" },
      { value: "5+", label: "5 or more meals" },
    ],
  },
  {
    id: "sleepDuration",
    question: "How many hours of sleep do you get on average?",
    type: "radio",
    options: [
      { value: "less-than-6", label: "Less than 6 hours" },
      { value: "6-7", label: "6-7 hours" },
      { value: "7-8", label: "7-8 hours" },
      { value: "more-than-8", label: "More than 8 hours" },
    ],
  },
  {
    id: "sleepQuality",
    question: "How would you describe your sleep quality?",
    type: "radio",
    options: [
      { value: "poor", label: "Poor (wake up regularly throughout the night)" },
      { value: "fair", label: "Fair (some disruptions, but generally okay)" },
      { value: "good", label: "Good (few disruptions, feel mostly rested)" },
      { value: "excellent", label: "Excellent (deep, undisrupted sleep, wake up refreshed)" },
    ],
  },
  {
    id: "recovery",
    question: "How well do you feel your body recovers after physical activity?",
    type: "radio",
    options: [
      { value: "poor", label: "Poor (often feel sore and fatigued for days)" },
      { value: "fair", label: "Fair (some lingering soreness, but manageable)" },
      { value: "good", label: "Good (minimal soreness, feel ready for next workout)" },
      { value: "excellent", label: "Excellent (quick recovery, rarely feel sore)" },
    ],
  },
  {
    id: "stress",
    question: "How would you rate your stress levels?",
    type: "radio",
    options: [
      { value: "very-high", label: "Very high" },
      { value: "high", label: "High" },
      { value: "moderate", label: "Moderate" },
      { value: "low", label: "Low" },
    ],
  },
  {
    id: "mentalHealth",
    question: "How often do you feel down or anxious?",
    type: "radio",
    options: [
      { value: "often", label: "Often (most days)" },
      { value: "sometimes", label: "Sometimes (a few times a week)" },
      { value: "rarely", label: "Rarely (a few times a month)" },
      { value: "never", label: "Never or almost never" },
    ],
  },
  {
    id: "socializing",
    question: "How often do you engage in social activities or spend time with friends/family?",
    type: "radio",
    options: [
      { value: "rarely", label: "Rarely (less than once a month)" },
      { value: "occasionally", label: "Occasionally (1-2 times a month)" },
      { value: "regularly", label: "Regularly (1-2 times a week)" },
      { value: "frequently", label: "Frequently (3 or more times a week)" },
    ],
  },
]
