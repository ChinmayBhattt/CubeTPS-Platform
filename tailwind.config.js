/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        dark: 'var(--color-dark)',
        light: 'var(--color-light)',
        'primary/90': 'color-mix(in srgb, var(--color-primary) 90%, transparent)',
      },
    },
  },
  plugins: [],
} 