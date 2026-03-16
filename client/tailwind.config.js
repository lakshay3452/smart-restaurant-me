/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#1a1a2e",
        amberAccent: "#f59e0b",
        emeraldAccent: "#10b981",
      },
    },
  },
  plugins: [],
}
