##  js实用小技巧

#### 获取数组最后一个元素
```js
var array = [1, 2, 3, 4]

console.log(array.slice(-1)) // [4]
console.log(array.slice(-2)) // [3, 4]
console.log(array.slice(-3)) // [2, 3, 4]
console.log(array.slice(-4)) // [1, 2, 3, 4]
```
#### 条件短路语句
```js
if (condition) {
  dosomething()
}
```
这时，你可以这样子运用短路：
```js
condition && dosomething()
```

#### 取整 
可以使用 Math.floor()、Math.ceil()或 Math.round()将浮点数转换成整数，但有另一种更快的方式
```js
console.log(1.6 | 0); 
```


#### 获取文件拓展名
```js
var file1 = "50.xsl";
var file2 = "30.doc";
getFileExtension(file1); //returs xsl
getFileExtension(file2); //returs doc

function getFileExtension(filename) {
  /*TODO*/
}
```
- 方法一 String split 方法
```js
function getFileExtension(filename) {
  return filename.split('.').pop();
}
```
- 方法二 String的slice、lastIndexOf方法
```js
function getFileExtension3(filename) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}
console.log(getFileExtension3(''));                            // ''
console.log(getFileExtension3('filename'));                    // ''
console.log(getFileExtension3('filename.txt'));                // 'txt'
console.log(getFileExtension3('.hiddenfile'));                 // ''
console.log(getFileExtension3('filename.with.many.dots.ext')); // 'ext'
```

如何实现的？

无符号右移操作符(>>>) 将-1转换为4294967295，这个方法可以保证边缘情况时文件名不变。

#### 比较相等
- ==
js类型隐式转换会出现意想不到的结果。
```js
0 == ' ' //true
null == undefined //true
[1] == true //true
```
- === 
它比不全等操作符更加严格并且不会发生类型转换,但是用 === 来进行比较并不是最好的解决方案。你可能会得到：
```js
NaN === NaN //false
```
- Object.is 
`Object.is()`  方法，它具有 === 的一些特点，而且更好、更精确。
```js
Object.is(0 , ' '); //false
Object.is(null, undefined); //false
Object.is([1], true); //false
Object.is(NaN, NaN); //true
```

#### js 逗号操作符
除了分号之外，逗号允许你在同一个地方放多个语句。 例如：
```js
for(var i=0, j=0; i<5; i++, j++, j++){
  console.log("i:"+i+", j:"+j);
}
```
输出
```js
i:0, j:0
i:1, j:2
i:2, j:4
i:3, j:6
i:4, j:8
```
当放一个表达式时，它由左到右计算每个表达式，并传回最右边的表达式。

例如：
```js
function a(){console.log('a'); return 'a';}
function b(){console.log('b'); return 'b';}
function c(){console.log('c'); return 'c';}

var x = (a(), b(), c());

console.log(x);      // 输出「c」
```
输出：
```js
"a"
"b"
"c"
"c"
```
注意：逗号（,）操作符在 JavaScript 中所有的操作符里是最低的优先顺序，所以没有括号表达式时将变为：(x = a()), b(), c();。

#### 函数空参数异常处理
```js
function fun(a,b,c) {}

fun(1,,3)
```
报错
```
Uncaught SyntaxError: Unexpected token ,
```
可以使用数组是松散的，所以给它传空值是可以的优点。
```js
fun(...[1,,3])
```

#### 字符串拼接
```js
var a = 1;
var b = 2;
var c = '3';
var result = ''.concat(a, b, c); //"123"
```

#### New操作符号
```js
function Thing() {
  this.one = 1;
  this.two = 2;
}

var myThing = new Thing();

myThing.one // 1
myThing.two // 2
```
默认返回 `this`
```js
function Thing() {
  this.one = 1;
  this.two = 2;

  return 5;
}

var myThing = new Thing();
```
返回值不变
```js
function Thing() {
  this.one = 1;
  this.two = 2;

  return {
    three: 3,
    four: 4
  };
}

var myThing = new Thing();
console.log(myThing);
/*
  Object {three: 3, four: 4}
*/
```
总结：
- 使用new关键字调用一个函数的时候默认会返回`this`对象；
- 使用new关键字调用一个返回原始变量的函数将不会返回你指定的值，而是会返回`this`对象；
- 使用new关键字调用一个返回一个非原始变量像object、array或function将会覆盖this实例，并返回那个非原始变量。

