CORS是一个W3C标准,全称是"跨域资源共享"(Cross-origin resource sharing)。它允许浏览器向夸源服务器发出XMLHttpRequest请求，克服Ajax只能同源使用的限制。

### 一、简介
CORS需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE浏览器不能低于IE10。
整个CORS通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS通信与同源的AJAX通信没有差别，代码完全一样。浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。
因此，实现CORS通信的关键是服务器。只要服务器实现了CORS接口，就可以跨源通信。
### 二、两种请求
浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。
- 2.1简单请求
  简单请求满足一下两大条件
  (1)请求方法时一下三种方法之一
  - HEAD
  - GET
  - POST

  (2)HTTP的头信息不超出一下几种字段:
  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

  > 凡是不同时满足上面两个条件，就属于非简单请求。

  - 2.1.1 基本流程
  对于简单请求，浏览器直接发出CORS请求。具体来说，就是在头信息之中，增加一个```Origin```字段。
  > 下面的例子,浏览器发现这次跨源AJAX请求是简单请求，就自动在头信息之中，添加一个```Origin```字段。
  ```JavaScript
  GET /cors HTTP/1.1
  Origin: http://api.bob.com
  Host: api.alice.com
  Accept-Language: en-US
  Connection: keep-alive
  User-Agent: Mozilla/5.0...
  //上面的头信息中，Origin字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。
  ```
  - 如果```Origin```指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应。浏览器发现，这个回应的头信息没有包Access-Control-Allow-Origin字段（详见下文），就知道出错了，从而抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。
  > 这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200

  - 如果Origin指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。
  ```JavaScript
  //浏览器响应头res
  Access-Control-Allow-Origin: http://api.bob.com
  Access-Control-Allow-Credentials: true
  Access-Control-Expose-Headers: FooBar
  Content-Type: text/html; charset=utf-8
  //上面的头信息之中，有三个与CORS请求相关的字段，都以Access-Control-开头。
  ```

  - (1)Access-Control-Allow-Origin(必须)
  该字段是必须的。受任意域名的请求。

  - (2)Access-Control-Allow-Credentials(可选)
  它的值是一个布尔值，表示是否允许发送**Cookie**。
  默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可。

  - (3)Access-Control-Expose-Headers(可选)
  CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。上面的例子指定，getResponseHeader('FooBar')可以返回FooBar字段的值。

  - 2.1.2 withCredentials 属性
  上面说到，CORS请求默认不发送Cookie和HTTP认证信息。如果要把Cookie发到服务器，一方面要服务器同意，指定```Access-Control-Allow-Credentials```字段。
  ```JavaScript
  Access-Control-Allow-Credentials: true
  ```
  同时开发者必须在AJAX请求中打开```withCredentials```属性。
  ```JavaScript
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  ```
  这样就能向服务器发送Cookie,服务器才能获得SessionId;
  否则，即使服务器同意发送Cookie，浏览器也不会发送。或者，服务器要求设置Cookie，浏览器也不会处理,这时服务器会新建一个新的Cookie的Id号。
  > 但是，有时即使省略withCredentials设置，有的浏览器还是会一起发送Cookie。这时，可以显式关闭withCredentials。
  ```JavaScript
  xhr.withCredentials = false;
  ```
**注意**:如果要发送Cookie，Access-Control-Allow-Origin就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie依然遵循同源政策，只有用服务器域名设置的Cookie才会上传，其他域名的Cookie并不会上传，且（跨源）原网页代码中的document.cookie也无法读取服务器域名下的Cookie。

- 2.2非简单请求
 - 2.2.1预检请求
 非简单请求是那种对服务器有特殊要求的请求，比如请求方法是PUT或DELETE，或者Content-Type字段的类型是application/json。
 非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）。
 浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。

 下面是一段浏览器的JavaScript脚本。
 ```JavaScript
 var url = 'http://api.alice.com/cors';
  var xhr = new XMLHttpRequest();
  xhr.open('PUT', url, true);
  xhr.setRequestHeader('X-Custom-Header', 'value');
  xhr.send();
  //上面代码中，HTTP请求的方法是PUT，并且发送一个自定义头信息X-Custom-Header。
 ```
 浏览器发现，这是一个非简单请求，就自动发出一个"预检"请求，要求服务器确认可以这样请求。
 下面是这个"预检"请求的HTTP头信息。
 ```JavaScript
  OPTIONS /cors HTTP/1.1
  Origin: http://api.bob.com
  Access-Control-Request-Method: PUT
  Access-Control-Request-Headers: X-Custom-Header
  Host: api.alice.com
  Accept-Language: en-US
  Connection: keep-alive
  User-Agent: Mozilla/5.0...
```
 "预检"请求用的请求方法是OPTIONS，表示这个请求是用来询问的。头信息里面，关键字段是Origin，表示请求来自哪个源。
 除了Origin字段，"预检"请求的头信息包括两个特殊字段。
 - (1)Access-Control-Request-Method
 该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法，上例是PUT。
 - (2)Access-Control-Request-Headers
 该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段，上例是X-Custom-Header。