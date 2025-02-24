import { useReducer, useState, useCallback } from 'react'
import { Card } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Label } from '@/components/core/label'
import { QuestionRenderer } from './QuestionRenderer'
import { Section } from '@/components/shared/common/Section'
import { LoadingState } from '@/components/shared/common/LoadingState'
import { cn } from '@/lib/utils'
import type { Question, AnswerType } from '@/types/assessment'

interface AssessmentFormProps {
  questions: Question[]
  onComplete: (answers: AnswerType) => void
  initialAnswers?: AnswerType
  showProgress?: boolean
  className?: string
}

// Answer reducer
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

export function AssessmentForm({
  questions,
  onComplete,
  initialAnswers = {},
  showProgress = true,
  className
}: AssessmentFormProps) {
  const [answers, dispatch] = useReducer(answerReducer, initialAnswers)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswer = useCallback((value: string | number | string[]) => {
    dispatch({ type: 'SET_ANSWER', payload: { id: questions[currentQuestion].id, value } })
  }, [currentQuestion, questions])

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
      setIsSubmitting(true)
      onComplete(answers)
    }
  }, [currentQuestion, questions, answers, onComplete])

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
  }, [currentQuestion, questions, answers])

  if (isSubmitting) {
    return <LoadingState message="Processing your answers..." />
  }

  return (
    <Section className={className}>
      <Card className="relative bg-black/40 backdrop-blur-[1px] border-none p-10">
        {showProgress && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <Label className="text-xs font-medium text-gray-300 uppercase tracking-wide">
                Progress
              </Label>
              <div className="text-[11px] text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full bg-blue-500 transition-all duration-300",
                  currentQuestion === 0 && "w-0"
                )}
                style={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}
              />
            </div>
          </div>
        )}

        <div className="space-y-8">
          <h3 className="text-2xl font-medium tracking-tight">
            {questions[currentQuestion].question}
          </h3>

          <QuestionRenderer
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
            answers={answers}
          />

          <div className="flex justify-between pt-8">
            {currentQuestion > 0 && (
              <Button 
                onClick={handlePrevious}
                variant="secondary"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!answers[questions[currentQuestion].id]}
              className="ml-auto"
            >
              {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </Card>
    </Section>
  )
} 