import { useState, useCallback } from 'react'
import { Question } from '../types/Question'
import { AnswerType } from '../types/Question'

export const useQuestionNavigation = (questions: Question[], answers: AnswerType) => {
  const [currentQuestion, setCurrentQuestion] = useState(-1)

  const handleNext = useCallback(() => {
    let nextQuestion = currentQuestion + 1
    while (nextQuestion < questions.length) {
      const question = questions[nextQuestion]
      if (question.condition === undefined || 
          (typeof question.condition === 'function' && question.condition(answers))) {
        break
      }
      nextQuestion++
    }
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
      return false
    }
    return true // Indicates all questions are answered
  }, [currentQuestion, questions, answers])

  const handlePrevious = useCallback(() => {
    let prevQuestion = currentQuestion - 1
    while (prevQuestion >= 0) {
      const question = questions[prevQuestion]
      if (question.condition === undefined || 
          (typeof question.condition === 'function' && question.condition(answers))) {
        break
      }
      prevQuestion--
    }
    if (prevQuestion >= 0) {
      setCurrentQuestion(prevQuestion)
    }
  }, [currentQuestion, questions, answers])

  return { currentQuestion, handleNext, handlePrevious }
}
