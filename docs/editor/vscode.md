# Visual Studio Code

> 官网：<https://code.visualstudio.com/>

## 常用插件

- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

## 设置

> 文档：<https://code.visualstudio.com/docs/getstarted/settings>

针对项目进行编辑器设置，其内容会保存在 `project/.vscode` 目录内，常见的有以下文件：

- `extensions.json` - 扩展插件设置，在项目打开时会推荐安装
- `settings.json` - 用户工作区设置，如：保存时格式化代码等

将配置信息提交到 `git` 仓库，其他人拉下代码后，就能同时获得相关的配置信息，从而使得编辑器的设置完全同步
