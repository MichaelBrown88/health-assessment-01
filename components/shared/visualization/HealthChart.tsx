import { Line } from 'react-chartjs-2';
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
import type { HealthMetric } from '@/types/health';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HealthChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
    }[];
  };
  height?: number;
  showLegend?: boolean;
  maxValue?: number;
  className?: string;
}

export function HealthChart({ 
  data,
  height = 400,
  showLegend = true,
  maxValue,
  className = ''
}: HealthChartProps) {
  return (
    <div className={`w-full h-[${height}px] ${className}`}>
      <Line 
        data={data}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: maxValue,
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
              display: showLegend,
              labels: {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            }
          }
        }}
      />
    </div>
  );
} 