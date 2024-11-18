'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

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
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          answers,
          assessmentResults
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save contact information');
      }

      onSubmit(name, email);
      
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      });
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
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button 
        type="submit" 
        variant="deepSpaceBorder" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Submit"}
      </Button>
    </form>
  )
}
