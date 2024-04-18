# 严格模式

```js
{
  ...
  "compilerOptions": {
    "strict": true,
    ...
  },
  ...
}

// 等价于

{
  ...
  "compilerOptions": {
    "alwaysStrict": true, // 所有文件按 ES 严格模式解析，并添加 "use strict" 语句
    "noImplicitAny": true, // 不允许任何隐式的 any 类型
    "noImplicitThis": true, // 不允许隐式推断为 any 类型的 this
    "strictBindCallApply": true, // bind、call、apply 等方法调用时，参数必须符合真实方法的声明
    "strictNullChecks": true, // 校验变量可能为 null、undefined 等空值的情况
    "strictFunctionTypes": true, // 严格检查函数的类型声明，包含：入参、返回值
    "strictPropertyInitialization": true, // 声明为非 undefined 的类实例属性必须初始化
    "useUnknownInCatchVariables": true, // TypeScript 4.0 起支持，将 catch 语句的传入参数转化为 unknown 类型
    ...
  }
  ...
}
```

## 参考

- [tsconfig strict](https://www.typescriptlang.org/tsconfig#strict)
