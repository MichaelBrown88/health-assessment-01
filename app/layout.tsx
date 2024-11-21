import { Header } from '@/components/Header'
import { AuthProvider } from '@/contexts/AuthContext'
import { SpaceTheme } from '@/components/SpaceTheme'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="overflow-hidden">
        <AuthProvider>
          <div className="min-h-screen bg-black">
            <SpaceTheme />
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
