import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

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
    <html lang="en" className={geistSans.variable}>
      <body className="min-h-screen bg-black text-white overflow-y-auto">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
