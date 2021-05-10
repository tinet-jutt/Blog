# TS中的extends

## 1.做判断用
```ts
T extends U ? X : Y
```

### 1. T 为非复合类型

```
如果T类型包含U类型，那么取结果X，否则取结果Y。
```
举例：

```ts
type NonNullable<T> = T extends null | undefined ? never : T;

// 如果泛型参数 T 为 null 或 undefined，那么取 never，否则直接返回T。
let demo1: NonNullable<number>; // => number
let demo2: NonNullable<string>; // => string
let demo3: NonNullable<undefined | null>; // => never

```

### 2. T 为复合类型

当T为联合类型的时候，会进行拆分，有点类似数学中的分解因式:

```
(a + b) * c => ac + bc
```
举例：
```ts
type Diff<T, U> = T extends U ? never : T; // 找出T的差集
type Filter<T, U> = T extends U ? T : never; // 找出交集

type T30 = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // => "b" | "d"
// <"a" | "b" | "c" | "d", "a" | "c" | "f">
// 相当于
// <'a', "a" | "c" | "f"> |
// <'b', "a" | "c" | "f"> |
// <'c', "a" | "c" | "f"> |
// <'d', "a" | "c" | "f">
type T31 = Filter<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // => "a" | "c"
// <"a" | "b" | "c" | "d", "a" | "c" | "f"> 同上

let demo1: Diff<number, string>; // => number

```

## 2.通过该关键字来约束数据的类型属性

```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length)
  return arg
}
```
上述代码是会报错的，因为arg的类型是不确定的，所以不一定会有length属性，那么如何来解决这个问题呢？

使用extends关键字，通过该关键字来约束数据的类型属性。

这里要定义一个接口

```ts
interface LengthWise {
  length: number
}

function loggingIdentity<T extends LengthWise>(arg: T): T {
  console.log(arg.length)
  return arg
}

```

这样就保证arg变量肯定会有length属性了，但与此同时也限制了arg的传入类型范围，比如，你传入数字就是不可以的。