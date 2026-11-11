/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E2A2B', lagoon: { DEFAULT: '#0F5257', dark: '#0A3B3F', soft: '#E3EFEE' },
        sol: { DEFAULT: '#F4B323', dark: '#D99A0B' }, paper: '#F5F7F6', line: '#D5DFDD',
      },
      fontFamily: { display: ['var(--font-display)', 'sans-serif'], sans: ['var(--font-body)', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
