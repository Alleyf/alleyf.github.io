---
title: Java_Notes
tags: [Java]
categories: Java
date: 2022-9-10 10:00:00
sticky: 80
excerpt: some notation about java。
---

# 第一章、计算机语言及系统概述

<u>**前言：**</u>

> 无论学习任何语言都要先理解每个知识点本身，在此基础上勤加练习，只有练习的越多，才能掌握对应的要点，练习实践过程中会发现一些未可知意外的问题，不断发现问题解决问题，从而扩充自己的知识面，本篇笔记仅仅是Java入门基础，还有很多深层次内容需要靠自己进一步学习，在这里祝愿大家都能有所收获，成为一名优秀的开发者！

## 绪论

1. <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907091018.png" style="zoom:50%;" />
1. 特点：**Write once，run anywhere！**
- **java：java program->执行编译后的程序**
-  **javac：java program.java->编译该程序生成.class文件**
-  **javadoc：javadoc program->生成该程序的html文档**
3. <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135804.png" style="zoom:50%;" />
3. <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135836.png" style="zoom: 50%;" align="middle" />

---

## 代码示例
```java
public class HelloWorld{
    public static void main(String[] args) 
    {
        System.out.println("Hello world!");
    }
}
```
---

# 第二章、数据类型及变量

## 标识符

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135908.png" style="zoom:33%;"  align="middle"/>



> - 标识符必须以**"字母"、下划线"_"、美元符"$"**开头.
>
> - 标识符其它部分可以是字母、下划线“_”、美元符“$”和**数字**的任意组合。
>
> - Java 标识符**大小写敏感**，且**长度无限制**,但不可以是Java的关键字。
> - Java 采用**16位Unicode**.

```java
public static void DefineKey(String[] args) throws Exception {
        int i=0;
        int _j=1;
        int $k=2;
//        int 1i=0;(NO)
//        int 中国=1;(不建议)
        byte a=1;
        double b=0.1;
    }
```

## 字符集

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221031085020005.png" alt="字符集" style="zoom: 50%;" />

1. ISO8859-1 ——西欧字符集 
2. GB2312 ——大陆最早使用的简体中文字符集 
3. GBK ——GB2312 的扩展，可以表示繁体字 
4. GB18030 ——最新GBK的扩展，中国所有非手持/嵌入式计算机系统的强制性实施标准。可以表示汉字、 维吾尔文、藏文等中华民族字符 
5. BIG5 ——台湾的五大码，表示繁体字 
6. Unicode ——国际通用字符集

## 关键字

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135913.png"  align="middle"/>

## 数据类型

<div>
    <center>
    <p>
        <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135920.png" style="zoom:33%;" />
   	</p>
    </br>
	<p>
        <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135925.png" style="zoom:33%;" />
    </p>
	</br>
	<p>
        <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135953.png" style="zoom:33%;" />
    </p>
</center>
</div>


```java
    public static void BaseData(String[] args) throws Exception {
        int i=123;//默认十进制
        int j=0123;//八进制
        int k=0x123;//16进制
        long c=55555;
        long d=555555555555555L;
        double e=521e2;
        char f='\u0064';
        System.out.println(f);
    }
```

> - Java的整形数据类型**默认为int型**(4字节)，eg: long a = 55555555;**a实际为整形(默认)**，除非后面加**l/L**才为**长整型**
> - Java的浮点型数据类型**默认为double型**(8字节)，若要用float需要在数值后面**加f/F**，**加d/D**为double型，浮点型都存在**舍入误差**
> - float尾数可以精确到**7位有效数字**，常用double满足需求
> - **BigInteger**实现了任意精度的**整数运算**。**BigDecimal** 实现了任意精度的**浮点运算**。

## 进制转换

<div align="center">
    <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135958.png" style="zoom:33%" />
</div>





<div align="center">
    <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907140005.png" style="zoom:33%" align="middle" />
</div>



<div align="center">
    <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907140009.png" style="zoom:33%" align="middle" />
</div>



<div align="center">
    <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907140012.png" style="zoom:33%" align="middle" />
</div>
> - **Unicode**具有从0到65535之间的编码，他们通常用从’\u0000’到’\uFFFF’ 之间的**十六进制**值来表示（前缀为u表示Unicode）
>
> - **boolean类型**只有一位，注意不是一个字节！

## 类型转换


<div align="center">
    <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907140707.png" style="zoom: 53%" align="middle" />
</div>
**提升转换不丢失精度;(type)var强制类型转换会丢失精度**

![image-20221031195745491](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221031195745491.png)

```java
    public static void TypeChange(String[] args) throws Exception {
        double s=3.1415;
        int n=(int)s;
        char b=(char)n;
        char a='a';
        String c;
        System.out.println(n+b);
        int money=1000000000;//int型为4个字节最大为21亿，超出则异常
        int years=20;
        double total=(double)(money)*years;//提前将其中一个整形转换为浮点型以避免精度缺失
        System.out.println(total);
    }
```

## 变量

- **实例**变量：在**堆**中。
- **静态**变量：在**方法区**。
- **局部**变量：在**栈**中。

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907143232.png" style="zoom:33%" align="middle" />




以上三大变量中：

**局部变量永远都不会存在线程安全问题。**

- 因为局部变量不共享。（一个线程一个栈）
- 局部变量在**栈**中。所以局部变量永远都不会共享。

1. 实例变量在堆中，堆只有1个。
2. 静态变量在方法区中，方法区只有1个。

**堆和方法区都是多线程共享的，所以可能存在线程安全问题。**

**总结：**

- **局部变量+常量**：不会有线程安全问题。
- **成员变量（实例+静态）**：可能会有线程安全问题。

> 最终变量（必须初始化）：`final type variable=value；`（**定义时初始化或构造函数初始化**）

## 常量

- **只能被初始化一次**
- **常量名全部大写，单词过多使用下划线**

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907142721.png" style="zoom:33%" align="middle" />



## 运算符与表达式

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907150838.png" style="zoom:33%" align="middle" />



## 输出进制格式化

```java
System.out.println("二进制输出"+Integer.toBinaryString(a));
System.out.println("八进制输出"+Integer.toOctalString(a));
System.out.println("十六进制输出"+Integer.toHexString(a));
```

## 数组

### 一维数组

- 定义：**type[] arrayname = new type[num] 或  type arrayname[] = new type[num]**

- **初始化默认值为零**

- **数组直接赋值属于传引用，指向同一个地址空间**

### 二维数组

- 定义：**type\[][] arrayname = new type[m] [n]**
- 可以不规则，给不同行分配不同大小的列
- <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220909084420.png" style="zoom: 33%;" align="middle"  />




## 容器遍历元素

```java
for (int value : fib)
/ /vaue获得fib数组每个元素,
/ /相当于fib[i]
	System.out,print(" " +value);
```

## 方法（递归）

- **递归方法适合用于分段函数类型的问题求解，必须有递归头和递归体**
- **递归和堆栈原理类似，递归也可以通过堆栈实现**

```java
//斐波那契数列第n项
public class fib {
    public static void main(String[] args)
    {
        System.out.println(sequence(10));
    }
    public static int sequence(int n)
    {
        if(n == 0|n == 1)
            return n;
        else if(n>=2)
            return sequence(n-2)+sequence(n - 1);
        else
        {
            System.out.println("Index error");
            return 0;
        }
    }
}
```

## 字符串

1. 字符串常量“abc”

2. String是字符串类,属于引用数据类型

3. `s.charAt(index)//索引下标的值`

4. 字符串变量及运算

   - 赋值运算

     ​	String str = "abc";

     ​	String str2 = str;

   - 连接运算+ +=

     ​    str = "abc" + "xyz"; //str的值为"abcxyz"

5. **字符串不是字符数组**

6. <div align="center">
       <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220909093029.png" style="zoom:25%" align="middle"/>
   </div>

## API文档

<div align="center">
    <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220909092844.png" style="zoom:25%" align="middle" />
</div>


---

# 第三章、类的封装、继承和多态

## 类和对象

类的特点：`具有封装性，继承性，多态性和抽象性。`

对象：`类的实例。`

注：

- Java中进行方法调用中传递参数时，**遵循值传递的原则**：基本类型传递的是该数据值本身。引用类型传递的是对对象的引用，而不是对象本身。
- 与c++类似，类的定义和调用要分开在两个文件中，类的声明与定义在一个文件，类的调用要在另外一个文件的类中定义一个类对象: `classname objname=new classname()`

```java
//类的声明
package ch4;

public class people {
    protected String name;
    private int age;
    public String getname() {
        return name;
    }
    public int getage() {
        return age;
    }
    public void setname(String name) {
        this.name = name;
    }
    public void setage(int age) {
        this.age = age;
    }
}
```

```java
//类的调用
package ch4;

import java.util.Scanner;

public class callpeople {
    public static void main(String[] args) {
        people zyk = new people();
        people fcs = new people();
        fcs = zyk;
        zyk.setname("赵逸坤");
        zyk.setage(21);
        System.out.println(zyk.getname()+"今年"+zyk.getage()+"岁了");
        System.out.println(zyk);
        System.out.println(fcs);
//        Scanner in = new Scanner(System.in);
//        String name = in.next();
//        System.out.println(in);
    }
}

```

## 类的封装

### 1构造方法和析构方法

```java
//在类里进行定义构造方法，用this对对象引用，从而避免与形参名的冲突
//super为隐式参数，为对父类的引用
public people(String name,int age) {
    this.name = name;
    this.age = age;
}
//析构方法
protected void finalize() {
    // 对象的清理工作
}
//给对象赋值为null，则对象的内存将会释放，但静态方法和变量不会释放
```

**方法的重载：**

`通过参数列表中参数的类型、个数和顺序的不同进行区别`

### 2对象的引用和运算

- instanceof对象运算符 eg：`d instanceof MyDate`
- super为隐式参数，为对**父类的引用**
- this为隐式参数，为对**对象本身的引用**
- 普通方法中，this总是指向调用该方法的对象; 构造方法中，this总是指向正要初始化的对象；this不能用于static方法；可以在一个构造方法中通过this调用其它构造方法，且必须是构造方法中 的第一条语句
- this不能用于**static方法**

### 3访问控制-隐藏/封装

- 隐藏对象内部的复杂性，只对外公开简单的接口。便于外界调用，从而提高系统的可扩展性、可维护性。
- boolean变量的get方法是is开头；常量或static变量公开
- default：默认访问控制属性，什么都没加就是该控制符。有的书上说 friendly、package，这都是一个意思，都不能真的写出来，如果什么访问修饰符都不加，就是default/friendly/package
- Java的访问控制是停留在编译层，也就是它不会在.class文件中留下任何痕迹，只在编译的时候进行访问控制的检查。其实，通过反射的手段，可以访问任何包下任何类中的成员，例如，访问类中的私有成员也是可以的。说明访问控制是`伪封装（类似于python）`。

#### 类的访问权限：

  **只有public和缺省两种**

  eg：public class MyDate 或class MyDate_ex
#### 类成员和函数的访问权限：

  <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220914154845348.png" alt="image-20220914154845348" style="zoom:60%" align="middle" />



#### 声明set()和get()方法存取对象的属性

### 4静态成员

- 静态成员是属于类本身的公共属性或方法。

- 静态成员变量也叫类属性或类变量，静态成员变量调用时可以对象.类属性或类名.类属性来访问。

- 静态方法调用时可以通过类名.类方法或对象.类方法调用，在调用该方法时，不会将对象的引用（this）传递给它，所以在 static 方法中不可访问非static的成员，静态方法只能访问静态成员变量或静态方法。

-  父类中是静态方法，子类中不能覆盖为非静态方法；在符合覆盖规则的前提下， 在父子类中，父类中的静态方法可以被子类中的静态方法覆盖，但无多态。（在使用对象调用静态方法时，实则是**调用编译时类型的静态方法**）。

- 父子类中，**静态方法**只能被**静态方法覆盖**，父子类中，**非静态方法**只能被**非静态方法覆盖**。

- **静态方法**只能调用**静态方法和成员**，**非静态方法**可以调用**所有方法和成员**。

#### 静态初始化块 static {}

> 注：如果希望加载后，对整个类进行某些初始化操作，可以使用static初始化块

1. 是在类初始化时执行，不是在创建对象时执行。 
2. 静态初始化块中不能访问非static成员变量。
3. 执行顺序：上溯到Object类，先执行Object的静态初始化块，再向下执行子类的静态初始化块，直到我们的类的静态初始化块为止。

---


## 类的继承

- <u>通过extends父类(单继承)关键词或implements接口(多继承)</u>

```java
public class Student extends Person
{
String speciality;
//专业
}
```

- **不支持多继承**

- 在java（C++）中类只有单继承，没有像C++那样的多继承。多继承，就是为了实现代码的复用性，却引入了复杂性，使得系统类之间的关系混乱；Java中的多继承，可以通过接口实现

- 如果定义一个类时，没有调用extends，则它的父类是java.lang.Object。Object类是所有java类的根基类。

### 1.方法的重写

- 在子类中可以根据需要对父类中继承来的方法进行重写。

- 重写方法(**虚函数**)必须和被重写方法具有**相同方法名称、参数列表、返回值**。通过子类去调用该方法，会调用重写方法而不是被重写方法(叫做重写方法覆盖被重写方法)。
  
- 可以在子类重写方法中调用被重写方法: **super关键字**。

- 重写方法的**访问权限**，**子类大于等于父类**(由于多态)。

- 重写方法的**返回值类型和声明异常类型**，**子类小于等于父类**。

- 对象.方法() :先在本类内部找是否有该方法，如果没有，到直接父类去找,如果还没有，则一直往上层找，一直找到Object，如果还没有，则报错。
  
- 子类继承父类的成员变量,子类继承父类除构造方法以外的成员方法,子类不**能继承父类的构造方法**,子类可以增加成员，可以重定义从父类继承来的成员，但不能删除它们。

### 2.子类对父类的访问权限

- 子类**不能访问**父类的**私有成员**( private )

- 子类**能够访问**父类的**公有成员**( public)和**保护成员**(protected)和**缺省成员**

- 子类对父类的缺省权限成员的访问控制，以包为界分两种情况，可以访问当前包中成员。

### 3.super引用

1. 调用父类的构造方法：super([参数列表])

2. super是直接父类对象的特征。

3. 引用父类同名成员

   - 子类隐藏父类成员变量：super.成员变量

   - 子类覆盖父类成员方法：super.成员方法([参数列表])

4. 构造方法:任何类的构造方法中，若是构造函数的第一行代码**没有显式调用super**(..);那么**Java默认都会调用super()**;作为父类的初始化函数。所以这里的super()加不加都会无所谓。( 内存分析，wrap:new对象的时候采用子类包裹父类的结构)
   
5. 同一个构造方法里面**不能同时调用super()和this()**。

6. 在本类构造方法中通过super()调用，会一直上溯到Object()这个构造函数,然后按类层级，依次向下执行各层级构造函数中剩下的代码，直至最低层级的构造函数。同this()一样，super()方法也应该放到构造方法的第一行。
   
7. new一个类的对象的时候，通过构造方法的从上至下的依次调用，就依次建立了新的根对象、父类对象和自身对象，其中，this指向新建的对象本身，super指向新建的直接父类对象本身。

### 4.组合VS继承

1. “is-a"关系使用继承，“has-a"关系使用组合:计算机类、主板类。可以通过在计算机类中增加主板属性来复用主板类的代码。

2. 如果仅仅从代码复用的角度考虑，组合完全可以替代继承。

3. 所谓组合，就是把要组合的另一个类作为属性放到类里面。

4. **是就用继承、有就用组合**。

#### 优缺点对比

![image-20220916083605738](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220916083605738.png)

## 类的多态

### 1.子类重定义父类成员

- 子类隐藏父类成员变量
- 子类覆盖父类成员方法
  - 覆盖(override)是指子类声明并实现父类中的同名方法并且参数列表也完全相同。子类继承并重载父类成员方法
  - 重载.(overload)是指同一个类中的多个方法可以同名但参数列表必须不同。

### 2.类型的多态

- 子类对象即是父类对象

  `new Student() instanceof Person //true`

  `new Person() instanceof Student //false`

- 父类对象引用子类对象

  `Person p = new Student(); / /赋值相容`
  `Student s = new Person();//语法错误`
  `Object obj = new Person();/ /赋值相容`

### 3.编译时的多态和运行时的多态

- 编译时多态性

  <u>方法**重载**都是**编译时多态**。</u>

  <u>方法覆盖(重写)表现出两种多态性，当**对象引用本类实例**时，为**编译时多态**，否则为**运行时多态**。</u>

  ```java
  Person p = new Person(.....);
  p.toString()
  //执行Person类的toString()
  Student s= new Studen(.....);
  s.toString()
  //执行Student类的toString()
  ```

- 运行时多态性

  <u>自下而上搜索，**有则调用无责溯源**</u>

  ![image-20220916085315869](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220916085315869.png)

### 4.多态的方法实现

```java
设public boolean equals(Person p) 
① 子类若public boolean equals(Student s) //重载
则s1.equals(p1) //继承，执行父类对象比较规则
s2.equals(s1) //重载，执行子类对象比较规则
结论：不必要，因为Person参数可接受Student实例。
② 子类若public boolean equals(Person p) //覆盖
```

> `多态存在条件`：
>
> **:one:要有继承**；
>
> **:two:子类要有方法重写**；
>
> **:three:父类引用指向子类对象**。

### 5. 方法的多态性总结

![image-20220921141638509](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220921141638509.png)

- **子类类型的对象地址**可以直接**赋给父类类型**的**引用对象**，这个称为**向上转型**，是实现多态的基础。

- **引用类型的强制转型**，适用于**将父类类型向下强制转换为子类类型**。 不同类型之间不能强制转型（编译不通过）

- A instanceof B: A对象的类型是否是B类型，只有在A对象的类型和B类型相同，或为父子类型时，编译不报错。而在运行时，只有A对象类型为B类型的子类型或者就是B类型时，结果才返回true。
- 内存分析(例子: myServlet) :调用父类的service(),然后调用子类的doGet() (注意: this关键字指向整个最终包裹对象，即最外层的子对象;而在包裹对象中，每一层对象通过super关键字指向内一层的父对象)。
- **多态指的是方法的多态**(到底调用那个方法，运行时决定)，属性没有多态。
- 针对某个类型的方法调用，其真正执行的方法取决于运行时期实际类型的方法。
- **重写的方法**都是**虚方法**，根据**实际**调用**对象的实例**的类型来**动态决定**的。

## 抽象类

### 要点

![image-20220921145517282](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220921145517282.png)

### 用法

```java
public abstract class ClosedFigure
//闭合图形抽象类
{
public abstract double area( );
//计算面积，抽象方法，以分号";"结束
}
```

1. <u>**构造方法、静态成员方法**</u>不能被声明为**抽象方法**。
2. 一个**非抽象类**必须**实现**从父类继承来的**所有抽象方法**。
3. **不能**创建抽象类的**实例**。例如:`ClosedFigure g = new ClosedFigure();` 
4. <u>abstract修饰方式的初衷就是要求其子类覆盖(实现)这个方法，并且调用时可以以多态方式调用子类覆盖后的方法(抽象类主要和多态技术相结合)</u>，即抽象方法必须在其子类中实现，除非子类本身也是抽象类。<u>abstract不允许修饰成员变量</u>，因为成员变量也没有重写这个概念!
5. **抽象类**可以**只有具体方法**，也可以**全是抽象方法**，子类继承抽象类也可以是抽象类，但要实例化的类不能是抽象类。
6. :star:不能放在一起的修饰符: <u>**final和abstract**, **private和abstract**, **static和abstract**</u>，因为abstract修饰的方法是必须在其子类中实现(覆盖)，才能以多态方式调用，以上修饰符在修饰方法时期子类都覆盖不了这个方法，<u>**final是不可以覆盖**</u>，**<u>private是不能</u><u>够继承到子类</u>**，所以也就不能覆盖，<u>**static是可以覆盖的**，但是在**调用时会调用编译时类型的方法**，因为调用的是父类的方法，而父类的方法又是**抽象的方法**，又**不能够调用**</u>，所以上面的修饰符不能放在一起。

## 最终类

1. 声明**最终类**， **不能被继承**
   
   ```java
   public final class Math
   //数学类，最终类
   public class MyMath extends Math
   //语法错
   public final class Circle extends Ellipse / /最终类
   ```
   
   
   
1. 声明**最终方法**,**不能被子类覆盖**

   ```java
   public class Circle extends Ellipse
   
   / /非最终类
   
   {
   
   public final double area( )
   
   //最终方法
   
   }
   ```
   
### final关键词

1. final修饰变量时表示常量。<u>变量被final修饰，就会变成常量</u>(常量应大写)，一旦赋值不能改变(可以在<u>**初始化时直接赋值**</u>，也可以在<u>**构造方法里赋值**</u>，只能在这两种方法里二选一，<u>必须为常量赋值</u>) ;final的常量不会有默认初始值，对于直接在初始化时赋值方式，final修饰符常和static修饰符一起使用。
2. final修饰方法(最终方法)时表示<u>该方法**不可被子类重写**</u>。但是<u>**可以被重载**</u>。
3. <u>final修饰类</u>(最终类)时表示修饰的<u>类**不能有子类**</u>，**不能被继承**。比如Math、String。 final类中的方法也都是final的。

## 接口类

<u>如果一个抽象类没有字段，所有方法全部都是抽象方法，就可以将该抽象类改为接口。</u>

类不能多继承类，但可以实现多个接口，一个接口可以继承多个接口。

接口可以看成<u>**狭义抽象**</u>，将设计与实现彻底分离。

通过给类新增接口来改变类，而不影响子类。

**接口不能有构造方法**，抽象类可以有。

接口可以定义`default`方法（有方法实体，子类可以不用重写）。

```java
interface Person{
void run() ;
String getName() ;
}
```

类实现接口：

```java
class Student implements Person {
    private String name;

    public Student(String name) {
        this.name = name;
    }

    @Override//规定下面的编译为重写
    public void run() {
        System.out.println(this.name + " run");
    }

    @Override
    public String getName() {
        return this.name;
    }
}
```

### 抽象类和接口的对比

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220921155545894.png" alt="image-20220921155545894" style="zoom: 80%" align="middle" />



```java
public class Main {
    public static void main(String[] args) {
        Person p = new Student("Xiao Ming");
        p.run();
    }
}

interface Person {
    String getName();
    default void run() {
        System.out.println(getName() + " run");
    }
}

class Student implements Person {
    private String name;

    public Student(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}
```

### 接口与抽象的区别

- 接口不能有方法体(**除default**)，抽象类可以有。

- 接口**可以有静态方法但必须实现方法体**，抽象类可以有。
- 在接口中凡是变量必须是**public static final**,而在抽象类中没有要求。
- 抽象类本质上还是一个类，子类是用关键字extends来继承它，并扩展的，有非常强的is-a的关系。而接口，是被其他类用关键字implements来实现接口定义的方法的。接口只是定义功能和行为规范，如果一个类实现了一个接口，那么这个类必须遵守这个接口的方法约定，但没有is-a的关系。

## 内部类和内部接口

![image-20220923082921856](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220923082921856.png)



- 内嵌类型**不能**与外层类型**同名**。

- **内部类**中可以**声明成员变量和成员方法**。
- 内部类**可以继承父类或实现接口**。
- 可以声明内部类为**抽象类**，该抽象类**必须被其他内部类继承**;**内部接口**必须**被其他内部类实现**。

- 使用点运算符“.”引用内嵌类型:**外层类型.内嵌类型**eg：`Pixel.Color`
- 内嵌类型具有类中成员的4种访问控制权限。当内部类可被访问时，才能考虑内部类中成员的访问控制权限。
- 内嵌类型与其外层类型彼此信任，能访问对方的所有成员
- **内部接口总是静态的**；**内部类**可声明是**静态的或实例的**，**静态内部类**`能够声明静态成员`，但**不能引用外部类的实例成员**;**实例内部类**`只能声明实例成员，不能声明静态成员`。

- 在**实例内部类**中，使用以下格式引用或调用外部类当前实例的成员变量或实例成员方法:

  `外部类.this.成员变量//引用外部类当前实例的成员变量`

  `外部类.this.实例成员方法(参数列表)//调用外部类当前实例的成员方法`

### 总结

![image-20221102203811765](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221102203811765.png)





## API

### java.lang包中的基础类库

#### 1.Object类

```java
package java.lang;
public class Object
{
public Object() //构造方法
public final Class<?> getClass(); //返回当前对象所在的类
public boolean equals(Object obj) 
//比较当前对象与obj是否相等
public String toString() //返回当前对象的信息字符串
protected void finalize() throws Throwable //析构方法
}
```

#### 2.Math数学类

```java
public final class Math extends Object
{
public static final double E = 2.7182818284590452354; //常量
public static final double PI = 3.14159265358979323846;//π 
public static double abs(double a) //求绝对值
public static double random() //返回一个0.0~1.0之间的随机数
public static double pow(double a, double b) //返回a的b次幂
public static double sqrt(double a) //返回a的平方根值
public static double sin(double a) //返回a的正弦值
}
```

#### 3.Comparable可比较接口

```java
public interface Comparable<T>
{
int compareTo(T cobj) //比较对象大小
}
//其中，<T>是Comparable接口的参数，表示一个类。
```

#### 4.基本数据类型的包装类

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220923083806822.png" alt="image-20220923083806822" style="zoom: 67%;" />

> 对应关系：Byte-byte; Boolean-boolean; Short-short; `Character-char`; `Integer-int`; Long-long; Float-float; Double-double。

**自动裝箱:**基本数据类型就自动的封装到与它相同类型的包装中。如:`Integer i = 100`;本质上就是编译器编译时自动为我们添加了`Integer i = new Integer(100)`;
**自动拆箱**:包装类对象自动转化为基本数据类型。如:`int a = new Integer(100)`;本质上就是编译器编译时自动为我们添加了`int a = new Integer( 100).intValue()`;
**缓存问题:** [-128,127]之间的数对应的包装类对象，仍然当做基本数据类型来处理;一旦遇到一个这个之间的数(默认为这些小的数使用频率会很高)，把他**包装成一个对象**后，就**缓存起来**，下次如果又要包装一个这个数的对象，则去看是否已经有这个对象，有就直接**拿来使用**，这样可以节省内存空间、提高效率(**享元模式**)。
**享元模式:**有很多小对象，它们的大部分属性相同，这时可以把它们变成一个对象，那些**相同的属性为对象的内部状态**，那些**不同的属性可以变为方法的参数**，由外部传入。例: -128~127 内的相同整数自动装箱为同一个对象。

:one:Interger类：

```java
public final class Integer extends Number implements Comparable<Integer>
{
public static final int MIN_VALUE=0x80000000;//最小值-2^31
public static final int MAX_VALUE = 0x7fffffff; //最大值2^31-1
private final int value; //私有最终变量，构造时赋值
public Integer(int value) //构造方法
public Integer(String s) throws NumberFormatException 
public static int parseInt(String s) throws NumberFormatException //将字符串转换为整数，静态方法
public String toString() //覆盖Object类中方法
public static String toBinaryString(int i)
//将i转换成二进制字符串，i≥时，省略高位0
public static String toOctalString(int i)
//将i转换成八进制字符串，i≥时，省略高位0
public static String toHexString(int i)
//将i转换成十六进制字符串
public boolean equals(Object obj)
//覆盖Object类中方法
public int compareTo(Integer iobj)
//比较两个对象值大小，返回1、0或1
}

```

:two:Double类：

```java
public final class Double extends Number
implements Comparable<Double>
{
public Double(double value) 
public Double(String s) throws NumberFormatException
public static double parseDouble(String s) throws NumberFormatException //将串s转换为浮点数
public double doubleValue()//返回当前对象中的浮点数值
}
```

#### 5.String字符串类

```java
public final class String extends Object implements java.io.Serializable, Comparable<String>, 
CharSequence
{
private final char value[]; //字符数组，最终变量
public String() //构造方法
public String(String original)
public String toString() //覆盖Object类中方法
public int length() //返回字符串的长度
public boolean equals(Object obj) //比较字符串是否相等
public boolean equalsIgnoreCase (String s)//忽略字母大小写
public int compareTo(String s) //比较字符串的大小
public int compareToIgnoreCase(String str)
}
```

#### 7.Class类

```java
public final class Class<T>
{
public String getName() //返回当前类名字符串
public Class<? super T> getSuperclass(); //返回当前类的父类
public Package getPackage() //返回当前类所在的包
}
this.getClass().getName()
this.getClass().getSuperclass().getName()
this.getClass().getPackage().getName()
```

#### 8.System系统类

```java
public final class System extends Object 
{
public final static InputStream in = nullInputStream();
public final static PrintStream out = nullPrintStream();
public final static PrintStream err = nullPrintStream();
public static native void arraycopy(Object src, int src_pos, Object dst, int dst_pos, int length) //复制数组
public static void exit(int status) //结束当前运行的程序
public static native long currentTimeMillis();//获得当前日期和时间，返回从1970-1-1 00:00:00开始至当前时间的累计毫秒数
public static Properties getProperties() //获得系统全部属性
public static String getProperty(String key) //获得指定系统属性
}
```

#### 9.Runtime运行时类

```java
public class Runtime extends Object
{
public static Runtime getRuntime()//返回与当前应用程序相联系的运行时环境
public long totalMemory() //返回系统内存空间总量
public long freeMemory() //返回系统内存剩余空间的大小
}
```

### java.util包中的工具类库

#### 1.日期类

```java
public class Date extends Object implements java.io.Serializable, Cloneable, Comparable<Date>
{
public Date() //获得系统当前日期和时间的Date对象
{
this(System.currentTimeMillis());
}
public Date(long date) //以长整型值创建Date对象
public int compareTo(Date date)//比较日期大小，返回0、1、-1 
}
```

#### 2.Calendar类

```java
public abstract class Calendar extends Object implements Serializable, Cloneable, Comparable<Calendar> 
{
public static final int YEAR //年，常量
public static final int MONTH //月
public static final int DATE //日
public static final int HOUR //时
public static final int MINUTE //分
public static final int SECOND //秒
public static final int MILLISECOND //百分秒
public static final int DAY_OF_WEEK //星期
public static Calendar getInstance() //创建实例
public int get(int field) //返回日期
public final Date getTime() //返回对象中的日期和时间
public final void setTime(Date date) //设置对象的日期和时间
public final void set(int year, int month, int date)
public final void set(int year, int month, int date, int hour, int minute)
}
```

#### 3.GregorianCalendar类

```java
public class GregorianCalendar extends Calendar 
{
public GregorianCalendar() //以当前日期时间创建对象
public GregorianCalendar(int year, int month, int day) 
public GregorianCalendar(int year, int month, int day, int hour, int minute, int second) 
public boolean isLeapYear(int year) //判断是否闰年
}
```

### Comparator比较器接口

```java
public interface Comparator<T>
{
public abstract boolean equals(Object obj); //比较两个比较器对象是否相等
public abstract int compare(T cobj1, T cobj2); //指定比较两个对象大小的规则
}
```

###  Arrays数组类

#### 1.排序

```java
public static void sort(Object[] a)
public static <T> void sort(T[] a,Comparator<? super T> c)
```

#### 2.二分法(折半)查找

```java
public static int binarySearch(Object[] a, Object key) 
public static <T> int binarySearch(T[] a, T key, Comparator<? super T> c)
```

## 泛型(类的参数)

> 类似于C++和Python的`模板`，他们有模板类和模板函数。

### 泛型声明

`[修饰符] class 类<类型参数列表> [extends父类] [implements 接口列表]`
`[public] interface 接口 < 类型参数列表> [extends父接口列表]`
`[public] [static] < 类型参数列表 > 返回值类型方法([参数列表]) [throws 异常类列表]` 

![image-20220923092011478](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220923092011478.png)

> :rainbow: 不能使用在基本类型上 
>
> :tomato: 不能使用在静态属性上

```java
public interface GenericIntercace<T> {
T getData();//类似于c++的模板
```

注意：

- `接口`中泛型字母只能使用在`方法`中，不能使用在`全局常量`中

- 泛型方法可以在`非泛型类`中

### 泛型继承

泛型父类:子类为"富二代”:子类的泛型要比父类多

1. 保留父类的泛型-->子类为泛型类

2. 不保留父类泛型-->子类按需实现

- 子类[重写方法]的参数类型-->随父类而定
- 子类新增的方法，参数类型随子类而定
- 子类中使用父类的[属性] --> 随父类而定
- 子类使用自己的属性-->随子类而定

![image-20220923093134846](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220923093134846.png)



### 泛型擦除

- 定义:泛型擦除是指在**继承(实现)**或**使用**时**没有指定具体的类型**
- 特点:一旦擦除之后按**Object**处理

```java
//2)没有类型擦除--》Object
class C4 <A,B> extends Father{
public void test(Object name) {子类重写方法的参数类型-->随父类而定:
Object 
	this.age = new Object();//Object类型，子类使用父类的[属性]，类型
随父类而定
}

```

### 通配符

- **T、K、V、E**等泛型字母为有类型，类型参数赋予**具体的值**
- **?**未知类型类型参数赋予**不确定值**，任意类型
- 只能用在**声明类型、方法参数**上，不能用在定义泛型类上

```java
public class GenericTest {
public static void main(String[] args) {
List<String> name = new ArrayList<String>();
List<Integer> age = new ArrayList<Integer>();
List<Number> number = new ArrayList<Number>();
name.add("icon");
age.add(18);
number.add(314);
getData(name);
getData(age); 
getData(number);
}
public static void getData(List<?> data) {
System.out.println("data :" + data.get(0));
}

```

**上限** extends :指定的类型必须是继承某个类，或者实现某个接口(不是用implements)， 即<=如 

`– ? extends Fruit `

`– T extends List`

**下限** super：指定的类型不能小于操作的类 ，即>= 如 

`– T super Apple` 

`– ？ super Apple`

---

# 第四章、异常处理

## 异常类型

- 用户输入了非法数据。 
- 要打开的文件不存在。 
- 网络通信时连接中断，或者JVM内存溢出。

![image-20220928141405830](C:\Users\alleyf\AppData\Roaming\Typora\typora-user-images\image-20220928141405830.png)



## 异常处理基础

- 将程序正常代码与错误处理代码分开。

- 使程序具有处理运行错误的能力。

### 错误

(Error)指程序运行时遇到的硬件、操作系统、虚拟机的错误。 Error错误类。Java程序**不能处理错误**，只能依靠外界干预。

1. NoClassDefFoundError类定义未找到错误。没有.class文件，或没有main()方法时。
2. OutOfMemoryError内存溢出错误。没有可用内存时。
3. StackOverflowError栈溢出错误。当递归函数不能正常结束时。

![image-20220928142730920](C:\Users\alleyf\AppData\Roaming\Typora\typora-user-images\image-20220928142730920.png)





### 异常

（Exception）指在硬件、操作系统、虚拟 机正常时，程序遇到的运行错（语义错）

#### 异常类（默认java.lang包）

![image-20220928143014612](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220928143014612.png)



#### 内置异常类

![](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220928160253693.png)



#### 异常方法

![](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220928160326479.png)



异常类声明

```java
public class Throwable implements Serializable 
{
public String getMessage() //获得异常信息
public String toString() //获得异常对象的描述信息
public void printStackTrace()//显示异常栈跟踪信息
}
public class Exception extends Throwable
{
public Exception()
public Exception(String message)
}

```

1. **ArithmeticException**

    3/0 //整除，除数为0，算术异常

   3.0/0 //实数除，除数为0，无穷大 

2. **NullPointerException** 空对象异常

    int x[] = null;

    x[0] = 1; //对空数组中的元素进行操作

    String str = null;

    str.length() //空对象调用方法

3. **ClassCastException** 

   Object obj = new Object(); 

   String str = (String) obj; //类型强制转换异常



## 异常处理方式

1. 程序应`避免而不捕获`的异常，运行异常

-  **除数为0**、**数组下标越界**等

1. `必须捕获`的异常

- **数值格式**异常，如果没有捕获，由Java虚拟机处理。
- **文件不存在**、**网络连接中断**、**数据库连接中断**等，必须捕获，否则编译不能通过。

## 异常处理措施

### 异常处理语句

```java
try
{
语句1； //存在潜在异常的代码
}
catch (异常类 异常对象)
{
语句2； //捕获到异常并进行处理的代码
}
finally
{
语句3；//最后必须执行的代码，无论是否捕获到异常
}
```

### 抛出异常

1. <u>方法声明抛出异常的throws字句</u>

eg：[修饰符] 返回值类型 方法([参数列表]) **[throws 异常类列表]**

1. <u>方法内抛出异常</u>

eg：**throw 异常对象**

```java
//[修饰符] 返回值类型 方法([参数列表])[throws异常类列表]
public static int parseInt(String s) throws NumberFormatException //日期类声明抛出异常的方法与方法调用者处理异常。
public void set(int year, int month, int day) throws Exception
public MyDate(int year, int month, int day) throws Exception
{
this.set(year, month, day);
}
public static void main(String[] args) throws Exception
```

### throws和throw以及try-catch-finally的区别

- throws为方法`声明可能出现的异常`，函数调用者不处理异常则继续向下抛出异常直至被处理，否则程序结束。
- throw主要是`发现异常并抛出指定的异常对象`给调用者，当抛出异常后，后面的语句就不会执行了。
- throw要么和**try-catch-finally**语句配套使用，抛出异常后就用处理异常；要么与**throws**配套使用，方法头声明抛出异常类，方法内抛出异常对象而不处理该异常，直到该方法被调用时调用者处理异常则结束，否则继续抛出该异常。

```java
class ThrowsDemo {
    static void throwOne() throws IllegalAccessException {
        System.out.println("Inside throwOne.");
        throw new IllegalAccessException("demo");
    }
    public static void main(String args[]) {
        try {
            throwOne();
        } 
        catch (IllegalAccessException e) {
            System.out.println("Caught " + e);
        }
    }
}
```

### 自定义异常类

```java
//日期格式异常类
public class DateFormatException extends IllegalArgumentException
//MyDate类修改方法，抛出日期格式异常类 ，向调用者传递异常
public void set(int year, int month, int day) throws DateFormatException
{ if (……)
	throw new DateFormatException("月份错误");
}
//调用方法处理异常，若不能处理则声明抛出日期格式异常，再向调用者传递异常
public MyDate(int year, int month, int day) throws DateFormatException
{ 
    this.set(year, month, day);
}
//由datestr字符串构造日期，默认日期字符串格式为"yyyy年MM月dd日" 
public MyDate(String datestr) throws NumberFormatException, DateFormatException 
public static void main(String args[]) throws NumberFormatException, DateFormatException
{
	new MyDate("2017年2月29日");
}
```

---

# 第五章、图形用户界面（GUI）

## AWT组件及其属性

- > java.awt包提供抽象窗口工具集（Abstract  Window Tookit，AWT）
- > javax.swing包提供JDK 1.2的Swing组件， 它扩展了AWT组件的功能

### AWT组件

![image-20220930081159260](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220930081159260.png)







### 布局管理

#### FlowLayout（流布局管理器） 

> Panel面板的默认布局管理器.

```java
public class FlowLayout implements LayoutManager, 
java.io.Serializable 
{
public static final int LEFT = 0; //左对齐，类常量，全部大写
public static final int CENTER = 1; //居中
public static final int RIGHT = 2; //右对齐
public FlowLayout() //构造方法，默认居中
public FlowLayout(int align) //align参数指定对齐方式
}
```

#### BorderLayout（边布局管理器）

> Window窗口的默认布局管理器.

```java
public class BorderLayout implements 
LayoutManager2, java.io.Serializable 
{
public static final String NORTH = "North"; 
public static final String SOUTH = "South";
public static final String EAST = "East";
public static final String WEST = "West";
public static final String CENTER = "Center";
//注意，字符串首字母大写
public BorderLayout() //构造方法
}
```

#### GridLayout（网格布局管理器）

```java
public class GridLayout implements 
LayoutManager, Serializable 
{
public GridLayout(int rows, int cols) 
//参数指定行、列
}
```













### 颜色和字体

#### 颜色

```java
public class Color implements Paint, java.io.Serializable 
{
public Color(int r, int g, int b) //以三元色值构造对象
public Color(int rgb) //以RGB值构造对象
public int getRed() //返回红色值
public int getGreen() //返回绿色值
public int getBlue() //返回蓝色值
public int getRGB() //返回颜色的RGB值
public Color brighter() //使颜色变浅
public Color darker() //使颜色变深
}
```

#### 字体

```java
public class Font implements java.io.Serializable
{
public static final int PLAIN = 0; //常规
public static final int BOLD = 1; //粗体
public static final int ITALIC = 2; //斜体
public Font(String name, int style, int size)//字体名、字形、字号
public String getName() //返回字体名称
public int getSize() //返回字体大小
public int getStyle() //返回粗、斜体值
}
```

## 事件处理

![](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220930090145928.png)

#### 事件和事件源

> **事件（event）**是指一个状态的改变，或者一个活动的发生。 产生事件的组件称为**事件源（event source）** 。

#### 事件类和事件监听器接口

```java
public interface ActionListener extends 
EventListener //动作事件监听器接口
{
public void actionPerformed(ActionEvent ev);
//动作事件处理方法
}
```

#### 窗口事件监听器接口

```java
public interface WindowListener extends EventListener
{ 
public abstract void windowOpened(WindowEvent ev); //打开后
public abstract void windowClosing(WindowEvent ev); //关闭时
public abstract void windowClosed(WindowEvent ev) ; //关闭后
public abstract void windowIconified(WindowEvent ev);//最小化
public abstract void windowDeiconified(WindowEvent ev);//恢复
public abstract void windowActivated(WindowEvent ev) ;//激活
public abstract void windowDeactivated(WindowEvent ev) ;
//变为不活动
}
```

#### 组件注册事件监听器对象

```java
public class Button extends Component 
implements Accessibl
{
public void addActionListener(ActionListener l)
//注册动作事件监听器
public void removeActionListener(ActionListener l) 
//取消注册动作事件监听器
}
button.addActionListener(this);
```

#### 窗口对象注册窗口事件监听器

```java
public class Window extends Container 
implements Accessible //窗口类
{
void addWindowListener(WindowListener l) 
//注册窗口事件监听器
void removeWindowListener(WindowListener l)
//取消窗口事件监听器
}
frame.addWindowListener(this);
```

## AWT事件类和事件监听器接口

![image-20221109222028588](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221109222028588.png)

###  AWT事件类

```java
public class EventObject implements java.io.Serializable 
{
public Object getSource() //返回产生事件的事件源组件
public String toString() //返回事件对象信息
}
public class ActionEvent extends AWTEvent 
{
public String getActionCommand() //获得按钮的标签
}
```

### AWT事件监听器接口

1. WindowListener 窗口事件 

2. ActionListener 动作事件 
3. MouseMotionListener 鼠标移动事件 
4. MouseListener 鼠标事件 
5. KeyListener 键盘事件 
6. FocusListener 焦点事件

**AWT组件类中注册事件监听器的方法**

```java
public abstract class Component extends Object
implements ImageObserver, MenuContainer, 
Serializable
{
public void addKeyListener(KeyListener l)
public void addMouseListener(MouseListener l)
public void 
addMouseMotionListener(MouseMotionListener l)
}
```

## Swing组件及事件

### 1.Swing组件与布局

#### Swing组件类关系

![image-20220930090437034](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220930090437034.png)

#### 主要类及组件类的继承关系

![image-20220930090537860](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220930090537860.png)



> 此处整理不完整，其余内容详见->[`Java Swing用法简介`](https://xiets.blog.csdn.net/article/details/72814531?spm=1001.2014.3001.5506)

---

# 第六章、多线程编程

## 进程和线程

### 进程

是系统进行**资源分配和保护的基本单位**，指一个内存中运行的应用程序 ，每个进程都有一个独立的内存空间，一个应用程序可以同时运行多个进程；进程也是程序的一次执行过程，是系统运行程序的基本单位；系统运行一个程序即是一个进程从创建、运行到消亡的过程。

> 特点：:one: 动态性 :two: 独立性 :three: 并发性 :four: 共享性 :five: 制约性
>
> 静态特征：程序和数据
>
> 动态特征：进程映像，包括以下4要素
>
> - 进程控制块（Process Control Block，PCB）， 用来存储进程的标志信息、现场信息和控制信息， 是进程存在的唯一标识 
> - 进程程序块
> - 进程核心栈 
> - 进程数据块

### 线程

是系统**资源调度的基本单位**，进程内部的一个独立执行单元；一个进程可以同时并发的运行多个线程，可以理解为一个进程便相当于一个单 CPU 操作系统，而线程便是这个系统中运行的多个任务。 

### 区别

进程：有独立的内存空间，进程中的数据存放空间（堆空间和栈空间）是独立的，至少有一个线程。

线程：**堆内存**和**方法区**是**共享**的，**栈内存**是**独立**的，线程消耗的资源比进程小的多。 

### 目的

**`提高系统的资源利用率和程序的处理效率`**

### 状态及转换

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221007080603796.png">



<img src="https://img-blog.csdnimg.cn/20210512173109590.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0NzE1OTQz,size_16,color_FFFFFF,t_70">




### 多线程结构

![image-20221007080648065](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221007080648065.png)



![](https://img-blog.csdnimg.cn/20210512175007490.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0NzE1OTQz,size_16,color_FFFFFF,t_70#pic_center)

### 对比

![image-20221007080759956](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221007080759956.png)



## Java的线程对象

1. 通过实现**接口Runnable，实现void run()方法**创建线程对象，是**线程对象**。
   - 创建一个实现Runnable接口的类。
   - 实现类去实现Runnable接口中的抽象方法：run()。
   - 创建实现类的对象。
   - 将此对象作为参数传到Thread类的构造器中，创建Thread类的对象。
   - 通过Thread类的对象调用start()方法。

```java
package com.broky.multiThread;

public class RunnableThread {
    public static void main(String[] args) {
        //创建实现类的对象
        RunnableThread01 runnableThread01 = new RunnableThread01();
        //创建Thread类的对象,并将实现类的对象当做参数传入构造器
        Thread t1 = new Thread(runnableThread01);
        //使用Thread类的对象去调用Thread类的start()方法:①启动了线程 ②Thread中的run()调用了Runnable中的run()
        t1.start();

        //在创建一个线程时，只需要new一个Thread类就可,不需要new实现类
        Thread t2 = new Thread(runnableThread01);
        t2.start();
    }
}

//RunnableThread01实现Runnable接口的run()抽象方法
// 这并不是一个线程类，是一个可运行的类。它还不是一个线程
class RunnableThread01 implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            if (i % 2 == 0) System.out.println(Thread.currentThread().getName() + ":\t" + i);
        }
    }
}
```

2. 通过**继承Thread类并重写void run()**方法创建线程对象，是**线程的目标对象**。
   - 创建一个继承于Thread类的子类。
   - 重写Thread类的run()方法。
   - 创建Thread类的子类的对象。
   - 通过此对象调用start()来启动一个线程。

```java
package com.broky.multiThread.exer;

public class ThreadExerDemo01 {
    public static void main(String[] args) {
        new Thread01().start();
        new Thread02().start();
    }
}

class Thread01 extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            if (i % 2 == 0) System.out.println(Thread.currentThread().getName() + ":\t" + i);
        }
    }
}

class Thread02 extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            if (i % 2 != 0) System.out.println(Thread.currentThread().getName() + ":\t" + i);
        }
    }
}
```

**两种实现方式的比较**

- **第一种方式**实现接口比较常用，因为一个类实现了接口，它还可以去继承其它的类，更灵活。
- Java中只允许单进程，以卖票程序TiketSales类来说，很有可能这个类本来就有父类，这样一来就不可以继承Thread类来完成多线程了，但是一个类可以实现多个接口，因此实现的方式没有类的单继承性的局限性，用实现Runnable接口的方式来完成多线程更加实用。
- 实现Runnable接口的方式天然**具有共享数据的特性**（不用static变量）。因为继承Thread的实现方式，需要创建多个子类的对象来进行多线程，如果子类中有变量A，而不使用static约束变量的话，每个子类的对象都会有自己独立的变量A，只有static约束A后，子类的对象才共享变量A。而实现Runnable接口的方式，只需要创建一个实现类的对象，要将这个对象传入Thread类并创建多个Thread类的对象来完成多线程，而这多个Thread类对象实际上就是调用一个实现类对象而已。实现的方式更适合来处理多个线程有共享数据的情况。
- 联系：Thread类中也实现了Runnable接口；两种方式都需要重写run()方法，线程的执行逻辑都在run()方法中

3. 实现Callable接口
   - 相比run()方法，可以有返回值
   - 方法可以抛出异常
   - 支持泛型的返回值
   - 需要借助FutureTask类，比如获取返回结果

```java
package com.broky.multiThread;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

/**
 * 创建线程的方式三：实现Callable接口。 ---JDK5新特性
 * 如何理解Callable比Runnable强大？
 * 1.call()可以有返回值
 * 2.call()可以抛出异常被外面的操作捕获
*/
//1.创建一个实现Callable的实现类
class NumThread implements Callable<Integer>{
    //2.实现call方法，将此线程需要执行的操作声明在call()中
    @Override
    public Integer call() throws Exception {
        int sum = 0;
        for (int i = 1; i < 100; i++) {
            if(i%2==0){
                System.out.println(i);
                sum += i;
            }
        }
        return sum;
    }
}

public class ThreadNew {
    public static void main(String[] args) {
        //3.创建Callable接口实现类的对象
        NumThread numThread = new NumThread();
        //4.将此Callable接口实现类的对象作为参数传递到FutureTask构造器中，创建FutureTask对象
        FutureTask<Integer> futureTask = new FutureTask(numThread);
        //5.将FutureTask的对象作为参数传递到Thread类的构造器中，创建Thread对象，并调用start()
        new Thread(futureTask).start();

        try {
            //6.获取Callable中Call方法的返回值
            Integer sum = futureTask.get();
            System.out.println("总和为"+sum);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

    }
}

```

4. 线程池

   - **背景：**

    经常创建和销毁、使用量特别大的资源、比如并发情况下的线程、对性能影响很大。

   - **思路：**

    提前创建好多个线程，放入线程池中，使用时直接获取，使用完放回池中。可以避免频繁创建销毁、实现重复利用。类似生活中的公共交通工具。

   - **优点：**

    提高响应速度（减少了创建新线程的时间）

    降低资源消耗（重复利用线程池中线程，不需要每次都创建）

    便于线程管理

```java
package com.broky.multiThread;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * 创建线程的方式四：使用线程池
 * <p>
 * 面试题：创建多线程有几种方式
 *
 * @author 13roky
 * @date 2021-04-22 21:49
 */

class NumberThread implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            if (i % 2 == 0) {
                System.out.println(Thread.currentThread().getName() + ":\t" + i);
            }
        }
    }
}

public class ThreadPool {
    public static void main(String[] args) {

        //1.提供指定线程数量的线程池
        ExecutorService service = Executors.newFixedThreadPool(10);
        ThreadPoolExecutor service1 = (ThreadPoolExecutor) service;
        //设置线程池的属性
        //        System.out.println(service.getClass());
        //        service1.setCorePoolSize(15);
        //        service1.setKeepAliveTime();

        //2.执行指定的线程的操作。需要提供实现Runnable接口或Callable接口实现类的对象。
        service.execute(new NumberThread()); //适合用于Runnable
        //        service.submit(); 适合适用于Callable
        //关闭线程池
        service.shutdown();
    }
}

```

### Thread类的常用方法

- start() : 启动当前线程, 调用当前线程的run()方法

- run() : 通常需要重写Thread类中的此方法, 将创建的线程要执行的操作声明在此方法中

- currentThread() : 静态方法, 返回当前代码执行的线程

- getName() : 获取当前线程的名字

- setName() : 设置当前线程的名字

- yield() : **释放当前CPU的执行权**，回到**就绪状态**，在回到就绪之后，**有可能还会再次抢到**,抢到后接着运行（让位）。

- join(long millis, int nanos) : 在**线程a中调用线程b的join()**, 此时**线程a进入阻塞状态, 直到线程b完全执行完以后**（等待该线程终止的时间最长为 millis 毫秒 + nanos 纳秒）, 线程a**才结束阻塞状态**

- stop() : 已过时. 当执行此方法时,强制结束当前线程.

- sleep(long militime) : 让线程睡眠指定的毫秒数后回到就绪态抢夺CPU时间片，在指定时间内，线程是**定时等待状态**,可以实现线程定时执行。

- isAlive() ：判断当前线程是否存活

- interrupt() ：设置中断标记

- isInterrupted() ：判断是否中断

**join用法**

```java
public class ThreadTest13 {
    public static void main(String[] args) {
        System.out.println("main begin");

        Thread t = new Thread(new MyRunnable7());
        t.setName("t");
        t.start();

        //合并线程
        try {
            t.join(); // t合并到当前线程中，当前线程受阻塞，t线程执行直到结束。
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("main over");
    }
}

class MyRunnable7 implements Runnable {

    @Override
    public void run() {
        for(int i = 0; i < 10000; i++){
            System.out.println(Thread.currentThread().getName() + "--->" + i);
        }
    }
}

```

**线程正常结束模板**

```java
public class thread10 {
    public static void main(String[] args) {
        MyRunable4 r = new MyRunable4();
        Thread t = new Thread(r);
        t.setName("t");
        t.start();

        // 模拟5秒
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // 终止线程
        // 你想要什么时候终止t的执行，那么你把标记修改为false，就结束了。
        r.run = false;
    }
}

class MyRunable4 implements Runnable {

    // 打一个布尔标记
    boolean run = true;

    @Override
    public void run() {
        for (int i = 0; i < 10; i++){
            if(run){
                System.out.println(Thread.currentThread().getName() + "--->" + i);
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }else{
                // return就结束了，你在结束之前还有什么没保存的。
                // 在这里可以保存呀。
                //save....

                //终止当前线程
                return;
            }
        }
    }
}
```




### 生命周期

> JDk中用Thread.State类定义了线程的几种状态想要实现多线程，必须在主线程中创建新的线程对象。Java语言使用Thread类及其子类的对象来表示线程，在他的一个完整的生命周期中通常要经历如下的**五种状态**：

1. 新建：当一个Thread类或其子类的对象被声明并创建时，新的线程对象处于新建状态。
2. 就绪：处于新建状态的线程被start()后，将进入线程队列等待CPU时间片，此时它已具备了运行的条件，只是没分配到CPU资源。
3. 运行：当就绪的线程被调度并获得CPU资源时，便进入运行状态，run()方法定义了线程的操作和功能。
4. 阻塞：在某种特殊情况下，被认为挂起或执行输入输出操作时，让出CPU并临时中止自己的执行，进入阻塞状态。
5. 死亡：线程完成了它的全部工作或线程被提前强制性的中止或出现异常导致结束。
<div align="center">
    <img src='https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/qiV0by.png'>
</div>
## 线程的调度

### 调度种类

- **抢占式**调度模型：
  哪个线程的优先级比较高，抢到的CPU时间片的概率就高一些/多一些。
  **java采用的就是抢占式调度模型**。
- **均分式**调度模型：
  平均分配CPU时间片。每个线程占有的CPU时间片时间长度一样。
  平均分配，一切平等。
  有一些编程语言，线程调度模型采用的是这种方式。

### CPU的调度策略

- **时间片：**cpu正常情况下的调度策略。即CPU分配给各个程序的时间，每个线程被分配一个时间段，称作它的时间片，即该进程允许运行的时间，使各个程序从表面上看是同时进行的。如果在时间片结束时进程还在运行，则CPU将被剥夺并分配给另一个进程。如果进程在时间片结束前阻塞或结束，则CPU当即进行切换。而不会造成CPU资源浪费。在宏观上：我们可以同时打开多个应用程序，每个程序并行不悖，同时运行。但在微观上：由于只有一个CPU，一次只能处理程序要求的一部分，如何处理公平，一种方法就是引入时间片，每个程序轮流执行。
- **抢占式：**高优先级的线程抢占cpu。

### Java的调度算法：

- 同优先级线程组成先进先出队列（先到先服务），使用时间片策略。
- 堆高优先级，使用优先调度的抢占式策略。

**线程的优先级等级**（一共有10挡）

- MAX_PRIORITY：10
- MIN_PRIORITY：1
- NORM_PRIORITY：5 (默认优先级)

**获取和设置当前线程的优先级**

- `getPriority();` 获取
- `setPriority(int p);` 设置

> **说明：高优先级的线程要抢占低优先级线程cpu的执行权。但是只是从概率上讲，高优先级的线程高概率的情况下被执行。并不意味着只有高优先级的线程执行完成以后，低优先级的线程才执行。**

```java
package net.coding.demo;

public class Threadtest11 {
    public static void main(String[] args) {
        System.out.println("最高优先级：" + Thread.MAX_PRIORITY);//最高优先级：10
        System.out.println("最低优先级:" + Thread.MIN_PRIORITY);//最低优先级:1
        System.out.println("默认优先级:" + Thread.NORM_PRIORITY);//默认优先级:5
        
        // main线程的默认优先级是：5
        System.out.println(Thread.currentThread().getName() + "线程的默认优先级是：" + Thread.currentThread().getPriority());

        Thread t = new Thread(new MyRunnable5());
        t.setPriority(10);
        t.setName("t");
        t.start();

        // 优先级较高的，只是抢到的CPU时间片相对多一些。
        // 大概率方向更偏向于优先级比较高的。
        for(int i = 0; i < 10000; i++){
            System.out.println(Thread.currentThread().getName() + "-->" + i);
        }
    }
}

class MyRunnable5 implements Runnable {
    @Override
    public void run() {
        for(int i = 0; i < 10000; i++){
            System.out.println(Thread.currentThread().getName() + "-->" + i);
        }
    }
}
```

## 线程安全

### 安全问题出现的条件

**满足三个条件：**

1. 条件1：**多线程并发**。
2. 条件2：**有共享数据**。
3. 条件3：**共享数据有修改的行为**。

> 满足以上3个条件之后，就会存在线程安全问题。

### 两个专业术语

**异步编程模型：**
线程t1和线程t2，各自执行各自的，t1不管t2，t2不管t1，谁也不需要等谁，这种编程模型叫做异步编程模型。

> 实质：多线程并发（效率较高）,**异步就是并发。**

**同步编程模型：**
线程t1和线程t2，在线程t1执行的时候，必须等待t2线程执行结束，或者说在t2线程执行的时候，必须等待t1线程执行结束，两个线程之间发生了等待关系，这就是同步编程模型。

> 实质：线程排队执行，效率较低,**同步就是排队。**

### 线程安全和非线程安全的类的选择

- StringBuffer是线程安全的类，但效率低。
- StringBuilder是非线程安全的类，用于代替StringBuffer。

- ArrayList是非线程安全的，用于代替Vector。
- Vector是线程安全的。
- HashMap HashSet是非线程安全的，用于代替Hashtable。
- Hashtable是线程安全的。

> 线程安全的类的方法都是**同步方法**，效率低，因此这些类是安全的，线程非安全的类效率高但是不安全，可以用作**局部变量**以避免线程安全问题。

### 解决方法

> 是一上来就选择线程同步吗？synchronized
>
> 不是，synchronized会让程序的执行效率降低，用户体验不好。
> 系统的用户吞吐量降低。用户体验差。在不得已的情况下再选择线程同步机制。

- 第一种方案：尽量使用**局部变量** *代替* “**实例变量**和**静态变量**”。
- 第二种方案：**如果必须是实例变量**，那么可以考虑**创建多个对象**，这样实例变量的内存就不共享了。（一个线程对应1个对象，100个线程对应100个对象，对象不共享，就没有数据安全问题了。）
- 第三种方案：如果不能使用局部变量，对象也不能创建多个，这个时候就只能选择**synchronized**了。**线程同步机制**。

## synchronized-线程同步

线程同步机制的**语法**是：

```java
synchronized(){
	// 线程同步代码块。
}
```

**重点：**
synchronized后面**小括号()** 中传的这个“数据”是相当关键的。这个数据必须是 **`多线程共享`** 的数据。才能达到多线程排队。

**注意：**

> 在java语言中，任何一个对象都有“一把锁”，其实这把锁就是标记。（只是把它叫做锁）
> **100个对象，100把锁。1个对象1把锁。**

### 同步的执行原理

1、假设t1和t2线程并发，开始执行以下代码的时候，肯定有一个先一个后。

2、假设t1先执行了，遇到了**synchronized**，这个时候自动找“后面**共享对象**”的**对象锁**，找到之后，并**占有这把锁**，然后**执行同步代码块**中的程序，在程序执行过程中一直都是**占有这把锁**的。**直到同步代码块代码结束，这把锁才会释放。**

3、假设t1已经占有这把锁，此时t2也遇到synchronized关键字，也会去占有后面共享对象的这把锁，结果这把锁被t1占有，t2只能在同步代码块外面**等待t1的结束**(阻塞态)，直到t1把同步代码块执行结束了，t1会归还这把锁，此时t2终于等到这把锁，然后t2占有这把锁之后，进入同步代码块执行程序。

4、这样就达到了**线程排队**执行。

**重中之重：**

> `“锁”`即该对象的**控制权**，有锁才能修改该对象；这个共享对象一定要选好了。这个共享对象一定是你需要排队执行的这些线程对象所共享的。

```java
class Account {
    private String actno;
    private double balance; //实例变量。

    //对象
    Object o= new Object(); // 实例变量。（Account对象是多线程共享的，Account对象中的实例变量obj也是共享的。）

    public Account() {
    }

    public Account(String actno, double balance) {
        this.actno = actno;
        this.balance = balance;
    }

    public String getActno() {
        return actno;
    }

    public void setActno(String actno) {
        this.actno = actno;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    //取款的方法
    public void withdraw(double money){
        /**
         * 以下可以共享,金额不会出错
         * 以下这几行代码必须是线程排队的，不能并发。
         * 一个线程把这里的代码全部执行结束之后，另一个线程才能进来。
         */
        synchronized(this) {
        //synchronized(actno) {
        //synchronized(o) {
        //必须同步实例对象，不能同步变量
        /**
         * 以下不共享，金额会出错
         */
		  /*Object obj = new Object();
	        synchronized(obj) { // 这样编写就不安全了。因为obj2不是共享对象。
	        synchronized(null) {//编译不通过
	        String s = null;
	        synchronized(s) {//java.lang.NullPointerException*/
            double before = this.getBalance();
            double after = before - money;
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            this.setBalance(after);
        //}
    }
}

class AccountThread extends Thread {
    // 两个线程必须共享同一个账户对象。
    private Account act;

    // 通过构造方法传递过来账户对象
    public AccountThread(Account act) {
        this.act = act;
    }

    public void run(){
        double money = 5000;
        act.withdraw(money);
        System.out.println(Thread.currentThread().getName() + "对"+act.getActno()+"取款"+money+"成功，余额" + act.getBalance());
    }
}

public class Test {
    public static void main(String[] args) {
        // 创建账户对象（只创建1个）
        Account act = new Account("act-001", 10000);
        // 创建两个线程，共享同一个对象
        Thread t1 = new AccountThread(act);
        Thread t2 = new AccountThread(act);

        t1.setName("t1");
        t2.setName("t2");
        t1.start();
        t2.start();
    	}
	}
}
```

> 以上代码锁**this、实例变量actno、实例变量o**都可以！因为这三个是线程共享且都是对象！

### 同步方法-synchronized

**同步方法**:就是把synchronized关键字加到方法上

格式:

`修饰符 synchronized 返回值类型 方法名(方法参数){ }`

> **同步方法**的锁对象是什么呢?  :arrow_forward: `this`

**同步静态方法**:就是把synchronized关键字加到静态方法上

格式:

`修饰符 static synchronized 返回值类型 方法名(方法参数){ }`

> **同步静态方法**的锁对象是什么呢? :arrow_forward: `类名.class`

注意：

> synchronized出现在实例方法上，一定锁的是**`this`**; 没得挑。只能是this。不能是其他的对象了。所以这种方式**不灵活**。

1. 缺点

synchronized出现在实例方法上，表示**整个方法体都需要同步**，可能会无故**扩大同步的范围**，导致程序的**执行效率降低**。所以这种方式**不常用**。

2. 优点

代码写的少了，节俭了。

3.  总结

如果共享的对象就是**this**，并且需要**同步的代码块是整个方法体**，建议使用这种方式。

```java
    public synchronized void withdraw(double money){
        double before = this.getBalance();
        double after = before - money;
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        this.setBalance(after);
    }
```

### 在方法调用处synchronized

```java
    public void run(){
        double money = 5000;
        // 取款
        // 多线程并发执行这个方法。
        //synchronized (this) { //这里的this是AccountThread对象，这个对象不共享！
        synchronized (act) { // 这种方式也可以，只不过扩大了同步的范围，效率更低了。
            act.withdraw(money);
        }

        System.out.println(Thread.currentThread().getName() + "对"+act.getActno()+"取款"+money+"成功，余额" + act.getBalance());
    }
```

这种方式也可以，只不过**扩大了同步的范围**，效率更低了。

### 总结

**synchronized有三种写法：**

1. `同步代码块`

特点：**灵活**

```java
synchronized(线程共享对象){
	同步代码块;
}
```

2. `在实例方法上使用synchronized`

表示**共享对象(临界资源)**一定是 **`this`** 并且同步代码块是**整个方法体**。

3. `在静态方法上使用synchronized`

表示找 **`类锁`**。**类锁永远只有1把**。

**就算创建了100个对象，那类锁也只有1把。**

**注意区分：**

>- 对象锁：1个对象1把锁，100个对象100把锁，不唯一。
>- 类锁：100个对象，也可能只是1把类锁，唯一。

## LOCK锁

> Lock实现提供比使用synchronized方法和语句可以获得更广泛的锁定操作

Lock中提供了**获得锁和释放锁**的方法

- `void lock()`:获得锁

- `void unlock()`:释放锁

Lock是接口不能直接实例化，这里采用它的实现类**ReentrantLock**来实例化

- `Reentrantlock`的构造方法

- `ReentrantLock()`: 创建一个ReentrantLock的实例

```java
package ch6;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Locktest {
    public static void main(String[] args) {
        sellticket t = new sellticket(100);
        Thread t1 = new Thread(t, "t1");
        Thread t2 = new Thread(t, "t2");
        Thread t3 = new Thread(t, "t3");
        t1.start();
        t2.start();
        t3.start();
//        System.out.println(Thread.currentThread().getName());
    }
}




class selltickets implements Runnable {
    private int tickets;
    private final Lock lock = new ReentrantLock();
    private final Object obj = new Object();

    selltickets(int tickets) {
        this.tickets = tickets;
    }
    @Override
    public void run() {

        while (true) {
                sell();
            }
    }

    private void sell() {
        lock.lock();
        try {
            if (tickets > 0) {
                try {
                    Thread.sleep(100);
//                            Thread.yield();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName() + "正在出售第" + this.tickets + "张票");
                tickets--;
            }
        }
        finally{
            lock.unlock();
        }
    }
}
```

## 案例

### 生产者与消费者

|      方法名      | 说明                                                         |
| :--------------: | :----------------------------------------------------------- |
|   void wait()    | 导致当前线程等待，直到另一个线程调用该对象的notify()方法或notifyAll()方法 |
|  void notify()   | 唤醒正在等待对象监视器的单个线程                             |
| void notifyAll() | 唤醒正在等待对象监视器的所有线程                             |

```java
package ch7;
/*
* 生产者消费者案例
* */
public class T6_ProCus {
    public static void main(String[] args) {
            Food food=new Food();
            Producter p=new Producter(food);
            Customers s=new Customers(food);
            Thread t1=new Thread(p);
            Thread t2=new Thread(s);
            t1.start();
            t2.start();

    }
}
/*生产者*/
class Producter implements Runnable{
    private Food food;
    public Producter(Food food){
        this.food=food;
    }

    @Override
    public void run() {
        for (int i = 0; i < 20; i++) {
            if(i%2==0) {
                food.pro("番茄炒蛋", "酸甜");
            }
                else
                food.pro("辣子鸡丁","麻辣口味");
            }

        }
    }
/*消费者*/
class Customers implements Runnable{
    private Food food;
    public Customers(Food food){
        this.food=food;
    }
    @Override
    public void run() {
        for (int i = 0; i < 20; i++) {
            food.get();
        }

    }
}
/*食物*/
class Food{
    private String name;
    private String desc;
    private boolean flag=true;  //true表示生产，false表示消费

    /*生产产品*/
    public synchronized void pro(String name,String desc){
       //不能生产
        if (!flag){
            try {
                this.wait();    //线程进入等待状态，释放监视器的所有权（对象锁）
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        this.setName(name);
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        this.setDesc(desc);
        flag=false;    //利用Flag标签来交替执行
        this.notify();
    }

    /*消费产品*/
    public synchronized void get(){
//        不能消费
        if (flag){
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(this.getName()+"->"+this.getDesc());
        flag=true;
        this.notify();
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    @Override
    public String toString() {
        return "Food{" +
                "name='" + name + '\'' +
                ", desc='" + desc + '\'' +
                '}';
    }

    public Food() {
    }

    public Food(String name, String desc) {
        this.name = name;
        this.desc = desc;
    }
}
```

## 死锁（DeadLock）和饥饿

> **死锁**: <u>一组线程因争夺资源陷入永远等待状态</u>
>
> **饥饿**: <u>一个可运行线程由于其他线程总是优先于它而被调度程序无限期地拖延而不能被执行</u>

![](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221107233342841.png)

<img src="https://img-blog.csdnimg.cn/20210512224504688.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0NzE1OTQz,size_16,color_FFFFFF,t_70,t_70, #pic_center">

<u>代码示例</u>：

```java
/**
 * 比如：t1想先穿衣服在穿裤子
 *       t2想先穿裤子在传衣服
 * 此时：t1拿到衣服，t2拿到裤子；
 * 由于t1拿了衣服，t2找不到衣服；t2拿了裤子，t1找不到裤子
 * 就会导致死锁的发生！
 */
public class Thread_DeadLock {
    public static void main(String[] args) {
        Dress dress = new Dress();
        Trousers trousers = new Trousers();
        //t1、t2共享dress和trousers。
        Thread t1 = new Thread(new MyRunnable1(dress, trousers), "t1");
        Thread t2 = new Thread(new MyRunnable2(dress, trousers), "t2");
        t1.start();
        t2.start();
    }
}

class MyRunnable1 implements Runnable{
    Dress dress;
    Trousers trousers;

    public MyRunnable1() {
    }

    public MyRunnable1(Dress dress, Trousers trousers) {
        this.dress = dress;
        this.trousers = trousers;
    }

    @Override
    public void run() {
        synchronized(dress){
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (trousers){
                System.out.println("--------------");
            }
        }
    }
}

class MyRunnable2 implements Runnable{
    Dress dress;
    Trousers trousers;

    public MyRunnable2() {
    }

    public MyRunnable2(Dress dress, Trousers trousers) {
        this.dress = dress;
        this.trousers = trousers;
    }

    @Override
    public void run() {
        synchronized(trousers){
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (dress){
                System.out.println("。。。。。。。。。。。。。。");
            }
        }
    }
}

class Dress{

}

class Trousers{

}
```

## 交互线程的协作与同步

### 交互线程的协作与同步

<u>生产者-消费者问题</u> 

> 有n个生产者进程和m个消费者进程并发执行，生产者进程要将所生产的产品提供给消费者进程。设置具有k个存储单元的缓冲区

![image-20221107233616159](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221107233616159.png)

![image-20221107233647995](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221107233647995.png)

- > 问题：线程通信，发送线程与接收线程，存在可导致错误的缺陷

- > 错误原因：发送线程与接收线程，没有约定在传送 数据时协同工作的步调

### 协作关系

### 线程同步

> 完成共同任务的并发线程，协调一致地运行，约定执行次序，协作制约关系。

### 线程阻塞和唤醒

**实现方法：**

```java
//java.lang.Object类声明以下线程阻塞和唤醒方法，用于管程。
public final void wait() throws InterruptedException //等待
public final native void notify()
//唤醒一个等待当前临界资源的线程
public final native void notifyAll()
//唤醒所有等待当前临界资源的线程
```



##  管程(集中控制)

1. **管程（monitor）**是指代表**共享资源的数据结构**及并发线程在其上执行的**一组操作**。
2. 管程被**请求和释放资源**的线程所调用。 
3. 管程机制包含三部分：

- `条件变量`，分配临界资源的条件； 

- `wait原语`，请求临界资源而不满足时，阻塞线程；

- `signal原语`，唤醒等待该临界资源的一个阻塞线程

**生产者和消费者线程同步案例：**

```java
package ch7;
/*
* 生产者消费者案例
* */
public class T6_ProCus {
    public static void main(String[] args) {
            Food food=new Food();
            Producter p=new Producter(food);
            Customers s=new Customers(food);
            Thread t1=new Thread(p);
            Thread t2=new Thread(s);
            t1.start();
            t2.start();

    }
}
/*生产者*/
class Producter implements Runnable{
    private Food food;
    public Producter(Food food){
        this.food=food;
    }

    @Override
    public void run() {
        for (int i = 0; i < 20; i++) {
            if(i%2==0) {
                food.pro("番茄炒蛋", "酸甜");
            }
                else
                food.pro("辣子鸡丁","麻辣口味");
            }

        }
    }
/*消费者*/
class Customers implements Runnable{
    private Food food;
    public Customers(Food food){
        this.food=food;
    }
    @Override
    public void run() {
        for (int i = 0; i < 20; i++) {
            food.get();
        }

    }
}
/*食物*/
class Food{
    private String name;
    private String desc;
    private boolean flag=true;  //true表示生产，false表示消费

    /*生产产品*/
    public synchronized void pro(String name,String desc){
       //不能生产
        if (!flag){
            try {
                this.wait();    //线程进入等待状态，释放监视器的所有权（对象锁）
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        this.setName(name);
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        this.setDesc(desc);
        flag=false;    //利用Flag标签来交替执行
        this.notify();
    }

    /*消费产品*/
    public synchronized void get(){
//        不能消费
        if (flag){
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(this.getName()+"->"+this.getDesc());
        flag=true;
        this.notify();
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    @Override
    public String toString() {
        return "Food{" +
                "name='" + name + '\'' +
                ", desc='" + desc + '\'' +
                '}';
    }

    public Food() {
    }

    public Food(String name, String desc) {
        this.name = name;
        this.desc = desc;
    }
}
```



## 守护线程

### 线程的分类

- 一类是：**用户线程**
- 一类是：**守护线程**（**后台线程**）

其中具有代表性的就是：**垃圾回收线程（守护线程）**。

#### 守护线程的特点

一般守护线程是一个**死循环**，**所有的用户线程只要结束，守护线程自动结束**。

注意：**主线程main**方法是一个**用户线程**。

#### 守护线程用法

每天00:00的时候系统数据自动备份。
这个需要使用到定时器，并且我们可以将定时器设置为守护线程。
一直在那里看着，没到00:00的时候就备份一次。所有的用户线程如果结束了，守护线程自动退出，没有必要进行数据备份了。

| void setDaemon(boolean on) | on为true表示把线程设置为守护线程 |
| -------------------------- | -------------------------------- |

```java
public class ThreadTest14 {
    public static void main(String[] args) {
        Thread t = new BakDataThread();
        t.setName("备份数据的线程");

        // 启动线程之前，将线程设置为守护线程
        t.setDaemon(true);

        t.start();

        // 主线程：主线程是用户线程
        for(int i = 0; i < 10; i++){
            System.out.println(Thread.currentThread().getName() + "--->" + i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

class BakDataThread extends Thread {
    public void run(){
        int i = 0;
        // 即使是死循环，但由于该线程是守护者，当用户线程结束，守护线程自动终止。
        while(true){
            System.out.println(Thread.currentThread().getName() + "--->" + (++i));
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

---

# 第七章、数据IO流操作

![image-20221111142439616](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221111142439616.png)

![image-20221111144227047](C:\Users\alleyf\AppData\Roaming\Typora\typora-user-images\image-20221111144227047.png)

![image-20221111144202203](C:\Users\alleyf\AppData\Roaming\Typora\typora-user-images\image-20221111144202203.png)

## 输入输出流

### 基本概念

数据流是 Java 进行 I/O 操作的对象，它按照不同的标准可以分为不同的类别。

- 按照流的方向主要分为**输入流和输出流**两大类。
- 数据流按照数据单位的不同分为**字节流和字符流**。
- 按照功能可以划分为**节点流和处理流**。

数据流的处理只能按照数据序列的顺序来进行，即前一个数据处理完之后才能处理后一个数据。数据流以输入流的形式被程序获取，再以输出流的形式将数据输出到其它设备。图 1 为输入流模式，图 2 为输出流模式。

> 输入输出是针对程序而言的，输入即从外部源读取数据到程序，输出即将程序中的信息写入到目的地（包括显示器）。

![](http://c.biancheng.net/uploads/allimg/200115/5-200115142HWK.png)

![输入流模式](http://c.biancheng.net/uploads/allimg/200115/5-200115142K1644.png)

#### 输入流

Java 流相关的类都封装在 java.io 包中，而且每个数据流都是一个对象。所有输入流类都是 InputStream 抽象类（字节输入流）和 Reader 抽象类（字符输入流）的子类。其中 InputStream 类是字节输入流的抽象类，是所有字节输入流的父类，其层次结构如图 3 所示。

<div align="center">
    <img src="http://c.biancheng.net/uploads/allimg/200115/5-200115145253550.png">
</div>


InputStream 类中所有方法遇到错误时都会引发 **IOException 异常**。如下是该类中包含的常用方法。

| 名称                                 | 作用                                                         |
| :----------------------------------- | ------------------------------------------------------------ |
| `int read()`                         | 从输入流读入一个字节的数据，将它转换成一个 0~ 255 的整数，返回一个整数，如果遇到输入流的结尾返回 -1 |
| `int read(byte[] b)`                 | 从输入流读取若干字节的数据保存到参数 b 指定的字节数组中，返回的字节数表示读取的字节数，如果遇到输入流的结尾返回 -1 |
| `int read(byte[] b,int off,int len)` | 从输入流读取若干字节的数据保存到参数 b 指定的字节数组中，其中 off 是指在数组中开始保存数据位置的起始下标，len 是指读取字节的位数。返回的是实际读取的字节数，如果遇到输入流的结尾则返回 -1 |
| `void close()`                       | 关闭数据流，当完成对数据流的操作之后需要关闭数据流           |
| `int available()`                    | 返回可以从数据源读取的数据流的字节数。                       |
| skip(long n)                         | 从输入流跳过参数 n 指定的字节数目                            |
| boolean markSupported()              | 判断输入流是否可以重复读取，如果可以就返回 true              |
| void mark(int readLimit)             | 如果输入流可以被重复读取，从流的当前位置开始设置标记，readLimit 指定可以设置标记的字节数 |
| void reset()                         | 使输入流重新定位到刚才被标记的位置，这样可以重新读取标记过的数据 |

上述最后 3 个方法一般会结合在一起使用，首先使用 markSupported() 判断，如果可以重复读取，则使用 mark(int readLimit) 方法进行标记，标记完成之后可以使用 read() 方法读取标记范围内的字节数，最后使用 reset() 方法使输入流重新定位到标记的位置，继而完成重复读取操作。

Java 中的字符是 Unicode 编码，即双字节的，而 InputerStream 是用来处理单字节的，在处理字符文本时不是很方便。这时可以使用 Java 的文本输入流 Reader 类，该类是字符输入流的抽象类，即所有字符输入流的实现都是它的子类，该类的方法与 InputerSteam 类的方法类似，这里不再介绍。

#### 输出流

在 Java 中所有输出流类都是 OutputStream 抽象类（字节输出流）和 Writer 抽象类（字符输出流）的子类。其中 OutputStream 类是字节输出流的抽象类，是所有字节输出流的父类，其层次结构如图 4 所示。

<div align="center">
    <img src="http://c.biancheng.net/uploads/allimg/200115/5-200115151G3J0.png">
</div>


OutputStream 类是所有字节输出流的超类，用于以二进制的形式将数据写入目标设备，该类是抽象类，不能被实例化。OutputStream 类提供了一系列跟数据输出有关的方法，如下所示。

| 名称                                   | 作用                                                     |
| -------------------------------------- | -------------------------------------------------------- |
| `int write(b)`                         | 将指定字节的数据写入到输出流                             |
| `int write (byte[] b)`                 | 将指定字节数组的内容写入输出流                           |
| `int write (byte[] b,int off,int len)` | 将指定字节数组从 off 位置开始的 len 字节的内容写入输出流 |
| close()                                | 关闭数据流，当完成对数据流的操作之后需要关闭数据流       |
| `flush()`                              | 刷新输出流，强行将缓冲区的内容写入输出流                 |

每个Java程序运行时都带有一个系统流，系统流对应的类为 java.lang.System。Sytem 类封装了 Java 程序运行时的 3 个系统流，分别通过 in、out 和 err 变量来引用。这 3 个系统流如下所示：

- System.in：标准输入流，默认设备是键盘。
- System.out：标准输出流，默认设备是控制台。
- System.err：标准错误流，默认设备是控制台。

Java 中常见编码说明如下：

- ISO8859-1：属于单字节编码，最多只能表示 0~255 的字符范围。
- GBK/GB2312：中文的国标编码，用来表示汉字，属于双字节编码。GBK 可以表示简体中文和繁体中文，而 GB2312 只能表示简体中文。GBK 兼容 GB2312。
- Unicode：是一种编码规范，是为解决全球字符通用编码而设计的。UTF-8 和 UTF-16 是这种规范的一种实现，此编码不兼容 ISO8859-1 编码。Java 内部采用此编码。
- UTF：UTF 编码兼容了 ISO8859-1 编码，同时也可以用来表示所有的语言字符，不过 UTF 编码是不定长编码，每一个字符的长度为 1~6 个字节不等。一般在中文网页中使用此编码，可以节省空间。


在程序中如果处理不好字符编码，就有可能出现乱码问题。例如现在本机的默认编码是 GBK，但在程序中使用了 ISO8859-1 编码，则就会出现字符的乱码问题。就像两个人交谈，一个人说中文，另外一个人说英语，语言不同就无法沟通。为了避免产生乱码，程序编码应与本地的默认编码保持一致。

本地的默认编码可以使用 System 类查看。Java 中 System 类可以取得与系统有关的信息，所以直接使用此类可以找到系统的默认编码。方法如下所示：

`public static Properties getProperty()`

使用上述方法可以查看 JVM 的默认编码，代码如下：

```java
public static void main(String[] args) {    // 获取当前系统编码    
    System.out.println("系统默认编码：" + System.getProperty("file.encoding"));
}
```

### 字节输入流

InputStream 类及其子类的对象表示字节输入流，InputStream 类的常用子类如下。

- ByteArrayInputStream 类：将字节数组转换为字节输入流，从中读取字节。
- FileInputStream 类：从文件中读取数据。
- PipedInputStream 类：连接到一个 PipedOutputStream（管道输出流）。
- SequenceInputStream 类：将多个字节输入流串联成一个字节输入流。
- ObjectInputStream 类：将对象反序列化。


使用 InputStream 类的方法可以从流中读取一个或一批字节。表 1 列出了 InputStream 类的常用方法。

| 方法名及返回值类型                   | 说明                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| int read()                           | 从输入流中读取一个 8 位的字节，并把它转换为 0~255 的整数，最后返回整数。 如果返回 -1，则表示已经到了输入流的末尾。为了提高 I/O 操作的效率，建议尽量 使用 read() 方法的另外两种形式 |
| int read(byte[] b)                   | 从输入流中读取若干字节，并把它们保存到参数 b 指定的字节数组中。 该方法返回 读取的字节数。如果返回 -1，则表示已经到了输入流的末尾 |
| int read(byte[] b, int off, int len) | 从输入流中读取若干字节，并把它们保存到参数 b 指定的字节数组中。其中，off 指 定在字节数组中开始保存数据的起始下标；len 指定读取的字节数。该方法返回实际 读取的字节数。如果返回 -1，则表示已经到了输入流的末尾 |
| void close()                         | 关闭输入流。在读操作完成后，应该关闭输入流，系统将会释放与这个输入流相关 的资源。注意，InputStream 类本身的 close() 方法不执行任何操作，但是它的许多 子类重写了 close() 方法 |
| int available()                      | 返回可以从输入流中读取的字节数                               |
| long skip(long n)                    | 从输入流中跳过参数 n 指定数目的字节。该方法返回跳过的字节数  |
| void mark(int readLimit)             | 在输入流的当前位置开始设置标记，参数 readLimit 则指定了最多被设置标记的字 节数 |
| boolean markSupported()              | 判断当前输入流是否允许设置标记，是则返回 true，否则返回 false |
| void reset()                         | 将输入流的指针返回到设置标记的起始处                         |

> 注意：在使用 **mark() 方法和 reset() 方法**之前，需要判断该文件系统是否支持这两个方法，以避免对程序造成影响。

#### DataInputStream和DataOutputStream

> 如果要进行基于Java基本数据类型(如整数或浮点数等)的输入/输出，则要用到过滤流FilterInputStream类和FilterOutputStream类的各种子类。

常用类方法

![image-20221108115307889](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221108115307889.png)

例题：**求100以内的所有素数，并把结果写入D盘的data.dat文件中，最后再以每行10个数的方式显示出data.dat文件内容**。

```java
package ch8;
import java.io.*;
public class PrimeList {
    public static void main(String[] args) {
        int count = 0; //用于统计素数数目
        try {
            OutputStream fos = new FileOutputStream("d:/data.dat");
            DataOutputStream dos = new DataOutputStream(fos);
            for (int i = 2; i <= 100; i++) {
                if (isPrime(i)) {
                    dos.writeInt(i);
                    count++;
                }
            }
            fos.close();
        } catch (IOException e) {
            System.out.println(e.toString());
        }
        try {
            InputStream fis = new FileInputStream("d:/data.dat");
            DataInputStream dis = new DataInputStream(fis);
            for (int i = 0; i < count; i++) {
                if (i % 10 == 0) System.out.println();//每行只显示10个数
                System.out.printf("%5d", dis.readInt());
            }
            fis.close();
        } catch (IOException e) {
            System.out.println(e.toString());
        }
    }

    private static boolean isPrime(int i) {
        for (int j = 2; j < i; j++) {
            if(i%j==0)
            {
                return false;
            }
        }
        return true;
    }
    }
```

#### BufferedInputStream和BufferedOutputStream

>这两个类称之为字节缓冲流。如果文件的读写数据量较多时，使用**字节缓冲流类对象**可以提高文件读写操作的效率。字节缓冲流对象会建立一个**内部缓冲区**，输入/输出数据首先会读写到缓冲区进行操作，当缓冲区满或关闭字节缓冲流时一次性输出到对应流，也可使用**flush()**方法主动将缓冲区数据输出到对应流，这样可以极大地减少磁盘读写次数，提高了文件**操作效率**。

**BufferedInputStream类的构造方法:**

- BufferedInputStream(InputStream in):创建缓冲输入流对象，保存in流对象，并创建一个内部缓冲区来保存输入数据。
- BufferedInputStream(InputStream in, int size):创建缓冲输入流对象，保存in流对象，并创建一个指定大小为size个字节的内部缓冲区来保存输入数据。

**BufferedOutputStream类的构造方法:**

- BufferedOutputStream(OutputStream out):创建输出缓冲流对象，并创建一个默认大小为512个字节的内部缓冲区，写数据到参数所指定的输出流out对象。

- BufferedOutputStream(OutputStream out, int size):创建输出缓冲流对象，并创建一个指定大小为size个字节的内部缓冲区，写数据到参数所指定的输出流out对象。

> flush()方法用于在程序结束之前**主动将缓冲区**里的数据**输出到对应的输入/输出流**。可以通过输入/输出缓冲流对象进行显示调用。
> BufferedInputStream类提供了与FileInputStream类同样的读文件操作方法，BufferedOutputStream类提供了与FileOutputStream类同样的写文件操作方法，唯一的区别是所有读写操作的数据首先进入到缓冲区，在必要时(**缓冲区满、关闭流或调用flush()方法**)才输出到对应的流中。

#### PrintStream

> PrintStream类提供了把Java的**任何类型数据转换为字符串类型数据输出**的功能。输出时，经常使用的方法有`print()、println()和printf()`。创建PrintStream类的对象时，需要在OutputStream类对象的基础上进行。
>
> PrintStream类的构造方法有:`PrintStream(OutputStream out)`:创建一个打印流对象。

示例1：

```java
package ch8;

import java.io.FileOutputStream;
import java.io.PrintStream;
public class PrintStreamTest1 {
    public static void main(String[] args) throws Exception{
    PrintStream ps = new PrintStream(new FileOutputStream("D:/info.dat"));
    String msg ="hello java 123";
    ps.printf("%s",msg);
    ps.close();
}}
```

示例2：写入九九乘法表

```java
package ch8;
import java.io.*;
public class NineNineMul {
    public static void main(String[] args) throws FileNotFoundException {
        try {
            OutputStream os = new FileOutputStream("d:/data.dat");
            PrintStream ps = new PrintStream(os);
            for (int i = 1; i <= 9; i++) {
                for (int j = 1; j <= i; j++) {
                    ps.printf(" %8s", i + "*" + j + "=" + (i * j));
                }
                ps.println();
            }
            ps.close();
            os.close();
        }
            catch(IOException e){
                System.out.println(e.toString());
            }
    }
}
```



### 字节输出流

OutputStream 类及其子类的对象表示一个字节输出流。OutputStream 类的常用子类如下。

- ByteArrayOutputStream 类：向内存缓冲区的字节数组中写数据。
- FileOutputStream 类：向文件中写数据。
- PipedOutputStream 类：连接到一个 PipedlntputStream（管道输入流）。
- ObjectOutputStream 类：将对象序列化。


利用 OutputStream 类的方法可以从流中写入一个或一批字节。表 2 列出了 OutputStream 类的常用方法。

| 方法名及返回值类型                   | 说明                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| void write(int b)                    | 向输出流写入一个字节。这里的参数是 int 类型，但是它允许使用表达式，而不用强制转换成 byte 类型。为了提高 I/O 操作的效率，建议尽量使用 write() 方法的另外两种形式 |
| void write(byte[] b)                 | 把参数 b 指定的字节数组中的所有字节写到输出流中              |
| void write(byte[] b,int off,int len) | 把参数 b 指定的字节数组中的若干字节写到输出流中。其中，off 指定字节数组中的起始下标，len表示元素个数 |
| void close()                         | 关闭输出流。写操作完成后，应该关闭输出流。系统将会释放与这个输出流相关的资源。注意，OutputStream 类本身的 close() 方法不执行任何操作，但是它的许多子类重写了close() 方法 |
| void flush()                         | 为了提高效率，在向输出流中写入数据时，数据一般会先保存到内存缓冲区中，只有当缓冲区中的数据达到一定程度时，缓冲区中的数据才会被写入输出流中。使用 flush() 方法则可以强制将缓冲区中的数据写入输出流， 并清空缓冲区 |

### 字符输入流

> Reader 类是所有字符流输入类的父类，该类定义了许多方法，这些方法对所有子类都是有效的。

Reader类的常用子类如下。

- CharArrayReader 类：将字符数组转换为字符输入流，从中读取字符。
- StringReader 类：将字符串转换为字符输入流，从中读取字符。
- **BufferedReader** 类：为其他字符输入流提供读缓冲区。
- PipedReader 类：连接到一个 PipedWriter。
- **InputStreamReader** 类：将字节输入流转换为字符输入流，可以指定字符编码。

> 与 InputStream 类相同，在 Reader 类中也包含 close()、mark()、skip() 和 reset() 等方法，这些方法可以参考 InputStream 类的方法。下面主要介绍 Reader 类中的 read() 方法，如表 1 所示。

| 方法名及返回值类型                      | 说明                                                         |
| --------------------------------------- | ------------------------------------------------------------ |
| `int read()`                            | 从输入流中读取一个字符，并把它转换为 0~65535 的整数。如果返回 -1， 则表示已经到了输入流的末尾。为了提高 I/O 操作的效率，建议尽量使用下面两种 read() 方法 |
| `int read(char[] cbuf)`                 | 从输入流中读取若干个字符，并把它们保存到参数 cbuf 指定的字符数组中。 该方法返回读取的字符数，如果返回 -1，则表示已经到了输入流的末尾 |
| `int read(char[] cbuf,int off,int len)` | 从输入流中读取若干个字符，并把它们保存到参数 cbuf 指定的字符数组中。其中， off 指定在字符数组中开始保存数据的起始下标，len 指定读取的字符数。该方法返 回实际读取的字符数，如果返回 -1，则表示已经到了输入流的末尾 |

#### 字符文件输入流

为了读取方便，Java 提供了用来读取字符文件的便捷类——FileReader。该类的构造方法有如下两种重载形式。

1. FileReader(File file)：在给定要读取数据的文件的情况下创建一个新的 FileReader 对象。其中，file 表示要从中读取数据的文件。
2. FileReader(String fileName)：在给定从中读取数据的文件名的情况下创建一个新 FileReader 对象。其中，fileName 表示要从中读取数据的文件的名称，表示的是一个文件的完整路径。

> 在用该类的构造方法创建 FileReader 读取对象时，默认的字符编码及字节缓冲区大小都是由系统设定的。要自己指定这些值，可以在 FilelnputStream 上构造一个 InputStreamReader。

> 注意：在创建 FileReader 对象时可能会引发一个 FileNotFoundException 异常，因此需要使用 try catch 语句捕获该异常。
>
> 字符流和字节流的操作步骤相同，都是首先创建输入流或输出流对象，即建立连接管道，建立完成后进行读或写操作，最后关闭输入/输出流通道。

实例1：

```java
public class Test12 {
    public static void main(String[] args) {
        FileReader fr = null;
        try {
            fr = new FileReader("D:/myJava/HelloJava.java"); // 创建FileReader对象
            int i = 0;
            System.out.println("D:\\myJava\\HelloJava.java文件内容如下：");
            while ((i = fr.read()) != -1) { // 循环读取
                System.out.print((char) i); // 将读取的内容强制转换为char类型
            }
        } catch (Exception e) {
            System.out.print(e);
        } finally {
            try {
                fr.close(); // 关闭对象
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

实例2：

```java
package ch8;
import java.io.*;

public class FileWriterTest {
    public static void main(String[] args) throws IOException {
        FileWriter fw = new FileWriter("D:/data.dat");
        String s = "hello java 521";
        fw.write(s);
        fw.close();
        System.out.println("写入成功");
    }
}
```



> 如上述代码，首先创建了 FileReader 字符输入流对象 fr，该对象指向 D:\myJava\HelloJava.java 文件，然后定义变量 i 来接收调用 read() 方法的返回值，即读取的字符。在 while 循环中，每次读取一个字符赋给整型变量 i，直到读取到文件末尾时退出循环（当输入流读取到文件末尾时，会返回值 -1）.

#### 字符缓冲区输入流

> BufferedReader 类主要用于辅助其他字符输入流，它带有缓冲区，可以先将一批数据读到内存缓冲区。接下来的读操作就可以直接从缓冲区中获取数据，而不需要每次都从数据源读取数据并进行字符编码转换，这样就可以提高数据的读取效率。

> BufferedReader 类的构造方法有如下两种重载形式。

1. BufferedReader(Reader in)：创建一个 BufferedReader 来修饰参数 in 指定的字符输入流。
2. BufferedReader(Reader in,int size)：创建一个 BufferedReader 来修饰参数 in 指定的字符输入流，参数 size 则用于指定缓冲区的大小，单位为字符。

> 除了可以为字符输入流提供缓冲区以外，BufferedReader 还提供了 `readLine()` 方法，该方法**返回包含该行内容的字符串**，但该字符串中不包含任何终止符，如果已到达流末尾，则返回 null。readLine() 方法表示**每次读取一行文本内容**，当遇到换行（\n）、回车（\r）或回车后直接跟着换行标记符即可认为某行已终止。

```java
public class Test13 {
    public static void main(String[] args) {
        FileReader fr = null;
        BufferedReader br = null;
        try {
            fr = new FileReader("D:\\myJava\\book.txt"); // 创建 FileReader 对象
            br = new BufferedReader(fr); // 创建 BufferedReader 对象
            System.out.println("D:\\myJava\\book.txt 文件中的内容如下：");
            String strLine = "";
            while ((strLine = br.readLine()) != null) { // 循环读取每行数据
                System.out.println(strLine);
            }
        } catch (FileNotFoundException e1) {
            e1.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                fr.close(); // 关闭 FileReader 对象
                br.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

> 如上述代码，首先分别创建了名称为 fr 的 FileReader 对象和名称为 br 的 BufferedReader 对象，然后调用 BufferedReader 对象的 readLine() 方法逐行读取文件中的内容。如果读取的文件内容为 Null，即表明已经读取到文件尾部，此时退出循环不再进行读取操作。最后将字符文件输入流和带缓冲的字符输入流关闭.

### 字符输出流

> 与 Reader 类相反，Writer 类是所有字符输出流的父类，该类中有许多方法，这些方法对继承该类的所有子类都是有效的。

Writer 类的常用子类如下。

- CharArrayWriter 类：向内存缓冲区的字符数组写数据。
- StringWriter 类：向内存缓冲区的字符串（StringBuffer）写数据。
- BufferedWriter 类：为其他字符输出流提供写缓冲区。
- PipedWriter 类：连接到一个 PipedReader。
- OutputStreamReader 类：将字节输出流转换为字符输出流，可以指定字符编码。

> 与 OutputStream 类相同，Writer 类也包含 close()、flush() 等方法，这些方法可以参考 OutputStream 类的方法。下面主要介绍 Writer 类中的 write() 方法和 append() 方法，如表 2 所示。



| 方法名及返回值类型                         | 说明                                                         |
| ------------------------------------------ | ------------------------------------------------------------ |
| void write(int c)                          | 向输出流中写入一个字符                                       |
| `void write(char[] cbuf)`                  | 把参数 cbuf 指定的字符数组中的所有字符写到输出流中           |
| `void write(char[] cbuf,int off,int len)`  | 把参数 cbuf 指定的字符数组中的若干字符写到输出流中。其中，off 指定 字符数组中的起始下标，len 表示元素个数 |
| `void write(String str)`                   | 向输出流中写入一个字符串                                     |
| `void write(String str, int off,int len)`  | 向输出流中写入一个字符串中的部分字符。其中，off 指定字符串中的起始偏移量，len 表示字符个数 |
| `append(char c)`                           | 将参数 c 指定的字符添加到输出流中                            |
| append(charSequence esq)                   | 将参数 esq 指定的字符序列添加到输出流中                      |
| append(charSequence esq,int start,int end) | 将参数 esq 指定的字符序列的子序列添加到输出流中。其中，start 指定 子序列的第一个字符的索引，end 指定子序列中最后一个字符后面的字符 的索引，也就是说子序列的内容包含 start 索引处的字符，但不包括 end 索引处的字符 |

> 注意：Writer 类所有的方法在出错的情况下都会引发 **IOException** 异常。关闭一个流后，再对其进行任何操作都会产生错误。

#### 字符文件输出流

> Java 提供了写入字符文件的便捷类——FileWriter，该类的构造方法有如下 4 种重载形式。

1. FileWriter(File file)：在指定 File 对象的情况下构造一个 FileWriter 对象。其中，file 表示要写入数据的 File 对象。
2. FileWriter(File file,boolean append)：在指定 File 对象的情况下构造一个 FileWriter 对象，如果 append 的值为 true，则将字节写入文件末尾，而不是写入文件开始处。
3. FileWriter(String fileName)：在指定文件名的情况下构造一个 FileWriter 对象。其中，fileName 表示要写入字符的文件名，表示的是完整路径。
4. FileWriter(String fileName,boolean append)：在指定文件名以及要写入文件的位置的情况下构造 FileWriter 对象。其中，append 是一个 boolean 值，如果为 true，则将数据写入文件末尾，而不是文件开始处。

> 在创建 FileWriter 对象时，默认字符编码和默认字节缓冲区大小都是由系统设定的。要自己指定这些值，可以在 FileOutputStream 上构造一个 OutputStreamWriter 对象。FileWriter 类的创建不依赖于文件存在与否，如果关联文件不存在，则会自动生成一个新的文件。在创建文件之前，FileWriter 将在创建对象时打开它作为输出。如果试图打开一个只读文件，将引发一个 IOException 异常。

> 注意：在创建 FileWriter 对象时可能会引发 IOException 或 SecurityException 异常，因此需要使用 try catch 语句捕获该异常。编写一个程序，将用户输入的 4 个字符串保存到 D:\myJava\book.txt 文件中。在这里使用 FileWriter 类中的 write() 方法循环向指定文件中写入数据，实现代码如下：

```java
public class Test13 {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        FileWriter fw = null;
        try {
            fw = new FileWriter("D:\\myJava\\book.txt"); // 创建FileWriter对象
            for (int i = 0; i < 4; i++) {
                System.out.println("请输入第" + (i + 1) + "个字符串：");
                String name = input.next(); // 读取输入的名称
                fw.write(name + "\r\n"); // 循环写入文件
            }
            System.out.println("录入完成！");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        } finally {
            try {
                fw.close(); // 关闭对象
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

> 如上述代码，首先创建了一个指向 D:\myJava\book.txt 文件的字符文件输出流对象 fw，然后使用 for 循环录入 4 个字符串，并调用 write() 方法将字符串写入到指定的文件中。最后在 finally 语句中关闭字符文件输出流。



#### 字符缓冲区输出流

> BufferedWriter 类主要用于辅助其他字符输出流，它同样带有缓冲区，可以先将一批数据写入缓冲区，当缓冲区满了以后，再将缓冲区的数据一次性写到字符输出流，其目的是为了提高数据的写效率。

BufferedWriter 类的构造方法有如下两种重载形式。

1. BufferedWriter(Writer out)：创建一个 BufferedWriter 来修饰参数 out 指定的字符输出流。
2. BufferedWriter(Writer out,int size)：创建一个 BufferedWriter 来修饰参数 out 指定的字符输出流，参数 size 则用于指定缓冲区的大小，单位为字符。

> 该类除了可以给字符输出流提供缓冲区之外，还提供了一个新的方法 `newLine()`，该方法用于写入一个行分隔符。行分隔符字符串由系统属性 line.separator 定义，并且不一定是单个新行（\n）符。
>
> 提示：BufferedWriter 类的使用与 FileWriter 类相同，这里不再重述。

### 文件随机读写

建立随机访问文件流对象RandomAccessFile类的构造方法有:

- `RandomAccess File(File file, String mode)`:

  使用文件对象file和访问方式mode创建随机访问文件对象。

- `RandomAccessFile(String filename, String mode)`:

  使用文件绝对名称filename和访问方式mode创建随机访问文件对象。

  >其中，mode为文件访问的方式，主要有**“r”和“rw”**两种形式。如果mode值为**“r”**，则文件**只能读**，对此文件的任何写操作都会引发**IOException**异常;如果mode值为“**rw**”，且文件已存在，则可以对该文件进行**读/写操作**，如果文件不存在，则会新建一个文件。

#### 读写操作

在**RandomAccessFile**类中同时提供了文件的读和写操作方法，主要包括**读/写基本数据类型的数据**、**读取一行文本或读取指定长度的字节数**等。

#### 文件指针操作

文件指针决定了对文件进行读/写操作的位置，文件指针位置的改变通常有两种方式:**隐式移动**和**显示移动**。通常的读/写操作会隐式移动文件指针，显示移动可通过以下一些方法实现:

1. public long `getFilePointer()` throws IOException:**返回**文件指针的**当前字节位置**。
2. public void `seek(long pos)` throws I0Exception:将文件指针**定位到一个绝对位置pos字节处**。
3. public long `length()` throws IOException:**返回**文件的**长度**，单位**字节**。
4. public int `skipBytes(int n)` throws IOException:将文件指针相对于当前位置**向文件尾方向移动n个字节**，若**n为负值**，则**不移动**。

示例：

```java
import java.io.*;
public class RandFile {
    public static void main(String[] args) {
        String sFile = "d:/info.dat";
        try {
            RandomAccessFile rf = new RandomAccessFile(sFile, "rw");
            for (int i = 0; i < 10; i++)
                rf.writeDouble(i * 1.414);
            rf.close();
            rf = new RandomAccessFile(sFile, "rw");
//移动文件指针到写入的第6个数据位置，重新写入数据47.0001
            rf.seek(5 * 8);
            rf.writeDouble(47.0001);
            rf.close();
            rf = new RandomAccessFile(sFile, "r");
            for (int i = 0; i < 10; i++)
                System.out.println("Value " + i + ": " + rf.readDouble());
            rf.close();
        } catch (IOException e) {
            System.out.println(e.toString());
        }
    }
}
```

## 目录和文件管理

> 在 [Java](http://alleyf.github.io/) 中，File 类是 java.io 包中唯一代表磁盘文件本身的对象，也就是说，如果希望在程序中操作文件和目录，则都可以通过 File 类来完成。File 类定义了一些方法来操作文件，如新建、删除、重命名文件和目录等。

> File 类不能访问文件内容本身，如果需要访问文件内容本身，则需要使用输入/输出流。File 类提供了如下三种形式构造方法。

1. File(String path)：如果 path 是实际存在的路径，则该 File 对象表示的是目录；如果 path 是文件名，则该 File 对象表示的是文件。
2. File(String path, String name)：path 是路径名，name 是文件名。
3. File(File dir, String name)：dir 是路径对象，name 是文件名。


使用任意一个构造方法都可以创建一个 File 对象，然后调用其提供的方法对文件进行操作。在表 1 中列出了 File 类的常用方法及说明。

| 方法名称                      | 说明                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| boolean canRead()             | 测试应用程序是否能从指定的文件中进行读取                     |
| boolean canWrite()            | 测试应用程序是否能写当前文件                                 |
| boolean delete()              | 删除当前对象指定的文件                                       |
| boolean exists()              | 测试当前 File 是否存在                                       |
| String getAbsolutePath()      | 返回由该对象表示的文件的绝对路径名                           |
| String getName()              | 返回表示当前对象的文件名或路径名（如果是路径，则返回最后一级子路径名） |
| String getParent()            | 返回当前 File 对象所对应目录（最后一级子目录）的父目录名     |
| boolean isAbsolute()          | 测试当前 File 对象表示的文件是否为一个绝对路径名。该方法消除了不同平台的差异，可以直接判断 file 对象是否为绝对路径。在 UNIX/Linux/BSD 等系统上，如果路径名开头是一条斜线`/`，则表明该 File 对象对应一个绝对路径；在 Windows 等系统上，如果路径开头是盘符，则说明它是一个绝对路径。 |
| boolean isDirectory()         | 测试当前 File 对象表示的文件是否为一个路径                   |
| boolean isFile()              | 测试当前 File 对象表示的文件是否为一个“普通”文件             |
| long lastModified()           | 返回当前 File 对象表示的文件最后修改的时间                   |
| long length()                 | 返回当前 File 对象表示的文件长度                             |
| String[] list()               | 返回当前 File 对象指定的路径文件列表                         |
| String[] list(FilenameFilter) | 返回当前 File 对象指定的目录中满足指定过滤器的文件列表       |
| boolean mkdir()               | 创建一个目录，它的路径名由当前 File 对象指定                 |
| boolean mkdirs()              | 创建一个目录，它的路径名由当前 File 对象指定                 |
| boolean renameTo(File)        | 将当前 File 对象指定的文件更名为给定参数 File 指定的路径名   |


File 类中有以下两个常用常量：

- public static final String pathSeparator：指的是分隔连续多个路径字符串的分隔符，Windows 下指`;`。例如 `java -cp test.jar;abc.jar HelloWorld`。
- public static final String separator：用来分隔同一个路径字符串中的目录的，Windows 下指`/`。例如 `C:/Program Files/Common Files`。

> 注意：可以看到 File 类的常量定义的命名规则不符合标准命名规则，常量名没有全部大写，这是因为 Java 的发展经过了一段相当长的时间，而命名规范也是逐步形成的，File 类出现较早，所以当时并没有对命名规范有严格的要求，这些都属于 Java 的历史遗留问题。

> Windows 的路径分隔符使用反斜线“\”，而 Java 程序中的反斜线表示转义字符，所以如果需要在 Windows 的路径下包括反斜线，则应该使用两条反斜线或直接使用斜线“/”也可以。Java 程序支持将斜线当成平台无关的路径分隔符。

假设在 Windows 操作系统中有一文件 `D:\javaspace\hello.java`，在 Java 中使用的时候，其路径的写法应该为 `D:/javaspace/hello.java` 或者 `D:\\javaspace\\hello.java`。

> java.io包中的File类提供了与具体平台无关的用于管理文件和目录(文件夹)的操作方法，通过调用这些方法可以用来**获取路径、目录及文件的相关信息**，并对它们进行**创建、删除、重命名**等管理工作。

1. 目录管理

- `public boolean mkdir()`:根据抽象路径名**创建目录**。
- `public String [] list()`:**返回**当前抽象路径下的**文件名和目录名**。

2. 文件管理

（1）**创建**一个**新的文件对象**

> File类提供了用来创建文件或目录对象的构造方法:

​	`public File(String path)`:通过给定的路径名来创建文件对象。

​	public File(String path, String name):使用父路径(目录)字符串和子抽象路径(子目录)字符串创建文件对象。

（2）有关**文件名和目录名**的操作
	public String `getName()`:返回文件的名称。
	public String `getPath()`:返回文件的路径名。
	public String `getAbsolutePath()`:返回文件绝对路径名。
	public String `getParent()`:返回当前文件的上一级目录名。
	public boolean `renameTo(File dest)`:将抽象路径文件名重命名为给定的新文件名。

（3）**获取文件属性**信息
	public boolean `exists()`:测试抽象路径表示的文件是否存在。
	public boolean `canRead()`:测试抽象路径表示的文件是否可读。
	public boolean `canWrite()`:测试抽象路径表示的文件是否可写。

​	public boolean `isFile()`:测试抽象路径表示的文件是否为正常文件(非目录).
​	public boolean `isDirectory()`:测试抽象路径表示的是否为目录。
​	public long `lastModified()`:返回抽象路径表示的文件最近一次被修改的时间。

（4）**删除**文件
	public boolean `delete()`:删除抽象路径表示的文件或目录。如果**删除的是目录，则要求目录为空，否则无法删除**。

示例：重命名目录下的所有文件

```java
public class Rename {
    public static void main(String[] args) {
        File dir = new File("d:/mydir");
        File cur, dest;
        String temp;
        if (dir.isDirectory()) {
            String[] list = dir.list();
            for (int i = 0; i < list.length; i++) {
                cur = new File(dir, list[i]);
                if (cur.isFile()) {
                    temp = cur.getName();
                    dest = new File(dir, temp + ".bak");
                    if(cur.renameTo(dest))
                        System.out.println("Finished!");
                }
            }
        }
    }
}
```

---

# 第八章、网络编程

## 基础知识

> Java语言是运用于网络环境的一种编程语言，Java的程序要能在网络上的不同地方运行，这样就要求Java程序执行时，必须有能力取得网络上的各种资源和数据，和服务器建立各种传输通道，把自己的数据传输到网络各处。Java为我们提供了强有力的网络功能。Java所提供的网络功能可以分为三类:用**URL访问网络资源、Socket方式、数据报方式**。

### URL

**网络资源定位器**(URL, Uniform ResourceLocator)可以指向网络上的各种资源。通过网络资源定位器可以获取网络上的资源。

网络资源不仅可以包括网络上各种简单对象:例如网络上的路径和文件(Web页、文本文件、图形(像)文件、声音片断)等;还可以是一些复杂的对象:如**数据库或搜索引擎**。
URL:是WWW资源统一资源定位器的缩写。他规范了WWW资源网络定位地址的表示方法。

网络资源定位器通常有5个部分组成:`协议、主机名、端口号、文件和引用`。
URL的基本表示格式是:
`Protocol://hos tname:/resourcename#anchor`
Protocol：使用的协议，它可以是**http、ftp、news、telnet**等。
Hostname:主机名，指定域名服务器(DNS)能访问到的WWW服务的计算机，例www.sun.com 

Port:是可选的，表示所连接的端口号，如缺省，将连接到协议缺省的端口（80）。
Resourcename:资源名，是主机上能访问到的目录或文件。
Anchor:标记，是可选的。他指定文件中有特定标记的位置。

### TCP和UDP

TCP，**传输控制协议**(Transmission ControlProtocol)，是**面向连接**的通信协议。使用TCP协议进行数据传输时，两个进程之间会建立一个连接，数据以流的形式顺序传输。
UDP，**用户数据协议**(User Datagram Protocol) ，是**无连接**通信协议。使用UDP协议进行数据传输时，两个进程之间不建立特定的连接，不对数据到达的顺序进行检查。

> 在互联网上进行数据传输，多用TCP和UDP协议，它们传输的都是一个**byte stream/ 字节型**的数据流。

### Socket

- Socket是网络驱动层提供给应用程序编程的**接口和一种机制**;

- Socket在应用程序中创建，通过一种绑定机制与驱动程序建立关系，告诉自己所对应的**IP和Port**。

  > 可以把Socket比喻成一个港口码头，应用程序只要把货物放到港口码头上，就算完成了货物的运送。应用程序只需等待货物到达码头后，将货物取走;

`Socket数据发送过程`

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221108164721552.png" alt="image-20221108164721552" style="zoom:50%;" />

`Socket数据接收过程`

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221108164806405.png" alt="image-20221108164806405" style="zoom:50%;" />

> Java中网络编程类位于java. net包中。很多应用程序需要可靠的、按顺序的数据传输，也有的应用程序不需要，因此在设计网络程序时应正确选择网络类。

`URL、URLConnection、 Socket和ServerSocket`类是基于TCP协议的;
**Socket**类用于TCP通信的**服务器和和客户端**。
**ServerSocket**类用于TCP通信的**服务器端**。
`DatagramPacket、DatagramSocket`和`MulticastSocket` 类是基于UDP协议的。
**DatagramSocket**类用于**UDP通信**。

## TCP网络程序的工作原理

<img src="C:\Users\alleyf\AppData\Roaming\Typora\typora-user-images\image-20221108165622839.png" alt="image-20221108165622839" style="zoom:50%;" />

### 服务端和客户端交互过程

1. **服务器端**创建一个**ServerSocket**,然后调用**accept方法**等待客户来连接;
2. **客户端**程序创建一个**Socket**并请求与服务器建立连接;
3. **服务器端**接收客户的连接请求，并**创建**一个新的**Socket**与该客户建立专线连接;
4. 建立了连接的两个Socket在一个**单独的线程**(**由服务器程序创建**)上对话;
5. **服务器**开始等待新的连接请求，当新的连接请求到达时，重复步骤2-5的过程。

#### InetAddress类

InetAddress是用于表示计算机IP地址的一个类，而在日常应用中的计算机地址是用“192.168. 0.1”、www. sina. com. cn等字符串格式来表示的。
`getByName (String host)` 方法:

通过**域名**来构造类InetAddress的实例对象
`getByAddress (byte[] addr)` 方法：

通过**4个字节的网络地址**构造类InetAddress的实例对象

示例：

```java
package ch9;
import java.net.*;

public class InetAddressTest {
    public static void main(String[] args) {
        String dname = "fcsy.fit";
        InetAddress ts = null;
        try {
            ts = InetAddress.getByName(dname);
        }
        catch (UnknownHostException e) {
            System.err.println(e);
        }
        if (ts != null)
        {
            System.out.println("The IP address is :" + ts.getHostAddress());
            System.out.println("The host address is :"+ts.getHostName());
        }
        else
            System.out.println("can not access "+ dname);
    }
}
```

### ServerSocket

#### 构造函数

public `ServerSocket()` ;
public `ServerSocket(int port)` ;绑定到指定端口，连接队列默认为50
public `ServerSocket (int port, int backlog)` ;指定最大连接队列
public ServerSocket(int port, int backlog, inetAddress bindAddr) ;
`close()`方法;
`accept ()`方法;

<img src="C:\Users\alleyf\AppData\Roaming\Typora\typora-user-images\image-20221108171917963.png" alt="image-20221108171917963" style="zoom:50%;" />

#### ServerSocket常用方法

<img src="C:\Users\alleyf\AppData\Roaming\Typora\typora-user-images\image-20221108172034904.png" alt="image-20221108172034904" style="zoom:50%;" />



### Socket

#### 构造方法

`Socket()` ;
`Socket (String host, int port)` ;
`Socket (InetAddress addr, int port)` ; .
`Socket (String host, int port, InetAddress localaddr, int localPort)` ;
Socket (InetAddress addr, int port, InetAddress localaddr, int localPort) ;
`getInputStream`和`getOutputStream`方法

<img src="C:\Users\alleyf\AppData\Roaming\Typora\typora-user-images\image-20221108172711073.png" alt="image-20221108172711073" style="zoom:50%;" />

#### 常用方法

<img src="C:\Users\alleyf\AppData\Roaming\Typora\typora-user-images\image-20221108172233442.png" alt="image-20221108172233442" style="zoom:50%;" />

示例：

**服务端**

```java
package ch9;
import java.io.*;
import java.net.*;
public class Server{
    public static void main(String[] args) {
        try {
            ServerSocket s = new ServerSocket(5250);
            while(true)
            {
                Socket socket = s.accept();
                OutputStream os = socket.getOutputStream();
                DataOutputStream dos = new DataOutputStream(os);
                dos.writeUTF("你好，客户端地址信息："+socket.getInetAddress()+
                        "\t客户端通信端口号："+socket.getPort());
                dos.writeUTF("再见!");
                dos.close();
                socket.close();
            }
        }catch (IOException e)
        {
            System.err.println(e);
        }
    }
}
```

**客户端**

```java
package ch9;

import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.Socket;

public class Client{
    public static void main(String[] args) {
        try{
            Socket c = new Socket("127.0.0.1",5250);
            InputStream is = c.getInputStream();
            DataInputStream dis = new DataInputStream(is);
            System.out.println(dis.readUTF());
            System.out.println(dis.readUTF());
            dis.close();
            c.close();
        } catch (IOException e)
        {
            System.err.println(e);
        }

    }
}
```

## TCP实战演练

1. **简单一对一聊天室（单线程）**

```java
//服务端
package ch9;
import java.net.*;
import java.io.*;
public class ChatServer {
    public static void main(String[] args) {
        try {
            ServerSocket serverSocket = new ServerSocket(8888);
            Socket s = serverSocket.accept();
            InputStream is = s.getInputStream();
            OutputStream os = s.getOutputStream();
            InputStreamReader isr = new InputStreamReader(System.in);
            DataInputStream dis =new DataInputStream(is);
            DataOutputStream dos = new DataOutputStream(os);
            BufferedReader br = new BufferedReader(isr);
            String info;

            while(true) {
                info = dis.readUTF();
                System.out.println("对方说：" + info);
                if (info.equals("bye"))
                    break;
                info = br.readLine();
                dos.writeUTF(info);
                if (info.equals("bye"))
                    break;}
            dis.close();
            dos.close();
            s.close();
            serverSocket.close();
        }catch(SocketException e) {
            System.out.println("网络连接异常，程序退出");
        }
        catch (IOException e)
        {
            System.err.println(e);
        }

    }
}
//客户端
package ch9;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;

public class ChatClient {
    public static void main(String[] args) {
        try {
            Socket c = new Socket("localhost", 8888);
            InputStream ic = c.getInputStream();
            OutputStream oc = c.getOutputStream();
            InputStreamReader icr = new InputStreamReader(System.in);
            DataInputStream dic = new DataInputStream(ic);
            DataOutputStream doc = new DataOutputStream(oc);
            BufferedReader br = new BufferedReader(icr);
            String info;
            while (true) {
                info = br.readLine();
                doc.writeUTF(info);
                if (info.equals("bye"))
                    break;
                info = dic.readUTF();
                System.out.println("对方说：" + info);
                if (info.equals("bye"))
                    break;
            }
            dic.close();
            doc.close();
            c.close();
        }catch(SocketException e) {
            System.out.println("网络连接异常，程序退出");
        }
        catch (IOException e) {
            System.err.println(e);
        }
    }
}
```

2. **自由聊天室（多线程）**

```java
//服务端
package ch10;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;

public class ChatRoomServer {
    public static void main(String[] args) {
        try {
            ServerSocket s = new ServerSocket(8888);
            Socket s1 = s.accept();
            DataOutputStream dos = new DataOutputStream(s1.getOutputStream());
            DataInputStream dis = new DataInputStream(s1.getInputStream());

            Thread reader = new Thread(new ServerReader(dis), "reader");
            Thread writer = new Thread(new SeverWriter(dos),"writer");
            reader.start();
            writer.start();


        }catch (SocketException e) {
            System.out.println("网络连接失败");
        }catch (IOException e)
        {
            System.out.println(e.toString());
        }
    }
}



class ServerReader implements Runnable{
    private DataInputStream dis;

    public ServerReader(DataInputStream dis) {
        this.dis = dis;
    }

    @Override
    public void run() {
        String info;
        try {
            while(true)
            {
                info = dis.readUTF();
                System.out.println("女朋友说："+info);
                if(info.equals("bye"))
                {
                    System.out.println("你的臭宝已下线，拜拜了您");
                    System.exit(0);
                }
            }
        }catch (IOException e){
            System.out.println(e.toString());
        }
    }
}

class SeverWriter implements Runnable{
    private DataOutputStream dos;
    public SeverWriter(DataOutputStream dos) {
        this.dos = dos;
    }

    @Override
    public void run() {
        InputStreamReader isr = new InputStreamReader(System.in);
        BufferedReader br = new BufferedReader(isr);
        String info;
        try {
            while(true)
            {
                info = br.readLine();
                dos.writeUTF(info);
                if(info.equals("bye"))
                {
                    System.out.println("自己下线，拜拜了您");
                    System.exit(0);
                }
            }
        }catch (IOException e) {e.printStackTrace();}

    }
}
//客户端
package ch10;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;

public class ChatRoomClient {
    public static void main(String[] args) {
        try {
            Socket c = new Socket("127.0.0.1",8888);
            DataOutputStream dos = new DataOutputStream(c.getOutputStream());
            DataInputStream dis = new DataInputStream(c.getInputStream());

            Thread reader = new Thread(new ClientReader(dis),"reader");
            Thread writer = new Thread(new ClientWriter(dos),"writer");
            reader.start();
            writer.start();

        }catch (SocketException e) {
            System.out.println("网络连接失败");
        }catch (IOException e)
        {
            System.out.println(e.toString());
        }
    }
}

class ClientReader implements Runnable{
    DataInputStream dis;
    public ClientReader(DataInputStream dis) {
        this.dis = dis;
    }

    @Override
    public void run() {
        String info;
        try{
            while(true)
            {
                info = dis.readUTF();
                System.out.println("男朋友说："+info);
                if(info.equals("bye"))
                {
                    System.out.println("您的臭宝已下线，拜拜了您");
                    System.exit(0);
                }
            }
        }catch (IOException e){
            e.printStackTrace();
        }

    }
}

class ClientWriter implements Runnable{
    DataOutputStream dos;
    public ClientWriter(DataOutputStream dos) {
        this.dos = dos;
    }

    @Override
    public void run() {
        InputStreamReader icr = new InputStreamReader(System.in);
        BufferedReader br = new BufferedReader(icr);
        String info;
        try {
            while(true)
            {
                info = br.readLine();
                dos.writeUTF(info);
                if(info.equals("bye"))
                {
                    System.out.println("自己下线，拜拜了您");
                    System.exit(0);
                }
            }
        }catch (IOException e) {e.printStackTrace();}
    }
}
```

## 在TCP网络上传递对象

`Object InputStream`和`0bject OutputStream`可以使用`0bject InputStream`和`Object OutputStream`来包装底层网络字节流，TCP服务器和TCP客户端之间就可以**传递对象类型的数据**，实现从**底层输入流**中**读取对象类型的数据**和将对象类型的数据**写入到底层输出流**。`RMI (remote method invocation)` 编程:是java进行分布式编程的基础。

<img src="C:\Users\alleyf\AppData\Roaming\Typora\typora-user-images\image-20221108214605083.png" alt="image-20221108214605083" style="zoom:50%;" />

## UDP网络程序的工作原理

> **用户数据报协议UDP (user datagram protocol)**是一个**无连接的、发送独立数据包**的协议，它不保证数据按顺序传送和正确到达。**数据报Socket**又称为**UDP套接字**，它无需建立、拆除连接，而是直接将信息打包传向指定的目的地，使用简单，占用资源少，适合于断续、非实时通信。利用UDP通信的`两个程序是平等的`，`没有主次之分`，两个程序的代码可以完全一样。

### DatagramSocket类

构造函数:
Public `DatagramSocket ()`；
Public `DatagramSocket(int port)` ;
Public `DatagramSocket(int port, InetAddress laddr)` ;
`Close()`方法;
`Send (DatagramPacket p)`方法；
`Receive (DatagramPacket p)` 方法；

### DatagramPacket类

> 如果把`DatagramSocket`比作创建的**港口码头**，那么`DatagramPacket`就是发送和接收数据的**集装箱**。

构造函数

Public `DatagramPacket (byte[] buf, int length)` ;
Public `DatagramPacket (byte[] buf, int length, InetAddress address, int port)` ;
`getInetAddress ()`和`getPort()`方法;
`Byte[] getData ()`和`getLength()`方法;

### UDP网络程序的编写步骤

第一步：服务端和客户端创建**DatagramSocket实例对象**，服务端（接受方）需要指定**监听端口号**，并且**创建字节接收缓存数组**；定义服务端的**发送内容**；

第二步：服务端和客户端创建**DatagramPacket实例对象**，构造函数指定各自参数（包括**发送/接收字节缓存数组、字节长度**），客户端还要传入发送目标的**主机号/域名（实例化为InetAddress对象）和端口号**；

第三步：调用客户端的**send()**和服务端的**receive()**方法：
`DatagramSocket.send (DatagramPacket p)`;
`DatagramSocket.receive (DatagramPacket p)`;
第四步：`DatagramSocket.close()`;

## UDP实战演练

```java
//服务端（接收方）
package ch10;
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

 public class UdpRecv{
    public static void main(String[] args) {
        try {
            DatagramSocket ds = new DatagramSocket(8888);
            byte[] buf = new byte[1024];
            DatagramPacket dp = new DatagramPacket(buf,buf.length);
            ds.receive(dp);
            String strrecv = new String(dp.getData(),0,dp.getLength()) + " from " + dp.getAddress().getHostAddress()
                    + ":" + dp.getPort();
            System.out.println(strrecv);
            ds.close();
        }catch (IOException e){
            e.printStackTrace();
        }

    }
}
//客户端（发送方）
package ch10;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UdpSend{
    public static void main(String[] args) {
        try {
            DatagramSocket ds = new DatagramSocket();
            String msg = "Java is so interesting ";
            DatagramPacket dp = new DatagramPacket(msg.getBytes(),msg.length(), InetAddress.getByName("127.0.0.1"),8888);
            ds.send(dp);
            ds.close();
        }catch(IOException e){
            System.err.println(e);
        }
    }
}
```

---

# 基础算法

## 冒泡排序

> 冒泡排序分为**升序和降序**两种方式，核心思想是**两层for循环比较相邻**前后的两个**元素并交换次序**，**升序**则将**大**的放在**后面**，**降序**则将**小的**放**后面**，**内层循环上界**随着**外层循环变量**的**增大而减小**。

`核心代码`：

```java
//升序
for(int i = 0 ;i< arr.length -1; i++){
			for(int j = 0; j<arr.length-1-i; j++){
				if(arr[j]>arr[j+1]){
					temp = arr[j];
					arr[j] = arr[j+1];
					arr[j+1] = temp;
				}
			}
			
		}
//降序
for(int i = 0 ;i< arr.length -1; i++){
			for(int j = 0; j<arr.length-1-i; j++){
				if(arr[j]<arr[j+1]){
					temp = arr[j];
					arr[j] = arr[j+1];
					arr[j+1] = temp;
				}
			}
			
		}
```

**示例：**

```java
package ch11;
import java.util.ArrayList;
import java.util.Random;

public class BubleSortTest {
    public static void main(String[] args) {
        ArrayList<Integer> n = BubleSort();
        for(int i : n){
            System.out.println(i);
        }
    }
    public static ArrayList<Integer> BubleSort(){
        ArrayList<Integer> n = new ArrayList<Integer>(10);
        for (int i = 0; i < 5; i++) {
            n.add(i);
            n.add(new Random().nextInt()%10);
        }
        for (int i = 0; i < n.size()-1; i++) {
            for (int j = 0; j < n.size()-i-1; j++) {
                if(n.get(j)>n.get(j+1))//升序
              //if(n.get(j)>n.get(j+1))降序
                {
                    int temp = n.get(j);
                    n.set(j,n.get(j+1));
                    n.set(j+1,temp);
                }
            }

        }
        return n;
    }
}
```

 
