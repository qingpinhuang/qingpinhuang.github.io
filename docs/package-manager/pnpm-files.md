# pnpm 文件存储

pnpm 采用 **符号链接 + 硬链接** 的方式组织存储 NPM 包，使得不同的项目间能共享相同的包文件，从而节省了磁盘空间

## 符号链接

pnpm 通过符号链接组织项目的 node_modules 目录，示例如下：

```bash
# 执行 pnpm install docsify-cli
# 则 node_modules 目录结构如下：

node_modules
  ├─ .bin
  ├─ .pnpm
  │  ├─ docsify@4.13.1
  │  │  └─ node_modules
  │  │     └─ docsify -> <store>/docsify # 真实位置（与全局共享）
  │  ├─ <name>@<version>
  │  │  └─ node_modules
  │  │     ├─ <name> -> <store>/<name> # 真实位置（与全局共享），如果有依赖的话，将在同级目录陈列
  │  │     └─ ... # <name> 的依赖包，符号链接
  │  └─ docsify-cli@4.4.4
  │     └─ node_modules
  │        ├─ docsify-cli -> <store>/docsify-cli # 真实位置（与全局共享），其依赖在同级目录下，如：docsify
  │        ├─ docsify -> .pnpm/docsify@4.13.1/node_modules/docsify # docsify-cli 依赖包，符号链接
  │        └─ <name> -> .pnpm/<name>@<version>/node_modules/<name> # docsify-cli 其它依赖包，符号链接
  ├─ docsify-cli -> .pnpm/docsify-cli@4.4.4/node_modules/docsify-cli # 符号链接
  └─ .modules.yaml
```

可以看到：

1. node_modules 仅陈列项目安装的包，而没有平铺其依赖

   > 这里只安装了 docsify-cli，那么 node_modules 下也仅有 docsify-cli，而没有其它的依赖包

2. node_modules 下陈列的安装包都以符号链接的方式链接到 .pnpm 目录下

   > 真实位置是：.pnpm/\<name\>@\<version\>/node_modules/\<name\>，  
   > 对示例来说，docsify-cli 的真实位置是：.pnpm/docsify-cli@4.4.4/node_modules/docsify-cli

3. 如果项目安装的包有其它的依赖包，其依赖包将会：

   1. 直接平铺在项目安装包真实位置的同级目录下，但要注意的是，这里陈列的仅仅是符号链接文件
   2. 其真实位置与项目安装包的位置相同，也是在 .pnpm/\<name\>@\<version\>/node_modules/\<name\>

   > 如上示例，项目安装的 docsify-cli 有自己的依赖包，如：docsify 等，这些包会直接陈列在 .pnpm/docsify-cli@4.4.4/node_modules/ 目录下，与 docsify-cli 同级；但这些包只是符号链接文件，其真实位置与 docsify-cli 一样，在 .pnpm/\<name\>@\<version\>/node_modules/\<name\> ，具体如： docsify 的是 .pnpm/docsify@4.13.1/node_modules/docsify

4. 依此类推，项目安装包的依赖包的所有依赖也按照第 3 点的方式进行组织，最终构成 pnpm 的依赖结构

更多内容可查看：

1. [平铺的结构不是 node_modules 的唯一实现方式](https://pnpm.io/zh/blog/2020/05/27/flat-node-modules-is-not-the-only-way)
2. [基于符号链接的 node_modules 结构](https://pnpm.io/zh/symlinked-node-modules-structure)

## 硬链接

硬链接是实现跨项目共享文件的关键，需确保 pnpm 存储文件时采用了硬链接的方式，各个项目的包文件都指向全局存储的文件

```bash
# 依赖包的最终真实位置通过硬链接的方式指向全局 <store> ，使得各个不同的项目之间能共享相同的包文件

node_modules
  ├─ .bin
  ├─ .pnpm
  │  ├─ <name>@<version>
  │  │  └─ node_modules
  │  │     ├─ <name> -> <store>/<name> # 真实位置（与全局共享），如果有依赖的话，将在同级目录陈列
  │  │     └─ ... # <name> 的依赖包，符号链接
  │  └─ docsify-cli@4.4.4
  │     └─ node_modules
  │        ├─ docsify-cli -> <store>/docsify-cli # 真实位置（与全局共享），其依赖在同级目录下，如：docsify
  │        └─ <name> -> .pnpm/<name>@<version>/node_modules/<name> # docsify-cli 其它依赖包，符号链接
  ├─ docsify-cli -> .pnpm/docsify-cli@4.4.4/node_modules/docsify-cli # 符号链接
  └─ .modules.yaml
```

### 查看不同项目内相同包的文件是否为同一物理文件

检查文件的 `inode`，相同的为同一物理文件，不同则不是同一物理文件

```bash
# 可通过如下命令查看文件的 inode
ls -i
```

### 查看存储路径

```bash
# 输入命令：
pnpm store path

# 输出（在 MacOS 上）：
/Users/用户名/Library/pnpm/store/v10 # 新版本（v6+）默认
/Users/用户名/.pnpm-store # 旧版本（v5及以前）默认
# 或者自定义路径
```

### 查看 pnpm 配置

```bash
# 输入命令：
pnpm config list

# 输出（需包含）：
package-import-method=hardlink
```

### 重置 pnpm 配置

```bash
pnpm config delete store-dir # 删除自定义存储路径
pnpm config set package-import-method hardlink # 确保使用硬链接
```
