# 类型推断

什么时候会发生类型推断：

1. 变量和成员初始化
2. 参数设置默认值
3. 明确函数返回值

## 最佳通用类型

多个表达式的场景，会依据多个表达式的类型推断出最佳通用类型

计算通用类型的算法，会考虑所有的候选类型，并给出一个兼容所有候选类型的类型

```ts
// 候选类型为：number、null，推断出最佳类型：number
let x = [0, 1, null];
```

如果候选类型中没有合适的通用类型，那么将推断为所有候选类型的联合类型，此场景下最好是明确指定一个合适的类型

```ts
// 没有合适的通用类型，推断结果为：(Rhino | Elephant | Snake)[]
let zoo = [new Rhino(), new Elephant(), new Snake()];

// 最好是明确指定合适的通用类型
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
```

## 上下文类型

按上下文归类：发生在表达式的类型与所处的位置相关时

1. 函数的参数
2. 赋值表达式的右边
3. 类型断言
4. 对象成员
5. 数组字面量
6. 返回值语句

```ts
// 依据 window.onmousedown 推断右边函数表达式的类型
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button);
};
```
