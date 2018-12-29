title: Alipay
category: JavaScript
date: 2018-11-25
tags: [web,interview]

------

## 1. js的事件

### 1.1 事件基础

JavaScript 使我们有能力创建动态页面。事件是可以被 JavaScript 侦测到的行为。

事件是javaScript和DOM之间交互的桥梁。

网页中的每个元素都可以产生某些可以触发JavaScript函数的事件。比方说，我们可以在用户点击某按钮时产生一个 onClick事件来触发某个函数。事件在 HTML 页面中定义。

**事件举例**

- 鼠标点击
- 页面或图像载入
- 鼠标悬浮于页面的某个热点之上
- 在表单中选取输入框
- 确认表单
- 键盘按键

### 1.2 绑定事件的方法

- 嵌入dom

  ```javascript
  <button onclick="open()">按钮</button>
  <script>
  function open(){
      alert(1)
  }
  </script>
  ```

- 直接绑定

  ```JavaScript
  <button id="btn">按钮</button>
  <script>
  document.getElementById('btn').onclick = function(){
      alert(1)
  }
  </script>
  ```

- 事件监听

  ```JavaScript
  <button id="btn">按钮</button>
  <script>
  document.getElementById('btn').addEventListener('click',function(){
      alert(1)
  })
  //兼容IE
  document.getElementById('btn').attachEvent('click',function(){
      alert(1)
  })
  </script>
  ```

  ie和w3c绑定事件的标准有没有不一样？

  > ie绑定事件是用attachEvent方法，删除事件是detachEvent方法
  >
  > ```JavaScript
  > //添加事件监听兼容函数 
  > function addHandler(target, eventType, handler){  
  >     if(target.addEventListener){//主流浏览器  
  >         addHandler = function(target, eventType, handler){  
  >             target.addEventListener(eventType, handler, false);  
  >         };  
  >     }else{//IE  
  >         addHandler = function(target, eventType, handler){  
  >             target.attachEvent("on"+eventType, handler);  
  >         };        
  >     }  
  >     //执行新的函数  
  >     addHandler(target, eventType, handler);  
  > }  
  > ```

- 自定义事件

  ```JavaScript
  var event= new Event('test')
  ele.addEventListener('test',function(){
    console.log('触发了自定义事件test')
  })
  ele.dispatchEvent(event)
  ```

## 2. 事件流

又称事件触发顺序,JS事件流原理图如下:

<img src="https://haohome.top/18-11-24/35191051.jpg" width="50%" />

- 一个完整的JS事件流是从window开始，最后回到window的一个过程

- 事件流被分为三个阶段(1~ 5)捕获过程、(5~ 6)目标过程、(6~10)冒泡过程

> 认识DOM Level:
>
> - DOM 0 :
>
>   在标签内写onclick事件,JS写onlicke=function（）{}函数
>
>   DOM 0 只能一个元素只能绑定一个事件，继续绑定click事件会覆盖前面绑定的事件
>
> - DOM 2: 
>
>   有两个方法用来添加和移除事件处理程序：addEventListener()和removeEventListener()。
>
>   它们都有三个参数：第一个参数是事件名（如click）；
>
>   　　　　　　　　　第二个参数是事件处理程序函数；
>
>   　　　　　　　　    第三个参数如果是true则表示在捕获阶段调用，为false表示在冒泡阶段调用。
>
>   包含三个阶段:事件捕获阶段、处于目标阶段和事件冒泡阶段
>
> - DOM 3:
>
>   ​	UI事件，当用户与页面上的元素交互时触发，如：load、scroll
>
>   ​       焦点事件，当元素获得或失去焦点时触发，如：blur、focus
>
>   ​       鼠标事件，当用户通过鼠标在页面执行操作时触发如：dbclick、mouseup
>
>   ​       滚轮事件，当使用鼠标滚轮或类似设备时触发，如：mousewheel
>
>   ​       文本事件，当在文档中输入文本时触发，如：textInput
>
>   ​        键盘事件，当用户通过键盘在页面上执行操作时触发，如：keydown、keypress
>
>   ​        合成事件，当为IME（输入法编辑器）输入字符时触发，如：compositionstart
>
>   ​        变动事件，当底层DOM结构发生变化时触发，如：DOMsubtreeModified
>
>   ​         同时DOM3级事件也允许使用者自定义一些事件。

 **事件委托(事件代理)**

事件委托就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件

```html
<ul id='myLink'>
  <li id='a'> apple </li>
  <li id='b'> banana </li>
  <li id='c'> orange </li>
</ul>
```

```JavaScript
var f = document.getElementById('myLink');
f.onclick = function(e) {
  console.log(e.target.innerHTML);
};
```

## 3. 简答

- js的基本数据类型

  基本数据类型有五种Undefined、Null、Boolean、Number和String，也叫做简单的数据类型，还有一种复杂的数据类型是Object，但不属于基本数据类型。

- 字符串常用的十个函数

  > - charAt() 返回在指定位置的字符。
  > - concat() 连接字符串。
  > - fromCharCode() 从字符编码创建一个字符串。
  > - indexOf() 检索字符串。
  > - match() 找到一个或多个正则表达式的匹配。
  > - replace() 替换与正则表达式匹配的子串。
  > - search() 检索与正则表达式相匹配的值。
  > - slice() 提取字符串的片断，并在新的字符串中返回被提取的部分。
  > - split() 把字符串分割为字符串数组。
  > - substr() 从起始索引号提取字符串中指定数目的字符。
  > - substring() 提取字符串中两个指定的索引号之间的字符。
  > - toLocaleLowerCase() 把字符串转换为小写。
  > - toLocaleUpperCase() 把字符串转换为大写。
  > - toLowerCase() 把字符串转换为小写。
  > - toUpperCase() 把字符串转换为大写。
  > - toString() 返回字符串。
  > - valueOf() 返回某个字符串对象的原始值。

- 数组常用的十个函数

  > - concat() 连接两个或更多的数组，并返回结果。
  > - join() 把数组的所有元素放入一个字符串。元素通过指定的分隔符进行分隔。
  > - pop() 删除并返回数组的最后一个元素
  > - push() 向数组的末尾添加一个或更多元素，并返回新的长度。
  > - reverse() 颠倒数组中元素的顺序。
  > - shift() 删除并返回数组的第一个元素
  > - slice() 从某个已有的数组返回选定的元素
  > - sort() 对数组的元素进行排序
  > - splice() 删除元素，并向数组添加新元素。
  > - toString() 把数组转换为字符串，并返回结果。
  > - toLocaleString() 把数组转换为本地数组，并返回结果。
  > - unshift() 向数组的开头添加一个或更多元素，并返回新的长度。
  > - valueOf() 返回数组对象的原始值。

## 4. this是什么，this代表什么

this是Javascript语言的一个关键字。它代表函数运行时，自动生成的一个内部对象，只能在函数内部使用。随着函数使用场合的不同，this的值会发生变化。

- 函数作为对象的方法调用时,this指向该对象

  ```JavaScript
  var obj = {
      a: 1,
      getA: function(){
          alert ( this === obj );    // 输出：true
          alert ( this.a );    // 输出: 1
      }
  };
  
  obj.getA();
  ```

- 函数不作为对象属性被调用时,this指向全局对象

  ```JavaScript
  window.name = 'globalName';
  var getName = function(){
      return this.name;
  };
  
  console.log( getName() );    // 输出：globalName”
  ```

- 函数作为构造器调用时,this指向新生成的实例

  ```JavaScript
  var MyClass = function(){
      this.name = 'sven';
  };
  var obj = new MyClass();
  alert ( obj.name );     // 输出：sven”
  ```

- Function.prototype.call或Function.prototype.apply调用,动态改变this的指向

## 5. ajax 怎么实现

Ajax是一个完整的http请求,他告诉浏览器给我要发送一个HTTP请求，浏览器开个**线程**去执行下，服务器响应后执行后续操作（**回调**）。在线程返回结果前，可以继续做其他事情。（**异步**）

## 6. 页面卡顿优化

- 合并多次的DOM操作为单次的DOM操作
- 把DOM元素离线或隐藏后修改
  - 使用文档片段
  - 通过设置DOM元素的display样式为none来隐藏元素
  - 设置具有动画效果的DOM元素的position属性为fixed或absolute(元素脱离页面布局流)
  - 使用事件托管方式绑定事件

## 7.[原型与原型链](https://blog.haohome.top/2018/03/11/JavaScript/%E9%80%9A%E4%BF%97%E6%98%93%E6%87%82%E7%9A%84%E5%8E%9F%E5%9E%8B%E4%B8%8E%E5%8E%9F%E5%9E%8B%E9%93%BE/)

	#### 创建对象的方法

```JavaScript
// 第一种方式：字面量
var o1 = {name: 'o1'};
var o2 = new Object({name: 'o2'});
// 第二种方式：构造函数
var M = function (name) { this.name = name; };
var o3 = new M('o3');
// 第三种方式：Object.create
var p = {name: 'p'};
var o4 = Object.create(p);
```

​	原型链，对象，构造函数之间的一些联系:

<img src="https://haohome.top/18-11-25/19883386.jpg" width="60%"/>

​	所有引用类型数据(Array/Function/Object)都有对象特性，即具有扩展属性

- 构造函数具有`prototype` 属性，指向原型对象

- 原型对象具有`constructor` 属性，指向构造函数

- 实例对象具有`__protot__` 属性，指向其构造函数的原型对象

  原型对象的应用主要就是继承,通过原型对象可拓展方法,子级实例继承父类方法

  判断数组: `Object.prototype.toString.call([1,2,3])`

## 8. 项目中用到的技术栈，以及觉得得意和出色的点，以及让你头疼的点，怎么解决的

CSS: less/sass
JavaScript:jQuery,Backbone,Vue,
JS插件: dropkick,layui,axios,swiper,art-template,echarts
UI库:element-ui,muse-ui,iview,bootstrap
工程自动化:webpack,git,

art-template: 搭建单页面,表单模板渲染

## 9. 渐进增强与优雅降级

渐进增强:针对低版本浏览器进行构建页面，**保证最基本的功能**，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验。

```css
.transition{/*渐进增强写法*/
  -webkit-transition: all .5s;
     -moz-transition: all .5s;
       -o-transition: all .5s;
          transition: all .5s;  
}
```

优雅降级:一开始就构建完整的功能，然后再针对低版本浏览器进行兼容

```css
.transition{/*优雅降级写法*/
　　     transition: all .5s;
　　  -o-transition: all .5s;
  　-moz-transition: all .5s;
 -webkit-transition: all .5s;
}
```





