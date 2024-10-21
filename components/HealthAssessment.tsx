'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import QuestionRenderer from './QuestionRenderer'
import AnalysisResult from './AnalysisResult'
import { questions, AnswerType } from '../data/questions'
import { useHealthCalculations } from '../hooks/useHealthCalculations'

const HealthAssessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<AnswerType>({})
  const [showResults, setShowResults] = useState(false)

  const healthCalculations = useHealthCalculations(answers)

  const handleAnswer = (answer: string | number | string[]) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleRetake = () => {
    setAnswers({})
    setCurrentQuestion(0)
    setShowResults(false)
  }

  if (showResults) {
    return <AnalysisResult answers={answers} healthCalculations={healthCalculations} onRetake={handleRetake} />
  }

  return (
    <div className="health-assessment-container">
      <QuestionRenderer
        question={questions[currentQuestion]}
        onAnswer={handleAnswer}
        answers={answers}
      />
      <div className="button-container mt-4 flex justify-between">
        {currentQuestion > 0 && (
          <Button onClick={handlePrevious}>Previous</Button>
        )}
        <Button onClick={handleNext}>
          {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  )
}

export default HealthAssessment
