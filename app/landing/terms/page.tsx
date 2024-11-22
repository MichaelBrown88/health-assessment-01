'use client'

import Link from 'next/link'
import { SpaceTheme } from '@/components/layout/SpaceTheme'

export default function TermsPage() {
  return (
    <div className="min-h-screen relative">
      <SpaceTheme />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-white">Terms & Conditions</h1>
        
        <div className="prose prose-invert max-w-none space-y-8">
          <p className="text-gray-300">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-300">
              By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
            <p className="text-gray-300">
              Permission is granted to temporarily access our services for personal, non-commercial use. This license shall automatically terminate if you violate any of these restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Disclaimer</h2>
            <p className="text-gray-300">
              Our services are provided "as is". We make no warranties, expressed or implied, and hereby disclaim all warranties, including without limitation:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Accuracy of health assessments and recommendations</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement of third party rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Limitations</h2>
            <p className="text-gray-300">
              You expressly understand and agree that we shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages resulting from:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Use or inability to use our service</li>
              <li>Unauthorized access to or alteration of your data</li>
              <li>Statements or conduct of any third party on the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Health Disclaimer</h2>
            <p className="text-gray-300">
              Our health assessments and recommendations are for informational purposes only and should not be considered medical advice. Always consult with healthcare professionals for medical decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Governing Law</h2>
            <p className="text-gray-300">
              These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>
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