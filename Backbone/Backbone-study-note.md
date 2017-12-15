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
- save() 会发送POST到模型对应的url，数据格式为json{"name":"小明","age":38},接着用fetch([options])从服务器端获取数据
- fetch({url:'/man/'}) 发送get请求到/man/这个url中，服务器返回的结果样式是对应的json格式数据
```JavaScript
man1.fetch({url:'/man/',
		success:function(model,response){
    	console.log('get from server success');//model为获取到的数据
    	console.log(model.get('name'));
    },
		error:function(){
    //当返回格式不正确或者是非json数据时，会执行此方法
    alert('error');
}});
```
```JavaScript
 Man = Backbone.Model.extend({
    url:'/man/',
    initialize: function(){
        console.log('你好,你创建了我!');
        //初始化时绑定监听
        this.bind("change:name",function(){
            var name = this.get("name");
            console.log("你改变了name属性为：" + name);
        });
        this.bind("invalid",function(model,error){
            console.log("error",error);
        });
    },
    defaults: {
        name:'张三',
        age: '38'
    },
    validate:function(attributes){
        if(attributes.name == '') {
            return "name不能为空！";
        }
    },
    aboutMe: function(){
        return '我叫' + this.get('name') + ',今年' + this.get('age') + '岁';
    }
});
var man = new Man;;
man.set({name:'小明'});
man.save();  //会发送POST到模型对应的url，数据格式为json{"name":"小明","age":38}
//然后接着就是从服务器端获取数据使用方法fetch([options])
var man1 = new Man;
//第一种情况，如果直接使用fetch方法，那么他会发送get请求到你model的url中，
//你在服务器端可以通过判断是get还是post来进行对应的操作。
man1.fetch();
//第二种情况，在fetch中加入参数，如下：
man1.fetch({url:'/man/'});
//这样，就会发送get请求到/man/这个url中，
//服务器返回的结果样式应该是对应的json格式数据，同save时POST过去的格式。
//不过接受服务器端返回的数据方法是这样的：
man1.fetch({url:'/man/',success:function(model,response){
    alert('get from server success');
    //model为获取到的数据
    alert(model.get('name'));
    },error:function(){
    //当返回格式不正确或者是非json数据时，会执行此方法
    alert('error');
}});
```

### collection
1. 示例
```JavaScript
Book = Backbone.Model.extend({
  defaults : { 
    title:'默认标题'
  },
  initialize: function(){
    console.log('你好,你创建了我!');
  }
  });
  BookShelf = Backbone.Collection.extend({
      model : Book
  });

  var book1 = new Book({title : 'book1'});
  var book2 = new Book({title : 'book2'});
  var book3 = new Book({title : 'book3'});

  //var bookShelf = new BookShelf([book1, book2, book3]); 
  //实例化集合,参数为数组,或者使用add
  var bookShelf = new BookShelf;
  bookShelf.add(book1);
  bookShelf.add(book2);
  bookShelf.add(book3);
  bookShelf.remove(book3);

  //基于underscore这个js库，还可以使用each的方法获取collection中的数据
  bookShelf.each(function(book){
      console.log(book.get('title'));
  });
```
2.使用fetch从服务器端获取数据,使用reset渲染
```JavaScript
showAllBooks = function(){
  bookShelf.each(function(book){
    //将book数据渲染到页面。
    document.writeln(book.get('title'));
    });
  }
  bookShelf.bind('reset', showAllBooks);
  bookShelf.url = '/books/'; //注意这里
  bookShelf.fetch({
    reset: true, 
    success:function(collection,response, options){
        collection.each(function(book){
            console.log(book.get('title'));
        });
    },
    error:function(collection, response, options){
        console.log('error');
    }
  });
```
3. 创建collection推送到server端
创建数据，其实就是调用collection的create方法，POST对应的Model对象（json数据）到配置好的url上。之后会返回一个model的实例，如下面代码中的onebook。
```JavaScript
  var NewBooks = Backbone.Collection.extend({
    model: Book,
    url: '/books/'
  });
  var books = new NewBooks;
  var onebook = books.create({
    title: "I'm coming",
  });
```
