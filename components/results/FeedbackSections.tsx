'use client'

import { AITriggerButton } from "@/components/ai/AITriggerButton"
import { Section } from "@/components/common/Section"
import type { HealthCalculations } from "@/types/results"
import type { ContextualAnalysis } from "@/types/ContextualAnalysis"
import { feedbackMap } from "@/utils/feedbackData"
import { Brain } from "lucide-react"

interface FeedbackSectionsProps {
  answers: Record<string, any>
  healthCalculations: HealthCalculations
}

export function FeedbackSections({ answers, healthCalculations }: FeedbackSectionsProps) {
  const getFeedbackColor = (value: any, itemType: string) => {
    if (!value) return "red"
    
    // Convert values to scores
    let score = 0
    switch (itemType) {
      case 'activityLevel':
        score = value === 'sedentary' ? 30 :
                value === 'light' ? 50 :
                value === 'moderate' ? 75 : 90
        break
      case 'exerciseIntensity':
        score = value === 'none' ? 30 :
                value === 'light' ? 50 :
                value === 'moderate' ? 75 : 90
        break
      case 'exerciseDuration':
        score = value === 'none' || value === '0-15' ? 30 :
                value === '15-30' ? 50 :
                value === '30-45' ? 75 : 90
        break
      case 'dietQuality':
        score = value === 'poor' ? 30 :
                value === 'fair' ? 50 :
                value === 'good' ? 75 : 90
        break
      case 'sleepQuality':
        score = value === 'poor' ? 30 :
                value === 'fair' ? 50 :
                value === 'good' ? 75 : 90
        break
      case 'stressLevel':
        score = value === 'very-high' ? 30 :
                value === 'high' ? 50 :
                value === 'moderate' ? 75 : 90
        break
      default:
        score = 50
    }
    
    return score >= 80 ? "green" :
           score >= 60 ? "amber" : "red"
  }

  const getFeedbackText = (value: any, itemType: string) => {
    if (!value) return "No data provided"
    
    const feedbackData = feedbackMap[itemType as keyof typeof feedbackMap]
    if (feedbackData) {
      const itemFeedback = feedbackData[value as keyof typeof feedbackData]
      if (itemFeedback) {
        return itemFeedback.feedback
      }
    }
    return "Keep monitoring this metric"
  }

  const getRecommendations = (value: any, itemType: string): string[] => {
    if (!value) return ["Start tracking this metric"]
    
    const feedbackData = feedbackMap[itemType as keyof typeof feedbackMap]
    if (feedbackData) {
      const itemFeedback = feedbackData[value as keyof typeof feedbackData]
      if (itemFeedback) {
        return itemFeedback.recommendations
      }
    }
    return ["Consider consulting a health professional for personalized advice"]
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
          recommendations: getRecommendations(answers[item], item)
        }
      })),
      contextualAnalyses: [{
        severity: healthCalculations.exerciseScore < 60 ? 'warning' : 'info',
        title: "Exercise Analysis",
        feedback: `Your exercise score is ${healthCalculations.exerciseScore}%`,
        recommendations: [
          "Aim for 150 minutes of moderate exercise per week",
          "Include both cardio and strength training",
          "Ensure proper form and technique",
          "Allow adequate recovery between sessions"
        ]
      }]
    },
    {
      title: "Diet & Nutrition",
      items: ["dietQuality", "mealFrequency", "waterIntake"].map(item => ({
        label: item.replace(/([A-Z])/g, ' $1').trim(),
        value: answers[item] || 'N/A',
        feedback: {
          color: getFeedbackColor(answers[item], item),
          feedback: getFeedbackText(answers[item], item),
          recommendations: getRecommendations(answers[item], item)
        }
      })),
      contextualAnalyses: [{
        severity: healthCalculations.nutritionScore < 60 ? 'warning' : 'info',
        title: "Nutrition Analysis",
        feedback: `Your nutrition score is ${healthCalculations.nutritionScore}%`,
        recommendations: [
          "Focus on whole, unprocessed foods",
          "Ensure adequate protein intake",
          "Stay hydrated throughout the day",
          "Time meals appropriately around exercise"
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
          recommendations: getRecommendations(answers[item], item)
        }
      })),
      contextualAnalyses: [{
        severity: healthCalculations.sleepScore < 60 ? 'warning' : 'info',
        title: "Recovery Analysis",
        feedback: `Your recovery score is ${healthCalculations.sleepScore}%`,
        recommendations: [
          "Aim for 7-9 hours of quality sleep",
          "Maintain consistent sleep schedule",
          "Create optimal sleep environment",
          "Practice stress management"
        ]
      }]
    },
    {
      id: 'mental-health',
      title: 'Mental Health',
      description: 'Your mental health is crucial for overall wellbeing.',
      severity: healthCalculations.mentalHealthScore < 60 ? 'warning' : 'info',
      icon: <Brain className="h-5 w-5" />,
      feedback: `Your mental health score is ${healthCalculations.mentalHealthScore}%`,
      items: ["mentalHealth", "socialFrequency", "stressLevel"].map(item => ({
        label: item.replace(/([A-Z])/g, ' $1').trim(),
        value: answers[item] || 'N/A',
        feedback: {
          color: getFeedbackColor(answers[item], item),
          feedback: getFeedbackText(answers[item], item),
          recommendations: getRecommendations(answers[item], item)
        }
      })),
      contextualAnalyses: [{
        severity: healthCalculations.mentalHealthScore < 60 ? 'warning' : 'info',
        title: "Mental Health Analysis",
        feedback: `Your mental health score is ${healthCalculations.mentalHealthScore}%`,
        recommendations: [
          "Practice regular stress management",
          "Maintain social connections",
          "Seek support when needed",
          "Focus on overall wellbeing"
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