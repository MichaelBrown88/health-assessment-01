'use client'

import React from 'react'
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Question, QuestionOption } from '../data/questions'

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: string | number | string[]) => void;
  answers: Record<string, string | number | string[]>;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, onAnswer, answers }) => {
  switch (question.type) {
    case "radio":
      return (
        <div className="question-container">
          <h2>{question.question}</h2>
          <RadioGroup onValueChange={onAnswer} value={answers[question.id] as string}>
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )
    case "checkbox":
      return (
        <div className="question-container">
          <h2>{question.question}</h2>
          {question.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={(answers[question.id] as string[] || []).includes(option.value)}
                onCheckedChange={(checked) => {
                  const currentAnswers = answers[question.id] as string[] || []
                  if (checked) {
                    onAnswer([...currentAnswers, option.value])
                  } else {
                    onAnswer(currentAnswers.filter(v => v !== option.value))
                  }
                }}
              />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </div>
      )
    case "slider":
      return (
        <div className="question-container">
          <h2>{question.question}</h2>
          <Slider
            min={question.min}
            max={question.max}
            step={question.step}
            value={[answers[question.id] as number || question.defaultValue || 0]}
            onValueChange={(value) => onAnswer(value[0])}
          />
          <p>{answers[question.id] || question.defaultValue}</p>
        </div>
      )
    default:
      return null
  }
}

export default QuestionRenderer
