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
import { AuthForm } from "./auth"
import { PremiumFeatures } from "./PremiumFeatures"

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const [showAuth, setShowAuth] = useState(false);

  const handleUnlock = () => {
    setShowAuth(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black/90 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center text-white">
            {!showAuth ? 'Premium Features' : 'Create Premium Account'}
          </DialogTitle>
        </DialogHeader>
        
        {!showAuth ? (
          <PremiumFeatures onUnlock={handleUnlock} />
        ) : (
          <AuthForm mode="signup" isPremiumFlow={true} onSuccess={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
