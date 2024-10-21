/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Allows for dark mode with the class
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "hsl(var(--background-color))",
        text: "hsl(var(--text-color))",
        card: {
          DEFAULT: "hsl(var(--card-background))",
        },
        spaceBlue: "#0a192f",
      },
      keyframes: {
        "fade-in-up": {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
