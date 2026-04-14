import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        primary: "#6C3AED",
        "primary-light": "#8B5CF6",
        "primary-dark": "#5B21B6",
        accent: "#F59E0B",
        "accent-red": "#EF4444",
        success: "#10B981",
        dark: "#1F2937",
        light: "#FAFAFA",
        "text-on-dark": "#FFFFFF",
        "text-on-light": "#1F2937",
        surface: "#FFFFFF",
        "surface-elevated": "#F8FAFC",
        border: "#E5E7EB",
        muted: "#6B7280",
      },
    },
  },
} satisfies Config;
