import next from "eslint-config-next";

const eslintConfig = [
  ...next,
  {
    rules: {
      "@next/next/no-img-element": "warn",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "public/**"],
  },
];

export default eslintConfig;
