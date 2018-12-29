var app=app||{};

app.TodoView=Backbone.View.extend({
  tagName:"li",
  itemTemplate:_.template($("#item-template").html()),
  initialize:function(){
    this.listenTo(this.model,'change',this.render)
  },
  render(){
    this.$el.html(this.itemTemplate(this.model.attributes));
    this.$el.toggleClass("done",this.model.get("completed"));
    this.input=this.$(".edit");
    return this;
  },
  events:{
    "click .toggle"   :   "toggleCompleted",
    "dblclick .view"  :   "edit",
  },
  toggleCompleted:function(){
    this.model.toggle();
  },
  edit:function(){
    console.log(this.input)
    $(this.el).addClass("editing");
    this.input.focus();
  }
  
})