/*
 * @Author: wuhao 
 * @Date: 2018-06-08 11:28:16 
 * @Desc: 生产环境
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-06-26 17:28:12
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');//代码压缩工具
const common = require('./webpack.common.js');
const webpack = require('webpack')
const merge = require('webpack-merge');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = merge(common, {
  devtool: 'source-map',	//调试源码(debug)和运行基准测试(benchmark tests)很有用
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/tkoper/' //上线的绝对地址 如http://10.136.26.138:8181/tkoper/
  },
  plugins: [
    //  new UglifyJSPlugin({
    //   sourceMap: true		//如果配置了devtool则加改选项
    // }),
    /*清理文件夹*/
    new CleanWebpackPlugin(
      ['dist/css','dist/html','dist/js','dist/img','dist/index.html','dist/doLogin.html'],
      // ['*.js','*.map','*.png','*.css','*.html','*.ico','html','css','js','images'],　 //匹配删除的文件,若为*则全部删除
      {
        root: path.resolve(__dirname,'../'),
        verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
      }),
      new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"prod"'
        }
      })
  ]
});