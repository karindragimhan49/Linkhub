/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'grid': 'grid 15s linear infinite',
        'gradient': 'gradient 6s linear infinite',
      },
      keyframes: {
        'grid': {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'gradient': {
          'to': { 'background-position': '200% center' },
        }
      },
    },
  },
  plugins: [],
};

export default config;