/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Validation of content paths is critical for NativeWind.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./ai/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#000000", // Black for OLED
        surface: "#1c1c1e", // Slightly lighter functionality gray (Apple style)
        primary: "#007AFF", // System Blue
        secondary: "#5E5CE6", // System Indigo
        success: "#34C759", // System Green
        danger: "#FF3B30", // System Red
        warning: "#FFCC00", // System Yellow
        text: "#FFFFFF", // Pure White
        muted: "#EBEBF599", // Apple Label 2 (60% white) - much brighter than before
        border: "#3a3a3c", // Separator color
      },
    },
  },
  plugins: [],
};
