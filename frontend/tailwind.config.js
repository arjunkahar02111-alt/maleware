/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0b0f19",
        darkPanel: "rgba(30, 41, 59, 0.4)", // Slate-800 with opacity for glassmorphism
        primary: "#3b82f6",
        neonGreen: "#39ff14",
        neonRed: "#ff073a",
        neonBlue: "#00f3ff",
        neonYellow: "#ffff00",
      },
      boxShadow: {
        'glow-green': '0 0 15px rgba(57, 255, 20, 0.5)',
        'glow-red': '0 0 15px rgba(255, 7, 58, 0.5)',
        'glow-blue': '0 0 15px rgba(0, 243, 255, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
