'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ResultsErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-gray-400">
              We encountered an error while processing your results.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="deep-space-gradient"
            >
              Try Again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 