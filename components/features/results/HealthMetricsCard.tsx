'use client'

import { useState } from 'react'
import { Card } from "@/components/core/card"
import { TooltipProvider } from "@/components/core/tooltip"
import { AICoachButton } from '@/components/ai/AICoachButton'
import { Button } from "@/components/core/button"
import { AlertTriangle, X } from "lucide-react"
import { Alert } from "@/components/core/alert"
import type { HealthCalculations } from "@/types/results"

interface HealthMetricsCardProps {
  title: React.ReactNode;
  healthCalculations: HealthCalculations;
  answers: Record<string, any>;
  score?: number;
  warning?: {
    title: string;
    message: string;
    shouldRetake: boolean;
  } | null;
  footer?: string;
  className?: string;
  children: React.ReactNode;
}

export function HealthMetricsCard({ 
  title, 
  healthCalculations, 
  answers, 
  score, 
  warning, 
  footer,
  className,
  children 
}: HealthMetricsCardProps) {
  const [showWarningModal, setShowWarningModal] = useState(!!warning)
  const [showMinimizedWarning, setShowMinimizedWarning] = useState(false)

  const handleWarningToggle = () => {
    if (showMinimizedWarning) {
      setShowWarningModal(true)
      setShowMinimizedWarning(false)
    } else {
      setShowWarningModal(false)
      setShowMinimizedWarning(true)
    }
  }

  return (
    <TooltipProvider>
      <div className="relative h-full">
        <Card className={`bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 ${className}`}>
          <div className="flex justify-between gap-4 mb-4">
            <h3 className="text-xl font-semibold leading-tight">
              {title}
            </h3>
            <div className="flex-shrink-0 mt-1">
              <AICoachButton 
                assessmentData={{
                  answers,
                  healthCalculations,
                  score: score ?? 0
                }}
              />
            </div>
          </div>

          {warning && (
            <div className="mb-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <h4 className="font-medium mb-2 text-amber-400">{warning.title}</h4>
              <p className="text-gray-300">{warning.message}</p>
              {warning.shouldRetake && (
                <p className="text-sm text-gray-400 mt-2">Consider retaking the assessment with adjusted goals.</p>
              )}
            </div>
          )}

          <div className="flex-1">
            {children}
          </div>

          {footer && (
            <p className="text-sm text-gray-400 mt-4">{footer}</p>
          )}

          {/* Minimized warning that stays at bottom */}
          {showMinimizedWarning && warning && (
            <div 
              className="mt-4 flex items-center gap-2 bg-yellow-950/50 border border-yellow-600/50 rounded-lg p-2 cursor-pointer hover:bg-yellow-950/70 transition-colors"
              onClick={handleWarningToggle}
            >
              <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
              <span className="text-sm text-yellow-200 flex-1">Click to review health notice</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = '/questions';
                }}
                className="text-xs whitespace-nowrap"
              >
                Retake Assessment
              </Button>
            </div>
          )}
        </Card>

        {/* Modal warning overlay */}
        {showWarningModal && warning && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
            <div className="bg-black/90 border border-yellow-600/50 rounded-lg p-6 m-4 max-w-md">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-yellow-500">
                  <AlertTriangle className="h-5 w-5" />
                  <h4 className="font-semibold">{warning.title}</h4>
                </div>
                <button 
                  onClick={handleWarningToggle}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-gray-200 mb-6 leading-relaxed">{warning.message}</p>
              <div className="flex justify-center">
                <Button 
                  variant="default"
                  size="sm"
                  onClick={() => window.location.href = '/questions'}
                  className="min-w-[150px]"
                >
                  Retake Assessment
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
} 