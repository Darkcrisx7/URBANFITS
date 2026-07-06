import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        paper: "#FFFFFF",
        accent: {
          DEFAULT: "#3B82F6",
          dim: "#2563EB",
        },
        success: "#22C55E",
        error: "#EF4444",
        stone: {
          50: "#FAFAFA",
          100: "#F2F2F2",
          200: "#E4E4E4",
          300: "#CBCBCB",
          400: "#9B9B9B",
          500: "#6E6E6E",
          600: "#4A4A4A",
          700: "#2E2E2E",
          800: "#1A1A1A",
          900: "#0F0F0F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        wideish: "0.08em",
        widest2: "0.24em",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        fadeUp: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 1.6s infinite linear",
      },
      boxShadow: {
        soft: "0 2px 24px -4px rgba(0,0,0,0.08)",
        lift: "0 20px 48px -12px rgba(0,0,0,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
