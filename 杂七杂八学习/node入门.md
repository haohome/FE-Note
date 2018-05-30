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

### 2. fs文件

#### 2.1 文件读写

```JavaScript
//1.引入fs
const fs=require('fs');
//2.读data.txt文件
fs.readFile(__dirname+'/data.txt',function(err,txt) {
  console.log(txt.toString());
})
//3.写内容到data2.txt文件
var content='hello world';
fs.writeFile(__dirname+'/data2.txt',content,function(err) {
  console.log('已完成写入')
})
```

#### 2.2 文件复制

 ```JavaScript
//1.引入fs
const fs=require('fs');
//2.读data.txt文件
var readFile=fs.readFileSync(__dirname+'/data.txt',function(err,txt) {
  console.log(txt.toString());
})
//3.将读取的文件写入到新文件中,这里的文件读取需要是同步的读取
fs.writeFile(__dirname+'/data2.txt',readFile,function(err) {
  console.log('已完成写入')
})
 ```

**文件流与管道复制**

```JavaScript
//1.引入fs
const fs=require('fs');
//2.读取test.txt文件流
var rs = fs.createReadStream(__dirname+'/test.txt'),'utf8');
var str='';
rs.on('data', function (chunk) {
    str+=chunk;
});
rs.on('end', function () {
    console.log('接收完毕');
});
//3.创建一个写入流,并利用管道接收完成复制
var ws = fs.createWriteStream(__dirname+'/test1.txt'));
rs.pipe(ws)
```

