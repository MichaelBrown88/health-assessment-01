'use client'

import React from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          backgroundColor: '#fee',
          border: '2px solid #f00',
          borderRadius: '4px',
          color: '#000'
        }}>
          <h2>Something went wrong!</h2>
          <pre>{this.state.error?.message}</pre>
        </div>
      )
    }

    return this.props.children
  }
}