import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist", ".vercel", ".prerender"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Makes the JSX parser count <Foo /> as a use of `Foo`, so
      // no-unused-vars doesn't report components referenced only in JSX.
      "react/jsx-uses-vars": "error",
      "no-unused-vars": [
        "error",
        { varsIgnorePattern: "^[A-Z_]", ignoreRestSiblings: true },
      ],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    // The prerenderer is a build-time Node script, not browser code.
    files: ["prerender/**/*.jsx", "scripts/**/*.mjs", "*.config.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];