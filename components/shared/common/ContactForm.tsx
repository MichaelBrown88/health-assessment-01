'use client'

import React, { useState } from 'react'
import { Input } from "@/components/core/input"
import { Label } from "@/components/core/label"
import { Button } from "@/components/core/button"
import { useToast } from "@/components/core/use-toast"
import { Checkbox } from "@/components/core/checkbox"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Alert } from '@/components/core/alert'
import type { AnswerType } from '@/types/assessment'
import type { AssessmentResults } from '@/types/results'

interface ContactFormProps {
  onSubmit: (name: string, email: string) => void
  error?: string | null
  answers: AnswerType
  assessmentResults: AssessmentResults
}

export function ContactForm({
  onSubmit,
  error,
  answers,
  assessmentResults
}: ContactFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !acceptedTerms) {
      toast({
        title: "Error",
        description: "Please fill in all fields and accept the terms.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Store in sessionStorage for immediate access
      sessionStorage.setItem('temporaryResults', JSON.stringify({
        answers,
        assessmentResults,
        timestamp: Date.now()
      }))
      sessionStorage.setItem('contactFormData', JSON.stringify({ name, email }))

      // Call parent's onSubmit handler
      await onSubmit(name, email)

    } catch (error) {
      console.error('Submission error:', error)
      let errorMessage = 'Failed to process your submission. Please try again.'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert 
          variant="destructive"
          title="Error"
          description={error}
        />
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
          className="bg-black/50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
          className="bg-black/50"
        />
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
          className="mt-1"
        />
        <Label htmlFor="terms" className="text-sm leading-tight">
          I agree to share my health data and contact information. Read our{' '}
          <Link href="/landing/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          {' '}to learn how we handle your data in compliance with health data regulations.
        </Label>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Get Your Results'}
      </Button>
    </form>
  )
}
