# 接口

## 声明

```js
interface Name {
    last: string
    first: string
}
```

## 可选属性

```js
interface Name {
    last?: string
    first:? string
}
```

## 只读属性

```js
interface Name {
    readonly last: string
    readonly first: string
}
```

## 额外属性检查

1. 仅针对字面量对象
2. 使用断言适配检查（相当于强制类型转化）
3. 使用字符串索引适配检查
   ```js
   interface Name {
       readonly last: string
       readonly first: string
       [propName: string]: any
   }
   ```
4. 使用变量存储后绕过检查

## 函数类型

```js
interface Func {
  (arg1: number, arg2: string): void;
}
```

## 可索引类型

```js
interface StringArray {
    [index: number]: string
    readonly [name: string]: string
}
```

## 类类型

```js
interface ClassInterface {
    prop: string
    func(args: Array<string>): void
}
class Demo implements ClassInterface {
    prop: string
    func(args: Array<string>): void {}
}
```

1. 接口只检查公有部分的属性和方法，不检查私有部分的属性和方法
2. 接口只检查实例部分的属性和方法，不检查静态部分的属性和方法

### 静态部分

```js
interface StaticInterface {
    new (arg: any): ClassInterface
}
interface ClassInterface {
    prop: string
    func(args: Array<string>): void
}
function factory(ctor: StaticInterface, arg: any): ClassInterface {
    return new ctor(arg)
}
```

## 继承接口

接口可以继承另外的接口，一个接口可以继承多个接口

```js
interface Shape {
  color: string;
}
interface Stroke {
  strokeWidth: number;
}
interface Square extends Shape, Stroke {
  sideLength: number;
}
```

## 混合类型

```js
interface Counter {
    (start: number): string
    interval: number
    reset(): void
}
```

以上声明的接口，既是函数类型，也是对象类型，可混合使用

## 接口继承类

1. 接口继承类，相当于接口声明了类的所有属性和方法，但没有提供具体实现
2. 如果类含有私有和保护的属性和方法，那么该接口只能被类和其子类实现
