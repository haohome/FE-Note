-----

title: JavaScript设计模式之单例模式
categories: JavaScript
date: 2018-10-06
tags: [设计模式,JS]

-----

单例模式是保证一个类仅有一个实例，并提供一个访问它的全局访问点

> 实现方式:用一个变量来标志当前是否已经为某个类创建过对象,若是,则在下一次获取该类实例时,直接返回之前创建的对象

```JavaScript
class SingleObject{
    constructor(instance){
        this.instance = instance
    }
    login(){
        console.log('登录框弹窗')
    }
}
SingleObject.getInstance = function(){
    if(!this.instance){
      this.instance = new SingleObject()
    }
    return this.instance
}
let obj1 = SingleObject.getInstance()
obj1.login()
let obj2 = SingleObject.getInstance()
obj2.login()
console.log('obj1===obj2',obj1===obj2)
```

通过`SingleObject.getInstance`来获取SingleObject类的唯一对象

<!-- more -->

 应用场景: 网站的登录框通常只有一个实例

```JavaScript
class LoginForm{
    constructor(){
        this.state = 'hide'		// 默认隐藏
    }
    show(){
        if(this.state === 'show'){
            alert('已经显示')
            return
        }
        this.state = 'show'
        console.log('登录框显示成功')
    }
    hide(){
        if(this.state === 'hide'){
            alert('已经隐藏')
            return
        }
        this.state = 'hide'
        console.log('登录框隐藏成功')
    }
}
LoginForm.getInstance = (function(){
    let instance
    console.log('外部',instance)
    return function(){
        console.log('内部',instance)
        if(!instance){
            instance = new LoginForm()
        }
        return instance
    }
})()
// test
let login1 = LoginForm.getInstance()
login1.show()
let login2 = LoginForm.getInstance()
login2.show()
```

