import type { FeedbackMap } from '@/types/feedback';

export const feedbackData: FeedbackMap = {
  activityLevel: {
    sedentary: {
      feedback: "Your current activity level is very low, which can impact your overall health and energy levels. Regular movement is essential for maintaining good health and preventing various health issues.",
      recommendations: "Start with small, manageable changes like short walks or taking stairs instead of elevators. Aim for 5-10 minutes of movement every hour during the day. Consider setting reminders to stand up and move regularly. Build up gradually as your fitness improves and your body adapts to more movement."
    },
    light: {
      feedback: "Your light activity level provides some health benefits but has significant room for improvement. Regular movement throughout the day can enhance your energy levels and overall wellbeing.",
      recommendations: "Incorporate more movement into your daily routine by scheduling dedicated walking breaks. Try to accumulate 30 minutes of moderate activity most days of the week. Consider adding structured exercise sessions 2-3 times per week. Focus on activities you enjoy to build consistency and make it a sustainable habit."
    },
    moderate: {
      feedback: "Your moderate activity level supports basic health and fitness goals. This foundation can be built upon to achieve even better health outcomes.",
      recommendations: "Add variety to your activities to challenge different aspects of fitness. Gradually increase intensity when ready, perhaps adding one challenging session per week. Consider mixing cardio and strength training for balanced fitness development. Track your progress to stay motivated and see improvements."
    },
    active: {
      feedback: "Your active lifestyle demonstrates a strong commitment to health and provides numerous benefits. This level of activity supports good health outcomes and energy levels.",
      recommendations: "Maintain your consistent activity while ensuring proper recovery between sessions. Consider varying your routine to prevent plateaus and maintain motivation. Focus on quality of movement and proper form. Think about adding skill-based activities to keep challenging yourself in new ways."
    },
    'very-active': {
      feedback: "Your very active lifestyle shows dedication to fitness and provides optimal health benefits. This level of activity requires careful attention to recovery and nutrition.",
      recommendations: "Focus on recovery quality and monitor for signs of overtraining such as persistent fatigue or decreased performance. Balance intense activities with adequate rest periods. Pay special attention to sleep and nutrition to support your activity level. Consider working with a fitness professional to optimize your training program."
    }
  },
  exerciseIntensity: {
    light: {
      feedback: "Light intensity exercise provides a good foundation for building fitness safely. This level allows you to develop proper form and build endurance gradually.",
      recommendations: "Gradually increase the intensity of some sessions while maintaining good form. Add brief periods of moderate effort to build cardiovascular fitness. Focus on mastering exercise techniques at this comfortable pace. Consider working with a trainer to ensure proper form."
    },
    moderate: {
      feedback: "Moderate intensity exercise offers an excellent balance of challenge and sustainability. This level promotes consistent progress while managing fatigue effectively.",
      recommendations: "Maintain this level for most sessions while incorporating some higher intensity intervals. Focus on proper form and breathing techniques. Track your heart rate during different activities. Consider adding variety to your workout types."
    },
    vigorous: {
      feedback: "Vigorous exercise demonstrates strong fitness capacity and provides maximum health benefits. This intensity level can lead to significant improvements when properly managed.",
      recommendations: "Balance these sessions with adequate recovery periods and mix with moderate intensity days. Monitor your heart rate and recovery between intervals. Focus on maintaining proper form even when fatigued. Track performance metrics to ensure progress."
    },
    'very-intense': {
      feedback: "Very intense exercise shows high fitness capacity but requires careful management. This level of intensity can be effective but carries increased recovery demands.",
      recommendations: "Limit very intense sessions to 1-2 times per week and ensure proper warm-up protocols. Monitor recovery carefully between sessions. Track heart rate variability if possible. Work with a trainer to optimize programming."
    }
  },
  exerciseDuration: {
    'less-than-30': {
      feedback: "Short workout durations can be effective when performed consistently and with good intensity. These sessions can fit easily into busy schedules while still providing health benefits.",
      recommendations: "Maximize efficiency with circuit-style training or intervals. Focus on compound exercises that work multiple muscle groups. Gradually extend sessions by 5-10 minutes as fitness improves. Ensure proper warm-up despite time constraints."
    },
    '30-45': {
      feedback: "This duration hits the sweet spot for most fitness goals, balancing effectiveness with time efficiency. These sessions allow for proper warm-up and cool-down while maintaining good intensity.",
      recommendations: "Focus on maximizing the quality of each session with proper form and effort. Include adequate warm-up and cool-down periods. Mix different training styles to maintain interest. Track workout intensity and recovery."
    },
    '45-60': {
      feedback: "This duration allows for comprehensive workouts that can address multiple fitness components. The time frame enables thorough warm-up and progressive intensity building.",
      recommendations: "Structure sessions to include varied training methods and proper progression. Ensure intensity remains consistent throughout the workout. Include proper warm-up and cool-down protocols. Monitor energy levels across the session."
    },
    '60+': {
      feedback: "Longer sessions demonstrate strong endurance capacity and allow for thorough training. This duration requires good energy management and hydration strategies.",
      recommendations: "Break sessions into distinct phases to maintain quality throughout. Monitor intensity and form as fatigue sets in. Ensure proper nutrition and hydration strategies. Consider splitting different training components."
    }
  },
  diet: {
    'unhealthy': {
      feedback: "Your current diet may not be providing the nutrients needed for optimal health and energy. Poor nutrition can impact everything from energy levels to recovery and long-term health.",
      recommendations: "Start by incorporating more whole, unprocessed foods into your meals. Focus on adding colorful vegetables and lean proteins to each meal. Plan your meals ahead to avoid unhealthy convenience options. Consider tracking your food intake to understand your patterns."
    },
    'average': {
      feedback: "Your diet provides basic nutrition but has significant room for enhancement. Small improvements in food choices can lead to better energy levels and overall health outcomes.",
      recommendations: "Focus on increasing the variety of whole foods in your diet. Ensure each meal contains protein, complex carbohydrates, and healthy fats. Plan your meals ahead to maintain consistency. Learn about proper portion sizes and timing."
    },
    'healthy': {
      feedback: "Your healthy eating habits provide a strong foundation for overall wellbeing. Your food choices support good energy levels, proper recovery, and long-term health.",
      recommendations: "Continue prioritizing whole, nutrient-dense foods in your diet. Experiment with new healthy recipes to maintain variety. Consider timing your meals around your activity schedule. Focus on maintaining consistent portion sizes."
    },
    'very-healthy': {
      feedback: "Your diet demonstrates an excellent commitment to optimal nutrition and health. Your food choices provide ideal support for energy, recovery, and performance.",
      recommendations: "Maintain your excellent nutrition habits while staying open to new healthy options. Fine-tune meal timing around your activities for optimal performance. Share your nutrition knowledge with others. Consider advanced nutrition strategies for specific goals."
    }
  },
  mealFrequency: {
    '1-2': {
      feedback: "Eating only 1-2 meals per day can make it challenging to meet nutritional needs and maintain energy. This pattern may impact metabolism and energy levels throughout the day.",
      recommendations: "Gradually add small, balanced meals to your daily routine. Focus on consistent meal timing and balanced portions. Consider protein-rich snacks to maintain energy. Work towards 3-4 balanced meals per day."
    },
    '2-3': {
      feedback: "Your meal frequency provides basic nutrition but could be optimized for better energy levels. Adding structured meals or snacks can help maintain steady energy.",
      recommendations: "Add nutritious snacks between your main meals to stabilize energy. Plan your meals around your daily activities and exercise. Include protein with each meal for sustained energy. Consider pre and post-workout nutrition timing."
    },
    '3-4': {
      feedback: "This meal frequency supports steady energy levels and consistent nutrition throughout the day. This pattern allows for good portion control and regular fueling.",
      recommendations: "Focus on meal quality and timing around your daily activities. Ensure each meal is balanced with proper nutrients. Plan meals around your activity schedule. Keep portions consistent between meals."
    },
    '4-5': {
      feedback: "Your meal frequency helps maintain consistent energy levels and supports metabolism. This pattern can be beneficial for appetite control and steady nutrient intake.",
      recommendations: "Monitor portion sizes to ensure total daily intake aligns with your goals. Time meals around your activity schedule. Include protein with each meal and snack. Keep healthy snacks available for between meals."
    },
    '5+': {
      feedback: "Frequent meals can support steady energy but require careful planning and portion control. This pattern works well for high activity levels when properly managed.",
      recommendations: "Ensure each meal is appropriately sized and contains quality nutrients. Plan meals around your daily activities and exercise. Monitor total daily intake across all meals. Consider working with a nutritionist for meal planning."
    }
  },
  lastMeal: {
    'before-6pm': {
      feedback: "Early dinner timing supports optimal digestion and may benefit sleep quality. This schedule allows adequate time for digestion before bed.",
      recommendations: "Maintain this meal timing if it aligns well with your schedule and energy needs. Consider having a light protein snack if needed. Monitor your morning hunger levels. Adjust timing if your activity schedule changes."
    },
    '6pm-8pm': {
      feedback: "This dinner timing works well for most people's schedules and circadian rhythms. It allows sufficient time for digestion before sleep.",
      recommendations: "Try to maintain consistent timing to support your body's natural rhythms. Consider your activity schedule when planning dinner. Keep portions moderate at this time of day. Allow 2-3 hours before bedtime."
    },
    '8pm-10pm': {
      feedback: "Later evening meals may impact sleep quality and digestion for some people. Consider how this timing affects your sleep and morning energy.",
      recommendations: "If possible, try to have dinner earlier to allow more time for digestion before bed. Choose lighter options for late dinners. Avoid heavy or spicy foods at this time. Monitor how this timing affects your sleep."
    },
    'after-10pm': {
      feedback: "Very late meals can interfere with sleep quality and natural digestive patterns. This timing may impact morning appetite and energy levels.",
      recommendations: "Work towards earlier dinner times to support better sleep and digestion. Choose light, easily digestible foods if eating late. Consider adjusting your daily schedule to allow earlier meals. Monitor sleep quality and morning energy."
    }
  },
  sleepDuration: {
    'less-than-6': {
      feedback: "Your sleep duration is below the recommended amount for optimal health and recovery. Insufficient sleep can impact various aspects of health and daily performance.",
      recommendations: "Prioritize sleep by setting a consistent bedtime and aiming for 7-9 hours. Create a relaxing bedtime routine. Remove electronic devices from your bedroom. Keep your sleeping environment dark, quiet, and cool."
    },
    '6-7': {
      feedback: "Your sleep duration is slightly below optimal levels for most adults. Even small increases in sleep time can provide significant benefits.",
      recommendations: "Work on adding another 30-60 minutes of sleep gradually. Maintain consistent sleep and wake times. Create an optimal sleep environment. Limit screen time before bed and use blue light filters."
    },
    '7-8': {
      feedback: "Your sleep duration is within the healthy range for adults. This amount supports basic recovery and daily function.",
      recommendations: "Consider adding another 30 minutes if you feel you need more rest. Focus on improving sleep quality. Keep consistent sleep and wake times. Create an optimal sleep environment."
    },
    '8-9': {
      feedback: "Your sleep duration is optimal for supporting health and recovery. This amount allows for complete sleep cycles and proper restoration.",
      recommendations: "Maintain this excellent sleep duration while focusing on sleep quality. Keep consistent sleep and wake times. Continue optimizing your sleep environment. Monitor your energy levels and adjust as needed."
    },
    'more-than-9': {
      feedback: "While adequate sleep is important, consistently sleeping more than 9 hours might indicate other factors to consider. Pay attention to sleep quality and daytime energy.",
      recommendations: "Monitor your energy levels and sleep quality. Consider adjusting sleep timing if needed. Evaluate your sleep environment and routine. Consult a healthcare provider if excessive sleepiness persists."
    }
  },
  sleepQuality: {
    poor: {
      feedback: "Poor sleep quality significantly impacts recovery, performance, and overall health. Quality sleep is essential for physical and mental restoration.",
      recommendations: "Focus on improving your sleep environment and establishing a calming bedtime routine. Consider factors that might be disrupting your sleep. Limit caffeine and screen time before bed. Practice relaxation techniques."
    },
    fair: {
      feedback: "Your sleep quality provides basic recovery but has room for improvement. Enhanced sleep quality can significantly impact daily energy and wellbeing.",
      recommendations: "Optimize your bedroom environment and limit screen time before bed. Develop a consistent pre-sleep routine. Consider using sleep-tracking tools. Create boundaries between work and rest time."
    },
    good: {
      feedback: "Good sleep quality supports effective recovery and daily performance. Your sleep patterns allow for proper physical and mental restoration.",
      recommendations: "Maintain your good sleep habits while looking for ways to enhance them further. Consider relaxation techniques before bed. Keep tracking sleep patterns and quality. Adjust your routine based on daily activities."
    },
    excellent: {
      feedback: "Your excellent sleep quality optimizes recovery and supports overall health. Quality sleep enhances all aspects of physical and mental wellbeing.",
      recommendations: "Continue your effective sleep practices and monitor any changes. Share your successful sleep strategies with others. Stay aware of factors that contribute to your good sleep. Maintain your consistent sleep schedule."
    }
  },
  recovery: {
    poor: {
      feedback: "Poor recovery can limit progress and increase the risk of burnout or injury. Effective recovery is essential for adapting to training and maintaining health.",
      recommendations: "Prioritize rest days and improve sleep quality. Include active recovery and stress management techniques. Monitor your training load and adjust accordingly. Consider working with a recovery specialist."
    },
    fair: {
      feedback: "Your recovery allows for basic adaptation but could be enhanced for better results. Improved recovery can lead to better performance and consistency.",
      recommendations: "Balance your workload with adequate rest periods. Implement specific recovery techniques between sessions. Focus on sleep quality and nutrition. Use active recovery methods on rest days."
    },
    good: {
      feedback: "Good recovery practices support consistent progress and help prevent burnout. Your approach allows for proper adaptation to training demands.",
      recommendations: "Maintain your recovery practices while monitoring fatigue levels. Adjust based on training intensity and life stress. Continue focusing on sleep quality and nutrition. Track recovery markers and adjust accordingly."
    },
    excellent: {
      feedback: "Your excellent recovery practices optimize adaptation and support consistent performance. This approach helps prevent burnout and supports long-term progress.",
      recommendations: "Continue your effective recovery routine while staying mindful of changing needs. Adjust strategies based on training demands. Share your recovery knowledge with others. Keep optimizing your recovery toolkit."
    }
  },
  stress: {
    'very-high': {
      feedback: "Very high stress levels can significantly impact both physical and mental health. This level of stress requires active management and support.",
      recommendations: "Prioritize stress reduction techniques such as meditation or deep breathing. Consider professional support to develop coping strategies. Create boundaries between work and personal life. Focus on activities that help you relax and recharge."
    },
    high: {
      feedback: "High stress levels need attention to prevent impact on health and wellbeing. Managing stress is crucial for both physical and mental health.",
      recommendations: "Implement daily stress management practices like meditation or yoga. Evaluate your current stressors and identify which ones can be reduced. Consider lifestyle adjustments to reduce stress load. Maintain regular exercise and adequate sleep."
    },
    moderate: {
      feedback: "Moderate stress levels are manageable but warrant attention for optimal health. Some stress is normal, but maintaining balance is important.",
      recommendations: "Practice regular relaxation techniques and monitor your stress triggers. Build resilience through consistent stress management. Maintain a healthy work-life balance. Stay connected with your support system."
    },
    low: {
      feedback: "Low stress levels support good health and daily function. Your stress management appears effective for current life demands.",
      recommendations: "Maintain your effective stress management practices. Stay prepared for periods of increased stress. Share your successful stress management techniques. Consider learning advanced relaxation techniques."
    },
    'very-low': {
      feedback: "Very low stress levels indicate excellent stress management or low stress exposure. This state supports optimal health and wellbeing.",
      recommendations: "Continue your effective stress management while staying prepared for challenges. Share your successful strategies with others. Maintain awareness of potential stressors. Keep your coping strategies ready."
    }
  },
  mentalHealth: {
    'often': {
      feedback: "Your mental health indicates a need for additional support and attention. Mental wellbeing is fundamental to overall health and quality of life.",
      recommendations: "Consider speaking with a mental health professional for support. Establish daily self-care practices like mindfulness. Build a strong support system through friends and family. Create a routine that includes regular exercise and outdoor activities."
    },
    'sometimes': {
      feedback: "Your mental health could benefit from additional support and practices. Small improvements in mental wellness can have significant benefits.",
      recommendations: "Develop daily mental wellness practices such as meditation or mindfulness. Consider professional guidance for coping strategies. Stay connected with supportive people. Create a balanced routine with regular exercise and proper sleep."
    },
    'rarely': {
      feedback: "Your mental health practices support overall wellbeing and resilience. This foundation helps manage daily challenges effectively.",
      recommendations: "Continue your mental wellness routine while exploring new support strategies. Maintain connections with your support system. Consider learning advanced stress management techniques. Stay proactive about mental health."
    },
    'never': {
      feedback: "Your mental health practices demonstrate strong self-awareness and effective coping strategies. This foundation supports overall life satisfaction.",
      recommendations: "Maintain your excellent mental wellness practices while staying open to new strategies. Share your successful approaches with others. Consider becoming a mental health advocate. Keep monitoring your mental wellbeing."
    }
  },
  socializing: {
    rarely: {
      feedback: "Limited social interaction may impact mental wellbeing and support systems. Social connections play an important role in overall health.",
      recommendations: "Start with small, comfortable social activities that align with your interests. Consider both in-person and online connections. Join groups or communities centered around your hobbies. Schedule regular check-ins with family or friends."
    },
    occasionally: {
      feedback: "Occasional social interaction provides basic connection but could be enhanced. Regular social engagement can improve mental wellbeing.",
      recommendations: "Gradually increase social activities that align with your comfort level. Consider joining groups or classes that meet regularly. Look for opportunities to deepen existing relationships. Balance structured social events with casual meetups."
    },
    regularly: {
      feedback: "Regular social interaction supports mental health and provides consistent support. Your social patterns help maintain good emotional wellbeing.",
      recommendations: "Maintain your social connections while looking for ways to deepen them. Balance social time with personal needs. Consider organizing group activities or events. Share interests and activities with friends to build stronger bonds."
    },
    frequently: {
      feedback: "Frequent social interaction provides strong support for mental wellbeing. Your social engagement supports emotional health and creates a robust network.",
      recommendations: "Balance your social activities with other life demands and personal time. Focus on nurturing meaningful relationships. Consider ways to give back to your social community. Maintain boundaries while fostering connections."
    }
  }
}; 