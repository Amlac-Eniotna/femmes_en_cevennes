import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "editorial-new": ["var(--font-editorial-new)"],
        "editorial-old": ["var(--font-editorial-old)"],
      },
    },
  },
  plugins: [],
};
export default config;
