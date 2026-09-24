import next from "eslint-config-next";

const eslintConfig = [
  ...next,
  {
    rules: {
      // 项目大量使用外部 CDN 图片（simpleicons 为 SVG、玩家截图 / 皮肤 / 第三方
      // 头像等动态地址），next/image 无法优化且需要逐域名配置白名单，
      // 因此统一使用原生 <img>；本地静态图仍建议使用 next/image。
      "@next/next/no-img-element": "off",
      // 允许在 JSX 文本中直接书写引号 / 中文标点
      "react/no-unescaped-entities": "off",
      // 未使用变量统一报 warning，配合 lint 脚本的 --max-warnings=0 视为失败
      "@typescript-eslint/no-unused-vars": "warn",
      // 以下为 React Compiler 相关规则，项目采用手写 hooks 模式，暂不适用
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "react-hooks/static-components": "off",
      // 具名 memo 组件已显式声明 displayName，无需再校验
      "react/display-name": "off",
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "public/**"],
  },
];

export default eslintConfig;
