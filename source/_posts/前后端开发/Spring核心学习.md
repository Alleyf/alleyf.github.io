---
title: Spring核心学习
tags:
  - Spring
categories: Backend_development
date: 2023-10-16 12:00:17
sticky: 90
excerpt: Web—study about Spring(IOC,Di,AOP)
---
# 数据库基础
## 数据库定义语言（DDL）
### 数据库操作
我们可以通过 `create database` 来创建一个数据库：
```mysql
 create database 数据库名
```
为了能够支持中文，我们在创建时可以设定编码格式：
```mysql
 CREATE DATABASE IF NOT EXISTS 数据库名 DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
```
如果我们创建错误了，我们可以将此数据库删除，通过使用 `drop database` 来删除一个数据库：
```mysql
 drop database 数据库名
```
### 创建表
数据库创建完成后，我们一般通过 `create table` 语句来创建一张表：
```mysql
 create table 表名(列名 数据类型[列级约束条件],  
              列名 数据类型[列级约束条件],  
              ...  
              [,表级约束条件])
```
### SQL 数据类型
**（1）字符串存储：**
- char (n)可以存储任意字符串，但是是固定长度为 n，如果插入的长度小于定义长度时，则用空格填充。
    
- varchar (n)也可以存储任意数量字符串，长度不固定，但不能超过 n，不会用空格填充。
    
**（2）存储数字：**
- smallint 用于存储小的整数，范围在 (-32768，32767)
    
- int 用于存储一般的整数，范围在 (-2147483648，2147483647)
    
- bigint 用于存储大型整数，范围在 (-9,223,372,036,854,775,808，9,223,372,036,854,775,807)
    
- float 用于存储单精度小数
    
- double 用于存储双精度的小数
    
**（3）存储时间：**
- date 存储日期
    
- time 存储时间
    
- year 存储年份
    
- datetime 用于混合存储日期+时间
    
### 列级约束条件
列级约束有六种：主键 Primary key、外键 foreign key 、唯一 unique、检查 check （MySQL 不支持）、默认 default 、非空/空值 not null/ null
### 表级约束条件
表级约束有四种：主键、外键、唯一、检查
现在我们通过 SQL 语句来创建我们之前提到的三张表。
```mysql
 [CONSTRAINT <外键名>] FOREIGN KEY 字段名 [，字段名2，…] REFERENCES <主表名> 主键列1 [，主键列2，…]
```
### 修改表
如果我们想修改表结构，我们可以通过 `alter table` 来进行修改：
```mysql
 ALTER TABLE 表名[ADD 新列名 数据类型[列级约束条件]]  
                              [DROP COLUMN 列名[restrict|cascade]]  
                              [ALTER COLUMN 列名 新数据类型]
```
我们可以通过 ADD 来添加一个新的列，通过 DROP 来删除一个列，不过我们可以添加 restrict 或 cascade，默认是 restrict，表示如果此列作为其他表的约束或视图引用到此列时，将无法删除，而 cascade 会强制连带引用此列的约束、视图一起删除。还可以通过 ALTER 来修改此列的属性。
### 删除表
我们可以通过 `drop table` 来删除一个表：
```mysql
 DROP TABLE 表名[restrict|cascade]
```
其中 restrict 和 cascade 上面的效果一致。

---
## 数据库操纵语言（DML）
前面我们已经学习了如何使用 SQL 语句来创建、修改、删除数据库以及表，而如何向数据库中插入、删除、更新数据，将是本版块讨论的重点。
### 插入数据
通过使用 `insert into` 语句来向数据库中插入一条数据（一条记录）：
```mysql
 INSERT INTO 表名 VALUES(值1, 值2, 值3)
```
如果插入的**数据与列一一对应**，那么可以**省略列名**，但是如果希望向指定列上插入数据，就需要给出列名：
```mysql
 INSERT INTO 表名(列名1, 列名2) VALUES(值1, 值2)
```
我们也可以一次性向数据库中插入多条数据：
```mysql
 INSERT INTO 表名(列名1, 列名2) VALUES(值1, 值2), (值1, 值2), (值1, 值2)
```
我们来试试看向我们刚刚创建的表中添加三条数据。
### 修改数据
我们可以通过 `update` 语句来更新表中的数据：
```mysql
 UPDATE 表名 SET 列名=值,... WHERE 条件
```
注意，SQL 语句中的等于判断是 `=`
**警告：如果忘记添加 `WHERE` 字句来限定条件，将使得整个表中此列的所有数据都被修改！
### 删除数据
我们可以通过使用 `delete` 来删除表中的数据：
```mysql
 DELETE FROM 表名
```
通过这种方式，将删除表中全部数据，我们也可以使用 `where` 来添加条件，只删除指定的数据：
```mysql
 DELETE FROM 表名 WHERE 条件
```

---
## 数据库查询语言（DQL）
数据库的查询是我们整个数据库学习中的重点内容，面对数据库中庞大的数据，该如何去寻找我们想要的数据，就是我们主要讨论的问题。
### 单表查询
单表查询是最简单的一种查询，我们只需要在一张表中去查找数据即可，通过使用 `select` 语句来进行单表查询：
 -- 指定查询某一列数据  
```mysql
 SELECT 列名[,列名] FROM 表名  
```
 -- 会以别名显示此列  
```mysql
 SELECT 列名 别名 FROM 表名  
```
 -- 查询所有的列数据  
```mysql
 SELECT * FROM 表名  
```
 -- 只查询不重复的值  
```mysql
 SELECT DISTINCT 列名 FROM 表名
```
我们也可以添加 `where` 字句来限定查询目标：
```mysql
 SELECT * FROM 表名 WHERE 条件
```
### 常用查询条件
- 一般的比较运算符，包括=、>、<、>=、<=、!=等。
    
- 是否在集合中：in、not in
    
- 字符模糊匹配：like，not like
    
- 多重条件连接查询：and、or、not
    
我们来尝试使用一下上面这几种条件。
### 排序查询
我们可以通过 `order by` 来将查询结果进行排序：
```mysql
 SELECT * FROM 表名 WHERE 条件 ORDER BY 列名 ASC|DESC
```
使用 ASC 表示升序排序，使用 DESC 表示降序排序，默认为升序。
我们也可以可以同时添加多个排序：
```mysql
 SELECT * FROM 表名 WHERE 条件 ORDER BY 列名1 ASC|DESC, 列名2 ASC|DESC
```
这样会先按照列名 1 进行排序，每组列名 1 相同的数据再按照列名 2 排序。
### 聚集函数
聚集函数一般用作统计，包括：
- `count([distinct]*)` 统计所有的行数（distinct 表示去重再统计，下同）
    
- `count([distinct]列名)` 统计某列的值总和
    
- `sum([distinct]列名)` 求一列的和（注意必须是数字类型的）
    
- `avg([distinct]列名)` 求一列的平均值（注意必须是数字类型）
    
- `max([distinct]列名)` 求一列的最大值
    
- `min([distinct]列名)` 求一列的最小值
    
一般聚集函数是这样使用的：
```mysql
 SELECT count(distinct 列名) FROM 表名 WHERE 条件 
```
### 分组和分页查询
通过使用 `group by` 来对查询结果进行分组，它需要结合聚合函数一起使用：
```mysql
 SELECT sum(*) FROM 表名 WHERE 条件 GROUP BY 列名
```
我们还可以添加 `having` 来限制分组条件：
```mysql
 SELECT sum(*) FROM 表名 WHERE 条件 GROUP BY 列名 HAVING 约束条件
```
我们可以通过 `limit` 来限制查询的数量，只取前 n 个结果：
```mysql
 SELECT * FROM 表名 LIMIT 数量
```
我们也可以进行分页：
```mysql
 SELECT * FROM 表名 LIMIT 起始位置,数量
```
### 多表查询
多表查询是同时查询的两个或两个以上的表，多表查询会提通过连接转换为单表查询。
```mysql
 SELECT * FROM 表1, 表2
```
直接这样查询会得到两张表的笛卡尔积，也就是每一项数据和另一张表的每一项数据都结合一次，会产生庞大的数据。
```mysql
 SELECT * FROM 表1, 表2 WHERE 条件
```
这样，只会从笛卡尔积的结果中得到满足条件的数据。
**注意：如果两个表中都带有此属性吗，需要添加表名前缀来指明是哪一个表的数据。
### 自身连接查询
自身连接，就是将表本身和表进行笛卡尔积计算，得到结果，但是由于表名相同，因此要先起一个别名：
```mysql
 SELECT * FROM 表名 别名1, 表名 别名2
```
其实自身连接查询和前面的是一样的，只是连接对象变成自己和自己了。
### 外连接查询
外连接就是专门用于联合查询情景的，比如现在有一个存储所有用户的表，还有一张用户详细信息的表，我希望将这两张表结合到一起来查看完整的数据，我们就可以通过使用外连接来进行查询，外连接有三种方式：
- 通过使用 `inner join` 进行内连接，只会返回**两个表满足条件的交集部分**：
    
- 通过使用 `left join` 进行左连接，不仅会返回两个表满足条件的**交集部分**，也会返回**左边表中的全部数据**，而在右表中缺失的数据会使用 `null` 来代替（右连接 `right join` 同理，只是反过来而已，这里就不再介绍了）：
### 嵌套查询
我们可以将查询的结果作为另一个查询的条件，比如：
```mysql
 SELECT * FROM 表名 WHERE 列名 = (SELECT 列名 FROM 表名 WHERE 条件)
```
我们来再次尝试编写一下在最开始我们查找某教师所有学生的 SQL 语句。

---
## 数据库控制语言（DCL）
庞大的数据库不可能由一个人来管理，我们需要更多的用户来一起管理整个数据库。
### 创建用户
我们可以通过 `create user` 来创建用户：
```mysql
 CREATE USER 用户名 identified by 密码;
```
也可以不带密码：
```mysql
 CREATE USER 用户名;
```
我们可以通过@来限制用户登录的登录 IP 地址，`%` 表示匹配所有的 IP 地址，默认使用的就是任意 IP 地址。
### 登陆用户
首先需要添加一个环境变量，然后我们通过 cmd 去登陆 mysql：
```mysql
 mysql -u 用户名 -p
```
输入密码后即可登陆此用户，我们输入以下命令来看看能否访问所有数据库：
```mysql
 show databases;
```
我们发现，虽然此用户能够成功登录，但是并不能查看完整的数据库列表，这是因为此用户还没有权限！
### 用户授权
我们可以通过使用 `grant` 来为一个数据库用户进行授权：
```mysql
 grant all|权限1,权限2...(列1,...) on 数据库.表 to 用户 [with grant option]
```
其中 all 代表授予所有权限，当数据库和表为 `*`，代表为所有的数据库和表都授权。如果在最后添加了 `with grant option`，那么被授权的用户还能将已获得的授权继续授权给其他用户。
我们可以使用 `revoke` 来收回一个权限：
```mysql
 revoke all|权限1,权限2...(列1,...) on 数据库.表 from 用户
```

---
## 视图
视图本质就是一个查询的结果，不过我们每次都可以通过打开视图来按照我们想要的样子查看数据。既然视图本质就是一个查询的结果，那么它本身就是一个虚表，并不是真实存在的，数据实际上还是存放在原来的表中。
我们可以通过 `create view` 来创建视图;
```mysql
 CREATE VIEW 视图名称(列名) as 子查询语句 [WITH CHECK OPTION];
```
WITH CHECK OPTION 是指当创建后，如果更新视图中的数据，是否要满足子查询中的条件表达式，不满足将无法插入，创建后，我们就可以使用 `select` 语句来直接查询视图上的数据了，因此，还能在视图的基础上，导出其他的视图。
1. 若视图是由两个以上基本表导出的，则此视图不允许更新。
2. 若视图的字段来自字段表达式或常数，则不允许对此视图执行 INSERT 和 UPDATE 操作，但允许执行 DELETE 操作。
3. 若视图的字段来自集函数，则此视图不允许更新。
4. 若视图定义中含有 GROUP BY 子句，则此视图不允许更新。
5. 若视图定义中含有 DISTINCT 短语，则此视图不允许更新。
6. 若视图定义中有嵌套查询，并且内层查询的 FROM 子句中涉及的表也是导出该视图的基本表，则此视图不允许更新。例如将成绩在平均成绩之上的元组定义成一个视图 GOOD_SC： CREATE VIEW GOOD_SC AS SELECT Sno, Cno, Grade FROM SC WHERE Grade > (SELECT AVG (Grade) FROM SC); 　　导出视图 GOOD_SC 的基本表是 SC，内层查询中涉及的表也是 SC，所以视图 GOOD_SC 是不允许更新的。
7. 一个不允许更新的视图上定义的视图也不允许更新
通过 `drop` 来删除一个视图：
```mysql
 drop view apptest
```
 
---
## 索引
在数据量变得非常庞大时，通过创建索引，能够大大提高我们的查询效率，就像 Hash 表一样，它能够快速地定位元素存放的位置，我们可以通过下面的命令创建索引：
 -- 创建索引  
```mysql
 CREATE INDEX 索引名称 ON 表名 (列名)  
```
 -- 查看表中的索引  
```mysql
 show INDEX FROM student
```
我们也可以通过下面的命令删除一个索引：
```mysql
 drop index 索引名称 on 表名
```
虽然添加索引后会使得查询效率更高，但是我们不能过度使用索引，索引为我们带来高速查询效率的同时，也会在**数据更新时产生额外建立索引的开销**，同时也会**占用磁盘资源**。

---
## 触发器
触发器就像其名字一样，在某种条件下会自动触发，在 `select` / `update` / `delete` 时，会自动执行我们预先设定的内容，触发器通常用于检查内容的安全性，相比直接添加约束，触发器显得更加灵活。
触发器所依附的表称为基本表，当触发器表上发生 `select` / `update` / `delete` 等操作时，会自动生成两个临时的表（new 表和 old 表，只能由触发器使用）
比如在 `insert` 操作时，新的内容会被插入到 new 表中；在 `delete` 操作时，旧的内容会被移到 old 表中，我们仍可在 old 表中拿到被删除的数据；在 `update` 操作时，旧的内容会被移到 old 表中，新的内容会出现在 new 表中。
```mysql
 CREATE TRIGGER 触发器名称 [BEFORE|AFTER] [INSERT|UPDATE|DELETE] ON 表名/视图名 FOR EACH ROW DELETE FROM student WHERE student.sno = new.sno
```
FOR EACH ROW 表示针对每一行都会生效，无论哪行进行指定操作都会执行触发器！
通过下面的命令来查看触发器：
```mysql
 SHOW TRIGGERS
```
如果不需要，我们就可以删除此触发器：
```mysql
 DROP TRIGGER 触发器名称
```
 
---
## 事务
当我们要进行的操作非常多时，比如要依次删除很多个表的数据，我们就需要执行大量的 SQL 语句来完成，这些数据库操作语句就可以构成一个事务！只有 **Innodb** 引擎支持事务，我们可以这样来查看支持的引擎：
```mysql
 SHOW ENGINES;
```
MySQL 默认采用的是 Innodb 引擎，我们也可以去修改为其他的引擎。
事务具有以下特性 ACID：
- **原子性：一个事务（transaction）中的所有操作，要么全部完成，要么全部不完成，不会结束在中间某个环节。事务在执行过程中发生错误，会被回滚（Rollback）到事务开始前的状态，就像这个事务从来没有执行过一样。
- **一致性：在事务开始之前和事务结束以后，数据库的完整性没有被破坏。这表示写入的资料必须完全符合所有的预设规则，这包含资料的精确度、串联性以及后续数据库可以自发性地完成预定的工作。
- **隔离性：数据库允许多个并发事务同时对其数据进行读写和修改的能力，隔离性可以防止多个事务并发执行时由于交叉执行而导致数据的不一致。事务隔离分为不同级别，包括读未提交（Read uncommitted）、读提交（read committed）、可重复读（repeatable read）和串行化（Serializable）。
- **持久性：事务处理结束后，对数据的修改就是永久的，即便系统故障也不会丢失。
我们通过以下例子来探究以下事务：
 begin;   #开始事务  
 ...  
 rollback;  #回滚事务  
 savepoint 回滚点;  #添加回滚点  
 rollback to 回滚点; #回滚到指定回滚点  
 ...  
 commit; #提交事务  
 -- 一旦提交，就无法再进行回滚了！
 
---
## 选学内容
**函数**和**存储过程**并没有包含在我们的教程当中，但是这并不代表它们就不重要，通过学习它们能够让你的数据库管理能力更上一层楼，它们能够捆绑一组 SQL 语句运行，并且可以反复使用，大大提高工作效率。
# Lombok
通过（`@Data，@Getter，@Setter，@AllArgsConstructor等`）注解简化传统繁琐的 `get/set` 和**构造**方法。
```java
@Getter
@Setter 
@AllArgsConstructor 
public class Student { 
private Integer sid; 
private String name; 
private String sex; 
}
```
> 使用 Lombok 之后，只需要添加几个注解，就能够解决掉我们之前长长的一串代码！

## 配置 Lombok
- 首先我们需要**导入 Lombok 的 jar 依赖**，和 jdbc 依赖是一样的，放在项目目录下直接导入就行了。可以在这里进行下载：[Lombok](https://projectlombok.org/download)
- 然后我们要安装一下 Lombok 插件，由于 IDEA**默认都安装了 Lombok 的插件**，因此直接导入依赖后就可以使用了。
- 重启 IDEA

Lombok 是一种插件化注解 API，是通过添加注解来实现的，然后在**javac**进行编译的时候，进行处理。
Java 的编译过程可以分成三个阶段：
![](https://image.itbaima.net/markdown/2023/03/06/fUEondmywKNucOW.png)
1. 所有源文件会被解析成语法树。
2. 调用注解处理器。如果注解处理器产生了新的源文件，新文件也要进行编译。
3. 最后，语法树会被分析并转化成类文件。

实际上在上述的第二阶段，会执行 [lombok.core.AnnotationProcessor](https://github.com/rzwitserloot/lombok/blob/master/src/core/lombok/core/AnnotationProcessor.java)，它所做的工作就是我们上面所说的，修改语法树。
## 使用 Lombok
1. `@Getter` 和 `@Setter` 来为当前类的所有字段生成 `get/set方法`，他们可以添加到类或是字段上，注意**静态字段不会生成，final 字段无法生成 set 方法**。
   - 我们还可以使用 `@Accessors` 来控制生成 Getter 和 Setter 的**样式**。
2. `@ToString` 来为当前类生成预设的**toString 方法**。
3. `@EqualsAndHashCode` 来快速生成**比较和哈希值方法**。
4. `@AllArgsConstructor` 和 `@NoArgsConstructor` 来快速生成**全参构造和无参构造**。
5. `@RequiredArgsConstructor` 来快速生成参数只包含 `final` 或被标记为 `@NonNull` 的成员字段。
6. `@Data` 能代表 `@Setter`、`@Getter`、`@RequiredArgsConstructor`、`@ToString`、`@EqualsAndHashCode` 全部注解。
    - 一旦使用 `@Data` 就**不建议此类有继承关系**，因为 `equal` 方法可能不符合预期结果（尤其是仅比较子类属性）。
7. `@Value` 与 `@Data` 类似，但是并**不会生成 setter**并且**成员属性都是 final 的**。
8. `@SneakyThrows` 来自动生成**try-catch**代码块。
9. `@Cleanup` 作用与局部变量，在最后自动调用其 `close()` 方法（可以自由更换）
10. `@Builder` 来快速生成建造者模式。
    - 通过使用 `@Builder.Default` 来指定默认值。
    - 通过使用 `@Builder.ObtainVia` 来指定默认值的获取方式。

# Mybatis
MyBatis 是一款优秀的持久层框架，它支持定制化 SQL、存储过程以及高级映射。MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。MyBatis 可以使用简单的 XML 或注解来配置和映射原生信息，将接口和 Java 的 POJOs (Plain Ordinary Java Object, 普通的 Java 对象)映射成数据库中的记录。
## XML 语言概述
XML 语言发明最初是用于数据的存储和传输:
```xml
<?xml version="1.0" encoding="UTF-8" ?> 
<outer> 
<name>阿伟</name> 
<desc>怎么又在玩电动啊</desc> 
<inner type="1"> 
<age>10</age> 
<sex>男</sex> 
</inner> 
</outer>
```
HTML主要用于通过编排来展示数据，而XML主要是存放数据，它更像是一个配置文件！
一个XML文件存在以下的格式规范：
- 必须存在一个**根节点**，将所有的子标签全部包含。
- 可以但不必须包含一个**头部声明**（主要是可以设定编码格式）
- 所有的**标签必须成对出现**，可以嵌套但不能交叉嵌套
- 区分大小写。
- 标签中**可以存在属性**，比如上面的`type="1"`就是`inner`标签的一个属性，属性的值由单引号或双引号包括。

XML文件也可以使用注释：
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!-- 注释内容 -->
```
XML的转义字符:
![](https://image.itbaima.net/markdown/2023/03/06/j5WEDVxYJ8KSkHt.jpg)
可以使用`CD`来快速创建不解析区域：
```xml
<test> <name><![CDATA[我看你<><><>是一点都不懂哦>>>]]></name> </test>
```
JDK为我们内置了一个叫做`org.w3c`的XML解析库来进行XML文件内容解析：
```java
 // 创建DocumentBuilderFactory对象  
 DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();  
 // 创建DocumentBuilder对象  
 try {  
     DocumentBuilder builder = factory.newDocumentBuilder();  
     Document d = builder.parse("file:mappers/test.xml");  
     // 每一个标签都作为一个节点  
     NodeList nodeList = d.getElementsByTagName("test");  // 可能有很多个名字为test的标签  
     Node rootNode = nodeList.item(0); // 获取首个  
 ​  
     NodeList childNodes = rootNode.getChildNodes(); // 一个节点下可能会有很多个节点，比如根节点下就囊括了所有的节点  
     //节点可以是一个带有内容的标签（它内部就还有子节点），也可以是一段文本内容  
 ​  
     for (int i = 0; i < childNodes.getLength(); i++) {  
         Node child = childNodes.item(i);  
         if(child.getNodeType() == Node.ELEMENT_NODE)  //过滤换行符之类的内容，因为它们都被认为是一个文本节点  
         System.out.println(child.getNodeName() + "：" +child.getFirstChild().getNodeValue());  
         // 输出节点名称，也就是标签名称，以及标签内部的文本（内部的内容都是子节点，所以要获取内部的节点）  
     }  
 } catch (Exception e) {  
     e.printStackTrace();  
 }
```
当然，学习和使用XML只是为了更好地去认识Mybatis的工作原理，以及如何使用XML来作为Mybatis的配置文件，这是在开始之前必须要掌握的内容（需要知道Mybatis就是通过这种方式来读取配置文件的）
不仅仅是Mybatis，包括后面的Spring等众多框架都会用到XML来作为框架的配置文件！
## 初次使用Mybatis
那么我们首先来感受一下Mybatis给我们带来的便捷，就从搭建环境开始，中文文档网站：[https://mybatis.org/mybatis-3/zh/configuration.html](https://mybatis.org/mybatis-3/zh/configuration.html)
我们需要导入Mybatis的依赖，Jar包需要在github上下载，同样地放入到项目的根目录下，右键作为依赖即可！（依赖变多之后，我们可以将其放到一个单独的文件夹，不然会很繁杂）
依赖导入完成后，我们就可以编写Mybatis的配置文件了（现在不是在Java代码中配置了，而是通过一个XML文件去配置，这样就使得硬编码的部分大大减少，项目后期打包成Jar运行不方便修复，但是通过配置文件，我们随时都可以去修改，就变得很方便了，同时代码量也大幅度减少，配置文件填写完成后，我们只需要关心项目的业务逻辑而不是如何去读取配置文件）我们按照官方文档给定的提示，在项目根目录下新建名为`mybatis-config.xml`的文件，并填写以下内容：
```xml
 <?xml version="1.0" encoding="UTF-8" ?>  
 <!DOCTYPE configuration  
   PUBLIC "-//mybatis.org//DTD Config 3.0//EN"  
   "http://mybatis.org/dtd/mybatis-3-config.dtd">  
 <configuration>  
   <environments default="development">  
     <environment id="development">  
       <transactionManager type="JDBC"/>  
       <dataSource type="POOLED">  
         <property name="driver" value="${驱动类（含包名）}"/>  
         <property name="url" value="${数据库连接URL}"/>  
         <property name="username" value="${用户名}"/>  
         <property name="password" value="${密码}"/>  
       </dataSource>  
     </environment>  
   </environments>  
 </configuration>
```
最上方还引入了一个叫做DTD（文档类型定义）的东西，它提前帮助我们规定了一些标签，我们就需要使用Mybatis提前帮助我们规定好的标签来进行配置（因为只有这样Mybatis才能正确识别我们配置的内容）
通过进行配置，我们就告诉了Mybatis我们链接数据库的一些信息，包括URL、用户名、密码等，这样Mybatis就知道该链接哪个数据库、使用哪个账号进行登陆了（也可以不使用配置文件）
配置文件完成后，我们需要在Java程序启动时，让Mybatis对配置文件进行读取并得到一个`SqlSessionFactory`对象：
```java
 public static void main(String[] args) throws FileNotFoundException {  
     SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(new FileInputStream("mybatis-config.xml"));  
     try (SqlSession sqlSession = sqlSessionFactory.openSession(true)){  
             //暂时还没有业务  
     }  
 }
```
直接运行即可，虽然没有干什么事情，但是不会出现错误，如果之前的配置文件编写错误，直接运行会产生报错！那么现在我们来看看，`SqlSessionFactory`对象是什么东西：
![img](https://s2.loli.net/2023/03/06/67AJEFCsKoin3Hd.jpg)
每个基于 MyBatis 的应用都是以一个 SqlSessionFactory 的实例为核心的，我们可以通过`SqlSessionFactory`来创建多个新的会话，`SqlSession`对象，每个会话就相当于我不同的地方登陆一个账号去访问数据库，你也可以认为这就是之前JDBC中的`Statement`对象，会话之间相互隔离，没有任何关联。
而通过`SqlSession`就可以完成几乎所有的数据库操作，我们发现这个接口中定义了大量数据库操作的方法，因此，现在我们只需要通过一个对象就能完成数据库交互了，极大简化了之前的流程。
我们来尝试一下直接读取实体类，读取实体类肯定需要一个映射规则，比如类中的哪个字段对应数据库中的哪个字段，在查询语句返回结果后，Mybatis就会自动将对应的结果填入到对象的对应字段上。首先编写实体类，，直接使用Lombok是不是就很方便了：
```java
 import lombok.Data;  
 ​  
 @Data  
 public class Student {  
     int sid;   //名称最好和数据库字段名称保持一致，不然可能会映射失败导致查询结果丢失  
     String name;  
     String sex;  
 }
```
在根目录下重新创建一个mapper文件夹，新建名为`TestMapper.xml`的文件作为我们的映射器，并填写以下内容：
```xml
 <?xml version="1.0" encoding="UTF-8" ?>  
 <!DOCTYPE mapper  
         PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"  
         "http://mybatis.org/dtd/mybatis-3-mapper.dtd">  
 <mapper namespace="TestMapper">  
     <select id="selectStudent" resultType="com.test.entity.Student">  
         select * from student  
     </select>  
 </mapper>
```
其中namespace就是命名空间，每个Mapper都是唯一的，因此需要用一个命名空间来区分，它还可以用来绑定一个接口。我们在里面写入了一个select标签，表示添加一个select操作，同时id作为操作的名称，resultType指定为我们刚刚定义的实体类，表示将数据库结果映射为`Student`类，然后就在标签中写入我们的查询语句即可。
编写好后，我们在配置文件中添加这个Mapper映射器：
```xml
 <mappers>  
     <mapper url="file:mappers/TestMapper.xml"/>  
     <!--    这里用的是url，也可以使用其他类型，我们会在后面讲解    -->  
 </mappers>
```
最后在程序中使用我们定义好的Mapper即可：
```java
 public static void main(String[] args) throws FileNotFoundException {  
     SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(new FileInputStream("mybatis-config.xml"));  
     try (SqlSession sqlSession = sqlSessionFactory.openSession(true)){  
         List<Student> student = sqlSession.selectList("selectStudent");  
         student.forEach(System.out::println);  
     }  
 }
```
我们会发现，Mybatis非常智能，我们只需要告诉一个映射关系，就能够直接将查询结果转化为一个实体类！
## 配置Mybatis
在了解了Mybatis为我们带来的便捷之后，现在我们就可以正式地去学习使用Mybatis了！
由于`SqlSessionFactory`一般只需要创建一次，因此我们可以创建一个工具类来集中创建`SqlSession`，这样会更加方便一些：
```java
 public class MybatisUtil {  
 ​  
     //在类加载时就进行创建  
     private static SqlSessionFactory sqlSessionFactory;  
     static {  
         try {  
             sqlSessionFactory = new SqlSessionFactoryBuilder().build(new FileInputStream("mybatis-config.xml"));  
         } catch (FileNotFoundException e) {  
             e.printStackTrace();  
         }  
     }  
 ​  
     /**  
      * 获取一个新的会话  
      * @param autoCommit 是否开启自动提交（跟JDBC是一样的，如果不自动提交，则会变成事务操作）  
      * @return SqlSession对象  
      */  
     public static SqlSession getSession(boolean autoCommit){  
         return sqlSessionFactory.openSession(autoCommit);  
     }  
 }
```
现在我们只需要在main方法中这样写即可查询结果了：
```java
 public static void main(String[] args) {  
     try (SqlSession sqlSession = MybatisUtil.getSession(true)){  
         List<Student> student = sqlSession.selectList("selectStudent");  
         student.forEach(System.out::println);  
     }  
 }
```
之前我们演示了，如何创建一个映射器来将结果快速转换为实体类，但是这样可能还是不够方便，我们每次都需要去找映射器对应操作的名称，而且还要知道对应的返回类型，再通过`SqlSession`来执行对应的方法，能不能再方便一点呢？
现在，我们可以通过`namespace`来绑定到一个接口上，利用接口的特性，我们可以直接指明方法的行为，而实际实现则是由Mybatis来完成。
```java
 public interface TestMapper {  
     List<Student> selectStudent();  
 }
```
将Mapper文件的命名空间修改为我们的接口，建议同时将其放到同名包中，作为内部资源：
```xml
 <mapper namespace="com.test.mapper.TestMapper">  
     <select id="selectStudent" resultType="com.test.entity.Student">  
         select * from student  
     </select>  
 </mapper>
```
作为内部资源后，我们需要修改一下配置文件中的mapper定义，不使用url而是resource表示是Jar内部的文件：
```xml
 <mappers>  
     <mapper resource="com/test/mapper/TestMapper.xml"/>  
 </mappers>
```
现在我们就可以直接通过`SqlSession`获取对应的实现类，通过接口中定义的行为来直接获取结果：
```java
 public static void main(String[] args) {  
     try (SqlSession sqlSession = MybatisUtil.getSession(true)){  
         TestMapper testMapper = sqlSession.getMapper(TestMapper.class);  
         List<Student> student = testMapper.selectStudent();  
         student.forEach(System.out::println);  
     }  
 }
```
那么肯定有人好奇，TestMapper明明是一个我们自己定义接口啊，Mybatis也不可能提前帮我们写了实现类啊，那这接口怎么就出现了一个实现类呢？我们可以通过调用`getClass()`方法来看看实现类是个什么：
```java
 TestMapper testMapper = sqlSession.getMapper(TestMapper.class);  
 System.out.println(testMapper.getClass());
```
我们发现，实现类名称很奇怪，名称为`com.sun.proxy.$Proxy4`，它是通过**动态代理**生成的，相当于动态生成了一个实现类，而不是预先定义好的，有关Mybatis这一部分的原理，我们放在最后一节进行讲解。
接下来，我们再来看配置文件，之前我们并没有对配置文件进行一个详细的介绍：
```xml
 <configuration>  
     <environments default="development">  
         <environment id="development">  
             <transactionManager type="JDBC"/>  
             <dataSource type="POOLED">  
                 <property name="driver" value="com.mysql.cj.jdbc.Driver"/>  
                 <property name="url" value="jdbc:mysql://localhost:3306/study"/>  
                 <property name="username" value="test"/>  
                 <property name="password" value="123456"/>  
             </dataSource>  
         </environment>  
     </environments>  
     <mappers>  
         <mapper resource="com/test/mapper/TestMapper.xml"/>  
     </mappers>  
 </configuration>
```
首先就从`environments`标签说起，一般情况下，我们在开发中，都需要指定一个数据库的配置信息，包含连接URL、用户、密码等信息，而`environment`就是用于进行这些配置的！实际情况下可能会不止有一个数据库连接信息，比如开发过程中我们一般会使用本地的数据库，而如果需要将项目上传到服务器或是防止其他人的电脑上运行时，我们可能就需要配置另一个数据库的信息，因此，我们可以提前定义好所有的数据库信息，该什么时候用什么即可！
在`environments`标签上有一个default属性，来指定默认的环境，当然如果我们希望使用其他环境，可以修改这个默认环境，也可以在创建工厂时选择环境：
```java
 sqlSessionFactory = new SqlSessionFactoryBuilder()  
         .build(new FileInputStream("mybatis-config.xml"), "环境ID");
```
我们还可以给类型起一个别名，以简化Mapper的编写：
```xml
 <!-- 需要在environments的上方 -->  
 <typeAliases>  
     <typeAlias type="com.test.entity.Student" alias="Student"/>  
 </typeAliases>
```
现在Mapper就可以直接使用别名了：
```xml
 <mapper namespace="com.test.mapper.TestMapper">  
     <select id="selectStudent" resultType="Student">  
         select * from student  
     </select>  
 </mapper>
```
> 如果这样还是很麻烦，我们也可以直接让Mybatis去扫描一个包，并将包下的所有类自动起别名（别名为首字母小写的类名）

```xml
 <typeAliases>  
     <package name="com.test.entity"/>  
 </typeAliases>
```
也可以为指定实体类添加一个注解，来指定别名：
```java
 @Data  
 @Alias("lbwnb")  
 public class Student {  
     private int sid;  
     private String name;  
     private String sex;  
 }
```
当然，Mybatis也包含许多的基础配置，通过使用：
```xml
 <settings>  
     <setting name="" value=""/>  
 </settings>
```
## 增删改查
在前面我们演示了如何快速进行查询，我们只需要编写一个对应的映射器既可以了：
```xml
 <mapper namespace="com.test.mapper.TestMapper">  
     <select id="studentList" resultType="Student">  
         select * from student  
     </select>  
 </mapper>
```
当然，如果你不喜欢使用实体类，那么这些属性还可以被映射到一个Map上：
```xml
 <select id="selectStudent" resultType="Map">  
     select * from student  
 </select>
```
```java
 public interface TestMapper {  
     List<Map> selectStudent();  
 }
```
Map中就会以键值对的形式来存放这些结果了。
通过设定一个`resultType`属性，让Mybatis知道查询结果需要映射为哪个实体类，要求字段名称保持一致。那么如果我们不希望按照这样的规则来映射呢？我们可以自定义`resultMap`来设定映射规则：
```xml
 <resultMap id="Test" type="Student">  
     <result column="sid" property="sid"/>  
     <result column="sex" property="name"/>  
     <result column="name" property="sex"/>  
 </resultMap>
```
通过指定映射规则，我们现在名称和性别一栏就发生了交换，因为我们将其映射字段进行了交换。
如果一个类中存在多个构造方法，那么很有可能会出现这样的错误：
```java
 ### Exception in thread "main" org.apache.ibatis.exceptions.PersistenceException:   
 ### Error querying database.  Cause: org.apache.ibatis.executor.ExecutorException: No constructor found in com.test.entity.Student matching [java.lang.Integer, java.lang.String, java.lang.String]  
 ### The error may exist in com/test/mapper/TestMapper.xml  
 ### The error may involve com.test.mapper.TestMapper.getStudentBySid  
 ### The error occurred while handling results  
 ### SQL: select * from student where sid = ?  
 ### Cause: org.apache.ibatis.executor.ExecutorException: No constructor found in com.test.entity.Student matching [java.lang.Integer, java.lang.String, java.lang.String]  
     at org.apache.ibatis.exceptions.ExceptionFactory.wrapException(ExceptionFactory.java:30)  
     ...
```
这时就需要使用`constructor`标签来指定构造方法：
```xml
 <resultMap id="test" type="Student">  
     <constructor>  
         <arg column="sid" javaType="Integer"/>  
         <arg column="name" javaType="String"/>  
     </constructor>  
 </resultMap>
```
值得注意的是，**指定构造方法后，若此字段被填入了构造方法作为参数，将不会通过反射给字段单独赋值，而构造方法中没有传入的字段，依然会被反射赋值**
如果数据库中存在一个带下划线的字段，我们可以通过设置让其映射为以驼峰命名的字段，比如`my_test`映射为`myTest`
```xml
 <settings>  
     <setting name="mapUnderscoreToCamelCase" value="true"/>  
 </settings>
```
如果不设置，默认为不开启，也就是默认需要名称保持一致。
我们接着来看看条件查询，既然是条件查询，那么肯定需要我们传入查询条件，比如现在我们想通过sid字段来通过学号查找信息：
 `Student getStudentBySid(int sid);`
```xml
 <select id="getStudentBySid" parameterType="int" resultType="Student">  
     select * from student where sid = #{sid}  
 </select>
```
我们通过使用`#{xxx}`或是`${xxx}`来填入我们给定的属性，实际上Mybatis本质也是通过`PreparedStatement`首先进行一次预编译，有效地防止SQL注入问题，但是如果使用`${xxx}`就不再是通过预编译，而是直接传值，因此我们一般都使用`#{xxx}`来进行操作。
使用`parameterType`属性来指定参数类型（非必须，可以不用，推荐不用）
接着我们来看插入、更新和删除操作，其实与查询操作差不多，不过需要使用对应的标签，比如插入操作：
```xml
 <insert id="addStudent" parameterType="Student">  
     insert into student(name, sex) values(#{name}, #{sex})  
 </insert>
```
 `int addStudent(Student student);`
我们这里使用的是一个实体类，我们可以直接使用实体类里面对应属性替换到SQL语句中，只需要填写属性名称即可，和条件查询是一样的。
## 复杂查询
一个老师可以教授多个学生，那么能否一次性将老师的学生全部映射给此老师的对象呢，比如：
```java
 @Data  
 public class Teacher {  
     int tid;  
     String name;  
     List<Student> studentList;  
 }
```
映射为Teacher对象时，同时将其教授的所有学生一并映射为List列表，显然这是一种一对多的查询，那么这时就需要进行复杂查询了。而我们之前编写的都非常简单，直接就能完成映射，因此我们现在需要使用`resultMap`来自定义映射规则：
```xml
 <select id="getTeacherByTid" resultMap="asTeacher">  
         select *, teacher.name as tname from student inner join teach on student.sid = teach.sid  
                               inner join teacher on teach.tid = teacher.tid where teach.tid = #{tid}  
 </select>  
 <resultMap id="asTeacher" type="Teacher">  
     <id column="tid" property="tid"/>  
     <result column="tname" property="name"/>  
     <collection property="studentList" ofType="Student">  
         <id property="sid" column="sid"/>  
         <result column="name" property="name"/>  
         <result column="sex" property="sex"/>  
     </collection>  
 </resultMap>
```
可以看到，我们的查询结果是一个多表联查的结果，而联查的数据就是我们需要映射的数据（比如这里是一个老师有N个学生，联查的结果也是这一个老师对应N个学生的N条记录），其中`id`标签用于在多条记录中辨别是否为同一个对象的数据，比如上面的查询语句得到的结果中，`tid`这一行始终为`1`，因此所有的记录都应该是`tid=1`的教师的数据，而不应该变为多个教师的数据，如果不加id进行约束，那么会被识别成多个教师的数据！
通过使用 `collection` 来表示将得到的所有结果合并为一个集合，比如上面的数据中每个学生都有单独的一条记录，因此tid相同的全部学生的记录就可以最后合并为一个List，得到最终的映射结果，当然，为了区分，最好也设置一个id，只不过这个例子中可以当做普通的`result`使用。
了解了一对多，那么多对一又该如何查询呢，比如每个学生都有一个对应的老师，现在Student新增了一个Teacher对象，那么现在又该如何去处理呢？
```java
 @Data  
 @Accessors(chain = true)  
 public class Student {  
     private int sid;  
     private String name;  
     private String sex;  
     private Teacher teacher;  
 }  
 ​  
 @Data  
 public class Teacher {  
     int tid;  
     String name;  
 }
```
现在我们希望的是，每次查询到一个Student对象时都带上它的老师，同样的，我们也可以使用`resultMap`来实现（先修改一下老师的类定义，不然会很麻烦）：
```xml
 <resultMap id="test2" type="Student">  
     <id column="sid" property="sid"/>  
     <result column="name" property="name"/>  
     <result column="sex" property="sex"/>  
     <association property="teacher" javaType="Teacher">  
         <id column="tid" property="tid"/>  
         <result column="tname" property="name"/>  
     </association>  
 </resultMap>  
 <select id="selectStudent" resultMap="test2">  
     select *, teacher.name as tname from student left join teach on student.sid = teach.sid  
                                                  left join teacher on teach.tid = teacher.tid  
 </select>
```
通过使用`association`进行关联，形成多对一的关系，实际上和一对多是同理的，都是对查询结果的一种处理方式罢了。
## 事务操作
我们可以在获取`SqlSession`关闭自动提交来开启事务模式，和JDBC其实都差不多：
```java
 public static void main(String[] args) {  
     try (SqlSession sqlSession = MybatisUtil.getSession(false)){  
         TestMapper testMapper = sqlSession.getMapper(TestMapper.class);  
 ​  
         testMapper.addStudent(new Student().setSex("男").setName("小王"));  
 ​  
         testMapper.selectStudent().forEach(System.out::println);  
     }  
 }
```
我们发现，在关闭自动提交后，我们的内容是没有进入到数据库的，现在我们来试一下在最后提交事务：
 `sqlSession.commit();`
在事务提交后，我们的内容才会被写入到数据库中。现在我们来试试看回滚操作：
```java
 try (SqlSession sqlSession = MybatisUtil.getSession(false)){  
     TestMapper testMapper = sqlSession.getMapper(TestMapper.class);  
 ​  
     testMapper.addStudent(new Student().setSex("男").setName("小王"));  
 ​  
     testMapper.selectStudent().forEach(System.out::println);  
     sqlSession.rollback();  
     sqlSession.commit();  
 }
```
回滚操作也印证成功。
## 动态SQL
动态 SQL 是 MyBatis 的强大特性之一。如果你使用过 JDBC 或其它类似的框架，你应该能理解根据不同条件拼接 SQL 语句有多痛苦，例如拼接时要确保不能忘记添加必要的空格，还要注意去掉列表最后一个列名的逗号。利用动态 SQL，可以彻底摆脱这种痛苦。
## 缓存机制
MyBatis 内置了一个强大的事务性查询缓存机制，它可以非常方便地配置和定制。
其实缓存机制我们在之前学习IO流的时候已经提及过了，我们可以提前将一部分内容放入缓存，下次需要获取数据时，我们就可以直接从缓存中读取，这样的话相当于直接从内存中获取而不是再去向数据库索要数据，效率会更高。
因此Mybatis内置了一个缓存机制，我们查询时，如果缓存中存在数据，那么我们就可以直接从缓存中获取，而不是再去向数据库进行请求。
![image-20230306163638882](https://s2.loli.net/2023/03/06/612LxT98tskrnCz.png)
Mybatis存在一级缓存和二级缓存，我们首先来看一下一级缓存，默认情况下，只启用了本地的会话缓存，它仅仅对一个会话中的数据进行缓存（一级缓存无法关闭，只能调整），我们来看看下面这段代码：
```java
 public static void main(String[] args) throws InterruptedException {  
     try (SqlSession sqlSession = MybatisUtil.getSession(true)){  
         TestMapper testMapper = sqlSession.getMapper(TestMapper.class);  
         Student student1 = testMapper.getStudentBySid(1);  
         Student student2 = testMapper.getStudentBySid(1);  
         System.out.println(student1 == student2);  
     }  
 }
```
我们发现，两次得到的是同一个Student对象，也就是说我们第二次查询并没有重新去构造对象，而是直接得到之前创建好的对象。如果还不是很明显，我们可以修改一下实体类：
```java
 @Data  
 @Accessors(chain = true)  
 public class Student {  
 ​  
     public Student(){  
         System.out.println("我被构造了");  
     }  
 ​  
     private int sid;  
     private String name;  
     private String sex;  
 }
```
我们通过前面的学习得知Mybatis在映射为对象时，在只有一个构造方法的情况下，无论你构造方法写成什么样子，都会去调用一次构造方法，如果存在多个构造方法，那么就会去找匹配的构造方法。我们可以通过查看构造方法来验证对象被创建了几次。
结果显而易见，**只创建了一次**，也就是说当第二次进行同样的查询时，会直接使用第一次的结果，因为**第一次的结果已经被缓存了**。
那么如果我修改了数据库中的内容，缓存还会生效吗：
```java
 public static void main(String[] args) throws InterruptedException {  
     try (SqlSession sqlSession = MybatisUtil.getSession(true)){  
         TestMapper testMapper = sqlSession.getMapper(TestMapper.class);  
         Student student1 = testMapper.getStudentBySid(1);  
         testMapper.addStudent(new Student().setName("小李").setSex("男"));  
         Student student2 = testMapper.getStudentBySid(1);  
         System.out.println(student1 == student2);  
     }  
 }
```
我们发现，当我们进行了插入操作后，缓存就没有生效了，我们再次进行查询得到的是一个新创建的对象。
也就是说，**一级缓存，在进行DML操作后，会使得缓存失效**，也就是说Mybatis知道我们对数据库里面的数据进行了修改，所以之前缓存的内容可能就不是当前数据库里面最新的内容了。还有一种情况就是，当前会话结束后，也会清理全部的缓存，因为已经不会再用到了。但是一定注意，**一级缓存只针对于单个会话，多个会话之间不相通**。
```java
 public static void main(String[] args) {  
     try (SqlSession sqlSession = MybatisUtil.getSession(true)){  
         TestMapper testMapper = sqlSession.getMapper(TestMapper.class);  
 ​  
         Student student2;  
         try(SqlSession sqlSession2 = MybatisUtil.getSession(true)){  
             TestMapper testMapper2 = sqlSession2.getMapper(TestMapper.class);  
             student2 = testMapper2.getStudentBySid(1);  
         }  
 ​  
         Student student1 = testMapper.getStudentBySid(1);  
         System.out.println(student1 == student2);  
     }  
 }
```
**注意：一个会话DML操作只会重置当前会话的缓存，不会重置其他会话的缓存，也就是说，其他会话缓存是不会更新的！
一级缓存给我们提供了很高速的访问效率，但是它的作用范围实在是有限，如果一个会话结束，那么之前的缓存就全部失效了，但是我们希望缓存能够扩展到所有会话都能使用，因此我们可以通过二级缓存来实现，二级缓存默认是关闭状态，要开启二级缓存，我们需要在映射器XML文件中添加：
 `<cache/>`
可见二级缓存是Mapper级别的，也就是说，当一个会话失效时，它的缓存依然会存在于二级缓存中，因此如果我们再次创建一个新的会话会直接使用之前的缓存，我们首先根据官方文档进行一些配置：
```xml
 <cache  
   eviction="FIFO"  
   flushInterval="60000"  
   size="512"  
   readOnly="true"/>
```
我们来编写一个代码：
```java
 public static void main(String[] args) {  
     Student student;  
     try (SqlSession sqlSession = MybatisUtil.getSession(true)){  
         TestMapper testMapper = sqlSession.getMapper(TestMapper.class);  
         student = testMapper.getStudentBySid(1);  
     }  
 ​  
     try (SqlSession sqlSession2 = MybatisUtil.getSession(true)){  
         TestMapper testMapper2 = sqlSession2.getMapper(TestMapper.class);  
         Student student2 = testMapper2.getStudentBySid(1);  
         System.out.println(student2 == student);  
     }  
 }
```
我们可以看到，上面的代码中首先是第一个会话在进行读操作，完成后会结束会话，而第二个操作重新创建了一个新的会话，再次执行了同样的查询，我们发现得到的依然是缓存的结果。
那么如果我不希望某个方法开启缓存呢？我们可以添加useCache属性来关闭缓存：
```xml
 <select id="getStudentBySid" resultType="Student" useCache="false">  
     select * from student where sid = #{sid}  
 </select>
```
我们也可以使用`flushCache="false"`在每次执行后都清空缓存，通过这这个我们还可以控制DML操作完成之后不清空缓存。
```xml
 <select id="getStudentBySid" resultType="Student" flushCache="true">  
     select * from student where sid = #{sid}  
 </select>
```
添加了二级缓存之后，**会先从二级缓存中查找数据**，当二级缓存中没有时，**才会从一级缓存中获取**，当一级缓存中都还没有数据时，才会请求数据库，因此我们再来执行上面的代码：
```java
 public static void main(String[] args) {  
     try (SqlSession sqlSession = MybatisUtil.getSession(true)){  
         TestMapper testMapper = sqlSession.getMapper(TestMapper.class);  
 ​  
         Student student2;  
         try(SqlSession sqlSession2 = MybatisUtil.getSession(true)){  
             TestMapper testMapper2 = sqlSession2.getMapper(TestMapper.class);  
             student2 = testMapper2.getStudentBySid(1);  
         }  
 ​  
         Student student1 = testMapper.getStudentBySid(1);  
         System.out.println(student1 == student2);  
     }  
 }
```
得到的结果就会是同一个对象了，因为现在是优先从二级缓存中获取。
读取顺序：**二级缓存 => 一级缓存 => 数据库**
![image-20230306163717033](https://s2.loli.net/2023/03/06/f2slhXr68k3WpIM.png)
虽然缓存机制给我们提供了很大的性能提升，但是缓存存在一个问题，我们之前在`计算机组成原理`中可能学习过缓存一致性问题，也就是说当多个CPU在操作自己的缓存时，可能会出现各自的缓存内容不同步的问题，而Mybatis也会这样，我们来看看这个例子：
```java
public static void main(String[] args) throws InterruptedException {  
    try (SqlSession sqlSession = MybatisUtil.getSession(true)){  
        TestMapper testMapper = sqlSession.getMapper(TestMapper.class);  
        while (true){  
            Thread.sleep(3000);  
            System.out.println(testMapper.getStudentBySid(1));  
        }  
    }  
}
```
我们现在循环地每三秒读取一次，而在这个过程中，我们使用IDEA手动修改数据库中的数据，将1号同学的学号改成100，那么理想情况下，下一次读取将无法获取到小明，因为小明的学号已经发生变化了。
但是结果却是依然能够读取，并且sid并没有发生改变，这也证明了Mybatis的缓存在生效，因为我们是从外部进行修改，Mybatis不知道我们修改了数据，所以依然在使用缓存中的数据，但是这样很明显是不正确的，因此，**如果存在多台服务器或者是多个程序都在使用Mybatis操作同一个数据库，并且都开启了缓存，需要解决这个问题，要么就得关闭Mybatis的缓存来保证一致性**：
```xml
 <settings>  
     <setting name="cacheEnabled" value="false"/>  
 </settings>
 <select id="getStudentBySid" resultType="Student" useCache="false" flushCache="true">  
     select * from student where sid = #{sid}  
 </select>
```
要么就需要实现缓存共用，也就是让所有的Mybatis都使用同一个缓存进行数据存取，在后面，我们会继续学习Redis、Ehcache、Memcache等缓存框架，通过使用这些工具，就能够很好地解决缓存一致性问题。
## 使用注解开发
在之前的开发中，我们已经体验到Mybatis为我们带来的便捷了，我们只需要编写对应的映射器，并将其绑定到一个接口上，即可直接通过该接口执行我们的SQL语句，极大的简化了我们之前JDBC那样的代码编写模式。那么，能否实现无需xml映射器配置，而是直接使用注解在接口上进行配置呢？答案是可以的，也是现在推荐的一种方式（也不是说XML就不要去用了，由于Java 注解的表达能力和灵活性十分有限，可能相对于XML配置某些功能实现起来会不太好办，但是在大部分场景下，直接使用注解开发已经绰绰有余了）
首先我们来看一下，使用XML进行映射器编写时，我们需要现在XML中定义映射规则和SQL语句，然后再将其绑定到一个接口的方法定义上，然后再使用接口来执行：
```xml
 <insert id="addStudent">  
     insert into student(name, sex) values(#{name}, #{sex})  
 </insert>
```
 `int addStudent(Student student);`
而现在，我们可以直接使用注解来实现，每个操作都有一个对应的注解：
```java
 @Insert("insert into student(name, sex) values(#{name}, #{sex})")  
 int addStudent(Student student);
```
当然，我们还需要修改一下配置文件中的映射器注册：
```xml
 <mappers>  
     <mapper class="com.test.mapper.MyMapper"/>  
     <!--  也可以直接注册整个包下的 <package name="com.test.mapper"/>  -->  
 </mappers>
```
通过直接指定Class，来让Mybatis知道我们这里有一个通过注解实现的映射器。
我们接着来看一下，如何使用注解进行自定义映射规则：
```java
 @Results({  
         @Result(id = true, column = "sid", property = "sid"),  
         @Result(column = "sex", property = "name"),  
         @Result(column = "name", property = "sex")  
 })  
```
```java
 @Select("select * from student")  
 List<Student> getAllStudent();
```
直接通过`@Results`注解，就可以直接进行配置了，此注解的value是一个`@Result`注解数组，每个`@Result`注解都是一个单独的字段配置，其实就是我们之前在XML映射器中写的：
```xml
 <resultMap id="test" type="Student">  
     <id property="sid" column="sid"/>  
     <result column="name" property="sex"/>      
     <result column="sex" property="name"/>  
 </resultMap>
```
现在我们就可以通过注解来自定义映射规则了。那么如何使用注解来完成复杂查询呢？我们还是使用一个老师多个学生的例子：
```java
 @Results({  
         @Result(id = true, column = "tid", property = "tid"),  
         @Result(column = "name", property = "name"),  
         @Result(column = "tid", property = "studentList", many =  
             @Many(select = "getStudentByTid")  
         )  
 })  
 @Select("select * from teacher where tid = #{tid}")  
 Teacher getTeacherBySid(int tid);  
 ​  
 @Select("select * from student inner join teach on student.sid = teach.sid where tid = #{tid}")  
 List<Student> getStudentByTid(int tid);
```
我们发现，多出了一个子查询，而这个子查询是单独查询该老师所属学生的信息，而子查询结果作为`@Result`注解的一个many结果，代表子查询的所有结果都归入此集合中（也就是之前的collection标签）
 <resultMap id="asTeacher" type="Teacher">  
     <id column="tid" property="tid"/>  
     <result column="tname" property="name"/>  
     <collection property="studentList" ofType="Student">  
         <id property="sid" column="sid"/>  
         <result column="name" property="name"/>  
         <result column="sex" property="sex"/>  
     </collection>  
 </resultMap>
同理，`@Result`也提供了`@One`子注解来实现一对一的关系表示，类似于之前的`assocation`标签：
```java
 @Results({  
         @Result(id = true, column = "sid", property = "sid"),  
         @Result(column = "sex", property = "name"),  
         @Result(column = "name", property = "sex"),  
         @Result(column = "sid", property = "teacher", one =  
             @One(select = "getTeacherBySid")  
         )  
 })  
 @Select("select * from student")  
 List<Student> getAllStudent();
```
如果现在我希望直接使用注解编写SQL语句但是我希望映射规则依然使用XML来实现，这时该怎么办呢？
```java
 @ResultMap("test")  
 @Select("select * from student")  
 List<Student> getAllStudent();
```
提供了`@ResultMap`注解，直接指定ID即可，这样我们就可以使用XML中编写的映射规则了，这里就不再演示了。
那么如果出现之前的两个构造方法的情况，且没有任何一个构造方法匹配的话，该怎么处理呢？
```java
 @Data  
 @Accessors(chain = true)  
 public class Student {  
 ​  
     public Student(int sid){  
         System.out.println("我是一号构造方法"+sid);  
     }  
 ​  
     public Student(int sid, String name){  
         System.out.println("我是二号构造方法"+sid+name);  
     }  
 ​  
     private int sid;  
     private String name;  
     private String sex;  
 }
```
我们可以通过`@ConstructorArgs`注解来指定构造方法：
```java
 @ConstructorArgs({  
         @Arg(column = "sid", javaType = int.class),  
         @Arg(column = "name", javaType = String.class)  
 })  
 @Select("select * from student where sid = #{sid} and sex = #{sex}")  
 Student getStudentBySidAndSex(@Param("sid") int sid, @Param("sex") String sex);
```
得到的结果和使用`constructor`标签效果一致，这里就不多做讲解了。
我们发现，当参数列表中出现两个以上的参数时，会出现错误：
```java
 @Select("select * from student where sid = #{sid} and sex = #{sex}")  
 Student getStudentBySidAndSex(int sid, String sex);
 Exception in thread "main" org.apache.ibatis.exceptions.PersistenceException:   
 ### Error querying database.  Cause: org.apache.ibatis.binding.BindingException: Parameter 'sid' not found. Available parameters are [arg1, arg0, param1, param2]  
 ### Cause: org.apache.ibatis.binding.BindingException: Parameter 'sid' not found. Available parameters are [arg1, arg0, param1, param2]  
     at org.apache.ibatis.exceptions.ExceptionFactory.wrapException(ExceptionFactory.java:30)  
     at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList(DefaultSqlSession.java:153)  
     at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList(DefaultSqlSession.java:145)  
     at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList(DefaultSqlSession.java:140)  
     at org.apache.ibatis.session.defaults.DefaultSqlSession.selectOne(DefaultSqlSession.java:76)  
     at org.apache.ibatis.binding.MapperMethod.execute(MapperMethod.java:87)  
     at org.apache.ibatis.binding.MapperProxy$PlainMethodInvoker.invoke(MapperProxy.java:145)  
     at org.apache.ibatis.binding.MapperProxy.invoke(MapperProxy.java:86)  
     at com.sun.proxy.$Proxy6.getStudentBySidAndSex(Unknown Source)  
     at com.test.Main.main(Main.java:16)
```
原因是Mybatis不明确到底哪个参数是什么，因此我们可以添加`@Param`来指定参数名称：
```java
 @Select("select * from student where sid = #{sid} and sex = #{sex}")  
 Student getStudentBySidAndSex(@Param("sid") int sid, @Param("sex") String sex);
```
**探究：要是我两个参数一个是基本类型一个是对象类型呢？
```java
 System.out.println(testMapper.addStudent(100, new Student().setName("小陆").setSex("男")));
 @Insert("insert into student(sid, name, sex) values(#{sid}, #{name}, #{sex})")  
 int addStudent(@Param("sid") int sid, @Param("student")  Student student);
```
那么这个时候，就出现问题了，Mybatis就不能明确这些属性是从哪里来的：
```java
 ### SQL: insert into student(sid, name, sex) values(?, ?, ?)  
 ### Cause: org.apache.ibatis.binding.BindingException: Parameter 'name' not found. Available parameters are [student, param1, sid, param2]  
     at org.apache.ibatis.exceptions.ExceptionFactory.wrapException(ExceptionFactory.java:30)  
     at org.apache.ibatis.session.defaults.DefaultSqlSession.update(DefaultSqlSession.java:196)  
     at org.apache.ibatis.session.defaults.DefaultSqlSession.insert(DefaultSqlSession.java:181)  
     at org.apache.ibatis.binding.MapperMethod.execute(MapperMethod.java:62)  
     at org.apache.ibatis.binding.MapperProxy$PlainMethodInvoker.invoke(MapperProxy.java:145)  
     at org.apache.ibatis.binding.MapperProxy.invoke(MapperProxy.java:86)  
     at com.sun.proxy.$Proxy6.addStudent(Unknown Source)  
     at com.test.Main.main(Main.java:16)
```
那么我们就通过参数名称.属性的方式去让Mybatis知道我们要用的是哪个属性：
```java
 @Insert("insert into student(sid, name, sex) values(#{sid}, #{student.name}, #{student.sex})")  
 int addStudent(@Param("sid") int sid, @Param("student")  Student student);
```
那么如何通过注解控制缓存机制呢？
```java
 @CacheNamespace(readWrite = false)  
 public interface MyMapper {  
 ​  
     @Select("select * from student")  
     @Options(useCache = false)  
     List<Student> getAllStudent();
```
使用`@CacheNamespace`注解直接定义在接口上即可，然后我们可以通过使用`@Options`来控制单个操作的缓存启用。

## 探究Mybatis的动态代理机制
在探究动态代理机制之前，我们要先聊聊什么是代理：其实顾名思义，就好比我开了个大棚，里面栽种的西瓜，那么西瓜成熟了是不是得去卖掉赚钱，而我们的西瓜非常多，一个人肯定卖不过来，肯定就要去多找几个开水果摊的帮我们卖，这就是一种代理。实际上是由水果摊老板在帮我们卖瓜，我们只告诉老板卖多少钱，而至于怎么卖的是由水果摊老板决定的。
![img](https://s2.loli.net/2023/03/06/f2slhXr68k3WpIM.png)
那么现在我们来尝试实现一下这样的类结构，首先定义一个接口用于规范行为：
```java
 public interface Shopper {  
 ​       //卖瓜行为  
     void saleWatermelon(String customer);  
 }
```
然后需要实现一下卖瓜行为，也就是我们要告诉老板卖多少钱，这里就直接写成成功出售：
```java
 public class ShopperImpl implements Shopper{  
 ​  
     //卖瓜行为的实现  
     @Override  
     public void saleWatermelon(String customer) {  
         System.out.println("成功出售西瓜给 ===> "+customer);  
     }  
 }
```
最后老板代理后肯定要用自己的方式去出售这些西瓜，成交之后再按照我们告诉老板的价格进行出售：
```java
 public class ShopperProxy implements Shopper{  
 ​  
     private final Shopper impl;  
 ​  
     public ShopperProxy(Shopper impl){  
         this.impl = impl;  
     }  
 ​  
     //代理卖瓜行为  
     @Override  
     public void saleWatermelon(String customer) {  
         //首先进行 代理商讨价还价行为  
         System.out.println(customer + "：哥们，这瓜多少钱一斤啊？");  
         System.out.println("老板：两块钱一斤。");  
         System.out.println(customer + "：你这瓜皮子是金子做的，还是瓜粒子是金子做的？");  
         System.out.println("老板：你瞅瞅现在哪有瓜啊，这都是大棚的瓜，你嫌贵我还嫌贵呢。");  
         System.out.println(customer + "：给我挑一个。");  
 ​  
         impl.saleWatermelon(customer);   //讨价还价成功，进行我们告诉代理商的卖瓜行为  
     }  
 }
```
现在我们来试试看：
```java
 public class Main {  
     public static void main(String[] args) {  
         Shopper shopper = new ShopperProxy(new ShopperImpl());  
         shopper.saleWatermelon("小强");  
     }  
 }
```
这样的操作称为**静态代理**，也就是说我们需要**提前知道接口的定义并进行实现**才可以完成代理，而Mybatis这样的是无法预知代理接口的，我们就需要用到动态代理。
JDK提供的反射框架就为我们很好地解决了动态代理的问题，在这里相当于对JavaSE阶段反射的内容进行一个补充。
```java
 public class ShopperProxy implements InvocationHandler {  
 ​  
     Object target;  
     public ShopperProxy(Object target){  
         this.target = target;  
     }  
 ​  
     @Override  
     public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {  
         String customer = (String) args[0];  
         System.out.println(customer + "：哥们，这瓜多少钱一斤啊？");  
         System.out.println("老板：两块钱一斤。");  
         System.out.println(customer + "：你这瓜皮子是金子做的，还是瓜粒子是金子做的？");  
         System.out.println("老板：你瞅瞅现在哪有瓜啊，这都是大棚的瓜，你嫌贵我还嫌贵呢。");  
         System.out.println(customer + "：行，给我挑一个。");  
         return method.invoke(target, args);  
     }  
 }
```
通过实现 `InvocationHandler` 来成为一个动态代理，我们发现它提供了一个invoke方法，用于调用被代理对象的方法并完成我们的代理工作。现在就可以通过`Proxy.newProxyInstance`来生成一个动态代理类：
```java
 public static void main(String[] args) {  
     Shopper impl = new ShopperImpl();  
     Shopper shopper = (Shopper) Proxy.newProxyInstance(impl.getClass().getClassLoader(),  
             impl.getClass().getInterfaces(), new ShopperProxy(impl));  
     shopper.saleWatermelon("小强");  
     System.out.println(shopper.getClass());  
 }
```
通过打印类型我们发现，就是我们之前看到的那种奇怪的类：`class com.sun.proxy.$Proxy0`，因此Mybatis其实也是这样的来实现的（肯定有人问了：Mybatis是直接代理接口啊，你这个不还是要把接口实现了吗？）那我们来改改，现在我们不代理任何类了，直接做接口实现：
```java
 public class ShopperProxy implements InvocationHandler {  
 ​  
     @Override  
     public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {  
         String customer = (String) args[0];  
         System.out.println(customer + "：哥们，这瓜多少钱一斤啊？");  
         System.out.println("老板：两块钱一斤。");  
         System.out.println(customer + "：你这瓜皮子是金子做的，还是瓜粒子是金子做的？");  
         System.out.println("老板：你瞅瞅现在哪有瓜啊，这都是大棚的瓜，你嫌贵我还嫌贵呢。");  
         System.out.println(customer + "：行，给我挑一个。");  
         return null;  
     }  
 }
 public static void main(String[] args) {  
     Shopper shopper = (Shopper) Proxy.newProxyInstance(Shopper.class.getClassLoader(),  
             new Class[]{ Shopper.class },   //因为本身就是接口，所以直接用就行  
             new ShopperProxy());  
     shopper.saleWatermelon("小强");  
     System.out.println(shopper.getClass());  
 }
```
可以去看看Mybatis的源码。
Mybatis的学习差不多就到这里为止了，不过，同样类型的框架还有很多，Mybatis属于半自动框架，SQL语句依然需要我们自己编写，虽然存在一定的麻烦，但是会更加灵活，而后面我们还会学习JPA，它是全自动的框架，你几乎见不到SQL的影子！

# Maven
Maven 翻译为"专家"、"内行"，是 Apache 下的一个纯 Java 开发的开源项目。基于项目对象模型（缩写：POM）概念，Maven利用一个中央信息片断能管理一个项目的构建、报告和文档等步骤。Maven 是一个项目管理工具，可以对 Java 项目进行构建、依赖管理。Maven 也可被用于构建和管理各种项目，例如 C#，Ruby，Scala 和其他语言编写的项目。Maven 曾是 Jakarta 项目的子项目，现为由 Apache 软件基金会主持的独立 Apache 项目。

通过Maven，可以帮助我们做：

* 项目的自动构建，包括代码的编译、测试、打包、安装、部署等操作。
* 依赖管理，项目使用到哪些依赖，可以快速完成导入。

我们之前并没有讲解如何将我们的项目打包为Jar文件运行，同时，我们导入依赖的时候，每次都要去下载对应的Jar包，这样其实是很麻烦的，并且还有可能一个Jar包依赖于另一个Jar包，就像之前使用JUnit一样，因此我们需要一个更加方便的包管理机制。

Maven也需要安装环境，但是IDEA已经自带了Maven环境，因此我们不需要再去进行额外的环境安装（无IDEA也能使用Maven，但是配置过程很麻烦，并且我们现在使用的都是IDEA的集成开发环境，所以这里就不讲解Maven命令行操作了）我们直接创建一个新的Maven项目即可。

## Maven项目结构

我们可以来看一下，一个Maven项目和我们普通的项目有什么区别：

![img](https://s2.loli.net/2023/03/06/tYh7BGvZHu6ncdf.jpg)

那么首先，我们需要了解一下POM文件，它相当于是我们整个Maven项目的配置文件，它也是使用XML编写的：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>MavenTest</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

</project>
```

我们可以看到，Maven的配置文件是以`project`为根节点，而`modelVersion`定义了当前模型的版本，一般是4.0.0，我们不用去修改。

`groupId`、`artifactId`、`version`这三个元素合在一起，用于唯一区别每个项目，别人如果需要将我们编写的代码作为依赖，那么就必须通过这三个元素来定位我们的项目，我们称为一个项目的基本坐标，所有的项目一般都有自己的Maven坐标，因此我们通过Maven导入其他的依赖只需要填写这三个基本元素就可以了，无需再下载Jar文件，而是Maven自动帮助我们下载依赖并导入。

* `groupId` 一般用于指定组名称，命名规则一般和包名一致，比如我们这里使用的是`org.example`，一个组下面可以有很多个项目。
* `artifactId` 一般用于指定项目在当前组中的唯一名称，也就是说在组中用于区分于其他项目的标记。
* `version` 代表项目版本，随着我们项目的开发和改进，版本号也会不断更新，就像LOL一样，每次赛季更新都会有一个大版本更新，我们的Maven项目也是这样，我们可以手动指定当前项目的版本号，其他人使用我们的项目作为依赖时，也可以根本版本号进行选择（这里的SNAPSHOT代表快照，一般表示这是一个处于开发中的项目，正式发布项目一般只带版本号）

`properties`中一般都是一些变量和选项的配置，我们这里指定了JDK的源代码和编译版本为1.8，无需进行修改。

## Maven依赖导入

现在我们尝试使用Maven来帮助我们快速导入依赖，我们需要导入之前的JDBC驱动依赖、JUnit依赖、Mybatis依赖、Lombok依赖，那么如何使用Maven来管理依赖呢？

我们可以创建一个`dependencies`节点：

```xml
<dependencies>
    //里面填写的就是所有的依赖
</dependencies>
```

那么现在就可以向节点中填写依赖了，那么我们如何知道每个依赖的坐标呢？我们可以在：[mavenrepository](https://mvnrepository.com/[Fetching Data#5mce](https://mvnrepository.com/)) 进行查询（可能打不开，建议用流量，或是直接百度某个项目的Maven依赖），我们直接搜索lombok即可，打开后可以看到已经给我们写出了依赖的坐标：

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.22</version>
    <scope>provided</scope>
</dependency>
```

我们直接将其添加到`dependencies`节点中即可，现在我们来编写一个测试用例看看依赖导入成功了没有：

```java
public class Main {
    public static void main(String[] args) {
        Student student = new Student("小明", 18);
        System.out.println(student);
    }
}
```

```java
@Data
@AllArgsConstructor
public class Student {
    String name;
    int age;
}
```

项目运行成功，表示成功导入了依赖。那么，Maven是如何进行依赖管理呢，以致于如此便捷的导入依赖，我们来看看Maven项目的依赖管理流程：

![img](https://s2.loli.net/2023/03/06/XYNMU5WCrZv9cwy.jpg)

通过流程图我们得知，一个项目依赖一般是存储在中央仓库中，也有可能存储在一些其他的远程仓库（私服），几乎所有的依赖都被放到了中央仓库中，因此，Maven可以直接从中央仓库中下载大部分的依赖（Maven第一次导入依赖是需要联网的），远程仓库中下载之后 ，会暂时存储在本地仓库，我们会发现我们本地存在一个`.m2`文件夹，这就是Maven本地仓库文件夹，默认建立在C盘，如果你C盘空间不足，会出现问题！

在下次导入依赖时，如果Maven发现本地仓库中就已经存在某个依赖，那么就不会再去远程仓库下载了。

可能在导入依赖时，小小伙伴们会出现卡顿的问题，我们建议配置一下IDEA自带的Maven插件远程仓库地址，我们打开IDEA的安装目录，找到`安装根目录/plugins/maven/lib/maven3/conf`文件夹，找到`settings.xml`文件，打开编辑：

找到mirros标签，添加以下内容：

```xml
<mirror>
      <id>nexus-aliyun</id>
      <mirrorOf>*</mirrorOf>
      <name>Nexus aliyun</name>
      <url>http://maven.aliyun.com/nexus/content/groups/public</url>
</mirror> 
```

这样，我们就将默认的远程仓库地址（国外），配置为国内的阿里云仓库地址了（依赖的下载速度就会快起来了）

## Maven依赖作用域

除了三个基本的属性用于定位坐标外，依赖还可以添加以下属性：

- **type**：依赖的类型，对于项目坐标定义的packaging。大部分情况下，该元素不必声明，其默认值为jar
- **scope**：**依赖的范围**（作用域，着重讲解）
- **optional**：标记依赖是否可选
- **exclusions**：用来排除传递性依赖（一个项目有可能依赖于其他项目，就像我们的项目，如果别人要用我们的项目作为依赖，那么就需要一起下载我们项目的依赖，如Lombok）

我们着重来讲解一下`scope`属性，它决定了依赖的作用域范围：

* **compile** ：为**默认的依赖有效范围**。如果在定义依赖关系的时候，没有明确指定依赖有效范围的话，则默认采用该依赖有效范围。此种依赖，在编译、运行、测试时均有效。
* **provided** ：在**编译、测试时有效**，但是在运行时无效，也就是说，项目在运行时，不需要此依赖，比如我们上面的Lombok，我们只需要在编译阶段使用它，编译完成后，实际上已经转换为对应的代码了，因此Lombok不需要在项目运行时也存在。
* **runtime** ：在**运行、测试时有效**，但是在编译代码时无效。比如我们如果需要自己写一个JDBC实现，那么肯定要用到JDK为我们指定的接口，但是实际上在运行时是不用自带JDK的依赖，因此只保留我们自己写的内容即可。
* **test** ：只**在测试时有效**，例如：JUnit，我们一般只会在测试阶段使用JUnit，而实际项目运行时，我们就用不到测试了，那么我们来看看，导入JUnit的依赖：

同样的，我们可以在网站上搜索Junit的依赖，我们这里导入最新的JUnit5作为依赖：

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.8.1</version>
    <scope>test</scope>
</dependency>
```

我们所有的测试用例全部编写到Maven项目给我们划分的test目录下，位于此目录下的内容不会在最后被打包到项目中，只用作开发阶段测试使用：

```java
public class MainTest {

    @Test
    public void test(){
        System.out.println("测试");
      	//Assert在JUnit5时名称发生了变化Assertions
        Assertions.assertArrayEquals(new int[]{1, 2, 3}, new int[]{1, 2});
    }
}
```

因此，一般仅用作测试的依赖如JUnit只保留在测试中即可，那么现在我们再来添加JDBC和Mybatis的依赖：

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.27</version>
</dependency>
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.7</version>
</dependency>
```

我们发现，Maven还给我们提供了一个`resource`文件夹，我们可以将一些静态资源，比如配置文件，放入到这个文件夹中，项目在打包时会将资源文件夹中文件一起打包的Jar中，比如我们在这里编写一个Mybatis的配置文件：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <settings>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
        <setting name="cacheEnabled" value="true"/>
        <setting name="logImpl" value="JDK_LOGGING" />
    </settings>
    <!-- 需要在environments的上方 -->
    <typeAliases>
        <package name="com.test.entity"/>
    </typeAliases>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/study"/>
                <property name="username" value="test"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <mapper class="com.test.mapper.TestMapper"/>
    </mappers>
</configuration>
```

现在我们创建一下测试用例，顺便带大家了解一下Junit5的一些比较方便的地方：

```java
public class MainTest {

    //因为配置文件位于内部，我们需要使用Resources类的getResourceAsStream来获取内部的资源文件
    private static SqlSessionFactory factory;

    //在JUnit5中@Before被废弃，它被细分了：
    @BeforeAll // 一次性开启所有测试案例只会执行一次 (方法必须是static)
    // @BeforeEach 一次性开启所有测试案例每个案例开始之前都会执行一次
    @SneakyThrows
    public static void before(){
        factory = new SqlSessionFactoryBuilder()
                .build(Resources.getResourceAsStream("mybatis.xml"));
    }


    @DisplayName("Mybatis数据库测试")  //自定义测试名称
    @RepeatedTest(3)  //自动执行多次测试
    public void test(){
        try (SqlSession sqlSession = factory.openSession(true)){
            TestMapper testMapper = sqlSession.getMapper(TestMapper.class);
            System.out.println(testMapper.getStudentBySid(1));
        }
    }
}
```

那么就有人提问了，如果我需要的依赖没有上传的远程仓库，而是只有一个Jar怎么办呢？我们可以使用第四种作用域：

* **system**：作用域和provided是一样的，但是它不是从远程仓库获取，而是直接导入本地Jar包：

```xml
<dependency>
     <groupId>javax.jntm</groupId>
     <artifactId>lbwnb</artifactId>
     <version>2.0</version>
     <scope>system</scope>
     <systemPath>C://学习资料/4K高清无码/test.jar</systemPath>
</dependency>
```

比如上面的例子，如果scope为system，那么我们需要添加一个systemPath来指定jar文件的位置，这里就不再演示了。

## Maven可选依赖

当项目中的某些依赖不希望被使用此项目作为依赖的项目使用时，我们可以给依赖添加`optional`标签表示此依赖是可选的，默认在导入依赖时，不会导入可选的依赖：

```xml
<optional>true</optional>
```

比如Mybatis的POM文件中，就存在大量的可选依赖：

```xml
<dependency>
  <groupId>org.slf4j</groupId>
  <artifactId>slf4j-api</artifactId>
  <version>1.7.30</version>
  <optional>true</optional>
</dependency>
<dependency>
  <groupId>org.slf4j</groupId>
  <artifactId>slf4j-log4j12</artifactId>
  <version>1.7.30</version>
  <optional>true</optional>
</dependency>
<dependency>
  <groupId>log4j</groupId>
  <artifactId>log4j</artifactId>
  <version>1.2.17</version>
  <optional>true</optional>
</dependency>
 ...
```

由于Mybatis要支持多种类型的日志，需要用到很多种不同的日志框架，因此需要导入这些依赖来做兼容，但是我们项目中并不一定会使用这些日志框架作为Mybatis的日志打印器，因此这些日志框架仅Mybatis内部做兼容需要导入使用，而我们可以选择不使用这些框架或是选择其中一个即可，也就是说我们导入Mybatis之后想用什么日志框架再自己加就可以了。

## Maven排除依赖

我们了解了可选依赖，现在我们可以让使用此项目作为依赖的项目默认不使用可选依赖，但是如果存在那种不是可选依赖，但是我们导入此项目又不希望使用此依赖该怎么办呢，这个时候我们就可以通过排除依赖来防止添加不必要的依赖：

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.8.1</version>
    <scope>test</scope>
    <exclusions>
        <exclusion>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

我们这里演示了排除JUnit的一些依赖，我们可以在外部库中观察排除依赖之后和之前的效果。

## Maven继承关系

一个Maven项目可以继承自另一个Maven项目，比如多个子项目都需要父项目的依赖，我们就可以使用继承关系来快速配置。

我们右键左侧栏，新建一个模块，来创建一个子项目：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>MavenTest</artifactId>
        <groupId>org.example</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>ChildModel</artifactId>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

</project>
```

我们可以看到，IDEA默认给我们添加了一个parent节点，表示此Maven项目是父Maven项目的子项目，子项目直接继承父项目的`groupId`，子项目会直接继承父项目的所有依赖，除非依赖添加了optional标签，我们来编写一个测试用例尝试一下:

```java
import lombok.extern.java.Log;

@Log
public class Main {
    public static void main(String[] args) {
        log.info("我是日志信息");
    }
}
```

可以看到，子项目也成功继承了Lombok依赖。

我们还可以让父Maven项目统一管理所有的依赖，包括版本号等，子项目可以选取需要的作为依赖，而版本全由父项目管理，我们可以将`dependencies`全部放入`dependencyManagement`节点，这样父项目就完全作为依赖统一管理。

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.22</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.8.1</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.27</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.7</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

我们发现，子项目的依赖失效了，因为现在父项目没有依赖，而是将所有的依赖进行集中管理，子项目需要什么再拿什么即可，同时子项目无需指定版本，所有的版本全部由父项目决定，子项目只需要使用即可：

```xml
<dependencies>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

当然，父项目如果还存在dependencies节点的话，里面的内依赖依然是直接继承：

```xml
<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.8.1</version>
        <scope>test</scope>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
      ...
```

## Maven常用命令

我们可以看到在IDEA右上角Maven板块中，每个Maven项目都有一个生命周期，实际上这些是Maven的一些插件，每个插件都有各自的功能，比如：

* `clean`命令，执行后会清理整个`target`文件夹，在之后编写Springboot项目时可以解决一些缓存没更新的问题。
* `validate`命令可以验证项目的可用性。
* `compile`命令可以将项目编译为.class文件。
* `install`命令可以将当前项目安装到本地仓库，以供其他项目导入作为依赖使用
* `verify`命令可以按顺序执行每个默认生命周期阶段（`validate`，`compile`，`package`等）

## Maven测试项目

通过使用`test`命令，可以一键测试所有位于test目录下的测试案例，请注意有以下要求：

* 测试类的名称必须是以`Test`结尾，比如`MainTest`
* 测试方法上必须标注`@Test`注解，实测`@RepeatedTest`无效

这是由于JUnit5比较新，我们需要重新配置插件升级到高版本，才能完美的兼容Junit5：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <!-- JUnit 5 requires Surefire version 2.22.0 or higher -->
            <version>2.22.0</version>
        </plugin>
    </plugins>
</build>
```

现在`@RepeatedTest`、`@BeforeAll`也能使用了。

## Maven打包项目

我们的项目在编写完成之后，要么作为Jar依赖，供其他模型使用，要么就作为一个可以执行的程序，在控制台运行，我们只需要直接执行`package`命令就可以直接对项目的代码进行打包，生成jar文件。

当然，以上方式仅适用于作为Jar依赖的情况，如果我们需要打包一个可执行文件，那么我不仅需要将自己编写的类打包到Jar中，同时还需要将依赖也一并打包到Jar中，因为我们使用了别人为我们提供的框架，自然也需要运行别人的代码，我们需要使用另一个插件来实现一起打包：

```xml
<plugin>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>3.1.0</version>
    <configuration>
        <descriptorRefs>
            <descriptorRef>jar-with-dependencies</descriptorRef>
        </descriptorRefs>
        <archive>
            <manifest>
                <addClasspath>true</addClasspath>
                <mainClass>com.test.Main</mainClass>
            </manifest>
        </archive>
    </configuration>
    <executions>
        <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals>
                <goal>single</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

在打包之前也会执行一次test命令，来保证项目能够正常运行，当测试出现问题时，打包将无法完成，我们也可以手动跳过，选择`执行Maven目标`来手动执行Maven命令，输入`mvn package -Dmaven.test.skip=true `来以跳过测试的方式进行打包。

最后得到我们的Jar文件，在同级目录下输入`java -jar xxxx.jar`来运行我们打包好的Jar可执行程序（xxx代表文件名称）

* `deploy`命令用于发布项目到本地仓库和远程仓库，一般情况下用不到，这里就不做讲解了。
* `site`命令用于生成当前项目的发布站点，暂时不需要了解。

我们之前还讲解了多模块项目，那么多模块下父项目存在一个`packing`打包类型标签，所有的父级项目的packing都为pom，packing默认是jar类型，如果不作配置，maven会将该项目打成jar包。作为父级项目，还有一个重要的属性，那就是modules，通过modules标签将项目的所有子项目引用进来，在build父级项目时，会根据子模块的相互依赖关系整理一个build顺序，然后依次build。

***

# Cookie

它可以在浏览器中保存一些信息，并且在下次请求时，请求头中会携带这些信息。

