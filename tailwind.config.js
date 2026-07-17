/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dme: {
          navy: "#0f1729",
          blue: "#1e3a8a",
          orange: "#f97316",
        },
      },
      fontFamily: {
        sans: ["\"Plus Jakarta Sans\"", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
