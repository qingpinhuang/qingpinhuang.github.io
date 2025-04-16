# Lingui

> 官网：<https://lingui.dev/>

## 工作流

> 文档：<https://lingui.dev/introduction#workflow>

![workflow](https://lingui.dev/assets/images/lingui-workflow-4c23edf0d9cbf3c08849eb56f11a8bbb.svg)

## 如何开始

> Node.js 版本需 v20 及以上

### 1. 准备 Lingui CLI

> 文档：<https://lingui.dev/ref/cli>

1. 安装 `@lingui/cli`

```bash
npm install --save-dev @lingui/cli
```

2. _package.json_ 添加脚本

```json
// package.json
{
  "scripts": {
    "extract": "lingui extract",
    "compile": "lingui compile"
  }
}
```

### 2. 选择编译器

可选编译器：

1. Babel: `@lingui/babel-plugin-lingui-macro`
2. SWC: `@lingui/swc-plugin`

> 文档：
>
> 1. <https://lingui.dev/installation>
> 2. [SWC Plugin](https://lingui.dev/ref/swc-plugin)

**下面以 SWC 作为编译器进行示例：**

1. 安装 `@lingui/swc-plugin`

```bash
npm install --save-dev @lingui/swc-plugin
```

2. 添加必要的配置

一般情况下，用 **.swcrc** 文件进行配置，如下：

```json
{
  "$schema": "https://json.schemastore.org/swcrc",
  "jsc": {
    "experimental": {
      "plugins": [
        [
          "@lingui/swc-plugin",
          {
            // Additional Configuration
          }
        ]
      ]
    }
  }
}
```

使用 Next.js 时，则通过 **next.config.js** 进行配置，如下：

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    swcPlugins: [
      [
        '@lingui/swc-plugin',
        {
          // Additional Configuration
        },
      ],
    ],
  },
};

module.exports = nextConfig;
```

### 3. 配置 _lingui.config.js_

```js
// lingui.config.js
import { defineConfig } from '@lingui/cli';

export default defineConfig({
  sourceLocale: 'en',
  locales: ['en', 'cs'],
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
});
```

### 4. 安装 `@lingui/core`

> 文档：<https://lingui.dev/ref/core>

```bash
npm install --save @lingui/core
```

**应用示例如下：**

1. 初始化：

```js
import { i18n } from '@lingui/core';
import { messages } from 'path-to-locale/en/messages.js';

i18n.load('en', messages);
i18n.activate('en');
```

2. 使用：

```js
import { t } from '@lingui/core/macro';

t`Hello World!`;

const name = 'Fred';
t`My name is ${name}`;
```

### 5. 安装 `@lingui/react`（可选）

> 文档：<https://lingui.dev/ref/react>

```bash
npm install --save @lingui/react
```

提供了适配 React 场景的组件：

1. `I18nProvider`
2. `Trans`

**应用示例如下：**

1. 初始化：

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';

import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { messages } from './locales/en/messages';
import Inbox from './Inbox';

i18n.load('en', messages);
i18n.activate('en');

const App = () => (
  <I18nProvider i18n={i18n}>
    <Inbox />
  </I18nProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

2. 使用：

```js
import { Trans } from '@lingui/react/macro';

export default function Inbox() {
  return (
    <div>
      <Trans>Message Inbox</Trans>
    </div>
  );
}
```

### 6. 开发（标记需要翻译的文本）

使用标签模板 `` t` ` `` 或组件 `<Trans></Trans>` 包裹需要翻译的文本即可

```js
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';

t`Hello World!`;

<div>
  <Trans>Message Inbox</Trans>
</div>;
```

### 7. extract

> 文档：<https://lingui.dev/guides/message-extraction>

```bash
npm run extract
# or
npx lingui extract
```

`lingui extract` 会查找代码中标记的待翻译文本，生成 `messages.po` 文件

### 8. 翻译

对 `lingui extract` 生成的 `messages.po` 文件进行翻译

### 9. compile

```bash
npm run compile
# or
npx lingui compile
```

`lingui compile` 将 `messages.po` 文件编译成 `messages.js` 文件，代码中最终应用的文件以 `messages.js` 为准
