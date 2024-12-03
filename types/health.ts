// Activity and Exercise Types
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
export type ExerciseIntensity = 'light' | 'moderate' | 'vigorous' | 'very-intense';
export type ExerciseDuration = 'less-than-30' | '30-45' | '45-60' | '60+';

// Diet and Nutrition Types
export type DietQuality = 'poor' | 'fair' | 'good' | 'excellent';
export type MealFrequency = '1-2' | '2-3' | '3-4' | '4-5' | '5+';
export type LastMealTiming = 'before-6pm' | '6pm-8pm' | '8pm-10pm' | 'after-10pm';

// Sleep and Recovery Types
export type SleepDuration = 'less-than-6' | '6-7' | '7-8' | '8-9' | 'more-than-9';
export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent';
export type Recovery = 'poor' | 'fair' | 'good' | 'excellent';

// Mental Health Types
export type StressLevel = 'very-high' | 'high' | 'moderate' | 'low' | 'very-low';
export type MentalHealth = 'poor' | 'fair' | 'good' | 'excellent';
export type SocialActivity = 'rarely' | 'occasionally' | 'regularly' | 'frequently';

// Body Composition Types
export type BMICategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
export type BodyFatCategory = 'Essential' | 'Athletic' | 'Fitness' | 'Average' | 'Obese';

// Color Types
export type TrafficLightColor = 'red' | 'amber' | 'green'; 