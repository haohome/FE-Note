# this

```JavaScript
function identify() {
	return this.name.toUpperCase();
}

function speak() {
	var greeting = "Hello, I'm " + identify.call( this );
	console.log( greeting );
}

var me = {
	name: "Kyle"
};

var you = {
	name: "Reader"
};

identify.call( me ); // KYLE
identify.call( you ); // READER

speak.call( me ); // Hello, I'm KYLE
speak.call( you ); // Hello, I'm READER
```

这个代码片段允许 `identify()` 和 `speak()` 函数对多个 *环境* 对象（`me` 和 `you`）进行复用，而不是针对每个对象定义函数的分离版本。

如果不用this,也可以明确的将环境对象传递给 `identify()` 和 `speak()`

```JavaScript
function identify(context) {
	return context.name.toUpperCase();
}

function speak(context) {
	var greeting = "Hello, I'm " + identify( context );
	console.log( greeting );
}

identify( you ); // READER
speak( me ); // Hello, I'm KYLE
```

`this` 机制提供了更优雅的方式来隐含地“传递”一个对象引用，导致更加干净的API设计和更容易的复用。

将执行环境作为一个明确参数传递，通常比传递 `this` 执行环境要乱。

> **this可以自动引用执行环境对象**

看下面这段代码,追踪foo被调用了几次:

```JavaScript
function foo(num) {
	console.log( "foo: " + num );// 追踪 `foo` 被调用了多少次
	this.count++;
}
foo.count = 0;
var i;
for (i=0; i<10; i++) {
	if (i > 5) {
		foo( i );
	}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// `foo` 被调用了多少次？
console.log( foo.count ); // 0 -- 这他妈怎么回事……？
```

`foo.count` *依然* 是 `0`, 即便四个 `console.log` 语句明明告诉我们 `foo(..)` 实际上被调用了四次。源于对于 `this`（在 `this.count++` 中）的含义进行了 *过于字面化* 的解释。

当代码执行 `foo.count = 0` 时，它确实向函数对象 `foo` 添加了一个 `count` 属性。但是对于函数内部的 `this.count` 引用，`this` 其实 *根本就不* 指向那个函数对象，即便属性名称一样，但根对象也不同，因而产生了混淆。

创建另一个对象来持有 `count` 属性：

```JavaScript
function foo(num) {
	console.log( "foo: " + num );
	// 追踪 `foo` 被调用了多少次
	data.count++;
}

var data = {
	count: 0
};
var i;
for (i=0; i<10; i++) {
	if (i > 5) {
		foo( i );
	}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// `foo` 被调用了多少次？
console.log( data.count ); // 4
```

看到这里,你应该知道this的指向，this指向了window，这涉及到了**词法作用域**

为了从函数对象内部引用它自己，一般来说通过 this 是不够的。你通常需要通过一个指向它的词法标识符（变量）得到函数对象的引用。

```JavaScript
function foo() {
	foo.count = 4; // `foo` 引用它自己
}

setTimeout( function(){
	// 匿名函数（没有名字）不能引用它自己
}, 10 );

第一个函数，称为“命名函数”，foo 是一个引用，可以用于在它内部引用自己。
而在第二个例子中,传递给 setTimeout(..) 的回调函数没有名称标识符（所以被称为“匿名函数”），所以没有合适的办法引用函数对象自己。
```

