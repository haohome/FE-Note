## 语法
 - html(css,js): 直接写。
 - java代码:
  a. java代码片断```<%  java代码    %>```
  b. jsp表达式```<%=  java表达式  %>```

## JSP运行原理
  阶段一　容器先将jsp文件转换成一个对应的Servlet类(.java文件)
  ```java
		html(css,js) -----> service方法里，使用out.write输出。
		<%    %>     -----> service方法里，照搬。
		<%=  %>      -----> service方法里，使用out.print输出。
  ```
  阶段二　容器调用该servlet来处理请求（包括编译，实例化……）

## 指令
  通知容器，在将jsp文件转换成Servlet类时，做一些额外的处理，比如导包。
 ### page
  import属性：指定要导入的包，比如
  ```<%@ page import="java.util.*,java.text.*"%>```
  contentType属性：设置response.setContentType方法的参数值。
  pageEncoding属性：告诉容器，在读取jsp文件的内容时，使用指定的字符集来解码。
  ```java
  <%@page pageEncoding="utf-8" 
    contentType="text/html" 
    import="java.text.*,java.util.*"
  %>
  ```
 ### include
  file属性：指定被包含的文件。
  告诉容器，在将jsp转换成servlet类时，在该指令所在的位置插入对应的文件的内容
 ```java
 <%@include file="time.jsp" %>
 ```
## 隐含对象
  a.什么是隐含对象?
    jsp文件里面可以直接使用的对象（比如out,request,response）。
  b.为什么可以直接使用这些隐含对象?
    容器会自动添加获得这些对象的代码。


