'use client'

import React from 'react'
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Question } from '../data/questions'

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
          <RadioGroup onValueChange={onAnswer} value={answers[question.id] as string || ''}>
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 mb-2">
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
          <p className="text-sm text-[#f7f7f7] opacity-70 mb-2">Select all that apply</p>
          {question.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 mb-2">
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
          <p className="text-xl font-semibold mb-2">
            {answers[question.id] || question.defaultValue}
            {question.id === "age" ? " years" : 
             question.id === "weight" ? " kg" : 
             question.id === "height" ? " cm" :
             question.id === "bodyFat" ? "%" : ""}
          </p>
          <div className="w-full px-4 slider-container">
            <Slider
              min={question.min}
              max={question.max}
              step={question.step}
              value={[answers[question.id] as number || question.defaultValue || 0]}
              onValueChange={(value) => onAnswer(value[0])}
              className="w-full"
            />
          </div>
        </div>
      )
    default:
      return null
  }
}

export default QuestionRenderer
