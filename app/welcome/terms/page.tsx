'use client'

import React from 'react'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8"> {/* Changed to py-8 for consistent spacing */}
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-center text-white">
            Terms & Conditions
          </h1>
          
          <div className="space-y-3 text-white/90 text-sm backdrop-blur-sm rounded-lg p-4">
            <section>
              <h2 className="text-base font-semibold mb-1">1. Acceptance of Terms</h2>
              <p className="text-xs md:text-sm">By using our health assessment application, you agree to be bound by these Terms & Conditions.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-1">2. Health Assessment</h2>
              <p className="text-xs md:text-sm">Our application provides a health assessment based on the information you provide. This assessment is for informational purposes only and should not be considered medical advice.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-1">3. User Information</h2>
              <p className="text-xs md:text-sm">You agree to provide accurate and current information during the assessment process. We collect and use this information in accordance with our Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-1">4. AI-Generated Content</h2>
              <p className="text-xs md:text-sm">Some parts of our health analysis may be generated using AI technology. While we strive for accuracy, this content should not replace professional medical advice.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-1">5. Limitation of Liability</h2>
              <p className="text-xs md:text-sm">We are not liable for any decisions you make based on the information provided by our application. Always consult with a healthcare professional for medical advice.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-1">6. Changes to Terms</h2>
              <p className="text-xs md:text-sm">We reserve the right to modify these terms at any time. Continued use of the application after changes constitutes acceptance of the new terms.</p>
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
