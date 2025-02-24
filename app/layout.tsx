import { Header } from '@/components/layout/Header'
import { AuthProvider } from '@/contexts/AuthContext'
import { SpaceTheme } from '@/components/layout/SpaceTheme'
import './globals.css'
import { Montserrat } from 'next/font/google';
import { Suspense } from 'react';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: 'Health Assessment',
  description: 'Comprehensive health assessment and analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body className="min-h-screen">
        <Suspense fallback={
          <div className="min-h-screen bg-black">
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </div>
        }>
          <SpaceTheme />
          <AuthProvider>
            <div className="relative min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 w-full">
                {children}
              </main>
            </div>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
