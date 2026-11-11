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
        background: {
          DEFAULT: '#080A0F',
          secondary: '#0F1219',
          tertiary: '#151923',
        },
        surface: {
          DEFAULT: '#11141D',
          hover: '#181C28',
          border: 'rgba(255, 255, 255, 0.07)',
          'border-highlight': 'rgba(0, 242, 254, 0.3)',
        },
        cyan: {
          glow: '#00F2FE',
          accent: '#00C0FF',
          dark: '#0077B6',
        },
        status: {
          online: '#10B981',
          busy: '#F59E0B',
          offline: '#64748B',
          error: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.35)',
        'glow-cyan-sm': '0 0 15px -3px rgba(0, 242, 254, 0.25)',
        'surface-lg': '0 12px 35px -8px rgba(0, 0, 0, 0.65)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
