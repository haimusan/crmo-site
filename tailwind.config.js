/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1b1b1b',
      },
      boxShadow: {
        tile: '0 16px 40px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
