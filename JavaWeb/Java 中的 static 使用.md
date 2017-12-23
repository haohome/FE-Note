### static静态变量的使用
  通常我们可以基于一个类创建多个该类的对象，每个对象都拥有自己的成员，互相独立。然而在某些时候，我们更希望该类所有的对象共享同一个成员。static的作用在于此;
  - Java 中被 static 修饰的成员称为静态成员或类成员。它属于整个类所有，而不是某个对象所有，即被类的所有对象所共享。静态成员可以使用类名直接访问，也可以使用对象名进行访问。
  - 使用 static 可以修饰变量、方法和代码块。
  ```Java
    public class HelloWorld{
      static String hobby="唱歌";//static修饰的变量为静态变量,所有类的对象共享hobby;
      public static void main (String[] args){
        System.out.println("通过类名访问hobby: " +HelloWorld.hobby);
        HelloWorld hello=new HelloWorld();
        System.out.println("通过对象名访问hobby: "+hello.hobby);
        hello.hobby="跳舞";//通过对象名的形式修改静态变量的值
        System.out.println("通过类名访问hobby: " +HelloWorld.hobby);//再次使用类名访问静态变量,值已改变
      }
    }
  ```
  > **静态成员属于整个类，当系统第一次使用该类时，就会为其分配内存空间,直到该类被卸载才会进行资源回收！**

### static静态方法的使用
```java
public static void main(String[] args) {
  print();//直接调用同类中静态方法
  HelloWorld.print();//直接使用类名调用静态方法
  HelloWorld hello=new HelloWorld();
  hello.print();//通过实例化对象再调用;
}
//使用关键字声明静态方法
public static void print() {
  System.out.println("你好,世界!");
}
```
 > 注意
 - 1.静态方法中可以直接调用同类中的静态成员，但不能直接调用非静态成员。
```java
  public class HelloWorld{
    String name="小明";//费静态变量
    static String hobby="唱歌";//静态变量hobby
    //在静态方法中调用非静态变量
    public static void print(){
      // System.out.println("欢迎:"+name+"!");报错,不能直接调用非静态变量
      System.out.println("爱好:"+hobby+"!");
    }
  }
```
 > 如果希望在静态方法中调用非静态变量，可以通过创建类的对象，然后通过对象来访问非静态变量
 ```Java
  public static void print(){
    //创建类的对象
    HelloWorld hello=new HelloWorld();
    //通过对象来实现在静态方法中调用非静态变量
      System.out.println("欢迎:"+hello.name+"!");
      System.out.println("爱好:"+hobby+"!");
  }
 ```
 - 2.在普通成员方法中，则可以直接访问同类的非静态变量和静态变量
 ```Java
  String name="张三"; //非静态变量
  static String hobby="唱歌";//静态变量
  public void show(){
    System.out.println("欢迎:"+name+"!");
    System.out.println("爱好:"+hobby+"!");
  }
 ```
 - 3.静态方法中不能直接调用非静态方法，需要通过对象来访问非静态方法。
 ```Java
  public void show(){ //普通成员方法
    System.out.println("你好欢迎您!");
  }
  public static void print(){
    System.out.println("欢迎来到这里");
  }
  public static void main(String[] args){
    HelloWorld hello=new HelloWorld();
    hello.show();//普通成员方法必须通过对象调用
    print();//可以直接调用静态方法
  }
 ```