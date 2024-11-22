'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  LogOut, 
  User, 
  Settings, 
  Crown, 
  ClipboardList, 
  BarChart, 
  Shield,
  LogIn,
} from 'lucide-react'
import { PaywallModal } from '@/components/premium/PaywallModal'
import { AuthModal } from '@/components/auth/AuthModal'

export function UserProfile() {
  const { user, isAdmin, logout } = useAuth()
  const router = useRouter()
  const [showPaywall, setShowPaywall] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'signup' | 'login' | 'admin'>('login')

  const handleAuthClick = (mode: 'signup' | 'login' | 'admin') => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="p-3 rounded-full cursor-pointer hover:bg-white/5 transition-colors">
            <User className="h-6 w-6 text-white" />
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-64 bg-black/90 border-gray-800" align="end">
          {user ? (
            <>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-white">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    {isAdmin ? 'Administrator' : 'Member'}
                  </p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator className="bg-gray-800" />
              
              <DropdownMenuItem 
                onClick={() => router.push('/questions')}
                className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                <span>Take Assessment</span>
              </DropdownMenuItem>

              {isAdmin ? (
                <DropdownMenuItem 
                  onClick={() => router.push('/admin/dashboard')}
                  className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator className="bg-gray-800" />
              
              <DropdownMenuItem 
                onClick={() => logout()}
                className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem 
                onClick={() => router.push('/questions')}
                className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                <span>Take Assessment</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-800" />
              
              <DropdownMenuItem 
                onClick={() => setShowPaywall(true)}
                className="text-yellow-400 hover:text-yellow-300 hover:bg-purple-500/10 cursor-pointer py-2"
              >
                <Crown className="mr-2 h-4 w-4" />
                <span>Premium Features</span>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => handleAuthClick('login')}
                className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
              >
                <LogIn className="mr-2 h-4 w-4" />
                <span>Sign In / Sign Up</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
      />
      
      <AuthModal 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode={authMode}
      />
    </>
  )
} 