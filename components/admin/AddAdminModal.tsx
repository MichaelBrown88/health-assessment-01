'use client'

import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/core/button";
import { X } from 'lucide-react';
import { AdminModalProps } from '@/types/admin';

export function AddAdminModal({ onClose, onSuccess }: AdminModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { createAdminAccount } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminAccount(email, password);
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create admin');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900/90 rounded-lg border border-gray-800 p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Admin</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-black/50 border border-gray-800 rounded focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-black/50 border border-gray-800 rounded focus:outline-none focus:border-purple-500"
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
          >
            Add Admin
          </Button>
        </form>
      </div>
    </div>
  );
}