/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090a0f',
        foreground: '#f8fafc',
        card: {
          DEFAULT: '#12141d',
          foreground: '#f8fafc'
        },
        primary: {
          DEFAULT: '#6366f1',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#1e2230',
          foreground: '#cbd5e1'
        },
        accent: {
          DEFAULT: '#a855f7',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b'
        },
        muted: {
          DEFAULT: '#1e293b',
          foreground: '#94a3b8'
        },
        border: '#1e2638'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      }
    },
  },
  plugins: [],
}
