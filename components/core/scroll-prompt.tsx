import { ChevronDown } from "lucide-react"

interface ScrollPromptProps {
  text?: string
  className?: string
}

export function ScrollPrompt({ text = "Scroll for more", className = "" }: ScrollPromptProps) {
  return (
    <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce ${className}`}>
      <ChevronDown className="w-8 h-8 opacity-50" />
      <p className="text-sm opacity-50">{text}</p>
    </div>
  )
}