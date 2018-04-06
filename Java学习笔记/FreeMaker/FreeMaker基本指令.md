### 1. if 指令
 if 指令可以有条件地跳过模板的一些片段,通过表达式的boolean值判断
 ```java
 <!--当价格为0时，就会打印出 "Pythons are free today!"： -->
 <#if animals.python.price == 0>
  Pythons are free today!
</#if> 
 ```
 使用```<#else>```标签可以指定当条件为false时程序所要执行的内容。比如：
 ```java
  <#if animals.python.price < animals.elephant.price>
  Pythons are cheaper than elephants today.
  <#else>
    Pythons are not cheaper than elephants today.
  </#if>
 ```
### 2. list 指令
 当需要列表的内容时,则使用list
 - 格式:```<#list sequence as loopVariable> repeatThis </#list>```
 > repeatThis将会在给定的 sequence(序列集合) 遍历时在每一项中重复,loopVariable为当前遍历项的值。这个变量仅存在于 ```<#list ...>```和```</#list>```标签内。
 > sequence 可以是任意表达式,如:
 ```java
  <#list misc.fruits>//list视为整体,如果水果数量为0,则不输出ul
    <ul>
      <#items as fruit>
        <li>${fruit}
      </#items>
    </ul>
  </#list>
 ```
 列表中的分隔符:
 ```java
 <p>Fruits: <#list misc.fruits as fruit>${fruit}<#sep>, </#list>
 //输出:  Fruits: orange, banana
 ```
被 sep 覆盖的部分(也可以这么来写： ...<#sep>, </#sep></#list>) 只有当还有下一项时才会被执行。 因此最后一个水果后面不会有逗号。