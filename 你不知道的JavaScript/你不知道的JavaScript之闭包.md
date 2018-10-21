-----

title: 你不知道的JavaScript之闭包
categories: JavaScript
date: 2018-10-18
tags: [YDKJS,JS]

-----

## 1. 简介

> 闭包是函数和声明该函数的词法环境的组合。(来自:[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures))
>
> 另一种定义:**是指有权访问另外一个函数作用域中的变量的函数。创建闭包的常见方式就是在一个函数内部创建另外一个函数。**

```JavaScript
function init() {
    var name = "Mozilla"; // name 是一个被 init 创建的局部变量
    function displayName() { // displayName() 是内部函数,一个闭包
        alert(name); // 使用了父函数中声明的变量
    }
    displayName();
}
init();		// 弹出Mozilla
```

- `init()` 创建了一个局部变量 `name` 和一个名为 `displayName()` 的函数。
- `displayName()` 内没有自己的局部变量，然而它可以访问到外部函数的变量name;
- 但是，如果有同名变量 `name` 在 `displayName()` 中被定义，则会优先使用 `displayName()` 中定义的 `name` 。

这个*词法作用域*的例子介绍了引擎是如何解析函数嵌套中的变量的

<!-- more -->

闭包是由函数以及创建该函数的词法环境组合而成,**这个环境包含了这个闭包创建时所能访问的所有局部变量**。函数`displayName()`具有一个涵盖`init()`作用域的闭包

```JavaScript
function makeFunc() {
    var name = "Mozilla";
    function displayName() {
        alert(name);
    }
    return displayName;
}

var myFunc = makeFunc();
myFunc();
```

- `myFunc` 是执行 `makeFunc` 时创建的 `displayName` 函数实例的引用，而 `displayName` 实例**仍**可访问其词法作用域中的变量(闭包环境)，即可以访问到 `name` 。

- 当 `myFunc` 被调用时，`name` 仍可被访问，其值 `Mozilla` 就被传递到`alert`中。

再看一个例子:

```JavaScript
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

var add5 = makeAdder(5);
var add10 = makeAdder(10);

console.log(add5(2));  // 7
console.log(add10(4)); // 14
```

- 我们定义了 `makeAdder(x)` 函数，它接受一个参数 `x` ，并返回一个新的函数

- 返回的函数接受一个参数 `y`，并返回`x+y`的值

`makeAdder` 是一个函数工厂 ,其创建了两个新函数,新函数执行时其参数`y`与`makeAdder`形成的闭包环境中的参数`x`相加;

而`add5` 和 `add10` 都是闭包,它们共享相同的函数定义，但是保存了不同的词法环境。在 `add5`的环境中，`x` 为 5。而在 `add10` 中，`x` 则为 10。

这就是闭包: 它允许将函数与其所操作的某些数据（环境）关联起来,类似于面向对象,允许对象的属性与一个或多个方法关联

## 2. 一个常见的错误:循环和闭包

<iframe width="100%" height="200" src="//jsrun.net/w2hKp/embedded/js,result/light/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

这是一道经典的面试题,`setTimeout`定时器是一个异步回调的方法,当执行定时器回调函数时,回调函数内部的i都通过词法作用域共享变量i,而此时`for`循环已经终止,i值为6,因此每个打印出来的都为6

而如果希望打印的是1,2,3,4,5,通过声明并立即执行一个函数来创建作用域,循环中的每个迭代都给自己捕获一个`i`的副本储存,结果就能实现,如:

<iframe width="100%" height="200" src="//jsrun.net/N2hKp/embedded/js,result/light/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

ES6语法中let会创建块级作用域,很简单就能实现

```JavaScript
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  },i * 1000)
}
```

## 3.用闭包模拟私有方法(模块模式)

在java的编程语言中,是支持方法声明为私有的,即他们只能被同一个类中的其他方法所调用,JavaScript不支持(typescript支持),但js是可以通过闭包的方式模拟私有方法;

**私有化方法有利于限制对代码的访问**,还提供了管理全局命名空间的能力,避免非核心方法影响了代码的公共接口部分

```JavaScript
function Counter() {
  var privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  }   
};
var count1= Counter()
console.log(count1.value());	//0
count1.increment();
count1.increment();
console.log(count1.value());	//2
count1.decrement();
count1.log(Counter.value());	//1
var count2 = Counter()
console.log(count2.value())		//0
```

`Counter()`形成了闭包环境(可认为是模块),返回三个对象方法:`increment`、`decrement` 和 `value`,这三个公共函数具有涵盖实例内部作用域的闭包,其本质也可看做是**模块的公共API**,通过它访问闭包环境内的私有属性和方法:`privateCounter` 的变量和名为 `changeBy` 的函数;

> 通过在模块实例的内部保留对公共API对象的内部引用，可以从内部对模块实例进行修改，包括添加或删除方法和属性，以及修改它们的值。

当通过返回一个含有属性引用的对象的方式来将函数传递到词法作用域外部时，我们已经创造了可以观察和实践闭包的条件。

对于模块模式,需要具备两个必要条件:

1. 必须有外部的封闭函数,形成私有作用域,该函数必须至少被调用一次(每次调用都会创建一个新的模块实例)
2. 封闭函数必须返回至少一个内部函数,即模块的公共API,以访问或者修改私有的状态

上一个示例代码中有一个叫作`Counter()`的独立的模块创建器，可以被调用任意多次，每次调用都会创建一个新的模块实例。当只需要一个实例时，可以对这个模式进行简单的改进来实现**单例模式**：

> 采用匿名函数自调

```JavaScript
var counter = (function() {
  var privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  }   
})();
console.log(count.value());	//0
```

