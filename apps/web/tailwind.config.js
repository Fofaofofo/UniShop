/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1E293B',
        lagoon: { DEFAULT: '#FF7A00', dark: '#EA580C', soft: '#FFF1E6' },
        sol: { DEFAULT: '#F59E0B', dark: '#D97706', light: '#FDE68A' },
        coral: '#FF8C69',
        paper: '#F8FAFC',
        line: '#E2E8F0',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Figtree"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        nautilus: ['"Nautilus Pompilius"', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
