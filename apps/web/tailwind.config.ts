import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#09090B",
          elevated: "#18181B",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.06)",
          medium: "rgba(255, 255, 255, 0.10)",
          strong: "rgba(255, 255, 255, 0.15)",
        },
        brand: {
          blue: {
            primary: "#2563EB",
            light: "#3B82F6",
            dark: "#1D4ED8",
          },
          cyan: {
            accent: "#38BDF8",
            light: "#7DD3FC",
          },
        },
        text: {
          primary: "#FAFAFA",
          secondary: "#A1A1AA",
          tertiary: "#71717A",
        },
        status: {
          verified: "#10B981",
          pending: "#F59E0B",
          unverified: "#6B7280",
        },
      },
      fontSize: {
        // Hero text: Responsive from 40px (mobile) to 80px (desktop)
        hero: ["clamp(40px, 8vw, 80px)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        // Section titles: Responsive from 32px (mobile) to 48px (desktop)
        section: ["clamp(32px, 5vw, 48px)", { lineHeight: "1.2", fontWeight: "700" }],
        // H2 headings: Responsive from 28px (mobile) to 36px (desktop)
        h2: ["clamp(28px, 4vw, 36px)", { lineHeight: "1.3", fontWeight: "600" }],
        // H3 headings: Responsive from 20px (mobile) to 24px (desktop)
        h3: ["clamp(20px, 3vw, 24px)", { lineHeight: "1.4", fontWeight: "600" }],
        // Body text: Responsive from 16px (mobile) to 18px (desktop)
        body: ["clamp(16px, 2vw, 18px)", { lineHeight: "1.6", fontWeight: "400" }],
        // Small text: 14px
        small: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      letterSpacing: {
        tighter: "-0.02em",
        tight: "-0.01em",
        normal: "0",
        wide: "0.01em",
        wider: "0.02em",
      },
      lineHeight: {
        tight: "1.1",
        snug: "1.2",
        relaxed: "1.3",
        normal: "1.4",
        loose: "1.5",
        body: "1.6",
      },
      spacing: {
        section: "160px",
        "section-mobile": "80px",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
      },
      backgroundOpacity: {
        glass: "0.06",
        "glass-medium": "0.10",
        "glass-strong": "0.15",
      },
      borderColor: {
        "glass-light": "rgba(255, 255, 255, 0.1)",
        "glass-medium": "rgba(255, 255, 255, 0.15)",
        "glass-strong": "rgba(255, 255, 255, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
