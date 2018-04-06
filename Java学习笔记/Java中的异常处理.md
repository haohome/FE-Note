## 1.异常简介(Exception)
### 1.1 非检查异常 RuntimeException(运行异常)
- 1.NullPointerException(空指针异常)
```Java
 String str=null;
 System.out.println(str.length());
```
- 2.ArrayIndexOutOfBoundsException(数组下标越界异常)
```Java
int[] ary={1,2,3};
for(int i=0;i<=3;i++){
  System.out.println(ary[i]);
}
```
- 3.ClassCastException(类型转换异常)
```Java
class Animal{ }
class Dog extends Animal{ }
class Cat extends Animal{ }
public class Test{
  public static void main(String[] args){
    Animal a1=new Dog();
    Animal a2=new Cat();
    Dog d1=(Dog)a1;
    Dog d2=(Dog)a2;
  }
}
```
- 4.ArithmeticException(算术异常)
```Java
 int one=12;
 int two=0;
 System.out.println(one/two);
```
### 1.2 检查异常
- IOException(文件异常)
- SQLException(SQL异常)

## 2.处理异常
```Java
 try{
   //一些会抛出异常的方法
 }catch(Exception e){
   //处理该异常的代码块
 }
 ```
 如果try...catch抛出异常,程序会暂停执行,程序的控制权将被移交到catch块中的异常处理程序
