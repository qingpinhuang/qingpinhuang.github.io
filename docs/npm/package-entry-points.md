# NPM 包入口

## `package.json`

优先读取 `package.json` 中指定的包入口

```json
{
  // 入口配置，优先于 main 字段（注意：配置的顺序影响解析的结果）
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
  // TypeScript 入口
  "types": "./types/index.d.ts"
}
```

## `index.js`

如果 `package.json` 中没有配置入口信息，则使用项目根目录下的 `index.js` 文件作为包入口

## 参考

- [包模块 - Node.js 中文网](https://nodejs.cn/api/packages.html)
- [ECMAScript Modules in Node.js](https://www.typescriptlang.org/docs/handbook/esm-node.html)
