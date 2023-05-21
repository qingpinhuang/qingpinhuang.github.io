# JSX

1. [JSX](http://facebook.github.io/jsx/)是一种嵌入式的类 XML 语法
2. JSX 可以转化成合法的 JavaScript（转换的语义会因不同的实现而有所区别）
3. TypeScript 支持内嵌、类型检查、和直接编译 JSX 为 JavaScript

## 基本用法

**使用前提**

1. 文件后缀改成 `.tsx`
2. 启用 `jsx` 选项

**JSX 的模式**

> 模式仅在代码生成阶段起作用，类型检查不受影响

1. `preserve`：生成的代码会保留 JSX 给后续的转换操作使用（如：[Babel](https://babeljs.io/)），输出文件以 `.jsx` 为扩展名
2. `react`：生成为 `React.createElement` 的代码，使用前不需要再进行转换，输出文件的扩展名是 `.js`
3. `react-native`：跟 `preserve` 相似，生成代码会保留 JSX，但输出的文件扩展名试 `.js`

| Mode           | Input     | Output                                           | Output File Extension |
| :------------- | :-------- | :----------------------------------------------- | :-------------------- |
| `preserve`     | `<div />` | `<div />`                                        | `.jsx`                |
| `react`        | `<div />` | `React.createElement("div")`                     | `.js`                 |
| `react-native` | `<div />` | `<div />`                                        | `.js`                 |
| `react-jsx`    | `<div />` | `_jsx("div", {}, void 0)`                        | `.js`                 |
| `react-jsxdev` | `<div />` | `_jsxDEV("div", {}, void 0, false, {...}, this)` | `.js`                 |

可以通过命令行参数 `--jsx` 或者 `tsconfig.json` 里的选项来指定模式

## `as` 操作符

```ts
// 类型断言
const foo = <Foo>bar;
const foo = bar as Foo;
```

1. 类型断言支持尖括号语法和 `as` 语法
2. 在 `.tsx`、`.jsx` 等文件内，尖括号语法与 JSX 语法冲突，造成解析困难，故而限制只能使用 `as` 语法

## 类型检查

**固有元素与基于值的元素**
对于 JSX 表达式 `<expr />`， `expr` 可以是环境内置的元素（如：`div`、`span`等），也可以是自定义的组件，它们在创建时有以下区别：

1. 在 React，固有元素以字符串的形式传入（`React.createElement("div")`），而自定义组件则不是（`React.createElement(MyComponent)`）
2. 传入 JSX 元素的属性类型查找方式不同：固有元素的属性是固定已知的，而自定义组件的是组件  指定的

TypeScript 采用跟[React](https://reactjs.org/docs/jsx-in-depth.html)相同的规范，固有元素以小写字母开头，基于值的元素以大写字母开头

### 固有元素

1. 固有元素使用特殊接口 `JSX.IntrinsicElements` 来查找
2. 没有指定 `JSX.IntrinsicElements` 时，全部通过，不对固有元素进行类型检查
3. 指定了 `JSX.IntrinsicElements` 时，固有元素必须在其声明的属性内

```tsx
declare namespace JSX {
    interface IntrinsicElements {
        foo: any
    }
}

<foo /> // 正确
<bar /> // 错误，没有在 JSX.IntrinsicElements 内指定
```

### 基于值的元素

基于值的元素会在它所在的作用域内按标识符查找

```tsx
import MyComponent from './myComponent'

<MyComponent /> // 正确
<SomeOtherComponent /> // 错误，此作用域内没有 SomeOtherComponent
```

基于值的元素可分为：

1. 函数组件（Function Component）
2. 类组件（Class Component）

函数组件和类组件在 JSX 内无法直接区分，故而会按照如下的顺序进行解析：

1. 尝试解析为函数组件，成功则直接返回
2. 尝试解析为类组件，成功则直接返回
3. 解析失败，抛出异常

#### 函数组件

定义成 JavaScript 函数，其第一个参数是 `props` 对象，返回值类型为 `JSX.Element`

```tsx
declare function AnotherComponent(props: { name: string });

interface FooProps {
  name: string;
}
function ComponentFoo(props: FooProps) {
  return <AnotherComponent name={props.name} />;
}

const Button = (props: { value: string }, context: { color: string }) => <button>{props.value}</button>;
```

函数组件就是 JavaScript 函数，故而也支持函数重载

```ts
interface ClickableProps {
  children: JSX.Element[] | JSX.Element;
}
interface HomeProps extends ClickableProps {
  home: JSX.Element;
}
interface SideProps extends ClickableProps {
  side: JSX.Element | string;
}
function MainButton(prop: HomeProps): JSX.Element;
function MainButton(prop: SideProps): JSX.Element;
function MainButton(prop: ClickableProps): JSX.Element {
  // ...
}
```

#### 类组件

**元素类类型**

1. 如果是 ES6 类，类类型为类的构造函数和静态部分
2. 如果是工厂函数，类类型为函数本身

**元素实例类型**

1. 构造函数或工厂函数的返回值的类型
2. 元素实例类型必须能赋值给 `JSX.ElementClass`，否则会抛出异常；默认情况下，`JSX.ElementClass` 的值为 `{}`，我们可以扩展它以限制 JSX 的类型

```tsx
// ES6类
class MyComponent {
  render() {}
}
// 使用构造签名
const myComponent = new MyComponent();

// 元素类类型 => MyComponent
// 元素实例类型 => { render: () => void }

// 工厂函数
function MyFactoryFunction() {
  return {
    render: () => {},
  };
}
// 使用调用签名
const myComponent = MyFactoryFunction();

// 元素类类型 => MyFactoryFunction
// 元素实例类型 => { render: () => void }
```

### 属性类型检查

**固有元素**
固有元素的属性类型是 `JSX.IntrinsicElements` 对象的属性的类型

```tsx
declare namespace JSX {
  interface IntrinsicElements {
    foo: { bar?: boolean };
  }
}

// foo 的元素属性类型是 { bar?: boolean }
<foo bar />;
```

**基于值的元素**

1. 基于值的元素的属性类型取决于元素实例类型中的某个属性的类型
2. 该属性默认由 `JSX.ElementAttributesProperty` 指定（只能指定一个属性）
3. 如果没有指定 `JSX.ElementAttributesProperty`，则由构造器（类组件）或者工厂函数（函数组件）的第一个参数决定
4. 使用 `JSX.IntrinsicAttributes` 或 `JSX.IntrinsicClassAttributes<T>` 可以指定额外属性，这些额外属性通常不被 `props` 和 `arguments` 使用（如：React 的 `key`）

```tsx
declare namespace JSX {
  interface ElementAttributesProperty {
    props; // 指定属性名
  }
}
class MyComponent {
  // 指定元素实例类型中的属性
  props: {
    foo?: string;
  };
}
// MyComponent 的元素属性类型是 { foo?: string }
<MyComponent foo="bar" />;
```

1. JSX 通过元素属性类型执行类型检查
2. 元素属性类型支持可选属性和必选属性
3. 元素属性类型支持扩展运算符（`...`）

```tsx
declare namespace JSX {
    interface IntrinsicElements {
        foo: {
            requiredProp: string
            optionalProp?: number
        }
    }
}

<foo requiredProp="bar" /> // 正确
<foo requiredProp="bar" optionalProp={0} /> // 正确
<foo /> // 错误，必选属性 requiredProp 没有设置
<foo requiredProp={0} /> // 错误，requiredProp 的类型错误
<foo requiredProp="bar" unknownProp /> // 错误，unknownProp 是不存在的属性
<foo requiredProp="bar" some-unknown-prop /> // 正确, some-unknown-prop 不是有效的标识符

const props = { requiredProp: "bar" }
<foo {...props} /> // 正确

const badProps = {}
<foo {...badProps} /> // 错误，展开后没有必选属性 requiredProp
```

> 注意：如果一个属性名不是一个合法的 JS 标识符（如：`data-*` 属性），那么它即使没有出现在元素属性类型的定义中也不会报错

### 子类型检查

1. _children_ 是一个特殊元素属性类型，其值为 JSX 表达式
2. 可以在 `JSX.ElementChildrenAttribute` 指定表示子类型的属性名

```ts
declare namespace JSX {
  interface ElementChildrenAttribute {
    children: {}; // 指定属性名
  }
}
```

```tsx
const CustomComp = (props) => <div>{props.children}</div>
<CustomComp>
  <div>Hello World</div>
  {'This is just a JS expression...' + 1000}
</CustomComp>
```

## JSX 结果类型

1. 默认情况下，JSX 表达式的结果类型为 `any`
2. 通过指定 `JSX.Element` 接口自定义结果类型
3. 无法从 `JSX.Element` 接口检索 JSX 的元素、属性、子元素等类型信息

## 嵌入表达式

JSX 支持通过 `{ }` 嵌入表达式

```tsx
const a = (
  <div>
    {[4, 8].map((i) => (
      <span>{i / 2}</span>
    ))}
  </div>
);
```

## React 整合

引入 [React typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react) 以支持 JSX 与 React 共同使用的场景

```tsx
/// <reference path="react.d.ts" />
interface Props {
    foo: string
}
class MyComponent extends React.Component<Props, {}> {
    render() {
        return <span>{this.props.foo}</span>
    }
}
<MyComponent foo="bar" /> // 正确
<MyComponent foo={0} /> // 错误
```

### JSX 配置

更多可用于自定义 JSX 的编译器标志：

- [jsxFactory](https://www.typescriptlang.org/tsconfig#jsxFactory)
- [jsxFragmentFactory](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)
- [jsxImportSource](https://www.typescriptlang.org/tsconfig#jsxImportSource)
