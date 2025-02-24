import { Section } from '../common/Section'
import { MetricsCard } from '../analytics/MetricsCard'
import { ProgressTracker } from '../analytics/ProgressTracker'
import type { HealthCalculations } from '@/types/results'
import type { HealthMetric } from '@/types/health'

interface HealthMetricsDisplayProps {
  title?: string
  description?: string
  healthCalculations: HealthCalculations
  historicalData?: HealthMetric[]
  showProgress?: boolean
  className?: string
}

export function HealthMetricsDisplay({
  title = 'Health Metrics',
  description,
  healthCalculations,
  historicalData,
  showProgress = true,
  className
}: HealthMetricsDisplayProps) {
  const metrics = [
    {
      title: 'BMI',
      value: healthCalculations.bmi?.toFixed(1) ?? 'N/A',
      description: healthCalculations.bmiCategory,
      info: 'Body Mass Index - a measure of body fat based on height and weight'
    },
    {
      title: 'BMR',
      value: healthCalculations.bmr?.toFixed(0) ?? 'N/A',
      description: 'Basal Metabolic Rate',
      info: 'The number of calories your body burns at rest'
    },
    {
      title: 'Body Fat',
      value: healthCalculations.bodyFat ? `${healthCalculations.bodyFat.toFixed(1)}%` : 'N/A',
      description: healthCalculations.isBodyFatEstimated ? 'Estimated' : 'Measured',
      info: 'Percentage of total body mass that is fat'
    }
  ]

  return (
    <Section
      title={title}
      description={description}
      className={className}
      variant="card"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <MetricsCard
            key={index}
            {...metric}
            variant={metric.title === 'BMI' && healthCalculations.bmi ? 
              (healthCalculations.bmi < 18.5 || healthCalculations.bmi >= 25 ? 'warning' : 'highlight')
              : 'default'
            }
          />
        ))}
      </div>

      {showProgress && historicalData && historicalData.length > 0 && (
        <div className="mt-8">
          <ProgressTracker
            metrics={historicalData}
            title="Progress Over Time"
          />
        </div>
      )}
    </Section>
  )
} 