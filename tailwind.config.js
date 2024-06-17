/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bvdk-blue': '#00497f',
        'bvdk-red': '#be0007',
        'magenta': '#ff00ff'
      },
      spacing: {
        '128': '32rem',
      }
    }
  },
  plugins: []
}
