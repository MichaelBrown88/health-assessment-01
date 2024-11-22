'use client'

import { useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getContextualAnalysis } from '@/utils/healthUtils'
import type { AnswerType } from '@/types/assessment'
import type { ContextualAnalysis } from '@/types/ContextualAnalysis'

interface AnalysisSectionProps {
  answers: AnswerType;
}

export function AnalysisSection({ answers }: AnalysisSectionProps) {
  const exerciseAnalysis = useMemo(() => 
    getContextualAnalysis('exercise', answers), [answers])
  
  const wellbeingAnalysis = useMemo(() => 
    getContextualAnalysis('wellbeing', answers), [answers])
  
  const nutritionAnalysis = useMemo(() => 
    getContextualAnalysis('nutrition', answers), [answers])

  return (
    <Tabs defaultValue="exercise" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="exercise">Exercise</TabsTrigger>
        <TabsTrigger value="wellbeing">Wellbeing</TabsTrigger>
        <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
      </TabsList>

      <TabsContent value="exercise">
        <AnalysisContent analysis={exerciseAnalysis} />
      </TabsContent>
      <TabsContent value="wellbeing">
        <AnalysisContent analysis={wellbeingAnalysis} />
      </TabsContent>
      <TabsContent value="nutrition">
        <AnalysisContent analysis={nutritionAnalysis} />
      </TabsContent>
    </Tabs>
  )
}

function AnalysisContent({ analysis }: { analysis: ContextualAnalysis }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{analysis.title}</h3>
      <p className="text-gray-400">{analysis.summary}</p>
      <ul className="space-y-2">
        {analysis.recommendations.map((rec, index) => (
          <li key={index} className="flex items-start space-x-2">
            <span className="text-blue-400">•</span>
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  )
} 