import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { calculateHealthMetrics, calculateScore, generateSummary } from '@/utils/healthUtils'
import type { AnswerType, AssessmentData } from '@/types/assessment'
import type { AnalysisResults } from '@/types/results'

export interface AssessmentResults {
  answers: AnswerType;
  analysis: AnalysisResults | null;
}

export function useAssessmentResults(assessmentId: string | null, answersParam: string | null) {
  const [results, setResults] = useState<AssessmentResults>({ answers: {}, analysis: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        let answers: AnswerType = {}

        // Load answers from Firestore or params
        if (assessmentId) {
          const docRef = doc(db, 'assessments', assessmentId)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const data = docSnap.data() as AssessmentData
            answers = data.answers
          }
        } else if (answersParam) {
          answers = JSON.parse(answersParam)
        }

        // Calculate results from answers
        if (Object.keys(answers).length > 0) {
          const healthCalculations = calculateHealthMetrics(answers)
          const score = calculateScore(answers, healthCalculations)
          const summary = generateSummary(answers)

          setResults({
            answers,
            analysis: {
              score,
              healthCalculations,
              summary
            }
          })
        }
      } catch (error) {
        console.error('Error processing assessment:', error)
        setError('Failed to process assessment data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [assessmentId, answersParam])

  return { results, loading, error }
} 