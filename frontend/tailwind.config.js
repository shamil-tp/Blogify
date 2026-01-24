/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This matches the fonts you imported in index.css
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      colors: {
        // Optional: Define your blog's specific dark palette
        blogDark: {
          void: '#0f172a',
          slate: '#1e293b',
        }
      },
    },
  },
  plugins: [],
}