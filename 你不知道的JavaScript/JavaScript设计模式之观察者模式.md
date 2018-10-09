-----

title: JavaScript设计模式之观察者模式
categories: JavaScript
date: 2018-10-07
tags: [设计模式,JS]

-----

> 观察者模式又叫发布— 订阅模式,它定义对象间的一种一对N的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。

看个例子:

<img src="https://haohome.top/18-10-7/25462182.jpg" width="60%"/>

```JavaScript
// 主题
class Subject{
    constructor(){
        this.state = 0
        this.observers = []
    }
    getState(){
        return this.state
    }
    setState(state){
        this.state = state
        this.notifyAllObservers()
    }
    attach(observer){
        this.observers.push(observer)
    }
    notifyAllObservers(){
        this.observers.forEach(item=>{
            item.update()
        })
    }
}
// 观察者
class Observer{
    constructor(name,subject){
        this.name = name
        this.subject = subject
        this.subject.attach(this)
    }
    update(){
        console.log(`${this.name}更新,state为${this.subject.getState()}`)
    }
}

// 实例化一个主题
let subject = new Subject
// 实例化两个订阅者,订阅一个相同主题
let o1 = new Observer('o1',subject)
let o2 = new Observer('02',subject)
// 当改变主题中的状态时,触发订阅者的更新
subject.setState(1)
```

看到这段代码中,一个主题对象状态改变, 依赖它的订阅者都会得到通知