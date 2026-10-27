/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Cream — page background + surfaces
        sand: {
          50: '#FFFFFF',
          100: '#F5F7F4', // page background
          200: '#EFF2ED',
          300: '#DFE6DF', // borders / dividers
          400: '#CFD8CF',
        },
        // Forest — headings, primary text, dark surfaces
        espresso: {
          50: '#EAF1EC',
          100: '#D6E3D9',
          300: '#8FA398',
          500: '#64736A', // secondary text
          700: '#3B5949',
          900: '#243B35', // headings / primary text
          950: '#182922',
        },
        // Forest primary buttons (#496B59 + hover #3B5949)
        mocha: {
          50: '#EAF1EC',
          100: '#D6E3D9',
          400: '#5C8071',
          500: '#496B59', // primary buttons
          600: '#3B5949', // hover
          700: '#324A3C',
          800: '#283B30',
        },
        // Sage — selected filters, secondary accents, positive status
        sage: {
          50: '#F0F4F0',
          100: '#E6EEE6',
          200: '#DCE7DD', // selected filter backgrounds / secondary accents
          400: '#C2D2C4',
          500: '#A8BFA9',
          600: '#8AA88B',
          700: '#2F6B45', // positive status
        },
        // Accent highlights
        accent: {
          50: '#FAF2E6',
          100: '#F3E4CC',
          400: '#E2C9A4',
          500: '#D9B98F',
          600: '#C7A274',
        },
        // Warning / over-budget
        amber: {
          400: '#D9A728',
          500: '#A16207', // warning / over-budget
          600: '#854F08',
        },
        // Error
        rose: {
          50: '#FBECEC',
          100: '#F7D7D7',
          400: '#D95050',
          500: '#B91C1C', // error status
          600: '#9B1717',
        },
        // Backwards-compatible aliases (same values as above) so any legacy
        // utility class keeps resolving to the new palette.
        cream: {
          50: '#FFFFFF',
          100: '#F5F7F4',
          200: '#EFF2ED',
          300: '#DFE6DF',
        },
        navy: {
          50: '#EAF1EC',
          100: '#D6E3D9',
          300: '#8FA398',
          500: '#64736A',
          700: '#3B5949',
          900: '#243B35',
          950: '#182922',
        },
        teal: {
          50: '#F0F4F0',
          100: '#E6EEE6',
          200: '#DCE7DD',
          400: '#C2D2C4',
          500: '#496B59',
          600: '#3B5949',
          700: '#324A3C',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(36,59,53,0.05), 0 6px 20px -10px rgba(36,59,53,0.10)',
        'card-hover': '0 4px 12px rgba(36,59,53,0.08), 0 18px 38px -16px rgba(36,59,53,0.20)',
        pop: '0 12px 40px -8px rgba(24,41,34,0.28)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
