/**
 * 自动生成目录文件：
 * 1. docs/_sidebar.md
 * 2. docs/{dir}/_sidebar.md
 * 3. docs/{dir}/README.md
 *
 * 通过对比更新目录：
 * 1. 新增文件，则在最后面添加新目录项
 * 2. 删除文件，则去掉相对应的目录项
 */

const fs = require('fs');
const path = require('path');
const marked = require('marked');

// 生成 markdown 文件（marked 默认生成 html，这里通过自定义扩展实现生成 markdown 文件）
// const mdExtension = {
//   renderer: {
//     heading(token) {
//       // console.log('renderer.heading', token);
//       return `${new Array(token.depth).fill('#')} ${token.text}\n`;
//     },
//     list(token) {
//       // console.log('renderer.list', token);
//       return token.items.map((token) => this.listitem(token)).join('');
//     },
//     listitem(token) {
//       // console.log('renderer.listitem', token);
//       return `- ${token.text}\n`;
//     },
//   },
//   hooks: {
//     processAllTokens(tokens) {
//       console.log('hooks.processAllTokens', tokens);
//       return tokens;
//     },
//   },
//   walkTokens(token) {
//     console.log('walkTokens', token);
//   },
// };
// marked.use(mdExtension);

const docsDir = path.resolve(__dirname, '../docs');

function parse(dirPath) {
  const items = [];
  const dirent = fs.readdirSync(dirPath, { withFileTypes: true });
  dirent.forEach((_dirent) => {
    let item;
    if (_dirent.isDirectory()) {
      item = parseDirectory(_dirent.name, dirPath);
    } else if (_dirent.isFile()) {
      item = parseFile(_dirent.name, dirPath);
    }
    if (item) {
      items.push(item);
    }
  });
  return dirPath === docsDir
    ? {
        path: dirPath,
        link: '',
        name: dirPath.split('/').pop(),
        type: 'directory',
        items,
      }
    : items;
}

function parseFile(fileName, parentPath) {
  parentPath = parentPath || docsDir;
  if (parentPath == docsDir || fileName == 'README.md') return;

  const filePath = `${parentPath}/${fileName}`;
  if (/^[^_.][A-Za-z0-9_-]+/.test(fileName)) {
    return {
      path: filePath,
      link: fileName,
      name: getHeading(filePath) || fileName,
      type: 'file',
    };
  }
}

function parseDirectory(dirName, parentPath) {
  parentPath = parentPath || docsDir;
  const dirPath = `${parentPath}/${dirName}`;
  return {
    path: dirPath,
    link: `${dirName}/`,
    name: getHeading(path.resolve(dirPath, 'README.md')) || dirName,
    type: 'directory',
    items: parse(dirPath),
  };
}

function getHeading(filePath) {
  let name = '';
  try {
    const file = fs.readFileSync(filePath, 'utf-8');
    const tokens = marked.lexer(file);
    const token = tokens.find((token) => token.type === 'heading' && token.depth === 1);
    name = token?.text;
  } catch (err) {
    // console.error(err);
  }
  return name;
}

function getDirFromSidebar(json) {
  let tokens = [];
  try {
    const sidebarPath = path.resolve(json.path, '_sidebar.md');
    if (fs.existsSync(sidebarPath)) {
      const file = fs.readFileSync(sidebarPath, 'utf-8');
      tokens = marked.lexer(file);
      // _sidebar.md 的内容结构固定，这里按照固定的方式取值，取不到视为没有内容，将完全重新生成
      tokens = json.path === docsDir ? tokens[0]?.items : tokens[0]?.items?.[1]?.tokens?.[1]?.items;
    }
  } catch (error) {
    // console.error(err);
  }
  return tokens;
}

function updateDir(tokens, items) {
  const _items = [];

  if (Array.isArray(items)) {
    (tokens || []).forEach((token) => {
      const index = items.findIndex((item) => `[${item.name}](${item.link})` === token.text);
      if (index === -1) return;

      _items.push(...items.splice(index, 1));
    });

    _items.push(...items);
  }

  return _items;
}

function writeSidebar(json) {
  let items = [];

  if (json.path === docsDir) {
    items = [
      `- [Home](/ 'Fool')`,
      ...json.items.map((item) => `- [${item.name}](${item.link})`),
      '', // 添加一个空行
    ];
  } else {
    items = [
      `- [< Back](/ 'Fool')`,
      `- [${json.name}](./)`,
      ...json.items.map((item) => `  - [${item.name}](${item.link})`),
      '', // 添加一个空行
    ];
  }

  const content = items.join('\n');
  const filePath = path.resolve(json.path, '_sidebar.md');
  try {
    fs.writeFileSync(filePath, content);
  } catch (err) {
    // console.error(err);
  }
}

function writeReadme(json) {
  if (json.path === docsDir) {
    return;
  }

  const items = [
    `# ${json.name}`,
    '',
    ...json.items.map((item) => `- [${item.name}](${item.link})`),
    '', // 添加一个空行
  ];

  const content = items.join('\n');
  const filePath = path.resolve(json.path, 'README.md');
  try {
    fs.writeFileSync(filePath, content);
  } catch (err) {
    // console.error(err);
  }
}

function update(json) {
  if (json.type !== 'directory') return;

  const tokens = getDirFromSidebar(json);
  json.items = updateDir(tokens, json.items);

  writeReadme(json);
  writeSidebar(json);

  // 递归
  json.items.forEach((item) => {
    if (item.type === 'directory') {
      update(item);
    }
  });
}

function start() {
  const json = parse(docsDir);
  update(json);
}

start();
