import { theme } from './lib/theme'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: theme.colors,
      spacing: theme.spacing,
      fontFamily: theme.fonts,
      borderRadius: theme.borderRadius,
      transitionProperty: theme.transitions,
    },
  },
  plugins: [],
}
