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
        // Legacy tokens kept working (admin panel, forms, etc. still use these)
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
        // New storefront luxury palette
        void: "#0B0B0D",
        graphite: "#17181C",
        graphite2: "#1F2025",
        chrome: {
          DEFAULT: "#8B93A6",
          bright: "#B8C0D4",
          dim: "#5B6273",
        },
        silver: "#C7C9CC",
        bone: "#EDEDEA",
        ember: "#FF4D2E",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter2: "-0.055em",
        wideish: "0.08em",
        widest2: "0.24em",
        widest3: "0.32em",
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
        driftSlow: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(1.5deg)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        fadeUp: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 1.6s infinite linear",
        driftSlow: "driftSlow 7s ease-in-out infinite",
      },
      boxShadow: {
        soft: "0 2px 24px -4px rgba(0,0,0,0.08)",
        lift: "0 20px 48px -12px rgba(0,0,0,0.18)",
        glass: "0 8px 32px -8px rgba(0,0,0,0.45), inset 0 1px 0 0 rgba(255,255,255,0.06)",
        chrome: "0 0 0 1px rgba(139,147,166,0.25), 0 20px 60px -20px rgba(0,0,0,0.6)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
