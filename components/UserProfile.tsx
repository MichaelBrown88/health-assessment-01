'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  User,
  LogOut,
  ClipboardCheck,
  LayoutDashboard
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function UserProfile() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/welcome')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <User className="h-5 w-5 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-black/80 backdrop-blur-sm border-gray-800">
        <DropdownMenuLabel className="text-sm text-white">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-white">Signed in as</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-800" />
        
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center text-white hover:text-white cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/questions" className="flex items-center text-white hover:text-white cursor-pointer">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Take Assessment
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 