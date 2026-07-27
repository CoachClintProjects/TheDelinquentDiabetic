/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        'cream-dark': '#F1ECE3',
        ink: '#1A1A1A',
        'ink-soft': '#4A4A4A',
        rule: '#D8D2C7',
        blue: '#0021A5',
        'blue-dark': '#001A7F',
        orange: '#FA4616',
        green: '#22884C',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
