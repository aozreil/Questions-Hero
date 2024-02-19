import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      screens: {
        'xs': '400px',
      },
    },
  },
  plugins: [],
} satisfies Config;
