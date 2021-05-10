# 什么是 ？（问号）操作符？
在TypeScript里面，有~3~ **4**个地方会出现问号操作符，他们分别是

### 三元运算符
```ts
// 当 isNumber(input) 为 True 是返回 ? : 之间的部分； isNumber(input) 为 False 时
// 返回 : ; 之间的部分
const a = isNumber(input) ? input : String(input);
```

### 参数
```ts
// 这里的 ？表示这个参数 field 是一个可选参数
function getUser(user: string, field?: string) {
}
```

### 成员
```ts
// 这里的？表示这个name属性有可能不存在
class A {
  name?: string
}

interface B {
  name?: string
}
```

### 安全链式调用
```ts
// 这里 Error对象定义的stack是可选参数，如果这样写的话编译器会提示
// 出错 TS2532: Object is possibly 'undefined'.
return new Error().stack.split('\n');

// 我们可以添加?操作符，当stack属性存在时，调用 stack.split。若stack不存在，则返回空
return new Error().stack?.split('\n');

// 以上代码等同以下代码
const err = new Error();
return err.stack && err.stack.split('\n');
```

# 什么是！（感叹号）操作符？
在TypeScript里面有3个地方会出现感叹号操作符，他们分别是

### 一元运算符
```ts
// ! 就是将之后的结果取反，比如：
// 当 isNumber(input) 为 True 时返回 False； isNumber(input) 为 False 时返回True
const a = !isNumber(input);
```

### 成员
```ts
// 因为接口B里面name被定义为可空的值，但是实际情况是不为空的，那么我们就可以
// 通过在class里面使用！，重新强调了name这个不为空值
class A implemented B {
  name!: string
}

interface B {
  name?: string
}
```

### 强制链式调用
```ts
// 这里 Error对象定义的stack是可选参数，如果这样写的话编译器会提示
// 出错 TS2532: Object is possibly 'undefined'.
new Error().stack.split('\n');

// 我们确信这个字段100%出现，那么就可以添加！，强调这个字段一定存在
new Error().stack!.split('\n');
```

祝大家编程愉快