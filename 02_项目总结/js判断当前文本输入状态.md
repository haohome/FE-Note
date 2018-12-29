-----
title: JS判断当前文本输入状态
category: JavaScript
date: 2018-08-28
tags: [JavaScript,input]

-----

> 最近在重构我的网址导航页面,这是我认识前端网页的启蒙项目,网上找的模板,然后修改链接、微调样式，成为了最初的网页导航1.0。

在搜索的时候，我们需要按`Enter`键实现直接跳转搜索，因此添加了按键监听事件。但问题出现了:

- 绑定`keyup`事件会将输入法中的英文文字输入到文字框并直接触发搜索按钮

- 单纯按键监听，并没有判断中文输入状态

<!-- more -->

网上查了一些资料：

1. 键盘事件:
   当一个键盘被按下并松开时,每个浏览器都会触发三个事件:`keydown、keypress、keyup`
   `keydown`事件发生在按键被按下的时候，接着触发`keypress`，松开按键的时候触发`keyup`事件

   还有一个事件就是`input`:input事件能够检测用户的每一次输入

   以上事件在英文状态下没有问题,但在中文状态下,依然捕获到的是英文,如下图:

   ![image](https://haohome.top/18-8-28/85753032.jpg)

2. 中文输入法

   > `firfox`：输入触发`keydown`，回车确认输入触发`keyup`
   > `chrome`：输入触发`keydown`、`keyup`，回车确认输入只触发`keydown`
   > `IE`：输入触发`keydown`、`keyup`，回车确认输入触发`keydown`，`keyup`
   > `Safari`：输入触发`keydown`、`keyup`，回车确认输入触发`keydown`，`keyup`
   > `opera`：输入触发`keydown`、`keyup`，回车确认输入触发`keydown`，`keyup`
   > 在`input`、`textarea`中，中文输入法时：没有触发`keypress`事件
   > `keypress`事件：对中文输入法支持不好，无法响应中文输入；无法响应系统功能键

<iframe width="100%" height="300" src="//jsrun.net/bmgKp/embedded/all/light/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

**解决方案**:

1. 利用`change`事件:

   监听输入框最终内容变化识别,当文本输入状态完成,并且`input`失去焦点再触发`enter`事件

   > 通常情况下,文本框中文输入状态时,按下回车会触发相应的按钮,此时`input`会失去焦点并触发`change`事件,此时将输入状态传给按钮事件,即可判断并执行相应事件

2. 利用`compositionstart`和`compositionend`事件(事件不兼容旧浏览器)

   `compositionstart`:事件触发于一段文字的输入之前

   `compositionend`事件:当文本段落的组成完成或取消时, `compositionend `事件将被激发

   简单来说，非直接输入法如中文输入开始时，触发`compositionstart`事件，结束时触发`compositionend`事件

   两类解决方案都可以监听到当前输入框的输入状态,结合input事件，就能对所有的输入进行实时的检测了

```JavaScript
var doing=false;
var doSomething=function(e){
    //我要干点啥
}
document.getElementById('testInput').addEventListener('compositionstart',function(e){
    doing=true;
},false);
document.getElementById('testInput').addEventListener('input',function(e){
    if(!doing){
        doSomething();
    }
},false);

document.getElementById('testInput').addEventListener('compositionend',function(e){
    doing=false;
    doSomething();
},false);
```

