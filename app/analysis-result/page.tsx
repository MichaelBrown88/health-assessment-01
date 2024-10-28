'use client'

import React, { useMemo, useCallback, useEffect } from 'react'  // Add these imports
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { AnswerType } from '@/data/questions'
import { useHealthCalculations } from '@/hooks/useHealthCalculations'
import { calculateScore, getHealthGoalAdvice, getSectionFeedback } from '@/utils/healthUtils'
import { BodyCompositionCard } from '@/components/BodyCompositionCard'
import { RecommendedIntakeCard } from '@/components/RecommendedIntakeCard'
import { Section } from '@/components/Section'
import { cn } from "@/lib/utils" // Make sure this import is present
import { HealthScoreOverview } from '@/components/HealthScoreOverview'
import { formatTitle } from '@/utils/healthUtils'
import { useAISummary } from '@/hooks/useAISummary'
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { useAuth } from '@/contexts/AuthContext'
import { saveAssessmentResult } from '@/lib/db'
import { SpaceTheme } from '@/components/SpaceTheme'

type Section = {
  title: string;
  score: number;
  feedbackItems: Array<{
    item: string;
    score: number;
    color: string;
    feedback: string;
    recommendations: string;
  }>;
};

const getSummary = (answers: AnswerType) => {
  const sections = [
    { title: "Exercise Habits", items: ["activityLevel", "exerciseIntensity", "exerciseDuration"] },
    { title: "Diet and Nutrition", items: ["diet", "lastMeal", "mealFrequency"] },
    { title: "Rest and Recovery", items: ["sleepDuration", "sleepQuality", "recovery"] },
    { title: "Mental Health", items: ["stress", "mentalHealth", "socializing"] },
  ];

  return sections.map(section => {
    const sectionFeedback = section.items.map(item => {
      const answer = answers[item];
      const feedback = getSectionFeedback(item, typeof answer === 'string' ? answer : answer.toString());
      return {
        item,
        ...feedback,
      };
    });

    const averageScore = sectionFeedback.reduce((sum, item) => sum + item.score, 0) / sectionFeedback.length;

    return {
      title: section.title,
      score: Math.round(averageScore),
      feedbackItems: sectionFeedback,
    };
  });
};

export default function AnalysisResultPage() {
  const searchParams = useSearchParams()
  const answersParam = searchParams?.get('answers')
  const answers: AnswerType = useMemo(() => {
    if (!answersParam) return {};
    try {
      return JSON.parse(decodeURIComponent(answersParam));
    } catch (error) {
      console.error('Error parsing answers:', error);
      return {}; // Return an empty object on error
    }
  }, [answersParam]);

  const healthCalculations = useHealthCalculations(answers)

  const router = useRouter()

  const handleRetake = useCallback(() => {
    router.push('/health-assessment')
  }, [router])

  const score: number = useMemo(() => {
    const calculatedScore = calculateScore(answers, healthCalculations);
    return typeof calculatedScore === 'number' ? calculatedScore : 0;
  }, [answers, healthCalculations]);

  const summary = useMemo(() => getSummary(answers), [answers]);
  const { aiSummary, isLoading, error } = useAISummary(summary);

  const generateSummary = () => {
    const improvements: { section: string; items: string[] }[] = [];
    const strengths: string[] = [];
    const sectionSummaries: { section: string; summary: string }[] = [];

    summary.forEach((section: Section) => {
      const improvementItems: string[] = [];
      let allGreen = true;

      section.feedbackItems.forEach((item: { item: string; color?: string }) => {
        const feedbackData = getSectionFeedback(item.item, answers[item.item] as string);
        if (feedbackData.color === 'amber' || feedbackData.color === 'red') {
          improvementItems.push(item.item);
          allGreen = false;
        }
      });

      if (improvementItems.length > 0) {
        improvements.push({ section: section.title, items: improvementItems });
      }

      if (allGreen) {
        strengths.push(section.title);
      }

      // Add a summary for each section
      sectionSummaries.push({
        section: section.title,
        summary: `Your ${section.title.toLowerCase()} score is ${section.score}%. ${section.score >= 80 ? 'Great job!' : section.score >= 60 ? 'There\'s room for improvement.' : 'This area needs attention.'}`
      });
    });

    return { improvements, strengths, sectionSummaries };
  };

  const { improvements, strengths, sectionSummaries } = generateSummary();

  const isGoalMisaligned = () => {
    const goals = answers.goals as string[]
    return (healthCalculations.bmiCategory === "Underweight" && goals.includes("weight-loss")) ||
           (healthCalculations.bmiCategory === "Obese" && goals.includes("muscle-gain"))
  };

  const { user } = useAuth();  // Add this line to get user from context

  useEffect(() => {
    if (user) {
      // Save results to Firestore for logged-in users
      saveAssessmentResult(user.uid, {
        score,
        healthCalculations,
        summary,
        answers,
        timestamp: new Date().toISOString()
      }).catch(console.error);
    }
  }, [user, score, healthCalculations, summary, answers]);

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col items-center relative">
        <SpaceTheme />  {/* Add this line */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 overflow-y-auto space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center py-6">Your Health Analysis</h1>
          
          <section className="bg-black/30 rounded-lg p-8 deep-space-border text-center">
            <h2 className="text-3xl font-semibold mb-4">Overall Health Score</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="text-6xl font-bold mr-2">{score}</div>
              <div className="text-3xl font-semibold">/100</div>
            </div>
            <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden mb-6">
              <div 
                className={cn("h-full deep-space-gradient transition-all duration-300 ease-out", 
                  score === 0 && "w-0"
                )}
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <p className="text-xl mb-4">
              {score >= 80 ? "Excellent! You're on track for optimal health." :
               score >= 60 ? "Good job! There's room for improvement in some areas." :
               "There are several areas where you can improve your health. Let's work on that!"}
            </p>
          </section>

          {isGoalMisaligned() && (
            <Alert variant="destructive" className="mb-6 deep-space-border">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning: Misaligned Goals</AlertTitle>
              <AlertDescription>
                Your current health status and selected goals may not be well-aligned. We recommend reassessing your goals or consulting with a healthcare professional.
              </AlertDescription>
              <Button onClick={handleRetake} className="mt-2">Retake Assessment</Button>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BodyCompositionCard 
              healthCalculations={healthCalculations} 
              answers={answers}
              footer="Note: These calculations are estimates. For a more accurate assessment, consult a healthcare professional."
            />
            <RecommendedIntakeCard healthCalculations={healthCalculations} />
          </div>

          <section className="bg-black/30 rounded-lg p-8 deep-space-border">
            <h3 className="text-2xl font-semibold mb-6">Health Goals</h3>
            {answers.goals && Array.isArray(answers.goals) && answers.goals.length > 0 ? (
              <Tabs defaultValue={answers.goals[0]} className="bg-black/20 p-4 rounded-lg">
                <TabsList className="mb-4 flex space-x-2 bg-transparent p-1 rounded-full">
                  {answers.goals.map((goal, index) => (
                    <TabsTrigger 
                      key={index} 
                      value={goal}
                      className="px-4 py-2 rounded-full transition-all duration-300 ease-in-out
                                 data-[state=active]:deep-space-gradient data-[state=active]:text-white
                                 data-[state=inactive]:bg-gray-700/50 data-[state=inactive]:text-gray-300"
                    >
                      {goal.replace('-', ' ')}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {answers.goals.map((goal, index) => (
                  <TabsContent key={index} value={goal} className="mt-4 p-4 bg-black/10 rounded-lg">
                    <p>{getHealthGoalAdvice([goal])[0]}</p>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <p>No health goals specified.</p>
            )}
          </section>

          <HealthScoreOverview scores={summary.map(s => ({ title: s.title, score: s.score }))} />
          
          {summary.map((section, index) => (
            <Section
              key={index}
              title={formatTitle(section.title)}
              items={section.feedbackItems.map(item => {
                const value = answers[item.item];
                const stringValue = Array.isArray(value) ? value.join(', ') : String(value);
                const feedbackData = getSectionFeedback(item.item, stringValue);
                return {
                  label: formatTitle(item.item),
                  value: stringValue,
                  feedback: feedbackData
                };
              })}
            />
          ))}

          <section className="bg-black/30 rounded-lg p-8 deep-space-border">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              Health Analysis Summary
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-3 h-3 ml-1 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <span className="max-w-xs">This summary is generated using AI with strict parameters based on your health data.</span>
                </TooltipContent>
              </Tooltip>
            </h3>
            
            {isLoading ? (
              <Skeleton className="w-full h-40" />
            ) : error ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : aiSummary ? (
              <div className="prose prose-invert">
                {aiSummary.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            ) : (
              <>
                {improvements.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xl font-medium mb-4">Areas for Improvement</h4>
                    {improvements.map((area, index) => (
                      <div key={index} className="mb-4">
                        <h5 className="text-lg font-medium">{area.section}</h5>
                        <ul className="list-disc pl-5 space-y-2">
                          {area.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-yellow-400">{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                
                {strengths.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xl font-medium mb-4">Your Strengths</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {strengths.map((item, index) => (
                        <li key={index} className="text-green-400">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6">
                  <h4 className="text-xl font-medium mb-4">Section Summaries</h4>
                  {sectionSummaries.map((item, index) => (
                    <p key={index} className="mb-2">
                      <span className="font-medium">{item.section}:</span> {item.summary}
                    </p>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="text-lg">
                    Focus on improving the specific areas highlighted above. Maintain your strong areas and consider consulting with a healthcare professional for personalized advice.
                  </p>
                </div>
              </>
            )}
          </section>

          <section className="bg-black/30 rounded-lg p-8 deep-space-border">
            <h3 className="text-2xl font-semibold mb-6">Your Next Steps</h3>
            <p className="mb-4">Based on your personalized health analysis, consider these key actions:</p>
            <ol className="list-decimal list-inside space-y-2 mb-6">
              <li>Review your section summaries and focus on improving your lowest-scoring areas</li>
              <li>Implement the specific advice given for your chosen health goals</li>
              <li>Track your progress using the metrics provided in your body composition analysis</li>
              <li>Consult with a health professional for personalized guidance on complex health matters</li>
            </ol>
            <div className="mt-8 text-center">
              <p className="text-lg mb-4">Ready to dive deeper into your health journey with expert guidance?</p>
              <Button 
                onClick={() => {/* Add your booking logic here */}}
                variant="primary"
                className="px-6 py-3 text-lg font-semibold"
              >
                Book Your Free Health Strategy Session
              </Button>
            </div>
          </section>

          <p className="mt-4 text-sm text-gray-300">
            Remember, these suggestions are based on general guidelines. For a tailored approach to achieving your health goals, consider consulting with a health professional.
          </p>
        </div>
      </div>
    </TooltipProvider>
  )
}
