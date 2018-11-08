------

title: 你不知道的JavaScript之this
categories: JavaScript
date: 2018-10-21
tags: [YDKJS,JS]

------

##  初识this

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

<!-- more -->

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

- 通过命名函数调用自己,每个地方都是用`foo` 标识符作为对函数的引用(完全依靠foo的词法作用域):

```JavaScript
function foo(num) {
	console.log( "foo: " + num );
	foo.count++;	// 追踪 `foo` 被调用了多少次
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
console.log( foo.count ); // 4  
```

- 利用call强迫this指向foo

```JavaScript
function foo(num) {
	console.log( "foo: " + num );	
	// 注意：由于 `foo` 的被调用方式（见下方），`this` 现在确实是 `foo`
	this.count++; // 追踪 `foo` 被调用了多少次
}
foo.count = 0;
var i;
for (i=0; i<10; i++) {
	if (i > 5) {
		foo.call( foo, i );// 使用 `call(..)`，我们可以保证 `this` 指向函数对象(`foo`)
	}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9
console.log( foo.count ); // 4
```

## 解惑this

### 调用点（Call-site）

函数在代码中被调用的位置（**不是被声明的位置**）

 **调用栈（call-stack）**: 使我们到达当前执行位置而被调用的所有方法的堆栈

```JavaScript
function baz() {
    // 调用栈是: `baz`
    // 我们的调用点是 global scope（全局作用域）
    console.log( "baz" );
    bar(); // <-- `bar` 的调用点
}
function bar() {
    // 调用栈是: `baz` -> `bar`
    // 我们的调用点位于 `baz`
    console.log( "bar" );
    foo(); // <-- `foo` 的 call-site
}
function foo() {
    // 调用栈是: `baz` -> `bar` -> `foo`
    // 我们的调用点位于 `bar`
    console.log( "foo" );
}
baz(); // <-- `baz` 的调用点
```

###  调用规则

#### 默认绑定（Default Binding)

该规则源于函数调用最常见的情况:独立函数调用。可以认为这种 `this` 规则是在没有其他规则适用时的默认规则。

```JavaScript
function foo() {
	console.log( this.a );
}
var a = 2;

foo(); // 2  独立函数的调用,相当于window.foo(),对此方法调用的this实施了默认绑定,使this指向全局对象window
```

如果 `strict mode` 在这里生效，那么对于 *默认绑定* 来说全局对象是不合法的，所以 `this` 将被设置为 `undefined`。

```JavaScript
function foo() {
	"use strict";
	console.log( this.a );
}
var a = 2;
foo(); // TypeError: `this` is `undefined`
```

**有一个重要的细节:** 即便所有的 `this` 绑定规则都是完全基于调用点的,如果`foo()`的内容没有在`strict mode`下执行,对于 *默认绑定* 来说全局对象是 **唯一** 合法的；

```JavaScript
function foo() {
	console.log( this.a );
}
var a = 2;
(function(){
	"use strict";
	foo(); // 2
})();
```

> `foo()` 的调用点的 `strict mode` 状态与此无关。

#### 隐含绑定（Implicit Binding)

调用点是否有一个环境对象（`context object`）

```JavaScript
function foo() {
	console.log( this.a );
}
var obj = {
	a: 2,
	foo: foo
};
obj.foo(); // 2
```

 `foo()` 被声明然后作为引用属性添加到 `obj` 上，`obj`通过函数引用调用`foo()`,`foo()`内的this就指代调用对象obj;

> 可以这样理解:this是在函数执行时自动创建的一个关键词,会自动指向正在调用当前函数的对象

#### 隐含丢失（Implicitly Lost）

当一个 *隐含绑定* 丢失了它的绑定，这通常意味着它会退回到 *默认绑定*， 根据 `strict mode` 的状态，其结果不是全局对象就是 `undefined`。

```JavaScript
function foo() {
	console.log( this.a );
}
var obj = {
	a: 2,
	foo: foo
};
var bar = obj.foo; // 函数引用！
var a = "oops, global"; // `a` 也是一个全局对象的属性
bar(); // "oops, global"
```

这里bar仅仅是对foo的一个应用而已,调用点是bar(),因此默认绑定适用这里;

```JavaScript
function foo() {
	console.log( this.a );
}
function doFoo(fn) {
	// `fn` 只不过 `foo` 的另一个引用
	fn(); // <-- 调用点!
}
var obj = {
	a: 2,
	foo: foo
};
var a = "oops, global"; // `a` 也是一个全局对象的属性
doFoo( obj.foo ); // "oops, global"
```

看到这里,可以看出this的指向是由函数对象的调用点决定的

#### 明确绑定（Explicit Binding）

如果你想强制一个函数调用使用某个特定对象作为 `this` 绑定,通过call或apply方法,用于指定this

```JavaScript
function foo() {
	console.log( this.a );
}
var obj = {
	a: 2
};
foo.call( obj ); // 2
```

通过 `foo.call(..)` 使用 *明确绑定* 来调用 `foo`，允许我们强制函数的 `this` 指向 `obj`。

如果你传递一个简单基本类型值（`string`，`boolean`，或 `number` 类型）作为 `this` 绑定，那么这个基本类型值会被包装在它的对象类型中（分别是 `new String(..)`，`new Boolean(..)`，或 `new Number(..)`）。这通常称为“封箱（boxing）”。

**硬绑定（Hard Binding）**

```JavaScript
function foo() {
	console.log( this.a );
}
var obj = {
	a: 2
};

var bar = function() {
	foo.call( obj );
};

bar(); // 2
setTimeout( bar, 100 ); // 2

// `bar` 将 `foo` 的 `this` 硬绑定到 `obj`
// 所以它不可以被覆盖
bar.call( window ); // 2
```

我们创建了一个函数 `bar()`，在它的内部手动调用 `foo.call(obj)`，由此强制 `this` 绑定到 `obj` 并调用 `foo`。无论你过后怎样调用函数 `bar`，它总是手动使用 `obj` 调用 `foo`。这种绑定即明确又坚定，所以我们称之为 *硬绑定（hard binding）*

用 *硬绑定* 将一个函数包装起来的最典型的方法，是为所有传入的参数和传出的返回值创建一个通道：

```JavaScript
function foo(something) {
	console.log( this.a, something );
	return this.a + something;
}
var obj = {
	a: 2
};
var bar = function() {
	return foo.apply( obj, arguments );
};

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

**API 调用的“环境”**

许多库中的函数，和许多在 JavaScript 语言以及宿主环境中的内建函数，都提供一个可选参数，通常称为“环境（context）”，这种设计作为一种替代方案来确保你的回调函数使用特定的 `this` 而不必非得使用 `bind(..)`。

```JavaScript
function foo(el) {
	console.log( el, this.id );
}

var obj = {
	id: "awesome"
};

// 使用 `obj` 作为 `this` 来调用 `foo(..)`
[1, 2, 3].forEach( foo, obj ); // 1 awesome  2 awesome  3 awesome
```

从内部来说，几乎可以确定这种类型的函数是通过 `call(..)` 或 `apply(..)` 来使用 *明确绑定* 

#### `new` 绑定（`new` Binding）

当在函数前面被加入 `new` 调用时:

1. 创建一个新的空对象
2. 自动让新的子对象继承构造函数继承原型对象
3. 调用构造函数，将构造函数中的this执行正在创建的新的空对象中强行添加新成员将新对象地址返回给变量
4. 将新对象地址返回给变量保存

```JavaScript
function foo(a) {
	this.a = a;
}
var bar = new foo( 2 );
console.log( bar.a ); // 2
```

以上就是函数调用中的四种 `this` 绑定规则,通常需要找到调用点然后考察哪一种规则适用于它。但四种规则是有优先级的,

####  判定 `this`

1. 函数是通过 `new` 被调用的吗（**new 绑定**）？如果是，`this` 就是新构建的对象。

   `var bar = new foo()`

2. 函数是通过 `call` 或 `apply` 被调用（**明确绑定**），甚至是隐藏在 `bind` *硬绑定* 之中吗？如果是，`this` 就是那个被明确指定的对象。

   `var bar = foo.call( obj2 )`

3. 函数是通过环境对象（也称为拥有者或容器对象）被调用的吗（**隐含绑定**）？如果是，`this` 就是那个环境对象。

   `var bar = obj1.foo()`

4. 否则，使用默认的 `this`（**默认绑定**）。如果在 `strict mode` 下，就是 `undefined`，否则是 `global` 对象。

   `var bar = foo()`

以上，就是理解对于普通的函数调用来说的 `this` 绑定规则 *所需的全部*。