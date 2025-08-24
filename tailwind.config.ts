import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'sui-deep-ocean': '#030F1C',
        'sui-ocean': '#011829',
        'sui-sea': '#4DA2FF',
        'sui-aqua': '#C0E6FF',
        'sui-cloud': '#FFFFFF',
      },
    },
  },
  plugins: [],
};

export default config;
