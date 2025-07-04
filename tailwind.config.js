/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2c3e50',
        secondary: '#e74c3c',
        accent: '#3498db',
      },
      fontFamily: {
        cursive: ['Great Vibes', 'regular'],
        regular: ['Playfair Display', 'serif'],
        playfair: ['Playfair Display', 'serif'],
        body: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 