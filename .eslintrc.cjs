module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "import", "unused-imports"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-unused-vars": "off",
    "import/order": [
      "error",
      {
        pathGroups: [
          {
            pattern: "@/**",
            group: "internal",
            position: "after",
          },
        ],
        groups: [
          "builtin",
          "external",
          "internal",
          ["sibling", "parent"],
          "index",
        ],
        alphabetize: {
          order: "asc",
          caseInsensitive: false,
        },
        "newlines-between": "always",
        pathGroupsExcludedImportTypes: [],
      },
    ],
    "unused-imports/no-unused-imports": "error",
  },
};
