'use client'

import { AdminDashboard } from '@/components/AdminDashboard';
import { SpaceTheme } from '@/components/SpaceTheme';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-gray-400">You don&apos;t have permission to view this page.</p>
        </div>
        <SpaceTheme />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </div>
      <SpaceTheme />
    </div>
  );
}
