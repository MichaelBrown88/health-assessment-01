export const theme = {
  colors: {
    // Primary brand colors
    primary: {
      DEFAULT: '#1e4d9c',
      light: '#243a64',
      dark: '#0a192f',
    },
    // Background colors
    background: {
      DEFAULT: '#050508',
      light: '#0a0a0f',
      dark: '#030304',
      overlay: 'rgba(0, 0, 0, 0.3)',
    },
    // Text colors
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
      muted: '#64748b',
    },
    // Accent colors for specific states
    accent: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    // Gradient definitions
    gradients: {
      primary: 'from-[#0a192f] via-[#243a64] to-[#1e4d9c]',
      space: 'from-[#050508] via-[#0a0a0f] to-[#0d1117]',
      button: 'from-[#0a192f] via-[#243a64] to-[#1e4d9c]',
      progress: 'from-[#0a192f] via-[#243a64] to-[#1e4d9c]',
    }
  },
  spacing: {
    header: '6rem',
    containerPadding: '1.5rem',
  },
  fonts: {
    sans: 'var(--font-montserrat)',
    mono: 'var(--font-geist-mono)',
  },
  borderRadius: {
    DEFAULT: '0.5rem',
    large: '1rem',
    full: '9999px',
  },
  transitions: {
    DEFAULT: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  }
} 