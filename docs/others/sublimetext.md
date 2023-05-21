# Sublime Text

> 官网：https://www.sublimetext.com/

## 常用插件

### 1. Package Control

> 官网：https://packagecontrol.io/

### 2. Git

### 3. GitGutter

### 4. SublimeLinter

> 文档：http://www.sublimelinter.com/en/stable/

代码检查框架（本身并不包含任何 Linter，需要另行安装配置）

#### 1. JS 代码检查：**[SublimeLinter-eslint](https://packagecontrol.io/packages/SublimeLinter-eslint)**

1. 安装 [ESLint](https://eslint.org/)
   - 全局安装：`npm install -g eslint`
   - 项目内安装：`npm install eslint --save-dev`
2. 安装 [SublimeLinter-eslint](https://packagecontrol.io/packages/SublimeLinter-eslint)
3. 修改 SublimeLinter 的配置，添加 eslint：
   ```
       "linters": {
           "eslint": {
               // linter config
           }
       }
   ```
4. 在项目目录下，添加 eslint 配置文件（如`.eslintrc.js`）

##### 可能遇到的问题

1. 使用 ESlint 检查 **.vue** 文件
   1. 调整 SublimeLinter 配置，如下：
      ```
          "linters": {
              "eslint": {
                  "selector": "text.html.vue, source.js - meta.attribute-with-value"
              }
          }
      ```
   2. 安装 ESlint 插件： [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue)
      > 注意插件要跟 ESlint 安装在相同的位置，比如同为 _项目内_ 安装，否则 SublimeLinter 可能找不到插件。
   3. 修改 ESlint 配置文件，如下：
      ```
      module.exports = {
          extends: [
              // "eslint:recommended",
              "plugin:vue/essential"
          ]
      }
      ```

#### 2. CSS 代码检查：**[SublimeLinter-csslint](https://packagecontrol.io/packages/SublimeLinter-csslint)**

### 5. SFTP

1. 通过 [Package Control](https://packagecontrol.io/) 安装 [SFTP](https://packagecontrol.io/packages/SFTP)
2. 项目配置 SFTP

   1. 选择目录，右击 -> SFTP/FTP -> 点击 Map to Remote，从而新建 sftp-config.json 文件
   2. 修改 sftp-config.json 文件，填写必要的信息：

      ```
          "host": "example.com",
          "user": "username",
          "password": "password",
          //"port": "22",

          "remote_path": "/example/path/",
      ```

3. 上传文件到服务器：选择文件，右击 -> SFTP/FTP -> 点击 Upload file

### 6. DocBlockr

### 7. Markdown​Preview

> GitHub: https://github.com/facelessuser/MarkdownPreview

预览和构建 markdown 文件

#### 可能遇到的问题

1. 使用浏览器预览 markdown 文件，修改 markdown 文件后，刷新浏览器没有更新

   > Github issue: https://github.com/facelessuser/MarkdownPreview/issues/27

   **原因**：没有设置 GitHub Oauth Token  
   **解决办法**：

   1. 进入 Github 帐号设置页面
   2. 选择 Developer settings
   3. 选择 Personal access tokens
   4. 点击 Generate new token，进入 token 生成页面，填写必要的信息，并勾选 repo 选项框，点击 Generate token 确认生成，返回的页面中将会有生成的 token
   5. 打开 Sublime Text 中 Markdown​Preview 的设置页面（Preferences -> Package Settings -> Markdown Preview -> Settings）
   6. 在用户设置中填入：
      ```
          "github_oauth_token": "your github token"
      ```

2. 修改 markdown 文件后，浏览器能够自动刷新

   配合插件 **[Live​Reload](https://packagecontrol.io/packages/LiveReload)** 一起使用，能够实现修改 markdown 文件后，浏览器自动刷新并展示最新修改内容

   > https://facelessuser.github.io/MarkdownPreview/usage/#livereload

   1. 设置 Markdown​Preview 的配置，打开自动重载：
      ```
          "enable_autoreload": true
      ```
   2. 安装 [Live​Reload](https://packagecontrol.io/packages/LiveReload)
   3. 重启 Sublime Text
   4. 通过 `⌘ + ⇧ + P` 进入命令行面板，选择命令 `LiveReload: Enable/disable plug-ins`
   5. 选择 `Simple Reload with delay (400ms)`
   6. 编辑 markdown 文档，保存时将自动触发浏览器刷新
