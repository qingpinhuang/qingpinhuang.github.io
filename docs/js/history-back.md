# 浏览器历史回退

**一般情况下，浏览器回退是会刷新返回的页面的。**

这在大多数的时候是合理的，也是我们所期望的。但凡事总有例外，有时我们也会希望返回的页面能够保持之前的页面状态，以便于继续之前的操作。比如：我们正在浏览搜索的结果列表，并滚动到了特定的位置，此时看到感兴趣的内容，点击进入详情页，仔细浏览后发现并不是想要找的内容，那么我们会返回到上一级页面，也就是搜索结果列表页继续往下浏览，此时，我们肯定是希望页面能保持在之前浏览的位置，能够继续往下浏览了。不过遗憾的是，页面并不会如此展示，浏览器默认的刷新行为，会让页面回到顶部开始的位置，我们只能从头开始浏览，体验非常不好。而作为页面的开发者，为了给用户更好的体验，也必须要解决这种问题。

**那么，如何判断当前页面是通过浏览器回退返回的？**

事实上，浏览器并没有提供直接的接口或者事件来判断当前页面是通过浏览器回退返回的，而如果我们希望知道当前页面是否是浏览器回退返回的，就需要采用一些间接的方式来检测

1. 在页面离开时，存储即使页面刷新了也不会丢失的变量标识，在页面返回后检查该标记，有标记时即为浏览器回退返回的
2. 在页面离开时，在 URL 中添加标识参数，页面返回时，检查 URL 中是否有该变量标识，有的话为浏览器回退返回的

## 判断浏览器历史回退

### 实现思路

1. 页面离开时，在 URL 中添加标识参数
2. 页面返回时，检查 URL 中是否含有标识参数，有的话判定当前页面是历史回退返回的

### 代码示例

```js
const url = new URL(window.location.href);

// 通过beforeunload事件监听页面离开事件，在页面离开前给URL添加标识参数
window.addEventListener('beforeunload', () => {
  let state = { href: url.href, origin: history.state };
  url.searchParams.set('__history__', 'back');
  history.replaceState(state, '', url.href);
});

// 页面载入时，检查当前URL中是否含有标识参数，有的话判定为历史回退返回，注意这里要恢复原本的链接
if (url.searchParams.get('__history__') === 'back') {
  let state = history.state;
  history.replaceState(state.origin, '', state.href);
}
```

### 方案思考

1. 为什么选择在 URL 中添加标识参数，而不是选择*cookie*、*localStorage*等方式存储标识？  
   使用*cookie*、*localStorage*等方式存储标识来识别历史回退的，当页面是从其它页面直接返回时确实可行（页面路径：A -> B -> A），但这也有一个明显的弊端：无法准确地判断是否是一般的页面跳转进入（如页面路径：A -> B -> C -> ... -> A），导致最终可能判断错误

2. 代码示例中使用 URL 的查询参数来添加标识，是否可以用*hash*的方式添加？  
   当然可以，不过就算是使用*hash*的方式添加参数，最好还是用`history.replaceState()`方法来实现添加，因为这样不会生成多余的历史记录，避免历史记录混乱而难以管理

### 特殊场景

1. **部分浏览器上，通过浏览器的历史回退返回到上一级页面时，页面不会刷新，也不会重新执行 JS，导致上述的方案无效**

   **原因分析**：部分浏览器在跳转页面的时候，会把当前页面作为一个快照保存下来，此时不会卸载当前页面，也不会触发*onbeforeunload*等浏览器事件。当用户在其它页面点击浏览器的历史回退返回时，浏览器会直接切回到上一个保存的页面快照，此时页面不会刷新，也不会重新执行 JS，故而前面的方案无法起到效果。

   **解决办法**：

   1. 在页面离开时，监听`focus`、`pageshow`、`visibilitychange`等事件，并设置定时器轮询检测（不同的事件监听和轮询检测是为了最大程度的兼容各个浏览器）
   2. 在页面返回时，通过事件的回调和定时器轮询检测判断是否是浏览器的历史回退返回，并执行相应的逻辑
   3. 这里只是判断页面是否是历史回退返回，故而应当在页面返回后解绑事件监听并停止轮询检测

   ```js
   window.addEventListener('focus', pageAwakened);
   window.addEventListener('pageshow', pageAwakened);
   window.addEventListener('visibilitychange', visible);
   function visible() {
     !document.hidden && pageAwakened();
   }
   // 如果浏览器不支持requestAnimationFrame方法，可以使用setTimeout方法替换
   if (window.requestAnimationFrame) {
     requestAnimationFrame(wake);
   }

   let lastTs;
   function wake(timestamp) {
     if (timestamp - lastTs > 10000) {
       pageAwakened();
     }
     lastTs = timestamp;
     requestAnimationFrame(wake);
   }

   function pageAwakened() {
     // 解绑focus、pageshow、visibilitychange的事件绑定并停止轮询检测
     // 另外，这里最好加个执行次数限制控制，保证这里只执行一次
     window.removeEventListener('focus', pageAwakened);
     window.removeEventListener('pageshow', pageAwakened);
     window.removeEventListener('visibilitychange', visible);
     console.log('awakened at ' + new Date());
   }
   ```

## 参考

- [pageShow event in javascript](https://stackoverflow.com/questions/6363199/pageshow-event-in-javascript)
