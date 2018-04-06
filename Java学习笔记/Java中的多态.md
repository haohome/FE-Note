title: Java中的多态
date: 2018-1-1
categories: Java
tags: [Java,学习记录]
keywords: 多态
---
## 多态
#### 1.引用多态
- 父类的引用可以指向本类的对象
- 父类的引用可以指向子类的对象
#### 2.方法多态
- 创建本类对象时,调用的方法为本类方法
- 创建子类对象时,调用的方法为**子类重写的方法或者继承的方法**
#### 3.引用类型转换
- 向上类型转换(隐式/自动类型转换),是小类型向大类型转换
- **向下类型转换(强制类型转换),是大类型到小类型转换**(存在数据溢出风险)
- instanceof运算符:避免类型转换出现的安全问题
```Java
  Dog dog=new Dog();
  Animal animal=dog;//(向上类型转换)
  if (animal instanceof Dog) {
    Dog dog2=(Dog)animal;
  }
  else{
    System.out.println("无法进行类型转换");
  }
```