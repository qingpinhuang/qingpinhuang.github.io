# 装饰器

通过配置 `experimentalDecorators` 启用装饰器，具体设置如下：

**命令行：**

```bash
tsc --target ES5 --experimentalDecorators
```

**tsconfig.json：**

```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```

## 装饰器

1. _装饰器_ 是一种特殊的声明，它能够被附加到 _类声明_、_方法_、_访问器_、_属性_ 或者 _参数_ 上
2. 装饰器使用 `@expression` 表示，`expression` 求值后必须为一个函数，该函数会在运行时被调用，被装饰的声明信息则作为参数传入

```ts
// 声明一个装饰器 @sealed
function sealed(target) {
  // ...
}
```

## 装饰器工厂

_装饰器工厂_ 是一个简单的函数，其返回值是一个装饰器函数

```ts
function color(value: string) {
  // 装饰器工厂，返回一个装饰器函数
  return function (target) {
    // 装饰器
    // ...
  };
}
```

## 装饰器组合

1. 多个装饰器可以应用在同一个声明上
2. 求值方式跟 [复合函数](https://en.wikipedia.org/wiki/Function_composition) 相似：组合函数 _f_ 和 _g_，则 _(f ∘ g)(x)_ 等价于 _f(g(x))_

```ts
// 书写在同一行
@f @g x

// 书写成多行
@f
@g
x
```

在 TypeScript，多个装饰器应用在同一个声明时，其操作顺序如下：

1. 由上至下依次对装饰器表达式求值
2. 求值结果作为函数从下往上依次调用

```ts
function first() {
  console.log("first(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): called");
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): called");
  };
}

class ExampleClass {
  @first()
  @second()
  method() {}
}
```

输出如下：

```
first(): factory evaluated
second(): factory evaluated
second(): called
first(): called
```

## 装饰器求值

类中不同声明上的装饰器按以下顺序应用：

1. 参数装饰器，方法装饰器，访问器装饰器，属性装饰器依次应用到实例成员
2. 参数装饰器，方法装饰器，访问器装饰器，属性装饰器依次应用到静态成员
3. 参数装饰器应用到构造器
4. 类装饰器应用到类

## 类装饰器

1. 类装饰器声明在类声明之前（紧靠着类声明）
2. 类装饰器应用于类的构造函数，可以监听、修改或者替换类的定义
3. 类装饰器不能用于声明文件（`.d.ts` 文件），或者其它任何的外部上下文（如：`declare` 类）
4. 类装饰器表达式会在运行时作为函数被调用，类的构造函数则作为其唯一参数
5. 如果类装饰器返回一个值，它将会用提供的构造函数替换类的声明
   > 类装饰器返回一个新的构造函数时，注意要管理好原来的原型链，因为运行时的装饰器调用逻辑是不会处理这些的

```ts
@sealed
class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
```

重写类构造器：

```ts
function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    reportingURL = "http://www...";
  };
}

@reportableClassDecorator
class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

const bug = new BugReport("Needs dark mode");
console.log(bug.title); // 输出：Needs dark mode
console.log(bug.type); // 输出：report

// 装饰器不会修改TypeScript的类型声明，这里新添加的成员是无法识别的
bug.reportingURL; // 无法识别新添加的属性reportingURL，TypeScript会提示错误
// 可以通过声明合并扩展类型声明，补充新的成员声明
```

## 方法装饰器

1. 方法装饰器声明在方法声明之前（紧靠着方法声明）
2. 方法装饰器应用于方法的属性描述符（Property Descriptor），可以监听、修改或者替换方法的定义
3. 方法装饰器不能用于声明文件（`.d.ts` 文件），重载，或者其它任何的外部上下文（如：`declare` 类）
4. 方法装饰器表达式会在运行时作为函数被调用，并传入以下三个参数：
   1. 对于静态成员，传入类构造函数；对于实例成员，传入类的原型对象
   2. 成员的名字
   3. 成员的属性描述符（Property Descriptor）
5. 如果方法装饰器返回一个值，它将作为方法的属性描述符使用

```ts
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}

function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}
```

## 访问器装饰器

1. 访问器装饰器声明在访问器声明之前（紧靠着访问器声明）
2. 访问器装饰器应用于访问器的属性描述符（Property Descriptor），可以监听、修改或者替换访问器的定义
3. 访问器装饰器不能用于声明文件（`.d.ts` 文件），或者其它任何的外部上下文（如：`declare` 类）
4. 访问器装饰器表达式会在运行时作为函数被调用，并传入以下三个参数：
   1. 对于静态成员，传入类构造函数；对于实例成员，传入类的原型对象
   2. 成员的名字
   3. 成员的属性描述符（Property Descriptor）
5. 如果访问器装饰器返回一个值，它将作为成员的属性描述符使用
   > TypeScript 不允许同时装饰一个成员的 `get` 和 `set`，因为装饰器是作用于属性描述符的，它包含了 `get` 和 `set`。我们应该将成员的所有访问器装饰器都写在文档顺序的第一个成员访问器上。

```ts
class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() {
    return this._x;
  }

  @configurable(false)
  get y() {
    return this._y;
  }
}

function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}
```

## 属性装饰器

1. 属性装饰器声明在属性声明之前（紧靠着属性声明）
2. 属性装饰器不能用于声明文件（`.d.ts` 文件），或者其它任何的外部上下文（如：`declare` 类）
3. 属性装饰器表达式会在运行时作为函数被调用，并传入以下两个参数： 1. 对于静态成员，传入类构造函数；对于实例成员，传入类的原型对象 2. 成员的名字
   > 参数中没有包含属性描述符，这与 TypeScript 如何初始化属性装饰器有关。TypeScript 没法在定义原型成员时描述实例属性，并且无法监听和修改属性的初始化，其返回值也会被忽略。因此，属性装饰器只能用来检查特定名字的属性是否声明了

```ts
import "reflect-metadata";
const formatMetadataKey = Symbol("format");

function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}

class Greeter {
  @format("Hello, %s")
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    let formatString = getFormat(this, "greeting");
    return formatString.replace("%s", this.greeting);
  }
}
```

## 参数装饰器

1. 参数装饰器声明在参数声明之前（紧靠着参数声明）
2. 参数装饰器应用于类构造函数或者函数声明
3. 参数装饰器不能用于声明文件（`.d.ts` 文件），重载，或者其它任何的外部上下文（如：`declare` 类）
4. 参数装饰器表达式会在运行时作为函数被调用，并传入以下三个参数：
   1. 对于静态成员，传入类构造函数；对于实例成员，传入类的原型对象
   2. 成员的名字
   3. 参数在函数的参数列表中的索引
5. 参数装饰器的返回值会被忽略
   > 参数装饰器只能用来检查参数是否传入

```ts
import "reflect-metadata";
const requiredMetadataKey = Symbol("required");

function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  let method = descriptor.value!;

  descriptor.value = function () {
    let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
    if (requiredParameters) {
      for (let parameterIndex of requiredParameters) {
        if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
          throw new Error("Missing required argument.");
        }
      }
    }
    return method.apply(this, arguments);
  };
}

class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }

  @validate
  print(@required verbose: boolean) {
    if (verbose) {
      return `type: ${this.type}\ntitle: ${this.title}`;
    } else {
      return this.title;
    }
  }
}
```

## 元数据（Metadata）

_metadata API_ 现阶段依然是实验性功能，可以通过引入 _[reflect-metadata](https://github.com/rbuckton/reflect-metadata)_ 库支持

```bash
npm i reflect-metadata --save
```

TypeScript 支持为带有装饰器的声明生成元数据，通过在命令行或 `tsconfig.json` 中设置 `emitDecoratorMetadata` 启用此功能

**命令行**

```bash
tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata
```

**tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

应用示例：

```ts
import "reflect-metadata";

class Point {
  constructor(public x: number, public y: number) {}
}

class Line {
  private _start: Point;
  private _end: Point;

  @validate
  set start(value: Point) {
    this._start = value;
  }
  get start() {
    return this._start;
  }

  @validate
  set end(value: Point) {
    this._end = value;
  }
  get end() {
    return this._end;
  }
}

function validate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
  let set = descriptor.set!;

  descriptor.set = function (value: T) {
    let type = Reflect.getMetadata("design:type", target, propertyKey);
    if (!(value instanceof type)) {
      throw new TypeError(`Invalid type, got ${typeof value} not ${type.name}.`);
    }
    set.call(this, value);
  };
}

const line = new Line();
line.start = new Point(0, 0);
```
