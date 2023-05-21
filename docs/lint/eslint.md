# ESLint

> 官网：https://eslint.org/

## ESLint + Prettier

### 依赖

- [eslint](https://github.com/eslint/eslint)
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) - 关闭不必要或者与 Prettier 冲突的规则
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) - 将 Prettier 作为 ESLint 的规则运行，并将差异报告为单个 eslint 问题
- [prettier](https://github.com/prettier/prettier)

### `.eslintrc`

```json
{
  "extends": ["plugin:prettier/recommended"]
}
```

等价于

```json
{
  "extends": ["prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  }
}
```
