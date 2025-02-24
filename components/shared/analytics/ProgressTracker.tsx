import { useMemo } from 'react'
import { HealthChart } from '../visualization/HealthChart'
import { MetricsCard } from './MetricsCard'
import type { HealthMetric } from '@/types/health'

interface ProgressTrackerProps {
  metrics: HealthMetric[]
  title: string
  description?: string
  showCards?: boolean
  className?: string
}

export function ProgressTracker({
  metrics,
  title,
  description,
  showCards = true,
  className = ''
}: ProgressTrackerProps) {
  const chartData = useMemo(() => {
    const labels = metrics.map(m => new Date(m.timestamp).toLocaleDateString())
    const currentValue = metrics[metrics.length - 1]?.value ?? 0
    const previousValue = metrics[metrics.length - 2]?.value ?? 0
    const trend = previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 0

    return {
      labels,
      datasets: [{
        label: title,
        data: metrics.map(m => m.value),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }],
      trend
    }
  }, [metrics, title])

  return (
    <div className={className}>
      {showCards && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricsCard
            title="Current Value"
            value={metrics[metrics.length - 1]?.value ?? 0}
            trend={chartData.trend}
            variant="highlight"
          />
          <MetricsCard
            title="Average"
            value={metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length}
            description="Average over time period"
          />
          <MetricsCard
            title="Best Value"
            value={Math.max(...metrics.map(m => m.value))}
            description="Highest recorded value"
          />
        </div>
      )}
      
      <HealthChart
        data={chartData}
        height={300}
        className="mt-4"
      />
      
      {description && (
        <p className="mt-4 text-sm text-gray-400">{description}</p>
      )}
    </div>
  )
} 