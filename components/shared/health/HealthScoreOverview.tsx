import React from 'react';

interface HealthScoreProps {
  scores: {
    title: string;
    score: number;
  }[];
}

export const HealthScoreOverview: React.FC<HealthScoreProps> = ({ scores }) => {
  return (
    <div className="bg-black/30 rounded-lg p-6 deep-space-border">
      <h3 className="text-2xl font-semibold mb-4">Health Score Overview</h3>
      <div className="space-y-4">
        {scores.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-sm font-medium">{item.score}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="deep-space-gradient h-2.5 rounded-full"
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
