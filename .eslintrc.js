module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential",
    "prettier", // eslint-config-prettier 可简写成 prettier
    ".eslintrc-auto-import.json", // unplugin-auto-import 自动生成的eslint文件
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  // eslint-plugin-prettier 可简写成 prettier
  plugins: ["@typescript-eslint", "vue", "prettier"],
  rules: {
    "prettier/prettier": "error", // 开启规则
  },
};
