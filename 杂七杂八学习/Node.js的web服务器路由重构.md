------
title: Node.js的web服务器路由重构
categories: JavaScript
date: 2018-05-02 23:32
tags: [node,JavaScript]

------

<img src='https://haohome.top/18-5-3/35609573.jpg' width="40%">

Node使JavaScript操作服务器成为可能，同时其带来了强大的文件操作方法。我们在创建一个服务器时，会遇到路由切换的问题，当前express等库是可以识别不同路由并执行不同操作的，最近在回顾Node.js的一些用法，这里就尝试采用原生的方法重构一个路由功能。

原始路由方法：

```JavaScript
const http=require('http');
const fs=require('fs');
let server=http.createServer(function(req,res){
  if(req.url=='/index'){
    res.writeHead(200, {'Content-Type':'text/html;charset=UTF-8'});
    res.write('<h1>这是首页</h1>')
  }else if(req.url=='/products'){
    res.writeHead(200, {'Content-Type':'text/html;charset=UTF-8'});
    res.write('<h1>这是产品页</h1>')
  }else if(req.url=='/detail'){
    res.writeHead(200, {'Content-Type':'text/html;charset=UTF-8'});
    res.write('<h1>这是详情页</h1>')
  }else{
    res.writeHead(404, {'Content-Type':'text/html;charset=UTF-8'});
    res.write('<h1>这是404页</h1>')
  res.end('欢迎来到NodeJs');
})
server.listen(3000);
console.log('开始监听3000端口')
```

<!-- more -->

这样的路由方法看似结构清晰，但实际情况比这复杂的多，有大量的路由和相应的页面响应方法，就会显得臃肿了。

其实，我们可以采用ES6的模块语法，使创建服务器、路由控制、地址处理方法执行分别处于不同模块，最终在一个入口文件中引入：

服务器模块:

```JavaScript
const http=require('http');
//1.http创建服务器并监听端口方法
function startServer(route,handle){
  var onRequest=function(req,resp){
    //路由处理
    route(handle,req.url,resp);
  }
  //http创建服务器
  var server= http.createServer(onRequest)
  //服务器监听3000端口
  server.listen(3000,'127.0.0.1');
  console.log('运行在3000端口');
}
//2.导出路由模块
module.exports.startServer = startServer;
```

地址处理方法:

```JavaScript
const fs=require('fs');
//网站默认图标
function favicon(resp){
  fs.createReadStream(__dirname +'/favicon.ico').pipe(resp);
}
//首页
function index(resp){
  fs.createReadStream(__dirname +'/index.html','utf8').pipe(resp);
}
//产品页
function products(resp){
  fs.createReadStream(__dirname +'/products.html','utf8').pipe(resp);
}
//详情页
function detail(resp){
  fs.createReadStream(__dirname +'/detail.html','utf8').pipe(resp);
}
//将不同页面的方法导出
module.exports={
  index:index,
  products:products,
  detail:detail,
  favicon:favicon
}
```

路由模块:

```JavaScript
const fs=require('fs');
//1.路由处理方法
function route(handle,url,resp){
  if(typeof handle[url] ==='function'){
    resp.writeHead(200, {'Content-Type':'text/html;charset=UTF-8'});
    handle[url](resp);
  }else{
    resp.writeHead(404, {'Content-Type':'text/html;charset=UTF-8'});
    fs.createReadStream(__dirname+'/404.html','utf8').pipe(resp);
  }
}
module.exports.route=route;
```

入口app.js

```javascript
var server=require('./server');
var router=require('./router')
var handler = require('./handler');

//1.匹配url地址,
var handle = {};
handle["/"] = handler.index;
handle['/index'] = handler.index;
handle['/products'] = handler.products;
handle['/detail'] = handler.detail;
handle['/favicon.ico'] = handler.favicon;

//2.启动服务器
server.startServer(router.route,handle)
```

这样如果增加路由页面，只需在相应的位置依次增加即可，结构清晰！

当使用GET或POST请求时，需要对服务器模块做一些更改:

1. 请求为GET时,解析路由地址'?'后面的query语句;
2. 请求为POST时,监听数据流并解析;

```JavaScript
const http=require('http');
const url=require('url');
const queryString=require('querystring');
function startServer(route,handle){
  var onRequest=function(req,resp){
    //url路径
    var pathName=url.parse(req.url).pathname;
    
    //请求为POST时,监听数据流
    if(req.method=="POST"){
      var data="";
      req.on('error',function(err){
        console.log(err);
      }).on('data',function(chunk){
        data+=chunk;
      }).on('end',function(){
      var params=queryString.parse(data);
      route(handle,pathName,resp,params);
      })
    }
    //请求为GET时,解析路由query
    else{
      var params=url.parse(req.url,true).query;
      route(handle,pathName,resp,params);
    }
  }
  var server= http.createServer(onRequest)
  server.listen(3000,'127.0.0.1');
  console.log('运行在3000端口');
}
module.exports.startServer = startServer;


```

相应的，增加router和handler的传参。

详细代码：[Demo-web](https://github.com/yifoo/Node/tree/master/Demo-web)

