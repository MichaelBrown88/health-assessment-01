'use client'

import { useReducer, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SpaceTheme } from '@/components/SpaceTheme'
import QuestionRenderer from '@/components/QuestionRenderer'
import { ContactForm } from '@/components/ContactForm'
import { questions } from '@/data/questions'
import type { AnswerType } from '@/data/questions'
import { cn } from '@/lib/utils'

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
  const router = useRouter()
  const { user } = useAuth()

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
        const encodedAnswers = encodeURIComponent(JSON.stringify(answers))
        router.push(`/results?answers=${encodedAnswers}`) // Updated path
      } else {
        setShowContactForm(true)
      }
    }
  }, [currentQuestion, answers, user, router])

  const handlePrevious = useCallback(() => {
    let prevQuestion = currentQuestion - 1
    while (
      prevQuestion >= 0 &&
      questions[prevQuestion].condition &&
      typeof questions[prevQuestion].condition === 'function' &&
      questions[prevQuestion].condition?.(answers as AnswerType) === false
    ) {
      prevQuestion--
    }
    if (prevQuestion >= 0) {
      setCurrentQuestion(prevQuestion)
    }
  }, [currentQuestion, answers])

  const handleContactInfoSubmit = useCallback((name: string, email: string) => {
    if (name && email) {
      const validAnswers = Object.fromEntries(
        Object.entries(answers).filter(([, value]) => value !== undefined && value !== null)
      );
      
      console.log("Submitting answers:", validAnswers);
      
      const encodedAnswers = encodeURIComponent(JSON.stringify(validAnswers));
      router.push(`/results?answers=${encodedAnswers}`);
    } else {
      setSubmitError("Please fill in both name and email.");
    }
  }, [answers, router]);

  const calculateOverallScore = (_answers: AnswerType): number => {
    // Implement your scoring logic here
    return 75; // Replace with actual calculation
  };

  const calculateHealthMetrics = (answers: AnswerType): Record<string, string | number | null> => {
    const getValue = (key: string): string | number | null => {
      const value = answers[key];
      if (Array.isArray(value)) {
        return null;
      }
      return value || null;
    };

    return {
      bmi: getValue('bmi'),
      bmr: getValue('bmr'),
      bodyFat: getValue('bodyFat')
    };
  };

  const generateSummary = (answers: AnswerType) => {
    return {
      exercise: getSectionSummary('exercise', answers),
      nutrition: getSectionSummary('nutrition', answers),
      wellbeing: getSectionSummary('wellbeing', answers),
    };
  };

  const getSectionSummary = (section: string, _answers: AnswerType): string => {
    // Implement your summary logic here
    return `Summary for ${section}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
      <SpaceTheme />
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center min-h-screen py-20">
        <Card className="card-custom border-none bg-opacity-50 backdrop-blur-md p-6 w-full my-auto">
          <div className="space-y-6">
            {!showContactForm ? (
              <div className="space-y-6">
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block text-[#f7f7f7] opacity-80">Progress</Label>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full deep-space-gradient transition-all duration-300 ease-out", 
                        currentQuestion === 0 && "w-0"
                      )}
                      style={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}
                    ></div>
                  </div>
                  <div className="text-xs mt-2 text-right text-[#f7f7f7] opacity-60">
                    Question {currentQuestion + 1} of {questions.length}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-left text-[#f7f7f7]">{questions[currentQuestion].question}</h3>
                <div className="max-h-[60vh] overflow-y-auto pr-4">
                  <QuestionRenderer
                    question={questions[currentQuestion]}
                    onAnswer={handleAnswer}
                    answers={answers}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-center text-[#f7f7f7]">Almost there! Please provide your contact information.</h3>
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
          </div>
          <div className="flex justify-between mt-6">
            {currentQuestion > 0 && !showContactForm && (
              <Button variant="dark" onClick={handlePrevious} className="px-4 py-2 text-sm">
                Previous
              </Button>
            )}
            {currentQuestion >= 0 && !showContactForm && (
              <Button 
                onClick={handleNext} 
                disabled={!answers[questions[currentQuestion].id] && questions[currentQuestion].id !== 'bodyFat'}
                variant="primary"
                className="px-4 py-2 text-sm"
              >
                {currentQuestion === questions.length - 1 ? "Get Your Analysis" : "Next"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
