入口文件中声明store

```JavaScript
let vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
Vue.use({
  vm
})
```

store.js中引入相关模块

```JavaScript
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    cart,
    products
  }
})
export default store
```

