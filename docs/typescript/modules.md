# 模块

1. 模块运行在自身的作用域内，而不是全局作用域：模块内定义的变量、函数和类等，均仅模块内可见，模块外不可访问
2. 模块通过 `export` 导出内部定义的变量、函数和类等内容给外部访问
3. 模块通过 `import` 引入依赖的模块，引入的模块会在加载此模块之前加载和执行

## 导出

### 导出声明

任何声明（变量、函数、类、类型别名、接口）都能通过 `export` 关键字来导出

```ts
// StringValidator.ts
export interface StringValidator {
  isAcceptable(s: string): boolean;
}
```

```ts
// ZipCodeValidator.ts
export const numberRegexp = /^[0-9]+$/;
export class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
```

### 导出语句

```ts
// ZipCodeValidator.ts
class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator }; // 导出的同时重命名
```

### 重新导出

```ts
// AllValidators.ts
export * from "./StringValidator";
export { ZipCodeValidator as RegExpBasedZipCodeValidator } from "./ZipCodeValidator"; // 重新导出并重命名
```

## 导入

### 导入模块的某个导出内容

```ts
import { ZipCodeValidator } from "./ZipCodeValidator";
import { ZipCodeValidator as ZCV } from "./ZipCodeValidator"; // 导入的同时重命名
```

### 整个模块导入到一个变量，并通过它来访问模块的导出内容

```ts
import * as validator from "./ZipCodeValidator";
const myZipCodeValidator = new validator.ZipCodeValidator();
```

### 导入模块用于执行该模块，但不关注其导出

```ts
import "./global-module";
```

## 默认导出

1. 默认导出使用 `default` 关键字标记
2. 一个模块只能有一个 `default` 导出
3. 类和函数声明可以直接标记为默认导出，此时类和函数的名字可以省略
4. 默认导出也可以直接导出一个值

```ts
// ZipCodeValidator.ts
export default class ZipCodeValidator {
  static numberRegexp = /^[0-9]+$/;
  isAcceptable(s: string) {
    return s.length === 5 && ZipCodeValidator.numberRegexp.test(s);
  }
}
```

```ts
// Test.ts
import validator from "./ZipCodeValidator";
let myValidator = new validator();
```

## `export =` 和 `import = require()`

1. CommonJS 和 AMD 有一个 `exports` 对象，它指代一个模块的所有导出
2. `export default` 期望能替代此行为，但事实上两者并不等价，故而 TypeScript 提出 `export =` 来实现传统的 CommonJS 和 AMD 模块导出
3. 使用 `export =` 导出的模块，必须使用 `import module = require('module')` 这种特定于 TypeScript 的模式导入

```ts
// ZipCodeValidator.ts
let numberRegexp = /^[0-9]+$/;
class ZipCodeValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
export = ZipCodeValidator;
```

```ts
// Test.ts
import zip = require("./ZipCodeValidator");
let strings = ["Hello", "98052", "101"];
let validator = new zip();
strings.forEach((s) => {
  console.log(`'${s}' - ${validator.isAcceptable(s) ? "matches" : "does not match"}`);
});
```

## 生成模块代码

1. TypeScript 编译时可以指定模块目标参数，用以生成相应的模块代码
2. 可选的模块目标：Nodejs ([CommonJS](http://wiki.commonjs.org/wiki/CommonJS))、Require.js ([AMD](https://github.com/amdjs/amdjs-api/wiki/AMD))、[UMD](https://github.com/umdjs/umd)、[SystemJS](https://github.com/systemjs/systemjs)、[ECMAScript 2015 native modules](http://www.ecma-international.org/ecma-262/6.0/#sec-modules) (ES6)
3. 使用 `--module moduleName` 指定生成的目标模块，如：`tsc --module commonjs Test.ts`

## 使用其它 JavaScript 库

用 `.d.ts` 文件声明非 TypeScript 实现的库

### 外部模块

```ts
// node.d.ts
declare module "url" {
  export interface Url {
    protocol?: string;
    hostname?: string;
    pathname?: string;
  }

  export function parse(urlStr: string, parseQueryString?, slashesDenoteHost?): Url;
}

declare module "path" {
  export function normalize(p: string): string;
  export function join(...paths: any[]): string;
  export let sep: string;
}
```

```ts
/// <reference path='node.d.ts'/>

import * as URL from "url";
// 或者
import URL = require("url");

URL.parse("https://www.typescriptlang.org");
```

### 外部模块简写

```ts
// declarations.d.ts
declare module "test-module";
```

```ts
// test.ts
import x, { y } from "test-module";
```

1. 简写模式可以快速声明一个模块而不编写具体的声明内容
2. 此模式下所有导出的类型都是 `any`

### 模块声明通配符

1. 某些模块加载器支持导入非 JavaScript 内容，如：[SystemJS](https://github.com/systemjs/systemjs/blob/main/docs/module-types.md)、[AMD](https://github.com/amdjs/amdjs-api/blob/master/LoaderPlugins.md)
2. 可使用前缀或者后缀来表示特殊的加载语法：模块声明通配符就是用来表示这种情况的

```ts
declare module "*!text" {
  const content: string;
  export default content;
}

declare module "json!*" {
  const value: any;
  export default value;
}
```

```ts
import fileContent from "./xyz.txt!text";
import data from "json!http://example.com/data.json";
```

### UMD 模块

1. 兼容多个模块加载器，或者不使用模块加载器（全局变量）
2. 通过模块导入或者全局变量的形式访问

```ts
export function isPrime(x: number): boolean;
export as namespace MathLib;
```

```ts
// 模块导入的形式
import { isPrime } from "math-lib";
isPrime(2);

// 全局变量的形式，注意：不能在模块文件使用全局定义（含有导入和导出的文件视为模块文件）
MathLib.isPrime(2);
```

## 创建模块结构指导

1. 尽可能地在顶层导出：不要嵌套过多，方便外部使用
2. 如果仅导出单个 `class` 或 `function` ，使用 `export default`
3. 如果要导出多个对象，把它们放在顶层里导出
4. 明确地列出导入的名字：`import { format } from 'utils'`
5. 当有大量内容需要导入时，使用命名空间导入模式：`import * as namespace from 'module'`
6. 使用重新导出进行扩展
7. 模块里不要使用命名空间：模块本身就有自己的作用域，仅导出的内容对外可见，不需要额外添加命名空间限制作用域
