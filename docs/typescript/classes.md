# 类

## 声明

```js
class Animal {
  name: string;
  constructor() {}
  move() {}
}
```

## 继承

```js
class Dog extends Animal {
  constructor() {
    super();
  }
  move() {
    super.move();
  }
  bark() {}
}
```

## 公共、私有、受保护的修饰符

```js
class Animal {
    private name: string
    protected constructor () {}
    public move () {}
}
```

1. 默认为 `public`，全局可访问
2. 声明为 `private` 时，仅类内部可访问
3. 声明为 `protected` 时，仅类本身及其子类可访问
4. TypeScript 是结构性类型系统，检查两个类型是否匹配时，不会管它是从哪里来的，只要类型兼容了，那么就认为是匹配的；但是，对于声明为 `private` 和 `protected` 的类成员时，会要求该成员必须来自于同一处声明才行

## readonly 修饰符

可以将类的成员设置为只读的，那么只能在声明或者构造函数内设值

### 参数属性

```js
// 定义一个只读属性 name，并且在创建实例时直接初始化
class Animal {
    constructor (readonly name: string) {}
}
// 等价于
class Animal {
    readonly name: string
    constructor (name: string) {
        this.name = name
    }
}
```

## 存取器（get/set）

```js
class Animal {
  get name(): string {}
  set name(n: string) {}
}
```

## 静态属性（类属性）

```js
class Grid {
    static origin = { x: 0, y: 0 }
    calculateDistanceFromOrigin (point: { x: number, y: number }) {
        let xDist = (point.x - Grid.origin.x)
        let yDist = (point.y - Grid.origin.y)
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale
    }
    constructor (public scale: number) {}
}
```

## 抽象类

```js
abstract class Animal {
    abstract move () : void
    bark () : string {}
}
```

1. 作为派生类的基类使用，不能被实例化
2. 抽象方法不包含具体实现，但必须在派生类中实现
3. 声明为基类类型的变量指向派生类实例，可实现多态
