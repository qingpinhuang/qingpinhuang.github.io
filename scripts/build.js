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

const mdExtension = {
  renderer: {
    heading(text, level) {
      console.log('heading', text, level);
      return `${new Array(level).fill('#')} ${text}\n`;
    },
    list(body) {
      return body;
    },
    listitem(text) {
      return `- ${text}\n`;
    },
    link(href, title, text) {
      title = title ? ` ${title}` : '';
      return `[${text}](${href}${title})`;
    },
  },
};
marked.use(mdExtension);

const docsDir = path.resolve(__dirname, '../docs');
console.log('---', docsDir);

function parse(dirPath) {
  const list = [];
  const dirents = fs.readdirSync(dirPath, { withFileTypes: true });
  dirents.forEach((dirent) => {
    let item;
    if (dirent.isDirectory()) {
      item = parseDirectory(dirent.name, dirPath);
    } else if (dirent.isFile()) {
      item = parseFile(dirent.name, dirPath);
    }
    if (item) {
      list.push(item);
    }
  });
  console.log(list);
  return list;
}

function parseFile(fileName, parentPath) {
  parentPath = parentPath || docsDir;
  if (parentPath == docsDir || fileName == 'README.md') return;

  const filePath = `${parentPath}/${fileName}`;
  if (/^[^_.][A-Za-z0-9_-]+/.test(fileName)) {
    return {
      path: `${fileName}`,
      name: getHeading(filePath) || fileName,
      type: 'file',
    };
  }
}

function parseDirectory(dirName, parentPath) {
  parentPath = parentPath || docsDir;
  const dirPath = `${parentPath}/${dirName}`;
  return {
    path: `${dirName}/`,
    name: getHeading(path.resolve(dirPath, 'README.md')) || dirName,
    type: 'directory',
    children: parse(dirPath),
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

parse(docsDir);

// const result = marked.parser(tokens);
// console.log(result);
