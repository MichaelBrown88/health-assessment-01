'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-4 flex justify-center items-center">
        {pathname !== '/analysis-result' && (
          <Link href="/">
            <Image 
              src="/Primary_Logo_White.png" 
              alt="Logo" 
              width={200} 
              height={67} 
              className="object-contain"
            />
          </Link>
        )}
      </div>
    </header>
  );
}
