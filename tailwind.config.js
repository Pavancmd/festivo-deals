/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { ivory: '#FBF7EF', ink: '#1B1A2E', saffron: '#F59E0B' },
    fontFamily: { display: ['Fraunces', 'Georgia', 'serif'], sans: ['Inter', 'system-ui', 'sans-serif'] }
  } },
  plugins: []
}
