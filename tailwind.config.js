/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        relidd: {
          red: '#A40029',
          redDark: '#82001F',
          green: '#14833B',
          yellow: '#F2C500',
          yellowDark: '#E0B400',
          purple: '#6B3FA0',
          ink: '#161616',
          cream: '#FDF7EE',
          line: '#E7DFD2',
        }
      }
    },
  },
  plugins: [],
}
