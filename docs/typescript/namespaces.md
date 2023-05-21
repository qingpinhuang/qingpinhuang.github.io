# 命名空间

## 命名空间

命名空间创建了一个独立的作用域区间，其内部内容对外不可访问，仅 `export` 导出的内容对外可见

```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }

  const lettersRegexp = /^[A-Za-z]+$/;
  const numberRegexp = /^[0-9]+$/;

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }

  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}

// 仅可访问 export 的内容
const validator1: Validation.StringValidator = new Validation.LettersOnlyValidator();
const validator1: Validation.StringValidator = new Validation.ZipCodeValidator();
```

1. 命名空间是全局命名空间下的普通的带名字的 JavaScript 对象
2. 命名空间不能用于模块文件，只能用于全局文件
3. 命名空间可以管理组织代码，避免全局污染等，与模块相似，如果已经使用了模块管理，就不需要再使用命名空间了

## 分离到多文件

1. 可以把同一命名空间的内容放到不同的文件，其效果跟放在同一文件一样
2. 分离到多文件后，需要通过引用标签确定依赖关系：`/// <reference path="Validation.ts" />`
3. 涉及多个文件时，必须确保编译后所有的代码都被加载了
   a. 通过 `--outFile` 指定编译输出为一个文件： `tsc --outFile sample.js Test.ts`
   b. 默认编译为多个文件后，按照依赖的顺序手动引入所有的文件

```ts
// Validation.ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```

```ts
// LettersOnlyValidator.ts
/// <reference path="Validation.ts" />
namespace Validation {
  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
```

```ts
// ZipCodeValidator.ts
/// <reference path="Validation.ts" />
namespace Validation {
  const numberRegexp = /^[0-9]+$/;
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
```

```ts
// Test.ts
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />
const validator1: Validation.StringValidator = new Validation.LettersOnlyValidator();
const validator1: Validation.StringValidator = new Validation.ZipCodeValidator();
```

## 别名

使用 `import q = x.y.z` 可以创建别名，简化使用

```ts
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}

import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // 等价于 "new Shapes.Polygons.Square()"
```

## 使用其它的 JavaScript 库

使用命名空间对外部模块添加 `.d.ts` 文件声明

```ts
declare namespace D3 {
  export interface Selectors {
    select: {
      (selector: string): Selection;
      (element: EventTarget): Selection;
    };
  }

  export interface Event {
    x: number;
    y: number;
  }

  export interface Base extends Selectors {
    event: Event;
  }
}

declare var d3: D3.Base;
```
