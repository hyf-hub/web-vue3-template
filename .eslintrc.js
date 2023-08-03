module.exports = {
  env: {
    browser: true,
    es2021: true,
    // 增加node环境，否则在别的文件中使用node的东西会报错
    node: true,
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
    "@typescript-eslint/no-var-requires": "off",
    "prettier/prettier": "error", // 开启规则
  },
};
