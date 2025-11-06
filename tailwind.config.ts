import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        luxe: {
          ebony: '#0f1419',
          charcoal: '#1c232b',
          ash: '#8b8f96',
          ivory: '#f4f0ea',
          gold: '#d4af37'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        aurora: '0 20px 60px -25px rgba(15, 20, 25, 0.75)'
      }
    }
  },
  plugins: []
};

export default config;
