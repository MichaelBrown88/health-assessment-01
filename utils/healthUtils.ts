type HealthGoal = string;

export function getHealthGoalAdvice(goals: HealthGoal[]): string[] {
  const adviceMap: Record<string, string> = {
    'weight-loss': 'Focus on creating a sustainable caloric deficit through a balanced diet and regular exercise. Aim for a gradual weight loss of 0.5-1kg per week.',
    
    'muscle-gain': 'Prioritize resistance training 3-4 times per week, ensure adequate protein intake (1.6-2.2g/kg body weight), and maintain a slight caloric surplus.',
    
    'general-fitness': 'Combine cardiovascular exercise (150 minutes moderate or 75 minutes vigorous per week) with strength training 2-3 times per week.',
    
    'stress-management': 'Practice daily stress-reduction techniques like meditation, deep breathing, or yoga. Aim for at least 10-15 minutes of mindfulness practice daily.',
    
    'better-sleep': 'Establish a consistent sleep schedule, create a relaxing bedtime routine, and aim for 7-9 hours of quality sleep per night.',
    
    'mental-health': 'Incorporate regular physical activity, maintain social connections, and consider mindfulness practices. Don\'t hesitate to seek professional support when needed.',
    
    'nutrition': 'Focus on whole, unprocessed foods, include a variety of fruits and vegetables, and maintain proper portion control. Consider tracking your meals to ensure balanced nutrition.',
    
    'flexibility': 'Include daily stretching or mobility work, try yoga or Pilates, and remember to warm up properly before exercise.',
    
    'endurance': 'Gradually increase your cardiovascular exercise duration and intensity. Mix different types of cardio activities and include proper recovery periods.',
    
    'strength': 'Follow a progressive overload program, focus on compound exercises, and ensure proper form and technique.',
    
    'balance': 'Include exercises that challenge your stability, try single-leg movements, and consider activities like yoga or tai chi.',
    
    'posture': 'Practice proper ergonomics, strengthen core and back muscles, and be mindful of your posture throughout the day.',
    
    'injury-prevention': 'Focus on proper form, include adequate warm-up and cool-down periods, and listen to your body\'s signals.',
    
    'energy-levels': 'Maintain consistent meal timing, stay hydrated, get adequate sleep, and manage stress levels.',
    
    'immune-health': 'Ensure adequate nutrition, particularly vitamins C and D, get regular sleep, manage stress, and maintain good hygiene practices.',
  };

  return goals.map(goal => adviceMap[goal] || 'Set specific, measurable goals and maintain consistency in your health journey.');
} 