'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Activity, 
  Brain, 
  ThumbsUp
} from 'lucide-react'
import { UserNav } from '@/components/UserNav'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="relative z-20 flex flex-col min-h-screen px-4">
      <div className="flex justify-between items-center w-full py-4 px-6">
        <Image
          src="/Primary_Logo_White.png"
          alt="Logo"
          width={400}
          height={400}
          priority
          className="w-auto h-28"
        />
        <UserNav />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center -mt-20">
        <div className="text-white text-center max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Transform Your Health Journey<br />Today
          </h1>
          <p className="text-xl mb-16 text-gray-300">
            Get a personalized health assessment powered by cutting-edge AI technology. Discover<br />
            insights that can change your life.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg transform hover:scale-105 transition-transform">
              <Activity className="w-16 h-16 mb-6 mx-auto text-purple-400" />
              <h3 className="text-xl font-semibold mb-3">Smart Assessment</h3>
              <p className="text-gray-300 mb-4">
                Complete our comprehensive health evaluation in minutes. Get instant insights into your wellness profile using advanced analytics.
              </p>
              <p className="text-purple-400 text-sm">
                Quick • Accurate • Personalized
              </p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg transform hover:scale-105 transition-transform">
              <Brain className="w-16 h-16 mb-6 mx-auto text-purple-400" />
              <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
              <p className="text-gray-300 mb-4">
                Unlock premium AI analysis that provides deep insights into your health patterns. Get personalized recommendations backed by science.
              </p>
              <p className="text-purple-400 text-sm">
                Advanced • Intelligent • Actionable
              </p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg transform hover:scale-105 transition-transform">
              <ThumbsUp className="w-16 h-16 mb-6 mx-auto text-purple-400" />
              <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-gray-300 mb-4">
                Monitor your health improvements over time with comprehensive tracking and visualization tools.
              </p>
              <p className="text-purple-400 text-sm">
                Measurable • Visual • Motivating
              </p>
            </div>
          </div>

          <Button 
            onClick={() => router.push('/questions')}
            className="px-12 py-6 text-lg font-semibold bg-[#1a2b4b] hover:bg-[#243a64] transform hover:scale-105 transition-all duration-200 rounded-lg shadow-lg mb-12"
          >
            Start Your Health Journey
          </Button>

          <div className="text-sm text-gray-400 space-x-4">
            <Link 
              href="/landing/terms" 
              className="hover:text-purple-400 transition-colors"
            >
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link 
              href="/landing/privacy" 
              className="hover:text-purple-400 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 