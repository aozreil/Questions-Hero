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
      colors: {
        green: {
          "50": "#d3f0e5",
          "100": "#9dd7c0",
          "200": "#5eba99",
          "300": "#009f74",
          "400": "#008c5b",
          "500": "#007942",
          "600": "#006d39",
          "700": "#005d2d",
          "800": "#004c22",
          "900": "#00300c"
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
