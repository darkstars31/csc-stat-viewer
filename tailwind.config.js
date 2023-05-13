/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{jsx,tsx,js,ts}", 
    "./node_modules/tw-elements/dist/js/**/*.js"],
  safelist: [
    { pattern: /grid-cols-./ },
    /* ["animate-[fade-out-right_1s_ease-in-out]", "animate-[fade-out-left_1s_ease-in-out]"] */
  ],
  theme: {
    extend: {
      colors: {
        'midnight1': '#090917',
        'midnight2': '#1d1d31',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],
}
