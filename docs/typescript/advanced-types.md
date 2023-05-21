# 高级类型

## 交叉类型

1. 交叉类型表示将多个类型合并为一个类型
2. 使用 `&` 合并多个类型，合并后的类型包含所有类型的特性

```ts
function extend<T, U>(target: T, source: U): T & U {
  // ...
}
```

## 联合类型

1. 联合类型表示一个值可以是几种类型之一
2. 使用 `|` 联合多个类型，联合后只能访问所有类型共有的成员

```ts
interface Bird {
  fly();
  layEggs();
}
interface Fish {
  swim();
  layEggs();
}

function getSmallPet(): Bird | Fish {
  // ...
}

let pet = getSmallPet();
pet.layEggs(); // 成功，Bird 与 Fish 的共有成员，可以直接使用
pet.swim(); // 错误，不是 Bird 与 Fish 的共有成员，不可以直接使用
```

## 类型保护和区分类型

联合类型只能使用所有类型共有的成员，那么如何才能使用某个类型独有的成员呢？
使用 _类型断言_ 来明确标示具体的类型，从而使用该类型独有的成员

```ts
let pet = getSmallPet();

if ((<Fish>pet).swim) {
  (<Fish>pet).swim();
} else {
  (<Bird>pet).fly();
}
```

### 自定义类型保护

类型断言标示具体类型需要在每一处使用的地方都进行设置，比较繁琐，可否一次判断后就记忆变量的类型？
使用 _类型保护_ 来实现，它是一些表达式，可以在运行时检查以确保在某个作用域内的类型

定义一个函数，其返回值是 _类型谓语_ （格式如：`parameterName is Type`，其中 `parameterName` 必须是当前函数签名的一个参数名）

```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (<Fish>pet).swim !== "undefined";
}

if (isFish(pet)) {
  // 此作用域内的 pet 都是 Fish 类型，可以直接使用其独有的成员
  pet.swim();
} else {
  // TypeScript 可以识别出这里是 Bird 类型，故而可以直接使用它的成员
  pet.fly();
}
```

### `typeof` 类型保护

每一次使用类型保护，都需要单独定义一个函数，这非常的繁琐也没有必要，对于原始类型，我们可以直接使用 `typeof` 直接进行类型保护

```ts
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    // 此作用域内识别为 number 类型
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    // 此作用域内识别为 string 类型
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

_`typeof` 类型保护_ 只能识别 `typeof value === 'typename'` 和 `typeof value !== 'typename'` 这两种形式的判断，其中，`typename` 必须是 `number`、`string`、`boolean`、`symbol`。当然，与其它类型比较也是可以的，只是不会被识别为类型保护

### `instanceof` 类型保护

`instanceof` 类型保护跟 `typeof` 类型保护一样，不过是用于实例对象的类型保护

```ts
interface Padder {
  getPaddingString(): string;
}
class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) {}
  getPaddingString() {
    return Array(this.numSpaces + 1).join(" ");
  }
}
class StringPadder implements Padder {
  constructor(private value: string) {}
  getPaddingString() {
    return this.value;
  }
}
function getRandomPadder() {
  return Math.random() < 0.5 ? new SpaceRepeatingPadder(4) : new StringPadder("  ");
}

let padder: Padder = getRandomPadder();
if (padder instanceof SpaceRepeatingPadder) {
  // 此作用域内细化为 SpaceRepeatingPadder 类型
}
if (padder instanceof StringPadder) {
  // 此作用域内细化为 StringPadder 类型
}
```

`instanceof` 的右侧要求是一个构造函数，TypeScript 将细化为：

1. 此构造函数的 `prototype` 属性的类型（注意其不能是 `any` 类型）
2. 构造签名所返回的类型的联合

## 可以为 null 的类型

1. `null` 和 `undefined` 默认是所有类型的子类型，它可以赋值给其它任意类型的变量
2. 设置 `--strictNullChecks` 可以关闭此默认规则，使其它类型赋值 `null` 或者 `undefined` 时提示错误
3. 此时如果期望赋值 `null` 和 `undefined`，就要用联合类型

```ts
let s = "foo";
s = null; // 错误，null 不能赋值给 string 类型的变量

let sn: string | null = "bar";
sn = null; // 可以
sn = undefined; // 错误，undefined 不能赋值给 string | null 类型的变量
```

### 可选参数和可选属性

使用了 `--strictNullChecks` 后，可选参数和可选属性会被自动添加 `| undefined`

```ts
function func(x: number, y?: number) {
  return x + (y || 0);
}
func(1, 2); // ok
func(1); // ok
func(1, undefined); // ok
func(1, null); // 错误，null 不能赋值给 number | undefined 类型的变量
```

```ts
class C {
  a: number;
  b?: number;
}

let c = new C();

c.a = 12; // ok
c.a = undefined; // 错误，undefined 不能赋值给 number 类型

c.b = 12; // ok
c.b = undefined; // ok
c.b = null; // 错误，null 不能赋值给 number | undefined 类型的变量
```

### 类型保护和类型断言

可以为 `null` 的类型是通过联合类型来实现的，那么，也就需要使用类型保护来去除 `null`

```ts
function func(sn: string | null): string {
  if (sn === null) {
    return "";
  } else {
    return sn;
  }
}

// 或者

function func(sn: string | null): string {
  return sn || "";
}
```

如果编译器不能够去除 `null` 和 `undefined`，可以使用类型断言手动去除，语法上是添加 `!` 后缀：`identifier!` 是从 `identifier` 的类型里去除了 `null` 和 `undefined`

```ts
function func(name: string | null): string {
  return name!.charAt(0);
}
```

## 类型别名

1. 类型别名不会创建新的类型，它仅仅是创建了一个新的名字引用了那个类型
2. 类型别名可以作用于任何类型
3. 类型别名也可以是泛型

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;

type Container<T> = { value: T };
type Tree<T> = {
  value: T;
  left: Tree<T>;
  right: Tree<T>;
};
type LinkedList<T> = T & { next: LinkedList<T> };
```

**类型别名 vs 接口**

1. 接口创建了一个新的类型名，它可以在其它任何地方使用；类型别名并没有创建新的类型名，并且在某些地方也无法使用，比如：错误信息
2. 类型别名不能被 `extends` 和 `implements`，也不能 `extends` 和 `implements` 其它类型

## 字面量类型

字面量类型：数字/字符串字面量类型或者枚举成员类型

### 字符串字面量类型

1. 类型的值为字符串字面量
2. 与联合类型、类型保护和类型别名配合使用，可以实现类似枚举类型的效果

```ts
type Easing = "ease-in" | "ease-out" | "ease-in-out";
let easing: Easing = "ease-in"; // 只能设置 'ease-in'、'ease-out'、'ease-in-out' 三个值之中的一个
```

### 数字字面量类型

与字符串字面量类型相似，只是值为数字字面量

### 枚举成员类型

当枚举成员都是字面量时，枚举成员就是具有类型的，而整体枚举类型则变成了类型的联合

## 可辨识联合

可辨识联合：合并字面量类型、联合类型、类型保护和类型别名创建而成

1. 具有普通的字面量类型属性 - 可辨识的特征
2. 一个类型别名包含所有相关类型的联合 - 联合
3. 该属性上的类型保护

```ts
interface Square {
  kind: "square"; // 字面量类型，作为辨识的特征
  size: number;
}
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}
interface Circle {
  kind: "circle";
  radius: number;
}

type Shape = Square | Rectangle | Circle; // 类型别名为相关类型的联合

function area(s: Shape): number {
  switch (
    s.kind // 类型保护
  ) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.width * s.height;
    case "circle":
      return Math.PI * s.radius ** 2;
  }
}
```

### 完整性检查

当可辨识类型涵盖的类型变动时，可通过以下方式使编译器提醒我们：

1. 启用 `--strictNullChecks`，并指定返回值类型
2. 使用 `never` 类型

```ts
type Shape = Square | Rectangle | Circle | Triangle; // 新增了 Triangle 类型

// 1. 指定返回值类型 number：这里少了 Triangle 类型的判断，可能返回 undefined，会提示错误
function area(s: Shape): number {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.width * s.height;
    case "circle":
      return Math.PI * s.radius ** 2;
  }
}

// 2. 使用 never 类型：在新增类型没有处理时，抛出异常
function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}
function area(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.width * s.height;
    case "circle":
      return Math.PI * s.radius ** 2;
    default:
      return assertNever(s);
  }
}
```

## 多态的 `this` 类型

用 `this` 指向类或者接口的子类型

```ts
class BasicCalculator {
  public constructor(protected value: number = 0) {}
  public currentValue(): number {
    return this.value;
  }
  public add(operand: number): this {
    this.value += operand;
    return this;
  }
  public multiply(operand: number): this {
    this.value *= operand;
    return this;
  }
  // ...
}

// 实例的方法返回 this 可以实现链式调用
new BasicCalculator(2).multiply(5).add(1).currentValue();
```

```ts
class ScientificCalculator extends BasicCalculator {
  public constructor(value = 0) {
    super(value);
  }
  public sin(): this {
    this.value = Math.sin(this.value);
    return this;
  }
  // ...
}

// 子类继承了父类后，子类的实例方法可以与父类的方法一起进行链式调用
new ScientificCalculator(2).multiply(5).sin().add(1).currentValue();
```

## 索引类型

使用索引类型，编译器就能够检查使用了动态属性名的代码。

```ts
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map((n) => o[n]);
}

interface Person {
  name: string;
  age: number;
}
let person: Person = { name: "Tom", age: 10 };
let strings: string[] = pluck(person, ["name"]);
```

索引类型查询操作符：`keyof T` 表示任意类型 `T` 的已知公共属性名的联合
索引访问操作符：`T[K]` 表示任意类型 `T` 的 `K` 属性的属性值类型的联合

```ts
let personProps: keyof Person; // 'name' | 'age'
```

```ts
function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]; // 类型为 T[K]
}
```

## 映射类型

从旧类型创建新类型的一种方式。

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
type Partial<T> = {
  [P in keyof T]?: T[P];
};
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type ReadonlyPerson = Readonly<Person>;
type PartialPerson = Partial<Person>;
type NullablePerson = Nullable<Person>;
```

`in` 表示遍历循环，会依次遍历所有的属性进行设置

```ts
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};
type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};

function proxify<T>(o: T): Proxify<T> {
  // ...
}
let proxyProps = proxify(props);
```

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type Record<K extends string, T> = {
  [P in K]: T;
};
```

### 预定义的有条件类型

- `Exclude<T, U>` -- 从 `T` 中剔除可以赋值给 `U` 的类型
- `Extract<T, U>` -- 提取 `T` 中可以赋值给 `U` 的类型
- `NonNullable<T>` -- 从 `T` 中剔除 `null` 和 `undefined`
- `ReturnType<T>` -- 获取函数返回值类型
- `InstanceType<T>` -- 获取构造函数类型的实例类型

```ts
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">; // 'b' | 'd'
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">; // 'a' | 'c'

type T02 = NonNullable<string | number | undefined>; // string | number
type T03 = NonNullable<(() => string) | string[] | null>; // (() => string) | string[]

function f1(s: string) {
  return { a: 1, b: s };
}

type T04 = ReturnType<() => string>; // string
type T05 = ReturnType<<T>() => T>; // {}
type T06 = ReturnType<typeof f1>; // { a: number, b: string }
type T07 = ReturnType<any>; // any
type T08 = ReturnType<never>; // any
type T09 = ReturnType<string>; // Error
type T10 = ReturnType<Function>; // Error

class C {
  x = 0;
  y = 0;
}

type T11 = InstanceType<typeof C>; // C
type T12 = InstanceType<any>; // any
type T13 = InstanceType<never>; // any
type T14 = InstanceType<string>; // Error
type T15 = InstanceType<Function>; // Error
```
