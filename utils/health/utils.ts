export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function getHealthGoalAdvice(goals: string[]): string[] {
  const goalAdvice: Record<string, string> = {
    'weight-loss': 'Create a sustainable caloric deficit through balanced nutrition and regular exercise. Aim for 0.5-1kg loss per week. Focus on nutrient-dense foods, portion control, and a mix of cardio and strength training. Track your progress and adjust as needed.',
    'muscle-gain': 'Prioritize resistance training with progressive overload, focusing on compound exercises. Maintain a slight caloric surplus and ensure adequate protein intake (1.6-2.2g per kg of body weight). Get sufficient rest between workouts and focus on proper form.',
    'endurance': 'Build your cardiovascular fitness through a mix of steady-state cardio and interval training. Start with 3-4 sessions per week, gradually increasing duration and intensity. Include proper warm-ups and cool-downs, and stay well-hydrated.',
    'overall-health': 'Focus on all aspects of health: regular exercise (both cardio and strength), balanced nutrition with whole foods, adequate sleep (7-9 hours), stress management, and social connections. Make sustainable lifestyle changes rather than quick fixes.',
    'stress-management': 'Develop a comprehensive stress management routine including regular meditation or mindfulness practice, deep breathing exercises, and regular physical activity. Consider journaling, time management techniques, and setting healthy boundaries.',
    'better-sleep': 'Establish a consistent sleep schedule and bedtime routine. Create an optimal sleep environment (dark, quiet, cool). Limit screen time before bed, avoid caffeine late in the day, and aim for 7-9 hours of quality sleep.',
    'nutrition': 'Focus on whole, unprocessed foods with plenty of vegetables, lean proteins, healthy fats, and complex carbohydrates. Plan your meals, practice mindful eating, and stay hydrated. Consider working with a nutritionist for personalized guidance.',
    'flexibility': 'Incorporate daily stretching and mobility work, focusing on major muscle groups. Include dynamic stretches before exercise and static stretches after. Consider yoga or Pilates to improve overall flexibility and body awareness.',
    'strength': 'Follow a structured strength training program focusing on compound movements (squats, deadlifts, presses). Ensure proper form, progressive overload, and adequate recovery. Consider working with a qualified trainer initially.',
    'mental-health': 'Prioritize mental wellness through regular exercise, adequate sleep, stress management, and maintaining social connections. Consider professional support if needed, and develop healthy coping mechanisms for challenging times.'
  };

  return goals.map(goal => goalAdvice[goal] || `Work towards your ${goal.replace('-', ' ')} goal with consistent effort and tracking. Consider consulting a health professional for personalized guidance.`);
} 