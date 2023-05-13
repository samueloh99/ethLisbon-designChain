/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        btn: "#EFEBE7",
      },
      boxShadow: {
        customShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
      },
    },
  },
  variants: {
    extend: {
      transitionProperty: [
        "responsive",
        "motion-safe",
        "motion-reduce",
      ],
      transform: ["motion-safe"],
    },
  },
  plugins: [],
};
