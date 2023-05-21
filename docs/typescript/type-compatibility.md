# 类型兼容性

结构类型系统（structural type system）：
也称为 基于属性的类型系统（property-based type system），通过类型的实际结构或者定义来判断类型的兼容性和等价性

标称类型系统（nominal type system）：
也称为 基于名称的类型系统（name-based type system），通过显式的声明或者类型的名称来判断类型的兼容性和等价性

TypeScript 是结构类型系统

```ts
interface Pet {
  name: string;
}
class Dog {
  name: string;
}
let pet: Pet = new Dog(); // 可以成立，虽然 Pet 与 Dog 没有任何关系，但它们的结构是兼容的
```

## 比较两个函数

函数的比较，需要同时考虑函数的参数和返回值，只有参数和返回值都兼容了才能认为它们的类型是兼容的

### 参数比较

1. 相同位置的参数，其类型必须是兼容的
2. 必选参数：参数多的函数可以兼容参数少的函数，反之不成立：函数调用可以忽略部分参数，所以参数变少时，可以视为传递更少的参数
3. 可选参数：源函数有额外的可选参数不算错误，目标函数的可选参数在源函数上没有对应的参数也不算错误
4. 剩余参数：剩余参数可以视为无数个可选参数

```ts
let xFunc = (a: number) => 0;
let yFunc = (b: number, c: string) => 0;

yFunc = xFunc; // 可以成立，因为函数 yFunc 调用时可以只传递一个参数，此时的调用就跟函数 xFunc 一样了，所以认为它们的类型是兼容的
xFunc = yFunc; // 不能成立，传递更多的参数来调用 xFunc 函数，此时的 xFunc 不会被认为是跟原函数等价的，故而不兼容
```

### 返回值比较

源函数的返回值类型必须是目标函数的返回值类型的子类型

```ts
let xFunc = () => ({ name: "A" });
let yFunc = () => ({ name: "B", value: 6 });

xFunc = yFunc; // 可以成立，可以理解为返回值类型 { name: string } 函数，现在改为 { name: string, value: number }，类型是兼容的
yFunc = xFunc; // 不能成立，原本返回值类型 { name: string, value: number } 变成 { name: string }，缺失了部分属性，不兼容
```

### 函数重载

对于有重载的函数，必须保证源函数的所有重载都在目标函数找到对应的签名

## 枚举

1. 枚举类型与数字类型是相互兼容的：枚举类型可以赋值给数字类型，数字类型也可以赋值给枚举类型
2. 不同的枚举类型之间是不兼容的

## 类

1. 类类型比较时，只比较实例部分的成员类型
2. 含有 `private` 和 `protected` 成员的类类型，在检查其实例是否兼容时，必须确保它们的 `private` 和 `protected` 的成员来自于同一个类声明

## 泛型

1. 泛型只会影响使用类型变量作为类型的成员
2. 在类型变量没有指定具体的类型之前，可以将它们视为 `any` 类型

```ts
interface Empty<T> {}

let x: Empty<number>;
let y: Empty<string>;

x = y; // 成立，因为类型变量并没有影响到整体的结构
```

```ts
interface NotEmpty<T> {
  data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y; // 不成立，data 的类型不同
```

```ts
let identity = function <T>(x: T): T {
  // ...
};
let reverse = function <U>(y: U): U {
  // ...
};

identity = reverse; // 成立，类型变量没有指定具体类型，直接视为 any 类型
```
