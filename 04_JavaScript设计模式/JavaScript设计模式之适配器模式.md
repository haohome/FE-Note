-----

title: JavaScript设计模式之适配器模式
categories: JavaScript
date: 2018-10-07
tags: [设计模式,JS]

-----

适配器模式的作用是解决两个软件实体间的接口不兼容的问题.

这在实际开发过程中会经常遇到,比如后端返回的数据api接口与前端实际需求有差异,我们就需要对数据api接口进行转换一下再使用,这就需要适配器;而在vue中最直接的提现就是computed属性

举个例子: 	当向谷歌地图和百度地图都发出显示请求时,两个地图都以各自的方式展示

```JavaScript
class GoogleMap{
    show(){
        console.log( '开始渲染谷歌地图' );
    }
}
class BaiduMap{
    show(){
        console.log( '开始渲染百度地图' );
    }
};
class RenderMap{
    constructor(map){
    if ( map.show instanceof Function ){
            map.show();
        }
    }
};
let baiduMap = new BaiduMap()
let baidu = new RenderMap(baiduMap)
let googleMap = new GoogleMap()
let google = new RenderMap(googleMap)
```

<!-- more -->

这段程序正常运行的关键是,两个地图类都提供了show的方法,假如google提供的不是show而是display方法,那我们可通过增加新的适配器来解决:

```JavaScript
class GoogleMap{
    display(){
        console.log( '开始渲染谷歌地图' );
    }
}
class GoogleAdapter{
	constructor(googleMap){
		this.googleMap = googleMap
	}
	show(){
		return this.googleMap.display()
	}
}
let g = new GoogleMap()
let googleMap = new GoogleAdapter(g)
let google = new RenderMap(googleMap)
```

适配器模式主要用来解决两个已有接口之间不匹配的问题，它不考虑这些接口是怎样实现的，也不考虑它们将来可能会如何演化。适配器模式不需要改变已有的接口，就能够使它们协同作用。
