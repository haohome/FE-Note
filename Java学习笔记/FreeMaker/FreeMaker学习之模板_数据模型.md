## 1. 模板 + 数据模型 = 输出
 ### 1.1 模板
 模板与静态HTML类似,区别是包含了一些指令,使网页内容可以动态生成，例如:
```html
<html>
  <head>
    <title>Welcome!</title>
  </head>
  <body>
    <h1>Welcome ${user}!</h1>
    <p>Our latest product:
    <a href="${latestProduct.url}">${latestProduct.name}</a>!
  </body>
</html>
```
<!-- more -->
- ${...}：插值表达式(interpolation)
- FTL标签：FreeMarker模板的语言标签，标签的名字以 # 开头，用户自定义的FTL标签则需要使用 @ 来代替 #
- 注释：使用 <#-- and --> 来标识
> 其他任何不是插值、FTL标签或注释的内容将被视为静态文本，直接在页面输出

 ### 1.2 数据模型
 为模板准备的数据整体被称作为**数据模型**
 数据模型是树形结构,例如:
 ```java
 (root)
  |
  +- animals
  |   |
  |   +- mouse
  |   |   |   
  |   |   +- size = "small"
  |   |   |   
  |   |   +- price = 50
  |   |
  |   +- elephant
  |   |   |   
  |   |   +- size = "large"
  |   |   |   
  |   |   +- price = 5000
  |   |
  |   +- python
  |       |   
  |       +- size = "medium"
  |       |   
  |       +- price = 4999
  |
  +- message = "It is a test"
  |
  +- misc
      |
      +- foo = "Something"
```
- hashes (哈希表): 指变量中扮演目录角色(比如 root, animals, mouse, elephant, python, misc)
> 哈希表存储其他变量(被称为 子变量)， 它们可以通过名称来查找(比如 "animals", "mouse" 或 "price")。
- scalars (标量): 指存储单值的变量 (size, price, message 和 foo)
> 如果要在模板中使用子变量， 那应该从根root开始指定它的路径，每级之间用点来分隔开。要访问 mouse 的 price ，要从root开始，首先进入到 animals ，之后访问 mouse ，最后访问 price 。就可以这样来写 animals.mouse.price。
- sequences (序列): 像哈希表那样存储子变量，但是子变量没有名字，它们只是列表中的项。在下面这个数据模型中， animals 和 misc.fruits 就是序列：
```Java
(root)
  |
  +- animals
  |   |
  |   +- (1st)
  |   |   |
  |   |   +- name = "mouse"
  |   |   |
  |   |   +- size = "small"
  |   |   |
  |   |   +- price = 50
  |   |
  |   +- (2nd)
  |   |   |
  |   |   +- name = "elephant"
  |   |   |
  |   |   +- size = "large"
  |   |   |
  |   |   +- price = 5000
  |   |
  |   +- (3rd)
  |       |
  |       +- name = "python"
  |       |
  |       +- size = "medium"
  |       |
  |       +- price = 4999
  |
  +- misc
      |
      +- fruits
          |
          +- (1st) = "orange"
          |
          +- (2nd) = "banana"
```
要访问序列的子变量，可以使用方括号形式的数字索引下标。 索引下标从0开始(从0开始也是程序员的传统)，那么第一项的索引就是0， 第二项的索引就是1等等。要得到第一个动物的名称的话，可以这么来写代码 ```animals[0].name```。

**标量类型可以分为如下的类别：**
- 字符串：就是文本，也就是任意的字符序列，比如上面提到的 'm','o','u', 's','e'。比如 name 和 size 也是字符串。
- 数字：这是数值类型，就像上面的 price。 在FreeMarker中，字符串 "50" 和数字 50 是两种完全不同的类型。
- 日期/时间: 可以是日期-时间格式(存储某一天的日期和时间)， 或者是日期(只有日期，没有时间)，或者是时间(只有时间，没有日期)。
- 布尔值：对应着对/错(是/否，开/关等值)类似的值。

> 总结：
> - 数据模型可以被看成是树形结构。
> - 标量用于存储单一的值。这种类型的值可以是字符串，数字，日期/时间或者是布尔值。
> - 哈希表是一种存储变量及其相关且有唯一标识名称的容器。
> - 序列是存储有序变量的容器。存储的变量可以通过数字索引来检索，索引通常从0开始。