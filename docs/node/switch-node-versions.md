# brew 切换 node 版本

## 查看 brew 安装的 node

```bash
brew list | grep node
```

## 查看可安装的 node 版本

```bash
brew search node
```

## 安装指定版本的 node

```bash
brew install node@16
```

## brew 切换 node 版本

```bash
brew unlink node
brew link --overwrite --force node@16
```

## 查看当前 node 版本

```bash
node -v
```
