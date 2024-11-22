import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { AnswerType, AssessmentData } from '@/types/assessment'

export function useAssessmentResults(assessmentId: string | null, answersParam: string | null) {
  const [answers, setAnswers] = useState<AnswerType>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        if (assessmentId) {
          const docRef = doc(db, 'assessments', assessmentId)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const data = docSnap.data() as AssessmentData
            setAnswers(data.answers)
          }
        } else if (answersParam) {
          setAnswers(JSON.parse(answersParam))
        }
      } catch (error) {
        console.error('Error loading assessment:', error)
        setError('Failed to load assessment data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [assessmentId, answersParam])

  return { answers, loading, error }
} 