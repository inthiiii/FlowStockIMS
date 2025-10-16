/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          // Brand
          primary: {
            50:  "#eef6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6", // main
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
          },
          accent: {
            500: "#10b981", // emerald
            600: "#059669",
          },
          warn: {
            500: "#f59e0b", // amber
            600: "#d97706",
          },
          // Surfaces
          canvas: "#f4f7fb",
          card: "#ffffff",
          ink: {
            50: "#f9fafb",
            100: "#f3f4f6",
            300: "#d1d5db",
            500: "#6b7280",
            700: "#374151",
            900: "#111827",
          },
        },
        fontFamily: {
          sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        },
        borderRadius: {
          "xl2": "1.25rem",
        },
        boxShadow: {
          soft: "0 6px 20px rgba(2, 6, 23, 0.06)",
          card: "0 2px 12px rgba(2, 6, 23, 0.05)",
        },
        backgroundImage: {
          "hero-gradient":
            "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.06))",
        },
      },
    },
    plugins: [],
  };