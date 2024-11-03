'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { SpaceTheme } from "@/components/SpaceTheme"
// import { PageLayout } from '@/components/PageLayout'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import Link from 'next/link'
import { UserProfile } from '@/components/UserProfile'

export default function WelcomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, signIn, signInWithGoogle, user } = useAuth();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      setIsOpen(false);
      router.push('/questions');
    } catch (error) {
      console.error('Authentication error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to authenticate. Please check your credentials.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setIsOpen(false);
      router.push('/questions');
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to authenticate with Google.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Add UserProfile in absolute position */}
      <div className="absolute top-4 right-4 z-30">
        <UserProfile />
      </div>

      <SpaceTheme />
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center">
        <h1 
          className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight animate-fade-in-up text-center"
          style={{ textShadow: `2px 2px 4px rgba(0,0,0,0.5)` }}
        >
          Unlock Your Health Potential
        </h1>
        <p className="text-base md:text-lg mb-12 text-white max-w-3xl mx-auto opacity-90 shadow-sm text-center">
          Discover your personalized path to peak wellness with our cutting-edge health assessment.
        </p>
        <div className="flex justify-center space-x-4">
          {user ? (
            <div className="flex space-x-4">
              <Button 
                onClick={() => router.push('/questions')} 
                size="lg" 
                variant="primary"
                className="welcome-button"
              >
                Take New Assessment
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')} 
                size="lg" 
                variant="dark"
                className="welcome-button"
              >
                View Dashboard
              </Button>
            </div>
          ) : (
            <>
              <Button 
                onClick={() => router.push('/questions')} 
                size="lg" 
                variant="primary"
                className="welcome-button"
              >
                Continue as Guest
              </Button>
              <Button 
                onClick={() => setIsOpen(true)} 
                size="lg" 
                variant="dark"
                className="welcome-button"
              >
                Login / Sign Up
              </Button>
            </>
          )}
        </div>

        <div className="mt-8 text-sm text-gray-400">
          <p>
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-white">
              Terms & Conditions
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px] bg-black/90 border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/50 border-gray-700"
              />
              
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/50 border-gray-700"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full">
                {isSignUp ? 'Sign Up' : 'Login'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/90 px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
              >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Continue with Google
              </Button>

              <p className="text-center text-sm text-gray-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  {isSignUp ? 'Login' : 'Sign Up'}
                </button>
              </p>
            </form>

            <DialogFooter className="text-xs text-gray-500 mt-4">
              {isSignUp && (
                <p>
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-gray-400">
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link href="/privacy" className="underline hover:text-gray-400">
                    Privacy Policy
                  </Link>
                </p>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
