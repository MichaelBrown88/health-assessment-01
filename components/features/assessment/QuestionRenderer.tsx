'use client'

import React, { useState, useEffect } from 'react'
import { Slider } from "@/components/core/slider"
import { RadioGroup, RadioGroupItem } from "@/components/core/radio-group"
import { Checkbox } from "@/components/core/checkbox"
import type { Question } from "@/types/questions"
import { cn } from "@/lib/utils"

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: string | number | string[]) => void;
  currentAnswer?: string | number | string[];
  resetMessage?: boolean;
}

export function QuestionRenderer({ question, onAnswer, currentAnswer, resetMessage }: QuestionRendererProps) {
  const [animatedValue, setAnimatedValue] = useState<number | null>(null);

  // Single effect for body fat animation
  useEffect(() => {
    if (question.id === 'bodyFat') {
      const currentValue = (currentAnswer as number) || 20; // Default to 20 for body fat
      
      if (resetMessage) {
        setAnimatedValue(currentValue);
        const timeout = setTimeout(() => {
          setAnimatedValue(20); // Default body fat value
        }, 300);
        return () => clearTimeout(timeout);
      } else {
        setAnimatedValue(currentValue);
      }
    }
  }, [question.id, resetMessage, currentAnswer]);

  const type = question.type === 'single' ? 'radio' :
               question.type === 'multiple' ? 'checkbox' :
               question.type === 'scale' ? 'slider' : 'radio';

  const formatDisplayValue = (value: number, questionId: string) => {
    // For whole numbers, don't show decimals
    if (Number.isInteger(value)) {
      return value.toString();
    }
    // For decimal numbers, show one decimal place
    return value.toFixed(1);
  };

  switch (type) {
    case "radio":
      return (
        <div className="question-container">
          <RadioGroup onValueChange={onAnswer} value={String(currentAnswer || '')}>
            {question.options?.map((option) => (
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
      const selectedValues = Array.isArray(currentAnswer) ? currentAnswer : [];
      
      return (
        <div className="question-container">
          <p className="text-sm text-[#f7f7f7] opacity-70 mb-2">Select all that apply</p>
          {question.options?.map((option) => (
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
      const getDefaultValue = (questionId: string) => {
        switch (questionId) {
          case 'age': return 30;
          case 'height': return 170;
          case 'weight': return 70;
          case 'bodyFat': return 20;
          default: return 0;
        }
      };

      const displayValue = question.id === 'bodyFat' && animatedValue !== null 
        ? animatedValue 
        : (currentAnswer as number) || getDefaultValue(question.id);
      
      return (
        <div className="question-container">
          <div className="flex items-center gap-2">
            <p className={cn(
              "text-xl font-semibold mb-2 transition-transform duration-1000",
              question.id === 'bodyFat' && resetMessage && "text-blue-400 scale-110"
            )}>
              {formatDisplayValue(displayValue, question.id)}
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
              value={[displayValue]}
              onValueChange={(value) => {
                if (!resetMessage) {
                  onAnswer(value[0]);
                }
              }}
              className={cn(
                "w-full",
                question.id === 'bodyFat' && resetMessage && "pointer-events-none opacity-50"
              )}
              disabled={question.id === 'bodyFat' && resetMessage}
            />
          </div>
          {question.description && (
            <div className="text-xs text-[#f7f7f7] opacity-50 mt-1">
              {question.description}
            </div>
          )}
        </div>
      )
    default:
      return null
  }
}
