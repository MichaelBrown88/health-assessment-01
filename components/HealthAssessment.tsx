'use client'

import React, { useState, useCallback, useReducer, useEffect } from 'react'
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SpaceTheme } from './SpaceTheme'
import { WelcomeScreen } from './WelcomeScreen'
import { QuestionRenderer } from './QuestionRenderer'
import { ContactForm } from './ContactForm'
import { AnalysisResult } from './AnalysisResult'
import { useQuestionNavigation } from '../hooks/useQuestionNavigation'
import { useHealthCalculations } from '../hooks/useHealthCalculations'
import { questions } from '../data/questions'
import { answerReducer } from '../reducers/answerReducer'

export function HealthAssessment() {
  const { setTheme } = useTheme()
  const [answers, dispatch] = useReducer(answerReducer, {})
  const [showResults, setShowResults] = useState(false)
  const [contactInfoSubmitted, setContactInfoSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { currentQuestion, handleNext, handlePrevious } = useQuestionNavigation(questions, answers)
  const healthCalculations = useHealthCalculations(answers)

  useEffect(() => {
    setTheme('dark')
  }, [setTheme])

  const handleAnswer = useCallback((value: string | number | string[]) => {
    const question = questions[currentQuestion]
    if (question.type === 'checkbox') {
      dispatch({ 
        type: 'SET_ANSWER', 
        payload: { 
          id: question.id, 
          value: Array.isArray(value) ? value : [value as string]
        } 
      })
    } else {
      dispatch({ type: 'SET_ANSWER', payload: { id: question.id, value } })
    }
  }, [currentQuestion])

  const handleNextQuestion = useCallback(() => {
    const isFinished = handleNext()
    if (isFinished) {
      setShowResults(true)
    }
  }, [handleNext])

  const handleContactInfoSubmit = useCallback((name: string, email: string) => {
    if (name && email) {
      console.log("User Contact Info:", { name, email, answers })
      setContactInfoSubmitted(true)
    } else {
      setSubmitError("Please fill in both name and email.")
    }
  }, [answers])

  const handleLogin = useCallback(() => {
    // Placeholder for login functionality
    console.log("Login button clicked")
  }, [])

  const handleRetake = useCallback(() => {
    dispatch({ type: 'RESET_ANSWERS' })
    setShowResults(false)
    setContactInfoSubmitted(false)
    setSubmitError(null)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
      <SpaceTheme />
      <div className="relative z-20 w-full max-w-4xl mx-auto">
        {currentQuestion === -1 ? (
          <WelcomeScreen onStart={() => handleNext()} onLogin={handleLogin} />
        ) : (
          <div className="card-custom">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-3xl font-bold text-center text-[var(--text-color)]">Comprehensive Health Assessment</h2>
              <p className="text-center text-[var(--text-color)] opacity-80">Discover insights about your health and receive personalized recommendations</p>
            </div>
            <div>
              {!showResults ? (
                <div>
                  <div className="mb-6">
                    <Progress 
                      value={(currentQuestion + 1) / questions.length * 100} 
                      className="h-2 bg-gray-700" 
                    />
                    <div className="text-xs mt-1 text-right text-[var(--text-color)] opacity-80">
                      Question {currentQuestion + 1} of {questions.length}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-left text-[var(--text-color)]">{questions[currentQuestion].question}</h3>
                  <QuestionRenderer 
                    question={questions[currentQuestion]} 
                    answer={answers[questions[currentQuestion].id] as string | number | string[]} 
                    onAnswer={handleAnswer} 
                  />
                </div>
              ) : !contactInfoSubmitted ? (
                <ContactForm onSubmit={handleContactInfoSubmit} error={submitError} />
              ) : (
                <AnalysisResult answers={answers} healthCalculations={healthCalculations} onRetake={handleRetake} />
              )}
            </div>
            <div className="flex justify-between items-center space-x-4 mt-6">
              <div className="w-1/2">
                {currentQuestion > 0 && !showResults && (
                  <Button 
                    onClick={handlePrevious} 
                    className="btn-custom w-full"
                  >
                    Previous
                  </Button>
                )}
              </div>
              <div className="w-1/2">
                {currentQuestion >= 0 && !showResults && (
                  <Button 
                    onClick={handleNextQuestion} 
                    disabled={!answers[questions[currentQuestion].id] && questions[currentQuestion].id !== 'bodyFat'}
                    className="btn-custom w-full"
                  >
                    {currentQuestion === questions.length - 1 ? "Get Your Analysis" : "Next"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
