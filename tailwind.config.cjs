/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
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
    },
  },
  plugins: [],
  darkMode: "class",
  
};
