------

title: 你不知道的JavaScript之词法作用域与动态作用域
categories: JavaScript
date: 2018-12-10
tags: [YDKJS,JS]

------

## 类与对象实例的关系

对象是所有在类中被描述特性的 拷贝,一个类通过拷贝操作成为实例化对象

<img src="https://haohome.top/18-12-10/95669188.jpg"/>

<center>实例（a1、a2、b1和b2）和继承（Bar），箭头表示复制操作”</center>

子类Bar继承父类的方法,并可以对继承到的方法进行重写,并不会影响父类的方法

借助构造函数实现继承: 不能获得父类的原型链方法

```JavaScript
function Parent1 () {
  this.name = 'parent1';
}
Parent1.prototype.say = function () {
	console.log('说')
};
function Child1 () {
  Parent1.call(this);
  this.type = 'child1';
}
console.log(new Child1(), new Child1().say());
```

借助原型链实现继承:对于数组只是获得了引用地址

```JavaScript
function Parent2 () {
  this.name = 'parent2';
  this.play = [1, 2, 3];
}
function Child2 () {
  this.type = 'child2';
}
Child2.prototype = new Parent2();
var s1 = new Child2();
var s2 = new Child2();
console.log(s1.play, s2.play);	//(3) [1, 2, 3] (3) [1, 2, 3]
s1.play.push(4);
console.log(s1.play, s2.play);	//(4) [1, 2, 3, 4] (4) [1, 2, 3, 4]
```

组合方式: 子类原型对象继承父类实例

```JavaScript
function Parent3 () {
  this.name = 'parent3';
  this.play = [1, 2, 3];
}
function Child3 () {
  Parent3.call(this);
  this.type = 'child3';
}
Child3.prototype = new Parent3();
var s3 = new Child3();
var s4 = new Child3();
s3.play.push(4);
console.log(s3.play, s4.play);
```

组合方式优化:父类原型对象复制给子类原型对象

```JavaScript
function Parent4 () {
          this.name = 'parent4';
          this.play = [1, 2, 3];
      }
      function Child4 () {
          Parent4.call(this);
          this.type = 'child4';
      }
      Child4.prototype = Parent4.prototype;
      var s5 = new Child4();
      var s6 = new Child4();
      console.log(s5, s6);

      console.log(s5 instanceof Child4, s5 instanceof Parent4);
      console.log(s5.constructor);
```

组合优化2:

```javascript
function Parent5 () {
          this.name = 'parent5';
          this.play = [1, 2, 3];
      }
      function Child5 () {
          Parent5.call(this);
          this.type = 'child5';
      }
      Child5.prototype = Object.create(Parent5.prototype);
```

