module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    // 强制使用单引号
    'quotes': ['error', 'single'],
    // 关闭行末分号提示/报错
    'semi': 0
  },
  parserOptions: {
    parser: "babel-eslint"
  }
}
