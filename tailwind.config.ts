// import type { Config } from "tailwindcss";

// export default {
//   darkMode: "class",
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//         boxShadow: {
//           neumorphism: "4px 4px 10px #c5c5c5, -4px -4px 10px #ffffff",
//           "neumorphism-inset": "inset 4px 4px 10px #c5c5c5, inset -4px -4px 10px #ffffff",
//         },
//       },
//     },
//   },
//   plugins: [],
// } satisfies Config;
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        neumorphism: "4px 4px 10px #c5c5c5, -4px -4px 10px #ffffff",
        "neumorphism-inset": "inset 4px 4px 10px #c5c5c5, inset -4px -4px 10px #ffffff",
      },
    },
  },
  plugins: [],
} satisfies Config;
