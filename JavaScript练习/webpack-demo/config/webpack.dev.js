/*
 * @Author: wuhao 
 * @Date: 2018-06-08 11:27:52 
 * @Desc: 开发环境
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-05 23:40:31
 */
process.env.NODE_ENV = 'dev'; // webpack配置内部环境,要注意位置 
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common');
const config = require('./config');
const utils = require('./utils');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
  devServer: {  //提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)
    host: '127.0.0.1',
    port: 8091,
    inline: true,
    // open:true,
    hot: true, //热启动
    contentBase:path.resolve(__dirname, "../dist"),  //服务器的位置
    publicPath: config.dev.assetsPublicPath,  // 绝对路径
    // proxy:{
    //   '/api':{
    //     target:'http://hwptest.mobile.taikang.com:8080/tkoper',
    //     changeOrigin: true,
    //     secure: false,
    //     // pathRewrite: {'^/api' : ''},
    //   }
    // }
  },
  devtool: 'inline-source-map',
  plugins:[
    new webpack.DefinePlugin({  //该配置可在js代码中识别,利于根据开发环境选择不同接口
      'process.env': {
          NODE_ENV: '"dev"'
      }
    }),
  ]
});