export const feedbackMap = {
  activityLevel: {
    sedentary: {
      feedback: "Your sedentary lifestyle puts you at increased health risk.",
      recommendations: [
        "Start with daily walks of 10-15 minutes",
        "Take regular breaks from sitting",
        "Use a standing desk if possible",
        "Take stairs instead of elevator when possible"
      ]
    },
    light: {
      feedback: "You're moving, but could benefit from more regular activity.",
      recommendations: [
        "Aim to increase daily steps to 7,000-8,000",
        "Try to include 2-3 structured exercise sessions per week",
        "Add light resistance training",
        "Consider active hobbies like gardening or dancing"
      ]
    },
    moderate: {
      feedback: "Good level of activity that supports basic health.",
      recommendations: [
        "Consider adding variety to your activities",
        "Include both cardio and strength training",
        "Try group fitness classes for motivation",
        "Set specific fitness goals"
      ]
    },
    active: {
      feedback: "Excellent activity level that promotes optimal health.",
      recommendations: [
        "Maintain current activity level",
        "Ensure adequate recovery between sessions",
        "Consider periodization in your training",
        "Focus on performance goals"
      ]
    }
  },
  exerciseIntensity: {
    none: {
      feedback: "Lack of exercise can impact overall health and wellbeing.",
      recommendations: [
        "Start with walking or gentle exercises",
        "Find activities you enjoy",
        "Set small, achievable goals",
        "Consider working with a fitness professional"
      ]
    },
    light: {
      feedback: "Light exercise is a good starting point for building fitness.",
      recommendations: [
        "Gradually increase intensity",
        "Add resistance training with light weights",
        "Try interval walking",
        "Include flexibility work"
      ]
    },
    moderate: {
      feedback: "Moderate intensity exercise provides good health benefits.",
      recommendations: [
        "Mix cardio and strength training",
        "Consider adding HIIT sessions",
        "Track your progress",
        "Include recovery days"
      ]
    },
    vigorous: {
      feedback: "High-intensity exercise can maximize fitness gains.",
      recommendations: [
        "Ensure proper form and technique",
        "Monitor recovery and fatigue",
        "Include deload weeks",
        "Focus on nutrition timing"
      ]
    }
  },
  dietQuality: {
    poor: {
      feedback: "Your diet needs significant improvement for optimal health.",
      recommendations: [
        "Focus on whole, unprocessed foods",
        "Increase fruit and vegetable intake",
        "Reduce processed food consumption",
        "Consider meal planning"
      ]
    },
    fair: {
      feedback: "Your diet provides basic nutrition but could be optimized.",
      recommendations: [
        "Increase variety in food choices",
        "Add more colorful vegetables",
        "Choose whole grains over refined",
        "Include lean protein sources"
      ]
    },
    good: {
      feedback: "Your diet supports good health with room for optimization.",
      recommendations: [
        "Fine-tune meal timing",
        "Consider nutrient timing around exercise",
        "Optimize protein distribution",
        "Include healthy fats"
      ]
    },
    excellent: {
      feedback: "Your diet supports optimal health and performance.",
      recommendations: [
        "Maintain current healthy habits",
        "Consider seasonal adjustments",
        "Track energy levels",
        "Adjust portions based on activity"
      ]
    }
  },
  sleepQuality: {
    poor: {
      feedback: "Poor sleep significantly impacts health and recovery.",
      recommendations: [
        "Establish a consistent sleep schedule",
        "Create a relaxing bedtime routine",
        "Optimize sleep environment",
        "Limit screen time before bed"
      ]
    },
    fair: {
      feedback: "Your sleep could be improved for better recovery.",
      recommendations: [
        "Aim for consistent sleep/wake times",
        "Create a darker sleep environment",
        "Reduce caffeine after mid-day",
        "Practice relaxation techniques"
      ]
    },
    good: {
      feedback: "Your sleep supports good recovery and health.",
      recommendations: [
        "Maintain consistent sleep schedule",
        "Monitor sleep quality",
        "Adjust based on exercise intensity",
        "Consider sleep tracking"
      ]
    },
    excellent: {
      feedback: "Your sleep habits support optimal recovery.",
      recommendations: [
        "Maintain current sleep routine",
        "Adjust sleep needs with activity",
        "Monitor recovery markers",
        "Keep consistent schedule"
      ]
    }
  },
  stressLevel: {
    "very-high": {
      feedback: "Your stress levels may be impacting your health significantly.",
      recommendations: [
        "Consider professional support",
        "Practice stress management techniques",
        "Prioritize self-care",
        "Establish boundaries"
      ]
    },
    high: {
      feedback: "High stress levels can affect your health and recovery.",
      recommendations: [
        "Implement stress reduction strategies",
        "Practice regular meditation",
        "Include regular exercise",
        "Ensure adequate sleep"
      ]
    },
    moderate: {
      feedback: "You're managing stress but could optimize further.",
      recommendations: [
        "Continue stress management practices",
        "Build in regular relaxation time",
        "Practice mindfulness",
        "Stay active to manage stress"
      ]
    },
    low: {
      feedback: "Your stress management supports good health.",
      recommendations: [
        "Maintain current practices",
        "Monitor stress triggers",
        "Continue healthy coping strategies",
        "Stay physically active"
      ]
    }
  },
  mentalHealth: {
    never: {
      feedback: "You rarely experience anxiety or low mood, which is excellent.",
      recommendations: [
        "Maintain your current mental wellness practices",
        "Continue engaging in activities you enjoy",
        "Keep your support system strong",
        "Share your successful strategies with others"
      ]
    },
    rarely: {
      feedback: "You occasionally experience anxiety or low mood, but manage well overall.",
      recommendations: [
        "Build on your current mental wellness practices",
        "Stay connected with your support network",
        "Continue regular self-care activities",
        "Monitor any changes in your mental state"
      ]
    },
    sometimes: {
      feedback: "You experience anxiety or low mood several times a week.",
      recommendations: [
        "Consider speaking with a mental health professional",
        "Develop additional coping strategies",
        "Increase self-care activities",
        "Build a stronger support network"
      ]
    },
    often: {
      feedback: "You frequently experience anxiety or low mood, which needs attention.",
      recommendations: [
        "Reach out to a mental health professional",
        "Connect with supportive friends or family",
        "Establish a daily self-care routine",
        "Focus on basic wellness (sleep, exercise, nutrition)"
      ]
    }
  },
  socialFrequency: {
    daily: {
      feedback: "You maintain excellent social connections with daily interaction.",
      recommendations: [
        "Continue nurturing your social relationships",
        "Balance social time with personal time",
        "Maintain the quality of your interactions",
        "Share activities with your social circle"
      ]
    },
    weekly: {
      feedback: "You have regular social interaction on a weekly basis.",
      recommendations: [
        "Consider increasing social activities if possible",
        "Plan regular social events",
        "Stay connected through various channels",
        "Engage in group activities or hobbies"
      ]
    },
    monthly: {
      feedback: "Your social interaction could be increased for better wellbeing.",
      recommendations: [
        "Try to increase frequency of social connections",
        "Schedule regular catch-ups with friends",
        "Join groups or clubs of interest",
        "Use technology to stay connected between meetings"
      ]
    },
    rarely: {
      feedback: "Limited social interaction may impact your wellbeing.",
      recommendations: [
        "Look for opportunities to increase social contact",
        "Consider joining community groups",
        "Reach out to old friends or family",
        "Try social activities aligned with your interests"
      ]
    },
    never: {
      feedback: "Lack of social interaction can significantly impact mental health.",
      recommendations: [
        "Consider professional support to build social skills",
        "Start with small social interactions",
        "Join online communities of shared interests",
        "Gradually build your social network"
      ]
    }
  },
  socializing: {
    frequently: {
      feedback: "You maintain excellent social connections with frequent interaction.",
      recommendations: [
        "Continue nurturing your social relationships",
        "Balance social time with personal time",
        "Maintain the quality of your interactions",
        "Share activities with your social circle"
      ]
    },
    regularly: {
      feedback: "You have regular social interaction on a weekly basis.",
      recommendations: [
        "Consider increasing social activities if possible",
        "Plan regular social events",
        "Stay connected through various channels",
        "Engage in group activities or hobbies"
      ]
    },
    occasionally: {
      feedback: "Your social interaction could be increased for better wellbeing.",
      recommendations: [
        "Try to increase frequency of social connections",
        "Schedule regular catch-ups with friends",
        "Join groups or clubs of interest",
        "Use technology to stay connected between meetings"
      ]
    },
    rarely: {
      feedback: "Limited social interaction may impact your wellbeing.",
      recommendations: [
        "Look for opportunities to increase social contact",
        "Consider joining community groups",
        "Reach out to old friends or family",
        "Try social activities aligned with your interests"
      ]
    }
  },
  stress: {
    "very-high": {
      feedback: "Your stress levels may be impacting your health significantly.",
      recommendations: [
        "Consider professional support",
        "Practice stress management techniques",
        "Prioritize self-care",
        "Establish boundaries"
      ]
    },
    high: {
      feedback: "High stress levels can affect your health and recovery.",
      recommendations: [
        "Implement stress reduction strategies",
        "Practice regular meditation",
        "Include regular exercise",
        "Ensure adequate sleep"
      ]
    },
    moderate: {
      feedback: "You're managing stress but could optimize further.",
      recommendations: [
        "Continue stress management practices",
        "Build in regular relaxation time",
        "Practice mindfulness",
        "Stay active to manage stress"
      ]
    },
    low: {
      feedback: "Your stress management supports good health.",
      recommendations: [
        "Maintain current practices",
        "Monitor stress triggers",
        "Continue healthy coping strategies",
        "Stay physically active"
      ]
    }
  }
}; 