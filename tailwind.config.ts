import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        dark: "-4px 4px 0px 0px #000",
      },
      translate: {
        boxShadowX: "-4px",
        boxShadowY: "4px",
        reverseBoxShadowX: "4px",
        reverseBoxShadowY: "-4px",
      },
    },
  },
  plugins: [],
};
export default config;
