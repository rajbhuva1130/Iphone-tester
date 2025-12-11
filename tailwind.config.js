/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Validation of content paths is critical for NativeWind.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./ai/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#09090b", // zinc-950
        surface: "#18181b", // zinc-900
        primary: "#3b82f6", // blue-500
        secondary: "#8b5cf6", // violet-500
        success: "#22c55e", // green-500
        danger: "#ef4444", // red-500
        warning: "#eab308", // yellow-500
        text: "#f4f4f5", // zinc-100
        muted: "#a1a1aa", // zinc-400
        border: "#27272a", // zinc-800
      },
    },
  },
  plugins: [],
};
