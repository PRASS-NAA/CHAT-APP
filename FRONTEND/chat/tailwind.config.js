/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"], // Ensure index.html and all component files are included
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // DaisyUI plugin
}
