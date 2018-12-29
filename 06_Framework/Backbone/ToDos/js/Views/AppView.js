var app=app||{};

app.AppView=Backbone.View.extend({
  el:"#todoapp",
  events:{
    "keypress #new-todo"    :  "createOnEnter"
  },
  initialize(){
    this.listenTo(app.todoList,'add',this.addOne);
    app.todoList.fetch();
  },
  addOne(todo){
    console.log(todo)
    var todoView=new app.TodoView({model:todo})
    $('#todo-list').append(todoView.render().el);
  },
  createOnEnter(e){
    if(e.which!='13' || this.$("#new-todo").val()==""){
      return;
    }
    app.todoList.create({
      title : this.$("#new-todo").val().trim(),
      completed: false
    })
    this.$("#new-todo").val('');
  }
})