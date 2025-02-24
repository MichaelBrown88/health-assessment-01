'use client'

import Link from 'next/link'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/core/dropdown-menu'
import {
  LogOut,
  ClipboardCheck,
  LayoutDashboard
} from 'lucide-react'

interface UserMenuProps {
  email: string;
  onLogout: () => void;
  isAdmin?: boolean;
}

export function UserMenu({ email, onLogout, isAdmin }: UserMenuProps) {
  return (
    <DropdownMenuContent align="end" className="w-56 bg-black/80 backdrop-blur-sm border-gray-800">
      <DropdownMenuLabel className="text-sm text-white">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium text-white">Signed in as</p>
          <p className="text-xs text-gray-400 truncate">{email}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-gray-800" />
      
      {isAdmin ? (
        <DropdownMenuItem asChild>
          <Link href="/admin/dashboard" className="flex items-center text-white hover:text-white cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Admin Dashboard
          </Link>
        </DropdownMenuItem>
      ) : (
        <>
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
        </>
      )}
      
      <DropdownMenuSeparator className="bg-gray-800" />
      
      <DropdownMenuItem 
        onClick={onLogout}
        className="text-red-400 hover:text-red-300 cursor-pointer"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
} 