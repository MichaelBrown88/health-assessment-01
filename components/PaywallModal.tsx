import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { subscriptionTiers } from "@/types/subscription"
import { AuthModal } from "./auth"
import { useState } from "react"

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const isPremiumEnabled = process.env.NEXT_PUBLIC_ENABLE_PREMIUM === 'true'

  const handleSubscribe = (tierName: string) => {
    if (!isPremiumEnabled || tierName === 'Free') {
      setShowAuthModal(true)
    } else {
      // TODO: Implement payment gateway integration
      console.log('Payment flow will be implemented here')
    }
  }

  return (
    <>
      <Dialog open={isOpen && !showAuthModal} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-black/90 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Unlock Premium Features
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              Choose a plan to access all features and track your progress
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {subscriptionTiers.map((tier) => (
              <div
                key={tier.name}
                className={`p-6 rounded-lg border ${
                  tier.name === 'Premium' 
                    ? 'border-blue-500 bg-black/60' 
                    : 'border-gray-800'
                } space-y-4`}
              >
                <h3 className="text-xl font-semibold">{tier.name}</h3>
                <p className="text-2xl font-bold">
                  ${tier.price.toFixed(2)}<span className="text-sm">/month</span>
                </p>
                <ul className="space-y-2">
                  {Object.entries(tier.features).map(([feature, enabled]) => (
                    <li
                      key={feature}
                      className={`flex items-center ${
                        enabled ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {enabled ? "✓" : "×"} {feature.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={tier.name === "Premium" ? "primary" : "outline"}
                  onClick={() => handleSubscribe(tier.name)}
                >
                  {tier.name === "Free" ? "Continue with Free" : "Get Premium"}
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false)
          onClose()
        }} 
      />
    </>
  )
}
