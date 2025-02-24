import { Star, TrendingUp, AlertCircle, ArrowRight, Target, BarChart } from "lucide-react";
import type { HealthCalculations } from "@/types/results";
import { Card } from "@/components/core/card"

const SCORING_WEIGHTS = {
  exercise: 0.3,    // 30%
  nutrition: 0.3,   // 30%
  mentalHealth: 0.2,   // 20%
  sleep: 0.2        // 20%
};

interface SummaryProps {
  answers: Record<string, any>;
  healthCalculations: HealthCalculations;
  getFeedbackColor: (value: any, itemType: string) => string;
}

interface HealthPillar {
  title: string;
  items: string[];
  score: number;
}

interface ActionItem {
  pillar: string;
  action: string;
  impact: string;
  timeframe: string;
}

export function Summary({ answers, healthCalculations, getFeedbackColor }: SummaryProps) {
  const healthPillars: HealthPillar[] = [
    {
      title: "Exercise Habits",
      items: ["activityLevel", "exerciseIntensity", "exerciseDuration"],
      score: healthCalculations.exerciseScore
    },
    {
      title: "Nutrition",
      items: ["diet", "mealFrequency", "lastMeal"],
      score: healthCalculations.nutritionScore
    },
    {
      title: "Rest & Recovery",
      items: ["sleepQuality", "sleepDuration", "recovery"],
      score: healthCalculations.sleepScore
    },
    {
      title: "Mental Health",
      items: ["mentalHealth", "socializing", "stress"],
      score: healthCalculations.mentalHealthScore
    }
  ];

  // Identify strengths and areas for improvement
  const strengths = healthPillars.filter(pillar => 
    pillar.items.every(item => getFeedbackColor(answers[item], item) === "green")
  );

  const areasForImprovement = healthPillars.filter(pillar =>
    pillar.items.some(item => ["amber", "red"].includes(getFeedbackColor(answers[item], item)))
  );

  // Get specific action items based on assessment results
  const getSpecificActionItems = (): ActionItem[] => {
    const actionItems: ActionItem[] = [];
    const itemsToImprove = healthPillars.flatMap(pillar => 
      pillar.items.map(item => ({
        pillar: pillar.title,
        item,
        value: answers[item],
        color: getFeedbackColor(answers[item], item)
      }))
    ).filter(item => item.color === 'red' || item.color === 'amber')
     .sort((a, b) => a.color === 'red' ? -1 : 1);

    const actionMap = {
      lastMeal: {
        'after-10pm': {
          action: "Have your last meal before 8pm to improve digestion and sleep quality",
          impact: "30-40% improvement in meal timing score",
          timeframe: "1-2 weeks"
        },
        '8pm-10pm': {
          action: "Aim to have your last meal between 6-8pm",
          impact: "15-25% improvement in meal timing score",
          timeframe: "1 week"
        }
      },
      sleepDuration: {
        'less-than-5': {
          action: "Gradually increase sleep duration by 30 minutes each week",
          impact: "40-50% improvement in sleep score",
          timeframe: "3-4 weeks"
        },
        '5-7': {
          action: "Establish a consistent bedtime to achieve 7-9 hours of sleep",
          impact: "25-35% improvement in sleep score",
          timeframe: "2-3 weeks"
        }
      },
      activityLevel: {
        'sedentary': {
          action: "Start with 10-minute walks twice daily, gradually increase duration",
          impact: "30-40% improvement in activity score",
          timeframe: "4-6 weeks"
        },
        'light': {
          action: "Add 30-minute moderate exercise sessions 3 times per week",
          impact: "20-30% improvement in activity score",
          timeframe: "3-4 weeks"
        }
      },
      diet: {
        'unhealthy': {
          action: "Replace processed foods with whole foods in one meal per day",
          impact: "35-45% improvement in diet score",
          timeframe: "2-3 weeks"
        },
        'average': {
          action: "Increase vegetable intake to 2-3 servings per meal",
          impact: "20-30% improvement in diet score",
          timeframe: "2 weeks"
        }
      },
      mealFrequency: {
        '1-2': {
          action: "Add nutritious snacks to reach 3-4 meals per day",
          impact: "30-40% improvement in meal frequency score",
          timeframe: "1-2 weeks"
        },
        '5+': {
          action: "Consolidate snacks into 3-4 balanced main meals",
          impact: "15-25% improvement in meal frequency score",
          timeframe: "1-2 weeks"
        }
      },
      sleepQuality: {
        'poor': {
          action: "Create a relaxing bedtime routine and optimize sleep environment",
          impact: "35-45% improvement in sleep quality score",
          timeframe: "2-3 weeks"
        },
        'fair': {
          action: "Limit screen time before bed and maintain consistent sleep schedule",
          impact: "20-30% improvement in sleep quality score",
          timeframe: "2 weeks"
        }
      },
      recovery: {
        'poor': {
          action: "Implement active recovery days with light stretching and walking",
          impact: "35-45% improvement in recovery score",
          timeframe: "2-3 weeks"
        },
        'fair': {
          action: "Add 10-15 minutes of post-workout stretching",
          impact: "20-30% improvement in recovery score",
          timeframe: "2 weeks"
        }
      },
      mentalHealth: {
        'often': {
          action: "Practice daily mindfulness or meditation for 10 minutes",
          impact: "35-45% improvement in mental health score",
          timeframe: "4-6 weeks"
        },
        'sometimes': {
          action: "Incorporate daily stress-management techniques",
          impact: "20-30% improvement in mental health score",
          timeframe: "3-4 weeks"
        }
      },
      socializing: {
        'rarely': {
          action: "Schedule one social activity per week",
          impact: "35-45% improvement in social score",
          timeframe: "4-6 weeks"
        },
        'occasionally': {
          action: "Increase social interactions to 2-3 times per week",
          impact: "20-30% improvement in social score",
          timeframe: "2-3 weeks"
        }
      },
      stress: {
        'very-high': {
          action: "Practice 5-minute breathing exercises twice daily",
          impact: "35-45% improvement in stress management score",
          timeframe: "4-6 weeks"
        },
        'high': {
          action: "Add regular stress-relief activities like yoga or journaling",
          impact: "20-30% improvement in stress management score",
          timeframe: "3-4 weeks"
        }
      }
    };

    itemsToImprove.forEach(({ pillar, item, value }) => {
      const recommendation = actionMap[item as keyof typeof actionMap]?.[value as string];
      if (recommendation) {
        actionItems.push({
          pillar,
          ...recommendation
        });
      }
    });

    if (actionItems.length === 0) {
      actionItems.push({
        pillar: "Overall Health",
        action: "Maintain your current healthy habits and consider setting new goals",
        impact: "Will help sustain your excellent health scores",
        timeframe: "Ongoing"
      });
    }

    return actionItems.slice(0, 5);
  };

  const actionItems = getSpecificActionItems();

  // Calculate weighted overall score
  const calculateWeightedScore = () => {
    const weightedScore = 
      (healthCalculations.exerciseScore * SCORING_WEIGHTS.exercise) +
      (healthCalculations.nutritionScore * SCORING_WEIGHTS.nutrition) +
      (healthCalculations.mentalHealthScore * SCORING_WEIGHTS.mentalHealth) +
      (healthCalculations.sleepScore * SCORING_WEIGHTS.sleep);

    // Add BMI adjustment
    let bmiAdjustment = 0;
    if (healthCalculations.bmi !== null) {
      if (healthCalculations.bmi < 18.5 || healthCalculations.bmi >= 30) {
        bmiAdjustment = -10;
      } else if (healthCalculations.bmi >= 25) {
        bmiAdjustment = -5;
      }
    }

    return Math.max(0, Math.min(100, Math.round(weightedScore + bmiAdjustment)));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Assessment Summary & Action Plan</h2>
        <div className="flex items-center space-x-2">
          <BarChart className="w-5 h-5 text-blue-400" />
          <span className="text-lg font-medium">
            Overall Score: {calculateWeightedScore()}%
          </span>
        </div>
      </div>
      
      {/* Strengths Section */}
      {strengths.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-medium">Areas of Excellence</h3>
          </div>
          <p className="text-gray-300">
            You're performing exceptionally well in {strengths.map(s => s.title.toLowerCase()).join(", ")}.
            These strong foundations will support your overall health journey.
          </p>
        </div>
      )}

      {/* Areas for Improvement Section */}
      {areasForImprovement.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-medium">Priority Focus Areas</h3>
          </div>
          <p className="text-gray-300">
            Your assessment indicates opportunities for improvement in {areasForImprovement.map(a => a.title.toLowerCase()).join(", ")}.
            The action plan below outlines specific steps to enhance these areas.
          </p>
        </div>
      )}

      {/* Action Plan Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-medium">Your Personalized Action Plan</h3>
        </div>
        <div className="space-y-4">
          {actionItems.map((item, index) => (
            <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
              <div className="flex items-start space-x-3">
                <ArrowRight className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-emerald-400 font-medium mb-1">{item.pillar}</p>
                  <p className="text-gray-300 mb-2">{item.action}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Impact: {item.impact}</span>
                    <span>Timeframe: {item.timeframe}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Assessment Section */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-medium">Preparing for Your Next Assessment</h3>
        </div>
        <p className="text-gray-300 mb-3">
          Following this action plan can lead to significant improvements in your next assessment:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start space-x-2">
            <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />
            <p className="text-gray-300">Track your progress using a health journal or app</p>
          </li>
          <li className="flex items-start space-x-2">
            <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />
            <p className="text-gray-300">Schedule a follow-up assessment in 4-6 weeks</p>
          </li>
          <li className="flex items-start space-x-2">
            <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />
            <p className="text-gray-300">Consider working with health professionals for personalized guidance</p>
          </li>
        </ul>
      </div>
    </Card>
  );
} 