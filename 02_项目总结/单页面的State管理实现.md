-----

title: 单页面的State管理实现
category: JavaScript
date: 2018-12-08
tags: [JavaScript,state]

-----

> 单页面实现了页面不重载,可以缓存较多的数据,有时不同页面组件模块需要实现数据实时共享,状态管理就很有必要.

状态管理：顾名思义,主要就是统一管理存储在不同组件的数据,实现数据统一的处理。

现在有很多第三方的状态管理库,如Vuex,Redux等,都是对Flux思想的实现,Flux的思维方式是单向的,将各组件的数据统一存储,组件需要修改数据时需要触发预先定义的方法,数据修改后会应用到组件上,实现数据层的修改,形成一个单向数据流

借用vue官方对“单向数据流”介绍的示意图

<img src="https://haohome.top/18-12-8/26665647.jpg" width='60%'/>

有个比方很恰当:图书馆的管理，原来是开放式的，所有人可以随意进出书库借书还书，如果人数不多，这种方式可以减少流程，增加效率，一旦人数变多就势必造成混乱。Flux 就像是给这个图书馆加上了一个管理员，所有借书还书的行为都需要**委托管理员**去做，管理员会规范对书库的操作行为，也会记录每个人的操作，减少混乱的现象。

State库的实现思路:

- 利用观察者模式,实现事件的订阅和发布模块;
- 定义Store仓库类,数据代理,改变数据的方法,状态记录等;
- 实例化一个Store仓库,注册相关改变数据事件;
- 创建订阅数据状态变化组件,使子组件继承方法,将状态变化方法存放在主题事件数组中

## 订阅/发布模块

订阅/发布在我们的生活中应用非常广发,比如我们阅读某个微信公众号的文章,如果我们没有关注它就只能自己去找到这个公账号去阅读,当我们关注了这个公众号,公众号有新文章推送时,所有订阅公众号的人都收到了新文章的通知,文章推送就是一个典型的订阅/发布模式.

```JavaScript
export default class Subject {
  constructor() {
    // 定义一个事件池,保存我们定义的事件
    this.events = {}
  }
  /**
   * 订阅
   * @param  event 用于指定唯一的事件名字
   * @param  callback 
   * @description 判断传递的event事件是否存在事件池中,如果存在,在该事件数组中追加一个新的方法
   */
  subscribe(event, callback) {
    var self = this
    // 如果事件池中没有该事件序列,就赋值空数组
    if (!self.events.hasOwnProperty(event)) {
      self.events[event] = []
    }
    return self.events[event].push(callback);
  }
  /**
   * 取消订阅,从订阅主题事件数组中移除事件
   * @param  event 
   * @param  index 
   */
  unsubscribe(event, index) {
    return this.events[event].splice(index, 1)
  }
  /**
   * 发布, 回调触发所有该主题的事件
   * @param  event 
   * @param  data 
   * @description 判断传递的event事件是否存在事件池中,如果存在,遍历执行该事件数组中所有方法
   */
  publish(event, data = {}) {
    // 如果没有该事件序列,直接返回
    if (!this.events.hasOwnProperty(event)) {
      return []
    }
    // 遍历执行该事件序列
    return this.events[event].map(callback => callback(data))
  }
}
```

## Store仓库

Store是我们状态管理的核心对象:

里面的state集合包含了应用的所有状态,采用代理state方法用来监听状态变化,发布事件池中的事件;

改变状态数据的方法集合有`actions`和`mutations`:`dispatch` 用于执行 `actions`，`commit` 用于执行 `mutations`

`status` 属性用来判定 Store 对象在任意时刻的行为,实例化(`new Subject()`)一个订阅发布对象作为Store仓库的事件池,

`components`属性用来记录组件,避免该组件的事件被重复订阅到事件序列中

在Store.js中引入订阅/发布模块:`import Subject from './Subject'`

```JavaScript
export default class Store {
  constructor(params) {
    var self = this
    this.mutations = params.mutations ? params.mutations : {}
    this.actions = params.actions ? params.actions : {}
    this.status = 'resting'	//当前Store对象行为
    this.events = new Subject()	// 事件池
    this.components = [] // 用来记录相应组件

    this.state = new Proxy((params.state || {}), {
      get(state, key) {
        return state[key]
      },
      set(state, key, val) {
        state[key] = val;
        console.log(`状态变化: ${key}: ${val}`);
        // 触发所有状态变化的方法
        self.events.publish('stateChange', self.state);
        if (self.status !== 'mutation') {
          console.warn(`需要采用mutation来改变状态值`);
        }
        self.status = 'resting';
        return true;
      }
    })
  }
  /**
   * 修改状态属性值的方法
   * @param  key 的方法属性名 
   * @param  newVal 状态的新值 
   */
  commit(key, newVal) {
    if (typeof (this.mutations[key]) != 'function') {
      return fasle
    }
    console.groupCollapsed(`MUTATION: ${key}`);
    this.status = 'mutation';
    this.mutations[key](this.state, newVal);
    console.groupEnd();
    return true;
  }
  /**
   * 分发执行mutations的方法
   * @param  key 的方法属性名 
   * @param  newVal 状态的新值 
   */
  dispatch(key, newVal) {
    if (typeof (this.actions[key]) != 'function') {
      return fasle
    }
    setTimeout(()=>{
      console.groupCollapsed(`ACTION: ${key}`);
      self.status = 'action';
      this.actions[key](this, newVal);
      console.groupEnd();
      return true
    },0)
  }
}
```

实例化Store仓库(StoreComponent):

```JavaScript
import Store from "./Store";
let state = {
  count: 0
}
let mutations = {
  addCount(state, val) {
    state.count = val
    console.log('state.count:', state.count)
  },
  minusCount(state, val) {
    state.count = val
    console.log('state.count:', state.count)
  }
}
let actions = {
  updateCount(context, val) {
    context.commit('addCount', val);
  }
}
export default new Store({
  state,
  mutations,
  actions
})
```

## 订阅状态变化

在状态变化订阅系统中,得到组件的`update`方法,没有就创建一个空的方法,需要检查确认 `store` 方法是否是 `Store` 类的实例,如果是就,订阅了一个 `stateChange` 事件让程序得以响应,这样每次 state 变化都会触发 `update` 方法。

> 这里需要注意的是:订阅`stateChange`事件前,需要判断一下当前组件是否已经再Store中注册,如果已经注册,则不需要重复注册和订阅

```JavaScript
import Store from './Store'
export default class StateChange {
  constructor(props = {}) {
    this.update = this.update || function () {};
    if (props.store instanceof Store) {
      // 状态改变就触发页面重新渲染
      var hash = location.hash.split("?")[0]
      if (props.store.components.indexOf(hash) === -1) {
        props.store.events.subscribe('stateChange', () => this.update());
        props.store.components.push(hash)
      }
    }
  }
}
```

到这一个,一个状态管理系统基本完成,下面就根据该系统创建几个组件实现以下.

## 业务组件

Count.js

```javascript
import StateChange from '@/common/lib/store/StateChange'
import store from '@/common/lib/store/StoreComponent'
export default class Count extends StateChange {
  constructor($el) {
    super({
      store
    })
    this.$el = $el
    this.render()
    // 当前组件事件绑定,类似backbone.js
    // 等同于=== $("#add1").on('click',this.mutationsAdd)
    this.events = {
      'click #add1': 'mutationsAdd',
      'click #add2': 'dispatchAdd'
    }
  }
  render() {
    // 采用art-templet模板引擎
    var countTmpl = require('./countTmpl.art')
    this.$el.html(countTmpl({
      count: store.state.count
    }))
  }
  update() {
    console.log('store组件更新了')
    this.$el.find("#count").text(store.state.count)
  }
  mutationsAdd() {
    var count = store.state.count;
    count++
    store.commit('addCount', count)
  }
  dispatchAdd() {
    var count = store.state.count;
    count += 2
    store.dispatch('updateCount', count)
    console.log('state.count:', store.state.count)
  }
}
```

页面`countTmpl.art`

```html
<h2 id='count' style='color:red'><%=count%></h2>
<a href="#/state/anotherCount" class="btn">加载子页面</a>
<button id='add1' class="btn">mutation加1</button>
<button id='add2' class="btn">dispath加2</button>
```

另一个计数组件AnotherCount.js

```javascript
import StateChange from '@/common/lib/store/StateChange'
import store from '@/common/lib/store/StoreComponent'
export default class Detail extends StateChange{
  constructor($el) {
    super({
      store,
    })
    this.$el = $el
    this.render()
    this.events={
      'click #minus': 'mutationMinus',
    }
  }
  render() {
    var anotherCountTmpl = require('./anotherCountTmpl.art')
    this.$el.html(anotherCountTmpl({
    	count: store.state.count
    }))
  }
  mutationMinus(){
    var count = store.state.count;
    count-=1
    store.commit('minusCount',count)
  }
  update(){
    console.log('详情更新',store.state.count)
  }
}
```

页面`anotherCountTmpl.art`

```html
<h2 id='count' style='color:red'><%=count%></h2>
<button id='minus' class='btn'>mutations减1</button>
```



