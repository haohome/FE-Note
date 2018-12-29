## FreeMarker标签使用 
### 一、FreeMarker模板文件主要有4个部分组成
  1、文本，直接输出的部分
  2、注释，即<#--...-->格式不会输出
  3、插值（Interpolation）：即${..}或者#{..}格式的部分,将使用数据模型中的部分替代输出
  4、FTL指令：FreeMarker指令，和HTML标记类似，名字前加#予以区分，不会输出。
  #### FTL指令规则
  FreeMarker有三种FTL标签，这和HTML的标签是完全类似的
    开始标签：<#directivename parameters>
    结束标签：</#directivename>
    空标签： <#directivename parameters />
    实际上，使用标签时前面的#符号也可能变成@，如果该指令是一个用户指令而不是系统内建指令时，应将#符号改为@符号

  #### 插值规则
  FreeMarker的插值有如下两种类型
    1、通用插值：${expr}
    2、数字格式化插值：#{expr}或者#{expr;format}

  通用插值，有可以分为四种情况
    a、插值结果为字符串值：直接输出表达式结果
    b、插值结果为数字值：根据默认格式(#setting 指令设置)将表达式结果转换成文本输出。可以使用内建的字符串函数格式单个插值，例如
  ```xml
  <#setting number_format = "currency" />  <#--货币格式输出 -->
  <#assign price = 42 />  
  ${price}  
  ${price?string}  
  ${price?string.number}  
  ${price?string.currency}  
  ${price?string.percent}   
  ```
    c、输出值为日期值：根据默认格式(由 #setting 指令设置)将表达式结果转换成文本输出，可以使用内建的字符串函数格式化单个插值，例如
  ```xml
  <#assign lastUpdated = "2009-01-07 15:05"?datetime("yyyy-MM-dd HH:mm") />  
  ${lastUpdated?string("yyyy-MM-dd HH:mm:ss zzzz")};  
  ${lastUpdated?string("EEE,MMM d,yy")};  
  ${lastUpdated?string("EEEE,MMMM dd,yyyy,hh:mm:ss a '('zzz')'")};  
  ${lastUpdated?string.short};  
  ${lastUpdated?string.long};  
  ${lastUpdated?String.full};  
  ```
    d、插值结果为布尔值
      <#assign foo=true />
      ${foo?string("是foo","非foo")}
        数字格式化插值
      数字格式化插值可采用#{expr;format}的形式来格式化数字，其中format可以是：
      mX:小数部分最小X位
      MX:小数部分最大X位
      例如：
  ```xml
  <#assign x = 2.582 />  
  <#assign y =4 />  
  #{x;M2};  
  #{y;M2};  
  #{x;m1};  
  #{y;m1};  
  #{x;m1M2};  
  #{y:m1M2};    
  ```
### 二、表达式
   表达式是FreeMarker的核心功能。表达式放置在插值语法（${...}）之中时，表面需要输出表达式的值，表达式语法也可以与FreeMarker标签结合，用于控制输出
