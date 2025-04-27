import tailwindScrollbar from "tailwind-scrollbar";
import tailwindForms from "@tailwindcss/forms";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [tailwindScrollbar({ nocompatible: true }), tailwindForms],
};
