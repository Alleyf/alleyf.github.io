---
title: Java_Notes
tags: [Java]
categories: Java
date: 2022-9-10 10:00:00
sticky: 50
excerpt: some notation about java。
---

# 第一章、计算机语言及系统概述

## 知识点

1. <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907091018.png" style="zoom: 33%;" />
1. 特点：**Write once，run anywhere！**
- **java：java program->执行编译后的程序**
-  **javac：java program.java->编译该程序生成.class文件**
-  **javadoc：javadoc program->生成该程序的html文档**
3. <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135804.png" style="zoom:33%;" />
3. <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135836.png" style="zoom:33%;" />
## 代码示例
```java
public class HelloWorld{
    public static void main(String[] args) 
    {
        System.out.println("Hello world!");
    }
}
```
# 第二章、数据类型及变量

## 标识符

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135908.png" style="zoom:33%;" />

## 关键字

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135913.png" style="zoom:33%;" />

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

## 数据类型

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135920.png" style="zoom:33%;" />
<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135925.png" style="zoom:33%;" />
<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135953.png" style="zoom:33%;" />

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

## 进制转换

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907135958.png" style="zoom:33%;" />
<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907140005.png" style="zoom:33%;" />
<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907140009.png" style="zoom:33%;" />
<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907140012.png" style="zoom:33%;" />

## 类型转换：

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907140707.png" style="zoom: 33%;" />

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907140020.png" style="zoom: 50%;" />
**提升转换不丢失精度;(type)var强制类型转换**

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

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907143232.png" style="zoom:33%;" />

最终变量（必须初始化）：**final** type variable；variable=value；

**定义时初始化或构造函数初始化**

## 常量

- **只能被初始化一次**
- **常量名全部大写，单词过多使用下划线**

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907142721.png" style="zoom:33%;" />

## 运算符与表达式

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220907150838.png" style="zoom:33%;" />

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

- 定义：**type[][] arrayname = new type[m][n]**
- 可以不规则，给不同行分配不同大小的列
<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220909084420.png" style="zoom:25%;" />


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

2. String是字符串类

3. `s.charAt(index)//索引下标的值`

4. 字符串变量及运算

   - 赋值运算

     ​	String str = "abc";

     ​	String str2 = str;

   - 连接运算+ +=

     ​    str = "abc" + "xyz"; //str的值为"abcxyz"

5. **字符串不是字符数组**

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220909093029.png" style="zoom:25%;" />

## API文档

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220909092844.png" style="zoom:25%;" />

# 第三章、类的封装、继承和多态

## 类和对象

类的特点：`具有封装性，继承性，多态性和抽象性。`

对象：`对象的实例。`

注：

- Java中进行方法调用中传递参数时，**遵循值传递的原则**：基本类型传递的是该 数据值本身。引用类型传递的是对对象的引用，而不是对象本身。
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

**方法和运算符重载：**

`通过参数列表中参数的类型、个数和顺序的不同进行区别`

### 2对象的引用和运算

- instanceof对象运算符       eg：`d instanceof MyDate`
- super为隐式参数，为对父类的引用
- this为隐式参数，为对对象本身的引用
- 普通方法中，this总是指向调用该方法的对象; 构造方法中，this总是指向正要初始化的对象；this不能用于static方法；可以在一个构造方法中通过this调用其它构造方法，且必须是构造方法中 的第一条语句

### 3访问控制-隐藏/封装

- 隐藏对象内部的复杂性，只对外公开简单的接口。便于外界调用， 从而提高系统的可扩展性、可维护性。
- boolean变量的get方法是is开头；常量或 static 变量公开
- default：默认访问控制属性，什么都没加就是该控制符。有的书上说 friendly、package，这都是一个意思，都不能真的写出来，如果什么访 问修饰符都不加，就是default/friendly/package
- Java的访问控制是停留在编译层，也就是它不会在.class文件中留下任何 痕迹，只在编译的时候进行访问控制的检查。其实，通过反射的手段，可 以访问任何包下任何类中的成员，例如，访问类中的私有成员也是可以的。说明访问控制是`伪封装（类似于python）`。

#### 类的访问权限：

  **只有public和缺省两种**

  eg：public class MyDate 或class MyDate_ex
#### 类成员和函数的访问权限：

  <img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220914154845348.png" alt="image-20220914154845348" style="zoom:67%;" />

#### 声明set()和get()方法存取对象的属性

### 4静态成员

- 静态成员是属于类本身的公共属性或方法。

- 静态成员变量也叫类属性或类变量，静态成员变量调用时可以对象.类属性或类名.类属性来访问。

- 静态方法调用时只能通过类名.类方法调用，在调用该方法时，不会将对象的引用（this）传递给它，所以在 static 方法中不可访问非static的成员，静态方法只能访问静态成员变量或静态方法。

-  父类中是静态方法，子类中不能覆盖为非静态方法；在符合覆盖规则的前提下， 在父子类中，父类中的静态方法可以被子类中的静态方法覆盖，但无多态。 （在使用对象调用静态方法时，实则是调用编译时类型的静态方法）。

- 父子类中，静态方法只能被静态方法覆盖，父子类中，非静态方法只能被非静 态方法覆盖。

#### 静态初始化块 static {}

注：如果希望加载后，对整个类进行某些初始化操作，可以使用static初始化块

1. 是在类初始化时执行，不是在创建对象时执行。 
2. 静态初始化块中不能访问非static成员变量。
3. 执行顺序：上溯到Object类，先执行Object的静态初始化块，再向下执行子 类的静态初始化块，直到我们的类的静态初始化块为止。


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

- 在java（C++-）中类只有单继承，没有像C++那样的多继承。多 继承，就是为了实现代码的复用性，却引入了复杂性，使得系统类之间 的关系混乱；Java中的多继承，可以通过接口实现

- 如果定义一个类时，没有调用extends，则它的父类是java.lang.Object。Object类是所有java类的根基类。



### 1.方法的重写

- 在子类中可以根据需要对父类中继承来的方法进行重写。

- 重写方法必须和被重写方法具有相同方法名称、参数列表。通过子类去调用该
  方法，会调用重写方法而不是被重写方法(叫做重写方法覆盖被重写方法)。
  
- 可以在子类重写方法中调用被重写方法: super关键字。

- 重写方法的访问权限，子类大于等于父类(由于多态)。

- 重写方法的返回值类型和声明异常类型，子类小于等于父类。

- 对象.方法() :先在本类内部找是否有该方法，如果没有，到直接父类去找,
  如果还没有，则一直往上层找，一直找到Object， 如果还没有，则报错。
  
- 子类继承父类的成员变量,子类继承父类除构造方法以外的成员方法,子类不能继承父类的构造方法,子类可以增加成员，可以重定义从父类继承来的成员，但不能删除它们。

### 2.子类对父类的访问权限

- 子类不能访问父类的私有成员( private )

- 子类能够访问父类的公有成员( public)和保护成员(protected)

- 子类对父类的缺省权限成员的访问控制，以包为界分两种情况，可以访问当前包中成员。

### 3.super引用

1. 调用父类的构造方法：super([参数列表])

2. super是直接父类对象的引用，和this类似。

3. 引用父类同名成员

   - 子类隐藏父类成员变量：super.成员变量

   - 子类覆盖父类成员方法：super.成员方法([参数列表])

4. 构造方法:任何类的构造方法中，若是构造函数的第一行代码没有显式调用
   super(..);那么Java默认都会调用super();作为父类的初始化函数。所以这里的super()加不加都会无所谓。( 内存分析，wrap:new对象的时候采用子类包裹父类的结构)

5. 同一个构造方法里面不能同时调用super()和this()。

6. 在本类构造方法中通过super()调用，会一直 上溯到Object()这个构造函数,
   然后按类层级，依次向下执行各层级构造函数中剩下的代码，直至最低层级的
   构造函数。同this()一样，super()方法也应该放到构造方法的第一行。

7. new一个类的对象的时候，通过构造方法的从上至下的依次调用，就依次建
   立了新的根对象、父类对象和自身对象，其中，this指向新建的对象本身，
   super指向新建的直接父类对象本身。

### 4.组合VS继承

1. “is-a"关系使用继承，“has-a"关系使用组合:计算机类、主板类。可以通过在计算机类中增加主板属性来复用主板类的代码。

2. 如果仅仅从代码复用的角度考虑，组合完全可以替代继承。

3. 所谓组合，就是把要组合的另一个类作为属性放到类里面。

4. 是就用继承、有就用组合。

#### 优缺点

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

  <u>方法重载都是编译时多态。</u>

  <u>方法覆盖表现出两种多态性，当对象引用本类实例时，为编译时多态，否则为运行时多态。</u>

  ```java
  Person p = new Person(.....);
  p.toString()
  //执行Person类的toString()
  Student s= new Studen(.....);
  s.toString()
  //执行Student类的toString()
  ```

- 运行时多态性

  <u>自下而上搜索，有则调用无责溯源</u>

  ![image-20220916085315869](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220916085315869.png)

### 4.多态的方法实现

![image-20220921141638509](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220921141638509.png)

- 子类类型的对象地址可以直接赋给父类类型的引用对象，这个称为向上转型，是实现多态的基础。

- A instanceof B: A对象的类型是否是B类型，只有在A对象的类型和B类型相同，或为父子类型时，编译不报错。而在运行时，只有A对象类型为B类型的子类型或者就是B类型时，结果才返回true。
- 内存分析(例子: myServlet) :调用父类的service(),然后调用子类的doGet() (注意: this关键字指向整个最终包裹对象，即最外层的子对象;而在包裹对象中，每-一层对象通过super关键字指向内一层的父对象)。
- 多态指的是方法的多态(到底调用那个方法，运行时决定)，属性没有多态。
- 针对某个类型的方法调用，其真正执行的方法取决于运行时期实际类型的方法。

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

1. <u>构造方法、静态成员方法</u>不能被声明为抽象
   方法。
2. 一个非抽象类必须实现从父类继承来的所有
   抽象方法。
3. 不能创建抽象类的实例。例如:`ClosedFigure g = new ClosedFigure();` 
4. <u>abstract修饰方式的初衷就是要求其子类覆盖(实现)这个方法，并且调用时可以以多态方式调用子类覆盖后的方法(抽象类主要和多态技术相结合)</u>，即抽象方法必须在其子类中实现，除非子类本身也是抽象类。<u>abstract不允许修饰成员变量</u>，因为成员变量也没有重写这个概念!
5. 抽象类可以只有具体方法，也可以全是抽象方法，子类继承抽象类也可以是抽象类，但要实例化的类不能是抽象类。
6. 不能放在一起的修饰符: <u>final和abstract, private和abstract, static和abstract</u>，因为abstract修饰的方法是必须在其子类中实现(覆盖)，才能以多态方式调用，以上修饰符在修饰方法时期子类都覆盖不了这个方法，<u>final是不可以覆盖</u>，<u>private是不能</u>
   <u>够继承到子类</u>，所以也就不能覆盖，<u>static是可以覆盖的，但是在调用时会调用编译时类型的方法，因为调用的是父类的方法，而父类的方法又是抽象的方法，又不能够调用</u>，所以上面的修饰符不能放在一起。

## 最终类

1. 声明最终类， 不能被继承
   
   ```java
   public final class Math
   //数学类，最终类
   public class MyMath extends Math
   //语法错
   public final class Circle extends Ellipse / /最终类
   ```
   
   
   
1. 声明最终方法,不能被子类覆盖

   ```java
   public class Circle extends Ellipse
   
   / /非最终类
   
   {
   
   public final double area( )
   
   //最终方法
   
   }
   ```
   
### final关键词

1. final修饰变量时表示常量。<u>变量被final修饰，就会变成常量</u>(常量应大写)，一旦赋值不能改变(可以在<u>初始化时直接赋值</u>，也可以在<u>构造方法里赋值</u>，只能在这两种方法里二选一，<u>必须为常量赋值</u>) ;final的常量不会有默认初始值，对于直接在初始化时赋值方式，final修饰符常和static修饰符一起使用。
2. final修饰方法( 最终方法)时表示<u>该方法不可被子类重写</u>。但是<u>可以被重载</u>。
3. <u>final修饰类</u>(最终类)时表示修饰的<u>类不能有子类</u>，不能被继承。比如Math、String。 final类中的方法也都是final的。

## 接口类

<u>如果一个抽象类没有字段，所有方法全部都是抽象方法，就可以将该抽象类改为接口。</u>

类不能多继承类，但可以实现多个接口，一个接口可以继承多个接口。

接口可以看成<u>**狭义抽象**</u>，将设计与实现彻底分离。

通过给类新增接口来改变类，而不影响子类。

接口不能有构造方法，抽象类可以有。

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

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220921155545894.png" alt="image-20220921155545894" style="zoom: 80%;" />

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

- 接口不能有方法体，抽象类可以有。

- 接口不能有静态方法，抽象类可以有。
- 在接口中凡是变量必须是public static final,而在抽象类中没有要求。
- 抽象类本质上还是-一个类，子类是用关键字extends来继承它，并扩展的，有非常强的is-a的关系。而接口，是被其他类用关键字implements来实现接口定义的方法的。接口只是定义功能和行为规范，如果一个类实现了一个接口，那么这个类必须遵守这个接口的方法约定，但没有is-a的关系。

### 内部类和内部接口

![image-20220923082921856](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220923082921856.png)

- 内嵌类型不能与外层类型同名。

- 内部类中可以声明成员变量和成员方法。
- 内部类可以继承父类或实现接口。.
- 可以声明内部类为抽象类，该抽象类必须被其他内部类继承;内部接口必须被其他内部类实现。

- 使用点运算符“”引用内嵌类型:外层类型.内嵌类型Pixel.Color
- 内嵌类型具有类中成员的4种访问控制权限。当内部类可被访问时，才能考虑内部类中成员的访问控制权限。
- 内嵌类型与其外层类型彼此信任，能访问对方的所有成员
- 内部接口总是静态的。内部类可声明是静态的或实例的，静态内部类能够声明静态成员，但不能引用外部类的实例成员;实例内部类不能声明静态成员。

- 在实例内部类中，使用以下格式引用或调用外部类当前实例的成员变量或实例成员方法:

  `外部类.this.成员变量//引用外部类当前实例的成员变量`

  `外部类.this.实例成员方法(参数列表)//调用外部类当前实例的成员方法`

## API

### 基本数据类型

![image-20220923083806822](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220923083806822.png)

**自动裝箱:**基本数据类型就自动的封装到与它相同类型的包装中。如:
Integeri = 100;本质上就是编译器编译时自动为我们添加了Integeri =
new Integer( 100);
<u>自动拆箱:</u>包装类对象自动转化为基本数据类型。如:inta=new
Integer(100);本质上就是编译器编译时自动为我们添加了inta = new
Integer( 100).intValue();
**缓存问题:** [-128,127]之 间的数对应的包装类对象，仍然当做基本数据类型
来处理;一旦遇到一个这个之间的数(默认为这些小的数使用频率会很高)，
把他包装成-一个对象后，就缓存起来，下次如果又要包装-一个这个数的对象，
则去看是否已经有这个对象，有就直接拿来使用，这样可以节省内存空间、提
高效率(享元模式)。
**享元模式:**有很多小对象，它们的大部分属性相同，这时可以把它们变成-一个
对象，那些相同的属性为对象的内部状态，那些不同的属性可以变为方法的参
数，由外部传入。例: -128~127 内的相同整数自动装箱为同一个对象。

## 泛型

### 泛型声明

`[修饰符] class 类<类型参数列表> [extends父类] [implements 接口列表]`
`[public] interface 接口 < 类型参数列表> [extends父接口列表]`
`[public] [static]< < 类型参数列表>返回值类型方法([参数列表]) [throws 异常类`
`列表]`

![image-20220923092011478](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220923092011478.png)

```java
public interface GenericIntercace<T> {
T getData();//类似于c++的模板
```

注意：

- 接口中泛型字母只能使用在方法中，不能使用在全局常量中

- 泛型方法可以在非泛型类中

### 泛型继承

泛型父类:子类为"富二代”:子类的泛型要比父类多

1. 保留父类的泛型-->子类为泛型类

2. 不保留父类泛型-->子类按需实现

- 子类. [重写方法]的参数类型-->随父类而定
- 子类新增的方法，参数类型随子类而定
- 子类中使用父类的[属性] --> 随父类而定
- 子类使用自己的属性-->随子类而定

![image-20220923093134846](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220923093134846.png)

### 泛型擦除

- 定义:泛型擦除是指在继承(实现)或使用时没有指定具体的类型
- 特点:一旦擦除之后按Object处理

```java
//2)没有类型擦除--》Object
class C4 <A,B> extends Father{
public void test(Object name) {子类重写方法的参数类型-->随父类而定:
Object 
this age = new Object:);//Object类型，子类使用父类的[属性]，类型
随父类而定
}

```

### 通配符

- T、K、V、E等泛型字母为有类型，类型参数赋予具体的值
- ?未知类型类型参数赋予不确定值，任意类型
- 只能用在声明类型、方法参数上，不能用在定义泛型类上

```java
public class GenericTest {
public static void main(String[ args) {
List<String> name = new ArrayL ist<String>();
List<Integer> age = new ArrayL ist<Integer>();
List<Number> number = new
ArrayList<Number>();
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

( Error)指程序运行时遇到的硬件、操作系统、
虚拟机的错误。 Error错误类。Java程序**不能处理错误**，只能依靠外界干预。

1. NoClassDefFoundError类定，义未找到错误。没有
   .class文件， 或没有main()方法时。
2. OutOfMemoryError内存溢出错误。没有可用内存时。
3. StackOverflowError栈溢出错误。当递归函数不能正常结束时。

![image-20220928142730920](C:\Users\alleyf\AppData\Roaming\Typora\typora-user-images\image-20220928142730920.png)

### 异常

（Exception）指在硬件、操作系统、虚拟 机正常时，程序遇到的运行错（语义错）

#### 异常类（默认java.lang包）

![image-20220928143014612](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220928143014612.png)

#### 内置异常类

![image-20220928160253693](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220928160253693.png)

#### 异常方法

![image-20220928160326479](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220928160326479.png)



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

3. ClassCastException 

   Object obj = new Object(); 

   String str = (String) obj; //类型强制转换异常



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

<u>抛出异常对象的throw语句</u>

```java
[修饰符] 返回值类型 方法([参数列表])[throws异常类列表]
public static int parseInt(String s)
throws NumberFormatException
日期类声明抛出异常的方法与方法调用者处理异常。
public void set(int year, int month, int day)
throws Exception
public MyDate(int year, int month, int day)
throws Exception
{
this.set(year, month, day);
}
public static void main(String[] args) throws Exception
```

### throws和throw以及try-catch-finally的区别

- throws为方法声明可能出现的异常，函数调用者处理不处理异常则继续向下抛出异常直至被处理，否则程序结束。
- throw主要是发现异常并抛出指定的异常给调用者。
- throw要么和try-catch-finally语句配套使用，要么与throws配套 使用。但throws可以单独使用，然后再由处理异常的方法捕获。

```java
class ThrowsDemo {
static void throwOne() throws IllegalAccessException {
System.out.println("Inside throwOne.");
throw new IllegalAccessException("demo");
}
public static void main(String args[]) {
try {
throwOne();
} catch (IllegalAccessException e) {
System.out.println("Caught " + e);
}}}
```











**版权归属：**[Alleyf](https://fcsy.fit)

