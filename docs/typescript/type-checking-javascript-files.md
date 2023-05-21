# JavaScript 文件类型检查

1. 使用 `--checkJs` 对 `.js` 文件进行类型检查和错误提示
2. 可添加 `// @ts-nocheck` 注释忽略对某个文件的类型检查
3. 不设置 `--checkJs` 选项时，可通过 `// @ts-check` 注释选择对部分文件进行类型检查
4. 使用 `tsconfig.json` 时，JS 检查将遵照一些严格检查标记，如：`noImplicitAny`，`strictNullChecks` 等；但 JS 检查本身是比较宽松的，使用严格检查标记可能会出现一些出乎意料的问题

## 用 JSDoc 类型表示类型信息

1. `.js` 文件里，类型可以和在 `.ts` 文件里一样被推断出来
2. 同样地，当类型不能被推断时，也可以通过 JSDoc 来指定

```js
/** @type {number} */
let num;

num = 0; // 正确
num = false; // 错误，boolean值不能赋值给number类型的变量
```

## 属性的推断来自于类内的赋值语句

1. 在 `.js` 文件里，编译器从类内部的属性赋值语句来推断属性类型
2. 属性的类型是其在构造函数内赋的值的类型
3. 若属性没有在构造函数内定义或者在构造函数里是 `undefined` 或 `null`，其类型将会是所有赋的值的类型的联合类型
4. 在构造函数里定义的属性被认为是一直存在的，在其它方法内定义的属性则被认为是可选的
5. 如果一个属性在类内没有被设置过，则会被认为是未知的
6. 可以通过 JSDoc 声明属性的类型

```js
class C {
  constructor() {
    this.constructorOnly = 0;
    this.constructorUnknown = undefined;
  }
  method() {
    this.constructorOnly = false; // 错误，constructorOnly 的类型是 number
    this.constructorUnknown = "plunkbat"; // 正确，其最终类型为 string | undefined
    this.methodOnly = "ok"; // 正确，其最终类型变为 string | undefined
  }
  method2() {
    this.methodOnly = true; // 正确，其最终类型变为 string | boolean | undefined
  }
}
```

```js
class C {
  constructor() {
    /** @type {number | undefined} */
    this.prop = undefined;
    /** @type {number | undefined} */
    this.count;
  }
}

let c = new C();
c.prop = 0; // 正确
c.count = "string"; // 错误，count 的类型是 number | undefined
```

## 构造函数等同于类

ES2015 之前，JavaScript 使用构造函数代替类。编译器支持这种模式并能够识别其构造函数为 ES2015 的类。其属性类型的推断机制与类一致

```js
function C() {
  this.constructorOnly = 0;
  this.constructorUnknown = undefined;
}
C.prototype.method = function () {
  this.constructorOnly = false; // 错误，constructorOnly 的类型为 number
  this.constructorUnknown = "plunkbat"; // 正确，其最终类型为 string | undefined
};
```

## 支持 CommonJS 模块

1. 在 `.js` 文件里，TypeScript 能识别出 CommonJS 模块
2. 对 `exports` 和 `module.exports` 的赋值被识别为导出声明
3. `require` 函数调用被识别为模块导入

```js
// 等价于：import module 'fs'
const fs = require("fs");

// 等价于：export function readFile
module.exports.readFile = function (f) {
  return fs.readFileSync(f);
};
```

## 类、函数和对象字面量是命名空间

类作为命名空间

```js
class C {}
C.D = class {};
```

函数作为命名空间

```js
function Outer() {
  this.y = 2;
}
Outer.Inner = function () {
  this.yy = 2;
};
```

对象字面量作为命名空间

```js
var ns = {};
ns.C = class {};
ns.func = function () {};
```

其它方式的命名空间

```js
var ns = (function (n) {
  return n || {};
})();
ns.CONST = 1;

var assign =
  assign ||
  function () {
    // ...
  };
assign.extra = 1;
```

## 对象字面量是开放的

1. `.ts` 文件里，对象字面量初始化的同时也声明了它的类型；之后，对象字面量不能再添加新成员
2. `.js` 文件里，对象字面量的类型是开放的，它允许添加和访问原先没有定义的属性
3. 使用 JSDoc 来声明对象字面量类型的话，其类型检查规则将与 `.ts` 文件一样（不允许再添加新成员等）

```js
var obj = { a: 1 };
obj.b = 2; // 正确

/** @type {{a: number}} */
var obj = { a: 1 };
obj.b = 2; // 错误，obj 的类型中没有 b 属性
```

## null、undefined 和空数组的类型是 any 或 any[]

1. 任何用 `null`、`undefined` 初始化的变量、参数或者属性，其类型为 `any`，即使在严格 `null` 检查模式下
2. 任何用 `[]` 初始化的变量、参数或者属性，其类型为 `any[]`，即使在严格 `null` 检查模式下
3. 唯一的例外就是有多个初始化器的属性

```js
function Foo(i = null) {
  if (!i) i = 1;
  var j = undefined;
  j = 2;
  this.l = [];
}
var foo = new Foo();
foo.l.push(foo.i);
foo.l.push("end");
```

## 函数参数默认是可选的

1. `.js` 文件里的所有函数参数都是可选的
2. 允许使用比预期更少的参数调用函数
3. 不能使用比预期更多的参数调用函数
4. 使用 JSDoc 注解的函数将会按照 JSDoc 的规则检查参数类型

```js
function bar(a, b) {
  console.log(a + " " + b);
}

bar(1); // 正确，参数都是可选的，允许传入较少的参数进行调用
bar(1, 2);
bar(1, 2, 3); // 错误，不允许传入过多的参数
```

```js
/**
 * @param {string} [somebody] - Somebody's name.
 */
function sayHello(somebody) {
  if (!somebody) {
    somebody = "John Doe";
  }
  console.log("Hello " + somebody);
}

sayHello();
```

## 由 `arguments` 推断出的 var-args 参数声明

1. 如果一个函数的函数体内有对 `arguments` 的引用，那么这个函数会隐式地被认为具有一个 var-args 参数，如：`(...arg: any[]) => any`
2. 使用 JSDoc 的 var-args 语法来指定 `arguments` 的类型

```js
/** @param {...number} args */
function sum(/* numbers */) {
  var total = 0;
  for (var i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}
```

## 未指定的类型参数默认为 `any`

JavaScript 的自然语法不支持泛型，不能指定类型参数的具体类型，故而默认为 `any`

**在 extends 语句中：**
`React.Component<Props, State>` 含有类型参数 `Props` 和 `State`，但 JavaScript 不支持泛型而无法传入，故而默认为 `any`

```js
import { Component } from "react";

class MyComponent extends Component {
  render() {
    this.props.b; // 正确，this.props 的类型为 any
  }
}
```

使用 JSDoc 的 `@augments` 来明确地指定类型

```js
import { Component } from "react";

/**
 * @augments {Component<{a: number}, State>}
 */
class MyComponent extends Component {
  render() {
    this.props.b; // 错误，this.props 的类型为 {a:number}，没有 b 属性
  }
}
```

**在 JSDoc 引用中：**
JSDoc 里未指定的类型参数默认为 `any`

```js
/** @type{Array} */
var x = [];

x.push(1); // 正确
x.push("string"); // 正确, 数组支持传入任意类型的元素

/** @type{Array.<number>} */
var y = [];

y.push(1); // 正确
y.push("string"); // 错误，元素的类型只能是 number
```

**在函数调用中：**
泛型函数的调用使用 `arguments` 来推断泛型参数的具体类型；如果缺少推断源，无法推断出具体类型，则默认为 `any`

```js
var p = new Promise((resolve, reject) => {
  reject();
}); // 类型为：Promise<any>
```

## 支持的 JSDoc

- `@type`
- `@param`、`@arg`、`@argument`
- `@returns`、`@return`
- `@typedef`
- `@callback`
- `@template`
- `@class`、`@constructor`
- `@this`
- `@extends`、`@augments`
- `@enum`

### `@type`

使用 `@type` 标记并引用一个类型名称（原始类型、TypeScript 里声明的类型、JSDoc 里 `@typedef` 标记的类型等）

```js
/** @type {string} */
var s;

/** @type {Window} */
var win;

/** @type {PromiseLike<string>} */
var promisedString;

/** @type {HTMLElement} */
var elem = document.querySelector(selector);
```

指定联合类型

```js
/** @type {(string | boolean)} */
var sb;

/** @type {string | boolean} */
var sb;
```

指定数组类型

```js
/** @type {number[]} */
var ns;
/** @type {Array.<number>} */
var nds;
/** @type {Array<number>} */
var nas;
```

指定对象字面量

```js
/** @type {{ a: string, b: number }} */
var var9;
```

使用字符串和数字索引签名来指定 _map-like_ 和 _array-like_ 的对象

```js
/** @type {Object.<string, number>} */
var stringToNumber;

/** @type {Object.<number, object>} */
var arrayLike;
```

使用 TypeScript 或 Closure 语法指定函数类型；或者直接用未指定的 Function 类型

```js
/** @type {function(string, boolean): number} Closure语法 */
var sbn;
/** @type {(s: string, b: boolean) => number} Typescript语法 */
var sbn2;

/** @type {Function} */
var fn7;
```

Closure 的其它类型

```js
/** @type {*} - any类型 */
var star;
/** @type {?} - unknown类型 */
var question;
```

类型转换：在括号表达式前面使用 `@type` 标记，可以将一种类型转换成另一种类型

```js
/** @type {number | string} */
var numberOrString = Math.random() < 0.5 ? "hello" : 100;
var typeAssertedNumber = /** @type {number} */ (numberOrString);
```

可以使用导入类型从其它文件中导入声明

```js
/**
 * @param p { import('./a').Pet }
 */
function walk(p) {
  console.log(`Walking ${p.name}...`);
}
```

在类型别名中使用导入类型

```js
/**
 * @typedef Pet { import('./a').Pet }
 */

/**
 * @type {Pet}
 */
var myPet;
myPet.name;
```

用导入类型从模块中得到一个值的类型

```js
/**
 * @type {typeof import('./a').x }
 */
var x = require("./a").x;
```

### `@param`

```js
/**
 * @param {string}  p1 - 字符串类型的参数
 * @param {string=} p2 - 可选参数（Closure语法）
 * @param {string} [p3] - 可选参数（JSDoc语法）
 * @param {string} [p4='test'] - 带默认值的可选参数
 * @return {string} 返回值
 */
function stringsStringStrings(p1, p2, p3, p4) {
  // ...
}
```

```js
/**
 * @param {Object} options - 创建一个新类型：options
 * @param {string} options.prop1 options类型的字符串属性
 * @param {number} options.prop2 options类型的数字属性
 * @param {number=} options.prop3 options类型的可选数字属性
 * @param {number} [options.prop4] options类型的可选数字属性
 * @param {number} [options.prop5=42] options类型的带默认值的可选数字属性
 */
function special(options) {
  // ...
}
```

### `@returns`

```js
/**
 * @return {PromiseLike<string>}
 */
function ps() {}

/**
 * @returns {{ a: string, b: number }} - '@returns'等价于'@return'
 */
function ab() {}
```

### `@typedef`

使用 `@typedef` 声明复杂类型（对象类型、函数类型等）

```js
/**
 * @typedef {Object} SpecialType - 创建一个新类型：SpecialType
 * @property {string} prop1 - SpecialType类型的字符串属性
 * @property {number} prop2 - SpecialType类型的数字属性
 * @property {number=} prop3 - SpecialType类型的可选数字属性
 * @prop {number} [prop4] - SpecialType类型的可选数字属性
 * @prop {number} [prop5=42] - SpecialType类型的带默认值的可选数字属性
 */
/** @type {SpecialType} */
var specialTypeObject;
```

```js
/**
 * @typedef {object} SpecialType - 创建一个新类型：SpecialType
 * @property {string} prop1 - SpecialType类型的字符串属性
 * @property {number} prop2 - SpecialType类型的数字属性
 * @property {number=} prop3 - SpecialType类型的可选数字属性
 */
/** @type {SpecialType} */
var specialTypeObject;
```

```js
/** @typedef {{ prop1: string, prop2: string, prop3?: number }} SpecialType */
/** @typedef {(data: string, index?: number) => boolean} Predicate */
```

### `@callback`

使用 `@callback` 声明函数类型

```js
/**
 * @callback Predicate - 定义一个函数类型：Predicate
 * @param {string} data - 函数第一个入参
 * @param {number} [index] - 函数第二个入参
 * @returns {boolean} - 函数返回值
 */
/** @type {Predicate} */
const ok = (s) => !(s.length % 2);
```

### `@template`

使用 `@template` 声明泛型

```js
/**
 * @template T
 * @param {T} p1 - 泛型类型，注意参数与返回值的类型相同
 * @return {T}
 */
function id(x) {
  return x;
}
```

用逗号或者多个标记表示多个泛型类型

```js
/**
 * @template T,U,V
 * @template W,X
 */
```

可在泛型名称前指定类型约束

```js
/**
 * @template {string} K - K 必须是字符串类型或者字符串字面量
 * @template {{ serious(): string }} Seriousalizable - 必须有 serious 方法
 * @param {K} key
 * @param {Seriousalizable} object
 */
function seriousalize(key, object) {
  // ...
}
```

### `@constructor`

1. 默认情况下，编译器通过 `this` 来推断构造函数
2. 如果希望检查更严格，提示更友好，可以使用 `@constructor` 标记
3. 使用 `@constructor` 标记为构造函数后，不能作为普通函数直接进行调用，只能通过 `new` 调用

```js
/**
 * @constructor
 * @param {number} data
 */
function C(data) {
  this.size = 0;
  this.initialize(data); // 错误，函数的参数是 string 类型
}
/**
 * @param {string} s
 */
C.prototype.initialize = function (s) {
  this.size = s.length;
};

var c = new C(0);
var result = C(1); // C 为 @constructor 标记的构造函数，只能通过 new 来调用
```

### `@this`

1. 编译器通常可以通过上下文推断出 `this` 的类型
2. 通过 `@this` 可以明确指定 `this` 的类型

```js
/**
 * @this {HTMLElement}
 * @param {*} e
 */
function callbackForLater(e) {
  this.clientHeight = parseInt(e);
}
```

### `@extends`

1. 用于继承基类时指定基类的类型参数的类型
2. 只能作用于类；无法用于构造函数继承类的情况

```js
/**
 * @template T
 * @extends {Set<T>}
 */
class SortableSet extends Set {
  // ...
}
```

### `@enum`

1. `@enum` 标记一个成员类型确定的对象字面量，且该字面量不允许添加额外成员
2. JavaScript 的 `@enum` 与 TypeScript 的 `@enum` 不同，它更简单；而相比于 TypeScript 的枚举，`@enum` 可以是任意类型

```js
/** @enum {number} */
const JSDocState = {
  BeginningOfLine: 0,
  SawAsterisk: 1,
  SavingComments: 2,
};

/** @enum {function(number): number} */
const Math = {
  add1: (n) => n + 1,
  id: (n) => -n,
  sub1: (n) => n - 1,
};
```
