var Zepto = (function(){
  var $,zepto;
  zepto.init=function(selector,context){

  }
  $ = function(selector,context){
    return zepto.init(selector,context)
  }
})()
window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)