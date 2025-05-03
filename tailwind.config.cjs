/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      keyframes: {
        intro: {
          "0%": {
            transform: "translateY(10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        fade: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "intro-100": "intro 0.8s 80ms backwards",
        "intro-200": "intro 0.5s 200ms backwards",
        "intro-300": "intro 0.8s 300ms backwards",
        "quick-fade": "fade 0.1s 0ms backwards",
      },
    },
    colors: {
      light: "#5F92CC",
      dark: "#202023",
      darkhl: "#525252",
      offw: "rgb(252, 250, 249)",
      teal: "#2c7a7b",
      dteal: "#3cacad",
      g: "#E2E8F0",
      ghl: "#CBD5E0",
      dnav: "rgba(32, 32, 35, 0.5)",
    },
    screens: {
      pc: "700px",
      grid: "750px",
      contain: "1024px",
    },
  },
  plugins: [],
  darkMode: "class",
};
