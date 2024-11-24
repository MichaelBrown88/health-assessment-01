'use client'

import { AITriggerButton } from "@/components/ai/AITriggerButton"
import { Section } from "@/components/common/Section"
import type { HealthCalculations } from "@/types/results"
import type { ContextualAnalysis } from "@/types/ContextualAnalysis"

interface FeedbackSectionsProps {
  answers: Record<string, any>
  healthCalculations: HealthCalculations
}

export function FeedbackSections({ answers, healthCalculations }: FeedbackSectionsProps) {
  const getFeedbackColor = (value: any, itemType: string) => {
    if (!value) return "red"
    
    switch (itemType) {
      case 'activityLevel':
        return value === 'sedentary' ? "red" :
               value === 'light' ? "yellow" : "green"
      case 'exerciseIntensity':
        return value === 'none' ? "red" :
               value === 'light' ? "yellow" : "green"
      case 'exerciseDuration':
        return value === 'none' || value === '0-15' ? "red" :
               value === '15-30' ? "yellow" : "green"
      default:
        return "yellow"
    }
  }

  const getFeedbackText = (value: any, itemType: string) => {
    if (!value) return "No data provided"
    
    switch (itemType) {
      case 'activityLevel':
        return value === 'sedentary' ? "Consider increasing your daily activity level" :
               value === 'light' ? "Good start, but try to be more active" : "Great activity level!"
      case 'exerciseIntensity':
        return value === 'none' ? "Start with light exercise to build habits" :
               value === 'light' ? "Try to increase intensity gradually" : "Excellent exercise intensity!"
      // Add other cases as needed
      default:
        return "Keep monitoring this metric"
    }
  }

  const sections = [
    {
      title: "Exercise Habits",
      items: ["activityLevel", "exerciseIntensity", "exerciseDuration"].map(item => ({
        label: item.replace(/([A-Z])/g, ' $1').trim(),
        value: answers[item] || 'N/A',
        feedback: {
          color: getFeedbackColor(answers[item], item),
          feedback: getFeedbackText(answers[item], item),
          recommendations: ["Start with small changes", "Set realistic goals"]
        }
      })),
      contextualAnalyses: [{
        severity: healthCalculations.exerciseScore < 60 ? 'warning' : 'info',
        title: "Exercise Analysis",
        feedback: `Your exercise score is ${healthCalculations.exerciseScore}%`,
        recommendations: [
          "Aim for 150 minutes of moderate exercise per week",
          "Include both cardio and strength training"
        ]
      }]
    },
    {
      title: "Diet & Nutrition",
      items: ["mealFrequency", "dietQuality", "waterIntake"].map(item => ({
        label: item.replace(/([A-Z])/g, ' $1').trim(),
        value: answers[item] || 'N/A',
        feedback: {
          color: getFeedbackColor(answers[item], item),
          feedback: getFeedbackText(answers[item], item),
          recommendations: ["Focus on balanced meals", "Stay hydrated throughout the day"]
        }
      })),
      contextualAnalyses: [{
        severity: healthCalculations.nutritionScore < 60 ? 'warning' : 'info',
        title: "Nutrition Analysis",
        feedback: `Your nutrition score is ${healthCalculations.nutritionScore}%`,
        recommendations: [
          "Include more whole foods in your diet",
          "Balance your macronutrients"
        ]
      }]
    },
    {
      title: "Rest & Recovery",
      items: ["sleepQuality", "sleepDuration", "stressLevel"].map(item => ({
        label: item.replace(/([A-Z])/g, ' $1').trim(),
        value: answers[item] || 'N/A',
        feedback: {
          color: getFeedbackColor(answers[item], item),
          feedback: getFeedbackText(answers[item], item),
          recommendations: ["Establish a bedtime routine", "Practice stress management"]
        }
      })),
      contextualAnalyses: [{
        severity: healthCalculations.sleepScore < 60 ? 'warning' : 'info',
        title: "Recovery Analysis",
        feedback: `Your recovery score is ${healthCalculations.sleepScore}%`,
        recommendations: [
          "Aim for 7-9 hours of sleep",
          "Create a relaxing sleep environment"
        ]
      }]
    },
    {
      title: "Mental Health",
      items: ["mentalWellbeing", "socialConnections", "workLifeBalance"].map(item => ({
        label: item.replace(/([A-Z])/g, ' $1').trim(),
        value: answers[item] || 'N/A',
        feedback: {
          color: getFeedbackColor(answers[item], item),
          feedback: getFeedbackText(answers[item], item),
          recommendations: ["Practice mindfulness", "Maintain social connections"]
        }
      })),
      contextualAnalyses: [{
        severity: healthCalculations.mentalHealthScore < 60 ? 'warning' : 'info',
        title: "Mental Health Analysis",
        feedback: `Your mental health score is ${healthCalculations.mentalHealthScore}%`,
        recommendations: [
          "Take regular breaks during the day",
          "Engage in activities you enjoy"
        ]
      }]
    }
  ];

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <Section
          key={section.title}
          title={section.title}
          items={section.items}
          contextualAnalyses={section.contextualAnalyses}
        >
          <AITriggerButton 
            assessmentData={{
              answers,
              healthCalculations,
              score: 0
            }}
            variant="icon"
            size="small"
          />
        </Section>
      ))}
    </div>
  )
} 