----

title: 搭建一个vue开发环境
categories: JavaScript
date: 2018-05-31
tags: [JavaScript,vue]

----

1. 安装`vue` : 
   ①`vue` : `npm i --save-dev vue`
   ②`vue-router` 路由:`npm i --save-dev vue-router`

   ③`vuex`:  `npm i --save-dev vuex`

2. 安装http请求`axios`:
   `npm i axios --save-dev`

3. 安装`webpack`:
   ①`webpack`: `npm i --save-dev webpack@3.6.0`
   ②`webpack-dev-server`: `npm i --save-dev webpack-dev-server@2.9.1`
   ③`webpack-merge`: `npm i --save-dev webpack-merge@4.1.0`

4. 安装`babel`:

   ①`babel`: `npm i --save-dev babel-cli babel-preset-env`

   > 配置:  根目录创建 [`.babelrc`](https://www.babeljs.cn/docs/usage/babelrc) 文件

   ```json
    {
      "presets": ["env"]
    }
   ```

   ②`Polyfill`: `npm install --save-dev babel-polyfill`

   > **作用:**   Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。举例来说，ES6在Array对象上新增了Array.from方法。Babel就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。
   >
   > 使用它时需要在你应用程序的入口点顶部或打包配置中引入。
   >
   > **配置:**  webpack中配置:    `entry: ["babel-polyfill", "./src/js/main.js"]`

5. 安装`loader`:

   ①`style-loader`: `npm i --save-dev style-loader`
   ②`vue-loader`: `npm i --save-dev vue-loader`
   ③`css-loader`:`npm i --save-dev css-loader`
   ④`babel-loader`:`npm i --save-dev babel-loader`
   ⑤`sass-loader`: `npm i sass-loader node-sass  --save-dev`
   ⑥`postcss-loader`:`npm i -D postcss-loader --save-dev`
   同时需要安装`autoprefixer`:`npm - autoprefixer --save-dev`

   > **配置**: 根目录中配置`postcss.config.js`

   ```JavaScript
   module.exports = {  
     plugins: [  
         require('autoprefixer')({browsers: ['last 5 versions']})  
     ]  
   }  
   ```

   