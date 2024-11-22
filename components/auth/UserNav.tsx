'use client'

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  User as UserIcon, 
  LogIn, 
  UserPlus, 
  ArrowRight 
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function UserNav() {
  const { user, signInWithGoogle, continueAsGuest } = useAuth()
  const router = useRouter()

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:text-purple-400">
            <UserIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {user.isAnonymous ? 'Guest User' : 'Registered User'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/dashboard')}>
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/questions')}>
            Take Assessment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:text-purple-400">
          <UserIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signInWithGoogle()}>
          <LogIn className="mr-2 h-4 w-4" />
          <span>Sign In with Google</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => continueAsGuest()}>
          <ArrowRight className="mr-2 h-4 w-4" />
          <span>Continue as Guest</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 