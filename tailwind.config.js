/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — premium glassware, natural bamboo, clean lifestyle
        cream: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F4EEE3',
          300: '#EDE2CF',
        },
        beige: {
          50: '#F8F3EA',
          100: '#EFE7DA',
          200: '#E2D4BD',
          300: '#D2BF9F',
        },
        bamboo: {
          50: '#F8F2E8',
          100: '#EBDDC2',
          200: '#D8BF8B',
          300: '#C8A47A',
          400: '#B8923E',
          500: '#A37F32',
          600: '#8A6828',
        },
        sage: {
          50: '#F2F4EE',
          100: '#DEE5D5',
          200: '#BCC9AC',
          300: '#94A582',
          400: '#7A8F6E',
          500: '#5F7454',
          600: '#4A5C42',
        },
        ink: {
          50: '#F6F5F3',
          100: '#E9E6E0',
          200: '#C8C2B7',
          300: '#9F9789',
          400: '#6F685B',
          500: '#4A4338',
          600: '#332E26',
          700: '#231F1A',
          800: '#1F1B16',
          900: '#14110D',
        },
        accent: {
          gold: '#B8923E',
          goldDark: '#8A6828',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(2.5rem, 5vw + 1rem, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(2rem, 4vw + 0.5rem, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(1.75rem, 3vw + 0.5rem, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'eyebrow': ['0.75rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },
      boxShadow: {
        'soft-sm': '0 1px 2px 0 rgba(31, 27, 22, 0.04), 0 1px 3px 0 rgba(31, 27, 22, 0.06)',
        'soft-md': '0 4px 12px -2px rgba(31, 27, 22, 0.06), 0 2px 6px -2px rgba(31, 27, 22, 0.05)',
        'soft-lg': '0 12px 32px -8px rgba(31, 27, 22, 0.10), 0 4px 12px -4px rgba(31, 27, 22, 0.06)',
        'soft-xl': '0 24px 56px -16px rgba(31, 27, 22, 0.18), 0 8px 24px -8px rgba(31, 27, 22, 0.08)',
        'ring-soft': '0 0 0 1px rgba(31, 27, 22, 0.06)',
        'ring-soft-2': '0 0 0 1px rgba(31, 27, 22, 0.08)',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.12 0 0 0 0 0.10 0 0 0 0 0.08 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
