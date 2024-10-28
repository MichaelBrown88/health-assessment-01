import { ContextualAnalysis } from '@/types/ContextualAnalysis'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContextualAlertProps {
  analysis: ContextualAnalysis[];
  className?: string;
}

export function ContextualAlert({ analysis, className }: ContextualAlertProps) {
  if (!analysis || analysis.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {analysis.map((item, index) => (
        <div 
          key={index}
          className={cn(
            "border rounded-lg p-4",
            item.severity === 'warning' && "bg-yellow-950/50 border-yellow-600/50",
            item.severity === 'alert' && "bg-red-950/50 border-red-600/50",
            item.severity === 'info' && "bg-blue-950/50 border-blue-600/50",
            className
          )}
        >
          <div className="flex items-start gap-3">
            {item.severity === 'warning' && (
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <h6 className={cn(
                "text-lg font-medium mb-2",
                item.severity === 'warning' && "text-yellow-400",
                item.severity === 'alert' && "text-red-400",
                item.severity === 'info' && "text-blue-400"
              )}>
                {item.title}
              </h6>
              <p className="text-gray-200 mb-3">{item.feedback}</p>
              {item.recommendations && item.recommendations.length > 0 && (
                <ul className="list-disc list-inside space-y-2">
                  {item.recommendations.map((rec, recIndex) => (
                    <li key={recIndex} className="text-gray-300">
                      {rec}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
