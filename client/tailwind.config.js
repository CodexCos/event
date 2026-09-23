/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#eef6ff',
          100: '#d8e9ff',
          200: '#b9d9ff',
          300: '#89c3ff',
          400: '#52a3ff',
          500: '#257eff',
          600: '#014baa', // Royal Blue
          700: '#003d8f',
          800: '#003378',
          900: '#002a64',
          950: '#00193e',
        },
        accent: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        dark: {
          50:  '#0c0a09', // Heading black
          100: '#1c1917', // Body black
          200: '#292524', // Subtitle dark charcoal
          300: '#44403c',
          400: '#57534e', // Muted text charcoal
          500: '#78716c',
          600: '#a8a29e',
          700: '#e5dfda', // Light border warm gray
          800: '#fbf9f7', // Input background / secondary card
          900: '#ffffff', // Card/Navbar background
          950: '#f8f3f0', // Page background (light cream)
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#fbf9f7',
          card: '#ffffff',
        }
      },
      backgroundImage: {
        'flat-clean': 'none',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0, 0, 0, 0.04), 0 4px 20px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}
