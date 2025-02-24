'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Alert } from '@/components/core/alert'
import { handleError } from '@/utils/error-handling'
import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'

interface AuthFormProps {
  mode: 'signup' | 'login' | 'admin';
  onSuccess: () => void;
  isPremiumFlow?: boolean;
}

export function AuthForm({ mode, onSuccess, isPremiumFlow = false }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<{ message: string; severity: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, createAdminAccount } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'admin') {
        await createAdminAccount(email, password)
      } else if (mode === 'signup') {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      onSuccess()
    } catch (err) {
      const errorResponse = handleError(err)
      setError(errorResponse)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert 
          variant={error.severity === 'warning' ? 'warning' : 'destructive'}
          title={mode === 'login' ? 'Sign In Error' : mode === 'signup' ? 'Sign Up Error' : 'Create Admin Account Error'}
          description={error.message}
        />
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="bg-black/50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="bg-black/50"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full deep-space-gradient"
        disabled={loading}
      >
        {loading ? (
          'Loading...'
        ) : (
          mode === 'signup' ? 'Sign Up' : 
          mode === 'admin' ? 'Create Admin Account' :
          'Sign In'
        )}
      </Button>
    </form>
  )
} 