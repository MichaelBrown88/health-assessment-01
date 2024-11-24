'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { saveLeadData } from '@/lib/db'

interface ContactFormProps {
  onSubmit: (name: string, email: string) => void
  answers: Record<string, string | number | boolean | string[]>
  assessmentResults: {
    score: number;
    healthCalculations: Record<string, string | number | null>;
    summary: Record<string, string>;
  };
  error?: string | null
}

export const ContactForm: React.FC<ContactFormProps> = ({ 
  onSubmit, 
  answers, 
  assessmentResults,
  error 
}) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
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
      // Use the existing assessmentResults passed as props
      const resultsData = {
        answers,
        assessmentResults,
        timestamp: Date.now()
      }

      // Store in sessionStorage
      sessionStorage.setItem('temporaryResults', JSON.stringify(resultsData))

      // Call parent's onSubmit
      await onSubmit(name, email)

      // Encode results for URL
      const encodedResults = encodeURIComponent(JSON.stringify(resultsData))
      
      // Navigate to results page
      router.push(`/results?results=${encodedResults}`)

    } catch (error) {
      console.error('Submission error:', error)
      toast({
        title: "Error",
        description: "Failed to process your submission. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
          className="bg-white/5 border-white/10 focus:border-white/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
          className="bg-white/5 border-white/10 focus:border-white/20"
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

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button 
        type="submit" 
        className="w-full deep-space-gradient shadow-glow"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "View Your Results"}
      </Button>
    </form>
  )
}
