import { marked } from 'marked';
import { TrafficLightIcon } from './TrafficLightIcon';
import type { FeedbackItem as FeedbackItemType } from '@/types/feedback';
import type { TrafficLightColor } from '@/types/health';

interface FeedbackItemProps {
  label: string;
  value: string;
  color: TrafficLightColor;
  feedback: FeedbackItemType | null;
}

export function FeedbackItem({ label, value, color, feedback }: FeedbackItemProps) {
  // Default feedback for null cases
  const defaultFeedback: FeedbackItemType = {
    feedback: "This aspect has not been assessed yet.",
    recommendations: "Complete this section of the assessment for personalized feedback."
  };

  // Use default feedback if feedback is null
  const { feedback: feedbackText, recommendations } = feedback || defaultFeedback;

  return (
    <div className="border-b border-gray-800 pb-6 last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <TrafficLightIcon color={color} />
          <h4 className="text-lg font-medium bg-black/20 px-3 py-1 rounded-md backdrop-blur-sm">
            {label}
          </h4>
        </div>
        <div className="text-sm text-gray-400 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
          {value}
        </div>
      </div>
      <div className="space-y-4 text-sm">
        <div className="space-y-2">
          <h5 className="text-gray-400 font-medium">Feedback:</h5>
          <div 
            className="text-gray-300 pl-4"
            dangerouslySetInnerHTML={{ __html: marked(feedbackText || '') }} 
          />
        </div>
        <div className="space-y-2">
          <h5 className="text-gray-400 font-medium">Recommendations:</h5>
          <div 
            className="text-gray-300 pl-4"
            dangerouslySetInnerHTML={{ __html: marked(recommendations || '') }} 
          />
        </div>
      </div>
    </div>
  )
} 