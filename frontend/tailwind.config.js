/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'inner-dark': 'inset 0 2px 4px rgba(0, 0, 0, 0.2)', // Customize the shadow values as needed
      },
      colors: {
        theme: {
          DEFAULT: 'var(--theme-default)',
          dark: 'var(--theme-dark)',
        }, 
        button: {
          DEFAULT: 'var(--button-default)', 
          dark: 'var(--button-dark)',    
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