"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center py-2",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="slider-track">
      <SliderPrimitive.Range className="absolute h-full deep-space-gradient" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="slider-thumb" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
