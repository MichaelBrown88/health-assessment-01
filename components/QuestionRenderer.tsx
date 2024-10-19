'use client'

import React from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Question } from '../types/Question'

interface QuestionRendererProps {
  question: Question
  answer: string | number | string[]
  onAnswer: (value: string | number | string[]) => void
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, answer, onAnswer }) => {
  switch (question.type) {
    case 'radio':
      return (
        <RadioGroup onValueChange={onAnswer} value={answer as string}>
          {question.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      )
    case 'checkbox':
      return (
        <div>
          {question.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={Array.isArray(answer) ? answer.includes(option.value) : false}
                onCheckedChange={(checked) => {
                  const currentAnswer = Array.isArray(answer) ? answer : []
                  const newAnswer = checked
                    ? [...currentAnswer, option.value]
                    : currentAnswer.filter((v) => v !== option.value)
                  onAnswer(newAnswer)
                }}
              />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </div>
      )
    case 'slider':
      return (
        <div className="space-y-4">
          <Slider
            min={question.min}
            max={question.max}
            step={question.step}
            value={[answer as number || question.defaultValue || 0]}
            onValueChange={(value) => onAnswer(value[0])}
          />
          <div className="text-center font-semibold">
            {answer || question.defaultValue}
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
}
