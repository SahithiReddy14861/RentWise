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
        // Sand — page background + surfaces (warm off-white)
        sand: {
          50: '#FFFFFF',
          100: '#FAF7F2',
          200: '#F0EBE3',
          300: '#E7E0D7',
          400: '#D8CFC1',
        },
        // Espresso — headings, primary text, dark surfaces
        espresso: {
          50: '#F4EFEA',
          100: '#E7DFD7',
          300: '#9A8D81',
          500: '#786F67', // secondary text
          700: '#5A4A3F',
          900: '#3D3028',
          950: '#2A2018',
        },
        // Mocha — primary buttons
        mocha: {
          50: '#F6EEE8',
          100: '#EAD9CB',
          400: '#B0836A',
          500: '#9A6B4F',
          600: '#855A40',
          700: '#6E4A35',
          800: '#573928',
        },
        // Sage — selected filters, secondary accents, positive status
        sage: {
          50: '#EFF2EC',
          100: '#DDE3D6',
          200: '#C9D3BE',
          400: '#B9C6AF',
          500: '#A8B5A0',
          600: '#8FA085',
          700: '#74836A',
        },
        // Warning / budget overruns
        amber: {
          400: '#FBBF24',
          500: '#D97706',
          600: '#B45309',
        },
        rose: {
          50: '#FBEEEE',
          100: '#F7D7D7',
          400: '#E07A7A',
          500: '#C0392B',
          600: '#A5281B',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FAF7F2',
          200: '#F0EBE3',
          300: '#E7E0D7',
        },
        navy: {
          50: '#F4EFEA',
          100: '#E7DFD7',
          300: '#9A8D81',
          500: '#786F67',
          700: '#5A4A3F',
          900: '#3D3028',
          950: '#2A2018',
        },
        teal: {
          50: '#EFF2EC',
          100: '#DDE3D6',
          200: '#C9D3BE',
          400: '#B9C6AF',
          500: '#9A6B4F',
          600: '#855A40',
          700: '#6E4A35',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(61,48,40,0.05), 0 6px 20px -10px rgba(61,48,40,0.10)',
        'card-hover': '0 4px 12px rgba(61,48,40,0.08), 0 18px 38px -16px rgba(61,48,40,0.20)',
        pop: '0 12px 40px -8px rgba(42,32,24,0.28)',
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
