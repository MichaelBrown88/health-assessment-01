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
import type { AnswerType } from '@/types/results'
import { cn } from '@/lib/utils'
import { doc, collection, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { calculateHealthMetrics } from '@/utils/health/calculations'
import { healthScoring } from '@/utils/health'

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
  const [answers, dispatch] = useReducer(answerReducer, {} as AnswerType)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [resetMessage, setResetMessage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const calculateOverallScore = useCallback((_answers: AnswerType): number => {
    // Calculate overall score using health metrics
    const metrics = calculateHealthMetrics(_answers)
    const pillarScores = healthScoring.calculateHealthPillars(_answers, metrics)
    return healthScoring.calculateOverallScore(pillarScores, metrics.bmi)
  }, [])

  const generateSummary = useCallback((answers: AnswerType) => {
    return {
      exercise: getSectionSummary('exercise', answers),
      nutrition: getSectionSummary('nutrition', answers),
      wellbeing: getSectionSummary('wellbeing', answers),
    }
  }, [])

  const getSectionSummary = useCallback((section: string, _answers: AnswerType): string => {
    // Implement your summary logic here
    return `Summary for ${section}`
  }, [])

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
      questions[nextQuestion].condition?.(answers) === false
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
        }

        const encodedResults = encodeURIComponent(JSON.stringify(results))
        router.push(`/results?results=${encodedResults}`)
      } else {
        setShowContactForm(true)
      }
    }
  }, [currentQuestion, answers, user, router, calculateOverallScore, generateSummary])

  const handlePrevious = useCallback(() => {
    let prevQuestion = currentQuestion - 1
    while (
      prevQuestion >= 0 &&
      questions[prevQuestion].condition &&
      typeof questions[prevQuestion].condition === 'function' &&
      questions[prevQuestion].condition?.(answers) === false
    ) {
      prevQuestion--
    }
    if (prevQuestion >= 0) {
      setCurrentQuestion(prevQuestion)
      // Reset bodyFat when going back from the next question
      if (questions[currentQuestion].id === 'activityLevel' && questions[prevQuestion].id === 'bodyFat') {
        // Show reset message
        setResetMessage(true)
        
        // Delay the actual reset
        setTimeout(() => {
          dispatch({ 
            type: 'SET_ANSWER', 
            payload: { 
              id: 'bodyFat', 
              value: questions[prevQuestion].defaultValue || 0
            } 
          })
          // Hide message after reset
          setTimeout(() => {
            setResetMessage(false)
          }, 1000)
        }, 300)
      }
    }
  }, [currentQuestion, answers])

  const handleContactInfoSubmit = useCallback(async (name: string, email: string) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    
    try {
      // Store contact info in session storage
      sessionStorage.setItem('contactFormData', JSON.stringify({ name, email }))
      
      // Try to save to Firestore, but don't block on failure
      try {
        if (db) {
          const leadRef = doc(collection(db, 'leads'))
          await setDoc(leadRef, {
            email,
            name,
            answers,
            score: calculateOverallScore(answers),
            healthCalculations: calculateHealthMetrics(answers),
            summary: generateSummary(answers),
            createdAt: serverTimestamp()
          })
        }
      } catch (dbError) {
        // Log the error but continue with the flow
        console.warn('Failed to save to database:', dbError)
      }

      // Encode answers for URL
      const encodedAnswers = encodeURIComponent(JSON.stringify(answers))
      
      // Always proceed to results page, even if db save failed
      await router.push(`/results?answers=${encodedAnswers}`)
      
    } catch (error) {
      console.error('Error in contact submission flow:', error)
      setSubmitError('Failed to process your submission. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [answers, router, isSubmitting, calculateOverallScore, generateSummary])

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
