var app=app||{};

app.TodoCollection=Backbone.Collection.extend({
  model:app.Todo,
  localStorage:new Backbone.LocalStorage("todo")
})

app.todoList=new app.TodoCollection();