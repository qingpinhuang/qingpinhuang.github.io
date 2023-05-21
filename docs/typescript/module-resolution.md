# 模块解析

模块解析是指编译器在查找导入模块时所遵循的流程

1. 编译器尝试定位导入的模块文件，其查找策略有：Classic、Node
2. 如果查找失败并且模块名是非相对的，则再尝试定位 _外部模块声明_ 文件
3. 如果依然没有解析到文件，则抛出异常

## 相对 vs. 非相对 模块导入

模块引用是相对的还是非相对的，模块导入会以不同的方式解析

### 相对导入

_相对导入_ 是以 `/`、`./` 或 `../` 开头的，示例如下：

- `import '/mod'`
- `import Entry from './components/Entry'`
- `import { DefaultHeaders } from '../constants/http'`

1. 相对导入解析时是相对于导入它的文件
2. 相对导入的文件不能是外部模块声明文件
3. 相对导入一般用于自己开发的模块

### 非相对导入

所有其它形式的导入，都视为 _非相对_ 的，示例如下：

- `import * as $ from 'jQuery'`
- `import { Component } from '@angular/core'`

1. 非相对导入可以相对于 `baseUrl` 或通过路径映射进行解析
2. 非相对导入可以导入外部模块声明文件
3. 非相对导入一般用于外部依赖模块

## 模块解析策略

1. 有两种模块解析策略：Node 和 Classic
2. 可以使用 `--moduleResolution` 标记来指定使用哪种模块解析策略
3. 未指定的情况下，使用了 `--module AMD | System | ES2015` 时默认使用 Classic 策略，其它则为 Node 策略

### Classic

早期 TypeScript 默认的解析策略，现在保留只是为了向后兼容

**相对导入**
相对于导入它的文件进行解析查找

在 `/root/src/folder/A.ts` 文件内 `import { b } from './moduleB'`，其查找流程如下：

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`

**非相对导入**
从包含导入文件的目录开始依次向上级目录遍历查找

在 `/root/src/folder/A.ts` 文件内 `import { b } from 'moduleB'`，其查找流程如下：

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`
3. `/root/src/moduleB.ts`
4. `/root/src/moduleB.d.ts`
5. `/root/moduleB.ts`
6. `/root/moduleB.d.ts`
7. `/moduleB.ts`
8. `/moduleB.d.ts`

### Node

#### Node.js 如何解析模块

Node.js 解析算法：[Node.js module documentation](https://nodejs.org/api/modules.html#modules_all_together)

**相对导入**
在 `/root/src/moduleA.js` 文件内 `var x = require('./moduleB')`，其查找流程如下：

1. 检查 `/root/src/moduleB.js` 文件是否存在
2. 检查 `/root/src/moduleB` 目录是否包含 `package.json` 文件，并且 `package.json` 文件指定了 `"main"` 模块
3. 检查 `/root/src/moduleB` 目录是否包含 `index.js` 文件。此文件会被隐式地当作目录下的 `"main"` 模块

更多细节查看：[File modules](https://nodejs.org/api/modules.html#modules_file_modules) 和 [Folders as modules](https://nodejs.org/api/modules.html#modules_folders_as_modules)

**非相对导入**
从导入的文件所在的目录开始依次向上级目录遍历，查找特殊目录 `node_modules`，并检查其中是否包含要加载的模块

在 `/root/src/moduleA.js` 文件内 `var x = require('moduleB')`，其查找流程如下：

1. `/root/src/node_modules/moduleB.js`
2. `/root/src/node_modules/moduleB/package.json`，检查 `"main"` 属性
3. `/root/src/node_modules/moduleB/index.js`

4. `/root/node_modules/moduleB.js`
5. `/root/node_modules/moduleB/package.json`，检查 `"main"` 属性
6. `/root/node_modules/moduleB/index.js`

7. `/node_modules/moduleB.js`
8. `/node_modules/moduleB/package.json`，检查 `"main"` 属性
9. `/node_modules/moduleB/index.js`

更多细节查看：[Loading from node_modules folders](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders)

#### TypeScript 如何解析模块

TypeScript 是模仿 Node.js 运行时的解析策略来在编译阶段定位模块文件的

1. 在 Node.js 的解析逻辑上添加 TypeScript 源文件的检查（`.ts`、`.tsx`、`.d.ts`）
2. 在 `package.json` 里使用 `"types"` 表示类似 `"main"` 的意义

**相对导入**
在 `/root/src/moduleA.ts` 文件内 `import { b } from './moduleB'`，其查找流程如下：

1. `/root/src/moduleB.ts`
2. `/root/src/moduleB.tsx`
3. `/root/src/moduleB.d.ts`
4. `/root/src/moduleB/package.json`，检查 `"types"` 属性
5. `/root/src/moduleB/index.ts`
6. `/root/src/moduleB/index.tsx`
7. `/root/src/moduleB/index.d.ts`

**非相对导入**
在 `/root/src/moduleA.ts` 文件内 `import { b } from 'moduleB'`，其查找流程如下：

1. `/root/src/node_modules/moduleB.ts`
2. `/root/src/node_modules/moduleB.tsx`
3. `/root/src/node_modules/moduleB.d.ts`
4. `/root/src/node_modules/moduleB/package.json`，检查 `"types"` 属性
5. `/root/src/node_modules/moduleB/index.ts`
6. `/root/src/node_modules/moduleB/index.tsx`
7. `/root/src/node_modules/moduleB/index.d.ts`

8. `/root/node_modules/moduleB.ts`
9. `/root/node_modules/moduleB.tsx`
10. `/root/node_modules/moduleB.d.ts`
11. `/root/node_modules/moduleB/package.json`，检查 `"types"` 属性
12. `/root/node_modules/moduleB/index.ts`
13. `/root/node_modules/moduleB/index.tsx`
14. `/root/node_modules/moduleB/index.d.ts`

15. `/node_modules/moduleB.ts`
16. `/node_modules/moduleB.tsx`
17. `/node_modules/moduleB.d.ts`
18. `/node_modules/moduleB/package.json`，检查 `"types"` 属性
19. `/node_modules/moduleB/index.ts`
20. `/node_modules/moduleB/index.tsx`
21. `/node_modules/moduleB/index.d.ts`

## 附加的模块解析标记

TypeScript 编译器有一些额外的标记来通知编译器在源码编译成最终输出的过程中都发生了哪个转换

### Base URL

1. 设置 `baseUrl` 来告诉编译器到哪里去查找模块
2. _非相对模块导入_ 会相对于 `baseUrl` 进行计算
3. _相对模块导入_ 不受 `baseUrl` 影响，它只相对于导入的文件

**`baseUrl` 值的来源：**

1. 命令行中 `baseUrl` 的值（如果值是相对路径，那么相对于当前路径进行计算）
2. `tsconfig.json` 里的 `baseUrl` 属性（如果值是相对路径，那么相对于 `tsconfig.json` 路径进行计算）

更多信息查看：[RequireJS](https://requirejs.org/docs/api.html#config-baseUrl) 和 [SystemJS](https://github.com/systemjs/systemjs/blob/main/docs/api.md)

### 路径映射

路径映射可以修改导入模块的真实路径，如：`import jquery from 'jquery'`，希望最终指向的路径是：`node_modules/jquery/dist/jquery.slim.min.js`，配置如下：

```ts
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".", // 必须设置"baseUrl"，确保"paths"生效
    "paths": { // 相对于"baseUrl"
      "jquery": ["node_modules/jquery/dist/jquery"], // <baseUrl>/node_modules/jquery/dist/jquery
      "*": [
          "*", // <baseUrl>/<moduleName>
          "generated/*" // <baseUrl>/generated/<moduleName>
      ]
    }
  }
}
```

1. 路径映射通过 `tsconfig.json` 文件内的 `paths` 参数进行配置
2. 路径映射的最终路径相对于 `baseUrl` 进行计算
3. 通配符 `*` 表示匹配所有路径

信息更多查看：[RequireJs documentation](https://requirejs.org/docs/api.html#config-paths) 和 [SystemJS documentation](https://github.com/systemjs/systemjs/blob/main/docs/import-maps.md)

### `rootDirs` 指定虚拟目录

有时多个目录下的工程源文件在编译时会进行合并放在某个输出目录下，这可以将这些源目录视为同一个 _虚拟目录_，`rootDirs` 可以指定这个虚拟目录的 _roots_，在此目录下，编译器会将不同源目录的文件按照在同一个目录下的方式解析相对导入的模块

```
 src
 └── views
     └── view1.ts (imports './template1')
     └── view2.ts

 generated
 └── templates
         └── views
             └── template1.ts (imports './view2')
```

```ts
// tsconfig.json
{
  "compilerOptions": {
    "rootDirs": [
      "src/views",
      "generated/templates/views"
    ]
  }
}
```

如上，会将 `src/views` 和 `generated/templates/views` 视为同一个目录，故而其相互引用文件时可以按照同一个目录的方式设置相对路径

### 跟踪模块解析

通过 `--traceResolution` 启用编译器的模块解析跟踪，它可以告诉我们模块解析过程中发生了什么，方便我们查找模块为什么没有解析或者解析到了错误的位置

### 使用 `--noResolve`

一般情况下，编译器会在编译之前解析模块导入。每当它成功地解析了对一个文件的 `import`，这个文件就会被添加到编译列表里，以供编译器稍后处理。

`--noResolve` 编译选项告诉编译器不要添加任何不是在命令行上传入的文件到编译列表。编译器仍然会解析模块，但没有指定这个文件，就不会被包含进去。

```bash
tsc app.ts moduleA.ts --noResolve
```

```ts
// app.ts
import * as A from "moduleA"; // 成功，moduleA 在命令行中传入了
import * as B from "moduleB"; // 错误，命令行没有指定此模块，导致最终找不到模块
```
