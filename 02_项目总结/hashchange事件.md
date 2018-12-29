-----

title: hashchange事件
category: JavaScript
date: 2018-08-28
tags: [JavaScript,hash,兼容性]

-----

> 最近在写公司的后台管理系统，因为需求需要刷新后保持原来页面,原有的单页面组件跳转方式不能满足，所以在原有项目基础上增加了路由功能,目前比较简单的路由切换就是通过监听hash变化，实现不同页面的加载。

当 一个窗口地址的 hash （URL 中 # 后面的部分）改变时就会触发 hashchange 事件:

```JavaScript
window.onhashchange = handleHashChange;
window.addEventListener("hashchange",function(event){
    //hash变化的处理逻辑
})
```

<!-- more -->

hashchange 事件回调函数对象主要有两个参数会用到:

- newURL: 当前页面新的URL

- oldURL: 当前页面旧的URL

但在IE浏览器里,这两个属性不被支持,需要在绑定hashchange事件前添加以下代码:

```JavaScript
if(!window.HashChangeEvent)(function(){
	var lastURL=document.URL;
	window.addEventListener("hashchange",function(event){
		Object.defineProperty(event,"oldURL",{enumerable:true,configurable:true,value:lastURL});
		Object.defineProperty(event,"newURL",{enumerable:true,configurable:true,value:document.URL});
		lastURL=document.URL;
	});
}());
```

