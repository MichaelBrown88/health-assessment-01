import { Header } from '@/components/layout/Header'
import { AuthProvider } from '@/contexts/AuthContext'
import { SpaceTheme } from '@/components/layout/SpaceTheme'
import './globals.css'
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body>
        <AuthProvider>
          <SpaceTheme />
          <div className="relative min-h-screen">
            <Header />
            <main className="pt-24">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
