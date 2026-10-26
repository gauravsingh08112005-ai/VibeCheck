/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B0B10',
        surface: '#15151D',
        'surface-2': '#1E1E29',
        border: '#2A2A38',
        'text-main': '#F5F5FA',
        'text-muted': '#A1A1B5',
        lime: '#C6FF3D',
        violet: '#8B5CF6',
        pink: '#FF4D8D',
        cyan: '#22D3EE',
        amber: '#FFB020',
        success: '#4ADE80',
      },
      fontFamily: {
        heading: ['Bricolage Grotesque', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
