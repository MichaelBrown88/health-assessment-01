'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { calculateHealthMetrics } from '@/utils/healthUtils'
import { calculateHealthScore, getOverallScore } from '@/utils/pillarScoring'
import { HealthPillars } from '@/components/results/HealthPillars'
import { HealthScoreSection } from '@/components/results/HealthScoreSection'
import { HealthMetricsContainer } from '@/components/results/HealthMetricsContainer'
import { FeedbackSections } from '@/components/results/FeedbackSections'
import { CTASection } from '@/components/results/CTASection'
import { ResultsLoading } from '@/components/results/ResultsLoading'
import { ResultsErrorBoundary } from '@/components/results/ResultsErrorBoundary'
import { SpaceTheme } from '@/components/layout/SpaceTheme'
import type { DecodedResults } from '@/types/results'
import { WelcomeMessage } from '@/components/results/WelcomeMessage'
import { SummarySection } from '@/components/results/SummarySection'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function ResultsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [results, setResults] = useState<DecodedResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contactInfo, setContactInfo] = useState<{ name: string } | null>(null)

  useEffect(() => {
    const loadResults = async () => {
      try {
        // Try getting name from multiple sources
        const contactData = sessionStorage.getItem('contactFormData');
        const userData = user?.displayName || user?.email?.split('@')[0];
        
        if (contactData) {
          setContactInfo(JSON.parse(contactData));
        } else if (userData) {
          setContactInfo({ name: userData });
        }

        // First check for assessment ID in URL
        const assessmentId = searchParams?.get('id')
        if (assessmentId) {
          const docRef = doc(db, 'assessments', assessmentId)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const assessmentData = docSnap.data()
            const healthCalcs = calculateHealthMetrics(assessmentData.answers)
            setResults({
              answers: assessmentData.answers,
              assessmentResults: {
                ...assessmentData.assessmentResults,
                healthCalculations: healthCalcs
              }
            })
            setLoading(false)
            return
          }
        }

        // Then check for results parameter
        const resultsParam = searchParams?.get('results')
        if (resultsParam) {
          const decodedResults = JSON.parse(decodeURIComponent(resultsParam))
          const healthCalcs = calculateHealthMetrics(decodedResults.answers)
          
          setResults({
            ...decodedResults,
            assessmentResults: {
              ...decodedResults.assessmentResults,
              healthCalculations: healthCalcs
            }
          })
          setLoading(false)
          return
        }

        // Finally check session storage
        const storedResults = sessionStorage.getItem('temporaryResults')
        if (storedResults) {
          const parsedResults = JSON.parse(storedResults)
          setResults(parsedResults)
          setLoading(false)
          return
        }

        router.push('/questions')
      } catch (error) {
        console.error('Error loading results:', error)
        setError('Failed to load results')
        setLoading(false)
      }
    }

    loadResults()
  }, [searchParams, router, user])

  if (loading) return <ResultsLoading />
  if (error) return <div className="text-red-500">{error}</div>
  if (!results) return <div>No results found. Please complete the assessment.</div>

  const pillarScores = calculateHealthScore(
    results.answers,
    results.assessmentResults.healthCalculations
  )

  const overallScore = getOverallScore(pillarScores)

  return (
    <ResultsErrorBoundary>
      <div className="min-h-screen flex flex-col relative">
        <SpaceTheme />
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-8 flex-1">
          <div className="space-y-8">
            <WelcomeMessage 
              contactInfo={contactInfo}
              user={user}
            />

            <HealthScoreSection 
              score={overallScore}
            />

            <HealthMetricsContainer 
              healthCalculations={results.assessmentResults.healthCalculations}
              answers={results.answers}
              score={overallScore}
            />

            <div className="relative">
              <HealthPillars 
                pillarScores={pillarScores}
              />
            </div>

            <FeedbackSections 
              answers={results.answers}
              healthCalculations={results.assessmentResults.healthCalculations}
            />

            <SummarySection 
              answers={results.answers}
              healthCalculations={results.assessmentResults.healthCalculations}
              score={overallScore}
            />

            <CTASection user={user} />

            <p className="mt-4 text-sm text-gray-300">
              Remember, these suggestions are based on general guidelines. For a tailored approach to achieving your health goals, consider consulting with a health professional.
            </p>
          </div>
        </div>
      </div>
    </ResultsErrorBoundary>
  )
}