/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lightbackground: "rgba(var(--background))",
        lightcolor: "rgba(var(--color))",
        lightinputborder: "rgba(var(--input-border))",
        darkbackground: "#323437",
        darkcolor: "rgb(186, 197, 207)",
        darkinputborder: "rgb(186, 197, 207)",
      }
    },
  },
  plugins: [],
}

