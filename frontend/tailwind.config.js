/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGreen: '#1B4348', 
        greeny: '#76FC8F',
        lightGreen: '#D7FFC2',
        whity: '#FFFEF0',
        beige: '#FDD6BA',
        gray: '#D7FFC2'
      },
    },
  },
  plugins: [],
}

