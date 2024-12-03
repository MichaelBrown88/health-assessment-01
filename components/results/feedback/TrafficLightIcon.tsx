import { Circle } from 'lucide-react'
import { cn } from "@/lib/utils"
import type { TrafficLightColor } from '@/types/health'

interface TrafficLightIconProps {
  color: TrafficLightColor;
}

export function TrafficLightIcon({ color }: TrafficLightIconProps) {
  return (
    <Circle 
      className={cn(
        "w-4 h-4 mr-2",
        color === "red" ? "text-red-500 fill-red-500" :
        color === "amber" ? "text-yellow-500 fill-yellow-500" :
        "text-green-500 fill-green-500"
      )}
    />
  )
} 