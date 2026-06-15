import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__dirname);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 继承 Next 核心+TS规则（自带基础RSC检测）
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@next/next/no-img-element": "warn",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      // 强化RSC相关严格校验
      "@next/no-server-import-in-client": "error",
      "@next/no-client-import-in-server": "error",
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "public/**"],
  },
];

export default eslintConfig;