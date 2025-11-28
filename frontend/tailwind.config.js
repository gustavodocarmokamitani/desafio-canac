const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};