import React from 'react'
import { CheckCircle, MinusCircle, XCircle } from "lucide-react"

interface FeedbackItemProps {
  label: string;
  value: string;
  feedback: {
    color: string;
    feedback: string;
    recommendations: string;
  };
}

const iconMap = {
  green: <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
  amber: <MinusCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />,
  red: <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
};

export const FeedbackItem = ({ label, value, feedback }: FeedbackItemProps) => {
  return (
    <div className="bg-black/20 rounded-lg mb-2">
      <div className="flex items-center justify-between p-2 bg-gray-700/50">
        <div className="flex items-center space-x-2">
          {iconMap[feedback.color as keyof typeof iconMap] || null}
          <h4 className="font-medium text-base">{label}</h4>
        </div>
        <span className="text-sm">{value}</span>
      </div>
      <div className="p-2 text-sm space-y-1">
        <p><span className="font-medium">Feedback:</span> {feedback.feedback}</p>
        <p><span className="font-medium">Recommendation:</span> {feedback.recommendations}</p>
      </div>
    </div>
  )
}
