'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/core/button'
import Link from 'next/link'
import { 
  Activity, 
  Brain, 
  ThumbsUp
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="relative z-20 min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden px-4 py-12">
      <div className="flex flex-col items-center justify-center">
        <div className="text-white text-center max-w-6xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            AI-Powered Health Assessment<br />For Your Wellness Journey
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300">
            Get personalized health insights and actionable recommendations in minutes.<br />
            Backed by science, powered by AI, designed for your success.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg transform hover:scale-105 transition-transform">
              <Activity className="w-12 h-12 mb-4 mx-auto stroke-[#1e4d9c] stroke-2" />
              <h3 className="text-lg font-semibold mb-2">Smart Assessment</h3>
              <p className="text-gray-300 text-sm mb-2">
                Get a comprehensive wellness evaluation in minutes. Our AI analyzes your health data to deliver personalized insights instantly.
              </p>
              <p className="bg-gradient-to-r from-[#0a192f] via-[#243a64] to-[#1e4d9c] text-transparent bg-clip-text font-semibold text-sm opacity-90">
                Quick • Accurate • Personalized
              </p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg transform hover:scale-105 transition-transform">
              <Brain className="w-12 h-12 mb-4 mx-auto stroke-[#1e4d9c] stroke-2" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-gray-300 text-sm mb-2">
                Transform your health data into actionable insights. Our AI provides science-backed recommendations tailored to your goals.
              </p>
              <p className="bg-gradient-to-r from-[#0a192f] via-[#243a64] to-[#1e4d9c] text-transparent bg-clip-text font-semibold text-sm opacity-90">
                Advanced • Intelligent • Actionable
              </p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg transform hover:scale-105 transition-transform">
              <ThumbsUp className="w-12 h-12 mb-4 mx-auto stroke-[#1e4d9c] stroke-2" />
              <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-300 text-sm mb-2">
                Monitor your health improvements over time with comprehensive tracking and visualization tools.
              </p>
              <p className="bg-gradient-to-r from-[#0a192f] via-[#243a64] to-[#1e4d9c] text-transparent bg-clip-text font-semibold text-sm opacity-90">
                Measurable • Visual • Motivating
              </p>
            </div>
          </div>

          <Button 
            onClick={() => router.push('/questions')}
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-[#0a192f] via-[#243a64] to-[#1e4d9c] hover:opacity-90 transform hover:scale-105 transition-all duration-200 rounded-lg shadow-lg mb-6"
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