# Mixins

**示例**

```ts
class Sprite {
  name = "";
  x = 0;
  y = 0;

  constructor(name: string) {
    this.name = name;
  }
}

// 声明类类型，用于约束工厂函数的入参必须为类
type Constructor = new (...args: any[]) => {};
// 工厂函数，返回一个扩展基类的类表达式
function Scale<TBase extends Constructor>(Base: TBase) {
  return class Scaling extends Base {
    _scale = 1;

    setScale(scale: number) {
      this._scale = scale;
    }
    get scale(): number {
      return this._scale;
    }
  };
}

// 调用工厂函数，混合 Scaling 和传入的类
const EightBitSprite = Scale(Sprite);

const flappySprite = new EightBitSprite("Bird");
flappySprite.setScale(0.8);
console.log(flappySprite.scale);
```

## 受约束的混合

```ts
// 用范型约束类声明
type GConstructor<T = {}> = new (...args: any[]) => T;

// 创建受约束的类声明
type Positionable = GConstructor<{ setPos: (x: number, y: number) => void }>;
type Spritable = GConstructor<Sprite>;
type Loggable = GConstructor<{ print: () => void }>;

// 约束传入的类为 Positionable 形式的声明结构，其必然包含有 setPos 方法，故而在 Jumpable 内可以直接调用
function Jumpable<TBase extends Positionable>(Base: TBase) {
  return class Jumpable extends Base {
    jump() {
      // Positionable 类声明中包含有 setPos 方法，可以直接调用
      this.setPos(0, 20);
    }
  };
}
```

## 替代模式

```ts
class Jumpable {
  jump() {}
}
class Duckable {
  duck() {}
}

class Sprite {
  x = 0;
  y = 0;
}

// 创建 Sprite 接口继承 Jumpable 和 Duckable，合并其声明
interface Sprite extends Jumpable, Duckable {}
// 混合（在运行时）
applyMixins(Sprite, [Jumpable, Duckable]);

let player = new Sprite();
player.jump();
console.log(player.x, player.y);

// 混合函数
function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null)
      );
    });
  });
}
```

## 限制

**装饰器与混合**

```ts
// 用装饰器实现混合
const Pausable = (target: typeof Player) => {
  return class Pausable extends target {
    shouldFreeze = false;
  };
};

@Pausable
class Player {
  x = 0;
  y = 0;
}

// 混合后，shouldFreeze 属性无法被 TypeScript 识别
const player = new Player();
player.shouldFreeze; // 会提示没有此属性

// 可以手动混合类型声明
type FreezablePlayer = Player & { shouldFreeze: boolean };
// 再用类型断言指定其类型
const playerTwo = new Player() as unknown as FreezablePlayer;
playerTwo.shouldFreeze;
```

**静态属性混合**

```ts
function base<T>() {
  class Base {
    static prop: T;
  }
  return Base;
}

function derived<T>() {
  class Derived extends base<T>() {
    static anotherProp: T;
  }
  return Derived;
}

class Spec extends derived<string>() {}

Spec.prop; // string
Spec.anotherProp; // string
```
