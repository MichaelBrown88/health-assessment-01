'use client'

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { HealthCalculations } from "@/types/results"

interface HealthMetricsProps {
  data: {
    date: string;
    score: number;
    bmi?: number;
  }[];
  className?: string;
}

export function HealthMetricsChart({ data, className }: HealthMetricsProps) {
  return (
    <Card className={`bg-black/30 backdrop-blur-sm border-gray-800 p-4 h-[300px] ${className}`}>
      <h3 className="text-lg font-semibold mb-2 text-white">Health Progress</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
          <XAxis 
            dataKey="date" 
            stroke="#888888"
            fontSize={12}
          />
          <YAxis 
            stroke="#888888"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{ 
              background: 'rgba(0,0,0,0.8)', 
              border: '1px solid #333',
              borderRadius: '4px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Health Score"
          />
          <Line 
            type="monotone" 
            dataKey="bmi" 
            stroke="#82ca9d" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="BMI"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
} 