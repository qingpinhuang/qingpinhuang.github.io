# NPM 包脚本

## `scripts`

### 生命周期脚本

定义规则：

- `pre<event>`：先于 `<event>` 执行
- `<event>`
- `post<event>`：后于 `<event>` 执行

可选的 `<event>`：

- `prepare`：`preprepare`、`prepare`、`postprepare`
- `install`：`preinstall`、`install`、`postinstall`
- `publish`：`prepublish`、`publish`、`postpublish`、`prepublishOnly`
- `pack`：`prepack`、`pack`、`postpack`
- `<user-defined>`：开发者自定义的脚本

### 常用命令的生命周期

#### `npm install`

执行命令 `npm install` 的时候，会按照如下的顺序执行生命周期脚本

- `preinstall`
- `install`
- `postinstall`
- `prepublish`
- `preprepare`
- `prepare`
- `postprepare`

#### `npm publish`

执行命令 `npm publish` 的时候，会按照如下的顺序执行生命周期脚本

- `prepublishOnly`
- `prepack`
- `prepare`
- `postpack`
- `publish`
- `postpublish`

#### `npm run <user-defined>`

执行开发者自定义的脚本时，也有生命周期可以定义

- `pre<user-defined>`
- `<user-defined>`
- `post<user-defined>`

### 自定义脚本

在 `package.json` 上可以写自定义的脚本，通过 `npm run <user-defined>` 执行

自定义的脚本可以直接执行当前项目下 `node_modules` 的脚本命令，而不用通过 `npx` 命令

## 参考

- [scripts (package.json)](https://docs.npmjs.com/cli/v10/using-npm/scripts)
