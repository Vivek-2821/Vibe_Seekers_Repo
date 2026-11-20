/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vibe: {
          dark: '#0a0a0a',
          surface: '#121212',
          card: '#18181b',
          border: '#27272a',
          muted: '#a1a1aa',
          accent: '#ff4d00', // Bold Streetwear Flame/Orange
          accentHover: '#e04300',
          yellow: '#facc15',
          gold: '#d97706'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Impact', 'Oswald', 'Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
