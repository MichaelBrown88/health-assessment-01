export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8">
          {/* ... existing content ... */}
          <div className="text-center mt-4">
            <Link 
              href="/landing" 
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