import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Assessment } from '@/types/assessment'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { History } from 'lucide-react'

interface HistoricalResultsProps {
  assessments: Assessment[]
}

export function HistoricalResults({ assessments }: HistoricalResultsProps) {
  const router = useRouter()
  const [selectedAssessment, setSelectedAssessment] = useState<string>('')

  const sortedAssessments = [...assessments].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0)
    const dateB = new Date(b.createdAt || 0)
    return dateB.getTime() - dateA.getTime()
  })

  const handleAssessmentSelect = (assessmentId: string) => {
    setSelectedAssessment(assessmentId)
    router.push(`/results/${assessmentId}`)
  }

  return (
    <div className="flex items-center gap-2">
      <History className="h-4 w-4 text-gray-400" />
      <Select
        value={selectedAssessment}
        onValueChange={handleAssessmentSelect}
      >
        <SelectTrigger className="w-[250px] bg-black/30 backdrop-blur-sm border-gray-800">
          <SelectValue placeholder="View historical results" />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border-gray-800">
          {sortedAssessments.map((assessment) => (
            <SelectItem 
              key={assessment.id} 
              value={assessment.id || ''}
              className="text-white hover:bg-gray-800"
            >
              {new Date(assessment.createdAt || 0).toLocaleDateString()} - Score: {assessment.metrics.overallScore}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 