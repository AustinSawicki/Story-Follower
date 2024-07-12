/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: '#f5f5dc', // Custom beige color
        dark_beige: '#e5e5c2',
      oak: {
        DEFAULT: '#cd7f4f', // Primary oak color
        dark: '#a0522d',    // Darker shade for hover states
      }
    },
    height: {
      '128': '28rem',
      '64': '14rem',
      '90': '22rem'
    },
    spacing: {
      '256': '30rem', // 256px
      '512': '50rem', // 512px
    },
    fontFamily: {
      sans: ['Nanum Myeongjo'],
    },
  },
  },
  plugins: [],
}