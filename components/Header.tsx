'use client';

import React from 'react';
import { UserProfile } from './UserProfile';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname();
  
  if (pathname === '/' || pathname === '/welcome' || pathname === '/health-assessment') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          {/* Logo removed from here */}
        </Link>
        <UserProfile />
      </div>
    </header>
  );
}
