'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { passwordStrength, checkAttempts, getAuthErrorMessage } from '@/utils/auth'

interface AuthFormProps {
  mode: 'signup' | 'login' | 'admin';
  onSuccess: () => void;
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp, createAdminAccount } = useAuth()
  const [passwordStrengthScore, setPasswordStrengthScore] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Rate limiting check
      const attempts = await checkAttempts(email)
      if (attempts > 5) {
        throw new Error('Too many attempts. Please try again later.')
      }

      if (mode === 'admin') {
        // Handle admin creation
        await createAdminAccount(email, password)
      } else if (mode === 'signup') {
        // Password strength validation
        if (passwordStrengthScore < 3) {
          throw new Error('Password is too weak. Please choose a stronger password.')
        }
        await signUp(email, password)
      } else {
        await signIn(email, password, rememberMe)
      }
      onSuccess()
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordStrengthScore(passwordStrength(newPassword))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
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
          onChange={handlePasswordChange}
          required
          disabled={isLoading}
          className="bg-black/50"
        />
        {mode === 'signup' && (
          <div className="mt-1">
            <div className="h-1 w-full bg-gray-700 rounded-full">
              <div 
                className="h-1 bg-gradient-to-r from-red-500 to-green-500 rounded-full transition-all"
                style={{ width: `${passwordStrengthScore * 25}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Password strength: {['Weak', 'Fair', 'Good', 'Strong'][Math.min(passwordStrengthScore - 1, 3)]}
            </p>
          </div>
        )}
      </div>

      {mode !== 'admin' && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-gray-700 bg-black/50"
          />
          <Label htmlFor="remember" className="text-sm text-gray-400">
            Remember me
          </Label>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        type="submit" 
        className="w-full deep-space-gradient"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === 'signup' ? 'Creating Account...' : 
             mode === 'admin' ? 'Creating Admin Account...' :
             'Signing In...'}
          </>
        ) : (
          mode === 'signup' ? 'Sign Up' : 
          mode === 'admin' ? 'Create Admin Account' :
          'Sign In'
        )}
      </Button>
    </form>
  )
} 