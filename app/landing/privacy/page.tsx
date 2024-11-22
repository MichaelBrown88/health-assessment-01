'use client'

import Link from 'next/link'
import { SpaceTheme } from '@/components/layout/SpaceTheme'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen relative">
      <SpaceTheme />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-white">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-8">
          <p className="text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-gray-300">
              We collect information you provide directly to us, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Personal information (name, email address)</li>
              <li>Health and wellness data</li>
              <li>Assessment responses and results</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300">
              We use the collected information for:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Providing personalized health assessments and recommendations</li>
              <li>Improving our services and user experience</li>
              <li>Communicating with you about our services</li>
              <li>Research and analytics (in anonymized form)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Third-Party Services</h2>
            <p className="text-gray-300">
              We may use third-party services that collect, monitor and analyze this information to improve our service's functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
            <p className="text-gray-300">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
            </ul>
          </section>
        </div>

        <div className="text-center mt-8">
          <Link 
            href="/landing" 
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 