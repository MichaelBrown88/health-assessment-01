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
import { AnswerType } from '../types/Question'

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
  }, [currentQuestion, questions])

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
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden bg-[#050508] text-white font-['Montserrat',sans-serif]">
      <SpaceTheme />
      <div className="relative z-20 w-full max-w-4xl mx-auto">
        {currentQuestion === -1 ? (
          <WelcomeScreen onStart={() => handleNext()} onLogin={handleLogin} />
        ) : (
          <Card className="bg-gray-900 bg-opacity-50 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="flex flex-col items-center">
              <CardTitle className="text-3xl font-bold text-center text-white">Comprehensive Health Assessment</CardTitle>
              <CardDescription className="text-center text-gray-300">Discover insights about your health and receive personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              {!showResults ? (
                <div>
                  <div className="mb-6">
                    <Progress 
                      value={(currentQuestion + 1) / questions.length * 100} 
                      className="h-2 bg-gray-700" 
                    />
                    <div className="text-xs mt-1 text-right text-gray-400">
                      Question {currentQuestion + 1} of {questions.length}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-left">{questions[currentQuestion].question}</h3>
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
            </CardContent>
            <CardFooter className="flex justify-between items-center space-x-4">
              <div className="w-1/2">
                {currentQuestion > 0 && !showResults && (
                  <Button onClick={handlePrevious} variant="outline" className="w-full px-4 py-2 text-sm">
                    Previous
                  </Button>
                )}
              </div>
              <div className="w-1/2">
                {currentQuestion >= 0 && !showResults && (
                  <Button 
                    onClick={handleNextQuestion} 
                    disabled={!answers[questions[currentQuestion].id] && questions[currentQuestion].id !== 'bodyFat'}
                    className="w-full px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {currentQuestion === questions.length - 1 ? "Get Your Analysis" : "Next"}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
