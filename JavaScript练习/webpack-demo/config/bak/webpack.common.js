/*
 * @Author: wuhao 
 * @Date: 2018-06-08 11:27:35 
 * @Desc: 基础配置
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-03 10:21:57
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

/** 路径解析 */
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  entry: {
    main: path.resolve(__dirname,'../src/main.js'),
    index: path.resolve(__dirname,'../src/js/index.js'),
    login: path.resolve(__dirname,'../src/js/login.js')
  },
  resolve: {
    alias: {
      jquery: path.resolve(__dirname,'../dist/libs/jquery-3.2.1.js'),
      '@':resolve('src'),
      '#':resolve('dist')
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({fallback: "style-loader",use: "css-loader"})
      },
      /*编译less并添加浏览器前缀*/
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({fallback: "style-loader",use: 'css-loader!postcss-loader!less-loader'
        })
      },
      /*转换es6到es5语法*/
      { test: /\.js$/, 
        exclude: /(node_modules|bower_components)/,
        use: {loader: 'babel-loader',}
      },
      /**编译art模板 */
      {
        test: /\.art$/,
        loader: "art-template-loader",
      },
      {test: /\.(svg|ico|png|jpg|gif)$/i,
        exclude: /node_modules/,
        use: [
        {loader: 'url-loader',
          options: {
            limit:2000,  // 小于2k的图片会被打包成base64编码
            name:'[name].[ext]',
            outputPath: 'img/'
          }
        }
      ]},
      {test: /\.html$/,
　　　　　loader: 'html-loader'
　　　　}
    ]
  }, 
  plugins: [
    /**提取公共模块代码,减小打包体积 */
    new webpack.optimize.CommonsChunkPlugin({
      name:'common',
      filename:'js/common.js',
      // chunks:['main','index']  //指定提取范围
    }),
    /**自动生成全局变量,会自动打包 */
    new webpack.ProvidePlugin({ 
      $:"jquery",
      jQuery:"jquery",
      'window.jQuery':"jquery",
      'window.$':"jquery"
    }),
   /**指定模板输出 */
    new HtmlWebpackPlugin({ 
      title:'管理台',
      filename: 'index.html',
      template: path.resolve(__dirname,'../src/index.html'),
      chunks:['common','main','index'], 
    }),
    new HtmlWebpackPlugin({ 
      title:'登录',
      filename: 'doLogin.html',
      template: path.resolve(__dirname,'../src/doLogin.html'),
      chunks:['common','main','login'], 
    }),
    /*单独使用link标签加载css并设置路径，相对于output配置中的publickPath*/
    new ExtractTextPlugin({
      filename: "css/[name].bundle.css",
      disable: false,
      allChunks: true,
    }),
    /*热替换*/
    new webpack.HotModuleReplacementPlugin(),
    // Use NoErrorsPlugin for webpack 1.x
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
