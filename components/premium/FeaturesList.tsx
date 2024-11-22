'use client'

import { Brain, BarChart, Zap } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "AI Health Coach",
    description: "Get personalized recommendations and insights from our advanced AI"
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Track your progress with detailed charts and trend analysis"
  },
  {
    icon: Zap,
    title: "Priority Features",
    description: "Early access to new features and premium support"
  }
]

export function FeaturesList() {
  return (
    <div className="space-y-4">
      {features.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex items-start space-x-4 p-4 bg-black/30 rounded-lg">
          <Icon className="w-5 h-5 text-blue-400 mt-1" />
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
      ))}
    </div>
  )
} 