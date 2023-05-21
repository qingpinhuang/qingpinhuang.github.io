# 声明合并

编译器会对同一个名字的多个独立声明合并为单一声明，合并后的声明同时拥有原先所有声明的特性

## 基础概念

TypeScript 的声明会创建以下三种实体：

1. 命名空间：新建一个命名空间，包含了用“.”符号来访问时使用的名字
2. 类型：创建一个类型并绑定到给定的名字上
3. 值：创建一个在 JavaScript 输出中可以看到的值

| Declaration Type | Namespace | Type | Value |
| :--------------- | :-------: | :--: | :---: |
| Namespace        |     x     |      |   x   |
| Class            |           |  x   |   x   |
| Enum             |           |  x   |   x   |
| Interface        |           |  x   |       |
| Type Alias       |           |  x   |       |
| Function         |           |      |   x   |
| Variable         |           |      |   x   |

## 合并接口

```ts
interface Box {
  height: number;
  width: number;
}
interface Box {
  scale: number;
}

// 声明合并后 Box 具有所有的成员
let box: Box = { height: 5, width: 6, scale: 10 };
```

1. 多个接口的合并，实际上就是把多个接口的成员合并到一个同名的接口里
2. 非函数成员：其声明必须是唯一的。如果不唯一，那么声明的类型必须是相同的；否则，编译报错
3. 函数成员：同名的函数声明被当成一个重载。默认情况下，后声明的优先级更高

```ts
interface Cloner {
  clone(animal: Animal): Animal;
}
interface Cloner {
  clone(animal: Sheep): Sheep;
}
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}

// 合并后的结果是：
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}
```

1. 接口内的函数声明顺序不变，后声明的接口优先级高于先声明的接口
2. 例外：如果某个函数声明中的参数类型是 _单一字符串字面量_，那么它将会被提到重载列表的顶端

```ts
interface Document {
  createElement(tagName: any): Element;
}
interface Document {
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
}
interface Document {
  createElement(tagName: string): HTMLElement;
  createElement(tagName: "canvas"): HTMLCanvasElement;
}

// 合并后的结果是：
interface Document {
  createElement(tagName: "canvas"): HTMLCanvasElement;
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
  createElement(tagName: string): HTMLElement;
  createElement(tagName: any): Element;
}
```

## 合并命名空间

```ts
namespace Animals {
  export class Zebra {}
}
namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }
  export class Dog {}
}

// 合并后的结果是：
namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }

  export class Zebra {}
  export class Dog {}
}
```

1. 命名空间内导出的类型声明会合并到一起，形成一个含有所有类型声明的命名空间
2. 命名空间内的导出值，会合并到最先声明的命名空间中
3. 对于命名空间内的非导出成员，不同的命名空间之间是不能相互访问的

```ts
namespace Animal {
  let haveMuscles = true;
  export function animalsHaveMuscles() {
    return haveMuscles;
  }
}
namespace Animal {
  export function doAnimalsHaveMuscles() {
    return haveMuscles; // 错误，此命名空间内没有定义 haveMuscles 变量，而其同名命名空间内定义的变量没有导出，此处无法访问
  }
}
```

## 命名空间与类、函数、枚举类型合并

命名空间可以与其它类型的声明进行合并，只要命名空间的定义符合将要合并类型的定义

**合并命名空间和类**
扩展类的静态属性

```ts
class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export class AlbumLabel {}
}
```

**合并命名空间和函数**
扩展函数的属性

```ts
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}
namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}
```

**合并命名空间和枚举**
扩展枚举的属性

```ts
enum Color {
  red = 1,
  green = 2,
  blue = 4,
}
namespace Color {
  export function mixColor(colorName: string) {
    if (colorName == "yellow") {
      return Color.red + Color.green;
    } else if (colorName == "white") {
      return Color.red + Color.green + Color.blue;
    } else if (colorName == "magenta") {
      return Color.red + Color.blue;
    } else if (colorName == "cyan") {
      return Color.green + Color.blue;
    }
  }
}
```

## 非法的合并

1. 并不是所有的类型之间都能相互合并
2. 类不能与其它类或者变量合并

## 模块扩展

```ts
// observable.js
export class Observable<T> {
  // ...
}
```

```ts
// map.js
import { Observable } from "./observable";
Observable.prototype.map = function (f) {
  // ...
};
```

1. 在 `prototype` 上添加新成员实现模块的扩展
2. 默认情况下，新添加的成员是无法被 TypeScript 编译器识别的，需补充声明

```ts
// map.ts
import { Observable } from "./observable";
declare module "./observable" {
  interface Observable<T> {
    map<U>(f: (x: T) => U): Observable<U>;
  }
}
Observable.prototype.map = function (f) {
  // ...
};
```

**全局扩展**
在模块内添加声明到全局作用域中

```ts
// observable.ts
export class Observable<T> {
  // ...
}
declare global {
  interface Array<T> {
    toObservable(): Observable<T>;
  }
}
Array.prototype.toObservable = function () {
  // ...
};
```
