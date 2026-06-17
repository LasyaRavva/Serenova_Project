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
        "muted": "#9A9A9A",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}