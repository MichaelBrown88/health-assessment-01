import { CheckCircle, MinusCircle, XCircle, Lightbulb, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackItemProps {
  label: string;
  value: string;
  feedback: {
    color: string;
    feedback: string;
    recommendations: string | string[];
  };
}

const iconMap = {
  green: <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
  amber: <MinusCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />,
  red: <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
};

const colorMap = {
  green: "bg-green-500/10",
  amber: "bg-yellow-500/10",
  red: "bg-red-500/10",
};

export const FeedbackItem = ({ label, value, feedback }: FeedbackItemProps) => {
  // Handle both string and array recommendations
  const recommendationsText = Array.isArray(feedback.recommendations) 
    ? feedback.recommendations.join('. ') 
    : feedback.recommendations;
  
  return (
    <div className="mb-4">
      <div className={cn(
        "flex items-center justify-between p-3 rounded-lg",
        colorMap[feedback.color as keyof typeof colorMap]
      )}>
        <div className="flex items-center space-x-2">
          {iconMap[feedback.color as keyof typeof iconMap] || null}
          <h4 className="font-medium text-base">{label}</h4>
        </div>
        <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-700/50">
          {value}
        </span>
      </div>
      
      <div className="mt-3 space-y-3">
        {/* Analysis Section */}
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
          <p className="text-sm text-gray-300 leading-relaxed">
            {feedback.feedback}
          </p>
        </div>

        {/* Recommendations Section */}
        <div className="flex items-start space-x-3">
          <ArrowUpRight className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
          <p className="text-sm text-gray-300 leading-relaxed">
            {recommendationsText}
          </p>
        </div>
      </div>
    </div>
  );
};
