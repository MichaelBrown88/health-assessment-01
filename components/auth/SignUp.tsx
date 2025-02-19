'use client'

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from 'next/navigation'
import { convertLeadToUser } from '@/lib/db';
import { saveAssessmentResult } from '@/lib/db';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SignUpProps {
  onSuccess: () => void
}

export function SignUp({ onSuccess }: SignUpProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Starting signup process...');
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // Get stored contact info and results
      const contactData = sessionStorage.getItem('contactFormData')
      const resultsData = sessionStorage.getItem('temporaryResults')
      
      console.log('Retrieved session data:', {
        hasContactData: !!contactData,
        hasResultsData: !!resultsData
      });

      // Create the user account
      console.log('Creating user account...');
      const userCredential = await signUp(email, password)
      
      if (userCredential.user) {
        console.log('User account created successfully:', userCredential.user.uid);

        // Initialize user document with default values
        const userRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userRef, {
          email: email.toLowerCase(), // Store email in lowercase for consistent matching
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp(),
          isAdmin: false,
          isPremium: false,
          stats: {
            assessmentsCompleted: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastAssessmentDate: null
          },
          preferences: {
            theme: 'system',
            emailUpdates: true,
            notifications: true
          }
        });
        console.log('User document initialized');

        // If we have contact data, convert lead
        if (contactData) {
          const { email: storedEmail } = JSON.parse(contactData)
          console.log('Converting lead data...', { storedEmail });
          await convertLeadToUser(storedEmail.toLowerCase(), userCredential.user.uid)
          console.log('Lead conversion completed');
        }
        // If we have results data but no contact data, save it directly
        else if (resultsData) {
          console.log('Saving direct assessment data...');
          const { answers, assessmentResults } = JSON.parse(resultsData)
          await saveAssessmentResult(userCredential.user.uid, {
            answers,
            healthCalculations: assessmentResults.healthCalculations,
            score: assessmentResults.score,
            summary: assessmentResults.summary,
            timestamp: Date.now()
          })
          console.log('Direct assessment save completed');
        }
        
        // Clear session storage
        sessionStorage.removeItem('contactFormData')
        sessionStorage.removeItem('temporaryResults')
        console.log('Session storage cleared');
        
        onSuccess()
        router.push('/welcome')
      }
    } catch (error) {
      console.error('Signup process failed:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined
      });
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to create an account. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  )
}
