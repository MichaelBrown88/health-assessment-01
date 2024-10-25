import React from 'react'
import { FeedbackItem } from './FeedbackItem'

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
}

export const Section: React.FC<SectionProps> = ({ title, items }) => {
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
    </section>
  )
}
