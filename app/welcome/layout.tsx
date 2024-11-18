
export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative">
      <SpaceTheme />
      <div className="relative z-20">
        {children}
      </div>
    </div>
  )
}
