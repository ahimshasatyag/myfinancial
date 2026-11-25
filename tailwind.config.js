/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        screen: {
          light: '#F5F5F5',
          dark: '#090909',
        },
        card: {
          light: '#FFFFFF',
          dark: '#151515',
        },
        input: {
          light: '#F7F7F7',
          dark: '#1D1D1D',
        },
        button: {
          light: '#171717',
          dark: '#F5F5F5',
        },
        border: {
          light: '#E5E5E5',
          dark: '#303030',
        },
      },
    },
  },
  plugins: [],
};
