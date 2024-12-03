'use client'

import { Card } from "@/components/ui/card"
import type { HealthCalculations, AnswerType } from "@/types/results"
import type { FeedbackMap } from "@/types/feedback"
import { FeedbackItem } from "./feedback/FeedbackItem"
import { getFeedbackColor, getFeedbackText, formatDisplayValue, normalizeValue } from "@/utils/feedback"
import { getContextualAnalyses } from "@/utils/feedback/contextual"
import { ContextualAlert } from "@/components/common/ContextualAlert"

interface FeedbackSectionsProps {
  answers: AnswerType;
  healthCalculations: HealthCalculations;
}

interface FeedbackItemData {
  label: string;
  value: string;
  type: keyof FeedbackMap;
}

interface FeedbackSection {
  title: string;
  score: number;
  items: FeedbackItemData[];
}

export function FeedbackSections({ answers, healthCalculations }: FeedbackSectionsProps) {
  const sections: FeedbackSection[] = [
    {
      title: "Exercise",
      score: Math.min(100, Math.max(0, healthCalculations.exerciseScore || 0)),
      items: [
        {
          label: "Activity Level",
          value: String(answers.activityLevel || ''),
          type: 'activityLevel'
        },
        {
          label: "Exercise Intensity",
          value: String(answers.exerciseIntensity || ''),
          type: 'exerciseIntensity'
        },
        {
          label: "Exercise Duration",
          value: String(answers.exerciseDuration || ''),
          type: 'exerciseDuration'
        }
      ]
    },
    {
      title: "Diet & Nutrition",
      score: Math.min(100, Math.max(0, healthCalculations.nutritionScore || 0)),
      items: [
        {
          label: "Overall Diet",
          value: String(answers.diet || ''),
          type: 'diet'
        },
        {
          label: "Meal Frequency",
          value: String(answers.mealFrequency || ''),
          type: 'mealFrequency'
        },
        {
          label: "Last Meal Timing",
          value: String(answers.lastMeal || ''),
          type: 'lastMeal'
        }
      ]
    },
    {
      title: "Rest & Recovery",
      score: Math.min(100, Math.max(0, healthCalculations.sleepScore || 0)),
      items: [
        {
          label: "Sleep Duration",
          value: String(answers.sleepDuration || ''),
          type: 'sleepDuration'
        },
        {
          label: "Sleep Quality",
          value: String(answers.sleepQuality || ''),
          type: 'sleepQuality'
        },
        {
          label: "Recovery",
          value: String(answers.recovery || ''),
          type: 'recovery'
        }
      ]
    },
    {
      title: "Mental Health",
      score: Math.min(100, Math.max(0, healthCalculations.wellbeingScore || 0)),
      items: [
        {
          label: "Stress Level",
          value: String(answers.stress || ''),
          type: 'stress'
        },
        {
          label: "Mental Wellbeing",
          value: String(answers.mentalHealth || ''),
          type: 'mentalHealth'
        },
        {
          label: "Social Activity",
          value: String(answers.socializing || ''),
          type: 'socializing'
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {sections.map((section) => {
        const contextualAnalyses = getContextualAnalyses(section.title, answers);
        
        return (
          <Card key={section.title} className="bg-black/30 backdrop-blur-sm border-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-gray-800 to-transparent p-3 rounded-lg">
                <h3 className="text-xl font-semibold">{section.title}</h3>
                <div className="text-lg font-medium">
                  Score: {Math.min(100, Math.round(section.score))}%
                </div>
              </div>
              <div className="space-y-6">
                {section.items.map((item) => {
                  const normalizedValue = normalizeValue(item.value);
                  const displayValue = formatDisplayValue(item.value);
                  return (
                    <FeedbackItem
                      key={item.label}
                      label={item.label}
                      value={displayValue}
                      color={getFeedbackColor(normalizedValue, item.type)}
                      feedback={getFeedbackText(item.type, normalizedValue)}
                    />
                  );
                })}
              </div>
              
              {contextualAnalyses && contextualAnalyses.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <ContextualAlert analysis={contextualAnalyses} />
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
} 