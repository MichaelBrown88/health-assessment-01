'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface HealthTrendChartProps {
  data: {
    date: Date
    score: number
  }[]
}

export function HealthTrendChart({ data }: HealthTrendChartProps) {
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Health Score',
        data: data.map(item => item.score),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
    },
  }

  return (
    <div className="bg-black/30 rounded-lg p-6 deep-space-border">
      <h3 className="text-xl font-semibold mb-4 text-white">Health Score Trend</h3>
      <Line data={chartData} options={options} />
    </div>
  )
}
