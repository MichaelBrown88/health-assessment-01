'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useHealthCalculations } from '@/hooks/useHealthCalculations'
import { calculateScore, getHealthGoalAdvice, getSectionFeedback, getMealFeedback } from '@/utils/healthUtils'
import { BodyCompositionCard } from '@/components/BodyCompositionCard'
import { Section } from '@/components/Section'
import { cn } from "@/lib/utils"
import { HealthScoreOverview } from '@/components/HealthScoreOverview'
import { formatTitle } from '@/utils/healthUtils'
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { useAuth } from '@/contexts/AuthContext'
import { saveAssessmentResult } from '@/lib/db'
import { SpaceTheme } from '@/components/SpaceTheme'
import { getContextualAnalysis } from '@/utils/analysisUtils'
import { RecommendedIntakeCard } from '@/components/RecommendedIntakeCard';
import { AuthModal } from '@/components/auth'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { ContextualAnalysis } from '@/types/ContextualAnalysis';
import { PaywallModal } from '@/components/PaywallModal';
import { generateStructuredSummary } from '@/utils/summaryUtils';
import { AIHealthCoach } from '@/components/AIHealthCoach';
import { AITriggerButton } from '@/components/AITriggerButton';

// At the top with other interfaces
interface AnswerType {
  [key: string]: string | number | string[];
}

interface AssessmentData {
  answers: AnswerType;
  timestamp?: number;
  userId?: string;
  healthCalculations?: {
    bmi: number | null;
    bmiCategory: string | null;
    bmr: number | null;
    tdee: number | null;
    bodyFat: number | null;
    isBodyFatEstimated: boolean;
    idealWeightLow: number | null;
    idealWeightHigh: number | null;
    recommendedCalories: number | null;
    proteinGrams: number | null;
    carbGrams: number | null;
    fatGrams: number | null;
  };
}

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
      const safeAnswer = getSafeAnswer(answer);
      const feedback = getSectionFeedback(item, safeAnswer);
      
      console.log('Processing item:', item, 'Answer:', answer, 'Safe Answer:', safeAnswer);
      
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

// Add this helper function at the top of your component or in a utils file
const getSafeAnswer = (answer: string | number | string[] | null | undefined): string => {
  if (answer === undefined || answer === null) {
    return '';
  }
  if (typeof answer === 'string') {
    return answer;
  }
  if (Array.isArray(answer)) {
    return answer.join(', ');
  }
  try {
    return String(answer);
  } catch {
    return '';
  }
};

// Add this helper function to transform the structured feedback
const transformSummaryForDB = (structuredSummary: ReturnType<typeof generateStructuredSummary>): Record<string, string | null> => {
  return {
    exercise: structuredSummary.exercise?.message || null,
    nutrition: structuredSummary.nutrition?.message || null,
    sleep: structuredSummary.sleep?.message || null,
    mentalHealth: structuredSummary.mentalHealth?.message || null
  };
};

export default function ResultsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<AnswerType>({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Move all calculations to top level
  const healthCalculations = useHealthCalculations(answers);
  
  const score = useMemo(() => {
    return calculateScore(answers, healthCalculations);
  }, [answers, healthCalculations]);

  const summary = useMemo(() => getSummary(answers), [answers]);

  // Analyses
  const exerciseAnalysis = useMemo(() => 
    getContextualAnalysis('exercise', answers), [answers]);
  
  const wellbeingAnalysis = useMemo(() => 
    getContextualAnalysis('wellbeing', answers), [answers]);
  
  const nutritionAnalysis = useMemo(() => 
    getContextualAnalysis('nutrition', answers), [answers]);

  // Move before any conditional returns
  const handleRetake = useCallback(() => {
    router.push('/questions')
  }, [router]);

  useEffect(() => {
    async function loadData() {
      try {
        const assessmentId = searchParams?.get('assessmentId')
        if (assessmentId) {
          const docRef = doc(db, 'assessments', assessmentId)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const data = docSnap.data() as AssessmentData
            setAnswers(data.answers)
          }
        } else {
          const answersParam = searchParams?.get('answers')
          if (answersParam) {
            setAnswers(JSON.parse(answersParam))
          }
        }
      } catch (error) {
        console.error('Error loading assessment:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [searchParams])

  useEffect(() => {
    const saveData = async () => {
      if (!user || saved || !searchParams) return;
      
      try {
        if (Object.keys(answers).length === 0) return;

        const healthCalculationsForSave = {
          ...healthCalculations,
          isBodyFatEstimated: healthCalculations.isBodyFatEstimated ? 1 : 0
        } as Record<string, string | number | null>;

        // Generate and transform the summary
        const structuredSummary = generateStructuredSummary({
          exercise: summary.find(s => s.title === 'Exercise Habits')?.score || 0,
          nutrition: summary.find(s => s.title === 'Diet and Nutrition')?.score || 0,
          sleep: summary.find(s => s.title === 'Rest and Recovery')?.score || 0,
          mentalHealth: summary.find(s => s.title === 'Mental Health')?.score || 0
        });

        await saveAssessmentResult(
          user?.uid || 'anonymous',
          {
            answers,
            healthCalculations: healthCalculationsForSave,
            score,
            summary: transformSummaryForDB(structuredSummary),
            timestamp: Date.now()
          }
        );
        setSaved(true);
      } catch (error) {
        console.error('Error saving result:', error);
      }
    };
    
    if (searchParams?.get('new') === 'true' && !saved) {
      saveData();
    }
  }, [
    searchParams,
    answers,
    healthCalculations,
    saved,
    score,
    user,
    summary
  ]);

  const isGoalMisaligned = () => {
    const goals = answers.goals as string[]
    return (healthCalculations.bmiCategory === "Underweight" && goals.includes("weight-loss")) ||
           (healthCalculations.bmiCategory === "Obese" && goals.includes("muscle-gain"))
  };

  // Add console.log to see what answers we're working with
  console.log('Current answers:', answers);

  const CTASection = () => {
    const [showPaywall, setShowPaywall] = useState(false);
    
    return (
      <section className="bg-black/30 rounded-lg p-8 deep-space-border">
        <h3 className="text-2xl font-semibold mb-6">
          {user ? 'View Your Progress' : 'Track Your Progress'}
        </h3>
        <div className="text-center">
          {user ? (
            <div className="space-y-4">
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="primary"
                className="w-full md:w-auto px-6 py-3"
              >
                Go to Dashboard
              </Button>
              <p className="text-sm text-gray-400">
                View your progress, track changes, and get detailed insights
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg mb-6">
                Ready to unlock detailed insights and track your progress over time?
              </p>
              <Button 
                onClick={() => setShowPaywall(true)}
                variant="primary"
                className="w-full md:w-auto px-6 py-3"
              >
                Unlock Full Access
              </Button>
              <p className="text-sm text-gray-400">
                Get access to your personalized dashboard, progress tracking, and AI-powered insights
              </p>
            </div>
          )}
        </div>

        <PaywallModal 
          isOpen={showPaywall} 
          onClose={() => setShowPaywall(false)} 
        />
      </section>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <SpaceTheme />
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-8 flex-1 overflow-y-auto">
        <div className="space-y-8">
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
              score={score}
              footer="Note: These calculations are estimates."
            />
            <RecommendedIntakeCard 
              healthCalculations={healthCalculations} 
              answers={answers}
              score={score}
            />
          </div>

          <section className="bg-black/30 rounded-lg p-8 deep-space-border">
            <h3 className="text-2xl font-semibold mb-6">Health Goals</h3>
            {answers.goals && Array.isArray(answers.goals) && answers.goals.length > 0 ? (
              <Tabs defaultValue={answers.goals[0]} className="bg-black/20 p-4 rounded-lg">
                <TabsList className="mb-4 flex space-x-2 bg-transparent p-1 rounded-full">
                  {answers.goals.map((goal: string, index: number) => (
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
                {answers.goals.map((goal: string, index: number) => (
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
          
          {summary.map((section, index) => {
            let contextualAnalyses: ContextualAnalysis[] = [];
            
            switch (section.title) {
              case 'Exercise Habits':
                contextualAnalyses = exerciseAnalysis;
                break;
              case 'Diet and Nutrition':
                contextualAnalyses = nutritionAnalysis;
                break;
              case 'Rest and Recovery':
              case 'Mental Health':
                contextualAnalyses = wellbeingAnalysis;
                break;
              default:
                contextualAnalyses = [];
            }

            return (
              <Section
                key={index}
                title={formatTitle(section.title)}
                items={section.feedbackItems.map(item => {
                  const value = answers[item.item];
                  const stringValue = Array.isArray(value) ? value.join(', ') : String(value);
                  
                  return {
                    label: formatTitle(item.item),
                    value: stringValue,
                    feedback: item.item === 'lastMeal' 
                      ? getMealFeedback(stringValue)
                      : getSectionFeedback(item.item, stringValue)
                  };
                })}
                contextualAnalyses={contextualAnalyses}
              >
                <AITriggerButton 
                  assessmentData={{
                    answers,
                    healthCalculations,
                    score
                  }}
                  variant="icon"
                  size="small"
                />
              </Section>
            );
          })}

          <section className="bg-black/30 rounded-lg p-8 deep-space-border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Health Analysis Summary</h3>
              <AITriggerButton 
                assessmentData={{
                  answers,
                  healthCalculations,
                  score
                }}
                variant="icon"
                size="default"
              />
            </div>
            {loading ? (
              <Skeleton className="w-full h-40" />
            ) : (
              <div className="space-y-6">
                {Object.entries(generateStructuredSummary({
                  exercise: summary.find(s => s.title === 'Exercise Habits')?.score || 0,
                  nutrition: summary.find(s => s.title === 'Diet and Nutrition')?.score || 0,
                  sleep: summary.find(s => s.title === 'Rest and Recovery')?.score || 0,
                  mentalHealth: summary.find(s => s.title === 'Mental Health')?.score || 0,
                  healthCalculations
                })).map(([section, feedback]) => (
                  feedback && (
                    <div key={section} className={cn(
                      "bg-black/30 rounded-lg p-6",
                      section === 'bodyComposition' && "border-t-4 border-blue-500"
                    )}>
                      <h3 className="text-xl font-semibold mb-4 capitalize">
                        {section === 'bodyComposition' ? 'Body Composition & Nutrition Plan' : section}
                      </h3>
                      <p className="mb-4">{feedback.message}</p>
                      {feedback.recommendations?.length > 0 && (
                        <>
                          <h4 className="font-medium mb-2">Recommendations:</h4>
                          <ul className="list-disc pl-5 space-y-2">
                            {feedback.recommendations?.map((rec: string, index: number) => (
                              <li key={index} className="text-gray-300">
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}
          </section>

          <CTASection />

          <p className="mt-4 text-sm text-gray-300">
            Remember, these suggestions are based on general guidelines. For a tailored approach to achieving your health goals, consider consulting with a health professional.
          </p>
        </div>
      </div>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}

