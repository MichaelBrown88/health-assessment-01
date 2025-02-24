'use client';

import { Line } from 'react-chartjs-2';
import { calculateHealthMetrics } from '@/utils/health';
import type { HealthCalculations } from '@/types/results';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface ChartData {
  date: Date;
  timestamp: number;
  metrics: {
    overallScore: number;
    [key: string]: number;
  };
  answers: Record<string, string | number | boolean | string[]>;
}

interface ProgressChartProps {
  assessments: ChartData[];
  variant?: 'dashboard' | 'results';
  showBMI?: boolean;
  height?: number;
  className?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ 
  assessments, 
  variant = 'dashboard',
  showBMI = false,
  height = 400,
  className = ''
}) => {
  // Sort assessments by date
  const sortedAssessments = [...assessments].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Track changes in specific metrics
  const data = {
    labels: sortedAssessments.map(a => new Date(a.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Overall Score',
        data: sortedAssessments.map(a => a.metrics.overallScore),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      ...(variant === 'dashboard' ? [
        {
          label: 'Exercise Score',
          data: sortedAssessments.map(a => calculateHealthMetrics(a.answers).exerciseScore),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
        {
          label: 'Mental Health Score',
          data: sortedAssessments.map(a => calculateHealthMetrics(a.answers).mentalHealthScore),
          borderColor: 'rgb(153, 102, 255)',
          tension: 0.1
        },
        {
          label: 'Sleep Score',
          data: sortedAssessments.map(a => calculateHealthMetrics(a.answers).sleepScore),
          borderColor: 'rgb(255, 159, 64)',
          tension: 0.1
        }
      ] : []),
      ...(showBMI && variant === 'results' ? [{
        label: 'BMI',
        data: sortedAssessments.map(a => calculateHealthMetrics(a.answers).bmi),
        borderColor: 'rgb(82, 202, 157)',
        tension: 0.1
      }] : [])
    ].filter(Boolean)
  };

  return (
    <div className={`w-full h-[${height}px] ${className}`}>
      <Line 
        data={data}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: showBMI ? undefined : 100,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.8)',
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.8)',
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            }
          }
        }}
      />
    </div>
  );
};
