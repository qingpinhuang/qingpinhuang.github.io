# 函数

## 函数类型

```js
// 函数声明（命名函数）
function add(x: number, y: number): number {
  return x + y;
}
// 函数表达式（匿名函数）
const add = function (x: number, y: number): number {
  return x + y;
};
// 完整函数类型
const add: (baseValue: number, increment: number) => number = function (x: number, y: number): number {
  return x + y;
};
// 完整函数类型：推断类型
const add: (baseValue: number, increment: number) => number = function (x, y) {
  return x + y;
};
```

1. 函数类型由参数类型和返回值类型组成
2. 参数类型定义（完整函数类型场景），只要参数类型匹配了就认为有效，而不会管具体的参数名
3. 返回值类型定义（完整函数类型场景），返回值类型必须声明

## 可选参数、默认参数、剩余参数

```js
function buildName(firstName: string, lastName?: string): string {}
function buildName(firstName: string, lastName = "Smith"): string {}
function buildName(firstName: string, ...restOfName: string[]): string {}
const buildNameFunc: (firstName: string, ...restOfName: string[]) => string = buildName;
```

1. TypeScript 内的参数默认情况下都是必选参数，在调用时传入的数量不能少也不能多，必须跟声明一致
2. 可选参数，表示该参数可以不传。值得注意的是：可选参数必须放在必要参数的后面
3. 默认参数，给参数指定默认值，在不传或者传入 undefined 时应用。默认参数都是可选参数，但不限制参数的位置
4. 剩余参数，用于指定不定数量参数的场景，剩余变量是一个数组

## `this`

### `this` 参数

```js
// 显式定义 this 参数，用于指定其类型，事实上此参数是假的，并不需要在调用时传入
function func(this: void) {}
```

## 重载

```js
function add (x: number, y: number): number
function add (x: string, y: string): number
function add (x, y) {
    return Number(x) + Number(y)
}
```
