'use client'

import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';

export function AdminSetup() {
  console.log('AdminSetup: Starting render');
  const { createAdminAccount } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('AdminSetup mounted, createAdminAccount available:', !!createAdminAccount);
  }, [createAdminAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with email:', email);
    
    try {
      setError('');
      if (!email || !password) {
        setError('Please provide both email and password');
        return;
      }
      
      console.log('Creating admin account...');
      await createAdminAccount(email, password);
      console.log('Admin account created successfully');
      
      // Add a small delay to ensure Firebase auth state is updated
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        router.push('/admin/dashboard');
      }, 1000);
      
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      if (err instanceof Error && err.message.includes('already in use')) {
        setError('This email is already registered. Please use a different email.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create admin account');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900/50 rounded-lg border border-gray-800">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create Admin Account</h1>
          <p className="text-gray-400">Set up your initial administrator account</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-black/50 border border-gray-800 rounded focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-black/50 border border-gray-800 rounded focus:outline-none focus:border-purple-500"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded text-white font-medium transition-colors"
          >
            Create Admin Account
          </button>
        </form>
      </div>
    </div>
  );
}
