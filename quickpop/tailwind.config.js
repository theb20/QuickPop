/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'animate-fade-in',
    'animate-slide-up',
    'animate-text-reveal',
  ],
  theme: {
    extend: {
      keyframes: {
        'text-reveal': {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px) scale(0.98)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0) scale(1)'
          },
        },
        'border-glow': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        'text-reveal': 'text-reveal 0.9s ease-out forwards',
        'text-reveal-delay': 'text-reveal 0.9s ease-out 0.4s forwards',
        'fade-in': 'fade-in 1.2s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'border-glow': 'border-glow 6s linear infinite',
      },
    }
  },
  plugins: [],
}
