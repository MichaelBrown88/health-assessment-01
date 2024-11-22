'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Users,
  Activity,
  TrendingUp,
  LucideIcon,
} from 'lucide-react'

interface DashboardCard {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  trend?: number
}

export function AdminDashboard() {
  const [_loading, _setLoading] = useState(false)
  const [_error, _setError] = useState<string | null>(null)

  // Example dashboard cards - replace with real data
  const dashboardCards: DashboardCard[] = [
    {
      title: 'Total Users',
      value: '1,234',
      description: 'Active users this month',
      icon: Users,
      trend: 12.5
    },
    {
      title: 'Assessments',
      value: '856',
      description: 'Completed assessments',
      icon: Activity,
      trend: -2.3
    },
    {
      title: 'Average Score',
      value: '76.5',
      description: 'Health assessment score',
      icon: TrendingUp,
      trend: 5.2
    },
    {
      title: 'Daily Active',
      value: '342',
      description: 'Users today',
      icon: BarChart3,
      trend: 8.1
    }
  ]

  if (_loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (_error) {
    return (
      <Card className="p-6 bg-red-500/10 border-red-500/20">
        <h2 className="text-xl font-bold mb-2 text-red-400">Error Loading Dashboard</h2>
        <p className="text-red-300">{_error}</p>
        <Button 
          onClick={() => window.location.reload()}
          variant="destructive"
          className="mt-4"
        >
          Retry
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Overview of your health assessment platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card) => (
          <Card key={card.title} className="p-6 bg-gray-900/50 border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <card.icon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-400 mt-2">{card.description}</p>
            {card.trend && (
              <p className={`text-sm mt-2 ${card.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {card.trend > 0 ? '↑' : '↓'} {Math.abs(card.trend)}% from last month
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* Add more sections like charts, recent activity, etc. */}
    </div>
  )
}
