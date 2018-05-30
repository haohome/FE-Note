----

title: Vuex入门基础
categories: JavaScript
tags: [JavaScript,vue]
date: 2018-05-14

----

## 1. Vuex 概念

Vuex 是一个**状态管理模式**,它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

每一个 Vuex 应用的核心就是 store(仓库)，在store中包含组件中的共享**状态**`state`和改变状态的**方法**`mutations`。

**store仓库**

```JavaScript
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
})
```

> 1) Vuex 的状态存储是响应式的
> 2) 不能直接改变 store 中的状态,需显式地**提交 (commit) mutation**

<!-- more -->

## 2. State单一状态树

用一个对象包含全部的应用层级状态

Vuex 通过 `store` 选项，将状态从根组件“注入”到每一个子组件中,子组件需调用 `Vue.use(Vuex)`：

根组件:

```JavaScript
//根组件:
const app = new Vue({
  el: '#app',
  store, // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  components: { Counter },
})
```

子组件: 通过`computed`(计算属性)返回`this.$store.state.count`来获取相应数据

```JavaScript
const Counter = {
  computed: {
    count () {
      return this.$store.state.count	//获取根组件的state
    }
  }
}
```

### mapState 辅助函数 	

简化生成计算属性

```JavaScript
import { mapState } from 'vuex';
export default {
    computed: mapState ({
        count: state => state.count,
        countAlias: 'count',    // 别名 `count` 等价于 state => state.count
    })
}
```

还可以更简化:

```JavaScript
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```

## 3. Getter 从 store 中的 state 派生出状态

如果我们需要对`state`对象进行做处理计算，如对列表进行过滤并计数:

```JavaScript
computed: {
    doneTodosCount () {
        return this.$store.state.todos.filter(todo => todo.done).length
    }
}
```

如果多个组件都要进行这样的处理，那么就要在多个组件中复制该函数,这样效率低下。

Vuex中`getters`对象，可以方便我们在`store`中做集中的处理,Getters接受`state`作为第一个参数：:

```JavaScript
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

Getter 会暴露为 `store.getters` 对象，可以以属性的形式访问这些值：

```JavaScript
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getter 也可以接受其他 getter 作为第二个参数：

```JavaScript
getters: {
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
store.getters.doneTodosCount // -> 1
```

### mapGetters辅助函数

与`mapState`类似，都能达到简化代码的效果
`mapGetters`辅助函数仅仅是将store中的getters映射到局部计算属性：

```JavaScript
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // 使用对象展开运算符将 getters 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

也可写作:

```JavaScript
computed: mapGetters([
    'doneTodosCount',
    'anotherGetter',
    // ...
])
```

所以在Vue的`computed`计算属性中会存在两种辅助函数：

```JavaScript
import { mapState, mapGetters } from 'vuex';

export default {
    // ...
    computed: {
        mapState({ ... }),
        mapGetter({ ... })
    }
}
```

## 4. Mutation 更改 Vuex 的 store 中的状态

每个 mutation 都有一个字符串的 **事件类型 (type)** 和 一个 **回调函数 (handler)**

```javascript
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {	//type:'increment'
      // 变更状态
      state.count++
    }
  }
})
```

要唤醒一个 mutation handler，你需要调用 **store.commit** 方法调用`mutation type`: `store.commit('increment')`

### 提交载荷（Payload）

 向 `store.commit` 传入第二个参数,也就是mutation的`payload`:

```javascript
mutations: {
  increment (state, n) {
    state.count += n
  }
}
store.commit('increment', 10)
```

单单传入一个`n`，可能并不能满足我们的业务需要，这时候我们可以选择传入一个`payload`对象：

```JavaScript
mutation: {
    increment (state, payload) {
        state.totalPrice += payload.price + payload.count;
    }
}
```

### 对象风格的提交方式

提交 mutation 的另一种方式是直接使用包含 `type` 属性的对象：

```javascript
store.commit({
  type: 'increment',
  amount: 10
})
```

### mapMutations函数

使用`mapMutations`辅助函数将组件中的`methods`映射为`store.commit`调用。

```JavaScript
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment' // 映射 this.increment() 为 this.$store.commit('increment')
    ]),
    ...mapMutations({
      add: 'increment' // 映射 this.add() 为 this.$store.commit('increment')
    })
  }
}
```

## 5. Action

- Action 提交的是 mutation，而不是直接变更状态。
- Action 可以包含任意异步操作。

在vuex中,mutation是同步事件:`store.commit('increment')`

```JavaScript
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 `context.commit` 提交一个 mutation，或者通过 `context.state` 和 `context.getters` 来获取 state 和 getters。

### 分发Action

Action 通过 `store.dispatch` 方法触发：`store.dispatch('increment')`;

Actions 支持同样的载荷方式和对象方式进行分发：

```JavaScript
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

### 在组件中分发Action

在组件中使用 `this.$store.dispatch('xxx')` 分发 action，或者使用 `mapActions` 辅助函数将组件的 methods 映射为 `store.dispatch` 调用

```JavaScript
import { mapActions } from 'vuex'
export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

### 组合 Action

Action 通常是异步的，如何知道 action 什么时候结束呢？更重要的是，我们如何才能组合多个 action，以处理更加复杂的异步流程？

首先，你需要明白 `store.dispatch` 可以处理被触发的 action 的处理函数返回的 Promise，并且 `store.dispatch` 仍旧返回 Promise：

```JavaScript
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

这样就可以:

```JavaScript
store.dispatch('actionA').then(() => {
  // ...
})
```

在另外一个 action 中也可以：

```JavaScript
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

如果我们利用 [async / await](https://tc39.github.io/ecmascript-asyncawait/)，我们可以如下组合 action：

```JavaScript
// 假设 getData() 和 getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

> 一个 `store.dispatch` 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。

最后,vuex需要遵守一些规则:

> 1. 应用层级的状态应该集中到单个 store 对象中。
> 2. 提交 **mutation** 是更改状态的唯一方法，并且这个过程是同步的。
> 3. 异步逻辑都应该封装到 **action** 里面。











