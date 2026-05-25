/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        jp: { DEFAULT: "#1DB954", light: "#4ade80", muted: "rgba(29,185,84,0.15)" },
        aranza: { DEFAULT: "#E8119C", light: "#f472b6", muted: "rgba(232,17,156,0.15)" },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "pulse-jp": "pulseJP 3s ease-in-out infinite",
        "pulse-ar": "pulseAR 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        pulseJP: { "0%,100%": { boxShadow: "0 0 0 0 rgba(29,185,84,0)" }, "50%": { boxShadow: "0 0 24px 4px rgba(29,185,84,0.2)" } },
        pulseAR: { "0%,100%": { boxShadow: "0 0 0 0 rgba(232,17,156,0)" }, "50%": { boxShadow: "0 0 24px 4px rgba(232,17,156,0.2)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};


