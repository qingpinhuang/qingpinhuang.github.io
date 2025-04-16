# lint-staged

> 仓库：<https://github.com/lint-staged/lint-staged>

对已暂存的文件执行预定的任务，如：formatters、linters

## 如何开始

1. 安装 `lint-staged`

```bash
npm install --save-dev lint-staged
```

2. 安装 formatters 或 linters，如：ESlint、Prettier

```bash
npm install --save-dev eslint
```

3. 配置 `lint-staged`

**package.json**:

```json
{
  "lint-staged": {
    "*": "your-cmd"
  }
}
```

**.lintstagedrc**:

```json
{
  "*": "your-cmd"
}
```

> 了解更多 [配置](https://github.com/lint-staged/lint-staged#configuration)

4. 执行 `lint-staged`

```bash
npx lint-staged
```

## lint-staged + husky

将 `lint-staged` 的命令添加到 _.husky/pre-commit_ 中

```bash
# .husky/pre-commit

npx lint-staged
```
