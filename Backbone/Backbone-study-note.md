### Model
1.简单的对象
```JavaScript
Man = Backbone.Model.extend({
      initialize: function(){
          console.log('你好,你创建了我!');
      }
      });
      var man = new Man;
```
2.对象赋值的两种方法:直接定义默认值和赋值定义
```JavaScript
 Man = Backbone.Model.extend({
        initialize: function(){
          console.log('你好,你创建了我!');
        },
        defaults: {
            name:'张三',
            age: '38'
        }
    });
      var man = new Man;
      man.set{name:"李四"};  //赋值定义
      console.log(man.get("name"))
```
3.监听属性方法:bind
```JavaScript
Man = Backbone.Model.extend({
        initialize: function(){
            console.log('你好,你创建了我!');
            //初始化时绑定监听
            this.bind("change:name",function(){
                console.log("你改变了name属性为：" + this.get("name"));
            });
        },
        defaults: {
            name:'张三',
            age: '38'
        },
        aboutMe: function(){
            return '我叫' + this.get('name') + ',今年' + this.get('age') + '岁';
        }
    });
    var man = new Man;
    man.aboutMe();
    man.set({name:'小明'});  //触发绑定的change事件，输出。
    man.aboutMe();
```
4.为对象添加验证规则,以及错误提示
```JavaScript
  Man = Backbone.Model.extend({
      initialize: function(){
          console.log('你好,你创建了我!');
          //初始化时绑定监听
          this.bind("change:name",function(){
              var name = this.get("name");
              console.log("你改变了name属性为：" + name);
          });
          this.bind("invalid",function(model, error){ // 当model在客户端 validation（验证）失败时触发。
              console.log(error);
          });
      },
      defaults: {
          name:'张三',
          age: '38'
      },
      validate:function(attributes, options){
          if(attributes.name == '') {
              return "name不能为空！";
          }
      },
      aboutMe: function(){
          return '我叫' + this.get('name') + ',今年' + this.get('age') + '岁';
      }
  });
  var man = new Man;
//  这种方式添加错误处理也行
/*  man.on('invalid', function(model, error){
      alert(error);
    });
*/
  man.set({name:''});
  man.set({name:''}, {'validate':true});  //手动触发验证, set时会触发
  man.save(); //save时触发验证。根据验证规则，弹出错误提示。
```
5.对象的获取和保存