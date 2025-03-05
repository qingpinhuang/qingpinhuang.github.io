# NPM 包入口

NPM 包按照如下的顺序查找入口文件：

1. `package.json` 文件

   - `exports` 字段
   - `main` 字段

2. `index.js` 文件

## `package.json` 文件

在 `package.json` 内，优先读取 `exports` 字段，读取不到时才读取 `main` 字段

```json
// package.json
{
  // 入口配置，优先于 main 字段（注意：对象内部的配置顺序与解析顺序相关，优先解析配置在最前面的声明）
  "exports": {
    // TypeScript 场景下优先解析，应放在最先的位置
    "types": "./types/index.d.ts",
    // ESM 模式下 `import "npm-package"` 的方式引入时
    "import": "./esm/index.esm.js",
    // CJS 模式下 `require("npm-package")` 的方式引入时
    "require": "./cjs/index.cjs.js",
    // 默认值，可以是 ESM 或 CJS 模块文件
    "default": "./esm/index.esm.js"
  },
  // 入口配置，支持所有版本的 Node.js
  "main": "./cjs/index.cjs.js",
  // TypeScript 类型声明
  "types": "./types/index.d.ts"
}
```

## `index.js` 文件

当 `package.json` 没有配置入口时，读取根目录下的 `index.js` 作为包入口

## 参考

- [Package entry points](https://nodejs.org/api/packages.html#package-entry-points)
