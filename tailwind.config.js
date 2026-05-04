/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Thmanyah Sans', 'Segoe UI', 'Tahoma', 'sans-serif'],
        serif: ['Thmanyah Serif Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}