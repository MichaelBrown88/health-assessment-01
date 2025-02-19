'use client'

import { useState, useEffect } from 'react'
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
  History,
} from 'lucide-react'
import { PaywallModal } from '@/components/premium/PaywallModal'
import { AuthModal } from '@/components/auth/AuthModal'
import { getUserAssessments } from '@/lib/db'
import { useAsync } from '@/hooks/useAsync'
import type { Assessment } from '@/types/assessment'

export function UserProfile() {
  const { user, isAdmin, isPremium, logout } = useAuth()
  const router = useRouter()
  const [showPaywall, setShowPaywall] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'signup' | 'login' | 'admin'>('login')
  const { data: assessments = [], execute } = useAsync<Assessment[]>()

  useEffect(() => {
    if (user && !user.isAnonymous) {
      execute(() => getUserAssessments(user.uid))
    }
  }, [user, execute])

  const latestAssessment = assessments && assessments.length > 0 
    ? assessments.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB.getTime() - dateA.getTime()
      })[0]
    : null

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
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-400">
                      {isAdmin ? 'Administrator' : user.isAnonymous ? 'Guest User' : 'Member'}
                    </p>
                    {isPremium && (
                      <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        Premium
                      </span>
                    )}
                  </div>
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

              {!user.isAnonymous && latestAssessment && (
                <DropdownMenuItem 
                  onClick={() => router.push(`/results?id=${latestAssessment.id}`)}
                  className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
                >
                  <History className="mr-2 h-4 w-4" />
                  <span>Latest Results</span>
                </DropdownMenuItem>
              )}

              {!user.isAnonymous && (
                <DropdownMenuItem 
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
              )}

              {!isPremium && (
                <DropdownMenuItem 
                  onClick={() => router.push('/premium')}
                  className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 cursor-pointer py-2"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  <span>Upgrade to Premium</span>
                </DropdownMenuItem>
              )}

              {user.isAnonymous ? (
                <>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem 
                    onClick={() => handleAuthClick('signup')}
                    className="text-blue-400 hover:text-blue-300 hover:bg-purple-500/10 cursor-pointer py-2"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Create Account to Save Progress</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem 
                  onClick={() => logout()}
                  className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              )}
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
                onClick={() => router.push('/premium')}
                className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 cursor-pointer py-2"
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