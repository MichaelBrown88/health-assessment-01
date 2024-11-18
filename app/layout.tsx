import { AuthProvider } from '@/contexts/AuthContext'
import { RootCheck } from './RootCheck'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white">
        <AuthProvider>
          <RootCheck>
            {children}
          </RootCheck>
        </AuthProvider>
      </body>
    </html>
  )
}
