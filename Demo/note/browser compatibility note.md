##如果不用jQuery,则注意浏览器兼容性问题(jQuery 2.0不再对IE6/7/8进行支持,xp最高支持ie8)
- 事件绑定  
```JavaScript
function addEvent(obj, event, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(event, fn, false);//默认是false,冒泡，true为捕获
    } else {
        obj.attachEvent("on" + event, fn);//IE6/7/8不能设置，默认是冒泡,只支持冒泡
    }
}
//eg.
addEvent(document.getElementById('footer'),'click',fn);
  
function fn(e) {  
    //
    //...
    //
    //以下阻止事件传播，若用jq,如$("p").click(function(event){event.stopPropagation(); // do something });就可以了，jq已做兼容
    var e=e||window.event;
        if (e.stopPropagation) {
            e.stopPropagation();//W3C标准
        }else{
            e.cancelBubble=true;//IE6,7,8
        }
        //
}  
  
function removeEvent(obj, event, fn) {
    if (obj.removeEventListener) {
        obj.removeEventListener(event, fn, false);
    } else if (obj.detachEvent) {
        obj.detachEvent('on' + event, fn);
    }
}
//eg.
removeEvent(document.getElementById('footer'),'click',fn);
```  
小结：addEventListener()兼容firefox、chrome、safari、opera、IE9+  
attachEvent()兼容IE7,8  
  
- event事件对象  
onclick也是使用冒泡模型，onclick和标签上，如&lt;button id='btn' onclick=""&gt;&lt;/button&gt; 是一回事，标签元素对象都有该属性，即document.getElementById('btn').onclick=function(e){};而document.getElementById('btn').click();则表示触发点击行为,即会响应onclick定义的方法。
```JavaScript
document.onclick = function(e) {
    var e = e || window.event;
    console.log(e.clientX);
}
```  
小结：e兼容火狐浏览器，window.event兼容非火狐  
  
- 阻止事件传播(事件冒泡模型or事件捕获模型)
```JavaScript
document.onclick=function(e){
     var e=e||window.event;
     if (e.stopPropagation) {
         e.stopPropagation();//W3C标准
     }else{
         e.cancelBubble=true;//IE6,7,8
     }
 }
```  
  
- 阻止默认事件
一些事件的默认行为  
a标签: 默认将当前页面跳转为a标签中href的地址  
Submit按钮: 在form表单中的,提交form表单中的数据到服务器  
Button: 在PC中不做任何事情, 在手机浏览器中, 若是在form中,则是submit  
  
```JavaScript
document.onclick=function(e){
      var e=e||window.event;
      if (e.preventDefault) {
          e.preventDefault();//W3C标准
      }else{
          e.returnValue='false';//IE6,7,8
      }
  } 
```
  
  
- 关于EVENT事件中的target(IE 6,7,8不支持target)  
  
```JavaScript
document.onmouseover=function(e){
      var e=e||window.event;
      var Target=e.target||e.srcElement;//获取target的兼容写法，后面的为IE
      var from=e.relatedTarget||e.formElement;//鼠标来的地方，同样后面的为IE...
      var to=e.relatedTarget||e.toElement;//鼠标去的地方
  }
```
  
- innerText的使用(FireFox 45以下版本不支持)  
  
```JavaScript
if(obj.innerText){  
    obj.innerText = "mytext";  
  
}
else{
    obj.textContent = "mytext";   
}
  
```  
  
- js原生的ajax写法兼容性  
  
```JavaScript
var oAjax=new XMLHttpRequest();//非IE6浏览器
```  
  
```JavaScript
var oAjax=new ActiveXObject("Microsoft.XMLHTTP");//IE6浏览器
```
  
  
  
  