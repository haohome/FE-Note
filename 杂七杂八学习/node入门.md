------
title: Node.js学习记录
categories: JavaScript
date: 2018-1-21
tags: node

------

### 1. events事件

```JavaScript
//1.引入events
const events=require('events');
//2.创建事件实例
var myEmitter = new MyEmitter();
//3.监听事件
myEmitter.on('event', () => {
  console.log('触发了一个事件！');
});
//4.触发事件
myEmitter.emit('event');
```

