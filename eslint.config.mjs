import next from "eslint-config-next";

const eslintConfig = [
  ...next,
  {
    rules: {
      "@next/next/no-img-element": "warn",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "react/display-name": "off",
      "react-hooks/static-components": "off",
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "public/**"],
  },
];

export default eslintConfig;
