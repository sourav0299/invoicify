import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Invoicify UI specific colors
        universal_gray_background: 'var(--Neutral-Background, #FAFAFA)',
        universal_white_background: '#ffffff',
        sidebar_white_background: '#ffffff', // Fixed typo from '#fffff'
        sidebar_black_text: '#667085',
        sidebar_green_button_background: '#1EB386',
        sidebar_gray_border: '#F0F1F3',
        sidebar_bottom_gray_background: '#F7F7F7',
        sidebar_bottom_red_logout_text_color: '#FF7A7A',
        business_settings_black_text: '#121212',
        business_settings_gray_text: '#7D8398',
        business_settings_gray_border: 'var(--Neutral-500, #667877)',
        change_password_green_background: 'var(--Primary-200, #D8F6E5)',
        unit_gray_button_background: '#E1E9E9',
        download_purple_button: '#ECECFF',
        download_purple_text: '#8E8EFF',
        
        // shadcn/ui system colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        
        // Chart colors - properly defined for shadcn/ui chart components
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        
        // Custom chart colors for Invoicify
        'chart-inflow': '#3a8bff',
        'chart-outflow': '#39b3b3',
        'chart-sales': '#40c79a',
        'chart-sales-gradient-start': '#40c79a',
        'chart-sales-gradient-end': '#adedd2',
        'chart-expense-inventory': '#40c79a',
        'chart-expense-salaries': '#9d9dfe',
        'chart-expense-utilities': '#e1aeda',
        'chart-expense-marketing': '#ffdf46',
        'chart-income': '#3a8bff',
        'chart-expenses': '#c369b7',
        'chart-profit': '#40c79a',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border))',
        headerbar_gray: 'var(--Neutral-Black-Black-50, #F0F1F3)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;