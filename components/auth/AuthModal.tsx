'use client'

import { useState } from 'react'
import { Button } from '@/components/core/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/core/dialog'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '@/contexts/AuthContext'
import { AuthForm } from '@/components/auth/AuthForm'

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signup' | 'login' | 'admin';
}

export function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [currentMode, setMode] = useState(mode);
  const { signInWithGoogle } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black/90 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center text-white">
            {currentMode === 'signup' ? 'Create Account' : 
             currentMode === 'login' ? 'Welcome Back' : 
             'Admin Access'}
          </DialogTitle>
        </DialogHeader>
        
        {/* Auth providers */}
        {currentMode !== 'admin' && (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center space-x-2 text-white hover:text-white bg-black/50 hover:bg-black/70 border-gray-700"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Continue with Google</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-400">Or continue with email</span>
              </div>
            </div>
          </div>
        )}

        {/* Email/Password form */}
        <AuthForm mode={currentMode} onSuccess={onClose} />
        
        {/* Mode switcher */}
        {currentMode !== 'admin' && (
          <DialogFooter className="sm:justify-center">
            <p className="text-sm text-white">
              {currentMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setMode(currentMode === 'signup' ? 'login' : 'signup')}
                className="ml-1 text-purple-400 hover:text-purple-300 font-medium"
              >
                {currentMode === 'signup' ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
} 