'use client'

import React, { useState, useCallback, useMemo, useReducer } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { questions, AnswerType } from '../data/questions'
import { useHealthCalculations } from '../hooks/useHealthCalculations'
import { WelcomeScreen } from './WelcomeScreen'
import { ContactForm } from './ContactForm'
import { AnalysisResult } from './AnalysisResult'
import { SpaceTheme } from './SpaceTheme'

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

export const HealthAssessment: React.FC = () => {
  const [answers, dispatch] = useReducer(answerReducer, {})
  const [currentQuestion, setCurrentQuestion] = useState(-1)
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

  const handleLogin = useCallback(() => {
    // Placeholder for login functionality
    console.log("Login button clicked")
  }, [])

  const handleRetake = useCallback(() => {
    dispatch({ type: 'RESET_ANSWERS' })
    setShowResults(false)
    setContactInfoSubmitted(false)
    setSubmitError(null)
    setCurrentQuestion(-1)
  }, [])

  const renderQuestion = useMemo(() => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) return null

    const question = questions[currentQuestion]
    switch (question.type) {
      case "radio":
      case "checkbox":
        return (
          <>
            <div className={`option-group ${question.type}`}>
              {question.options?.map((option) => (
                <label key={option.value} className="option-item">
                  <input
                    type={question.type}
                    name={question.id}
                    value={option.value}
                    onChange={(e) => {
                      if (question.type === "checkbox") {
                        const currentAnswers = answers[question.id] as string[] || []
                        const newAnswers = e.target.checked
                          ? [...currentAnswers, option.value]
                          : currentAnswers.filter(v => v !== option.value)
                        handleAnswer(newAnswers)
                      } else {
                        handleAnswer(e.target.value)
                      }
                    }}
                    className="option-input"
                    checked={
                      question.type === "checkbox"
                        ? (answers[question.id] as string[] || []).includes(option.value)
                        : answers[question.id] === option.value
                    }
                  />
                  <span className="option-label">
                    <span className="option-check"></span>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            {question.type === "checkbox" && (
              <p className="multiple-select-text">You can select multiple options</p>
            )}
          </>
        )
      case "slider":
        return (
          <div className="slider-container">
            <input
              type="range"
              min={question.min}
              max={question.max}
              step={question.step}
              value={answers[question.id] as number || question.defaultValue || 0}
              onChange={(e) => handleAnswer(parseInt(e.target.value, 10))}
              className="slider-input"
            />
            <div 
              className="slider-track" 
              style={{width: `${((answers[question.id] as number || question.defaultValue || 0) - (question.min || 0)) / ((question.max || 100) - (question.min || 0)) * 100}%`}}
            ></div>
            <div 
              className="slider-thumb"
              style={{left: `${((answers[question.id] as number || question.defaultValue || 0) - (question.min || 0)) / ((question.max || 100) - (question.min || 0)) * 100}%`}}
            ></div>
            <div className="slider-value">
              {answers[question.id] || question.defaultValue}
              {question.id === "age" ? " years" : 
               question.id === "weight" ? " kg" : 
               question.id === "height" ? " cm" :
               question.id === "bodyFat" ? "%" : ""}
            </div>
          </div>
        )
      default:
        return null
    }
  }, [currentQuestion, answers, handleAnswer])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      <SpaceTheme />
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-16">
        {currentQuestion === -1 ? (
          <WelcomeScreen onStart={() => setCurrentQuestion(0)} onLogin={handleLogin} />
        ) : (
          <Card className="card-custom border-none bg-opacity-50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#f7f7f7]">Comprehensive Health Assessment</CardTitle>
              <CardDescription className="text-[#f7f7f7] opacity-80">Discover insights about your health and receive personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              {!showResults ? (
                <div>
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-1 block text-[#f7f7f7] opacity-80">Progress</Label>
                    <div className="progress-bar">
                      <div 
                        className="progress-bar-fill" 
                        style={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}
                      ></div>
                    </div>
                    <div className="text-xs mt-1 text-right text-[#f7f7f7] opacity-60">
                      Question {currentQuestion + 1} of {questions.length}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-left text-[#f7f7f7]">{questions[currentQuestion].question}</h3>
                  {renderQuestion}
                </div>
              ) : !contactInfoSubmitted ? (
                <ContactForm onSubmit={handleContactInfoSubmit} error={submitError} />
              ) : (
                <AnalysisResult answers={answers} healthCalculations={healthCalculations} onRetake={handleRetake} />
              )}
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between items-center mt-8">
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
        )}
      </div>
    </div>
  )
}

export default HealthAssessment
