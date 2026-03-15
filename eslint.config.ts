import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  stylistic.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended
    ],
    plugins: {
      "@stylistic": stylistic
    },
    ignores: ["node_modules", "dist", "**/*.js"],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.test.json"]
      }
    },
    rules: {
      // Consistency
      "@stylistic/arrow-parens": ["error", "as-needed"],
      "@stylistic/comma-dangle": ["error", "never"],
      "@stylistic/eol-last": "off",
      "@stylistic/no-multi-spaces": "off",
      "@stylistic/no-multiple-empty-lines": "off",
      "@stylistic/quotes": ["error", "double", { "avoidEscape": true }],
      "@stylistic/semi-style": ["error", "last"],

      // ? Should these be kept off ?
      "@stylistic/key-spacing": "off",
      "@stylistic/no-trailing-spaces": "off",

      // Preferences
      "@stylistic/max-statements-per-line": "off",
      "@stylistic/operator-linebreak": "off",
      "@stylistic/quote-props": ["error", "consistent"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/member-delimiter-style": ["error", {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "comma",
          "requireLast": false
        }
      }],
      
      // TypeScript
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": "off"
    }
  }
]);
