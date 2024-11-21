'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from './UserProfile';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  const { isAdmin } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50">
      <div className="flex justify-between items-center px-6 py-4">
        <Link 
          href="/landing" 
          className="hover:opacity-80 transition"
          prefetch={false}
        >
          <Image
            src="/Primary_Logo_White.png"
            alt="Logo"
            width={200}
            height={200}
            priority
            className="w-auto h-24"
          />
        </Link>
        
        <UserProfile />
      </div>
    </header>
  );
}
