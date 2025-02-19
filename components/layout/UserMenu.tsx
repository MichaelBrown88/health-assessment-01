import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  History,
  LineChart
} from 'lucide-react'
import { getUserAssessments } from '@/lib/db'
import { useAsync } from '@/hooks/useAsync'
import type { Assessment } from '@/types/assessment'
import { useEffect } from 'react'

export function UserMenu() {
  const { user, profile, logout } = useAuth()
  const router = useRouter()
  const { data: assessments = [], execute } = useAsync<Assessment[]>()

  useEffect(() => {
    if (user) {
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

  if (!user || !profile) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <User className="h-4 w-4" />
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
          <LineChart className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        {latestAssessment && (
          <DropdownMenuItem 
            onClick={() => router.push(`/results?id=${latestAssessment.id}`)}
          >
            <History className="mr-2 h-4 w-4" />
            Latest Results
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 