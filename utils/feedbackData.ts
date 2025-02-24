export const feedbackMap = {
  activityLevel: {
    sedentary: {
      feedback: "Your current activity level indicates a predominantly sedentary lifestyle. Regular movement is essential for maintaining health and preventing long-term health issues. Even small increases in daily activity can lead to significant improvements in your overall wellbeing.",
      recommendations: "Start with short 10-minute walks throughout your day. Take regular movement breaks during work hours. Consider using a standing desk or walking during phone calls. Set hourly reminders to move and stretch."
    },
    light: {
      feedback: "You're maintaining a light activity level which provides basic health benefits. While this is a good foundation, increasing your activity could enhance your energy levels, mood, and overall fitness. Your body will adapt positively to gradual increases in movement.",
      recommendations: "Progress to 30-minute daily walks at a comfortable pace. Add structured exercise 2-3 times weekly. Try different activities to find what you enjoy most. Track your daily steps to maintain motivation and progress."
    },
    moderate: {
      feedback: "Your moderate activity level demonstrates a solid commitment to staying active. This supports various aspects of your health, from cardiovascular fitness to mental wellbeing. Your consistent effort provides a strong foundation for further improvements.",
      recommendations: "Explore different types of activities to challenge yourself. Include regular strength training sessions. Set specific fitness goals to maintain motivation. Monitor your progress and adjust intensity as needed."
    },
    active: {
      feedback: "Your high activity level shows strong dedication to fitness and health. This level of movement provides numerous benefits, including improved energy levels, better stress management, and enhanced overall health. Your commitment sets a positive example for others.",
      recommendations: "Focus on maintaining this excellent activity level while preventing burnout. Balance intense activity with proper recovery periods. Consider periodization to optimize your training. Set new challenges while listening to your body's signals."
    }
  },
  exerciseIntensity: {
    light: {
      feedback: "Light-intensity exercise provides a safe and effective starting point for fitness. While gentle on your body, it still offers important health benefits and helps build a foundation for more challenging workouts.",
      recommendations: "Gradually increase workout intensity as your fitness improves. Incorporate basic resistance exercises to build strength. Try interval walking (alternating normal and brisk pace). Monitor your perceived exertion to guide progression."
    },
    moderate: {
      feedback: "Your moderate-intensity workouts hit the sweet spot for health benefits. This level of exercise effectively improves cardiovascular fitness, supports weight management, and enhances overall wellbeing.",
      recommendations: "Mix cardio and strength training for balanced fitness. Use heart rate monitoring to optimize intensity. Include variety in your workout routine. Plan regular active recovery sessions."
    },
    vigorous: {
      feedback: "Your high-intensity approach to exercise maximizes fitness gains and time efficiency. This level of training can significantly improve performance and metabolic health when properly managed.",
      recommendations: "Pay extra attention to form and technique during intense sessions. Monitor recovery between workouts to prevent overtraining. Include deload weeks every 4-6 weeks. Focus on post-workout nutrition and recovery."
    }
  },
  exerciseDuration: {
    'less-than-30': {
      feedback: "Short workouts can be effective but may need more time to achieve optimal results. While any exercise is beneficial, gradually increasing duration can enhance overall fitness benefits.",
      recommendations: "Gradually increase workout duration by 5 minutes each week. Focus on maintaining intensity during shorter sessions. Add additional short sessions throughout the day when possible."
    },
    '30-45': {
      feedback: "Your workout duration provides a good balance for most fitness goals. This time frame allows for effective warm-up, main workout, and cool-down phases.",
      recommendations: "Maintain consistent workout schedule. Focus on workout quality and intensity. Consider periodization to optimize your training time. Monitor progress and adjust as needed."
    },
    '45-60': {
      feedback: "Your workout duration is excellent for comprehensive fitness development. This timeframe allows for thorough training sessions while managing fatigue and recovery.",
      recommendations: "Ensure proper warm-up and cool-down within this duration. Monitor intensity levels throughout the session. Focus on progressive overload while maintaining form. Plan recovery days to prevent overtraining."
    }
  },
  diet: {
    unhealthy: {
      feedback: "Your current dietary patterns may be limiting your health potential. Small, consistent improvements in food choices can lead to significant positive changes in your energy, mood, and overall wellbeing.",
      recommendations: "Start by adding one serving of vegetables to your main meals. Gradually reduce processed food intake and replace with whole foods. Plan your meals ahead to avoid impulsive food choices. Stay hydrated by keeping water easily accessible."
    },
    average: {
      feedback: "Your diet provides basic nutrition but has room for optimization. Making strategic improvements to your food choices can enhance your energy levels, recovery, and long-term health outcomes.",
      recommendations: "Increase the variety of colorful vegetables and fruits in your diet. Focus on quality protein sources at each meal. Choose whole grains over refined options when possible. Consider meal prep to maintain consistent healthy eating."
    },
    healthy: {
      feedback: "Your healthy eating habits demonstrate a strong commitment to nutrition. Your diet supports good health and performance, with potential for fine-tuning to achieve optimal results.",
      recommendations: "Experiment with meal timing around your activities. Consider tracking macronutrients for optimal balance. Explore new healthy recipes to maintain variety. Pay attention to portion sizes and hunger cues."
    },
    'very-healthy': {
      feedback: "Your excellent dietary habits show a deep understanding of nutrition's role in health. This level of attention to diet quality optimally supports your activity, recovery, and overall wellbeing.",
      recommendations: "Maintain your current healthy eating patterns while staying flexible. Fine-tune nutrition timing around workouts. Monitor how different foods affect your energy and performance. Share your healthy eating strategies with others."
    }
  },
  mealFrequency: {
    '1-2': {
      feedback: "Your current meal frequency might be affecting your energy levels and metabolism. Spreading your nutrition throughout the day can help stabilize blood sugar and support consistent energy levels.",
      recommendations: "Add small, nutritious snacks between your current meals. Prepare easy-to-grab healthy options in advance. Consider setting regular meal times. Start with breakfast to fuel your day."
    },
    '3-4': {
      feedback: "Your meal frequency provides a good balance for most people. This pattern can support stable energy levels, appetite control, and proper nutrient timing throughout the day.",
      recommendations: "Focus on balanced nutrition at each meal. Time meals around your daily activities. Keep healthy snacks available if needed. Listen to your body's hunger signals."
    },
    '5+': {
      feedback: "Your frequent eating pattern can support high activity levels and metabolism. Ensure each eating occasion contributes to your overall nutrition goals while maintaining portion control.",
      recommendations: "Keep portions appropriate for more frequent meals. Focus on nutrient-dense foods at each eating occasion. Time meals around workouts for optimal energy. Monitor total daily intake across all meals."
    }
  },
  lastMeal: {
    'before-6pm': {
      feedback: "Early last meal timing supports quality sleep and recovery. This schedule allows your body to properly digest before sleep and can enhance overnight recovery processes.",
      recommendations: "Maintain your current meal timing pattern. Ensure adequate calories and nutrients in your last meal. Consider a light protein snack if needed for overnight recovery."
    },
    '6pm-8pm': {
      feedback: "Your meal timing works well for most daily schedules. This window allows for proper digestion while maintaining social and practical eating patterns.",
      recommendations: "Monitor how this timing affects your sleep quality. Adjust meal size based on evening activity levels. Consider a light snack if needed before bed."
    },
    '8pm-10pm': {
      feedback: "Later meals may impact sleep quality and recovery. While sometimes necessary, late eating can affect your body's natural circadian rhythm.",
      recommendations: "Try to gradually shift dinner earlier when possible. Keep evening meals lighter and easier to digest. Monitor how meal timing affects your sleep quality."
    },
    'after-10pm': {
      feedback: "Very late meals may disrupt sleep patterns and recovery. Late-night eating can affect sleep quality and morning energy levels.",
      recommendations: "Work on planning earlier dinner times when possible. Keep very late meals light and easily digestible. Monitor sleep quality and morning energy levels."
    }
  },
  sleepQuality: {
    poor: {
      feedback: "Your sleep quality significantly impacts your daily performance, recovery, and overall health. Poor sleep can affect everything from energy levels to decision-making and emotional wellbeing.",
      recommendations: "Create a calming bedtime routine to signal sleep time. Optimize your bedroom environment for better sleep. Limit screen time and blue light exposure before bed. Track your sleep patterns to identify improvement opportunities."
    },
    fair: {
      feedback: "While you're getting some rest, there's room to improve your sleep quality. Better sleep can enhance your recovery, mental clarity, and daily performance.",
      recommendations: "Maintain consistent sleep and wake times every day. Create an optimal sleep environment with minimal distractions. Monitor caffeine intake, especially after noon. Practice relaxation techniques before bedtime."
    },
    good: {
      feedback: "Your good sleep quality provides a strong foundation for health and recovery. Quality sleep supports everything from muscle recovery to cognitive function and emotional resilience.",
      recommendations: "Continue maintaining regular sleep patterns. Adjust sleep timing based on activity levels. Monitor factors that positively affect your sleep. Consider sleep's role in your fitness goals."
    },
    excellent: {
      feedback: "Your excellent sleep quality maximizes your body's recovery and regeneration processes. This level of sleep quality optimally supports your physical and mental performance.",
      recommendations: "Maintain your current sleep hygiene practices. Adjust sleep duration based on activity levels. Share your successful sleep strategies. Monitor any changes that might affect sleep."
    }
  },
  sleepDuration: {
    'less-than-5': {
      feedback: "Your sleep duration is below the recommended range for optimal health and recovery. Insufficient sleep can impact physical performance, mental clarity, and overall wellbeing.",
      recommendations: "Prioritize getting more sleep by adjusting your schedule. Establish an earlier bedtime routine. Create a consistent sleep schedule. Monitor factors that limit your sleep time."
    },
    '5-7': {
      feedback: "Your sleep duration is below optimal range for most adults. While you may be functioning, increasing sleep duration could improve various aspects of your health and performance.",
      recommendations: "Work on gradually increasing your sleep duration. Improve sleep efficiency through better sleep habits. Review your schedule to find opportunities for more sleep."
    },
    '7-9': {
      feedback: "Your sleep duration falls within the optimal range for adults. This amount of sleep supports proper recovery, cognitive function, and overall health maintenance.",
      recommendations: "Maintain your consistent sleep schedule. Focus on sleep quality within this duration. Monitor your energy levels throughout the day. Adjust sleep duration based on activity levels."
    },
    'more-than-9': {
      feedback: "Your extended sleep duration might indicate a need to assess sleep quality or underlying health factors. While some people need more sleep, consistently long sleep periods warrant attention.",
      recommendations: "Evaluate your sleep quality and efficiency. Monitor daytime energy levels and alertness. Consider consulting a healthcare provider about your sleep patterns."
    }
  },
  recovery: {
    poor: {
      feedback: "Your recovery status indicates a need for improved rest and regeneration. Poor recovery can impact performance, progress, and overall health outcomes.",
      recommendations: "Increase dedicated rest periods between activities. Focus on improving sleep quality and duration. Monitor and manage stress levels. Consider active recovery techniques."
    },
    fair: {
      feedback: "Your recovery shows room for improvement but provides a foundation to build upon. Better recovery practices can enhance your progress and performance.",
      recommendations: "Optimize your recovery strategies and timing. Balance workload with adequate rest periods. Include active recovery sessions. Monitor sleep quality and nutrition."
    },
    good: {
      feedback: "Your good recovery status supports consistent performance and progress. This level of recovery allows for adequate adaptation to training and stress.",
      recommendations: "Maintain your balance of activity and recovery. Monitor fatigue levels regularly. Adjust intensity based on recovery status. Continue effective recovery practices."
    },
    excellent: {
      feedback: "Your excellent recovery status maximizes adaptation and performance potential. This level of recovery supports optimal training responses and stress management.",
      recommendations: "Maintain your current recovery practices. Monitor any changes in recovery quality. Adjust training load based on recovery status. Share effective recovery strategies."
    }
  },
  mentalHealth: {
    never: {
      feedback: "Your strong mental health status reflects excellent emotional resilience and coping strategies. This provides a solid foundation for handling life's challenges and maintaining overall wellbeing. Your approach to mental wellness is highly effective.",
      recommendations: "Continue practicing your effective coping strategies. Share your mental wellness approaches with others. Stay connected with your support network. Monitor and maintain your current stress management techniques."
    },
    rarely: {
      feedback: "Your mental health shows good resilience with occasional challenges. This balance indicates effective coping strategies while acknowledging normal life stressors. Your awareness and management of mental health is commendable.",
      recommendations: "Build upon your existing coping mechanisms. Maintain regular check-ins with your support system. Practice preventive mental wellness activities. Keep track of what strategies work best for you."
    },
    sometimes: {
      feedback: "You're experiencing moderate mental health challenges that deserve attention. Addressing these feelings can improve your overall quality of life and daily functioning. Your awareness of these challenges is an important first step.",
      recommendations: "Consider speaking with a mental health professional for guidance. Establish regular self-care practices. Build a stronger support network. Learn and practice new stress management techniques."
    },
    often: {
      feedback: "Your frequent mental health challenges indicate a need for additional support and strategies. Remember that seeking help is a sign of strength and self-awareness. Taking action now can lead to significant improvements in your wellbeing.",
      recommendations: "Reach out to a mental health professional for support. Develop a daily mental wellness routine. Strengthen your support network. Focus on basic self-care practices and stress management."
    }
  },
  socializing: {
    frequently: {
      feedback: "Your high level of social engagement provides excellent support for mental and emotional wellbeing. Regular social connections can enhance resilience, provide emotional support, and contribute to overall life satisfaction.",
      recommendations: "Maintain your valuable social connections while balancing personal time. Nurture the quality of your relationships. Share activities and interests with your social circle. Consider mentoring or supporting others."
    },
    regularly: {
      feedback: "Your regular social interactions provide a healthy foundation for social wellbeing. This balanced approach to socializing supports mental health while maintaining personal space.",
      recommendations: "Continue nurturing your existing social connections. Consider expanding your social network through shared interests. Plan regular social activities or check-ins. Balance social time with personal activities."
    },
    occasionally: {
      feedback: "Your occasional social engagement might benefit from more regular connections. Increasing social interaction can enhance emotional support, reduce stress, and improve overall wellbeing.",
      recommendations: "Schedule regular catch-ups with friends or family. Join groups or activities aligned with your interests. Use technology to stay connected between in-person meetings. Create opportunities for casual social interactions."
    },
    rarely: {
      feedback: "Your limited social engagement might be impacting your overall wellbeing. Social connections play a crucial role in mental health, emotional support, and life satisfaction.",
      recommendations: "Start small with manageable social interactions. Explore community groups or online communities. Reconnect with old friends or family members. Consider professional support for social anxiety if needed."
    }
  },
  stress: {
    low: {
      feedback: "Your low stress levels indicate excellent stress management and life balance. This state supports optimal mental and physical health, allowing you to perform at your best. Your approach to stress management is highly effective.",
      recommendations: "Maintain your effective stress management practices. Document successful strategies for future reference. Share your stress management techniques with others. Stay mindful of potential stressors and address them early."
    },
    moderate: {
      feedback: "Your moderate stress levels are manageable but could benefit from additional coping strategies. Some stress is normal and can be motivating when properly managed. Your awareness of stress levels shows good self-monitoring.",
      recommendations: "Enhance your existing stress management techniques. Practice regular relaxation or mindfulness. Maintain consistent exercise as a stress outlet. Identify and address main sources of stress proactively."
    },
    high: {
      feedback: "Your high stress levels may be impacting various aspects of your health and wellbeing. Addressing stress is crucial for both mental and physical health maintenance. Taking action now can prevent long-term effects of chronic stress.",
      recommendations: "Prioritize daily stress reduction activities. Consider professional support for stress management. Evaluate and adjust life commitments where possible. Establish regular relaxation and self-care practices."
    },
    'very-high': {
      feedback: "Your very high stress levels require immediate attention and support. This level of stress can significantly impact your health, relationships, and daily functioning. Taking action now is essential for your wellbeing.",
      recommendations: "Seek professional support for stress management. Implement immediate stress reduction strategies. Review and adjust major stress sources. Focus on essential self-care and stress relief practices."
    }
  }
}; 