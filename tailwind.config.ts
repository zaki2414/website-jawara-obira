// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tropical Coastal Palette
        ocean: {
          50: '#f0f7ff',
          100: '#dbeafe',
          500: '#2B6CB0', // Primary: Biru Laut
          600: '#2c5282',
          700: '#2a4365',
        },
        tropic: {
          50: '#f0fdf4',
          500: '#38A169', // Secondary: Hijau Tropis
          600: '#2f855a',
        },
        sand: {
          50: '#F5F1E6', // Background: Beige Pasir
          100: '#efe8d9',
          200: '#e0d4c1',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;