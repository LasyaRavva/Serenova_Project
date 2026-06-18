export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#C9A84C",
        "gold-light": "#E8D5A3",
        "dark-base": "#0F0F0F",
        "dark-surface": "#1A1A1A",
        "dark-card": "#222222",
        muted: "#9A9A9A",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["Inter", "sans-serif"],
      },
      keyframes: {
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};