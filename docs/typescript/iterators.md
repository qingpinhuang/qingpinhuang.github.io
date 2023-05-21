# 迭代器

## 可迭代性

1. 实现了 `Symbol.iterator` 属性的对象，即为可迭代的
2. 内置的可迭代类型：`Array`，`Map`，`Set`，`String`，`Int32Array`，`Uint32Array`

### `for..of` 语句

`for..of` 可以遍历可迭代的对象，调用对象上的 `Symbol.iterator` 方法。

### `for..of` vs `for..in`

1. 两者都可以遍历对象
2. `for..in` 遍历对象的键，`for..of` 遍历对象的值
3. `for..in` 可以遍历任意对象，`for..of` 仅可以遍历可迭代对象
