'use client'

import React from 'react'
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import type { Question } from "@/types/questions"

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: string | number | string[]) => void;
  answers: Record<string, string | number | string[]>;
  resetMessage?: boolean;
}

export function QuestionRenderer({ question, onAnswer, answers, resetMessage }: QuestionRendererProps) {
  switch (question.type) {
    case "radio":
      return (
        <div className="question-container">
          <RadioGroup onValueChange={onAnswer} value={answers[question.id] as string || ''}>
            {question.options?.map((option: { value: string; label: string }) => (
              <label
                key={option.value}
                htmlFor={option.value}
                className="flex items-center space-x-3 mb-0.5 hover:bg-white/5 rounded-lg p-1 cursor-pointer relative z-50"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <span>{option.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      )
    case "checkbox":
      const selectedValues = Array.isArray(answers[question.id]) ? answers[question.id] as string[] : [];
      
      return (
        <div className="question-container">
          <p className="text-sm text-[#f7f7f7] opacity-70 mb-2">Select all that apply</p>
          {question.options?.map((option: { value: string; label: string }  ) => (
            <label
              key={option.value}
              htmlFor={option.value}
              className="flex items-center space-x-3 mb-0.5 hover:bg-white/5 rounded-lg p-1 cursor-pointer relative z-50"
            >
              <Checkbox
                id={option.value}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onAnswer([...selectedValues, option.value]);
                  } else {
                    onAnswer(selectedValues.filter(v => v !== option.value));
                  }
                }}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      )
    case "slider":
      return (
        <div className="question-container">
          <div className="flex items-center gap-2">
            <p className="text-xl font-semibold mb-2">
              {answers[question.id] || question.defaultValue}
              {question.id === "age" ? " years" : 
               question.id === "weight" ? " kg" : 
               question.id === "height" ? " cm" :
               question.id === "bodyFat" ? "%" : ""}
            </p>
            {question.id === 'bodyFat' && resetMessage && (
              <div className="text-xs text-white/70 bg-white/10 px-3 py-1.5 rounded-full animate-fade-in-out">
                Resetting...
              </div>
            )}
          </div>
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
          {question.subText && (
            <div className="text-xs text-[#f7f7f7] opacity-50 mt-1">
              {question.subText}
            </div>
          )}
        </div>
      )
    default:
      return null
  }
}
