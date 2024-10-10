/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "base-200": "#001529", // Custom color
      },
    },
  },
  plugins: [
    daisyui, // Correctly include DaisyUI as a plugin
  ],
};
