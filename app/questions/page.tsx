'use client'

import { useReducer, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from "@/components/core/card"
import { Button } from "@/components/core/button"
import { Label } from "@/components/core/label"
import { QuestionRenderer } from '@/components/features/assessment/QuestionRenderer'
import { ContactForm } from '@/components/shared/common/ContactForm'
import { questions } from '@/data/questions'
import type { AnswerType } from '@/types/results'
import { cn } from '@/lib/utils'
import { calculateHealthMetrics } from '@/utils/health'
import { useQuestionNavigation } from '@/hooks/useQuestionNavigation'
import { calculateScore } from '@/utils/scoring'

// Add answer reducer
const answerReducer = (state: AnswerType, action: { type: string; payload: { id: string; value: string | number | boolean | string[] } }) => {
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
  const { currentQuestion, handleNext, handlePrevious } = useQuestionNavigation(questions, answers)
  const [showContactForm, setShowContactForm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [resetMessage, setResetMessage] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  // Handle previous with reset
  const handlePreviousWithReset = useCallback(() => {
    if (currentQuestion === undefined || currentQuestion < 0) return;

    let prevQuestion = currentQuestion - 1;
    while (
      prevQuestion >= 0 &&
      questions[prevQuestion]?.condition &&
      typeof questions[prevQuestion].condition === 'function' &&
      questions[prevQuestion].condition?.(answers as AnswerType) === false
    ) {
      prevQuestion--;
    }
    
    if (prevQuestion >= 0 && questions[prevQuestion] && questions[currentQuestion]) {
      // If we're moving back to the body fat question
      if (questions[currentQuestion].id === 'activityLevel' && questions[prevQuestion].id === 'bodyFat') {
        const currentBodyFat = answers['bodyFat'];
        
        // First navigate back
        handlePrevious();
        
        // Then start the animation sequence
        if (currentBodyFat) {
          // Brief delay to ensure we're on the right question
          setTimeout(() => {
            // Show the current value first
            dispatch({ 
              type: 'SET_ANSWER', 
              payload: { 
                id: 'bodyFat', 
                value: currentBodyFat
              } 
            });
            
            // Show reset message
            setResetMessage(true);
            
            // Then animate to default
            setTimeout(() => {
              dispatch({ 
                type: 'SET_ANSWER', 
                payload: { 
                  id: 'bodyFat', 
                  value: 20 // Default body fat value
                } 
              });
              
              // Hide reset message
              setTimeout(() => {
                setResetMessage(false);
              }, 1000);
            }, 1500);
          }, 100);
        }
      } else {
        // Normal navigation for other questions
        handlePrevious();
      }
    }
  }, [currentQuestion, questions, answers, handlePrevious, dispatch, setResetMessage]);

  // Wrap functions in useCallback
  const calculateOverallScore = useCallback((_answers: AnswerType): number => {
    const healthMetrics = calculateHealthMetrics(_answers)
    return Math.round(
      (healthMetrics.exerciseScore * 0.3) +
      (healthMetrics.nutritionScore * 0.3) +
      (healthMetrics.mentalHealthScore * 0.2) +
      (healthMetrics.sleepScore * 0.2)
    )
  }, [])

  const computeHealthMetrics = useCallback((answers: AnswerType) => {
    const metrics = calculateHealthMetrics(answers);
    return {
      bmi: typeof metrics.bmi === 'string' ? parseFloat(metrics.bmi) : metrics.bmi,
      bmiCategory: String(metrics.bmiCategory),
      bmr: typeof metrics.bmr === 'string' ? parseFloat(metrics.bmr) : metrics.bmr,
      tdee: typeof metrics.tdee === 'string' ? parseFloat(metrics.tdee) : metrics.tdee,
      bodyFat: typeof metrics.bodyFat === 'string' ? parseFloat(metrics.bodyFat) : metrics.bodyFat,
      idealWeightLow: typeof metrics.idealWeightLow === 'string' ? parseFloat(metrics.idealWeightLow) : metrics.idealWeightLow,
      idealWeightHigh: typeof metrics.idealWeightHigh === 'string' ? parseFloat(metrics.idealWeightHigh) : metrics.idealWeightHigh,
      recommendedCalories: typeof metrics.recommendedCalories === 'string' ? parseFloat(metrics.recommendedCalories) : metrics.recommendedCalories,
      proteinGrams: typeof metrics.proteinGrams === 'string' ? parseFloat(metrics.proteinGrams) : metrics.proteinGrams,
      carbGrams: typeof metrics.carbGrams === 'string' ? parseFloat(metrics.carbGrams) : metrics.carbGrams,
      fatGrams: typeof metrics.fatGrams === 'string' ? parseFloat(metrics.fatGrams) : metrics.fatGrams,
      exerciseScore: typeof metrics.exerciseScore === 'string' ? parseFloat(metrics.exerciseScore) : metrics.exerciseScore || 0,
      nutritionScore: typeof metrics.nutritionScore === 'string' ? parseFloat(metrics.nutritionScore) : metrics.nutritionScore || 0,
      mentalHealthScore: typeof metrics.mentalHealthScore === 'string' ? parseFloat(metrics.mentalHealthScore) : metrics.mentalHealthScore || 0,
      sleepScore: typeof metrics.sleepScore === 'string' ? parseFloat(metrics.sleepScore) : metrics.sleepScore || 0
    };
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

  const handleAnswer = useCallback((value: string | number | boolean | string[]) => {
    dispatch({ type: 'SET_ANSWER', payload: { id: questions[currentQuestion].id, value } })
  }, [currentQuestion])

  const handleQuestionNavigation = useCallback(() => {
    const isComplete = handleNext()
    if (isComplete) {
      // Skip contact form for authenticated users
      if (user) {
        const healthMetrics = computeHealthMetrics(answers);
        const results = {
          answers,
          assessmentResults: {
            score: calculateScore(answers, healthMetrics),
            healthCalculations: healthMetrics,
            summary: generateSummary(answers)
          }
        };

        const encodedResults = encodeURIComponent(JSON.stringify(results));
        router.push(`/results?results=${encodedResults}`);
      } else {
        setShowContactForm(true)
      }
    }
  }, [answers, user, router, computeHealthMetrics, generateSummary, handleNext])

  const handleContactInfoSubmit = useCallback(async (name: string, email: string) => {
    console.log('Starting contact info submission...', { name, email });
    setSubmitError(null);

    try {
      if (!name || !email) {
        throw new Error('Name and email are required');
      }

      // Calculate required values
      const score = calculateScore(answers, computeHealthMetrics(answers));
      const healthCalculations = computeHealthMetrics(answers);
      const summary = generateSummary(answers);

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

      // First attempt - API route
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save assessment data');
      }

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

      // Navigate to results page
      const encodedResults = encodeURIComponent(JSON.stringify(resultsData));
      router.push(`/results?results=${encodedResults}`);

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred. Please try again.'
      );
      throw error; // Re-throw to be handled by the form's error handling
    }
  }, [answers, computeHealthMetrics, generateSummary, router]);

  return (
    <div className="fixed-height-container">
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
                        className={cn("deep-space-gradient h-full", 
                          currentQuestion === 0 && "w-0"
                        )}
                        style={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center -mt-4">
                    <h3 className="text-2xl font-medium tracking-tight text-[#f7f7f7] mb-8">
                      {questions[currentQuestion]?.text || ''}
                    </h3>
                    <div>
                      {questions[currentQuestion] && (
                        <QuestionRenderer
                          key="question-renderer"
                          question={questions[currentQuestion]}
                          onAnswer={handleAnswer}
                          currentAnswer={answers[questions[currentQuestion].id]}
                          resetMessage={resetMessage}
                        />
                      )}
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
                      score: calculateScore(answers, computeHealthMetrics(answers)),
                      healthCalculations: computeHealthMetrics(answers),
                      summary: generateSummary(answers)
                    }}
                  />
                </div>
              )}
              <div className="mt-auto pt-8">
                <div className="flex justify-between">
                  {currentQuestion > 0 && !showContactForm && (
                    <Button 
                      onClick={handlePreviousWithReset} 
                      variant="secondary"
                      size="default"
                    >
                      Previous
                    </Button>
                  )}
                  {currentQuestion >= 0 && !showContactForm && (
                    <Button 
                      onClick={handleQuestionNavigation} 
                      disabled={!answers[questions[currentQuestion].id] && !questions[currentQuestion].optional}
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
