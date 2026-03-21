/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          DEFAULT: "#f97316",
          hover: "#ea6c0a",
          dim: "rgba(249,115,22,0.12)",
        },
        base: {
          DEFAULT: "#0c0e14",
          surface: "#12151e",
          elevated: "#1a1e2a",
          hover: "rgba(32,37,51,0.5)",
        },
        border: {
          DEFAULT: "#1e2336",
          accent: "#2a3050",
        },
        text: {
          primary: "#eef2ff",
          secondary: "#8892b0",
          muted: "#6b7aa3",
        },
        
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        stagger1: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease forwards",
        scaleIn: "scaleIn 0.2s ease forwards",
        slideIn: "slideIn 0.25s ease forwards",
      },
      boxShadow: {
        brand: "0 4px 24px rgba(249,115,22,0.15)",
        md: "0 4px 20px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
