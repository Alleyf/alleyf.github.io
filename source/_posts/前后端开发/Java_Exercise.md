---
title: Java_Exercise
tags: [Java]
categories: Java
date: 2022-9-28 21:27:00
sticky: 50
excerpt: some exercises about java。
---
# Java—Exercise

## 第一题

### 一、题目描述

定义一个数组类，编写成员函数实现以下功能：

1. 随机生成函数RandomArray（int n, int max）:随机生成一个一维整数数组，数组长度为n，元素值不超过max；

2. 判断函数CheckOrder（）：判断数组中元素是否按升序排练，若是返回1，否返回0；

3. 数组和函数Sum（）：计算数组和。

4. 判断某个元素函数CheckKey（int key）：找到数组中的某个值（key），若有返回1，无返回0；

5. 编写main函数，调用测试以上功能；

### 二、 运行结果

![image-20220928183135033](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220928183135033.png)

### 三、源代码

```java
package task;
import java.util.Arrays;
import java.util.Random;
public class array {
    public int [] x;
    public void RandomArray(int n, int max)
    {
        this.x = new int[n];
        for (int i = 0; i < n; i++)
        {
            this.x[i] = new Random().nextInt(max);
        }
    }
    public int CheckOrder()
    {
        int [] temp = new int[this.x.length];
        for (int i = 0; i < this.x.length; i++)
        {
            temp[i] = this.x[i];
        }
        Arrays.sort(temp);
        for (int i = 0; i < this.x.length; i++)
        {
            if (this.x[i] != temp[i])
            {
                return 0;
            }
        }
        return 1;
    }
    public int Sum()
    {
        int sum = 0;
        for (int i = 0; i < this.x.length; i++)
        {
            sum += this.x[i];
        }
        return sum;
    }
    public int CheckKey(int key)
    {
        for (int i = 0; i < this.x.length; i++)
        {
            if(this.x[i] == key)
            {
                return 1;
            }
        }
        return 0;
    }
    public static void main(String[] args)
    {
        array a = new array();
        a.RandomArray(5,10);
        System.out.println("打印随机产生的数组");
         for (int x : a.x) {
             System.out.print(x+"\t");
    }
        System.out.println("");
        System.out.println("判断数组中是否有2?");
        System.out.println(a.CheckKey(2));
        System.out.println("判断数组是否升序?");
        System.out.println(a.CheckOrder());
        System.out.println("打印数组求和的值");
        System.out.print(a.Sum());
    }
}
```

## 第二题

### 一、题目描述

编写程序，求圆柱体的体积**CylinderVolume**。

1. 设计一个计算圆面积的接口area，包含计算面积的方法bottomArea；

2. 设计一个圆柱体类Cylinder实现接口area。

   - 包含包含成员变量：高度，半径；

   - 实现构造方法，对成员变量进行赋值；

   - 实现圆柱体底面积成员方法area；

   -  实现计算圆柱体体积的成员方法volume；

3. 编写测试类计算圆柱体体积。

### 二、运行结果

![](https://img.gouka.la/i/2022/09/28/z0gkwr.webp)

### 三、源代码

```java
package task;
import java.lang.Math.*;
import java.util.Scanner;

public class Cylinder implements area{
    public double height;
    public double radius;
    public double bottomArea()
    {
        return Math.PI*Math.pow(this.radius,2);
    }
    public Cylinder(double radius, double height)
    {
        this.radius = radius;
        this.height = height;
    }
    public double volume()
    {
        return height*bottomArea();
    }
}
interface area{
    double bottomArea();
}
class Cylindertest{
    public static void main(String[] args)
    {
        Scanner in = new Scanner(System.in);
        System.out.println("请输入圆柱的半径和高度：");
        double r = in.nextDouble();
        double h = in.nextDouble();
        Cylinder c = new Cylinder(r, h);
        System.out.println("圆柱的体积为:\n"+c.volume()+"立方米");
    }
}
```

## 第三题

### 一、题目描述

**按以下要求编写程序：**

1.  定义一个父类Animal类

​			属性：kind(种类)

​			方法：创建带参（kind为参数）构造方法

​			创建cry():void方法

2. 编写三个具体的子类Cat类、Dog类、Sheep类

​			分别重写父类中的 cry() 方法，输出信息分别为

​			Cat类：小猫的叫声：喵喵喵~~~

​			Dog类：小狗的叫声：汪汪汪~~~

​			Sheep类：小羊的叫声：咩咩咩~~~

3. 编写测试类，首先生成长度为5的父类对象数组，然后通过循环依次向数组中存入数据，现设定存储规则为：

- 每次随机产生一个0~2的正整数
- 若数值为 0，则生成一个 Cat 类的对象，存入数组
- 若数值为 1，则生成一个 Dog 类的对象，存入数组
- 若数值为 2，则生成一个 Sheep 类的对象，存入数组最后循环输出数组成员，并分别调用 cry() 方法。

### 二、运行结果

![image-20220928210706368](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220928210706368.png)

### 三、源代码

```java
package task;
import java.util.Random;
public class Animal {
    public String kind;
    public Animal(){};
    public Animal(String kind)
    {
        this.kind = kind;
    }
    public void cry(){};
}
class Cat extends Animal
{
        public Cat(String kind)
        {
            super(kind);
        }
        @Override
        public void cry() {
            System.out.println(this.kind+"的叫声：喵喵喵~~~");
        }
}
class Dog extends Animal
{
    public Dog(String kind)
    {
        super(kind);
    }
    @Override
    public void cry() {
        System.out.println(this.kind+"的叫声：汪汪汪~~~");
    }
}
class Sheep extends Animal
{
    public Sheep(String kind)
    {
        super(kind);
    }
    @Override
    public void cry() {
        System.out.println(this.kind+"的叫声：咩咩咩~~~");
    }
}
class Animaltest
{
    public static void main(String[] args)
    {
        int []n = {0,0,0};
        Animal [] An = new  Animal[5];
        for(int i=0; i<An.length; i++) {
            int j = new Random().nextInt(0, 3);
            switch (j) {
                case 0:
                    An[i] = new Cat("Tom"+(n[0]++));
                    break;
                case 1:
                    An[i] = new Dog("Jerry"+(n[1]++));
                    break;
                case 2:
                    An[i] = new Sheep("PeiQi"+(n[2]++));
                    break;
                default:
                    throw new IllegalArgumentException("Invalid number");
            }
        }
        for (Animal temp : An )
        {
            temp.cry();
        }
    }
}
```

​																																				[文章已上传博客](https://alleyf.github.io)
