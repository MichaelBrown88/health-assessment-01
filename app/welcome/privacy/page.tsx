'use client'

import React from 'react'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-center text-white">
            Privacy Policy
          </h1>
          
          <div className="space-y-3 text-white/90 text-sm backdrop-blur-sm rounded-lg p-4">
            <section>
              <h2 className="text-base font-semibold mb-1">1. Information We Collect</h2>
              <p className="text-xs md:text-sm">We collect personal information you provide during the health assessment, including age, gender, weight, height, activity level, diet habits, sleep patterns, and mental health information.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-1">2. How We Use Your Information</h2>
              <p className="text-xs md:text-sm">We use your information to generate personalized health assessments, calculate health metrics (such as BMI and recommended calorie intake), and provide tailored advice.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-1">3. Data Security</h2>
              <p className="text-xs md:text-sm">We implement security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-1">4. AI Processing</h2>
              <p className="text-xs md:text-sm">Some of your data may be processed by AI systems to generate health summaries. This processing is done securely and in accordance with data protection regulations.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-1">5. Data Retention</h2>
              <p className="text-xs md:text-sm">We retain your personal information only for as long as necessary to provide you with our services and as described in this policy.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-1">6. Your Rights</h2>
              <p className="text-xs md:text-sm">You have the right to access, correct, or delete your personal information. Contact us if you wish to exercise these rights.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-1">7. Changes to This Policy</h2>
              <p className="text-xs md:text-sm">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
            </section>
          </div>

          <div className="text-center mt-4">
            <Link 
              href="/welcome" 
              className="text-white/70 hover:text-white transition-colors text-xs"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
