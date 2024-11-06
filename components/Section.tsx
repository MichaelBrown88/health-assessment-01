import React from 'react'
import { FeedbackItem } from './FeedbackItem'
import { ContextualAlert } from './ContextualAlert'
import { ContextualAnalysis } from '@/types/ContextualAnalysis'

interface SectionProps {
  title: string;
  items: {
    label: string;
    value: string;
    feedback: {
      color: string;
      feedback: string;
      recommendations: string;
    };
  }[];
  contextualAnalyses: ContextualAnalysis[];
}

export const Section: React.FC<SectionProps> = ({ title, items, contextualAnalyses }) => {
  return (
    <section className="bg-black/30 rounded-lg p-8 deep-space-border">
      <h3 className="text-2xl font-semibold mb-6">{title}</h3>
      <ul className="space-y-6">
        {items.map((item, index) => (
          <FeedbackItem
            key={index}
            label={item.label}
            value={item.value}
            feedback={item.feedback}
          />
        ))}
      </ul>

      {contextualAnalyses && contextualAnalyses.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-lg font-medium mb-4 text-yellow-400">Important Feedback:</h4>
          <ContextualAlert 
            analysis={contextualAnalyses}
            className="text-sm"
          />
        </div>
      )}
    </section>
  )
}
