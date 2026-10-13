/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mvp: {
          red: '#FF1E27',
          darkRed: '#B80D14',
          crimson: '#E50914',
          black: '#0A0A0C',
          dark: '#121318',
          card: '#181A22',
          cardHover: '#20232E',
          silver: '#E2E8F0',
          muted: '#8E95A5',
          gold: '#FFB800',
          neonGreen: '#00E676',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        display: ['Bebas Neue', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 25px -5px rgba(255, 30, 39, 0.5)',
        'glow-sm': '0 0 15px -3px rgba(255, 30, 39, 0.4)',
        'glow-gold': '0 0 25px -5px rgba(255, 184, 0, 0.5)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
