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
        universal_gray_background: "var(--Neutral-Background, #FAFAFA)",
        headerbar_gray_border: "1px solid var(--Neutral-Black-Black-50, #F0F1F3)",
        sidebar_white_background: "#fffff",
        sidebar_black_text: "#667085",
        sidebar_green_button_background: "#1EB386",
        sidebar_gray_border: "#F0F1F3",
        sidebar_bottom_gray_background: "#F7F7F7",
        sidebar_bottom_red_logout_text_color: "#FF7A7A",
      },
    },
  },
  plugins: [],
} satisfies Config;
