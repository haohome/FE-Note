/*
 * @Author: wuhao 
 * @Date: 2018-06-08 11:27:52 
 * @Desc: 开发环境
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-06-21 14:15:42
 */

const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack')
const common = require('./webpack.common.js');

module.exports = merge(common, {
  /**打包输出配置路径及文件名 */
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  devServer: {  //提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)
    host: '127.0.0.1',
    port: 8091,
    inline: true,
    // open:true,
    hot: true, //热启动
    contentBase:path.resolve(__dirname, "../dist"),  //服务器的位置
    proxy:{
      '/tkoper':{
        target:'http://hwptest.mobile.taikang.com:8080/tkoper',
        changeOrigin: true,
        secure: false,
        // pathRewrite: {'^/sidea' : ''},
      }
    }
  },
  devtool: 'inline-source-map',
  plugins:[
    new webpack.DefinePlugin({
      'process.env': {
          NODE_ENV: '"dev"'
      }
    })
  ]
});