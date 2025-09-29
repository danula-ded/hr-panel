import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Общие рекомендации для JavaScript
  js.configs.recommended,

  // Рекомендации для TypeScript
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
    },
    rules: {
      ...ts.configs.recommended.rules,
    },
  },

  // Рекомендации для Svelte
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        extraFileExtensions: [".svelte"],
      },
    },
    plugins: {
      svelte,
    },
    rules: {
      ...svelte.configs["flat/recommended"][0].rules,
    },
  },

  // Игнорирование файлов
  {
    ignores: ["build/**", "node_modules/**"],
  },
];
