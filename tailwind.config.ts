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
        universal_white_background: "#ffffff",
        headerbar_gray_border: "1px solid var(--Neutral-Black-Black-50, #F0F1F3)",
        sidebar_white_background: "#fffff",
        sidebar_black_text: "#667085",
        sidebar_green_button_background: "#1EB386",
        sidebar_gray_border: "#F0F1F3",
        sidebar_bottom_gray_background: "#F7F7F7",
        sidebar_bottom_red_logout_text_color: "#FF7A7A",
        business_settings_black_text: "#121212",
        business_settings_gray_text: "#7D8398",
        business_settings_gray_border: "var(--Neutral-500, #667877)",
        change_password_green_background: "var(--Primary-200, #D8F6E5)" ,
      },
    },
  },
  plugins: [],
} satisfies Config;
