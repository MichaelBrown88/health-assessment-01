import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, MinusCircle, XCircle, AlertTriangle } from "lucide-react"
import { AnswerType } from '../types/Question'
import { HealthCalculations } from '../hooks/useHealthCalculations'
import { calculateScore, getTrafficLightColor, getFeedback, getItemScore, getHealthGoalAdvice, getGeneralAdvice } from '../utils/healthUtils'

interface AnalysisResultProps {
  answers: AnswerType
  healthCalculations: HealthCalculations
  onRetake: () => void
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ answers, healthCalculations, onRetake }) => {
  const { bmi, bmiCategory, bmr, tdee, recommendedCalories, proteinGrams, carbGrams, fatGrams, bodyFat, isBodyFatEstimated, idealWeightLow, idealWeightHigh } = healthCalculations
  const score = calculateScore(answers, bmi)
  const overallColor = getTrafficLightColor(score)

  const renderFeedbackItem = (label: string, value: string, feedback: { feedback: string, color: string }) => (
    <li className="mb-4">
      <div className="flex items-start space-x-2">
        {feedback.color === "green" ? (
          <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
        ) : feedback.color === "amber" ? (
          <MinusCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
        )}
        <div>
          <span className="font-semibold">{label}:</span> {value}
          <p className="text-sm mt-1">{feedback.feedback}</p>
        </div>
      </div>
    </li>
  )

  const renderSection = (title: string, items: { label: string, value: string, feedback: ReturnType<typeof getFeedback> }[], score: number) => (
    <section className="mb-8 bg-white bg-opacity-5 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-left border-b border-gray-700 pb-2">{title}</h3>
      <div className="mb-4">
        <Progress value={score} className="h-2" />
        <p className="text-sm mt-1 text-right">{score}%</p>
      </div>
      <ul className="list-none pl-0 space-y-2 text-left">
        {items.map((item, index) => renderFeedbackItem(item.label, item.value, item.feedback))}
      </ul>
    </section>
  )

  const getSummary = () => {
    const sections = [
      { title: "Exercise Habits", items: ["activityLevel", "exerciseIntensity", "exerciseDuration"] },
      { title: "Diet and Nutrition", items: ["diet", "lastMeal", "mealFrequency"] },
      { title: "Rest and Recovery", items: ["sleepDuration", "sleepQuality", "recovery"] },
      { title: "Mental Health", items: ["stress", "mentalHealth", "socializing"] },
    ]

    return sections.map(section => {
      const sectionScores = section.items.map(item => {
        const itemScore = getItemScore(item, answers[item])
        return { item, score: itemScore, color: getTrafficLightColor(itemScore), feedback: getFeedback(item, answers[item], itemScore) }
      })

      const averageScore = sectionScores.reduce((sum, item) => sum + item.score, 0) / sectionScores.length

      return {
        title: section.title,
        score: Math.round(averageScore),
        feedbackItems: sectionScores
      }
    })
  }

  const summary = getSummary()

  const isGoalMisaligned = () => {
    const goals = answers.goals as string[]
    return (bmiCategory === "Underweight" && goals.includes("weight-loss")) ||
           (bmiCategory === "Obese" && goals.includes("muscle-gain"))
  }

  return (
    <div className="space-y-8 text-left">
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Health Analysis</h2>
        <div className="bg-white bg-opacity-10 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Overall Health Score</h3>
          <p className="text-3xl font-bold mb-2">{score}/100</p>
          <Progress value={score} className="h-2 mb-4" />
          <p className="mb-2">
            {score >= 80 ? "Excellent! You're on track for optimal health." :
             score >= 60 ? "Good job! There's room for improvement in some areas." :
             "There are several areas where you can improve your health. Let's work on that!"}
          </p>
        </div>
      </section>

      {isGoalMisaligned() && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning: Misaligned Goals</AlertTitle>
          <AlertDescription>
            Your current health status and selected goals may not be well-aligned. We recommend reassessing your goals or consulting with a healthcare professional.
          </AlertDescription>
          <Button onClick={onRetake} className="mt-2">Retake Assessment</Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white bg-opacity-10">
          <CardHeader>
            <CardTitle>Body Composition</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">BMI:</dt>
                <dd>{bmi} ({bmiCategory})</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Body Fat:</dt>
                <dd>
                  {bodyFat?.toFixed(1)}%
                  {isBodyFatEstimated && (
                    <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded">Estimated</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Weight:</dt>
                <dd>{answers.weight} kg</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Height:</dt>
                <dd>{answers.height} cm</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Ideal Weight Range:</dt>
                <dd>{idealWeightLow} - {idealWeightHigh} kg</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">BMR:</dt>
                <dd>{Math.round(bmr)} calories/day</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">TDEE:</dt>
                <dd>{Math.round(tdee)} calories/day</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="bg-white bg-opacity-10">
          <CardHeader>
            <CardTitle>Recommended Daily Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Based on your goals, current status, and carbohydrate preference, we recommend:</p>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Calories:</dt>
                <dd>{recommendedCalories} kcal</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Protein:</dt>
                <dd>{proteinGrams}g ({Math.round((proteinGrams * 4 / recommendedCalories) * 100)}%)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Carbohydrates:</dt>
                <dd>{carbGrams}g ({Math.round((carbGrams * 4 / recommendedCalories) * 100)}%)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Fat:</dt>
                <dd>{fatGrams}g ({Math.round((fatGrams * 9 / recommendedCalories) * 100)}%)</dd>
              </div>
            </dl>
            <p className="text-sm text-gray-400 mt-4">Note: These recommendations are tailored to your carbohydrate preference. Consult with a nutritionist for a personalized plan.</p>
          </CardContent>
        </Card>
      </div>

      <section className="bg-white bg-opacity-5 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Health Goals</h3>
        {Array.isArray(answers.goals) && answers.goals.length > 0 ? (
          <Tabs defaultValue={answers.goals[0]}>
            <TabsList>
              {answers.goals.map((goal, index) => (
                <TabsTrigger key={index} value={goal}>{goal.replace('-', ' ')}</TabsTrigger>
              ))}
            </TabsList>
            {answers.goals.map((goal, index) => (
              <TabsContent key={index} value={goal}>
                <p>{getHealthGoalAdvice([goal])[0]}</p>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <p>No health goals selected.</p>
        )}
      </section>

      {summary.map((section, index) => (
        <div key={index}>
          {renderSection(
            section.title,
            section.feedbackItems.map(item => ({
              label: item.item,
              value: answers[item.item] as string,
              feedback: item.feedback
            })),
            section.score
          )}
          <div className="mb-8 p-4 bg-white bg-opacity-5 rounded-lg">
            <h4 className="font-semibold mb-2">General Advice</h4>
            <p>{getGeneralAdvice(section.title)}</p>
          </div>
        </div>
      ))}

      <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">Summary</h3>
        <div className="space-y-6">
          {summary.map((section, index) => (
            <div key={index} className={`rounded-lg p-4 ${getTrafficLightColor(section.score) === 'red' ? 'bg-red-900 bg-opacity-20' : getTrafficLightColor(section.score) === 'amber' ? 'bg-yellow-900 bg-opacity-20' : 'bg-green-900 bg-opacity-20'}`}>
              <h5 className="font-medium mb-2">{section.title}</h5>
              <Progress value={section.score} className="h-2 mb-2" />
              <p className="text-sm">{section.score}% - {getTrafficLightColor(section.score) === 'green' ? 'Excellent' : getTrafficLightColor(section.score) === 'amber' ? 'Good, but room for improvement' : 'Needs attention'}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Areas for Improvement:</h4>
          <ul className="list-disc pl-5">
            {summary.filter(section => getTrafficLightColor(section.score) !== 'green').map((section, index) => (
              <li key={index}>{section.title}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Areas of Strength:</h4>
          <ul className="list-disc pl-5">
            {summary.filter(section => getTrafficLightColor(section.score) === 'green').map((section, index) => (
              <li key={index}>{section.title}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white bg-opacity-5 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
        <p className="mb-4">To improve your overall health score:</p>
        <ol className="list-decimal list-inside space-y-2 mb-6">
          <li>Focus on the areas for improvement identified in your summary.</li>
          <li>Continue maintaining your areas of strength.</li>
          <li>Track your progress regularly and adjust your plan as needed.</li>
          <li>Consult with healthcare professionals for personalized advice, especially before making significant changes to your diet or exercise routine.</li>
        </ol>
        <p className="mb-4">If you&apos;d like expert guidance on implementing these steps and creating a personalized plan to achieve your health goals, we&apos;re here to help.</p>
        <Button onClick={() => window.open('https://us.calendar.onefitnessstudio.com/widget/booking/WO8S14kouB3wo6cg7fkD', '_blank')} className="w-full">
          Book a Free Discovery Call
        </Button>
        <p className="text-sm text-gray-400 mt-2 text-center">Speak with one of our health experts to create your personalized action plan.</p>
      </section>
    </div>
  )
}
