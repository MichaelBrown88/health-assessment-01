'use client'

import { useReducer, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SpaceTheme } from '@/components/layout/SpaceTheme'
import { QuestionRenderer } from '@/components/assessment/QuestionRenderer'
import { ContactForm } from '@/components/common/ContactForm'
import { questions } from '@/data/questions'
import type { AnswerType } from '@/data/questions'
import { cn } from '@/lib/utils'
import { calculateHealthMetrics as calculateMetrics } from '@/utils/healthUtils'

// Add answer reducer
const answerReducer = (state: AnswerType, action: { type: string; payload: { id: string; value: string | number | string[] } }) => {
  switch (action.type) {
    case 'SET_ANSWER':
      return {
        ...state,
        [action.payload.id]: action.payload.value
      }
    default:
      return state
  }
}

export default function HealthAssessmentPage() {
  const [answers, dispatch] = useReducer(answerReducer, {})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [resetMessage, setResetMessage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  // Wrap functions in useCallback
  const calculateOverallScore = useCallback((_answers: AnswerType): number => {
    const healthMetrics = calculateMetrics(_answers)
    return Math.round(
      (healthMetrics.exerciseScore * 0.3) +
      (healthMetrics.nutritionScore * 0.3) +
      (healthMetrics.mentalHealthScore * 0.2) +
      (healthMetrics.sleepScore * 0.2)
    )
  }, [])

  const calculateHealthMetrics = useCallback((answers: AnswerType) => {
    const metrics = calculateMetrics(answers);
    const healthCalculations: Record<string, string | number | null> = {
      exerciseScore: metrics.exerciseScore ?? 0,
      nutritionScore: metrics.nutritionScore ?? 0,
      mentalHealthScore: metrics.mentalHealthScore ?? 0,
      sleepScore: metrics.sleepScore ?? 0,
      bmi: metrics.bmi,
      bmiCategory: metrics.bmiCategory,
      bmr: metrics.bmr,
      tdee: metrics.tdee,
      bodyFat: metrics.bodyFat,
      idealWeightLow: metrics.idealWeightLow,
      idealWeightHigh: metrics.idealWeightHigh,
      recommendedCalories: metrics.recommendedCalories,
      proteinGrams: metrics.proteinGrams,
      carbGrams: metrics.carbGrams,
      fatGrams: metrics.fatGrams
    };
    return healthCalculations;
  }, [])

  const getSectionSummary = useCallback((section: string, _answers: AnswerType): string => {
    return `Summary for ${section}`;
  }, [])

  const generateSummary = useCallback((answers: AnswerType) => {
    return {
      exercise: getSectionSummary('exercise', answers),
      nutrition: getSectionSummary('nutrition', answers),
      mentalHealth: getSectionSummary('mentalHealth', answers),
    };
  }, [getSectionSummary])

  // Now define the useCallback hooks
  const handleAnswer = useCallback((value: string | number | string[]) => {
    dispatch({ type: 'SET_ANSWER', payload: { id: questions[currentQuestion].id, value } })
  }, [currentQuestion])

  const handleNext = useCallback(() => {
    let nextQuestion = currentQuestion + 1
    while (
      nextQuestion < questions.length &&
      questions[nextQuestion].condition &&
      typeof questions[nextQuestion].condition === 'function' &&
      questions[nextQuestion].condition?.(answers as AnswerType) === false
    ) {
      nextQuestion++
    }
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
    } else {
      // Skip contact form for authenticated users
      if (user) {
        const results = {
          answers,
          assessmentResults: {
            score: calculateOverallScore(answers),
            healthCalculations: calculateHealthMetrics(answers),
            summary: generateSummary(answers)
          }
        };

        const encodedResults = encodeURIComponent(JSON.stringify(results));
        router.push(`/results?results=${encodedResults}`);
      } else {
        setShowContactForm(true)
      }
    }
  }, [currentQuestion, answers, user, router, calculateOverallScore, calculateHealthMetrics, generateSummary])

  const handlePrevious = useCallback(() => {
    let prevQuestion = currentQuestion - 1;
    while (
      prevQuestion >= 0 &&
      questions[prevQuestion].condition &&
      typeof questions[prevQuestion].condition === 'function' &&
      questions[prevQuestion].condition?.(answers as AnswerType) === false
    ) {
      prevQuestion--;
    }
    if (prevQuestion >= 0) {
      setCurrentQuestion(prevQuestion);
      // Reset bodyFat when going back from the next question
      if (questions[currentQuestion].id === 'activityLevel' && questions[prevQuestion].id === 'bodyFat') {
        // Show reset message
        setResetMessage(true);
        
        // Delay the actual reset
        setTimeout(() => {
          // Ensure defaultValue is a number
          const defaultValue = Number(questions[prevQuestion].defaultValue) || 0;
          
          dispatch({ 
            type: 'SET_ANSWER', 
            payload: { 
              id: 'bodyFat', 
              value: defaultValue
            } 
          });
          // Hide message after reset
          setTimeout(() => {
            setResetMessage(false);
          }, 1000);
        }, 300);
      }
    }
  }, [currentQuestion, answers]);

  const handleContactInfoSubmit = useCallback(async (name: string, email: string) => {
    console.log('Starting contact info submission...', { name, email });
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Calculate required values
      const score = calculateOverallScore(answers);
      const healthCalculations = calculateHealthMetrics(answers);
      const summary = generateSummary(answers);

      console.log('Preparing assessment data for submission...', {
        hasAnswers: !!answers,
        hasHealthCalculations: !!healthCalculations,
        score
      });

      // Log the full payload for debugging
      const payload = {
        name,
        email,
        answers,
        assessmentResults: {
          score,
          healthCalculations,
          summary
        },
        timestamp: Date.now()
      };
      console.log('Full submission payload:', payload);

      // First attempt - API route
      console.log('Attempting to save via API route...');
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API route save failed:', errorData);
        throw new Error(errorData.error || 'Failed to save assessment data');
      }

      const data = await response.json();
      console.log('API route save successful:', data);

      // Store in session for immediate access
      const resultsData = {
        answers,
        assessmentResults: {
          score,
          healthCalculations,
          summary
        },
        timestamp: Date.now()
      };
      sessionStorage.setItem('temporaryResults', JSON.stringify(resultsData));
      console.log('Assessment data stored in session storage');

      // Navigate to results page
      const encodedResults = encodeURIComponent(JSON.stringify(resultsData));
      router.push(`/results?results=${encodedResults}`);

    } catch (error) {
      console.error('Detailed submission error:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      });
      setSubmitError('Failed to save your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, calculateOverallScore, calculateHealthMetrics, generateSummary, router]);

  return (
    <div className="fixed-height-container">
      <SpaceTheme />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-8 relative z-20">
          <Card className="relative card-custom border-none bg-black/40 backdrop-blur-[1px] w-full h-[500px] transform transition-all duration-300
                         shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.02),inset_2px_2px_4px_rgba(0,0,0,0.3),_-1px_-1px_2px_rgba(255,255,255,0.02),_1px_1px_2px_rgba(0,0,0,0.3)]
                         before:absolute before:inset-0 before:rounded-lg before:p-[0.5px] before:bg-white/[0.03]">
            <div className="h-full flex flex-col p-10">
              {!showContactForm ? (
                <div className="flex-1 flex flex-col">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-xs font-medium text-[#f7f7f7] opacity-70 tracking-wide uppercase">
                        Progress
                      </Label>
                      <div className="text-[11px] text-[#f7f7f7] opacity-50 tracking-wide">
                        Question {currentQuestion + 1} of {questions.length}
                      </div>
                    </div>
                    <div className="progress-base">
                      <div 
                        className={cn("progress-fill", 
                          currentQuestion === 0 && "w-0"
                        )}
                        style={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center -mt-4">
                    <h3 className="text-2xl font-medium tracking-tight text-[#f7f7f7] mb-8">
                      {questions[currentQuestion].question}
                    </h3>
                    <div>
                      <QuestionRenderer
                        question={questions[currentQuestion]}
                        onAnswer={handleAnswer}
                        answers={answers}
                        resetMessage={resetMessage}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 relative z-10">
                  <h3 className="text-2xl font-medium tracking-tight text-center text-[#f7f7f7]">
                    Almost there! Please provide your contact information.
                  </h3>
                  <ContactForm 
                    onSubmit={handleContactInfoSubmit}
                    error={submitError}
                    answers={answers}
                    assessmentResults={{
                      score: calculateOverallScore(answers),
                      healthCalculations: calculateHealthMetrics(answers),
                      summary: generateSummary(answers)
                    }}
                  />
                </div>
              )}
              <div className="mt-auto pt-8">
                <div className="flex justify-between">
                  {currentQuestion > 0 && !showContactForm && (
                    <Button 
                      onClick={handlePrevious} 
                      variant="secondary"
                      size="default"
                    >
                      Previous
                    </Button>
                  )}
                  {currentQuestion >= 0 && !showContactForm && (
                    <Button 
                      onClick={handleNext} 
                      disabled={!answers[questions[currentQuestion].id] && questions[currentQuestion].id !== 'bodyFat'}
                      variant="primary"
                      size="default"
                    >
                      {currentQuestion === questions.length - 1 ? "Get Your Analysis" : "Next"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
