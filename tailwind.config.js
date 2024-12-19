/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // HTML dosyası
    "./src/**/*.{js,jsx,ts,tsx}", // React bileşenleri için
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out'
      }
    },
  },
  plugins: [],
}
