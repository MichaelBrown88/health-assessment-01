'use client';

import { Line } from 'react-chartjs-2';
import { calculateExerciseScore } from '@/lib/metricCalculations';
import type { ExerciseFactors } from '@/lib/metricCalculations';
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
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ assessments }) => {
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
      {
        label: 'Exercise Score',
        data: sortedAssessments.map(a => calculateExerciseScore({
          frequency: a.answers.exerciseFrequency as number,
          duration: a.answers.exerciseDuration as number,
          intensity: a.answers.exerciseIntensity as string,
          recoveryDays: a.answers.recoveryDays as number
        } as ExerciseFactors)),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="w-full h-full">
      <Line 
        data={data}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }}
      />
    </div>
  );
};
