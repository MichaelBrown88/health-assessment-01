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
  History,
} from 'lucide-react'
import { PaywallModal } from '@/components/PaywallModal'
import { AuthModal } from '@/components/AuthModal'

export function UserProfile() {
  const { user, isAdmin, isPremium, logout } = useAuth();
  const router = useRouter();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login' | 'admin'>('login');

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/landing');
      window.location.href = '/landing';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAuthClick = (mode: 'signup' | 'login' | 'admin') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="p-3 rounded-full cursor-pointer hover:bg-white/5 transition-colors">
            <User className="h-6 w-6 text-white" />
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-64 bg-black/90 border border-gray-800" align="end">
          {user && (
            <>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-white">{user.email}</p>
                  <p className="text-xs">
                    {isAdmin ? (
                      <span className="text-red-400">Administrator</span>
                    ) : isPremium ? (
                      <span className="text-yellow-400">Premium Member</span>
                    ) : (
                      <span className="text-blue-400">Member</span>
                    )}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
            </>
          )}

          {user ? (
            isAdmin ? (
              // Admin-specific menu items
              <>
                <DropdownMenuItem 
                  onClick={() => router.push('/admin/dashboard')}
                  className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-800" />
                
                <DropdownMenuItem 
                  onClick={() => router.push('/settings')}
                  className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </>
            ) : (
              // Regular user menu items
              <>
                <DropdownMenuItem 
                  onClick={() => router.push('/questions')}
                  className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>Take Assessment</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => router.push('/history')}
                  className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
                >
                  <History className="mr-2 h-4 w-4" />
                  <span>Assessment History</span>
                </DropdownMenuItem>

                {isPremium && (
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
                  onClick={() => router.push('/settings')}
                  className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </>
            )
          ) : (
            // Not logged in menu items
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
                <span>Unlock Premium Features</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-800" />
              
              <DropdownMenuItem 
                onClick={() => handleAuthClick('login')}
                className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2"
              >
                <LogIn className="mr-2 h-4 w-4" />
                <span>Sign In / Sign Up</span>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => handleAuthClick('admin')}
                className="text-gray-400 hover:text-white hover:bg-purple-500/10 cursor-pointer py-2 text-xs"
              >
                <Shield className="mr-2 h-3 w-3" />
                <span>Admin Access</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modals */}
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
  );
} 