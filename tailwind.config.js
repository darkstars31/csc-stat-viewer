/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{jsx,tsx,js,ts}", 
    ],
  safelist: [
    { pattern: /grid-cols-./ },
    { pattern: /text-./ },
    { pattern: /border-./ },
    { pattern: /hue-rotate-./ },
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
      animation: {
        'fade-in': 'fadeIn 1s ease-in',
        wiggle: "wiggle 200ms ease-in-out"
      },
      keyframes: theme => ({
        'fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" }
        }
    }),
  },
},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
