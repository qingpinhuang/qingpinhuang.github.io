# 自定义 Vue + Vite 项目

## 依赖

- [Node](https://nodejs.org/en)
- [npm](https://www.npmjs.com/)/[pnpm](https://pnpm.io/)/[yarn](https://yarnpkg.com/)
- [Vue3](https://cn.vuejs.org/)
- [Vite](https://cn.vitejs.dev/guide/)
- [Git](https://git-scm.com/book/zh/v2)

## 操作步骤

### 1. 创建空项目

用 [Vite](https://cn.vitejs.dev/guide/) 创建一个空的 **Vue** 项目

```bash
pnpm create vite project-name --template vue
```

进入项目根目录

```bash
cd project-name
```

### 2. 安装项目依赖

```bash
pnpm install
```

启动服务，在浏览器打开页面：_http://localhost:5173/_

```bash
pnpm dev
```

### 3. 初始化为 Git 仓库

```bash
git init

git add .
git commit -m "init"
```

调整 `.gitignore` 配置，参考如下：

```.gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Caches
.stylelintcache
.eslintcache
```

### 4. 添加 Prettier

> 详细见 [Prettier](/code-quality/prettier)

1、安装 `prettier`

```bash
pnpm install -D prettier
```

2、添加 `.prettierrc.cjs`

```js
module.exports = {
  tabWidth: 2,
  semi: false,
  singleQuote: true,
};
```

3、配置 **VSCode** 环境：

3.1 添加 `.vscode/settings.json`，设置默认代码格式化工具为 **Prettier** ，并开启保存时自动格式化：

```json
{
  // 默认代码格式化工具
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  // 保存时自动执行代码格式化
  "editor.formatOnSave": true
}
```

> 注意将 `.vscode/settings.json` 添加到 **Git** 仓库

3.2 将 **Prettier** 设置为工作区推荐插件，配置 `.vscode/extensions.json` 如下：

```json
{
  // 添加 esbenp.prettier-vscode 到 recommendations 数组
  "recommendations": ["esbenp.prettier-vscode", ...]
}
```

### 5. 添加 ESLint

> 详细见 [ESLint](/code-quality/eslint.md)

1、安装 `eslint`

```bash
pnpm install -D eslint
```

2、添加 `.eslintrc.cjs`

```js
module.exports = {
  env: {
    es2021: true,
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};
```

3、在 **Vite** 构建流程中添加 **ESLint** 校验：

3.1 安装 `vite-plugin-eslint`

```bash
pnpm install -D vite-plugin-eslint
```

3.2 在 `vite.config.js` 中配置 `vite-plugin-eslint` 插件：

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [vue(), eslint()],
});
```

4、支持 **Vue** 语法校验：

4.1 安装 `eslint-plugin-vue`

```bash
pnpm install -D eslint-plugin-vue
```

4.2 将 `eslint-plugin-vue` 添加进 `.eslintrc.cjs`，配置如下：

```js
module.exports = {
  // 注意 extends 内插件的顺序，plugin:vue/vue3-essential 必须放在后面
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential'],
};
```

5、使用 **Prettier** 规则校验：

5.1 安装 `eslint-config-prettier`、`eslint-plugin-prettier`：

```bash
pnpm install -D eslint-config-prettier eslint-plugin-prettier
```

5.2 将 `eslint-plugin-prettier` 添加进 `.eslintrc.cjs`，最终配置如下：

```js
module.exports = {
  // 注意 extends 内插件的顺序，plugin:prettier/recommended 放在最后面
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:prettier/recommended'],
};
```

6、配置 **VSCode** 环境：

6.1 修改 `.vscode/settings.json` 配置，使代码保存后自动执行 **ESLint** 校验并修复错误：

```json
{
  // 保存后执行动作
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

6.2 将 **ESLint** 设置为工作区推荐插件，配置 `.vscode/extensions.json` 如下：

```json
{
  // 添加 dbaeumer.vscode-eslint 到 recommendations 数组
  "recommendations": ["dbaeumer.vscode-eslint", ...]
}
```

### 6. 添加 Stylelint

> 详细见 [Stylelint](/code-quality/stylelint)

1、安装 `stylelint`

```bash
pnpm install -D stylelint
```

2、添加 `.stylelintrc.cjs`

```js
module.exports = {
  extends: [],
};
```

3、在 **Vite** 构建流程中添加 **Stylelint** 校验：

3.1 安装 `vite-plugin-stylelint`

```bash
pnpm install -D vite-plugin-stylelint
```

3.2 在 `vite.config.js` 中配置 `vite-plugin-stylelint` 插件：

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import stylelint from 'vite-plugin-stylelint';

export default defineConfig({
  plugins: [vue(), stylelint()],
});
```

4、使用 **Prettier** 规则校验：

4.1 安装 `stylelint-prettier`、`postcss-html`

```bash
pnpm install -D stylelint-prettier postcss-html
```

4.2 将 `stylelint-prettier`、`postcss-html` 添加到 `.stylelintrc.cjs`：

```js
module.exports = {
  extends: ['stylelint-prettier/recommended'],
  // 对相同的目标文件设置不同的配置，越往后的配置优先级越高
  overrides: [
    // 解析 .vue 文件中 style 标签内的样式
    {
      files: ['*.vue', '**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
};
```

5、使用 **SCSS**（可选）

5.1 安装 `postcss-scss`、`sass`

```bash
pnpm install -D postcss-scss sass
```

5.2 将 `postcss-scss` 添加到 `.stylelintrc.cjs`：

```js
module.exports = {
  extends: ['stylelint-prettier/recommended'],
  // 对相同的目标文件设置不同的配置，越往后的配置优先级越高
  overrides: [
    // 按 SCSS 处理 .vue 文件中的样式
    {
      files: ['*.vue', '**/*.vue'],
      customSyntax: 'postcss-scss',
    },
    // 解析 .vue 文件中 style 标签内的样式
    {
      files: ['*.vue', '**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
};
```

6、格式化 **CSS** 顺序（可选）

6.1 安装 `stylelint-config-recess-order`

```bash
pnpm install -D stylelint-config-recess-order
```

6.2 将 `stylelint-config-recess-order` 添加到 `.stylelintrc.cjs`：

```js
module.exports = {
  // 将 stylelint-config-recess-order 添加到 extends 中
  extends: ['stylelint-config-recess-order'],
};
```

7、配置 **VSCode** 环境：

7.1 修改 `.vscode/settings.json` 配置，使代码保存后自动执行 **Stylelint** 校验并修复错误：

```json
{
  // 保存后执行动作
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  },

  // 关闭 VSCode 默认校验
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  // Stylelint 校验文件
  "stylelint.validate": ["css", "postcss", "less", "sass", "scss", "vue"]
}
```

7.2 将 **Stylelint** 设置为工作区推荐插件，配置 `.vscode/extensions.json` 如下：

```json
{
  // 添加 stylelint.vscode-stylelint 到 recommendations 数组
  "recommendations": ["stylelint.vscode-stylelint", ...]
}
```

### 7. 添加 Git 提交校验

1、安装 `husky`、`lint-staged`

```bash
pnpm install -D husky lint-staged
```

2、初始化 Git hooks，生成 `.husky` 目录

```bash
npx husky install
```

3、`package.json` 添加 `scripts.prepare` 配置

```bash
pnpm pkg set scripts.prepare="husky install"
```

则 `package.json` 添加如下配置：

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

4、添加 hook

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

5、添加 `.lintstagedrc.cjs` 配置，参考如下：

```js
module.exports = {
  'src/**/*.{js,vue}': ['eslint'],
  'src/**/*.{css,scss,vue}': ['stylelint'],
};
```

6、在 `package.json` 中添加 `scripts`

```json
{
  "scripts": {
    "eslint": "eslint '**/*.{js,vue}'",
    "stylelint": "stylelint '**/*.{css,scss,vue}'"
  }
}
```

### 8. `jsconfig.json` 或 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "allowSyntheticDefaultImports": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

### 9. `vite.config.js`

```js
import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import stylelint from 'vite-plugin-stylelint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslint(), stylelint()],
  server: {
    // port: 5000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
```

### 10. `README.md`

### 11. 使用 Tailwind CSS

1、安装 `tailwindcss`、`postcss`、`autoprefixer`

```bash
pnpm install -D tailwindcss postcss autoprefixer
```

2、生成 `tailwind.config.js`、`postcss.config.js`

```bash
npx tailwindcss init -p
```

3、配置 `tailwind.config.js`，添加文件路径到 `content` 中

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,css}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

4、在 `./src/style.css` 内添加 `@tailwind` 指令

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5、通过 **Prettier** 进行校验

5.1 安装 `prettier-plugin-tailwindcss`

```bash
pnpm install -D prettier-plugin-tailwindcss
```

5.2 将插件添加到 `.prettierrc.cjs`

```js
module.exports = {
  // 添加 prettier-plugin-tailwindcss 到 plugins 中
  plugins: ['prettier-plugin-tailwindcss'],
};
```

6、通过 **Stylelint** 进行校验

6.1 安装 `stylelint-config-tailwindcss`

```bash
pnpm install -D stylelint-config-tailwindcss
```

6.2 修改 `.stylelintrc.cjs` 配置

```js
module.exports = {
  // 将 stylelint-config-tailwindcss 添加到 extends 中
  extends: ['stylelint-config-tailwindcss'],
};
```
