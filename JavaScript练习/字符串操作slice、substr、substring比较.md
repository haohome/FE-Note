在截取字符串时常常会用到substr()、substring()、slice()截取数组或字符串的方法,几个方法之间有时易混淆.
### slice()
> 可接受一个或者两个参数
> - 两个参数:slice(start,end),start指截取字符串开始的位置,end指截取字符串结束的位置(不包含)
> - 一个参数:slice(start),指截取从start位置到结束位置(字符串长度为结束位置)

- 1.传递参数为正值,end表示结束的位置
```JavaScript
var str="HelloWorld";
console.log(str.slice(3));//"loworld"  
console.log(str.slice(3,7)); //'loWo'  
```
- 2.传递参数为负值
slice()将传入的负值与字符串长度相加
```JavaScript
var str='Helloworld';
console.log(str.slice(-3));//'rld'   一个参数,与字符串长度相加即为slice(7);
console.log(str.slice(3,-4));//'low'   两个参数,字符串长度相加即为slice(3,6);
```
- 3.第二个参数比第一个参数小,则返回空字符串
- 4.IE兼容性:在IE8浏览器测试下,没有兼容性问题

### slice与substring、substr区别
- 传递参数为正值:
1) substring与slice方法行为类似,但substring会将较小的数作为开始位置,较大的数作为结束位置(substring(3,0) 与substring(0,3)是一样效果);
2) substr第二个参数表示返回字符的个数,如果没有第二参数,则字符串的长度作为结束位置
- 传递参数为负值:
1) substring()会把所有负值参数转换为0;
2) substr()方法会将负的第一个参数加上字符串的长度，而将负的第二个参数转换为0。
```JavaScript
var str ="helloWorld";
console.log(str.substr(-3,5));//"rld" 即为：substr(7,5) ，从位置7开始向后截取5个字符
console.log(str.substr(3,-2));//substr(3,0)，即从位置3截取0个字符串，则返回空
```
- IE兼容性: slice() 和 substring ()在IE8都正常,substr()方法传递负值的情况下会存在问题，会返回原始的字符串。IE9修复了此问题。
#### 总结
- 在传递正值参数情况下，slice() 和 substring () 行为是一致的，substr()方法在第二个参数上会容易混淆
- 在传递负值参数情况下，slice() 方法是通过字符串长度相加，符合一般思维，substring()第二个参数转换为0会容易出问题，起始位置会容易变更，
- substr() 方法负值情况下会出现IE兼容性问题。
综上，一般推荐使用slice()方法。
