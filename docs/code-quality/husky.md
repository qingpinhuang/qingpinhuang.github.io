# Husky

> 官网：<https://typicode.github.io/husky/>

支持例如 `pre-commit` 、`pre-push` 等 Git Hooks，使代码在 `commit` 或 `push` 时，能自动化 **检查提交信息**、**检查代码** 和 **运行测试** 等

## 如何开始

1. 安装 `husky`

```bash
npm install --save-dev husky
```

2. 执行 `husky init` 进行初始化

```bash
npx husky init

# init 命令执行以下动作：
# 1. 创建 .husky/ 目录下的 pre-commit 文件
# 2. 更新 package.json 下的 prepare 脚本
```

3. 编辑 Hooks 文件

```bash
# .husky/pre-commit

# test 命令定义在 package.json 中
npm run test

# 你可以写其它任何的 shell 脚本命令
# ...
```

> 了解更多 [使用](https://typicode.github.io/husky/how-to.html)

4. 测试 Hooks 是否生效

```bash
git commit -m "testing pre-commit code"
```

如果是生效的，将会执行 _.husky/pre-commit_ 中定义的脚本
