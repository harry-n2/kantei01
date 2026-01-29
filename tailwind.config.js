/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A', // Slate-900 (Deep Navy)
        surface: '#1E293B', // Slate-800
        gold: '#F59E0B',
        primary: {
          DEFAULT: '#F59E0B', // Amber-500 (Gold)
          glow: '#FCD34D', // Amber-300
          foreground: '#0F172A',
        },
        secondary: {
          DEFAULT: '#6366F1', // Indigo-500
          foreground: '#FFFFFF',
        },
        text: {
          main: '#F8FAFC', // Slate-50
          muted: '#94A3B8', // Slate-400
        }
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
        serif: ['"Noto Serif JP"', 'serif'],
      },
      backgroundImage: {
        'mystic-gradient': 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #B45309 100%)',
      },
      keyframes: {
        scan: {
          '0%, 100%': { top: '0%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '50%': { top: '100%' },
        },
        shimmer: {
          '100%': { transform: 'translateX(200%) skewX(-12deg)' },
        },
        progress: {
          '0%': { width: '0%', marginLeft: '0%' },
          '50%': { width: '100%', marginLeft: '0%' },
          '100%': { width: '0%', marginLeft: '100%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        scan: 'scan 4s ease-in-out infinite',
        shimmer: 'shimmer 3s infinite',
        progress: 'progress 2s ease-in-out infinite',
        fadeIn: 'fadeIn 1s ease-out forwards',
        slideUp: 'slideUp 0.8s ease-out forwards',
      }
    },
  },
  plugins: [],
}
