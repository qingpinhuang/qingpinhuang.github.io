# 内存管理

## 垃圾回收

垃圾回收算法主要依赖于引用的概念（也就是说只有引用类型的变量才会有垃圾回收问题，导致内存泄漏）。

### 引用计数垃圾收集

> IE6、7 等早期浏览器使用引用计数垃圾收集算法处理 DOM 对象的内存回收

将"对象是否不再需要"简化定义为"对象是否还有其它对象引用着"

每个对象都有一个被引用的计数器，记录着该对象被多少个其它对象引用着，当没有对象引用时，垃圾回收器将会回收它。

#### 问题

循环引用造成对象不可回收，导致内存泄漏。

### 标记-清除算法

> 目前主流的垃圾回收算法，避免了引用计数算法中循环引用导致的内存泄漏问题

将"对象是否不再需要"简化定义为"对象是否不可获得"

假定一个根对象（全局对象），定期地从根对象开始查找所有其它的对象，从而区分出可以从根对象获得的对象和不可以获得的对象，其中，不可以获得的对象将会被垃圾回收器标记清除。

## 内存泄漏

内存里不能被回收也不能被利用的空间即为内存泄漏。

### 形成条件

1. 采用引用计数垃圾收集算法进行内存回收
2. 代码中存在循环引用

### 示例

> 由于引用计数垃圾收集算法只是在早期的 IE6、7 等浏览器的 DOM 对象内存管理中使用，故而出现内存泄漏的情况一般也与 DOM 对象的操作相关

基于对象属性直接赋值造成的循环引用

```js
var div;
window.onload = function () {
  div = document.getElementById("div");
  div.circular = div; // 属性赋值为当前对象，直接造成循环引用
  div.lotsOfData = new Array(1000).join("*");
};
```

基于闭包作用域链引发的循环引用

```js
window.onload = function () {
  var div = document.getElementById("div");
  div.onclick = function () {
    // 函数绑定到div.onclick后形成闭包，将保留所在的上下文环境（即作用域链），
    // 检查发现，当前作用域的父作用域中含有对div DOM对象的引用，间接造成了循环引用
  };
  div.lotsOfData = new Array(1000).join("*");
};
```

### 解决办法

> 解决内存泄漏的基本思路都是解决对象的循环引用

将对象的值设为`null`

```js
window.onload = function () {
  var div = document.getElementById("div");
  div.onclick = function () {
    // ...
  };
  div.lotsOfData = new Array(1000).join("*");
  div = null; // 设值为null，避免循环引用
};
```

添加额外的作用域

```js
window.onload = function () {
  function eventHandle() {
    // 作用域链中不存在div DOM对象，无法构成循环引用
  }
  // 额外自执行函数，完成后释放内存
  (function () {
    var div = document.getElementById("div");
    div.onclick = eventHandle;
    div.lotsOfData = new Array(1000).join("*");
  })();
};
```

将函数定义在外部作用域

```js
window.onload = function () {
  var div = document.getElementById("div");
  div.onclick = eventHandle;
  div.lotsOfData = new Array(1000).join("*");
};

function eventHandle() {
  // 定义在外部作用域，使得作用域链中不存在div DOM对象，避免循环引用
}
```

## 参考

- [内存管理](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management)
- [Memory leak patterns in JavaScript](https://www.ibm.com/developerworks/web/library/wa-memleak/)
