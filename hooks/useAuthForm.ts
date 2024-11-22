import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { passwordStrength, checkAttempts, getAuthErrorMessage } from '@/utils/auth'

interface UseAuthFormProps {
  mode: 'signup' | 'login' | 'admin';
  onSuccess: () => void;
}

export function useAuthForm({ mode, onSuccess }: UseAuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrengthScore, setPasswordStrengthScore] = useState(0)
  const { signIn, signUp, createAdminAccount } = useAuth()

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordStrengthScore(passwordStrength(newPassword))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const attempts = await checkAttempts(email)
      if (attempts > 5) {
        throw new Error('Too many attempts. Please try again later.')
      }

      if (mode === 'admin') {
        await createAdminAccount(email, password)
      } else if (mode === 'signup') {
        if (passwordStrengthScore < 3) {
          throw new Error('Password is too weak.')
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

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    error,
    isLoading,
    passwordStrengthScore,
    handlePasswordChange,
    handleSubmit
  }
} 