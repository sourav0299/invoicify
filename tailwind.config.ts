import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sidebar_white_background: "#fffff",
        sidebar_black_text: "#667085",
        sidebar_green_button_background: "#1EB386",
        sidebar_gray_border: "#F0F1F3",
      },
    },
  },
  plugins: [],
} satisfies Config;
