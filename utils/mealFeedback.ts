// or wherever your meal feedback logic is located

export function getMealFeedback(mealTime: string) {
  // Add debugging logs
  console.log('Input mealTime:', mealTime);
  
  const normalizedTime = mealTime.toLowerCase().trim();
  console.log('Normalized mealTime:', normalizedTime);

  const feedbackMap: Record<string, { feedback: string; recommendation: string }> = {
    'before 6am': {
      feedback: 'Very early morning meal time.',
      recommendation: 'Consider having a light meal and waiting 2-3 hours before sleeping.'
    },
    '6am-8am': {
      feedback: 'Ideal breakfast timing.',
      recommendation: 'This is a great time for your first meal of the day.'
    },
    '8am-10am': {
      feedback: 'Mid-morning meal time.',
      recommendation: 'Consider having breakfast earlier to maintain better energy levels.'
    },
    '10am-12pm': {
      feedback: 'Late morning meal time.',
      recommendation: 'Try to have your first meal earlier in the day.'
    },
    '12pm-2pm': {
      feedback: 'Ideal lunch timing.',
      recommendation: 'This is a perfect time for your midday meal.'
    },
    '2pm-4pm': {
      feedback: 'Mid-afternoon meal time.',
      recommendation: 'Consider having your main lunch earlier for better digestion.'
    },
    '4pm-6pm': {
      feedback: 'Early evening meal time.',
      recommendation: 'Good timing if this is an early dinner.'
    },
    '6pm-8pm': {
      feedback: 'Evening meal time - this is generally a good time for dinner.',
      recommendation: 'Try to finish eating at least 2-3 hours before bedtime for optimal digestion and sleep quality.'
    },
    '8pm-10pm': {
      feedback: 'Late evening meal time.',
      recommendation: 'Consider eating earlier to allow proper digestion before sleep.'
    },
    'after 10pm': {
      feedback: 'Late night meal time.',
      recommendation: 'Try to avoid eating this late for better sleep quality.'
    }
  };

  console.log('Found in feedbackMap:', feedbackMap[normalizedTime]);
  
  const result = feedbackMap[normalizedTime] || {
    feedback: 'No specific feedback available.',
    recommendation: 'No specific recommendations available.'
  };

  console.log('Final result:', result);
  return result;
}
