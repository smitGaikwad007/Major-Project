/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF9',
          100: '#FAF8F3',
          DEFAULT: '#F7F4ED',
          200: '#F7F4ED',
          300: '#EFEADF',
          400: '#E5DFD3',
        },
        navy: {
          950: '#0E1722',
          DEFAULT: '#182536',
          900: '#182536',
          800: '#22344B',
          700: '#2E4360',
          600: '#3E577A',
          500: '#547198',
        },
        burgundy: {
          950: '#3D151B',
          900: '#5B222A',
          800: '#6F2E37',
          DEFAULT: '#873B45',
          700: '#873B45',
          600: '#9E4753',
          500: '#B65966',
          100: '#F6EAEB',
          50: '#FAF3F4',
        },
        gold: {
          900: '#6E582E',
          800: '#8A713F',
          DEFAULT: '#B69A65',
          600: '#B69A65',
          500: '#C7AD7D',
          400: '#DBC79E',
          300: '#E8DBC0',
          100: '#F7F3E9',
          50: '#FCFBF6',
        },
        beige: {
          border: '#E5DFD3',
          DEFAULT: '#E5DFD3',
          light: '#F2EFE8',
          dark: '#D5CDBD',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'stamp': '0 4px 14px -2px rgba(24, 37, 54, 0.08), 0 2px 6px -1px rgba(24, 37, 54, 0.04)',
        'stamp-hover': '0 12px 28px -4px rgba(24, 37, 54, 0.14), 0 4px 10px -2px rgba(24, 37, 54, 0.08)',
        'vintage': 'inset 0 0 40px rgba(182, 154, 101, 0.08), 0 4px 20px rgba(24, 37, 54, 0.06)',
      },
      backgroundImage: {
        'postage-pattern': "radial-gradient(#E5DFD3 1.2px, transparent 1.2px)",
      },
    },
  },
  plugins: [],
}
