module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        custom: "843.75px",
      }, // özel kırılım
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        serif: ["var(--font-merriweather)", "serif"],
      },
      colors: {
        primary: "#892EE1",
        primary900: "#6d2ad2",
        primary500: "#BF6ACC",
        primary300: "#D195DB",
        primary50: "#EEE9FA",
        secondary: "#2A2B3F",
        secondary400: "#595C73",
        secondary200: "#D1D2E0",
        secondary100: "#E9EAF2",
        ruby: "#CC0233",
        red100: "#F9C8D1",
        sunshine: "#f69c09",
        sunshine100: "#FFE6B3",
        border: "#e0e5ef",
        panel: "#595758",
        panelText: "#0C1B33"
      },
    },
  },
  plugins: [],
};
