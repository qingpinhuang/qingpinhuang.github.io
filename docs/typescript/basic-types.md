# 基础类型

## boolean

```ts
let done: boolean = false;
```

## number

```ts
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

## string

```ts
let firstName: string = "Tang"; // 使用单引号
let lastName: string = "Ma"; // 使用双引号
let name: string = `${firstName} ${lastName}`; // 使用模板字符串
```

## Symbols

```ts
let sym1 = Symbol();
let sym2 = Symbol("key");
let sym3 = Symbol("key");

sym2 !== sym3; // true，Symbol 是唯一的

// 作为对象属性的键
let obj = {
  [sym1]: "value",
};
obj[sym1]; // 输出：value

// 作为对象的属性名和方法名
class C {
  [sym1]: "property";
  [sym2]() {
    return "function";
  }
}
```

## Array

```ts
let list1: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];
```

## Tuple（元组）

```ts
let location: [string, number] = ["order", 1];
```

## enum（枚举）

```ts
// 默认定义，从0开始
enum Color {
  Red,
  Green,
  Blue,
}

// 指定开始编号
enum Color {
  Red = 1,
  Green,
  Blue,
}

// 全部手动赋值
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4,
}

// 枚举既可以通过枚举名找到枚举值，也可以通过枚举值找到枚举名（仅数字枚举）
enum Color {
  Red,
  Green,
  Blue,
}
Color.Red == 0;
Color[0] == "Red";
```

## any

`any` 表示任意类型

```ts
let anyVar: any = 4;
anyVar = "string";
anyVar = false;
```

## void

`void` 表示没有任何类型

```ts
function func(): void {}

// void 类型的变量只能设置为 undefined 和 null
let unusable: void = undefined;
```

## null、undefined

```ts
let u: undefined = undefined;
let n: null = null;
```

默认情况下，`null` 和 `undefined` 是所有类型的子类型，即是说，可以将 `null` 和 `undefined` 赋值给任意类型的变量。
但是，当指定了 `--strictNullChecks` 之后，`null` 和 `undefined` 只能赋值给 `void` 和它们各自，此时如果想要如此赋值，可以使用 _联合类型_ ，比如对于 `string` 类型的变量可以设置类型为：`string | null | undefined`

## never

`never` 表示永不存在的值的类型，仅在以下场景中使用：

1. 总是会抛出异常或者根本不会有返回值的函数
2. 永不为真的类型保护所约束的变量

```ts
// 返回 never 的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

// 返回 never 的函数必须存在无法达到的终点
function infiniteLoop(): never {
  while (true) {}
}
```

## object

`object` 表示非原始类型，也就是除 `number`、`string`、`boolean`、`symbol`、`null`、`undefined` 之外的类型

## 类型断言

```ts
// 使用尖括号（<>）语法
let val: any = "string";
let length: number = (<string>val).length;

// 使用 as 语法
let val: any = "string";
let length: number = (val as string).length;
```
