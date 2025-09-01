/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Blue
        'primary-dark': '#1d4ed8', // Darker Blue

        // Backgrounds
        'base-100': '#f8fafc', // Light mode background
        'base-200': '#eef2f9', // Light mode surface (e.g. cards)
        'base-dark-100': '#0f172a', // Dark mode background
        'base-dark-200': '#1e293b', // Dark mode surface

        // Text
        'text-main': '#1e293b',
        'text-secondary': '#64748b',
        'text-main-dark': '#e2e8f0',
        'text-secondary-dark': '#94a3b8',

        // For compatibility, will remove later if not used
        'edu-blue': '#4A90E2',
        'edu-blue-light': '#89CFF0',
        'edu-blue-dark': '#357ABD',
        'edu-violet': '#9013FE',
        'edu-violet-light': '#c792ea',
      },
      fontFamily: {
        sans: ['PT Sans', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}