# Prettier

> 官网：https://prettier.io/

代码格式化工具

## 如何使用

1. 安装 `prettier`

```bash
npm install --save-dev prettier
```

2. 配置 [`.prettierrc.{cjs,js,json,yaml,yml}`](https://prettier.io/docs/en/configuration.html)

```json
// .prettierrc 示例
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true
}
```

3. 如果希望忽略某些文件，可配置 [`.prettierignore`](https://prettier.io/docs/en/ignore.html)

```ignore
# Ignore artifacts:
build
coverage
```

4. 格式化代码

```bash
npx prettier --write src/
```

## Prettier + VSCode

### 期望

- 保存时自动格式化代码

### 步骤

1. 安装 [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 插件

> 可将 Prettier 插件添加到「工作区建议」，以使每位开发者都安装此插件
>
> - 在扩展列表中，单击鼠标右键，选择「添加到工作区建议」
> - 或者直接修改 _.vscode/extensions.json_ 文件，如下：
>
> ```json
> // .vscode/extensions.json
> {
>   "recommendations": ["esbenp.prettier-vscode"]
> }
> ```

2. 配置 _.vscode/settings.json_

```json
{
  // 默认代码格式化工具
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  // 保存时自动执行代码格式化
  "editor.formatOnSave": true
}
```

## Prettier vs. Linters

Linter 有两类规则：

**1. 代码格式化规则，如：max-len，no-mixed-spaces-and-tabs，keyword-spacing，comma-style ...**

Prettier 主要提供这方面的规则，并支持自动格式化，使得代码几乎不会出现此类错误

**2. 代码质量规则，如：no-unused-vars，no-extra-bind，no-implicit-globals，prefer-promise-reject-errors ...**

Prettier 没有这方面的规则，而这恰好是 Linter 最重要的部分，因为它们很可能捕获到代码中真正的错误

总的来说，**Prettier 格式化代码，Linter 捕获代码错误**

## Prettier + ESLint

> 详见：[ESLint](/linter/eslint?id=eslint-prettier)

## Prettier + Stylelint

> 详见：[Stylelint](/linter/stylelint?id=stylelint-prettier)
