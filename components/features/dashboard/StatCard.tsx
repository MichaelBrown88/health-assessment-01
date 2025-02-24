import { StatCardProps } from '@/types/admin'

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 hover:border-purple-500/50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-400 font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <Icon className="w-6 h-6 text-purple-500" />
      </div>
      {trend && (
        <div className="mt-2 text-sm text-gray-400">
          {trend}
        </div>
      )}
    </div>
  );
}