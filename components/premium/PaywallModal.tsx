'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { PRICING_FEATURES } from "@/utils/pricing"

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-white/10">
        <DialogHeader>
          <DialogTitle>Unlock Premium Features</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-lg">
            Get access to our AI Health Coach and unlock premium features:
          </p>
          <ul className="list-disc pl-4 space-y-2">
            {PRICING_FEATURES.map((feature: string, index: number) => (
              <li key={index} className="text-gray-300">
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="secondary" onClick={onClose}>
              Maybe Later
            </Button>
            <Button 
              variant="primary"
              onClick={() => router.push('/premium')}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
