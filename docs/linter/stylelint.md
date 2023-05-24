# Stylelint

> 官网：https://stylelint.io/

## Stylelint + Prettier

### 依赖

- [stylelint](https://github.com/stylelint/stylelint)
- [stylelint-config-prettier](https://github.com/prettier/stylelint-config-prettier) - 关闭不必要或者与 Prettier 冲突的规则（低于 v15 版本时需要）
- [stylelint-prettier](https://github.com/prettier/stylelint-prettier) - 将 Prettier 作为 Stylelint 的规则运行，并将差异报告为单独的 Stylelint 问题
- [prettier](https://github.com/prettier/prettier)

### `.stylelintrc`

```json
{
  "extends": ["stylelint-prettier/recommended"]
}
```

等价于

```json
{
  "plugins": ["stylelint-prettier"],
  "rules": {
    "prettier/prettier": true
  }
}
```

### 说明

1. Prettier 作为代码格式化工具，内部运行自有的代码校验规则和用户配置在 .prettierrc 上的规则
2. Stylelint 作为 CSS Linter 工具，其规则继承自 Prettier，故而有着与 Prettier 相同的校验规则
3. Stylelint 检查发现 CSS 不符合规范时，会标记错误并进行提示；Prettier 会在执行代码格式化时自动修复错误
4. 两者的运行是互不干扰的，只是 Stylelint 继承了 Prettier 的规则，如果 Stylelint 又添加了其它的规则而 Prettier 却没有，则可能会出现错误提示和代码格式化不同步的问题（在 VSCode，可以设置 _settings.json_ 中的 `"editor.codeActionsOnSave" = { "source.fixAll.stylelint": true }` 补充自动格式化行为）
