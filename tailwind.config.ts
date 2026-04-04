import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-orange": "#F5912D",
        "brand-coral": "#F56969",
        "brand-lavender": "#E6B9E6",
      },
    },
  },
  plugins: [],
} satisfies Config;
