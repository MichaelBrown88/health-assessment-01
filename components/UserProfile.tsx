'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'

export function UserProfile() {
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80">
          <AvatarFallback className="bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {user.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56 bg-black/90 border border-gray-800" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-white">{user.email}</p>
            <p className="text-xs text-gray-400">
              {isAdmin ? 'Administrator' : 'User'}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-gray-800" />
        
        {isAdmin ? (
          <DropdownMenuItem 
            onClick={() => router.push('/admin/dashboard')}
            className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer"
          >
            Admin Dashboard
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem 
              onClick={() => router.push('/dashboard')}
              className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer"
            >
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => router.push('/questions')}
              className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer"
            >
              Take Assessment
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator className="bg-gray-800" />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-gray-200 hover:text-white hover:bg-purple-500/10 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 