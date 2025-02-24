import { Card } from "@/components/core/card"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/core/tooltip"
import { InfoIcon, TrendingDown, TrendingUp } from "lucide-react"

interface MetricsCardProps {
  title: string
  value: string | number
  description?: string
  trend?: number
  info?: string
  className?: string
  variant?: 'default' | 'highlight' | 'warning'
}

export function MetricsCard({
  title,
  value,
  description,
  trend,
  info,
  className,
  variant = 'default'
}: MetricsCardProps) {
  const variantStyles = {
    default: 'bg-black/30',
    highlight: 'bg-blue-950/30 border-blue-800/30',
    warning: 'bg-yellow-950/30 border-yellow-800/30'
  }

  return (
    <Card className={cn(
      "backdrop-blur-sm border-gray-800 p-6",
      variantStyles[variant],
      className
    )}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-300">
              {title}
            </h3>
            {info && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{info}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold">{value}</p>
            {trend !== undefined && (
              <div className={cn(
                "flex items-center text-sm",
                trend > 0 ? "text-green-500" : "text-red-500"
              )}>
                {trend > 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
        </div>
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-400">{description}</p>
      )}
    </Card>
  )
} 