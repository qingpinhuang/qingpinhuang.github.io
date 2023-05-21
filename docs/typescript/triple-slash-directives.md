# 三斜线指令

1. 三斜线指令是包含单个 XML 标签的单行注释，其内容会作为编译器指令使用
2. 三斜线指令仅可放在文件的最顶端。其前面只能是单行或者多行注释（三斜线指令也是注释，故而可以是其它三斜线指令）；如果它出现在一个语句或者声明之后，那么它将会被当成普通的单行注释，不再具有特殊语义

## `/// <reference path="..." />`

1. `/// <reference path="..." />` 指令是最常见的三斜线指令，用于声明文件之间的依赖
2. 三斜线引用告诉编译器在编译过程中要引入的额外文件
3. 在使用 `--out` 或 `--outFile` 时，它也可以作为调整输出内容顺序的一种方法。文件在输出文件内容中的位置与预处理后的输入顺序一致

### 预处理输入文件

编译器会对输入的文件进行预处理来解析所有的三斜线引用指令。在这个过程中，额外的文件会加到编译过程中

1. 从 _根文件_ 开始。根文件可以在命令行中指定，也可以在 `tsconfig.json` 中的 `files` 字段指定
2. 根文件按照指定的顺序进行预处理。在一个文件被加入列表之前，它所包含的所有三斜线引用指令都要被处理
3. 三斜线引用以它们在文件中出现的顺序，按照深度优先的方式解析
4. 三斜线引用的路径是相对于包含它的文件的，而不是相对于根文件

### 错误

1. 引用不存在的文件会报错
2. 一个文件用三斜线指令引用自己会报错

### 使用 `--noResolve`

如果指定了 `--noResolve` 编译选项，三斜线引用会被忽略；此时不会增加新文件，也不会改变给定的文件顺序

## `/// <reference types="..." />`

1. `/// <reference types="..." />` 用于声明对某个包的依赖
2. 对包名的解析与 `import` 语句里对模块名的解析类似。可以简单地将三斜线类型引用指令当作 `import` 语句
3. 仅在需要写 `d.ts` 文件时才使用这个指令
4. 对于在编译阶段生成的声明文件，编译器会自动添加 `/// <reference types="..." />`；当且仅当结果文件中使用了引用包里的声明时才会在生成的声明文件里添加 `/// <reference types="..." />` 指令
5. 若要在 `.ts` 文件里声明一个对 `@types` 包的依赖，使用 `--types` 命令行选项或者在 `tsconfig.json` 里指定

## `/// <reference lib="..." />`

1. 该指令允许文件显式包含现有的内置 _lib_ 文件
2. 内置 _lib_ 文件的引用方式与 _tsconfig.json_ 中的 `"lib"` 编译器选项相同
3. 建议在编写依赖内置类型（如：DOM APIs 或者内置的 JS 运行时构造函数，如：`Symbol`、`Iterable`）的声明文件中使用此指令
4. 声明文件中使用 `/// <reference lib="es2017.string" />` 与命令行中设置 `--lib es2017.string` 选项等效

## `/// <reference no-default-lib="true"/>`

1. 该指令把一个文件标记为 _默认库_，它往往出现在 `lib.d.ts` 或者其变体文件的顶部
2. 该指令告诉编译器在编译过程中不要包含这个默认库（如：`lib.d.ts`），这与命令行选项 `--noLib` 效果一样
3. 当传递了 `--skipDefaultLibCheck` 参数时，编译器仅会忽略带有 `/// <reference no-default-lib="true"/>` 的文件

## `/// <amd-module />`

1. 默认情况下生成的 AMD 模块都是匿名的，这在某些工具处理生成的模块时可能出现问题，如：`r.js`
2. `amd-module` 指令允许传入一个可选的模块名给编译器

```ts
// amdModule.ts
/// <amd-module name="NamedModule"/>
export class C {}
```

编译后模块名 `NamedModule` 会作为 `define` 的参数传入：

```js
// amdModule.js
define("NamedModule", ["require", "exports"], function (require, exports) {
  var C = (function () {
    function C() {}
    return C;
  })();
  exports.C = C;
});
```

## `/// <amd-dependency />`

> 此指令已废弃，使用 `import "moduleName"` 替代

1. `/// <amd-dependency path="x" />` 告诉编译器有一个非 TypeScript 模块的依赖需要被注入，作为目标模块 `require` 调用的一部分
2. `amd-dependency` 指定可以设置一个可选的 `name` 属性，它允许我们为 amd 依赖传递一个可选名称

```ts
/// <amd-dependency path="legacy/moduleA" name="moduleA"/>
declare var moduleA: MyType;
moduleA.callStuff();
```

生成的 JS 代码：

```js
define(["require", "exports", "legacy/moduleA"], function (require, exports, moduleA) {
  moduleA.callStuff();
});
```
