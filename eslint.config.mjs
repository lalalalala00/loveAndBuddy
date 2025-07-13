// eslint.config.ts
import { fileURLToPath } from "url";
import { dirname } from "path";
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // "prettier/prettier": "warn",
    },
  },
];
