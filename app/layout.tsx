import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { GeistSans } from 'geist/font/sans';
import { TooltipProvider } from "@/components/ui/tooltip"
import { UserProfile } from '@/components/UserProfile'


export const metadata: Metadata = {
  title: "Health Assessment",
  description: "A tool to help you assess your health",
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'icon', url: '/favicon.png', type: 'image/png' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <AuthProvider>
          <TooltipProvider>
            <div className="relative">
              <div className="absolute top-4 right-4 z-50">
                <UserProfile />
              </div>
              {children}
            </div>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
