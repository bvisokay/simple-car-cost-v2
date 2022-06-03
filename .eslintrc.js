module.exports = {
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking", "plugin:jest/recommended", "plugin:jest/style", "plugin:testing-library/react", "next", "prettier", "next/core-web-vitals"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/require-await": "off",
    "react/jsx-key": "off",
    "no-inner-declarations": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "react-hooks/rules-of-hooks": "off",
    "no-empty": "off",
    "no-useless-catch": "off",
    "react/jsx-no-comment-textnodes": "off",
    "testing-library/render-result-naming-convention": "off",
    "react/jsx-no-target-blank": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "prefer-const": "off"
  }
}
