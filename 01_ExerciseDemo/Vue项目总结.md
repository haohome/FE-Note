-----
title: Vue项目总结
date: 2018-07-29
categories: JavaScript
tags: [framework,学习记录]

-----

### ajax

vue与后台交互采用axios库,post请求时后台会请求两次:

- 第一次请求method会默认为options;
- 第二次type才为post;

这是由于跨域问题导致,同时由于post的请求投默认为json,直接采用传参 `data: {...}` 或者直接 `{...}` 的形式传递,会被axios转化:`JSON.stingify(data)`,即json字符串而非json对象,后台接受格式为json,当然不能识别;

解决方案:

> 通过修改 `transformRequest` 来达到目的
>
> ```JavaScript
> import Qs from 'qs'
> axios({
>     url: '/api/lockServer/search',
>     method: 'post',
>     transformRequest: [function (data) {
>         // 对 data 进行任意转换处理
>         return Qs.stringify(data)
>     }],
>     data: {
>         username: 'admin',
>         pwd: 'admin'
>     }
> })
> 
> ```