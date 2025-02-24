'use client'

import { useState } from "react"
import { AICoachButton } from '@/components/ai/AICoachButton'
import { Section } from "@/components/shared/common/Section"
import { Summary } from "./Summary"
import type { HealthCalculations } from "@/types/results"
import type { ContextualAnalysis } from "@/types/ContextualAnalysis"
import { feedbackMap } from "@/utils/feedbackData"
import { Brain } from "lucide-react"

interface FeedbackSectionsProps {
  answers: Record<string, any>
  healthCalculations: HealthCalculations
}

function capitalizeWords(str: string): string {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
                value === 'moderate' ? 75 :
                value === 'active' ? 90 : 100
        break
      case 'exerciseIntensity':
        score = value === 'none' ? 30 :
                value === 'light' ? 60 :
                value === 'moderate' ? 80 :
                value === 'vigorous' ? 100 : 90
        break
      case 'exerciseDuration':
        score = value === 'less-than-30' ? 50 :
                value === '30-45' ? 75 :
                value === '45-60' ? 100 : 90
        break
      case 'diet':
        score = value === 'unhealthy' ? 30 :
                value === 'average' ? 60 :
                value === 'healthy' ? 80 :
                value === 'very-healthy' ? 100 : 0
        break
      case 'mealFrequency':
        score = value === '1-2' ? 50 :
                value === '3-4' ? 100 :
                value === '5+' ? 80 : 0
        break
      case 'lastMeal':
        score = value === 'after-10pm' ? 50 :
                value === '8pm-10pm' ? 70 :
                value === '6pm-8pm' ? 100 :
                value === 'before-6pm' ? 90 : 0
        break
      case 'sleepQuality':
        score = value === 'poor' ? 30 :
                value === 'fair' ? 60 :
                value === 'good' ? 80 :
                value === 'excellent' ? 100 : 0
        break
      case 'sleepDuration':
        score = value === 'less-than-5' ? 30 :
                value === '5-7' ? 60 :
                value === '7-9' ? 100 :
                value === 'more-than-9' ? 70 : 0
        break
      case 'recovery':
        score = value === 'poor' ? 30 :
                value === 'fair' ? 60 :
                value === 'good' ? 80 :
                value === 'excellent' ? 100 : 0
        break
      case 'mentalHealth':
        score = value === 'often' ? 30 :
                value === 'sometimes' ? 60 :
                value === 'rarely' ? 80 :
                value === 'never' ? 100 : 0
        break
      case 'socializing':
        score = value === 'rarely' ? 30 :
                value === 'occasionally' ? 60 :
                value === 'regularly' ? 80 :
                value === 'frequently' ? 100 : 0
        break
      case 'stress':
        score = value === 'very-high' ? 30 :
                value === 'high' ? 50 :
                value === 'moderate' ? 75 :
                value === 'low' ? 100 : 0
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
        label: capitalizeWords(item.replace(/([A-Z])/g, ' $1').trim()),
        value: answers[item] || 'N/A',
        feedback: {
          color: getFeedbackColor(answers[item], item),
          feedback: getFeedbackText(answers[item], item),
          recommendations: getRecommendations(answers[item], item)
        }
      })),
      contextualAnalyses: []
    },
    {
      title: "Nutrition",
      items: ["diet", "mealFrequency", "lastMeal"].map(item => ({
        label: item === 'diet' ? 'Diet Quality' :
              item === 'mealFrequency' ? 'Meal Frequency' :
              item === 'lastMeal' ? 'Last Meal Time' : 
              capitalizeWords(item.replace(/([A-Z])/g, ' $1').trim()),
        value: answers[item] || 'N/A',
        feedback: {
          color: getFeedbackColor(answers[item], item),
          feedback: getFeedbackText(answers[item], item),
          recommendations: getRecommendations(answers[item], item)
        }
      })),
      contextualAnalyses: []
    },
    {
      title: "Rest & Recovery",
      items: ["sleepQuality", "sleepDuration", "recovery"].map(item => ({
        label: item === 'sleepQuality' ? 'Sleep Quality' :
              item === 'sleepDuration' ? 'Sleep Duration' :
              item === 'recovery' ? 'Recovery Quality' :
              capitalizeWords(item.replace(/([A-Z])/g, ' $1').trim()),
        value: answers[item] || 'N/A',
        feedback: {
          color: getFeedbackColor(answers[item], item),
          feedback: getFeedbackText(answers[item], item),
          recommendations: getRecommendations(answers[item], item)
        }
      })),
      contextualAnalyses: []
    },
    {
      title: "Mental Health",
      items: ["mentalHealth", "socializing", "stress"].map(item => ({
        label: item === 'mentalHealth' ? 'Mental Health Status' :
              item === 'socializing' ? 'Social Frequency' :
              item === 'stress' ? 'Stress Levels' :
              capitalizeWords(item.replace(/([A-Z])/g, ' $1').trim()),
        value: answers[item] || 'N/A',
        feedback: {
          color: getFeedbackColor(answers[item], item),
          feedback: getFeedbackText(answers[item], item),
          recommendations: getRecommendations(answers[item], item)
        }
      })),
      contextualAnalyses: []
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
          <AICoachButton 
            assessmentData={{
              answers,
              healthCalculations,
              score: 0
            }}
          />
        </Section>
      ))}
      
      <Summary 
        answers={answers}
        healthCalculations={healthCalculations}
        getFeedbackColor={getFeedbackColor}
      />
    </div>
  )
} 