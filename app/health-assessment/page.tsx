'use client'

import React, { useState, useCallback, useReducer } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { questions, AnswerType } from '@/data/questions'
import { useHealthCalculations } from '@/hooks/useHealthCalculations'
import { ContactForm } from '@/components/ContactForm'
import { AnalysisResult } from '@/components/AnalysisResult'
import { SpaceTheme } from '@/components/SpaceTheme'
import QuestionRenderer from '@/components/QuestionRenderer'

// Reducer for answers state
type AnswerAction = 
  | { type: 'SET_ANSWER', payload: { id: string, value: string | number | string[] } }
  | { type: 'RESET_ANSWERS' }

const answerReducer = (state: AnswerType, action: AnswerAction): AnswerType => {
  switch (action.type) {
    case 'SET_ANSWER':
      return { ...state, [action.payload.id]: action.payload.value }
    case 'RESET_ANSWERS':
      return {}
    default:
      return state
  }
}

export default function HealthAssessmentPage() {
  const [answers, dispatch] = useReducer(answerReducer, {})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [contactInfoSubmitted, setContactInfoSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const healthCalculations = useHealthCalculations(answers)

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
      setShowResults(true)
    }
  }, [currentQuestion, answers])

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
      console.log("User Contact Info:", { name, email, answers })
      setContactInfoSubmitted(true)
    } else {
      setSubmitError("Please fill in both name and email.")
    }
  }, [answers])

  const handleRetake = useCallback(() => {
    dispatch({ type: 'RESET_ANSWERS' })
    setShowResults(false)
    setContactInfoSubmitted(false)
    setSubmitError(null)
    setCurrentQuestion(0)
  }, [])

  return (
    <div className={`min-h-screen flex flex-col items-center ${showResults && contactInfoSubmitted ? 'justify-start pt-24' : 'justify-center'} text-center overflow-hidden`}>
      <SpaceTheme />
      <div className={`relative z-10 w-full max-w-4xl mx-auto px-4 py-8 ${showResults && contactInfoSubmitted ? 'overflow-y-auto' : ''}`} 
           style={showResults && contactInfoSubmitted ? { maxHeight: 'calc(100vh - 6rem)' } : {}}>
        <Card className="card-custom border-none bg-opacity-50 backdrop-blur-md p-6">
          <CardContent className="space-y-6">
            {!showResults ? (
              <div className="space-y-6">
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block text-[#f7f7f7] opacity-80">Progress</Label>
                  <div className="h-2 bg-[rgba(247,247,247,0.2)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0a192f] rounded-full transition-all duration-300 ease-in-out" 
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
            ) : !contactInfoSubmitted ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-center text-[#f7f7f7]">Almost there! Please provide your contact information.</h3>
                <ContactForm onSubmit={handleContactInfoSubmit} error={submitError} />
              </div>
            ) : (
              <div className="analysis-result-container">
                <div className="analysis-result-content">
                  <AnalysisResult answers={answers} healthCalculations={healthCalculations} onRetake={handleRetake} />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between items-center mt-4">
              {currentQuestion > 0 && !showResults && (
                <Button onClick={handlePrevious} className="welcome-button secondary px-4 py-2 text-sm">
                  Previous
                </Button>
              )}
              {currentQuestion >= 0 && !showResults && (
                <Button 
                  onClick={handleNext} 
                  disabled={!answers[questions[currentQuestion].id] && questions[currentQuestion].id !== 'bodyFat'}
                  className="welcome-button primary px-4 py-2 text-sm"
                >
                  {currentQuestion === questions.length - 1 ? "Get Your Analysis" : "Next"}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
