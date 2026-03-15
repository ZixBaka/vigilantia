/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: '#2563EB',
        success: '#22C55E',
        warning: '#EAB308',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
};
