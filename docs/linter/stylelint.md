# Stylelint

> 官网：https://stylelint.io/

## 如何开始

> 详见：https://stylelint.io/user-guide/get-started

1. 安装 `stylelint`

```bash
npm install --save-dev stylelint
```

2. 配置 `.stylelintrc.{cjs,js,json,yaml,yml}`

```json
// .stylelintrc 示例
{
  "extends": ["stylelint-config-standard-scss", "stylelint-config-recess-order"]
}
```

> - `stylelint-config-standard-scss`：SCSS 规则配置
> - `stylelint-config-recess-order`：CSS 属性顺序（推荐）
>
> ```bash
> npm install --save-dev stylelint-config-standard-scss stylelint-config-recess-order
> ```

3. 执行 Lint

```bash
npx stylelint "**/*.{css,scss}"
```

## Stylelint + VSCode

### 期望

- 开发时提示错误（标红/黄色波浪线）
- 保存时自动修复代码

### 步骤

1. 安装 [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) 插件

> 可将 Stylelint 插件添加到「工作区建议」，以使每位开发者都安装此插件
>
> - 在扩展列表中，单击鼠标右键，选择「添加到工作区建议」
> - 或者直接修改 _.vscode/extensions.json_ 文件，如下：
>
> ```json
> // .vscode/extensions.json
> {
>   "recommendations": ["stylelint.vscode-stylelint"]
> }
> ```

2. 配置 _.vscode/settings.json_

```json
{
  // 在代码保存时执行...
  "editor.codeActionsOnSave": {
    // 按照 stylelint 规则修复代码
    "source.fixAll.stylelint": true
  },

  // 关闭 VSCode 内建的验证器
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  // stylelint 将会执行校验的文件
  "stylelint.validate": ["css", "postcss", "less", "sass", "scss"]
}
```

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
