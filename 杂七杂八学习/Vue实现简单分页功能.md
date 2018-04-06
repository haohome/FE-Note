------
title: Vue实现简单分页功能
categories: framework
date: 2018-1-21
tags: vue

------

分页功能在列表查询中是一个比较重要的组成部分,按结构划分可分为页码与上一页/下一页:

- 页码:通过点击数字,并将页码数字传递到后台查询获取相应的页码内容

- 上一页/下一页:可以共用一个方法,利用不同参数识别,查询数据逻辑与页码类似;

> 页面显示页码:可以采用计算属性computed获得

下面的案例是我从自己的vue项目中摘取出来:

- 实现分页的CSS部分

  ```CSS
  .pages {
      text-align: center;
  }
  .pages a {
      color:#999;
      box-sizing: border-box;
      height: 20px;
      min-width: 20px;
      border-radius: 2px;
      display: inline-block;
      border:1px solid #ddd;
      margin: 0 2px;
      padding: 0 4px;
      line-height: 18px;
  }
  .pages a:hover {
      border-color:#f8b551;
      color:#f8b551;
  }
  .pages a.cur {
      border-color:#f8b551;
      background: #f8b551;
      color: #fff;
  }
  .pages a.default {
      border-color: #ddd;
      color:#ddd;
      cursor: default;
  }
  ```

- 实现分页的template

  ```HTML
  <div class="pages">
    <a href="" @click.self.prevent="togglePage(-1)" :class="{default:pno<=1}">上一页</a>
    <a v-for="(temp,key) in realPage" :key=key :class="{cur:pno==temp}" href="" @click.self.prevent="changePage(temp)">{{temp}}</a>
    <a href="" @click.self.prevent="togglePage(1)" :class="{default:pno>=pageCount}">下一页	</a>
  </div>
  <!--利用事件修饰符 @click.self.prevent阻止对元素自身的点击。-->
  ```

- 实现分页的Js

  ```JavaScript
    data (){
      return {
        newsList:[],
        pno:1,
        pageCount:0
      }
    },
    mounted(){
      this.getList()  //挂载的时候获取新闻列表
    },
    methods: {
      getList(){
        var self=this;
        self.$axios({
          method: 'get',
          baseURL:'http://127.0.0.1:3000/',
          url: '/news/list/'+self.pno,
          withCredentials: true,
          responseType: 'json',
          transformResponse:function(response){
            self.newsList=response.data;
            self.pageCount=response.pageCount;
          },
        });
      },
      // 点击页面切换
      changePage(index){
        var self=this;
        self.pno=index;
        self.$axios({
          method: 'get',
          baseURL:'http://127.0.0.1:3000/',
          url: '/news/list/'+self.pno,
          withCredentials: true,
          responseType: 'json',
          transformResponse:function(response){
            self.newsList=response.data;
            self.pageCount=response.pageCount;
          },
        });
      },
      //点击上一页/下一页事件
      togglePage(index){//通过对index赋值来识别按钮
        var self=this;
        if(index>0){
          if(self.pno>=self.pageCount)return;
          self.pno++;
        }else{
          if(self.pno<=1)return
          self.pno--;
        }
        self.$axios({
          method: 'get',
          baseURL:'http://127.0.0.1:3000/',
          url: '/news/list/'+self.pno,
          withCredentials: true,
          responseType: 'json',
          transformResponse:function(response){
            self.newsList=response.data;
            self.pageCount=response.pageCount;
          },
        });
      }
    },
    computed :{  //vue内置的计算属性,可以直接使用realPage,相当于java的getter方法
      realPage:function(){
        let left=1;
        let right=this.pageCount;
        var realCount=[];//当前可显示的页码数组,如[4,5,6]
        if(right>=3){//控制最多显示3页
          if(this.pno>1 && this.pno+1<this.pageCount){
            left=this.pno-1;
            right=this.pno+1;
          }else {
            if(this.pno<=3){
            left=1;
            right=3;
           }else{
             left=this.pageCount-2;
             right=this.pageCount;
           }
          }
        }
        while(left<=right){ //通过循环将当前可显示的页码存到realCount数组中
          realCount.push(left);
          left++;
        }
        return realCount;
      }
    }
  }
  ```

- 当页面发生变化,如果需要通知其他组件做出相应变化,可以在增加watch监听页面变化

  ```JavaScript
  watch: {
    pno: function(oldValue , newValue){
      console.log(arguments);
    }
  }
  ```

  ​