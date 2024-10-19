'use client'

import React from 'react'
import { Question, QuestionOption } from '../data/questions'

interface QuestionRendererProps {
  question: Question
  onAnswer: (answer: string | number | string[]) => void
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, onAnswer }) => {
  return (
    <div className="question-container">
      <h2>{question.question}</h2>
      {question.type === 'text' && (
        <input
          type="text"
          onChange={(e) => onAnswer(e.target.value)}
          className="input-custom"
        />
      )}
      {question.type === 'number' && (
        <input
          type="number"
          onChange={(e) => onAnswer(parseInt(e.target.value, 10))}
          className="input-custom"
        />
      )}
      {question.type === 'choice' && question.options && (
        <select onChange={(e) => onAnswer(e.target.value)} className="input-custom">
          {question.options.map((option: QuestionOption) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {question.type === 'slider' && (
        <input
          type="range"
          min={question.min}
          max={question.max}
          step={question.step}
          defaultValue={question.defaultValue}
          onChange={(e) => onAnswer(parseInt(e.target.value, 10))}
          className="slider-custom"
        />
      )}
      {question.type === 'radio' && question.options && (
        <div>
          {question.options.map((option: QuestionOption) => (
            <label key={option.value} className="block">
              <input
                type="radio"
                name={question.id}
                value={option.value}
                onChange={(e) => onAnswer(e.target.value)}
                className="radio-custom"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
      {question.type === 'checkbox' && question.options && (
        <div>
          {question.options.map((option: QuestionOption) => (
            <label key={option.value} className="block">
              <input
                type="checkbox"
                name={question.id}
                value={option.value}
                onChange={() => {
                  const checkboxes = document.querySelectorAll<HTMLInputElement>(`input[name="${question.id}"]:checked`);
                  const values = Array.from(checkboxes).map(cb => cb.value);
                  onAnswer(values);
                }}
                className="checkbox-custom"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuestionRenderer
