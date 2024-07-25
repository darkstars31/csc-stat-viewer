/** @type {import('tailwindcss').Config} */

import { fontFamily as _fontFamily } from "tailwindcss/defaultTheme";

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{jsx,tsx,js,ts}"
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
        midnight1: "#090917",
        midnight2: "#1d1d31",
      },
      fontFamily: {
        sans: ["Inter var", ..._fontFamily.sans],
      },
      animation: {
        "fade-in": "fadeIn 1s ease-in",
        wiggle: "wiggle 200ms ease-in-out",
        shine: "shine 1s",
      },
      keyframes: theme => ({
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        shine: {
          "100%": { left: "125%" },
        },
      }),
    }
  },
  plugins: [require("@tailwindcss/forms")],
}

