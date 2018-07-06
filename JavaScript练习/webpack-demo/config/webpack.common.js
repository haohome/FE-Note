/*
 * @Author: wuhao 
 * @Date: 2018-06-22 13:57:02 
 * @Desc: webpack基础配置
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-05 23:36:48
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const config = require('./config')
const utils = require('./utils')
const CopyWebpackPlugin = require('copy-webpack-plugin')
/** 路径解析 */
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {  //入口
    main: path.resolve(__dirname,'../src/main.js'),
    index: path.resolve(__dirname,'../src/js/index.js'),
    login: path.resolve(__dirname,'../src/js/login.js')
  },
  output: { // 输出目录
    path: config.build.assetsRoot,
    filename: '[name].[hash].js',
    publicPath:"/"
  },
  resolve: {
    alias: {
      jquery: path.resolve(__dirname,'../dist/libs/jquery-3.2.1.js'),// 本地第三方插件
      '@':resolve('src'), // 路径指代
      '#':resolve('dist')
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({fallback: "style-loader",use:'css-loader'}),
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
        exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
        use: {loader: 'babel-loader',}
      },
      /**编译art模板 */
      {
        test: /\.art$/,
        loader: "art-template-loader",
      },
      {test: /\.(svg|ico|png|jpg|gif)$/i,
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 2000,
          name: '[name].bundle.[ext]',
          outputPath: utils.assetsPath('img'),
          // publicPath:utils.assetsPath('img') // 若配置,则覆盖output的publicPath
        }
      },
      {test: /\.html$/,
　　　　　loader: 'html-loader' // 处理html中img的url路径
　　　　}
    ]
  }, 
  plugins: [
    /**提取公共模块代码,减小打包体积 */
    new webpack.optimize.CommonsChunkPlugin({
      name:'common',
      filename:utils.assetsPath('js/common.js'),
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
    chunksSortMode: 'manual',
    chunks:['common','main','index'], 
  }),
  new HtmlWebpackPlugin({ 
    title:'登录',
    filename: 'doLogin.html',
    template: path.resolve(__dirname,'../src/doLogin.html'),
    chunksSortMode: 'manual',
    chunks:['common','main','login'], 
  }),
  /*单独使用link标签加载css并设置路径，相对于output配置中的publickPath*/
  new ExtractTextPlugin({
    filename: utils.assetsPath("css/[name].bundle.css"),
    fallback:'css-loader',
    allChunks: true,
  }),
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }
  ]),
    /*热替换*/
    new webpack.HotModuleReplacementPlugin(),
    // Use NoErrorsPlugin for webpack 1.x
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
