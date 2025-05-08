/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {    
      colors: {
        customGray: '#393939',
        customLightGray: '#D9D9D9',
        customBorder: '#989797',
        customActiveColor: '#595959',
        gold: '#D4AF37',
      },
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
