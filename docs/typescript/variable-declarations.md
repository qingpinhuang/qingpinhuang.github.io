# 变量声明

## var

全局作用域、函数作用域
变量声明提升（在整个作用域内均可用）
重复声明依然只有一个

## let

全局作用域、函数作用域、块作用域
屏蔽（声明之前不可用）
同一作用域内不可以重复声明

## const

跟 `let` 相似，但 `const` 声明后不可修改

### let vs const

最小特权原则

## 解构

### 数组解构

```js
const arr = [1, 2];
const [first, second] = arr;

// 函数参数
function func([first, second]) {
  console.log(first, second);
}

// 剩余变量
const [first, ...rest] = [1, 2, 3, 4];

// 忽略元素
const [first] = [1, 2, 3, 4];
const [, second, , fourth] = [1, 2, 3, 4];
```

### 对象解构

```js
const obj = {
  a: 1,
  b: "bar",
  c: false,
};
const { a, b, c } = obj;

// 函数参数
function func({ a, b }) {
  console.log(a, b);
}

// 剩余变量
const { a, ...rest } = obj;

// 忽略属性
const { a, b } = obj;

// 属性重命名
const { a: num, b: str } = obj;

// 默认值
const { a = 6 } = obj;
```

### 展开

```js
// 展开数组
const first = [1, 2];
const second = [3, 4];
const both = [0, ...first, ...second, 5];

// 展开对象
const defaults = {
  a: 1,
  b: "bar",
};
const search = {
  b: "foo",
  c: false,
};
const both = {
  ...defaults,
  ...search,
  a: 2,
};
// 注意：对象展开，放在后面的同名属性会覆盖放在前面的
```
