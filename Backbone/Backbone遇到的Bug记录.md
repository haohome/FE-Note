### 1. Backbone中密码重置step

```flow
s=>start: 步骤1 
输入用户名、图形验证码
sub1=>subroutine: 查询用户信息
(Mobile,ID,Email)
o2=>operation: 步骤2
根据用户信息发送验证码
c1=>condition: 验证信息

o3=>operation: 步骤3
输入新、旧密码，
输入验证码
c2=>condition: 验证信息

e=>end: 登录成功
s(right)->sub1->o2->c1
c1(no)->o2
c1(yes)->o3->c2
c2(no)->o3
c2(yes)->e
```

密码重置对安全要求非常高,不可以通过路由控制实现重置步骤页面渲染,否则用户可直接输入网址直接进入修改密码步骤,这是我做过一次错误的案例:
- 路由Router
```JavaScript
var Router=Backbone.Router.extend({
   routes:{
    "resetpwd(/:num)"  :  "controller/resetPwd"  //重置密码
  }
})
```
- 控制器Controller
```JavaScript
var resetPwd=new ResetPwd({el:$('body),model:{step:num||1}})
```


