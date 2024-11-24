'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import { SpaceTheme } from "@/components/layout/SpaceTheme"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ResultsErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Results error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col relative">
          <SpaceTheme />
          <div className="relative z-20 flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="text-gray-400">
                We encountered an error while loading your results.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                variant="secondary"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 