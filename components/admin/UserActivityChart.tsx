import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
  } from 'recharts';
  import { Card } from '@/components/core/card';
  import type { Analytics } from '@/types/analytics';
  
  interface ChartData {
    date: string;
    users: number;
  }
  
  interface UserActivityChartProps {
    data?: Analytics['users']['activity'];
    timeRange: 'week' | 'month' | 'year';
  }
  
  export function UserActivityChart({ data, timeRange }: UserActivityChartProps) {
    if (!data) return null;
  
    const timeRangeMap = {
      week: 'weekly',
      month: 'monthly',
      year: 'yearly'
    } as const;
  
    const chartData: ChartData[] = data.dates.map((date: string, index: number) => ({
      date,
      users: data[timeRangeMap[timeRange]][index] || 0
    }));
  
    return (
      <Card className="p-6 bg-black/30 backdrop-blur-sm border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">User Activity</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111827',
                  border: '1px solid #374151'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#8B5CF6" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  }