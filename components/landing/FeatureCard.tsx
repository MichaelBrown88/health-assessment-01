import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tagline: string;
}

export function FeatureCard({ icon: Icon, title, description, tagline }: FeatureCardProps) {
  return (
    <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg transform hover:scale-105 transition-transform">
      <Icon className="w-16 h-16 mb-6 mx-auto stroke-[#1e4d9c] stroke-2" />
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <p className="bg-gradient-to-r from-[#0a192f] via-[#243a64] to-[#1e4d9c] text-transparent bg-clip-text font-semibold text-sm opacity-90">
        {tagline}
      </p>
    </div>
  );
} 