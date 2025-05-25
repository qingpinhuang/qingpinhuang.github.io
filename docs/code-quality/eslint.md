# ESLint

> 官网：<https://eslint.org/>

## 如何开始

> 详见：<https://eslint.org/docs/latest/use/getting-started>

### 快速开始

执行初始化命令：

```bash
npm init @eslint/config@latest
```

按照指引选择合适的配置，生成 `eslint` 配置文件，示例如下：

```js
// eslint.config.mjs
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';

export default defineConfig([
  { files: ['**/*.js'], languageOptions: { globals: globals.browser } },
  { files: ['**/*.js'], plugins: { js }, extends: ['js/recommended'] },
]);
```

### 手动设置

1. 安装 `eslint`

```bash
npm install --save-dev eslint @eslint/js
```

2. 配置 `eslint.config.{mjs,cjs,js}`

```js
// eslint.config.js
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';

export default defineConfig([
  {
    files: ['**/*.js'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
]);
```

3. 执行 Lint

```bash
npx eslint project-dir/ file.js
```

## ESLint + VSCode

### 期望

- 开发时提示错误（标红/黄色波浪线）
- 保存时自动修复代码

### 步骤

1. 安装 [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 插件

> 可将 ESLint 插件添加到「工作区建议」，以使每位开发者都安装此插件
>
> - 在扩展列表中，单击鼠标右键，选择「添加到工作区建议」
> - 或者直接修改 _.vscode/extensions.json_ 文件，如下：
>
> ```json
> // .vscode/extensions.json
> {
>   "recommendations": ["dbaeumer.vscode-eslint"]
> }
> ```

2. 配置 _.vscode/settings.json_

```json
{
  // 在代码保存时执行...
  "editor.codeActionsOnSave": {
    // 按照 eslint 规则修复代码
    "source.fixAll.eslint": true
  }
}
```

3. 添加 `eslint` 配置

> 具体见 [如何开始](/code-quality/eslint?id=如何开始)

## ESLint + Prettier

使用 Prettier 的规则作为 ESLint 规则进行验证

### 依赖

- [eslint](https://github.com/eslint/eslint)
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) - 关闭不必要或者与 Prettier 冲突的规则
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) - 将 Prettier 作为 ESLint 的规则运行，并将差异报告为单独的 ESLint 问题
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

### 说明

1. Prettier 作为代码格式化工具，内部运行自有的代码校验规则和用户配置在 .prettierrc 上的规则
2. ESLint 作为 JS Linter 工具，其规则继承自 Prettier，故而有着与 Prettier 相同的校验规则
3. ESLint 检查发现 JS 不符合规范时，会标记错误并进行提示；Prettier 会在执行代码格式化时自动修复错误
4. 两者的运行是互不干扰的，只是 ESLint 继承了 Prettier 的规则，如果 ESLint 又添加了其它的规则而 Prettier 却没有，则可能会出现错误提示和代码格式化不同步的问题（在 VSCode，可以设置 _settings.json_ 中的 `"editor.codeActionsOnSave" = { "source.fixAll.eslint": true }` 补充自动格式化行为）
