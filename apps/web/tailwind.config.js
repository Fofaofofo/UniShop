/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1E293B',
        lagoon: { DEFAULT: '#FF7A00', dark: '#EA580C', soft: '#FFF1E6' },
        sol: { DEFAULT: '#F59E0B', dark: '#D97706' },
        coral: '#FF8C69',
        paper: '#F8FAFC',
        line: '#E2E8F0',
      },
      fontFamily: { display: ['var(--font-display)', 'sans-serif'], sans: ['var(--font-body)', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
