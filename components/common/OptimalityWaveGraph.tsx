import React from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { scaleLinear } from 'd3-scale';
import { calculateHealthMetrics } from '@/utils/healthUtils';
import type { HealthCalculations } from '@/types/results';

// Simplified metric type that only includes what we need
interface HealthMetric {
  date: Date;
  metrics: {
    bmi: number;
    bodyFat?: number;
  };
  answers: Record<string, string | number | boolean | string[]>;
}

interface ChartDataPoint {
  date: Date;
  [key: string]: Date | number;
}

interface OptimalityWaveGraphProps {
  healthMetrics: HealthMetric[];
  width?: number;
  height?: number;
}

const OptimalityWaveGraph: React.FC<OptimalityWaveGraphProps> = ({
  healthMetrics,
  width = 800,
  height = 400
}) => {
  const colorScale = scaleLinear<string>()
    .domain([-1, 0, 1])
    .range(['#EF4444', '#34D399', '#EF4444']);

  const data: ChartDataPoint[] = healthMetrics.map(metric => {
    const calculations = calculateHealthMetrics(metric.answers);
    return {
      date: metric.date,
      exerciseDeviation: (calculations.exerciseScore - 75) / 75, // Normalize to [-1, 1]
      nutritionDeviation: (calculations.nutritionScore - 75) / 75,
      mentalHealthDeviation: (calculations.mentalHealthScore - 75) / 75,
      sleepDeviation: (calculations.sleepScore - 75) / 75
    };
  });

  return (
    <div className="wave-graph">
      <ResponsiveContainer width={width} height={height}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis domain={[-1, 1]} />
          <Tooltip />
          <Legend />
          {Object.keys(data[0] || {}).filter(key => key !== 'date').map(metric => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={colorScale(data[data.length - 1][metric] as number)}
              dot={false}
              strokeWidth={2}
            />
          ))}
          <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OptimalityWaveGraph;
