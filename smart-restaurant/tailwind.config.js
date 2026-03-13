/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#121212",
        amberAccent: "#FFBF00",
        emeraldAccent: "#10B981",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      backdropBlur: {
        glass: "20px",
      }
    },
  },
  plugins: [],
};
