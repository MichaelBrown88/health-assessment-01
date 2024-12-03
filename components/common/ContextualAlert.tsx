import { ContextualAnalysis } from '@/types/ContextualAnalysis'
import { AlertTriangle, Info } from 'lucide-react'
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
            item.severity === 'warning' 
              ? "bg-yellow-950/30 border-yellow-600/50 shadow-[0_0_15px_rgba(234,179,8,0.15)]" 
              : "bg-blue-950/30 border-blue-600/50",
            className
          )}
        >
          <div className="flex items-start gap-3">
            {item.severity === 'warning' ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            ) : (
              <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            )}
            <div className="space-y-3 flex-1">
              <div>
                <h6 className={cn(
                  "text-lg font-medium",
                  item.severity === 'warning' ? "text-yellow-400" : "text-blue-400"
                )}>
                  {item.title}
                </h6>
                <p className="text-gray-300 mt-1">{item.description}</p>
              </div>
              
              {item.recommendations && item.recommendations.length > 0 && (
                <div className="bg-black/20 rounded-md p-3">
                  <h6 className={cn(
                    "text-sm font-medium mb-2",
                    item.severity === 'warning' ? "text-yellow-500/80" : "text-blue-500/80"
                  )}>
                    Recommendations:
                  </h6>
                  <ul className="space-y-2">
                    {item.recommendations.map((rec, recIndex) => (
                      <li 
                        key={recIndex} 
                        className="text-sm text-gray-400 flex items-start gap-2"
                      >
                        <span className={cn(
                          "inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                          item.severity === 'warning' ? "bg-yellow-500" : "bg-blue-500"
                        )} />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
