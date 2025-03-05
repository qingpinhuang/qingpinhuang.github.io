# NPM 包脚本

## `scripts` 字段

脚本声明在 `package.json` 文件内的 `scripts` 字段，如下：

```json
// package.json
{
  "scripts": {
    // <event>：内置的 NPM 命令
    // <user-defined>：开发者自定义的命名

    // 生命周期脚本
    "pre<event>": "...",
    "post<event>": "...",
    "pre<user-defined>": "...",
    "post<user-defined>": "...",
    // 示例
    "preinstall": "",
    "postinstall": "",

    // 自定义脚本
    "<user-defined>": "...",
    // 示例
    "serve": "",
    "build": ""
  }
}
```

## 生命周期脚本

定义规则：

- `pre<event>`：先于 `<event>` 执行
- `<event>`
- `post<event>`：后于 `<event>` 执行

可选的 `<event>`：

- `prepare`：`preprepare`、`prepare`、`postprepare`
- `install`：`preinstall`、`install`、`postinstall`
- `publish`：`prepublish`、`publish`、`postpublish`、`prepublishOnly`
- `pack`：`prepack`、`pack`、`postpack`
- `<user-defined>`（开发者自定义的脚本）：`pre<user-defined>`、`<user-defined>`、`post<user-defined>`

### 常用命令的生命周期脚本执行规则

通过 `npm <event/user-defined>` 执行 NPM 内置或开发者自定义的命令时，相关的生命周期脚本将会一同触发，其执行顺序如下：

#### `npm install`

- `preinstall`
- `install`
- `postinstall`
- `prepublish`
- `preprepare`
- `prepare`
- `postprepare`

#### `npm publish`

- `prepublishOnly`
- `prepack`
- `prepare`
- `postpack`
- `publish`
- `postpublish`

#### `npm run <user-defined>`

- `pre<user-defined>`
- `<user-defined>`
- `post<user-defined>`

## 自定义脚本

自定义脚本通过 `npm run <user-defined>` 执行

自定义的脚本可以直接执行当前项目下 `node_modules` 的脚本命令，而不用通过 `npx` 命令

## 参考

- [scripts (package.json)](https://docs.npmjs.com/cli/v10/using-npm/scripts)
