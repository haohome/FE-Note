-----

title: Data类型的url简介
category: HTML5
date:  2018-09-28
tags: [html5,wiki]

-----

## 1. 定义和语法

**Data URLs**，即前缀为 `data:` 协议的的URL，其允许内容创建者向文档中嵌入小文件。([MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs))

这样的好处是减少外部资源的载入,减少http请求

Data URLs 由四个部分组成：前缀(`data:`)、指示数据类型的MIME类型、如果非文本则为可选的`base64`标记、数据本身：

> `data:[<mediatype>][;base64],<data>`
>
> - `mediatype `是个 MIME 类型的字符串，例如 "`image/jpeg`" 表示 JPEG 图像文件,如果被省略，则默认值为 `text/plain;charset=US-ASCII`

实例:


> `data:,Hello%2C%20World!`简单的 text/plain 类型数据
>
> `data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D`上一条示例的 base64 编码版本
>
> `data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E`一个HTML文档源代码 `<h1>Hello, World</h1>`
>
> `data:text/html,<script>alert('hi');</script>`一个会执行 JavaScript alert 的 HTML 文档。注意 script 标签必须封闭。

<!-- more -->

## 2. data url的优缺点

优点:

> - 当访问外部资源很麻烦或受限时(这个比较鸡肋)
> -  当图片是在服务器端用程序动态生成，每个访问用户显示的都不同时（场景较少）
> -  当图片的体积太小，**占用一个HTTP会话**不是很值得时（雪碧图可以出场了）

缺点:

> - Base64编码的数据体积通常是**原数据的体积4/3**，也就是Data URL形式的图片会比二进制格式的图片体积大1/3
> - Data URL形式的图片**不会被浏览器缓存**，这意味着每次访问这样页面时都被下载一次

## 3.在css中使用

浏览器会css文件以提高访问效率,所以浏览器也可以缓存css中的data url数据,

```css
.box {
	width: 100px;
	height: 100px;
	background-image: url("data:image/gif;b ase64,R0lGODlhAwADAIAAAP///8zMzCH5BAAAAAAALAAAAAADAAMAAAIEBHIJBQA7");
	border: 1px solid gray;
	padding: 10px;
}
```

图片不是很大,而且不会是重复在css中使用,适合用data url形式展现

更多请阅读[Data URI&MHTML: 用还是不用？](https://www.99css.com/492/)