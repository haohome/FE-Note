#### $.data()
函数的返回值是任意类型，返回值的类型取决于当前data()函数执行的是"存储数据"操作还是"读取数据"操作。
- 如果data()函数执行的是"存储数据"操作，则返回当前jQuery对象本身；如果是"读取数据"操作，则返回读取到的数据。
- 如果当前jQuery对象匹配多个元素，读取数据时，data()函数只以其中第一个匹配的元素为准。
- 如果执行data(key)函数(仅传入一个参数key)时找不到相应的数据，则返回undefined。如果执行data()函数(不带任何参数)时找不到相应的数据，则返回一个空的对象(没有任何属性)。
```html
<div id="n1">
    <div id="n2">
        <ul id="n3">
            <li id="n4">item1</li>
            <li id="n5">item2</li>
            <li id="n6">item3</li>
        </ul>
    </div>  
</div>
```
```JavaScript
var $li = $("li");
// 同时向所有的li元素存储数据
$li.data("name", "CodePlayer");
$li.data("desc", "专注于编程开发技术分享");
$li.data("url", "http://www.365mini.com/");
```

#### _.extend()
_.extend()方法是Underscore.js库提供的一个方法，作用是将sources对象中的所有属性拷贝到destination对象中，并返回destination对象。
```_.extend(destination, *sources)```
- _.extend()方法的拷贝是有序的，如果有3个参数，首先将第二个参数中的所有属性拷贝到第一参数对象中，然后将第三个参数中的所有属性拷贝到第一个参数对象中，有相同属性则直接覆盖。
- 每次拷贝，如果属性是一个对象，则直接将这个对象赋给第一个参数对应属性，即第一个参数引用这个对象属性。

#### 原生js追加元素
> 采用element.insertAdjacentHTML(position, text)
- beforebegin：在 element 元素自身的前面。。
- afterbegin：在 element 插入元素内部的第一个子节点之前。
- beforeend：在 element 插入元素内部的最后一个子节点之后。
- afterend：在 element 元素自身的后面。
text 是字符串，会被解析成 HTML 或 XML，并插入到 DOM 树中。
> 位置名称的可视化：
```HTML
<!-- beforebegin -->
<p> 
<!-- afterbegin -->
这是P元素
<!-- beforeend -->
</p>
<!-- afterend -->
```
> 注意： beforebegin和afterend位置,仅在节点在树中且节点具有一个parent元素时工作.
```JavaScript
// <div id="one">one</div> 
var d1 = document.getElementById('one'); 
d1.insertAdjacentHTML('afterend', '<div id="two">two</div>');

// 此时，新结构变成：
// <div id="one">one</div><div id="two">two</div>
```