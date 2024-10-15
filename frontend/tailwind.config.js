const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGreen: '#1B4348', 
        greeny: '#76FC8F',
        lightGreen: '#D7FFC2',
        whity: '#FFFEF0',
        beige: '#FDD6BA',
        grayish: '#757575'
      },
    },
  },
  plugins: [nextui()]
}

