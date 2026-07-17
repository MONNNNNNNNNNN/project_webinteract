/** @type {import('tailwindcss').Config} */
export default {
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
    },
  },
  plugins: [],
};
