'use client'

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignIn } from "./SignIn"
import { SignUp } from "./SignUp"
import { Button } from "@/components/ui/button"
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from 'next/navigation'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      onClose()
      router.push('/welcome')
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black/80 backdrop-blur-lg border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Sign in to your account or create a new one
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-2"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignIn onSuccess={onClose} />
            </TabsContent>
            <TabsContent value="signup">
              <SignUp onSuccess={onClose} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
