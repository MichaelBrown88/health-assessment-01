import React from 'react';
import { getMealFeedback } from '../utils/mealFeedback';

interface ResultCardProps {
  mealTime: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ mealTime }) => {
  // Or wherever you display the meal feedback
  const { feedback, recommendation } = getMealFeedback(mealTime);

  return (
    <div className="space-y-2">
      <h3>Last Meal</h3>
      <p>{mealTime}</p>
      <p>Feedback: {feedback}</p>
      <p>Recommendation: {recommendation}</p>
    </div>
  );
};

export default ResultCard;

