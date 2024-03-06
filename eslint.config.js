import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import eslintImport from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";

export default [
  { ignores: ["content/", "dist/"] },
  { files: ["*.js", "src/**/*.js"] },
  js.configs.recommended,
  jsdoc.configs["flat/recommended-typescript-flavor"],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { import: eslintImport },
    rules: {
      "import/newline-after-import": "warn",
      "import/order": [
        "warn",
        {
          alphabetize: { order: "asc" },
          groups: [ "builtin", "external", "internal", "parent", "sibling", "index", "object", "type" ], // prettier-ignore
          "newlines-between": "always",
        },
      ],
      "import/prefer-default-export": "off",
      "no-use-before-define": ["error", "nofunc"],
    },
  },
  prettier,
];
