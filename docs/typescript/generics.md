# 泛型

## 声明、调用

```js
function identity<T>(arg: T): T {
  return arg;
}
const output = identity < number > 666; // 明确传入类型
const output = identity(666); // 通过类型推断判断类型
```

1. 使用尖括号（<>）声明 _类型变量_：是一个变量/参数，传入的值是类型
2. 泛型指代的是任意类型，但与直接使用 `any` 并不完全等同，泛型在调用时指定类型，并在调用过程中保持一致
3. 调用泛型时，可以通过尖括号（<>）明确传入类型来指定，也可以不传入，通过 _类型推断_ 来确定

## 泛型函数

```js
function identity<T>(arg: T): T {
  return arg;
}
let vIdentity: <T>(arg: T) => T = identity;

// 使用不同的泛型参数名
let vIdentity: <U>(arg: U) => U = identity;

// 使用带有调用签名的对象字面量定义
let vIdentity: { <T>(arg: T): T } = identity;

// 泛型接口
interface GenericIdentityFn {
  <T>(arg: T): T;
}
let vIdentity: GenericIdentityFn = identity;

// 泛型接口：泛型参数作为接口参数
interface GenericIdentityFn<T> {
  (arg: T): T;
}
let vIdentity: GenericIdentityFn<number> = identity;
```

## 泛型类

```js
class GenericNumber<T> {
    zeroValue: T
    add(x: T, y: T) => T
}
let num = new GenericNumber<number>()
```

## 泛型约束

```js
interface Lengthwise {
    length: number
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(T.length)
    return arg
}
```

1. 定义了泛型约束之后，传入的类型必须符合约束条件才能成立
