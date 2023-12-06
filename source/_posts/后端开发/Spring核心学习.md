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
- **原子性**：一个事务（transaction）中的所有操作，要么全部完成，要么全部不完成，不会结束在中间某个环节。事务在执行过程中发生错误，会被回滚（Rollback）到事务开始前的状态，就像这个事务从来没有执行过一样。
- **一致性**：在事务开始之前和事务结束以后，数据库的完整性没有被破坏。这表示写入的资料必须完全符合所有的预设规则，这包含资料的精确度、串联性以及后续数据库可以自发性地完成预定的工作。
- **隔离性**：数据库允许多个并发事务同时对其数据进行读写和修改的能力，隔离性可以防止多个事务并发执行时由于交叉执行而导致数据的不一致。事务隔离分为不同级别，包括读未提交（Read uncommitted）、读提交（read committed）、可重复读（repeatable read）和串行化（Serializable）。
- **持久性**：事务处理结束后，对数据的修改就是永久的，即便系统故障也不会丢失。
我们通过以下例子来探究以下事务：
```java
 begin;   #开始事务  
 ...  
 rollback;  #回滚事务  
 savepoint 回滚点;  #添加回滚点  
 rollback to 回滚点; #回滚到指定回滚点  
 ...  
 commit; #提交事务  
  -- 一旦提交，就无法再进行回滚了！
```


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
HTML 主要用于通过编排来展示数据，而 XML 主要是存放数据，它更像是一个配置文件！
一个 XML 文件存在以下的格式规范：
- 必须存在一个**根节点**，将所有的子标签全部包含。
- 可以但不必须包含一个**头部声明**（主要是可以设定编码格式）
- 所有的**标签必须成对出现**，可以嵌套但不能交叉嵌套
- 区分大小写。
- 标签中**可以存在属性**，比如上面的 `type="1"` 就是 `inner` 标签的一个属性，属性的值由单引号或双引号包括。

XML 文件也可以使用注释：
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!-- 注释内容 -->
```
XML 的转义字符:
![](https://image.itbaima.net/markdown/2023/03/06/j5WEDVxYJ8KSkHt.jpg)
可以使用 `CD` 来快速创建不解析区域：
```xml
<test> <name><![CDATA[我看你<><><>是一点都不懂哦>>>]]></name> </test>
```
JDK 为我们内置了一个叫做 `org.w3c` 的 XML 解析库来进行 XML 文件内容解析：
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
当然，学习和使用 XML 只是为了更好地去认识 Mybatis 的工作原理，以及如何使用 XML 来作为 Mybatis 的配置文件，这是在开始之前必须要掌握的内容（需要知道 Mybatis 就是通过这种方式来读取配置文件的）
不仅仅是 Mybatis，包括后面的 Spring 等众多框架都会用到 XML 来作为框架的配置文件！
## 初次使用 Mybatis
那么我们首先来感受一下 Mybatis 给我们带来的便捷，就从搭建环境开始，中文文档网站：[https://mybatis.org/mybatis-3/zh/configuration.html](https://mybatis.org/mybatis-3/zh/configuration.html)
我们需要导入 Mybatis 的依赖，Jar 包需要在 github 上下载，同样地放入到项目的根目录下，右键作为依赖即可！（依赖变多之后，我们可以将其放到一个单独的文件夹，不然会很繁杂）
依赖导入完成后，我们就可以编写 Mybatis 的配置文件了（现在不是在 Java 代码中配置了，而是通过一个 XML 文件去配置，这样就使得硬编码的部分大大减少，项目后期打包成 Jar 运行不方便修复，但是通过配置文件，我们随时都可以去修改，就变得很方便了，同时代码量也大幅度减少，配置文件填写完成后，我们只需要关心项目的业务逻辑而不是如何去读取配置文件）我们按照官方文档给定的提示，在项目根目录下新建名为 `mybatis-config.xml` 的文件，并填写以下内容：
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
最上方还引入了一个叫做 DTD（文档类型定义）的东西，它提前帮助我们规定了一些标签，我们就需要使用 Mybatis 提前帮助我们规定好的标签来进行配置（因为只有这样 Mybatis 才能正确识别我们配置的内容）
通过进行配置，我们就告诉了 Mybatis 我们链接数据库的一些信息，包括 URL、用户名、密码等，这样 Mybatis 就知道该链接哪个数据库、使用哪个账号进行登陆了（也可以不使用配置文件）
配置文件完成后，我们需要在 Java 程序启动时，让 Mybatis 对配置文件进行读取并得到一个 `SqlSessionFactory` 对象：
```java
 public static void main(String[] args) throws FileNotFoundException {  
     SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(new FileInputStream("mybatis-config.xml"));  
     try (SqlSession sqlSession = sqlSessionFactory.openSession(true)){  
             //暂时还没有业务  
     }  
 }
```
直接运行即可，虽然没有干什么事情，但是不会出现错误，如果之前的配置文件编写错误，直接运行会产生报错！那么现在我们来看看，`SqlSessionFactory` 对象是什么东西：
![img](https://s2.loli.net/2023/03/06/67AJEFCsKoin3Hd.jpg)
每个基于 MyBatis 的应用都是以一个 SqlSessionFactory 的实例为核心的，我们可以通过 `SqlSessionFactory` 来创建多个新的会话，`SqlSession` 对象，每个会话就相当于我不同的地方登陆一个账号去访问数据库，你也可以认为这就是之前 JDBC 中的 `Statement` 对象，会话之间相互隔离，没有任何关联。
而通过 `SqlSession` 就可以完成几乎所有的数据库操作，我们发现这个接口中定义了大量数据库操作的方法，因此，现在我们只需要通过一个对象就能完成数据库交互了，极大简化了之前的流程。
我们来尝试一下直接读取实体类，读取实体类肯定需要一个映射规则，比如类中的哪个字段对应数据库中的哪个字段，在查询语句返回结果后，Mybatis 就会自动将对应的结果填入到对象的对应字段上。首先编写实体类，，直接使用 Lombok 是不是就很方便了：
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
在根目录下重新创建一个 mapper 文件夹，新建名为 `TestMapper.xml` 的文件作为我们的映射器，并填写以下内容：
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
其中 namespace 就是命名空间，每个 Mapper 都是唯一的，因此需要用一个命名空间来区分，它还可以用来绑定一个接口。我们在里面写入了一个 select 标签，表示添加一个 select 操作，同时 id 作为操作的名称，resultType 指定为我们刚刚定义的实体类，表示将数据库结果映射为 `Student` 类，然后就在标签中写入我们的查询语句即可。
编写好后，我们在配置文件中添加这个 Mapper 映射器：
```xml
 <mappers>  
     <mapper url="file:mappers/TestMapper.xml"/>  
     <!--    这里用的是url，也可以使用其他类型，我们会在后面讲解    -->  
 </mappers>
```
最后在程序中使用我们定义好的 Mapper 即可：
```java
 public static void main(String[] args) throws FileNotFoundException {  
     SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(new FileInputStream("mybatis-config.xml"));  
     try (SqlSession sqlSession = sqlSessionFactory.openSession(true)){  
         List<Student> student = sqlSession.selectList("selectStudent");  
         student.forEach(System.out::println);  
     }  
 }
```
我们会发现，Mybatis 非常智能，我们只需要告诉一个映射关系，就能够直接将查询结果转化为一个实体类！
## 配置 Mybatis
在了解了 Mybatis 为我们带来的便捷之后，现在我们就可以正式地去学习使用 Mybatis 了！
由于 `SqlSessionFactory` 一般只需要创建一次，因此我们可以创建一个工具类来集中创建 `SqlSession`，这样会更加方便一些：
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
现在我们只需要在 main 方法中这样写即可查询结果了：
```java
 public static void main(String[] args) {  
     try (SqlSession sqlSession = MybatisUtil.getSession(true)){  
         List<Student> student = sqlSession.selectList("selectStudent");  
         student.forEach(System.out::println);  
     }  
 }
```
之前我们演示了，如何创建一个映射器来将结果快速转换为实体类，但是这样可能还是不够方便，我们每次都需要去找映射器对应操作的名称，而且还要知道对应的返回类型，再通过 `SqlSession` 来执行对应的方法，能不能再方便一点呢？
现在，我们可以通过 `namespace` 来绑定到一个接口上，利用接口的特性，我们可以直接指明方法的行为，而实际实现则是由 Mybatis 来完成。
```java
 public interface TestMapper {  
     List<Student> selectStudent();  
 }
```
将 Mapper 文件的命名空间修改为我们的接口，建议同时将其放到同名包中，作为内部资源：
```xml
 <mapper namespace="com.test.mapper.TestMapper">  
     <select id="selectStudent" resultType="com.test.entity.Student">  
         select * from student  
     </select>  
 </mapper>
```
作为内部资源后，我们需要修改一下配置文件中的 mapper 定义，不使用 url 而是 resource 表示是 Jar 内部的文件：
```xml
 <mappers>  
     <mapper resource="com/test/mapper/TestMapper.xml"/>  
 </mappers>
```
现在我们就可以直接通过 `SqlSession` 获取对应的实现类，通过接口中定义的行为来直接获取结果：
```java
 public static void main(String[] args) {  
     try (SqlSession sqlSession = MybatisUtil.getSession(true)){  
         TestMapper testMapper = sqlSession.getMapper(TestMapper.class);  
         List<Student> student = testMapper.selectStudent();  
         student.forEach(System.out::println);  
     }  
 }
```
那么肯定有人好奇，TestMapper 明明是一个我们自己定义接口啊，Mybatis 也不可能提前帮我们写了实现类啊，那这接口怎么就出现了一个实现类呢？我们可以通过调用 `getClass()` 方法来看看实现类是个什么：
```java
 TestMapper testMapper = sqlSession.getMapper(TestMapper.class);  
 System.out.println(testMapper.getClass());
```
我们发现，实现类名称很奇怪，名称为 `com.sun.proxy.$Proxy4`，它是通过**动态代理**生成的，相当于动态生成了一个实现类，而不是预先定义好的，有关 Mybatis 这一部分的原理，我们放在最后一节进行讲解。
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
首先就从 `environments` 标签说起，一般情况下，我们在开发中，都需要指定一个数据库的配置信息，包含连接 URL、用户、密码等信息，而 `environment` 就是用于进行这些配置的！实际情况下可能会不止有一个数据库连接信息，比如开发过程中我们一般会使用本地的数据库，而如果需要将项目上传到服务器或是防止其他人的电脑上运行时，我们可能就需要配置另一个数据库的信息，因此，我们可以提前定义好所有的数据库信息，该什么时候用什么即可！
在 `environments` 标签上有一个 default 属性，来指定默认的环境，当然如果我们希望使用其他环境，可以修改这个默认环境，也可以在创建工厂时选择环境：
```java
 sqlSessionFactory = new SqlSessionFactoryBuilder ()  
         .build (new FileInputStream ("mybatis-config. xml"), "环境 ID");
```
我们还可以给类型起一个别名，以简化 Mapper 的编写：
```xml
 <!-- 需要在environments的上方 -->  
 <typeAliases>  
     <typeAlias type="com.test.entity.Student" alias="Student"/>  
 </typeAliases>
```
现在 Mapper 就可以直接使用别名了：
```xml
 <mapper namespace="com.test.mapper.TestMapper">  
     <select id="selectStudent" resultType="Student">  
         select * from student  
     </select>  
 </mapper>
```
> 如果这样还是很麻烦，我们也可以直接让 Mybatis 去扫描一个包，并将包下的所有类自动起别名（别名为首字母小写的类名）

```xml
 <typeAliases>  
     <package name="com.test.entity"/>  
 </typeAliases>
```
也可以为指定实体类添加一个注解，来指定别名：
```java
 @Data  
 @Alias ("lbwnb")  
 public class Student {  
     private int sid;  
     private String name;  
     private String sex;  
 }
```
当然，Mybatis 也包含许多的基础配置，通过使用：
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
当然，如果你不喜欢使用实体类，那么这些属性还可以被映射到一个 Map 上：
```xml
 <select id="selectStudent" resultType="Map">  
     select * from student  
 </select>
```
```java
 public interface TestMapper {  
     List<Map> selectStudent ();  
 }
```
Map 中就会以键值对的形式来存放这些结果了。
通过设定一个 `resultType` 属性，让 Mybatis 知道查询结果需要映射为哪个实体类，要求字段名称保持一致。那么如果我们不希望按照这样的规则来映射呢？我们可以自定义 `resultMap` 来设定映射规则：
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
 ### Exception in thread "main" org. apache. ibatis. exceptions. PersistenceException:   
 ### Error querying database.  Cause: org. apache. ibatis. executor. ExecutorException: No constructor found in com. test. entity. Student matching [java. lang. Integer, java. lang. String, java. lang. String]  
 ### The error may exist in com/test/mapper/TestMapper. xml  
 ### The error may involve com. test. mapper. TestMapper. getStudentBySid  
 ### The error occurred while handling results  
 ### SQL: select * from student where sid = ?  
 ### Cause: org. apache. ibatis. executor. ExecutorException: No constructor found in com. test. entity. Student matching [java. lang. Integer, java. lang. String, java. lang. String]  
     at org.apache.ibatis.exceptions.ExceptionFactory.wrapException (ExceptionFactory. java:30)  
     ...
```
这时就需要使用 `constructor` 标签来指定构造方法：
```xml
 <resultMap id="test" type="Student">  
     <constructor>  
         <arg column="sid" javaType="Integer"/>  
         <arg column="name" javaType="String"/>  
     </constructor>  
 </resultMap>
```
值得注意的是，**指定构造方法后，若此字段被填入了构造方法作为参数，将不会通过反射给字段单独赋值，而构造方法中没有传入的字段，依然会被反射赋值**
如果数据库中存在一个带下划线的字段，我们可以通过设置让其映射为以驼峰命名的字段，比如 `my_test` 映射为 `myTest`
```xml
 <settings>  
     <setting name="mapUnderscoreToCamelCase" value="true"/>  
 </settings>
```
如果不设置，默认为不开启，也就是默认需要名称保持一致。
我们接着来看看条件查询，既然是条件查询，那么肯定需要我们传入查询条件，比如现在我们想通过 sid 字段来通过学号查找信息：
 `Student getStudentBySid (int sid);`
```xml
 <select id="getStudentBySid" parameterType="int" resultType="Student">  
     select * from student where sid = #{sid}  
 </select>
```
我们通过使用 `#{xxx}` 或是 `${xxx}` 来填入我们给定的属性，实际上 Mybatis 本质也是通过 `PreparedStatement` 首先进行一次预编译，有效地防止 SQL 注入问题，但是如果使用 `${xxx}` 就不再是通过预编译，而是直接传值，因此我们一般都使用 `#{xxx}` 来进行操作。
使用 `parameterType` 属性来指定参数类型（非必须，可以不用，推荐不用）
接着我们来看插入、更新和删除操作，其实与查询操作差不多，不过需要使用对应的标签，比如插入操作：
```xml
 <insert id="addStudent" parameterType="Student">  
     insert into student (name, sex) values (#{name}, #{sex})  
 </insert>
```
 `int addStudent (Student student);`
我们这里使用的是一个实体类，我们可以直接使用实体类里面对应属性替换到 SQL 语句中，只需要填写属性名称即可，和条件查询是一样的。
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
映射为 Teacher 对象时，同时将其教授的所有学生一并映射为 List 列表，显然这是一种一对多的查询，那么这时就需要进行复杂查询了。而我们之前编写的都非常简单，直接就能完成映射，因此我们现在需要使用 `resultMap` 来自定义映射规则：
```xml
 <select id="getTeacherByTid" resultMap="asTeacher">  
         select *, teacher. name as tname from student inner join teach on student. sid = teach. sid  
                               inner join teacher on teach. tid = teacher. tid where teach. tid = #{tid}  
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
可以看到，我们的查询结果是一个多表联查的结果，而联查的数据就是我们需要映射的数据（比如这里是一个老师有 N 个学生，联查的结果也是这一个老师对应 N 个学生的 N 条记录），其中 `id` 标签用于在多条记录中辨别是否为同一个对象的数据，比如上面的查询语句得到的结果中，`tid` 这一行始终为 `1`，因此所有的记录都应该是 `tid=1` 的教师的数据，而不应该变为多个教师的数据，如果不加 id 进行约束，那么会被识别成多个教师的数据！
通过使用 `collection` 来表示将得到的所有结果合并为一个集合，比如上面的数据中每个学生都有单独的一条记录，因此 tid 相同的全部学生的记录就可以最后合并为一个 List，得到最终的映射结果，当然，为了区分，最好也设置一个 id，只不过这个例子中可以当做普通的 `result` 使用。
了解了一对多，那么多对一又该如何查询呢，比如每个学生都有一个对应的老师，现在 Student 新增了一个 Teacher 对象，那么现在又该如何去处理呢？
```java
 @Data  
 @Accessors (chain = true)  
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
现在我们希望的是，每次查询到一个 Student 对象时都带上它的老师，同样的，我们也可以使用 `resultMap` 来实现（先修改一下老师的类定义，不然会很麻烦）：
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
     select *, teacher. name as tname from student left join teach on student. sid = teach. sid  
                                                  left join teacher on teach. tid = teacher. tid  
 </select>
```
通过使用 `association` 进行关联，形成多对一的关系，实际上和一对多是同理的，都是对查询结果的一种处理方式罢了。
## 事务操作
我们可以在获取 `SqlSession` 关闭自动提交来开启事务模式，和 JDBC 其实都差不多：
```java
 public static void main (String[] args) {  
     try (SqlSession sqlSession = MybatisUtil.getSession (false)){  
         TestMapper testMapper = sqlSession.getMapper (TestMapper. class);  
 ​  
         testMapper.addStudent (new Student (). setSex ("男"). setName ("小王"));  
 ​  
         testMapper.selectStudent (). forEach (System. out::println);  
     }  
 }
```
我们发现，在关闭自动提交后，我们的内容是没有进入到数据库的，现在我们来试一下在最后提交事务：
 `sqlSession.commit ();`
在事务提交后，我们的内容才会被写入到数据库中。现在我们来试试看回滚操作：
```java
 try (SqlSession sqlSession = MybatisUtil.getSession (false)){  
     TestMapper testMapper = sqlSession.getMapper (TestMapper. class);  
 ​  
     testMapper.addStudent (new Student (). setSex ("男"). setName ("小王"));  
 ​  
     testMapper.selectStudent (). forEach (System. out::println);  
     sqlSession.rollback ();  
     sqlSession.commit ();  
 }
```
回滚操作也印证成功。
## 动态 SQL
动态 SQL 是 MyBatis 的强大特性之一。如果你使用过 JDBC 或其它类似的框架，你应该能理解根据不同条件拼接 SQL 语句有多痛苦，例如拼接时要确保不能忘记添加必要的空格，还要注意去掉列表最后一个列名的逗号。利用动态 SQL，可以彻底摆脱这种痛苦。
## 缓存机制
MyBatis 内置了一个强大的事务性查询缓存机制，它可以非常方便地配置和定制。
其实缓存机制我们在之前学习 IO 流的时候已经提及过了，我们可以提前将一部分内容放入缓存，下次需要获取数据时，我们就可以直接从缓存中读取，这样的话相当于直接从内存中获取而不是再去向数据库索要数据，效率会更高。
因此 Mybatis 内置了一个缓存机制，我们查询时，如果缓存中存在数据，那么我们就可以直接从缓存中获取，而不是再去向数据库进行请求。
![image-20230306163638882](https://s2.loli.net/2023/03/06/612LxT98tskrnCz.png)
Mybatis 存在一级缓存和二级缓存，我们首先来看一下一级缓存，默认情况下，只启用了本地的会话缓存，它仅仅对一个会话中的数据进行缓存（一级缓存无法关闭，只能调整），我们来看看下面这段代码：
```java
 public static void main (String[] args) throws InterruptedException {  
     try (SqlSession sqlSession = MybatisUtil.getSession (true)){  
         TestMapper testMapper = sqlSession.getMapper (TestMapper. class);  
         Student student 1 = testMapper.getStudentBySid (1);  
         Student student 2 = testMapper.getStudentBySid (1);  
         System.out.println (student 1 == student 2);  
     }  
 }
```
我们发现，两次得到的是同一个 Student 对象，也就是说我们第二次查询并没有重新去构造对象，而是直接得到之前创建好的对象。如果还不是很明显，我们可以修改一下实体类：
```java
 @Data  
 @Accessors (chain = true)  
 public class Student {  
 ​  
     public Student (){  
         System.out.println ("我被构造了");  
     }  
 ​  
     private int sid;  
     private String name;  
     private String sex;  
 }
```
我们通过前面的学习得知 Mybatis 在映射为对象时，在只有一个构造方法的情况下，无论你构造方法写成什么样子，都会去调用一次构造方法，如果存在多个构造方法，那么就会去找匹配的构造方法。我们可以通过查看构造方法来验证对象被创建了几次。
结果显而易见，**只创建了一次**，也就是说当第二次进行同样的查询时，会直接使用第一次的结果，因为**第一次的结果已经被缓存了**。
那么如果我修改了数据库中的内容，缓存还会生效吗：
```java
 public static void main (String[] args) throws InterruptedException {  
     try (SqlSession sqlSession = MybatisUtil.getSession (true)){  
         TestMapper testMapper = sqlSession.getMapper (TestMapper. class);  
         Student student 1 = testMapper.getStudentBySid (1);  
         testMapper.addStudent (new Student (). setName ("小李"). setSex ("男"));  
         Student student 2 = testMapper.getStudentBySid (1);  
         System.out.println (student 1 == student 2);  
     }  
 }
```
我们发现，当我们进行了插入操作后，缓存就没有生效了，我们再次进行查询得到的是一个新创建的对象。
也就是说，**一级缓存，在进行 DML 操作后，会使得缓存失效**，也就是说 Mybatis 知道我们对数据库里面的数据进行了修改，所以之前缓存的内容可能就不是当前数据库里面最新的内容了。还有一种情况就是，当前会话结束后，也会清理全部的缓存，因为已经不会再用到了。但是一定注意，**一级缓存只针对于单个会话，多个会话之间不相通**。
```java
 public static void main (String[] args) {  
     try (SqlSession sqlSession = MybatisUtil.getSession (true)){  
         TestMapper testMapper = sqlSession.getMapper (TestMapper. class);  
 ​  
         Student student 2;  
         try (SqlSession sqlSession 2 = MybatisUtil.getSession (true)){  
             TestMapper testMapper 2 = sqlSession 2.getMapper (TestMapper. class);  
             student 2 = testMapper 2.getStudentBySid (1);  
         }  
 ​  
         Student student 1 = testMapper.getStudentBySid (1);  
         System.out.println (student 1 == student 2);  
     }  
 }
```
**注意：一个会话 DML 操作只会重置当前会话的缓存，不会重置其他会话的缓存，也就是说，其他会话缓存是不会更新的！
一级缓存给我们提供了很高速的访问效率，但是它的作用范围实在是有限，如果一个会话结束，那么之前的缓存就全部失效了，但是我们希望缓存能够扩展到所有会话都能使用，因此我们可以通过二级缓存来实现，二级缓存默认是关闭状态，要开启二级缓存，我们需要在映射器 XML 文件中添加：
 `<cache/>`
可见二级缓存是 Mapper 级别的，也就是说，当一个会话失效时，它的缓存依然会存在于二级缓存中，因此如果我们再次创建一个新的会话会直接使用之前的缓存，我们首先根据官方文档进行一些配置：
```xml
 <cache  
   eviction="FIFO"  
   flushInterval="60000"  
   size="512"  
   readOnly="true"/>
```
我们来编写一个代码：
```java
 public static void main (String[] args) {  
     Student student;  
     try (SqlSession sqlSession = MybatisUtil.getSession (true)){  
         TestMapper testMapper = sqlSession.getMapper (TestMapper. class);  
         student = testMapper.getStudentBySid (1);  
     }  
 ​  
     try (SqlSession sqlSession 2 = MybatisUtil.getSession (true)){  
         TestMapper testMapper 2 = sqlSession 2.getMapper (TestMapper. class);  
         Student student 2 = testMapper 2.getStudentBySid (1);  
         System.out.println (student 2 == student);  
     }  
 }
```
我们可以看到，上面的代码中首先是第一个会话在进行读操作，完成后会结束会话，而第二个操作重新创建了一个新的会话，再次执行了同样的查询，我们发现得到的依然是缓存的结果。
那么如果我不希望某个方法开启缓存呢？我们可以添加 useCache 属性来关闭缓存：
```xml
 <select id="getStudentBySid" resultType="Student" useCache="false">  
     select * from student where sid = #{sid}  
 </select>
```
我们也可以使用 `flushCache="false"` 在每次执行后都清空缓存，通过这这个我们还可以控制 DML 操作完成之后不清空缓存。
```xml
 <select id="getStudentBySid" resultType="Student" flushCache="true">  
     select * from student where sid = #{sid}  
 </select>
```
添加了二级缓存之后，**会先从二级缓存中查找数据**，当二级缓存中没有时，**才会从一级缓存中获取**，当一级缓存中都还没有数据时，才会请求数据库，因此我们再来执行上面的代码：
```java
 public static void main (String[] args) {  
     try (SqlSession sqlSession = MybatisUtil.getSession (true)){  
         TestMapper testMapper = sqlSession.getMapper (TestMapper. class);  
 ​  
         Student student 2;  
         try (SqlSession sqlSession 2 = MybatisUtil.getSession (true)){  
             TestMapper testMapper 2 = sqlSession 2.getMapper (TestMapper. class);  
             student 2 = testMapper 2.getStudentBySid (1);  
         }  
 ​  
         Student student 1 = testMapper.getStudentBySid (1);  
         System.out.println (student 1 == student 2);  
     }  
 }
```
得到的结果就会是同一个对象了，因为现在是优先从二级缓存中获取。
读取顺序：**二级缓存 => 一级缓存 => 数据库**
![image-20230306163717033](https://s2.loli.net/2023/03/06/f2slhXr68k3WpIM.png)
虽然缓存机制给我们提供了很大的性能提升，但是缓存存在一个问题，我们之前在 `计算机组成原理` 中可能学习过缓存一致性问题，也就是说当多个 CPU 在操作自己的缓存时，可能会出现各自的缓存内容不同步的问题，而 Mybatis 也会这样，我们来看看这个例子：
```java
public static void main (String[] args) throws InterruptedException {  
    try (SqlSession sqlSession = MybatisUtil.getSession (true)){  
        TestMapper testMapper = sqlSession.getMapper (TestMapper. class);  
        while (true){  
            Thread.sleep (3000);  
            System.out.println (testMapper.getStudentBySid (1));  
        }  
    }  
}
```
我们现在循环地每三秒读取一次，而在这个过程中，我们使用 IDEA 手动修改数据库中的数据，将 1 号同学的学号改成 100，那么理想情况下，下一次读取将无法获取到小明，因为小明的学号已经发生变化了。
但是结果却是依然能够读取，并且 sid 并没有发生改变，这也证明了 Mybatis 的缓存在生效，因为我们是从外部进行修改，Mybatis 不知道我们修改了数据，所以依然在使用缓存中的数据，但是这样很明显是不正确的，因此，**如果存在多台服务器或者是多个程序都在使用 Mybatis 操作同一个数据库，并且都开启了缓存，需要解决这个问题，要么就得关闭 Mybatis 的缓存来保证一致性**：
```xml
 <settings>  
     <setting name="cacheEnabled" value="false"/>  
 </settings>
 <select id="getStudentBySid" resultType="Student" useCache="false" flushCache="true">  
     select * from student where sid = #{sid}  
 </select>
```
要么就需要实现缓存共用，也就是让所有的 Mybatis 都使用同一个缓存进行数据存取，在后面，我们会继续学习 Redis、Ehcache、Memcache 等缓存框架，通过使用这些工具，就能够很好地解决缓存一致性问题。
## 使用注解开发
在之前的开发中，我们已经体验到 Mybatis 为我们带来的便捷了，我们只需要编写对应的映射器，并将其绑定到一个接口上，即可直接通过该接口执行我们的 SQL 语句，极大的简化了我们之前 JDBC 那样的代码编写模式。那么，能否实现无需 xml 映射器配置，而是直接使用注解在接口上进行配置呢？答案是可以的，也是现在推荐的一种方式（也不是说 XML 就不要去用了，由于 Java 注解的表达能力和灵活性十分有限，可能相对于 XML 配置某些功能实现起来会不太好办，但是在大部分场景下，直接使用注解开发已经绰绰有余了）
首先我们来看一下，使用 XML 进行映射器编写时，我们需要现在 XML 中定义映射规则和 SQL 语句，然后再将其绑定到一个接口的方法定义上，然后再使用接口来执行：
```xml
 <insert id="addStudent">  
     insert into student (name, sex) values (#{name}, #{sex})  
 </insert>
```
 `int addStudent (Student student);`
而现在，我们可以直接使用注解来实现，每个操作都有一个对应的注解：
```java
 @Insert ("insert into student (name, sex) values (#{name}, #{sex})")  
 int addStudent (Student student);
```
当然，我们还需要修改一下配置文件中的映射器注册：
```xml
 <mappers>  
     <mapper class="com.test.mapper.MyMapper"/>  
     <!--  也可以直接注册整个包下的 <package name="com.test.mapper"/>  -->  
 </mappers>
```
通过直接指定 Class，来让 Mybatis 知道我们这里有一个通过注解实现的映射器。
我们接着来看一下，如何使用注解进行自定义映射规则：
```java
 @Results ({  
         @Result (id = true, column = "sid", property = "sid"),  
         @Result (column = "sex", property = "name"),  
         @Result (column = "name", property = "sex")  
 })  
```
```java
 @Select ("select * from student")  
 List<Student> getAllStudent ();
```
直接通过 `@Results` 注解，就可以直接进行配置了，此注解的 value 是一个 `@Result` 注解数组，每个 `@Result` 注解都是一个单独的字段配置，其实就是我们之前在 XML 映射器中写的：
```xml
 <resultMap id="test" type="Student">  
     <id property="sid" column="sid"/>  
     <result column="name" property="sex"/>      
     <result column="sex" property="name"/>  
 </resultMap>
```
现在我们就可以通过注解来自定义映射规则了。那么如何使用注解来完成复杂查询呢？我们还是使用一个老师多个学生的例子：
```java
 @Results ({  
         @Result (id = true, column = "tid", property = "tid"),  
         @Result (column = "name", property = "name"),  
         @Result (column = "tid", property = "studentList", many =  
             @Many (select = "getStudentByTid")  
         )  
 })  
 @Select ("select * from teacher where tid = #{tid}")  
 Teacher getTeacherBySid (int tid);  
 ​  
 @Select ("select * from student inner join teach on student. sid = teach. sid where tid = #{tid}")  
 List<Student> getStudentByTid (int tid);
```
我们发现，多出了一个子查询，而这个子查询是单独查询该老师所属学生的信息，而子查询结果作为 `@Result` 注解的一个 many 结果，代表子查询的所有结果都归入此集合中（也就是之前的 collection 标签）
 <resultMap id="asTeacher" type="Teacher">  
     <id column="tid" property="tid"/>  
     <result column="tname" property="name"/>  
     <collection property="studentList" ofType="Student">  
         <id property="sid" column="sid"/>  
         <result column="name" property="name"/>  
         <result column="sex" property="sex"/>  
     </collection>  
 </resultMap>
同理，`@Result` 也提供了 `@One` 子注解来实现一对一的关系表示，类似于之前的 `assocation` 标签：
```java
 @Results ({  
         @Result (id = true, column = "sid", property = "sid"),  
         @Result (column = "sex", property = "name"),  
         @Result (column = "name", property = "sex"),  
         @Result (column = "sid", property = "teacher", one =  
             @One (select = "getTeacherBySid")  
         )  
 })  
 @Select ("select * from student")  
 List<Student> getAllStudent ();
```
如果现在我希望直接使用注解编写 SQL 语句但是我希望映射规则依然使用 XML 来实现，这时该怎么办呢？
```java
 @ResultMap ("test")  
 @Select ("select * from student")  
 List<Student> getAllStudent ();
```
提供了 `@ResultMap` 注解，直接指定 ID 即可，这样我们就可以使用 XML 中编写的映射规则了，这里就不再演示了。
那么如果出现之前的两个构造方法的情况，且没有任何一个构造方法匹配的话，该怎么处理呢？
```java
 @Data  
 @Accessors (chain = true)  
 public class Student {  
 ​  
     public Student (int sid){  
         System.out.println ("我是一号构造方法"+sid);  
     }  
 ​  
     public Student (int sid, String name){  
         System.out.println ("我是二号构造方法"+sid+name);  
     }  
 ​  
     private int sid;  
     private String name;  
     private String sex;  
 }
```
我们可以通过 `@ConstructorArgs` 注解来指定构造方法：
```java
 @ConstructorArgs ({  
         @Arg (column = "sid", javaType = int. class),  
         @Arg (column = "name", javaType = String. class)  
 })  
 @Select ("select * from student where sid = #{sid} and sex = #{sex}")  
 Student getStudentBySidAndSex (@Param ("sid") int sid, @Param ("sex") String sex);
```
得到的结果和使用 `constructor` 标签效果一致，这里就不多做讲解了。
我们发现，当参数列表中出现两个以上的参数时，会出现错误：
```java
 @Select ("select * from student where sid = #{sid} and sex = #{sex}")  
 Student getStudentBySidAndSex (int sid, String sex);
 Exception in thread "main" org. apache. ibatis. exceptions. PersistenceException:   
 ### Error querying database.  Cause: org. apache. ibatis. binding. BindingException: Parameter 'sid' not found. Available parameters are [arg 1, arg 0, param 1, param 2]  
 ### Cause: org. apache. ibatis. binding. BindingException: Parameter 'sid' not found. Available parameters are [arg 1, arg 0, param 1, param 2]  
     at org.apache.ibatis.exceptions.ExceptionFactory.wrapException (ExceptionFactory. java:30)  
     at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList (DefaultSqlSession. java:153)  
     at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList (DefaultSqlSession. java:145)  
     at org.apache.ibatis.session.defaults.DefaultSqlSession.selectList (DefaultSqlSession. java:140)  
     at org.apache.ibatis.session.defaults.DefaultSqlSession.selectOne (DefaultSqlSession. java:76)  
     at org.apache.ibatis.binding.MapperMethod.execute (MapperMethod. java:87)  
     at org. apache. ibatis. binding. MapperProxy$PlainMethodInvoker.invoke (MapperProxy. java:145)  
     at org.apache.ibatis.binding.MapperProxy.invoke (MapperProxy. java:86)  
     at com. sun. proxy.$Proxy 6.getStudentBySidAndSex (Unknown Source)  
     at com.test.Main.main (Main. java:16)
```
原因是 Mybatis 不明确到底哪个参数是什么，因此我们可以添加 `@Param` 来指定参数名称：
```java
 @Select ("select * from student where sid = #{sid} and sex = #{sex}")  
 Student getStudentBySidAndSex (@Param ("sid") int sid, @Param ("sex") String sex);
```
**探究：要是我两个参数一个是基本类型一个是对象类型呢？
```java
 System.out.println (testMapper.addStudent (100, new Student (). setName ("小陆"). setSex ("男")));
 @Insert ("insert into student (sid, name, sex) values (#{sid}, #{name}, #{sex})")  
 int addStudent (@Param ("sid") int sid, @Param ("student")  Student student);
```
那么这个时候，就出现问题了，Mybatis 就不能明确这些属性是从哪里来的：
```java
 ### SQL: insert into student (sid, name, sex) values (?, ?, ?)  
 ### Cause: org. apache. ibatis. binding. BindingException: Parameter 'name' not found. Available parameters are [student, param 1, sid, param 2]  
     at org.apache.ibatis.exceptions.ExceptionFactory.wrapException (ExceptionFactory. java:30)  
     at org.apache.ibatis.session.defaults.DefaultSqlSession.update (DefaultSqlSession. java:196)  
     at org.apache.ibatis.session.defaults.DefaultSqlSession.insert (DefaultSqlSession. java:181)  
     at org.apache.ibatis.binding.MapperMethod.execute (MapperMethod. java:62)  
     at org. apache. ibatis. binding. MapperProxy$PlainMethodInvoker.invoke (MapperProxy. java:145)  
     at org.apache.ibatis.binding.MapperProxy.invoke (MapperProxy. java:86)  
     at com. sun. proxy.$Proxy 6.addStudent (Unknown Source)  
     at com.test.Main.main (Main. java:16)
```
那么我们就通过参数名称. 属性的方式去让 Mybatis 知道我们要用的是哪个属性：
```java
 @Insert ("insert into student (sid, name, sex) values (#{sid}, #{student. name}, #{student. sex})")  
 int addStudent (@Param ("sid") int sid, @Param ("student")  Student student);
```
那么如何通过注解控制缓存机制呢？
```java
 @CacheNamespace (readWrite = false)  
 public interface MyMapper {  
 ​  
     @Select ("select * from student")  
     @Options (useCache = false)  
     List<Student> getAllStudent ();
```
使用 `@CacheNamespace` 注解直接定义在接口上即可，然后我们可以通过使用 `@Options` 来控制单个操作的缓存启用。
## 探究 Mybatis 的动态代理机制
在探究动态代理机制之前，我们要先聊聊什么是代理：其实顾名思义，就好比我开了个大棚，里面栽种的西瓜，那么西瓜成熟了是不是得去卖掉赚钱，而我们的西瓜非常多，一个人肯定卖不过来，肯定就要去多找几个开水果摊的帮我们卖，这就是一种代理。实际上是由水果摊老板在帮我们卖瓜，我们只告诉老板卖多少钱，而至于怎么卖的是由水果摊老板决定的。
![img](https://s2.loli.net/2023/03/06/f2slhXr68k3WpIM.png)
那么现在我们来尝试实现一下这样的类结构，首先定义一个接口用于规范行为：
```java
 public interface Shopper {  
 ​       //卖瓜行为  
     void saleWatermelon (String customer);  
 }
```
然后需要实现一下卖瓜行为，也就是我们要告诉老板卖多少钱，这里就直接写成成功出售：
```java
 public class ShopperImpl implements Shopper{  
 ​  
     //卖瓜行为的实现  
     @Override  
     public void saleWatermelon (String customer) {  
         System.out.println ("成功出售西瓜给 ===> "+customer);  
     }  
 }
```
最后老板代理后肯定要用自己的方式去出售这些西瓜，成交之后再按照我们告诉老板的价格进行出售：
```java
 public class ShopperProxy implements Shopper{  
 ​  
     private final Shopper impl;  
 ​  
     public ShopperProxy (Shopper impl){  
         this. impl = impl;  
     }  
 ​  
     //代理卖瓜行为  
     @Override  
     public void saleWatermelon (String customer) {  
         //首先进行代理商讨价还价行为  
         System.out.println (customer + "：哥们，这瓜多少钱一斤啊？");  
         System.out.println ("老板：两块钱一斤。");  
         System.out.println (customer + "：你这瓜皮子是金子做的，还是瓜粒子是金子做的？");  
         System.out.println ("老板：你瞅瞅现在哪有瓜啊，这都是大棚的瓜，你嫌贵我还嫌贵呢。");  
         System.out.println (customer + "：给我挑一个。");  
 ​  
         impl.saleWatermelon (customer);   //讨价还价成功，进行我们告诉代理商的卖瓜行为  
     }  
 }
```
现在我们来试试看：
```java
 public class Main {  
     public static void main (String[] args) {  
         Shopper shopper = new ShopperProxy (new ShopperImpl ());  
         shopper.saleWatermelon ("小强");  
     }  
 }
```
这样的操作称为**静态代理**，也就是说我们需要**提前知道接口的定义并进行实现**才可以完成代理，而 Mybatis 这样的是无法预知代理接口的，我们就需要用到动态代理。
JDK 提供的反射框架就为我们很好地解决了动态代理的问题，在这里相当于对 JavaSE 阶段反射的内容进行一个补充。
```java
 public class ShopperProxy implements InvocationHandler {  
 ​  
     Object target;  
     public ShopperProxy (Object target){  
         this. target = target;  
     }  
 ​  
     @Override  
     public Object invoke (Object proxy, Method method, Object[] args) throws Throwable {  
         String customer = (String) args[0];  
         System.out.println (customer + "：哥们，这瓜多少钱一斤啊？");  
         System.out.println ("老板：两块钱一斤。");  
         System.out.println (customer + "：你这瓜皮子是金子做的，还是瓜粒子是金子做的？");  
         System.out.println ("老板：你瞅瞅现在哪有瓜啊，这都是大棚的瓜，你嫌贵我还嫌贵呢。");  
         System.out.println (customer + "：行，给我挑一个。");  
         return method.invoke (target, args);  
     }  
 }
```
通过实现 `InvocationHandler` 来成为一个动态代理，我们发现它提供了一个 invoke 方法，用于调用被代理对象的方法并完成我们的代理工作。现在就可以通过 `Proxy. newProxyInstance` 来生成一个动态代理类：
```java
 public static void main (String[] args) {  
     Shopper impl = new ShopperImpl ();  
     Shopper shopper = (Shopper) Proxy.newProxyInstance (impl.getClass (). getClassLoader (),  
             impl.getClass (). getInterfaces (), new ShopperProxy (impl));  
     shopper.saleWatermelon ("小强");  
     System.out.println (shopper.getClass ());  
 }
```
通过打印类型我们发现，就是我们之前看到的那种奇怪的类：`class com. sun. proxy.$Proxy 0`，因此 Mybatis 其实也是这样的来实现的（肯定有人问了：Mybatis 是直接代理接口啊，你这个不还是要把接口实现了吗？）那我们来改改，现在我们不代理任何类了，直接做接口实现：
```java
 public class ShopperProxy implements InvocationHandler {  
 ​  
     @Override  
     public Object invoke (Object proxy, Method method, Object[] args) throws Throwable {  
         String customer = (String) args[0];  
         System.out.println (customer + "：哥们，这瓜多少钱一斤啊？");  
         System.out.println ("老板：两块钱一斤。");  
         System.out.println (customer + "：你这瓜皮子是金子做的，还是瓜粒子是金子做的？");  
         System.out.println ("老板：你瞅瞅现在哪有瓜啊，这都是大棚的瓜，你嫌贵我还嫌贵呢。");  
         System.out.println (customer + "：行，给我挑一个。");  
         return null;  
     }  
 }
 public static void main (String[] args) {  
     Shopper shopper = (Shopper) Proxy.newProxyInstance (Shopper.class.getClassLoader (),  
             new Class[]{ Shopper. class },   //因为本身就是接口，所以直接用就行  
             new ShopperProxy ());  
     shopper.saleWatermelon ("小强");  
     System.out.println (shopper.getClass ());  
 }
```
可以去看看 Mybatis 的源码。
Mybatis 的学习差不多就到这里为止了，不过，同样类型的框架还有很多，Mybatis 属于半自动框架，SQL 语句依然需要我们自己编写，虽然存在一定的麻烦，但是会更加灵活，而后面我们还会学习 JPA，它是全自动的框架，你几乎见不到 SQL 的影子！
# Maven
Maven 翻译为"专家"、"内行"，是 Apache 下的一个纯 Java 开发的开源项目。基于项目对象模型（缩写：POM）概念，Maven 利用一个中央信息片断能管理一个项目的构建、报告和文档等步骤。Maven 是一个项目管理工具，可以对 Java 项目进行构建、依赖管理。Maven 也可被用于构建和管理各种项目，例如 C#，Ruby，Scala 和其他语言编写的项目。Maven 曾是 Jakarta 项目的子项目，现为由 Apache 软件基金会主持的独立 Apache 项目。
通过 Maven，可以帮助我们做：
* 项目的自动构建，包括代码的编译、测试、打包、安装、部署等操作。
* 依赖管理，项目使用到哪些依赖，可以快速完成导入。

我们之前并没有讲解如何将我们的项目打包为 Jar 文件运行，同时，我们导入依赖的时候，每次都要去下载对应的 Jar 包，这样其实是很麻烦的，并且还有可能一个 Jar 包依赖于另一个 Jar 包，就像之前使用 JUnit 一样，因此我们需要一个更加方便的包管理机制。
Maven 也需要安装环境，但是 IDEA 已经自带了 Maven 环境，因此我们不需要再去进行额外的环境安装（无 IDEA 也能使用 Maven，但是配置过程很麻烦，并且我们现在使用的都是 IDEA 的集成开发环境，所以这里就不讲解 Maven 命令行操作了）我们直接创建一个新的 Maven 项目即可。
## Maven 项目结构
我们可以来看一下，一个 Maven 项目和我们普通的项目有什么区别：
![img](https://s2.loli.net/2023/03/06/tYh7BGvZHu6ncdf.jpg)
那么首先，我们需要了解一下 POM 文件，它相当于是我们整个 Maven 项目的配置文件，它也是使用 XML 编写的：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns=" http://maven.apache.org/POM/4.0.0"
         xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation=" http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>org. example</groupId>
    <artifactId>MavenTest</artifactId>
    <version>1.0-SNAPSHOT</version>
    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>
</project>
```
我们可以看到，Maven 的配置文件是以 `project` 为根节点，而 `modelVersion` 定义了当前模型的版本，一般是 4.0.0，我们不用去修改。
`groupId`、`artifactId`、`version` 这三个元素合在一起，用于唯一区别每个项目，别人如果需要将我们编写的代码作为依赖，那么就必须通过这三个元素来定位我们的项目，我们称为一个项目的基本坐标，所有的项目一般都有自己的 Maven 坐标，因此我们通过 Maven 导入其他的依赖只需要填写这三个基本元素就可以了，无需再下载 Jar 文件，而是 Maven 自动帮助我们下载依赖并导入。
* `groupId` 一般用于指定组名称，命名规则一般和包名一致，比如我们这里使用的是 `org. example`，一个组下面可以有很多个项目。
* `artifactId` 一般用于指定项目在当前组中的唯一名称，也就是说在组中用于区分于其他项目的标记。
* `version` 代表项目版本，随着我们项目的开发和改进，版本号也会不断更新，就像 LOL 一样，每次赛季更新都会有一个大版本更新，我们的 Maven 项目也是这样，我们可以手动指定当前项目的版本号，其他人使用我们的项目作为依赖时，也可以根本版本号进行选择（这里的 SNAPSHOT 代表快照，一般表示这是一个处于开发中的项目，正式发布项目一般只带版本号）

`properties` 中一般都是一些变量和选项的配置，我们这里指定了 JDK 的源代码和编译版本为 1.8，无需进行修改。
## Maven 依赖导入
现在我们尝试使用 Maven 来帮助我们快速导入依赖，我们需要导入之前的 JDBC 驱动依赖、JUnit 依赖、Mybatis 依赖、Lombok 依赖，那么如何使用 Maven 来管理依赖呢？
我们可以创建一个 `dependencies` 节点：
```xml
<dependencies>
    //里面填写的就是所有的依赖
</dependencies>
```
那么现在就可以向节点中填写依赖了，那么我们如何知道每个依赖的坐标呢？我们可以在：[mavenrepository]( https://mvnrepository.com/ [Fetching Data#5mce](https://mvnrepository.com/)) 进行查询（可能打不开，建议用流量，或是直接百度某个项目的 Maven 依赖），我们直接搜索 lombok 即可，打开后可以看到已经给我们写出了依赖的坐标：
```xml
<dependency>
    <groupId>org. projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.22</version>
    <scope>provided</scope>
</dependency>
```
我们直接将其添加到 `dependencies` 节点中即可，现在我们来编写一个测试用例看看依赖导入成功了没有：
```java
public class Main {
    public static void main (String[] args) {
        Student student = new Student ("小明", 18);
        System.out.println (student);
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
项目运行成功，表示成功导入了依赖。那么，Maven 是如何进行依赖管理呢，以致于如此便捷的导入依赖，我们来看看 Maven 项目的依赖管理流程：
![img](https://s2.loli.net/2023/03/06/XYNMU5WCrZv9cwy.jpg)
通过流程图我们得知，一个项目依赖一般是存储在中央仓库中，也有可能存储在一些其他的远程仓库（私服），几乎所有的依赖都被放到了中央仓库中，因此，Maven 可以直接从中央仓库中下载大部分的依赖（Maven 第一次导入依赖是需要联网的），远程仓库中下载之后，会暂时存储在本地仓库，我们会发现我们本地存在一个 `. m 2` 文件夹，这就是 Maven 本地仓库文件夹，默认建立在 C 盘，如果你 C 盘空间不足，会出现问题！
在下次导入依赖时，如果 Maven 发现本地仓库中就已经存在某个依赖，那么就不会再去远程仓库下载了。
可能在导入依赖时，小小伙伴们会出现卡顿的问题，我们建议配置一下 IDEA 自带的 Maven 插件远程仓库地址，我们打开 IDEA 的安装目录，找到 `安装根目录/plugins/maven/lib/maven 3/conf` 文件夹，找到 `settings. xml` 文件，打开编辑：
找到 mirros 标签，添加以下内容：
```xml
<mirror>
      <id>nexus-aliyun</id>
      <mirrorOf>*</mirrorOf>
      <name>Nexus aliyun</name>
      <url>http://maven. aliyun. com/nexus/content/groups/public</url>
</mirror> 
```
这样，我们就将默认的远程仓库地址（国外），配置为国内的阿里云仓库地址了（依赖的下载速度就会快起来了）
## Maven 依赖作用域
除了三个基本的属性用于定位坐标外，依赖还可以添加以下属性：
- **type**：依赖的类型，对于项目坐标定义的 packaging。大部分情况下，该元素不必声明，其默认值为 jar
- **scope**：**依赖的范围**（作用域，着重讲解）
- **optional**：标记依赖是否可选
- **exclusions**：用来排除传递性依赖（一个项目有可能依赖于其他项目，就像我们的项目，如果别人要用我们的项目作为依赖，那么就需要一起下载我们项目的依赖，如 Lombok）

我们着重来讲解一下 `scope` 属性，它决定了依赖的作用域范围：
* **compile** ：为**默认的依赖有效范围**。如果在定义依赖关系的时候，没有明确指定依赖有效范围的话，则默认采用该依赖有效范围。此种依赖，在编译、运行、测试时均有效。
* **provided** ：在**编译、测试时有效**，但是在运行时无效，也就是说，项目在运行时，不需要此依赖，比如我们上面的 Lombok，我们只需要在编译阶段使用它，编译完成后，实际上已经转换为对应的代码了，因此 Lombok 不需要在项目运行时也存在。
* **runtime** ：在**运行、测试时有效**，但是在编译代码时无效。比如我们如果需要自己写一个 JDBC 实现，那么肯定要用到 JDK 为我们指定的接口，但是实际上在运行时是不用自带 JDK 的依赖，因此只保留我们自己写的内容即可。
* **test** ：只**在测试时有效**，例如：JUnit，我们一般只会在测试阶段使用 JUnit，而实际项目运行时，我们就用不到测试了，那么我们来看看，导入 JUnit 的依赖：

同样的，我们可以在网站上搜索 Junit 的依赖，我们这里导入最新的 JUnit 5 作为依赖：
```xml
<dependency>
    <groupId>org. junit. jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.8.1</version>
    <scope>test</scope>
</dependency>
```
我们所有的测试用例全部编写到 Maven 项目给我们划分的 test 目录下，位于此目录下的内容不会在最后被打包到项目中，只用作开发阶段测试使用：
```java
public class MainTest {
    @Test
    public void test (){
        System.out.println ("测试");
      	//Assert 在 JUnit 5 时名称发生了变化 Assertions
        Assertions.assertArrayEquals (new int[]{1, 2, 3}, new int[]{1, 2});
    }
}
```
因此，一般仅用作测试的依赖如 JUnit 只保留在测试中即可，那么现在我们再来添加 JDBC 和 Mybatis 的依赖：
```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.27</version>
</dependency>
<dependency>
    <groupId>org. mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.7</version>
</dependency>
```
我们发现，Maven 还给我们提供了一个 `resource` 文件夹，我们可以将一些静态资源，比如配置文件，放入到这个文件夹中，项目在打包时会将资源文件夹中文件一起打包的 Jar 中，比如我们在这里编写一个 Mybatis 的配置文件：
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<! DOCTYPE configuration
        PUBLIC "-//mybatis. org//DTD Config 3.0//EN"
        " http://mybatis.org/dtd/mybatis-3-config.dtd">
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
现在我们创建一下测试用例，顺便带大家了解一下 Junit 5 的一些比较方便的地方：
```java
public class MainTest {
    //因为配置文件位于内部，我们需要使用 Resources 类的 getResourceAsStream 来获取内部的资源文件
    private static SqlSessionFactory factory;
    //在 JUnit 5 中@Before 被废弃，它被细分了：
    @BeforeAll // 一次性开启所有测试案例只会执行一次 (方法必须是 static)
    // @BeforeEach 一次性开启所有测试案例每个案例开始之前都会执行一次
    @SneakyThrows
    public static void before (){
        factory = new SqlSessionFactoryBuilder ()
                .build (Resources.getResourceAsStream ("mybatis. xml"));
    }
    @DisplayName ("Mybatis 数据库测试")  //自定义测试名称
    @RepeatedTest (3)  //自动执行多次测试
    public void test (){
        try (SqlSession sqlSession = factory.openSession (true)){
            TestMapper testMapper = sqlSession.getMapper (TestMapper. class);
            System.out.println (testMapper.getStudentBySid (1));
        }
    }
}
```
那么就有人提问了，如果我需要的依赖没有上传的远程仓库，而是只有一个 Jar 怎么办呢？我们可以使用第四种作用域：
* **system**：作用域和 provided 是一样的，但是它不是从远程仓库获取，而是直接导入本地 Jar 包：

```xml
<dependency>
     <groupId>javax. jntm</groupId>
     <artifactId>lbwnb</artifactId>
     <version>2.0</version>
     <scope>system</scope>
     <systemPath>C://学习资料/4 K 高清无码/test. jar</systemPath>
</dependency>
```
比如上面的例子，如果 scope 为 system，那么我们需要添加一个 systemPath 来指定 jar 文件的位置，这里就不再演示了。
## Maven 可选依赖
当项目中的某些依赖不希望被使用此项目作为依赖的项目使用时，我们可以给依赖添加 `optional` 标签表示此依赖是可选的，默认在导入依赖时，不会导入可选的依赖：
```xml
<optional>true</optional>
```
比如 Mybatis 的 POM 文件中，就存在大量的可选依赖：
```xml
<dependency>
  <groupId>org. slf 4 j</groupId>
  <artifactId>slf 4 j-api</artifactId>
  <version>1.7.30</version>
  <optional>true</optional>
</dependency>
<dependency>
  <groupId>org. slf 4 j</groupId>
  <artifactId>slf 4 j-log 4 j 12</artifactId>
  <version>1.7.30</version>
  <optional>true</optional>
</dependency>
<dependency>
  <groupId>log 4 j</groupId>
  <artifactId>log 4 j</artifactId>
  <version>1.2.17</version>
  <optional>true</optional>
</dependency>
 ...
```
由于 Mybatis 要支持多种类型的日志，需要用到很多种不同的日志框架，因此需要导入这些依赖来做兼容，但是我们项目中并不一定会使用这些日志框架作为 Mybatis 的日志打印器，因此这些日志框架仅 Mybatis 内部做兼容需要导入使用，而我们可以选择不使用这些框架或是选择其中一个即可，也就是说我们导入 Mybatis 之后想用什么日志框架再自己加就可以了。
## Maven 排除依赖
我们了解了可选依赖，现在我们可以让使用此项目作为依赖的项目默认不使用可选依赖，但是如果存在那种不是可选依赖，但是我们导入此项目又不希望使用此依赖该怎么办呢，这个时候我们就可以通过排除依赖来防止添加不必要的依赖：
```xml
<dependency>
    <groupId>org. junit. jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.8.1</version>
    <scope>test</scope>
    <exclusions>
        <exclusion>
            <groupId>org. junit. jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```
我们这里演示了排除 JUnit 的一些依赖，我们可以在外部库中观察排除依赖之后和之前的效果。
## Maven 继承关系
一个 Maven 项目可以继承自另一个 Maven 项目，比如多个子项目都需要父项目的依赖，我们就可以使用继承关系来快速配置。
我们右键左侧栏，新建一个模块，来创建一个子项目：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns=" http://maven.apache.org/POM/4.0.0"
         xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation=" http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>MavenTest</artifactId>
        <groupId>org. example</groupId>
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
我们可以看到，IDEA 默认给我们添加了一个 parent 节点，表示此 Maven 项目是父 Maven 项目的子项目，子项目直接继承父项目的 `groupId`，子项目会直接继承父项目的所有依赖，除非依赖添加了 optional 标签，我们来编写一个测试用例尝试一下:
```java
import lombok. extern. java. Log;
@Log
public class Main {
    public static void main (String[] args) {
        log.info ("我是日志信息");
    }
}
```
可以看到，子项目也成功继承了 Lombok 依赖。
我们还可以让父 Maven 项目统一管理所有的依赖，包括版本号等，子项目可以选取需要的作为依赖，而版本全由父项目管理，我们可以将 `dependencies` 全部放入 `dependencyManagement` 节点，这样父项目就完全作为依赖统一管理。
```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org. projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.22</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org. junit. jupiter</groupId>
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
            <groupId>org. mybatis</groupId>
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
        <groupId>org. projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <scope>provided</scope>
    </dependency>
</dependencies>
```
当然，父项目如果还存在 dependencies 节点的话，里面的内依赖依然是直接继承：
```xml
<dependencies>
    <dependency>
        <groupId>org. junit. jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.8.1</version>
        <scope>test</scope>
    </dependency>
</dependencies>
<dependencyManagement>
    <dependencies>
      ...
```
## Maven 常用命令
我们可以看到在 IDEA 右上角 Maven 板块中，每个 Maven 项目都有一个生命周期，实际上这些是 Maven 的一些插件，每个插件都有各自的功能，比如：
* `clean` 命令，执行后会清理整个 `target` 文件夹，在之后编写 Springboot 项目时可以解决一些缓存没更新的问题。
* `validate` 命令可以验证项目的可用性。
* `compile` 命令可以将项目编译为. class 文件。
* `install` 命令可以将当前项目安装到本地仓库，以供其他项目导入作为依赖使用
* `verify` 命令可以按顺序执行每个默认生命周期阶段（`validate`，`compile`，`package` 等）

## Maven 测试项目
通过使用 `test` 命令，可以一键测试所有位于 test 目录下的测试案例，请注意有以下要求：
* 测试类的名称必须是以 `Test` 结尾，比如 `MainTest`
* 测试方法上必须标注 `@Test` 注解，实测 `@RepeatedTest` 无效

这是由于 JUnit 5 比较新，我们需要重新配置插件升级到高版本，才能完美的兼容 Junit 5：
```xml
<build>
    <plugins>
        <plugin>
            <groupId>org. apache. maven. plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <!-- JUnit 5 requires Surefire version 2.22.0 or higher -->
            <version>2.22.0</version>
        </plugin>
    </plugins>
</build>
```
现在 `@RepeatedTest`、`@BeforeAll` 也能使用了。
## Maven 打包项目
我们的项目在编写完成之后，要么作为 Jar 依赖，供其他模型使用，要么就作为一个可以执行的程序，在控制台运行，我们只需要直接执行 `package` 命令就可以直接对项目的代码进行打包，生成 jar 文件。
当然，以上方式仅适用于作为 Jar 依赖的情况，如果我们需要打包一个可执行文件，那么我不仅需要将自己编写的类打包到 Jar 中，同时还需要将依赖也一并打包到 Jar 中，因为我们使用了别人为我们提供的框架，自然也需要运行别人的代码，我们需要使用另一个插件来实现一起打包：
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
                <mainClass>com. test. Main</mainClass>
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
在打包之前也会执行一次 test 命令，来保证项目能够正常运行，当测试出现问题时，打包将无法完成，我们也可以手动跳过，选择 `执行 Maven 目标` 来手动执行 Maven 命令，输入 `mvn package -Dmaven. test. skip=true ` 来以跳过测试的方式进行打包。
最后得到我们的 Jar 文件，在同级目录下输入 `java -jar xxxx. jar` 来运行我们打包好的 Jar 可执行程序（xxx 代表文件名称）
* `deploy` 命令用于发布项目到本地仓库和远程仓库，一般情况下用不到，这里就不做讲解了。
* `site` 命令用于生成当前项目的发布站点，暂时不需要了解。

我们之前还讲解了多模块项目，那么多模块下父项目存在一个 `packing` 打包类型标签，所有的父级项目的 packing 都为 pom，packing 默认是 jar 类型，如果不作配置，maven 会将该项目打成 jar 包。作为父级项目，还有一个重要的属性，那就是 modules，通过 modules 标签将项目的所有子项目引用进来，在 build 父级项目时，会根据子模块的相互依赖关系整理一个 build 顺序，然后依次 build。

***
## 使用 Maven 创建 Web 项目
虽然我们已经可以在 Tomcat 上部署我们的前端页面了，但是依然只是一个静态页面（每次访问都是同样的样子），那么如何向服务器请求一个动态的页面呢（比如显示我们访问当前页面的时间）这时就需要我们编写一个 Web 应用程序来实现了，我们需要在用户向服务器发起页面请求时，进行一些处理，再将结果发送给用户的浏览器。
**注意：这里需要使用终极版 IDEA，如果你的还是社区版，就很难受了。
我们打开 IDEA，新建一个项目，选择 Java Enterprise（社区版没有此选项！）项目名称随便，项目模板选择 Web 应用程序，然后我们需要配置 Web 应用程序服务器，将我们的 Tomcat 服务器集成到 IDEA 中。配置很简单，首先点击新建，然后设置 Tomcat 主目录即可，配置完成后，点击下一步即可，依赖项使用默认即可，然后点击完成，之后 IDEA 会自动帮助我们创建 Maven 项目。
创建完成后，直接点击右上角即可运行此项目了，但是我们发现，有一个 Servlet 页面不生效。
需要注意的是，Tomcat 10 以上的版本比较新，Servlet API 包名发生了一些变化，因此我们需要修改一下依赖：
```xml
<dependency>
    <groupId>jakarta. servlet</groupId>
    <artifactId>jakarta. servlet-api</artifactId>
    <version>5.0.0</version>
    <scope>provided</scope>
</dependency>
```
注意包名全部从 javax 改为 jakarta，我们需要手动修改一下。
感兴趣的可以了解一下为什么名称被修改了：
> Eclipse 基金会在 2019 年对 Java EE 标准的每个规范进行了重命名，阐明了每个规范在 Jakarta EE 平台未来的角色。
>
> 新的名称 Jakarta EE 是 Java EE 的第二次重命名。2006 年 5 月，“J 2 EE”一词被弃用，并选择了 Java EE 这个名称。在 YouTube 还只是一家独立的公司的时候，数字 2 就就从名字中消失了，而且当时冥王星仍然被认为是一颗行星。同样，作为 Java SE 5（2004）的一部分，数字 2 也从 J 2 SE 中删除了，那时谷歌还没有上市。
>
> **因为不能再使用 javax 名称空间，Jakarta EE 提供了非常明显的分界线。**
>
> - Jakarta 9（2019 及以后）使用 jakarta 命名空间。
> - Java EE 5（2005）到 Java EE 8（2017）使用 javax 命名空间。
> - Java EE 4 使用 javax 命名空间。

我们可以将项目直接打包为 war 包（默认），打包好之后，放入 webapp 文件夹，就可以直接运行我们通过 Java 编写的 Web 应用程序了，访问路径为文件的名称。
# Servlet
前面我们已经完成了基本的环境搭建，那么现在我们就可以开始来了解我们的第一个重要类——Servlet。
它是 Java EE 的一个标准，大部分的 Web 服务器都支持此标准，包括 Tomcat，就像之前的 JDBC 一样，由官方定义了一系列接口，而具体实现由我们来编写，最后交给 Web 服务器（如 Tomcat）来运行我们编写的 Servlet。
那么，它能做什么呢？我们可以通过实现 Servlet 来进行动态网页响应，使用 Servlet，不再是直接由 Tomcat 服务器发送我们编写好的静态网页内容（HTML 文件），而是由我们通过 Java 代码进行动态拼接的结果，它能够很好地实现动态网页的返回。
当然，Servlet 并不是专用于 HTTP 协议通信，也可以用于其他的通信，但是一般都是用于 HTTP。
### 创建 Servlet
那么如何创建一个 Servlet 呢，非常简单，我们只需要实现 `Servlet` 类即可，并添加注解 `@WebServlet` 来进行注册。
```java
@WebServlet ("/test")
public class TestServlet implements Servlet {
		... 实现接口方法
}
```
现在就可以去访问一下我们的页面： http://localhost:8080/test/test
我们发现，直接访问此页面是没有任何内容的，这是因为我们还没有为该请求方法编写实现，这里先不做讲解，后面我们会对浏览器的请求处理做详细的介绍。
除了直接编写一个类，我们也可以在 `web. xml` 中进行注册，现将类上 `@WebServlet` 的注解去掉：
```xml
<servlet>
    <servlet-name>test</servlet-name>
    <servlet-class>com. example. webtest. TestServlet</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>test</servlet-name>
    <url-pattern>/test</url-pattern>
</servlet-mapping>
```
这样的方式也能注册 Servlet，但是显然直接使用**注解更加方便**，因此之后我们一律使用注解进行开发。只有比较新的版本才支持此注解，老的版本是不支持的哦。
实际上，Tomcat 服务器会为我们提供一些默认的 Servlet，也就是说在服务器启动后，即使我们什么都不编写，**Tomcat 也自带了几个默认的 Servlet**，他们编写在 conf 目录下的 `web.xml` 中：
```xml
<!-- The mapping for the default servlet -->
    <servlet-mapping>
        <servlet-name>default</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
    <!-- The mappings for the JSP servlet -->
    <servlet-mapping>
        <servlet-name>jsp</servlet-name>
        <url-pattern>*. jsp</url-pattern>
        <url-pattern>*. jspx</url-pattern>
    </servlet-mapping>
```
我们发现，默认的 Servlet 实际上可以帮助我们去访问一些*静态资源*，这也是为什么我们启动 Tomcat 服务器之后，能够直接访问 webapp 目录下的静态页面。
我们可以将之前编写的页面放入到 webapp 目录下，来测试一下是否能直接访问。
### 探究 Servlet 的生命周期
我们已经了解了如何注册一个 Servlet，那么我们接着来看看，一个 Servlet 是如何运行的。
首先我们需要了解，Servlet 中的方法各自是在什么时候被调用的，我们先编写一个打印语句来看看：
```java
public class TestServlet implements Servlet {
    public TestServlet (){
        System.out.println ("我是构造方法！");
    }
    @Override
    public void init (ServletConfig servletConfig) throws ServletException {
        System.out.println ("我是 init");
    }
    @Override
    public ServletConfig getServletConfig () {
        System.out.println ("我是 getServletConfig");
        return null;
    }
    @Override
    public void service (ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
        System.out.println ("我是 service");
    }
    @Override
    public String getServletInfo () {
        System.out.println ("我是 getServletInfo");
        return null;
    }
    @Override
    public void destroy () {
        System.out.println ("我是 destroy");
    }
}
```
我们首先启动一次服务器，然后访问我们定义的页面，然后再关闭服务器，得到如下的顺序：
> 我是构造方法！
> 我是 init
> 我是 service
> 我是 service（出现两次是因为浏览器请求了 2 次，是因为有一次是请求 favicon. ico，浏览器通病）
> 我是 destroy

我们可以多次尝试去访问此页面，但是**init 和构造方法只会执行一次**，而每次访问都会执行的是 `service` 方法，因此，一个 Servlet 的生命周期为：
- 首先执行构造方法完成 Servlet 初始化
- Servlet 初始化后调用 **init ()** 方法。
- Servlet 调用 **service ()** 方法来处理客户端的请求。
- Servlet 销毁前调用 **destroy ()** 方法。
- 最后，Servlet 是由 JVM 的垃圾回收器进行垃圾回收的。

现在我们发现，实际上在 Web 应用程序运行时，每当浏览器向服务器发起一个请求时，都会创建一个线程执行一次 `service` 方法，来让我们处理用户的请求，并将结果响应给用户。
我们发现 `service` 方法中，还有两个参数，`ServletRequest` 和 `ServletResponse`，实际上，用户发起的 HTTP 请求，就被 Tomcat 服务器封装为了一个 `ServletRequest` 对象，我们得到是其实是 Tomcat 服务器帮助我们创建的一个实现类，HTTP 请求报文中的所有内容，都可以从 `ServletRequest` 对象中获取，同理，`ServletResponse` 就是我们需要返回给浏览器的 HTTP 响应报文实体类封装。
那么我们来看看 `ServletRequest` 中有哪些内容，我们可以获取请求的一些信息：
```java
@Override
public void service (ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
    //首先将其转换为 HttpServletRequest（继承自 ServletRequest，一般是此接口实现）
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        System.out.println (request.getProtocol ());  //获取协议版本
        System.out.println (request.getRemoteAddr ());  //获取访问者的 IP 地址
  		  System.out.println (request.getMethod ());   //获取请求方法
        //获取头部信息
        Enumeration<String> enumeration = request.getHeaderNames ();
        while (enumeration.hasMoreElements ()){
            String name = enumeration.nextElement ();
            System.out.println (name + ": " + request.getHeader (name));
        }
}
```
我们发现，整个 HTTP**请求报文中的所有内容**，都可以通过 `HttpServletRequest` 对象来获取，当然，它的作用肯定不仅仅是获取头部信息，我们还可以使用它来完成更多操作，后面会一一讲解。
那么我们再来看看 `ServletResponse`，这个是服务端的响应内容，我们可以在这里填写我们想要发送给浏览器显示的内容：
```java
//转换为 HttpServletResponse（同上）
HttpServletResponse response = (HttpServletResponse) servletResponse;
//设定内容类型以及编码格式（普通 HTML 文本使用 text/html，之后会讲解文件传输）
response.setHeader ("Content-type", "text/html; charset=UTF-8");
//获取 Writer 直接写入内容
response. getWriter (). write ("我是响应内容！");
//所有内容写入完成之后，再发送给浏览器
```
现在我们在浏览器中打开此页面，就能够收到服务器发来的响应内容了。其中，响应头部分，是由 Tomcat 帮助我们生成的一个默认响应头。
![点击查看源网页](https://s2.loli.net/2023/03/06/OpTzXU5b8VjkSiB.jpg)
因此，实际上整个流程就已经很清晰明了了。
### 解读和使用 HttpServlet
前面我们已经学习了如何创建、注册和使用 Servlet，那么我们继续来深入学习 Servlet 接口的一些实现类。
首先 `Servlet` 有一个直接实现抽象类 `GenericServlet`，那么我们来看看此类做了什么事情。
我们发现，这个类完善了配置文件读取和 Servlet 信息相关的的操作，但是依然没有去实现 service 方法，因此此类仅仅是用于完善一个 Servlet 的基本操作，那么我们接着来看 `HttpServlet`，它是遵循 HTTP 协议的一种 Servlet，继承自 `GenericServlet`，它根据 HTTP 协议的规则，完善了 service 方法。
在阅读了 HttpServlet 源码之后，我们发现，其实我们只需要继承 HttpServlet 来编写我们的 Servlet 就可以了，并且它已经帮助我们提前实现了一些操作，这样就会给我们省去很多的时间。
```java
@Log
@WebServlet ("/test")
public class TestServlet extends HttpServlet {
    @Override
    protected void doGet (HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp. setContentType ("text/html; charset=UTF-8");
        resp. getWriter (). write ("<h1>恭喜你解锁了全新玩法</h1>");
    }
}
```
现在，我们只需要重写对应的请求方式，就可以快速完成 Servlet 的编写。
### @WebServlet 注解详解
我们接着来看 WebServlet 注解，我们前面已经得知，可以直接使用此注解来快速注册一个 Servlet，那么我们来想细看看此注解还有什么其他的玩法。
首先**name 属性就是 Servlet 名称**，而**urlPatterns 和 value 实际上是同样功能，就是代表当前 Servlet 的访问路径**，它不仅仅可以是一个固定值，还可以进行**通配符匹配**：
```java
@WebServlet ("/test/*")
```
上面的路径表示，所有匹配 `/test/随便什么` 的路径名称，都可以访问此 Servlet，我们可以在浏览器中尝试一下。
也可以进行某个扩展名称的匹配：
```java
@WebServlet ("*. js")
```
这样的话，获取任何以 js 结尾的文件，都会由我们自己定义的 Servlet 处理。
那么如果我们的路径为 `/` 呢？
```java
@WebServlet ("/")
```
此路径和 Tomcat 默认为我们提供的 Servlet 冲突，会直接替换掉默认的，而使用我们的，此路径的意思为，如果没有找到匹配当前访问路径的 Servlet，那么久会使用此 Servlet 进行处理。
我们还可以为一个 Servlet 配置多个访问路径：
```java
@WebServlet ({"/test 1", "/test 2"})
```
我们接着来看**loadOnStartup 属性**，此属性决定了**是否在 Tomcat 启动时就加载此 Servlet**，默认情况下，Servlet 只有在被访问时才会加载，它的**默认值为-1，表示不在启动时加载**，我们可以将其修改为大于等于 0 的数，来开启启动时加载。并且**数字的大小决定了此 Servlet 的启动优先级**。
```java
@Log
@WebServlet (value = "/test", loadOnStartup = 1)
public class TestServlet extends HttpServlet {
    @Override
    public void init () throws ServletException {
        super. init ();
        log. info ("我被初始化了！");
    }
    @Override
    protected void doGet (HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp. setContentType ("text/html; charset=UTF-8");
        resp. getWriter (). write ("<h1>恭喜你解锁了全新玩法</h1>");
    }
}
```
其他内容都是 Servlet 的一些基本配置，这里就不详细讲解了。
### 使用 POST 请求完成登陆
我们需要修改一下我们的 Servlet，现在我们要让其能够接收一个 POST 请求：
```java
@Log
@WebServlet ("/login")
public class LoginServlet extends HttpServlet {
    @Override
    protected void doPost (HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req. getParameterMap (). forEach ((k, v) -> {
            System. out. println (k + ": " + Arrays. toString (v));
        });
    }
}
```
`ParameterMap` 存储了我们发送的 POST 请求所携带的表单数据，我们可以直接将其遍历查看，浏览器发送了什么数据。
现在我们再来修改一下前端：
```html
<body>
    <h1>登录到系统</h1>
    <form method="post" action="login">
        <hr>
        <div>
            <label>
                <input type="text" placeholder="用户名" name="username">
            </label>
        </div>
        <div>
            <label>
                <input type="password" placeholder="密码" name="password">
            </label>
        </div>
        <div>
            <button>登录</button>
        </div>
    </form>
</body>
```
通过修改 form 标签的属性，现在我们点击登录按钮，会自动向后台发送一个 POST 请求，请求地址为当前地址+/login（注意不同路径的写法），也就是我们上面编写的 Servlet 路径。
运行服务器，测试后发现，在点击按钮后，确实向服务器发起了一个 POST 请求，并且携带了表单中文本框的数据。
现在，我们根据已有的基础，将其与数据库打通，我们进行一个真正的用户登录操作，首先修改一下 Servlet 的逻辑：
```java
@Override
protected void doPost (HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    //首先设置一下响应类型
    resp. setContentType ("text/html; charset=UTF-8");
    //获取 POST 请求携带的表单数据
    Map<String, String[]> map = req. getParameterMap ();
    //判断表单是否完整
    if (map. containsKey ("username") && map. containsKey ("password")) {
        String username = req. getParameter ("username");
        String password = req. getParameter ("password");
        //权限校验（待完善）
    }else {
        resp. getWriter (). write ("错误，您的表单数据不完整！");
    }
}
```
接下来我们再去编写**Mybatis 的依赖和配置文件**，创建一个表，用于存放我们用户的账号和密码。
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<! DOCTYPE configuration
        PUBLIC "-//mybatis. org//DTD Config 3.0//EN"
        " http://mybatis.org/dtd/mybatis-3-config.dtd">
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
    <mappers>
	    <mapper class="com.example.mapper.UserMapper"/>
	</mappers>
</configuration>
```
```xml
<dependency>
    <groupId>org. mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.7</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.27</version>
</dependency>
```
配置完成后，在我们的**Servlet 的 init 方法中编写 Mybatis 初始化代码**，因为它只需要初始化一次。
```java
SqlSessionFactory factory;
@SneakyThrows
@Override
public void init () throws ServletException {
    factory = new SqlSessionFactoryBuilder (). build (Resources. getResourceAsReader ("mybatis-config. xml"));
}
```
现在我们创建一个实体类以及 Mapper 来进行用户信息查询：
```java
@Data
public class User {
    String username;
    String password;
}
```
```java
public interface UserMapper {
    @Select ("select * from users where username = #{username} and password = #{password}")
    User getUser (@Param ("username") String username, @Param ("password") String password);
}
```
好了，现在完事具备，只欠东风了，我们来完善一下登陆验证逻辑：
```java
//登陆校验（待完善）
try (SqlSession sqlSession = factory. openSession (true)){
    UserMapper mapper = sqlSession. getMapper (UserMapper. class);
    User user = mapper. getUser (username, password);
    //判断用户是否登陆成功，若查询到信息则表示存在此用户
    if (user != null){
        resp. getWriter (). write ("登陆成功！");
    }else {
        resp. getWriter (). write ("登陆失败，请验证您的用户名或密码！");
    }
}
```
### 上传和下载文件
首先我们来看看比较简单的下载文件，首先将我们的 icon. png 放入到 resource 文件夹中，接着我们编写一个 Servlet 用于处理文件下载：
```java
@WebServlet ("/file")
public class FileServlet extends HttpServlet {
    @Override
    protected void doGet (HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
      resp. setContentType ("image/png");  
      OutputStream outputStream = resp. getOutputStream ();
      InputStream inputStream = Resources. getResourceAsStream ("icon. png");
    }
}
```
为了更加快速地编写 IO 代码，我们可以引入一个工具库：
```xml
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.6</version>
</dependency>
```
使用此类库可以快速完成 IO 操作：
```java
resp. setContentType ("image/png");
OutputStream outputStream = resp. getOutputStream ();
InputStream inputStream = Resources. getResourceAsStream ("icon. png");
//直接使用 copy 方法完成转换
IOUtils. copy (inputStream, outputStream);
```
现在我们在前端页面添加一个链接，用于下载此文件：
```html
<hr>
<a href="file" download="icon.png">点我下载高清资源</a>
```
下载文件搞定，那么如何上传一个文件呢？
首先我们编写前端部分：
```html
<form method="post" action="file" enctype="multipart/form-data">
    <div>
        <input type="file" name="test-file">
    </div>
    <div>
        <button>上传文件</button>
    </div>
</form>
```
注意必须添加 `enctype="multipart/form-data"`，来表示此表单用于文件传输。
现在我们来修改一下 Servlet 代码：
```java
@MultipartConfig
@WebServlet ("/file")
public class FileServlet extends HttpServlet {
    @Override
    protected void doPost (HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try (FileOutputStream stream = new FileOutputStream ("/Users/nagocoler/Documents/IdeaProjects/WebTest/test. png")){
            Part part = req. getPart ("test-file");
            IOUtils. copy (part. getInputStream (), stream);
            resp. setContentType ("text/html; charset=UTF-8");
            resp. getWriter (). write ("文件上传成功！");
        }
    }
}
```
注意，必须添加 `@MultipartConfig` 注解来表示此 Servlet 用于处理文件上传请求。
现在我们再运行服务器，并将我们刚才下载的文件又上传给服务端。
### 使用 XHR 请求数据
> XHR 请求封装后就是**Ajax，axios**之类的 js 请求。

现在我们希望，网页中的部分内容，可以动态显示，比如网页上有一个时间，旁边有一个按钮，点击按钮就可以刷新当前时间。
这个时候就需要我们在网页展示时向后端发起请求了，并根据后端响应的结果，动态地更新页面中的内容，要实现此功能，就需要用到 JavaScript 来帮助我们，首先在 js 中编写我们的**XHR 请求**，并在请求中完成动态更新：
```js
function updateTime () {
    let xhr = new XMLHttpRequest ();
    xhr. onreadystatechange = function () {
        if (xhr. readyState === 4 && xhr. status === 200) {
            document. getElementById ("time"). innerText = xhr. responseText
        }
    };
    xhr. open ('GET', 'time', true);
    xhr. send ();
}
```
接着修改一下前端页面，添加一个时间显示区域：
```html
<hr>
<div id="time"></div>
<br>
<button onclick="updateTime()">更新数据</button>
<script>
    updateTime ()
</script>
```
最后创建一个 Servlet 用于处理时间更新请求：
```java
@WebServlet ("/time")
public class TimeServlet extends HttpServlet {
    @Override
    protected void doGet (HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        SimpleDateFormat dateFormat = new SimpleDateFormat ("yyyy 年 MM 月 dd 日 HH:mm: ss");
        String date = dateFormat. format (new Date ());
        resp. setContentType ("text/html; charset=UTF-8");
        resp. getWriter (). write (date);
    }
}
```
### 重定向与请求转发
当我们希望用户登录完成之后，直接跳转到网站的首页，那么这个时候，我们就可以使用重定向来完成。当浏览器收到一个重定向的响应时，会按照重定向响应给出的地址，再次向此地址发出请求。
实现重定向很简单，只需要调用一个方法即可，我们修改一下登陆成功后执行的代码：
```java
resp. sendRedirect ("time");
```
调用后，响应的状态码会被设置为 302，并且响应头中添加了一个 Location 属性，此属性表示，需要重定向到哪一个网址。
请求转发其实是一种服务器内部的跳转机制，我们知道，重定向会使得浏览器去重新请求一个页面，而请求转发则是服务器内部进行跳转，它的目的是，直接将本次请求转发给其他 Servlet 进行处理，并由其他 Servlet 来返回结果，因此它是在进行内部的转发。
```java
req. getRequestDispatcher ("/time"). forward (req, resp);
```
现在，在登陆成功的时候，我们将请求转发给处理时间的 Servlet，注意这里的路径规则和之前的不同，我们需要填写 Servlet 上指明的路径，并且请求转发只能转发到此应用程序内部的 Servlet，不能转发给其他站点或是其他 Web 应用程序。
现在再次进行登陆操作，我们发现，返回结果为一个 405 页面，证明了，我们的请求现在是被另一个 Servlet 进行处理，并且请求的信息全部被转交给另一个 Servlet，由于此 Servlet 不支持 POST 请求，因此返回 405 状态码。
那么也就是说，该请求包括请求参数也一起被传递了，那么我们可以尝试获取以下 POST 请求的参数。
现在我们给此 Servlet 添加 POST 请求处理，直接转交给 Get 请求处理：
```java
@Override
protected void doPost (HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    this. doGet (req, resp);
}
```
再次访问，成功得到结果，但是我们发现，浏览器只发起了一次请求，并没有再次请求新的 URL，也就是说，这一次请求直接返回了请求转发后的处理结果。
**请求转发的好处在于一次请求并且可以携带数据**！
```java
req. setAttribute ("test", "我是请求转发前的数据");
req. getRequestDispatcher ("/time"). forward (req, resp);
```
```java
System. out. println (req. getAttribute ("test"));
```
通过 `setAttribute` 方法来给当前请求添加一个附加数据，在请求转发后，我们可以直接获取到该数据。
重定向属于 2 次请求，因此无法使用这种方式来传递数据，那么，如何在重定向之间传递数据呢？我们可以使用即将要介绍的 `ServletContext` 对象。
最后总结，两者的区别为：
* **请求转发**是**一次请求**，**重定向**是**两次请求，第二次请求一定是 Get**
* **请求转发**可以**共享请求参数** ，**重定向**之后，就**获取不了共享参数**了
* **请求转发**只能**转发给内部的 Servlet**，重定向可以**重定向到其他站点**

### 了解 ServletContext 对象
**ServletContext 全局唯一**，它是属于整个 Web 应用程序的，我们可以通过 `getServletContext ()` 来获取到此对象。
此对象也能设置附加值：
```java
ServletContext context = getServletContext ();
context. setAttribute ("test", "我是重定向之前的数据");
resp. sendRedirect ("time");
```
```java
System. out. println (getServletContext (). getAttribute ("test"));
```
因为无论在哪里，无论什么时间，获取到的**ServletContext 始终是同一个对象**，因此我们可以随时随地获取我们添加的属性。
它不仅仅可以用来进行**数据传递**，还可以做一些其他的事情，比如**请求转发**：
```java
ServletContext context = getServletContext ()
context. getRequestDispatcher ("/time"). forward (req, resp);
```
它还可以获取根目录下的资源文件（注意是 webapp 根目录下的，不是 resource 中的资源）
### 初始化参数
初始化参数类似于初始化配置需要的一些值，比如我们的数据库连接相关信息，就可以通过初始化参数来给予 Servlet，或是一些其他的配置项，也可以使用初始化参数来实现。
我们可以给一个 Servlet 添加一些初始化参数：
```java
@WebServlet (value = "/login", initParams = {
        @WebInitParam (name = "test", value = "我是一个默认的初始化参数")
})
```
它也是以键值对形式保存的，我们可以直接通过 Servlet 的 `getInitParameter` 方法获取：
```java
System. out. println (getInitParameter ("test"));
```
但是，这里的初始化参数仅仅是针对于此 Servlet，我们也可以定义全局初始化参数，只需要在 web. xml 编写即可：
```xml
<context-param>
    <param-name>lbwnb</param-name>
    <param-value>我是全局初始化参数</param-value>
</context-param>
```
> 我们需要使用***ServletContext 来读取全局初始化参数**，但是**不能读取注解中的 initParams 中的局部参数***：

```java
ServletContext context = getServletContext ();
System. out. println (context. getInitParameter ("lbwnb"));
```

***
# Cookie
Cookie 可以在浏览器中保存一些信息，并且在下次请求时，请求头中会携带这些信息。
我们可以编写一个测试用例来看看：
```java
Cookie cookie = new Cookie ("test", "yyds");
resp. addCookie (cookie);
resp. sendRedirect ("time");
```
```java
for (Cookie cookie : req. getCookies ()) {
    System. out. println (cookie. getName () + ": " + cookie. getValue ());
}
```
我们可以观察一下，在 `HttpServletResponse` 中添加 Cookie 之后，浏览器的响应头中会包含一个 `Set-Cookie` 属性，同时，在重定向之后，我们的请求头中，会携带此 Cookie 作为一个属性，同时，我们可以直接通过 `HttpServletRequest` 来快速获取有哪些 Cookie 信息。
![点击查看源网页](https://s2.loli.net/2023/03/06/3JcLpr9GYMnbBHw.jpg)
一个 Cookie 包含哪些信息：
* name   -   Cookie 的名称，Cookie 一旦创建，名称便不可更改
* value  -   Cookie 的值，如果值为 Unicode 字符，需要为字符编码。如果为二进制数据，则需要使用 BASE 64 编码
* maxAge  -  Cookie 失效的时间，单位秒。如果为正数，则该 Cookie 在 maxAge 秒后失效。如果为负数，该 Cookie 为临时 Cookie，关闭浏览器即失效，浏览器也不会以任何形式保存该 Cookie。如果为 0，表示删除该 Cookie。默认为-1。
* secure  -  该 Cookie 是否仅被使用安全协议传输。安全协议。安全协议有 HTTPS，SSL 等，在网络上传输数据之前先将数据加密。默认为 false。
* path  -  Cookie 的使用路径。如果设置为“/sessionWeb/”，则只有 contextPath 为“/sessionWeb”的程序可以访问该 Cookie。如果设置为“/”，则本域名下 contextPath 都可以访问该 Cookie。注意最后一个字符必须为“/”。
* domain  -  可以访问该 Cookie 的域名。如果设置为“. google. com”，则所有以“google. com”结尾的域名都可以访问该 Cookie。注意第一个字符必须为“.”。
* comment  -  该 Cookie 的用处说明，浏览器显示 Cookie 信息的时候显示该说明。
* version  -  Cookie 使用的版本号。0 表示遵循 Netscape 的 Cookie 规范，1 表示遵循 W 3 C 的 RFC 2109 规范

我们发现，最关键的其实是 `name`、`value`、`maxAge`、`domain` 属性。
那么我们来尝试修改一下 maxAge 来看看失效时间：
```java
cookie. setMaxAge (20);
```
设定为 20 秒，我们可以直接看到，响应头为我们设定了 20 秒的过期时间。20 秒内访问都会携带此 Cookie，而超过 20 秒，Cookie 消失。
既然了解了 Cookie 的作用，我们就可以通过使用 Cookie 来实现记住我功能，我们可以将**用户名和密码全部保存在 Cookie 中**，如果访问我们的首页时携带了这些 Cookie，那么我们就可以直接为用户进行登陆，如果登陆成功则直接跳转到首页，如果登陆失败，则清理浏览器中的 Cookie。
**（1）Cookie 存储用户信息案例**
那么首先，我们先在前端页面的表单中添加一个勾选框：
```html
<div>
    <label>
        <input type="checkbox" placeholder="记住我" name="remember-me">
        记住我
    </label>
</div>
```
接着，我们在登陆成功时进行判断，如果用户勾选了记住我，那么就讲 Cookie 存储到本地：
```java
if (map. containsKey ("remember-me")){   //若勾选了勾选框，那么会此表单信息
    Cookie cookie_username = new Cookie ("username", username);
    cookie_username. setMaxAge (30);
    Cookie cookie_password = new Cookie ("password", password);
    cookie_password. setMaxAge (30);
    resp. addCookie (cookie_username);
    resp. addCookie (cookie_password);
}
```
然后，我们修改一下默认的请求地址，现在一律通过 ` http://localhost:8080/yyds/login` 进行登陆，那么我们需要添加 GET 请求的相关处理：
```java
@Override
protected void doGet (HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    Cookie[] cookies = req. getCookies ();
    if (cookies != null){
        String username = null;
        String password = null;
        for (Cookie cookie : cookies) {
            if (cookie. getName (). equals ("username")) username = cookie. getValue ();
            if (cookie. getName (). equals ("password")) password = cookie. getValue ();
        }
        if (username != null && password != null){
            //登陆校验
            try (SqlSession sqlSession = factory. openSession (true)){
                UserMapper mapper = sqlSession. getMapper (UserMapper. class);
                User user = mapper. getUser (username, password);
                if (user != null){
                    resp. sendRedirect ("time");
                    return;   //直接返回
                }
            }
        }
    }
    req. getRequestDispatcher ("/"). forward (req, resp);   //正常情况还是转发给默认的 Servlet 帮我们返回静态页面
}
```
现在，30 秒内都不需要登陆，访问登陆页面后，会直接跳转到 time 页面。
现在已经离我们理想的页面越来越接近了，但是仍然有一个问题，就是我们的首页，无论是否登陆，所有人都可以访问，那么，如何才可以实现只有登陆之后才能访问呢？这就需要用到 Session 了。

***
# Session
由于 HTTP 是无连接的，那么如何能够辨别当前的请求是来自哪个用户发起的呢？Session 就是用来处理这种问题的，**每个用户的会话**都会**有一个自己的 Session 对象**，来自**同一个浏览器的所有请求**，就属于**同一个会话**。
但是 HTTP 协议是无连接的呀，那 Session 是如何做到辨别是否来自同一个浏览器呢？Session 实际上是基于 Cookie 实现的，前面我们了解了 Cookie，我们知道，服务端可以将 Cookie 保存到浏览器，当浏览器下次访问时，就会附带这些 Cookie 信息。
Session 也利用了这一点，它会给浏览器设定一个叫做 `JSESSIONID` 的 Cookie，值是一个随机的排列组合，而此 Cookie 就对应了你属于哪一个对话，只要我们的浏览器携带此 Cookie 访问服务器，服务器就会通过 Cookie 的值进行辨别，得到对应的 Session 对象，因此，这样就可以追踪到底是哪一个浏览器在访问服务器。
![点击查看源网页](https://s2.loli.net/2023/03/06/wCYHNg39tFcK76M.gif)
那么现在，我们在用户登录成功之后，将**用户对象添加到 Session**中，只要是此用户发起的请求，我们都可以从 `HttpSession` 中读取到存储在会话中的数据：
```java
HttpSession session = req. getSession ();
session. setAttribute ("user", user);
```
同时，如果用户没有登录就去访问首页，那么我们将发送一个重定向请求，告诉用户，需要先进行登录才可以访问：
```java
HttpSession session = req. getSession ();
User user = (User) session. getAttribute ("user");
if (user == null) {
    resp. sendRedirect ("login");
    return;
}
```
在访问的过程中，注意观察 Cookie 变化。
Session 并不是永远都存在的，它有着自己的过期时间，默认时间为 30 分钟，若超过此时间，Session 将丢失，我们可以在配置文件中修改过期时间：
```xml
<session-config>
    <session-timeout>1</session-timeout>
</session-config>
```
我们也可以在代码中使用 `invalidate` 方法来使 Session 立即失效：
```java
session. invalidate ();
```
现在，**通过 Session，我们就可以更好地控制用户对于资源的访问**，只有完成登陆的用户才有资格访问首页。
> [!NOTE] **Session 和 Cookie 区别与联系**？
> Session 和 Cookie 是在 Web 开发中用于跟踪用户状态和保持用户信息的两种常见机制。
>  1. Cookie（HTTP Cookie）是**服务器发送到用户浏览器并存储在用户本地计算机上的小型文本文件**。它包含了一些关于用户的信息，例如用户的身份认证、偏好设置等。浏览器在每次请求时都会将 Cookie 发送给服务器，以便服务器可以根据 Cookie 中的信息进行相应的处理。Cookie 可以设置过期时间，可以在**浏览器关闭后仍然保留，并且可以在不同的页面之间共享**。 
>  2. Session 是**服务器端的机制**，用于在**服务器上存储和跟踪用户的状态信息**。当用户访问网站时，服务器会为该用户创建一个唯一的会话标识（Session ID），并将该标识存储在服务器上。然后，服务器将 Session ID 发送给浏览器，通常通过 Cookie，以便在用户的后续请求中进行识别。服务器可以使用 Session 来存储用户的信息和状态，以便在用户与服务器之间的交互中进行跟踪和管理。与 Cookie 不同，Session 数据存储在服务器上，用户无法直接修改。Session ID 是在**用户登录或注销时**发生改变的。
>  总结起来，**Cookie** 存储在用户**本地**计算机上，用于存储用户信息和状态，由**浏览器管理**；而 *Session* 存储在*服务器*上，用于存储用户信息和状态，由*服务器管理*。<u>Cookie 在浏览器关闭后仍然存在，可以在不同页面间共享；而 Session 在用户关闭浏览器后通常会自动销毁。</u>

> [!NOTE]
> **Session ID 的改变通常在以下情况下发生**：
> 
> 1. 用户登录或注销：当用户登录或注销时，会话状态发生改变，旧的会话将被销毁，新的会话将被创建，因此会生成一个新的 Session ID。
>     
> 2. Session 过期：会话可以设置过期时间，如果会话超过了过期时间没有活动，会话将被销毁，并在下一次请求时生成一个新的 Session ID。
>     
> 3. 会话管理策略更改：在某些情况下，会话管理策略可能会更改，例如更改会话超时时间、更改会话存储方式等，这可能会导致生成新的 Session ID。
>     
> 4. 会话迁移：在某些情况下，会话可能需要从一个服务器迁移到另一个服务器，这可能会导致生成新的 Session ID。
>     

> 需要注意的是，Session ID 的改变并不一定意味着会话数据的丢失，会话数据可以通过新的 Session ID 进行关联和恢复。但在某些情况下，可能需要特别注意处理会话数据的转移和迁移。
# Filter
有了 Session 之后，我们就可以很好地控制用户的登陆验证了，只有授权的用户，才可以访问一些页面，但是我们需要一个一个去进行配置，还是太过复杂，能否一次性地过滤掉没有登录验证的用户呢？
**过滤器相当于在所有访问前加了一堵墙**，来自浏览器的所有访问请求都会首先经过过滤器，只有过滤器允许通过的请求，才可以顺利地到达对应的 `Servlet`，而过滤器不允许的通过的请求，我们可以自由地进行控制是否进行**重定向或是请求转发**。并且过滤器可以添加很多个，就相当于添加了很多堵墙，我们的请求只有穿过层层阻碍，才能与 Servlet 相拥，像极了爱情。
![点击查看源网页](https://s2.loli.net/2023/03/06/md9X75EToshnH8I.jpg)
添加一个过滤器非常简单，只需要实现 Filter 接口，并添加 `@WebFilter` 注解即可：
```java
@WebFilter ("/*")   //路径的匹配规则和 Servlet 一致，这里表示匹配所有请求
public class TestFilter implements Filter {
    @Override
    public void doFilter (ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
    }
}
```
这样我们就成功地添加了一个过滤器，那么添加一句打印语句看看，是否所有的请求都会经过此过滤器：
```java
HttpServletRequest request = (HttpServletRequest) servletRequest;
System. out. println (request. getRequestURL ());
```
我们发现，现在我们发起的所有请求，一律需要经过此过滤器，并且所有的请求都没有任何的响应内容。
那么如何让请求可以顺利地到达对应的 Servlet，也就是说怎么让这个请求顺利通过呢？我们只需要在最后添加一句：
```java
filterChain. doFilter (servletRequest, servletResponse);
```
那么这行代码是什么意思呢？
由于我们整个应用程序可能存在多个过滤器，那么这行代码的意思实际上是**将此请求继续传递给下一个过滤器**，当没有下一个过滤器时，才会到达对应的 Servlet 进行处理，我们可以再来创建一个过滤器看看效果：
```java
@WebFilter ("/*")
public class TestFilter 2 implements Filter {
    @Override
    public void doFilter (ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System. out. println ("我是 2 号过滤器");
        filterChain. doFilter (servletRequest, servletResponse);
    }
}
```
由于过滤器的过滤顺序是按照类名的自然排序进行的，因此我们将第一个过滤器命名进行调整。
我们发现，在经过第一个过滤器之后，会继续前往第二个过滤器，只有两个过滤器全部经过之后，才会到达我们的 Servlet 中。
![点击查看源网页](https://s2.loli.net/2023/03/06/LaDmPMWEtAB1HVF.jpg)
实际上，当 `doFilter` 方法调用时，就会**一直向下直到 Servlet**，在 Servlet 处理完成之后，又**依次返回**到最前面的 Filter，类似于递归的结构，我们添加几个输出语句来判断一下：
```java
@Override
public void doFilter (ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
    System. out. println ("我是 2 号过滤器");
    filterChain. doFilter (servletRequest, servletResponse);
    System. out. println ("我是 2 号过滤器，处理后");
}
```
```java
@Override
public void doFilter (ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
    System. out. println ("我是 1 号过滤器");
    filterChain. doFilter (servletRequest, servletResponse);
    System. out. println ("我是 1 号过滤器，处理后");
}
```
最后验证我们的结论。
同 Servlet 一样，Filter 也有对应的 HttpFilter 专用类，它针对 HTTP 请求进行了专门处理，因此我们可以直接使用 HttpFilter 来编写：
```java
public abstract class HttpFilter extends GenericFilter {
    private static final long serialVersionUID = 7478463438252262094 L;
    public HttpFilter () {
    }
    public void doFilter (ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        if (req instanceof HttpServletRequest && res instanceof HttpServletResponse) {
            this. doFilter ((HttpServletRequest) req, (HttpServletResponse) res, chain);
        } else {
            throw new ServletException ("non-HTTP request or response");
        }
    }
    protected void doFilter (HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        chain. doFilter (req, res);
    }
}
```
那么现在，我们就可以给我们的应用程序添加一个过滤器，用户在未登录情况下，只允许**静态资源和登陆页面**请求通过，登陆之后畅行无阻：
```java
@WebFilter ("/*")
public class MainFilter extends HttpFilter {
    @Override
    protected void doFilter (HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        String url = req. getRequestURL (). toString ();
        //判断是否为静态资源
        if (! url. endsWith (". js") && !url. endsWith (". css") && !url. endsWith (". png")){
            HttpSession session = req. getSession ();
            User user = (User) session. getAttribute ("user");
            //判断是否未登陆
            if (user == null && !url. endsWith ("login")){
                res. sendRedirect ("login");
                return;
            }
        }
        //交给过滤链处理
        chain. doFilter (req, res);
    }
}
```

***
# Listener
如果我们希望，在应用程序加载的时候，或是 Session 创建的时候，亦或是在 Request 对象创建的时候进行一些操作，那么这个时候，我们就可以使用监听器来实现。
![img](https://s2.loli.net/2023/03/06/xl4hzgOaSCdXHcu.png)
默认为我们提供了很多类型的监听器，我们这里就演示一下监听 Session 的创建即可：
```java
@WebListener
public class TestListener implements HttpSessionListener {
    @Override
    public void sessionCreated (HttpSessionEvent se) {
        System. out. println ("有一个 Session 被创建了");
    }
}
```
有关监听器相关内容，了解即可。

***
# 了解 JSP 页面与加载规则
前面我们已经完成了整个 Web 应用程序生命周期中所有内容的学习，我们已经完全了解，如何编写一个 Web 应用程序，并放在 Tomcat 上部署运行，以及如何控制浏览器发来的请求，通过 Session+Filter 实现用户登陆验证，通过 Cookie 实现自动登陆等操作。到目前为止，我们已经具备编写一个完整 Web 网站的能力。
在之前的教程中，我们的前端静态页面并没有与后端相结合，我们前端页面所需的数据全部需要单独向后端发起请求获取，并动态进行内容填充，这是一种典型的前后端分离写法，前端只负责要数据和显示数据，后端只负责处理数据和提供数据，这也是现在更流行的一种写法，让前端开发者和后端开发者各尽其责，更加专一，这才是我们所希望的开发模式。
JSP 并不是我们需要重点学习的内容，因为它已经过时了，使用 JSP 会导致前后端严重耦合，因此这里只做了解即可。
JSP 其实就是一种模板引擎，那么何谓模板引擎呢？顾名思义，它就是一个模板，而模板需要我们填入数据，才可以变成一个页面，也就是说，我们可以直接在前端页面中直接填写数据，填写后生成一个最终的 HTML 页面返回给前端。
首先我们来创建一个新的项目，项目创建成功后，删除 Java 目录下的内容，只留下默认创建的 jsp 文件，我们发现，在 webapp 目录中，存在一个 `index. jsp` 文件，现在我们直接运行项目，会直接访问这个 JSP 页面。
```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
</head>
<body>
<h1><%= "Hello World!" %>
</h1>
<br/>
<a href="hello-servlet">Hello Servlet</a>
</body>
</html>
```
但是我们并没有编写对应的 Servlet 来解析啊，那么为什么这个 JSP 页面会被加载呢？
实际上，我们一开始提到的两个 Tomcat 默认的 Servlet 中，一个是用于请求静态资源，还有一个就是用于处理 jsp 的：
```xml
<!-- The mappings for the JSP servlet -->
    <servlet-mapping>
        <servlet-name>jsp</servlet-name>
        <url-pattern>*. jsp</url-pattern>
        <url-pattern>*. jspx</url-pattern>
    </servlet-mapping>
```
那么，JSP 和普通 HTML 页面有什么区别呢，我们发现它的语法和普通 HTML 页面几乎一致，我们可以直接在 JSP 中编写 Java 代码，并在页面加载的时候执行，我们随便找个地方插入：
```jsp
<%
    System. out. println ("JSP 页面被加载");
%>
```
我们发现，请求一次页面，页面就会加载一次，并执行我们填写的 Java 代码。也就是说，我们可以直接在此页面中执行 Java 代码来填充我们的数据，这样我们的页面就变成了一个动态页面，使用 `<%=  %>` 来填写一个值：
```jsp
<h1><%= new Date() %></h1>
```
现在访问我们的网站，每次都会创建一个新的 Date 对象，因此每次访问获取的时间都不一样，我们的网站已经算是一个动态的网站的了。
虽然这样在一定程度上上为我们提供了便利，但是这样的写法相当于整个页面既要编写前端代码，也要编写后端代码，随着项目的扩大，整个页面会显得难以阅读，并且现在都是前后端开发人员职责非常明确的，如果要编写 JSP 页面，那就必须要招一个既会前端也会后端的程序员，这样显然会导致不必要的开销。
那么我们来研究一下，为什么 JSP 页面能够在加载的时候执行 Java 代码呢？
首先我们将此项目打包，并在 Tomcat 服务端中运行，生成了一个文件夹并且可以正常访问。
我们现在看到 `work` 目录，我们发现这个里面多了一个 `index_jsp. java` 和 `index_jsp. class`，那么这些东西是干嘛的呢，我们来反编译一下就啥都知道了：
```java
public final class index_jsp extends org. apache. jasper. runtime. HttpJspBase  //继承自 HttpServlet
    implements org. apache. jasper. runtime. JspSourceDependent,
                 org. apache. jasper. runtime. JspSourceImports {
 ...
  public void _jspService (final jakarta. servlet. http. HttpServletRequest request, final jakarta. servlet. http. HttpServletResponse response)
      throws java. io. IOException, jakarta. servlet. ServletException {
    if (! jakarta. servlet. DispatcherType. ERROR. equals (request. getDispatcherType ())) {
      final java. lang. String _jspx_method = request. getMethod ();
      if ("OPTIONS". equals (_jspx_method)) {
        response. setHeader ("Allow","GET, HEAD, POST, OPTIONS");
        return;
      }
      if (!"GET". equals (_jspx_method) && !"POST". equals (_jspx_method) && !"HEAD". equals (_jspx_method)) {
        response. setHeader ("Allow","GET, HEAD, POST, OPTIONS");
        response. sendError (HttpServletResponse. SC_METHOD_NOT_ALLOWED, "JSP 只允许 GET、POST 或 HEAD。Jasper 还允许 OPTIONS");
        return;
      }
    }
    final jakarta. servlet. jsp. PageContext pageContext;
    jakarta. servlet. http. HttpSession session = null;
    final jakarta. servlet. ServletContext application;
    final jakarta. servlet. ServletConfig config;
    jakarta. servlet. jsp. JspWriter out = null;
    final java. lang. Object page = this;
    jakarta. servlet. jsp. JspWriter _jspx_out = null;
    jakarta. servlet. jsp. PageContext _jspx_page_context = null;
    try {
      response. setContentType ("text/html; charset=UTF-8");
      pageContext = _jspxFactory. getPageContext (this, request, response,
             null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext. getServletContext ();
      config = pageContext. getServletConfig ();
      session = pageContext. getSession ();
      out = pageContext. getOut ();
      _jspx_out = out;
      out. write ("\n");
      out. write ("\n");
      out. write ("<!DOCTYPE html>\n");
      out. write ("<html>\n");
      out. write ("<head>\n");
      out. write ("    <title>JSP - Hello World</title>\n");
      out. write ("</head>\n");
      out. write ("<body>\n");
      out. write ("<h1>");
      out. print ( new Date () );
      out. write ("</h1>\n");
    System. out. println ("JSP 页面被加载");
      out. write ("\n");
      out. write ("<br/>\n");
      out. write ("<a href=\"hello-servlet\">Hello Servlet</a>\n");
      out. write ("</body>\n");
      out. write ("</html>");
    } catch (java. lang. Throwable t) {
      if (! (t instanceof jakarta. servlet. jsp. SkipPageException)){
        out = _jspx_out;
        if (out != null && out. getBufferSize () != 0)
          try {
            if (response. isCommitted ()) {
              out. flush ();
            } else {
              out. clearBuffer ();
            }
          } catch (java. io. IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context. handlePageException (t);
        else throw new ServletException (t);
      }
    } finally {
      _jspxFactory. releasePageContext (_jspx_page_context);
    }
  }
}
```
我们发现，它是继承自 `HttpJspBase` 类，我们可以反编译一下 jasper. jar（它在 tomcat 的 lib 目录中）来看看:
```java
package org. apache. jasper. runtime;
import jakarta. servlet. ServletConfig;
import jakarta. servlet. ServletException;
import jakarta. servlet. http. HttpServlet;
import jakarta. servlet. http. HttpServletRequest;
import jakarta. servlet. http. HttpServletResponse;
import jakarta. servlet. jsp. HttpJspPage;
import java. io. IOException;
import org. apache. jasper. compiler. Localizer;
public abstract class HttpJspBase extends HttpServlet implements HttpJspPage {
    private static final long serialVersionUID = 1 L;
    protected HttpJspBase () {
    }
    public final void init (ServletConfig config) throws ServletException {
        super. init (config);
        this. jspInit ();
        this._jspInit ();
    }
    public String getServletInfo () {
        return Localizer. getMessage ("jsp. engine. info", new Object[]{"3.0"});
    }
    public final void destroy () {
        this. jspDestroy ();
        this._jspDestroy ();
    }
    public final void service (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this._jspService (request, response);
    }
    public void jspInit () {
    }
    public void _jspInit () {
    }
    public void jspDestroy () {
    }
    protected void _jspDestroy () {
    }
    public abstract void _jspService (HttpServletRequest var 1, HttpServletResponse var 2) throws ServletException, IOException;
}
```
实际上，Tomcat 在加载 JSP 页面时，会将其动态转换为一个 java 类并编译为 class 进行加载，而生成的 Java 类，正是一个 Servlet 的子类，而页面的内容全部被编译为输出字符串，这便是 JSP 的加载原理，因此，JSP 本质上依然是一个 Servlet！
![image-20230306164106712](https://s2.loli.net/2023/03/06/UGJBqvOTDeX5SuM.png)
***
# Spring
Spring 就是这样的一个框架（[文档](https://docs.spring.io/spring-framework/docs/6.0.10/reference/html/core.html#spring-core)，它就是为了简化开发而生，它是轻量级的**IoC**和**AOP**的容器框架，主要是针对**Bean**的生命周期进行管理的轻量级容器，并且它的生态已经发展得极为庞大。
## IOC 容器基础
```cardlink
url: https://zhuanlan.zhihu.com/p/637355010
title: "深入理解spring-IOC<容器的设计>"
description: "spring在Java中的地位不言而喻，学习Java逃不开spring的学习。有人戏称Java程序员是spring程序员，因为，spring太强大了。它帮助Java程序员实现了很多基础功能，降低了程序员开发应用的难度。而也是有了spring的存…"
host: zhuanlan.zhihu.com
```
[深入理解spring-IOC<容器的设计> - 知乎](https://zhuanlan.zhihu.com/p/637355010)
在 Spring 框架中，IOC（Inversion of Control）是一种设计原则和实现机制，**它将对象的创建、依赖关系的管理和生命周期的控制从应用程序代码中解耦出来，交给容器来完成。**  
> 简单来说，IOC 就是由容器来控制对象的创建和管理，而不是由应用程序代码直接控制。通过 IOC，应用程序只需要定义好对象的依赖关系和配置信息，容器会根据这些信息来创建对象，并自动注入对象之间的依赖关系

**高耦合度**带来的缺点是很明显的，也是现代软件开发中很致命的问题。如果要改善这种情况，我们只能将各个模块进行解耦，让各个模块之间的依赖性不再那么地强。也就是说，Service 的实现类，不再由我们决定，而是让程序自己决定，所有的实现类对象，全部交给程序来管理，所有对象之间的关系，也由程序来动态决定，这样就引入了 IoC 理论。
**IOC**是 Inversion of Control 的缩写，翻译为：“**控制反转**”，把复杂系统分解成相互合作的对象，这些对象类通过封装以后，内部实现对外部是透明的，从而降低了解决问题的复杂度，而且可以灵活地被重用和扩展。
![](https://image.itbaima.net/markdown/2022/10/08/XsYQRk93CHewISB.png)
> 我们可以将对象交给 IoC 容器进行管理，比如当我们需要一个接口的实现时，由它根据配置文件来决定到底给我们哪一个实现类，这样，我们就可以不用再关心我们要去使用哪一个实现类了，我们只需要关心，给到我的一定是一个可以正常使用的实现类

```java
public static void main(String[] args) {
    A a = new A();
    a.test(IoC.getBean(Service.class));   //瞎编的一个容器类，但是是那个意思
    //比如现在在IoC容器中管理的Service的实现是B，那么我们从里面拿到的Service实现就是B
}
class A{
    private List<Service> list;   //一律使用Service，具体实现由IoC容器提供
    public Service test(Service b){
        return null;
    }
}
interface Service{ }   //使用Service做一个顶层抽象
class B implements Service{}  //B依然是具体实现类，并交给IoC容器管理
```
当具体实现类发生修改时，我们同样只需要将**新的实现类交给 IoC 容器管理**，这样我们无需修改之前的任何代码：
```java
interface Service{ }
class D implements Service{}   //现在实现类变成了D，但是之前的代码并不会报错
```
这样，即使我们的底层实现类发生了修改，也不会导致与其相关联的类出现错误，而进行大面积修改，通过**定义抽象+容器管理**的形式，我们就可以将**原有的强关联解除**。
**高内聚，低耦合**，是现代软件的开发的设计目标，而 Spring 框架就给我们提供了这样的一个 IoC 容器进行对象的的管理，一个由 Spring IoC 容器实例化、组装和管理的对象，我们称其为 Bean。
## 第一个 Spring 项目
首先一定要明确，使用 Spring 首要目的是为了**使得软件项目进行解耦**，而不是为了去简化代码！通过它，就可以更好的对我们的 Bean 进行管理，这一部分我们来体验一下 Spring 的基本使用。
Spring 并不是一个独立的框架，它实际上包含了很多的模块：
![image-20221121233807593](https://s2.loli.net/2022/11/21/KT2XhuCNVmcSvi5.png)
而我们首先要去学习的就是**Core Container**，也就是核心容器模块，只有了解了 Spring 的核心技术，我们才能真正认识这个框架为我们带来的便捷之处。
Spring 是一个非入侵式的框架，就像一个工具库一样，它可以很简单地加入到我们已有的项目中，因此，我们只需要直接导入其依赖就可以使用了，Spring 核心框架的 Maven 依赖坐标：
```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>6.0.10</version>
</dependency>
```
> 注意：与旧版教程不同的是，**Spring 6**要求你使用的 Java 版本为 `17` 及以上，包括后面我们在学习 SpringMvc 时，要求 Tomcat 版本必须为 10 以上。这个依赖中包含了如下依赖：

![image-20221122133820198](https://s2.loli.net/2022/11/22/HszTflPavUdQKGJ.png)
这里出现的都是 Spring 核心相关的内容，如 Beans、Core、Context、SpEL 以及非常关键的 AOP 框架，在本章中，我们都会进行讲解。
> 如果在使用 Spring 框架的过程中出现如下警告：
>
> ```
> 12 月 17, 2022 3:26:26 下午 org. springframework. core. LocalVariableTableParameterNameDiscoverer inspectClass
> 警告: Using deprecated '-debug' fallback for parameter name resolution. Compile the affected code with '-parameters' instead or avoid its introspection: XXXX
> ```
>
> 这是因为 LocalVariableTableParameterNameDiscoverer 在 Spring 6.0.1 版本已经被标记为过时，并且即将移除，请在 Maven 配置文件中为编译插件添加 `-parameters` 编译参数：
>
```xml
<build>
    <pluginManagement>
        <plugins>
            <plugin>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.10.1</version>
                <configuration>
                    <compilerArgs>
                        <arg>-parameters</arg>
                    </compilerArgs>
                </configuration>
            </plugin>
        </plugins>
    </pluginManagement>
</build>
```
> 没有此问题请无视这部分。

这里我们就来尝试编写一个最简的 Spring 项目，我们在前面已经讲过了，Spring 会给我们提供 IoC 容器用于管理 Bean，但是我们得先为这个容器编写一个配置文件，我们可以通过配置文件告诉容器需要管理哪些 Bean 以及 Bean 的属性、依赖关系等等。
首先我们需要在 resource 中创建一个 Spring 配置文件（在 resource 中创建的文件，会在编译时被一起放到类路径下），命名为 test. xml，直接右键点击即可创建：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>
```
此时 IDEA 会提示我们没有为此文件配置应用程序上下文，这里我们只需要指定成当前项目就行了，当然配置这个只是为了代码提示和依赖关系快速查看，如果不进行配置也不会影响什么，程序依然可以正常运行：
![image-20221121234427739](https://s2.loli.net/2022/11/21/bBtrSWlVz9oD2JF.png)
这里我们直接按照默认配置点确定就行了：
![image-20221121234447213](https://s2.loli.net/2022/11/21/xoatfu4nX6iRr3v.png)
Spring 为我们提供了一个 IoC 容器，用于去存放我们需要使用的对象，我们可以将对象交给 IoC 容器进行管理，当我们需要使用对象时，就可以向 IoC 容器去索要，并由它来决定给我们哪一个对象。而我们如果需要使用 Spring 为我们提供的 IoC 容器，那么就需要创建一个应用程序上下文，它代表的就是 IoC 容器，它会负责实例化、配置和组装 Bean：
```java
public static void main(String[] args) {
  	//ApplicationContext是应用程序上下文的顶层接口，它有很多种实现，这里我们先介绍第一种
  	//因为这里使用的是XML配置文件，所以说我们就使用 ClassPathXmlApplicationContext 这个实现类
    ApplicationContext context = new ClassPathXmlApplicationContext("test.xml");  //这里写上刚刚的名字
}
```
比如现在我们要让 IoC 容器帮助我们管理一个 Student 对象（Bean），当我们需要这个对象时再申请，那么就需要这样，首先先将 Student 类定义出来：
```java
package com.test.bean;
public class Student {
    public void hello(){
        System.out.println("Hello World!");
    }
}
```
既然现在要让别人帮忙管理对象，那么就不能再由我们自己去 new 这个对象了，而是编写对应的配置，我们打开刚刚创建的 `test.xml` 文件进行编辑，添加：
```java
<bean name="student" class="com.test.bean.Student"/>
```
这里我们就在配置文件中编写好了对应 Bean 的信息，之后容器就会根据这里的配置进行处理了。
现在，这个对象不需要我们再去创建了，而是由 IoC 容器自动进行创建并提供，我们可以直接从上下文中获取到它为我们创建的对象：
```java
public static void main(String[] args) {
    ApplicationContext context = new ClassPathXmlApplicationContext("test.xml");
    Student student = (Student) context.getBean("student");   //使用getBean方法来获取对应的对象（Bean）
    student.hello();
}
```
实际上，这里得到的 Student 对象是由 Spring 通过**反射机制**帮助我们创建的，初学者会非常疑惑，为什么要这样来创建对象，而不是直接 new 一个对象？为什么要交给 IoC 容器管理呢？
![image-20221122153946251](https://s2.loli.net/2022/11/22/sjLiFokU1f3CvH5.png)
## Bean 注册与配置
前面我们通过一个简单例子体验了一下如何使用 Spring 来管理我们的对象，并向 IoC 容器索要被管理的对象。这节课我们就来详细了解一下如何向 Spring 注册 Bean 以及 Bean 的相关配置。
实际上我们的配置文件可以有很多个，并且这些配置文件是可以相互导入的：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans ...>
    <import resource="test.xml"/>
</beans>
```
但是为了简单起见，我们还是从单配置文件开始讲起，首先我们需要知道如何配置 Bean 并注册。
要配置一个 Bean，只需要添加：
```xml
<bean/>
```
但是这样写的话，Spring 无法得知我们要配置的 Bean 到底是哪一个类，所以说我们还得指定对应的类才可以：
```xml
<bean class="com.test.bean.Student"/>
```
![image-20221122164149924](https://s2.loli.net/2022/11/22/SRV3znQJH4A7vDl.png)
可以看到类的旁边出现了 Bean 的图标，表示我们的 Bean 已经注册成功了，这样，我们就可以根据类型向容器索要 Bean 实例对象了：
```java
public static void main(String[] args) {
    ApplicationContext context = new ClassPathXmlApplicationContext("test.xml");
  	//getBean有多种形式，其中第一种就是根据类型获取对应的Bean
  	//容器中只要注册了对应类的Bean或是对应类型子类的Bean，都可以获取到
    Student student = context.getBean(Student.class);
    student.hello();
}
```
不过在有些时候，Bean 的获取可能会出现歧义，我们可以来分别注册两个子类的 Bean：
```java
public class ArtStudent extends Student{
  	public void art(){
        System.out.println("我爱画画");
    }
}
```
```java
public class SportStudent extends Student{
		public void sport(){
        System.out.println("我爱运动");
    }
}
```
```xml
<bean class="com.test.bean.ArtStudent"/>
<bean class="com.test.bean.SportStudent"/>
```
但是此时我们在获取 Bean 时却是**索要的它们的父类**：
```java
Student student = context.getBean(Student.class);
student.hello();
```
运行时得到如下报错：
![image-20221122164100561](https://s2.loli.net/2022/11/22/vliWJ4SZdx5E6yX.png)
这里出现了一个**Bean 定义不唯一异常**，很明显，因为我们需要的类型是 Student，但是此时有两个 Bean 定义都满足这个类型，它们都是 Student 的子类，此时 IoC 容器不知道给我们返回哪一个 Bean，所以就只能抛出异常了。
因此，如果我们需要一个 Bean 并且使用类型进行获取，那么必须要指明类型并且不能出现歧义：
```java
ArtStudent student = context.getBean(ArtStudent.class);
student.art();
```
那要是两个 Bean 的类型都是一样的呢？
```java
<bean class="com.test.bean.Student"/>
<bean class="com.test.bean.Student"/>
```
这种情况下，就无法使用 Class 来进行区分了，除了为 Bean 指定对应类型之外，我们也可以为 Bean**指定一个名称**用于区分：
```xml
<bean name="art" class="com.test.bean.ArtStudent"/>
<bean name="sport" class="com.test.bean.SportStudent"/>
```
name 属性就是为这个 Bean 设定一个独一无二的名称（**id 属性也可以，跟 name 功能相同**，但是会检查命名是否规范，否则会显示黄标），不同的 Bean 名字不能相同，否则报错：
```xml
<bean name="a" class="com.test.bean.Student"/>
<bean name="b" class="com.test.bean.Student"/>
```
这样，这两个 Bean 我们就可以区分出来了：
```java
Student student = (Student) context.getBean("a");
student.hello();
```
虽然目前这两 Bean 定义都是一模一样的，也没什么区别，但是这确实是两个不同的 Bean，只是类型一样而已，之后我们还可以为这两个 Bean 分别设置不同的其他属性。
我们可以给 Bean 起名字，也可以**起别名**，就行我们除了有一个名字之外，可能在家里还有自己的小名：
```xml
<bean name="a" class="com.test.bean.Student"/>
<alias name="a" alias="test"/>
```
这样，我们使用别名也是可以拿到对应的 Bean 的：
```java
Student student = (Student) context.getBean("test");
student.hello();
```
那么现在又有新的问题了，IoC 容器创建的 Bean 是只有一个还是每次索要的时候都会给我们一个新的对象？我们现在在主方法中连续获取两次 Bean 对象：
```java
Student student1 = context.getBean(Student.class);
Student student2 = context.getBean(Student.class);
System.out.println(student1 == student2);   //默认为单例模式，对象始终为同一个
```
我们发现，最后得到的结果为 true，那么说明每次从 IoC 容器获取到的对象，始终都是同一个，默认情况下，***通过 IoC 容器进行管理的 Bean 都是单例模式（默认为饿汉式单例模式，IOC 容器创建时就新建了 Bean 实例）的，这个对象只会被创建一次***。
如果我们希望每次拿到的对象都是一个新的，我们也可以将其作用域进行修改：
![image-20221122175719997](https://s2.loli.net/2022/11/22/hDGo7m9uBlgVn5A.png)
这里一共有两种作用域，第一种是 `singleton`，默认情况下就是这一种，当然还有 `prototype`，表示为**原型模式**（为了方便叫多例模式也行）这种模式每次得到的对象都是一个新的：
```java
Student student1 = context.getBean(Student.class);  //原型模式下，对象不再始终是同一个了
Student student2 = context.getBean(Student.class);
System.out.println(student1 == student2);
```
> 实际上，当 Bean 的作用域为单例模式时，那么它会在一开始（容器加载配置时）就被创建，我们之后拿到的都是这个对象。而处于原型模式下，只有在获取时才会被创建，也就是说，单例模式下，Bean 会被 IoC 容器存储，只要容器没有被销毁，那么此对象将一直存在，而原型模式才是相当于在要用的时候直接 new 了一个对象，并不会被保存。

当然，如果我们希望单例模式下的 Bean 不用再一开始就加载，而是一样等到需要时再加载（加载后依然会被容器存储，之后一直使用这个对象了，不会再创建新的）我们也可以**开启懒加载**：
```xml
<bean class="com.test.bean.Student" lazy-init="true"/>
```
> 开启*懒加载*后，只有在真正第一次使用时才会创建对象。

因为单例模式下 Bean 是由 IoC 容器加载，但是加载顺序我们并不清楚，如果我们需要维护 Bean 的加载顺序（比如某个 Bean 必须要在另一个 Bean 之前创建）那么我们可以使用 `depends-on` 来设定前置加载 Bean，这样被依赖的 Bean 一定会在之前加载，比如 Teacher 应该在 Student 之前加载：
```xml
<bean name="teacher" class="com.test.bean.Teacher"/>
<bean name="student" class="com.test.bean.Student" depends-on="teacher"/>
```
这样就可以保证 Bean 的加载顺序了。
## 依赖注入
依赖注入 (Dependency Injection, DI)是一种设计模式，也是 Spring 框架的核心概念之一。现在我们已经了解了如何注册和使用一个 Bean，但是这样还远远不够，还记得我们一开始说的，消除类之间的强关联吗？比如现在有一个教师接口：
```java
public interface Teacher {
    void teach();
}
```
具体的实现有两个：
```java
public class ArtTeacher implements Teacher{
    @Override
    public void teach() {
        System.out.println("我是美术老师，我教你画画！");
    }
}
```
```java
public class ProgramTeacher implements Teacher{
    @Override
    public void teach() {
        System.out.println("我是编程老师，我教你学Golang！");
    }
}
```
我们的学生一开始有一个老师教他，比如美术老师：
```java
public class Student {
    private Teacher teacher = new ArtTeacher();   
  	//在以前，如果我们需要制定哪个老师教我们，直接new创建对应的对象就可以了
    public void study(){
        teacher.teach();
    }
}
```
但是我们发现，如果美术老师不教了，现在来了一个其他的老师教学生，那么就需要去修改 Student 类的定义：
```java
public class Student {
    private Teacher teacher = new ProgramTeacher();
  	...
```
可以想象一下，如果现在冒出来各种各样的类都需要这样去用 Teacher，那么一旦 Teacher 的实现发生变化，会导致我们挨个对之前用到 Teacher 的类进行修改，这就很难受了。
而有了依赖注入之后，Student 中的 Teacher 成员变量，可以由 IoC 容器来选择一个合适的 Teacher 对象进行赋值，也就是说，IoC 容器在创建对象时，需要将我们预先给定的属性注入到对象中，非常简单，我们可以使用 `property` 标签来实现，我们将 bean 标签展开：
```xml
<bean name="teacher" class="com.test.bean.ProgramTeacher"/>
<bean name="student" class="com.test.bean.Student">
    <property name="teacher" ref="teacher"/>
</bean>
```
同时我们还需要修改一下 Student 类，依赖注入要求对应的属性必须有一个 set 方法：
```java
public class Student {
    private Teacher teacher;
  	//要使用依赖注入，我们必须提供一个set方法（无论成员变量的访问权限是什么）命名规则依然是驼峰命名法
    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }
    ...
```
![image-20221122191025279](https://s2.loli.net/2022/11/22/wu2EYC8HToJbsva.png)
使用 `property` 来指定需要**注入的值或是一个 Bean**，这里我们选择 ProgramTeacher，那么在使用时，Student 类中的得到的就是这个 Bean 的对象了：
```java
Student student = context.getBean(Student.class);
student.study();
```
![image-20221122191109690](https://s2.loli.net/2022/11/22/n3zYWvIoE8CrRDT.png)
可以看到，现在我们的 Java 代码中，没有出现任何的具体实现类信息（ArtTeacher、ProgramTeacher 都没出现）取而代之的是那一堆 xml 配置，这样，就算我们切换老师的实现为另一个类，也不用去调整代码，只需要变动一下 Bean 的类型就可以：
```xml
<!--  只需要修改这里的class即可，现在改为ArtTeacher  -->
<bean name="teacher" class="com.test.bean.ArtTeacher"/>
<bean name="student" class="com.test.bean.Student">
    <property name="teacher" ref="teacher"/>
</bean>
```
这样，这个 Bean 的 class 就变成了新的类型，并且我们不需要再去调整其他位置的代码，再次启动程序：
![image-20221122191427776](https://s2.loli.net/2022/11/22/evKArqDYcIQPCXT.png)
通过依赖注入，是不是开始逐渐感受到 Spring 为我们带来的便利了？当然，依赖注入并不一定要注入其他的 Bean，也可以是一个简单的值：
```java
<bean name="student" class="com.test.bean.Student">
    <property name="name" value="卢本伟"/>
</bean>
```
直接使用 `value` 可以直接传入一个具体值。
实际上，在很多情况下，类中的某些参数是在构造方法中就已经完成的初始化，而不是创建之后，比如：
```java
public class Student {
    private final Teacher teacher;   //构造方法中完成，所以说是一个final变量
    public Student(Teacher teacher){   //Teacher属性是在构造方法中完成的初始化
        this.teacher = teacher;
    }
  	...
```
我们前面说了，Bean 实际上是由 IoC 容器进行创建的，但是现在我们修改了默认的无参构造，可以看到配置文件里面报错了：
![image-20221122174328107](https://s2.loli.net/2022/11/22/5HN8GKQywWaYvrF.png)
很明显，是因为我们修改了构造方法，IoC 容器默认只会调用无参构造，所以，我们需要指明一个可以用的构造方法，我们展开 bean 标签，添加一个 `constructor-arg` 标签：
```xml
<bean name="teacher" class="com.test.bean.ArtTeacher"/>
<bean name="student" class="com.test.bean.Student">
    <constructor-arg name="teacher" ref="teacher"/>
</bean>
```
这里的 `constructor-arg` 就是构造方法的一个参数，这个参数可以写很多个，会自动匹配符合里面参数数量的构造方法，这里匹配的就是我们刚刚编写的需要一个参数的构造方法。
![image-20221122191427776](https://s2.loli.net/2022/11/22/evKArqDYcIQPCXT.png)
通过这种方式，我们也能实现依赖注入，只不过现在我们将依赖注入的时机提前到了对象构造时。
那要是出现这种情况呢？现在我们的 Student 类中是这样定义的：
```java
public class Student {
    private final String name;
    public Student(String name){
        System.out.println("我是一号构造方法");
        this.name = name;
    }
    public Student(int age){
        System.out.println("我是二号构造方法");
        this.name = String.valueOf(age);
    }
}
```
此时我们希望使用的是二号构造方法，那么怎么才能指定呢？有 2 种方式，我们可以**给标签添加类型**：
```xml
<constructor-arg value="1" type="int"/>
```
也可以指定为对应的参数名称：
```xml
<constructor-arg value="1" name="age"/>
```
反正只要能够保证我们指定的参数匹配到目标构造方法即可。
现在我们的类中出现了一个比较特殊的类型，它是一个**集合类型**：
```java
public class Student {
    private List<String> list;
    public void setList(List<String> list) {
        this.list = list;
    }
}
```
对于这种集合类型，有着特殊的支持：
```xml
<bean name="student" class="com.test.bean.Student">
  	<!--  对于集合类型，我们可以直接使用标签编辑集合的默认值  -->
    <property name="list">
        <list>
            <value>AAA</value>
            <value>BBB</value>
            <value>CCC</value>
        </list>
    </property>
</bean>
```
不仅仅是 List，Map、Set 这类常用集合类包括数组在内，都是支持这样编写的，比如 Map 类型，我们也可以使用 `entry` 来注入：
```xml
<bean name="student" class="com.test.bean.Student">
    <property name="map">
        <map>
            <entry key="语文" value="100.0"/>
            <entry key="数学" value="80.0"/>
            <entry key="英语" value="92.5"/>
        </map>
    </property>
</bean>
```
对于集合中的数据类型不为基本数据类型（**引用类型**）的参考下面的写法：
```xml
<bean name="artTeacher" class="org.example.entity.ArtTeacher"/>  
<bean name="programTeacher" class="org.example.entity.ProgramTeacher"/>  
<bean name="student" class="org.example.entity.Student">  
    <!--        方式一：通过set方法进行依赖注入-->  
    <!--        <property name="teacher" ref="teacher"/>-->    <!--        <property name="name" value="张三"/>-->    
    <!--        方式二：通过构造方法进行依赖注入-->    
    <constructor-arg name="teacher" type="java.util.List">  
        <list>  
            <ref bean="artTeacher"/>  
            <ref bean="programTeacher"/>  
        </list>  
    </constructor-arg>  
    <constructor-arg name="name" value="小赵" type="java.lang.String"/>  
</bean>
```
至此，我们就已经完成了两种依赖注入的学习：
> [!NOTE] 依赖注入方式
> * Setter 依赖注入：通过成员属性对应的 set 方法完成注入。
> * 构造方法依赖注入：通过构造方法完成注入。

## 自动装配
在之前，如果我们需要使用依赖注入的话，我们需要对 `property` 参数进行配置：
```xml
<bean name="student" class="com.test.bean.Student">
    <property name="teacher" ref="teacher"/>
</bean>
```
但是有些时候为了方便，我们也可以开启自动装配。自动装配就是让 IoC 容器自己去寻找需要填入的值，我们只需要将 set 方法提供好就可以了，这里需要添加 autowire 属性：
```xml
<bean name="student" class="com.test.bean.Student" autowire="byType"/>
```
`autowire` 属性有两个值普通，一个是 byName，还有一个是 byType，顾名思义，一个是根据类型去寻找合适的 Bean 自动装配，还有一个是根据名字去找，这样我们就不需要显式指定 `property` 了。
![image-20221122221936559](https://s2.loli.net/2022/11/22/QIBRwScq6fu4XDm.png)
此时 set 方法旁边会出现一个自动装配图标，效果和上面是一样的。
对于使用构造方法完成的依赖注入，也支持自动装配，我们只需要将 autowire 修改为：
```xml
<bean name="student" class="com.test.bean.Student" autowire="constructor"/>
```
这样，我们只需要提供一个对应参数的构造方法就可以了（这种情况默认也是 byType 寻找的）：
![image-20221122230320004](https://s2.loli.net/2022/11/22/rgl7fXJ2ZKAU8Rd.png)
这样同样可以完成自动注入：
![image-20221122191427776](https://s2.loli.net/2022/11/22/evKArqDYcIQPCXT.png)
自动化的东西虽然省事，但是太过机械，有些时候，自动装配可能会遇到一些问题，比如出现了下面的情况：
![image-20221122223048820](https://s2.loli.net/2022/11/22/SQTchJBq4G8NWyC.png)
此时，由于 `autowire` 的规则为 byType，存在两个候选 Bean，但是我们其实希望 ProgramTeacher 这个 Bean 在任何情况下都不参与到自动装配中，此时我们就可以将它的自动装配候选关闭：
```xml
<bean name="teacher" class="com.test.bean.ArtTeacher"/>
<bean name="teacher2" class="com.test.bean.ProgramTeacher" autowire-candidate="false"/>
<bean name="student" class="com.test.bean.Student" autowire="byType"/>
```
当 `autowire-candidate` 设定 false 时，这个 Bean 将不再作为自动装配的候选 Bean，此时自动装配候选就只剩下一个唯一的 Bean 了，报错消失，程序可以正常运行。
除了这种方式，我们也可以设定**primary 属性**，表示这个 Bean 作为主要的 Bean，当出现歧义时，也会优先选择：
```xml
<bean name="teacher" class="com.test.bean.ArtTeacher" primary="true"/>
<bean name="teacher2" class="com.test.bean.ProgramTeacher"/>
<bean name="student" class="com.test.bean.Student" autowire="byType"/>
```
> [!NOTE] 总结
> 1. 通过为 bean 设置 `autowire` 属性（候选值包括 `byType，byName，constructor`）实现自动装配（*为 bean 类的属性自动赋值初始化*）。
> 2. 当存在多个可被自动装配的 bean 导致 autowire 出现歧义时可通过以下两种方式之一处理：
>    - 为目标 bean**设置 primary 属性为 true**，提高优先级。
>    - 对非目标 bean 设置**autowire-candidate 为 false**，取消自动装配候选。

## 生命周期与继承
除了修改构造方法，我们也可以为 Bean 指定初始化方法和销毁方法，以便在对象创建和被销毁时执行一些其他的任务：
```java
public void init(){
    System.out.println("我是对象初始化时要做的事情！");    
}
public void destroy(){
    System.out.println("我是对象销毁时要做的事情！");
}
```
我们可以通过 `init-method` 和 `destroy-method` 来指定：
```xml
<bean name="student" class="com.test.bean.Student" init-method="init" destroy-method="destroy"/>
```
那么什么时候是初始化，什么时候又是销毁呢？
```java
//当容器创建时，默认情况下Bean都是单例的，那么都会在一开始就加载好，对象构造完成后，会执行init-method
ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("test.xml");
//我们可以调用close方法关闭容器，此时容器内存放的Bean也会被一起销毁，会执行destroy-method
context.close();
```
所以说，最后的结果为：
![image-20221123132604262](https://s2.loli.net/2022/11/23/GWIyPDOaK4TAM1N.png)
> 注意，如果 Bean 不是单例模式，而是采用的原型模式，那么就只会在获取时才创建，并调用 init-method，而对应的销毁方法不会被调用（因此，对于原型模式下的 Bean，Spring 无法顾及其完整生命周期，而在单例模式下，Spring 能够从 Bean 对象的创建一直管理到对象的销毁）官方文档原文如下：
> In contrast to the other scopes, Spring does not manage the complete lifecycle of a prototype bean. The container instantiates, configures, and otherwise assembles a prototype object and hands it to the client, with no further record of that prototype instance. Thus, although initialization lifecycle callback methods are called on all objects regardless of scope, in the case of prototypes, configured destruction lifecycle callbacks are not called. The client code must clean up prototype-scoped objects and release expensive resources that the prototype beans hold. To get the Spring container to release resources held by prototype-scoped beans, try using a custom [bean post-processor](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-extension-bpp), which holds a reference to beans that need to be cleaned up.

Bean 之间也是具备**继承关系**的，只不过这里的继承并不是类的继承，而是**属性的继承**，比如：
```java
public class SportStudent {
    private String name;
    public void setName(String name) {
        this.name = name;
    }
}
```
```java
public class ArtStudent {
    private String name;
    public void setName(String name) {
        this.name = name;
    }
}
```
此时，我们先将 ArtStudent 注册一个 Bean：
```xml
<bean name="artStudent" class="com.test.bean.ArtStudent">
    <property name="name" value="小明"/>
</bean>
```
这里我们会注入一个 name 的初始值，此时我们创建了一个 SportStudent 的 Bean，我们希望这个 Bean 的属性跟刚刚创建的 Bean 属性是一样的，那么我们可以写一个一模一样的：
```xml
<bean class="com.test.bean.SportStudent">
    <property name="name" value="小明"/>
</bean>
```
但是如果属性太多的话，是不是写起来有点麻烦？这种情况，我们就可以配置 Bean 之间的继承关系了，我们可以让 SportStudent 这个 Bean 直接继承 ArtStudent 这个 Bean 配置的属性：
```xml
<bean class="com.test.bean.SportStudent" parent="artStudent"/>
```
这样，在 ArtStudent Bean 中配置的属性，会直接继承给 SportStudent Bean（注意，所有配置的属性，在子 Bean 中必须也要存在，并且可以进行注入，否则会出现错误）当然，如果子类中某些属性比较特殊，也可以在继承的基础上单独配置：
```xml
<bean name="artStudent" class="com.test.bean.ArtStudent" abstract="true">
    <property name="name" value="小明"/>
    <property name="id" value="1"/>
</bean>
<bean class="com.test.bean.SportStudent" parent="artStudent">
    <property name="id" value="2"/>
</bean>
```
如果我们只是希望某一个 Bean 仅作为一个**配置模版供其他 Bean 继承使用，那么我们可以将其配置为 abstract**，这样，容器就不会创建这个 Bean 的对象了：
```xml
<bean name="artStudent" class="com.test.bean.ArtStudent" abstract="true">
    <property name="name" value="小明"/>
</bean>
<bean class="com.test.bean.SportStudent" parent="artStudent"/>
```
注意，一旦声明为**抽象 Bean**，那么就**无法通过容器获取到其实例化对象**。
![image-20221123140409416](https://s2.loli.net/2022/11/23/SyDkvOldB7ETW4z.png)
不过 Bean 的继承使用频率不是很高，了解就行。
这里最后再提一下，我们前面已经学习了各种各样的 Bean 配置属性，如果我们希望**整个上下文中所有的 Bean 都采用某种配置**，我们可以在**最外层的 beans 标签中进行默认配置**：
![image-20221123141221259](https://s2.loli.net/2022/11/23/KzSUJXa4jBfO9rd.png)
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
       xmlns="http://www.springframework.org/schema/beans"  
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">  
    <!--        配置模板bean仅用于子bean继承属性-->  
    <bean name="template" class="org.example.entity.Student" abstract="true">  
        <property name="name" value="小张"/>  
    </bean>  
    <bean name="art" class="org.example.entity.ArtTeacher" primary="true" parent="template"/>  
    <bean name="program" class="org.example.entity.ProgramTeacher" autowire-candidate="false"  
          parent="template"/>  
    <!--    <bean name="student" class="org.example.entity.Student" autowire="constructor" init-method="init"-->  
    <!--          destroy-method="destroy">-->    <!--        &lt;!&ndash;        方式一：通过set方法进行依赖注入&ndash;&gt;-->    <!--        &lt;!&ndash;        <property name="teacher" ref="teacher"/>&ndash;&gt;-->    <!--        &lt;!&ndash;        <property name="name" value="张三"/>&ndash;&gt;-->    <!--        &lt;!&ndash;        方式二：通过构造方法进行依赖注入&ndash;&gt;-->    <!--        &lt;!&ndash;        <constructor-arg name="teacher" type="java.util.List">&ndash;&gt;-->    <!--        &lt;!&ndash;            <list>&ndash;&gt;-->    <!--        &lt;!&ndash;                <ref bean="artTeacher"/>&ndash;&gt;-->    <!--        &lt;!&ndash;                <ref bean="programTeacher"/>&ndash;&gt;-->    <!--        &lt;!&ndash;            </list>&ndash;&gt;-->    <!--        &lt;!&ndash;        </constructor-arg>&ndash;&gt;-->    <!--        &lt;!&ndash;        <constructor-arg name="name" value="小赵" type="java.lang.String"/>&ndash;&gt;-->    <!--    </bean>-->  
    <!--    只需要修改IOC容器中管理的类，即可动态改变具体实现类-->    <!--    <bean name="aservice" class="org.example.service.Aservice"/>-->    <!--    <bean name="bservice" class="org.example.service.Bservice" lazy-init="true" depends-on="artStudent"/>-->    <!--    <bean name="artStudent" class="org.example.entity.ArtStudent" depends-on="student"/>-->    <!--    <bean name="sportStudent" class="org.example.entity.SportStudent" depends-on="student"/>-->    <!--    <alias name="student" alias="freer"/>--></beans>
```
这样，即使 Bean 没有配置某项属性，但是只要在最外层编写了默认配置，那么同样会生效，除非 Bean 自己进行配置覆盖掉默认配置。
> [!NOTE] 总结
> 1. 通过为 bean 设置 `init-method` 和 `destroy-method` 属性指定 **bean 实例的初始化和销毁所调用的方法**。
> 2. bean 可以继承，通过配置 `parent` 属性继承父 bean，一般用于**继承父 bean 的属性**。
> 3. 可以为 `beans` 设置**默认全局配置**包括 `default-autowire，default-init/destroy-method，default-lazy-init` 等。

## 工厂模式和工厂 Bean
前面我们介绍了 IoC 容器的 Bean 创建机制，默认情况下，容器会调用 Bean 对应类型的构造方法进行对象创建，但是在某些时候，我们可能不希望外界使用类的构造方法完成对象创建，比如在工厂方法设计模式中（详情请观看《Java 设计模式》篇视频教程）我们更希望 Spring 不要直接利用反射机制通过构造方法创建 Bean 对象，而是利用反射机制先找到对应的工厂类，然后利用工厂类去生成需要的 Bean 对象：
```java
public class Student {
    Student () {
        System.out.println ("我被构造了");
    }
}
```
```java
public class StudentFactory {
    public static Student getStudent (){
      	System.out.println ("欢迎光临电子厂");
        return new Student ();
    }
}
```
此时 Student 有一个工厂，我们正常情况下需要使用工厂才可以得到 Student 对象，现在我们希望 Spring 也这样做，不要直接去反射搞构造方法创建，我们可以通过 factory-method 进行指定：
```xml
<bean class="com.test.bean.StudentFactory" factory-method="getStudent"/>
```
注意，这里的 Bean 类型需要填写为 Student 类的工厂类，并且添加 factory-method 指定对应的工厂方法，但是最后注册的是工厂方法的返回类型，所以说依然是 Student 的 Bean：
![image-20221123143302785](https://s2.loli.net/2022/11/23/5Id43xPneJiWfZs.png)
此时我们再去进行获取，拿到的也是通过工厂方法得到的对象：
![image-20221123143347376](https://s2.loli.net/2022/11/23/l8HzN7Rwthqrim5.png)
这里有一个误区，千万不要认为是我们注册了 StudentFactory 这个 Bean，class 填写为这个类这个只是为了告诉 Spring 我们的工厂方法在哪个位置，真正注册的是工厂方法提供的东西。
可以发现，当我们采用工厂模式后，我们就无法再通过配置文件对 Bean 进行依赖注入等操作了，而是只能在工厂方法中完成，这似乎与 Spring 的设计理念背道而驰？
当然，可能某些工厂类需要构造出对象之后才能使用，我们也可以将某个工厂类直接注册为工厂 Bean：
```java
public class StudentFactory {
    public Student getStudent (){
        System.out.println ("欢迎光临电子厂");
        return new Student ();
    }
}
```
现在需要 StudentFactory 对象才可以获取到 Student，此时我们就只能先将其注册为 Bean 了：
```xml
<bean name="studentFactory" class="com.test.bean.StudentFactory"/>
```
像这样将工厂类注册为 Bean，我们称其为工厂 Bean，然后再使用 `factory-bean` 来指定 Bean 的工厂 Bean：
```xml
<bean factory-bean="studentFactory" factory-method="getStudent"/>
```
注意，使用 factory-bean 之后，不再要求指定 class，我们可以直接使用了：
![image-20221123164134470](https://s2.loli.net/2022/11/23/ih1Af7xBdX3ebaG.png)
此时可以看到，工厂方法上同样有了图标，这种方式，由于工厂类被注册为 Bean，此时我们就可以在配置文件中为工厂 Bean 配置依赖注入等内容了。
这里还有一个很细节的操作，如果我们想获取工厂 Bean 为我们提供的 Bean，可以直接输入工厂 Bean 的名称，这样不会得到工厂 Bean 的实例，而是工厂 Bean 生产的 Bean 的实例：
```java
Student bean = (Student) context.getBean ("studentFactory");
```
当然，如果我们需要获取工厂类的实例，可以在名称前面添加 `&` 符号：
```java
StudentFactory bean = (StudentFactory) context.getBean ("&studentFactory");
```
又是一个小细节。
> [!NOTE] 总结
> 工厂 bean 可以**间接创建 bean**从而**代替构造方法或者 setter**直接创建 bean，从而实现 bean 实例化过程中其他的逻辑功能，借助工厂 bean 实例化需要的 bean 有以下两种方式：
>    1. 写工厂类并添加 **get 产品 bean 的静态方法**，在 `xml` 配置文件中**注册工厂 bean 并设置 factory-method 方法**指定实例化产品 **bean 的静态方法**。
>    2. 写工厂类并添加 **get 产品 bean 的对象方法**，然后实现 `FactoryBean<产品类>` 接口并**重写 getObject（return get 产品 bean）和 getObjectType（return 产品 bean. class）** 方法，接着**注册工厂 bean** 即可（不用配置 `factory-method`）

## 使用注解开发
使用配置文件进行配置，貌似有点太累了吧？可以想象一下，如果我们的项目非常庞大，整个配置文件将会充满 Bean 配置，并且会继续庞大下去，能否有一种更加高效的方法能够省去配置呢？还记得我们在 JavaWeb 阶段用到的非常方便东西吗？没错，就是注解。
既然现在要使用注解来进行开发，那么我们就删掉之前的 xml 配置文件吧，我们来看看使用注解能有多方便。
```java
ApplicationContext context = new AnnotationConfigApplicationContext ();
```
现在我们使用 AnnotationConfigApplicationContext 作为上下文实现，它是注解配置的。
既然现在采用注解，我们就需要使用类来编写配置文件，在之前，我们如果要编写一个配置的话，需要：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns=" http://www.springframework.org/schema/beans"
       xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation=" http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>
```
现在我们只需要创建一个配置类就可以了：
```java
@Configuration
public class MainConfiguration {
}
```
这两者是等价的，同样的，在一开始会提示我们没有配置上下文：
![image-20221123175555433](https://s2.loli.net/2022/11/23/YNl5nVkfJriogdD.png)
这里按照要求配置一下就可以，同上，这个只是会影响 IDEA 的代码提示，不会影响程序运行。
我们可以为 AnnotationConfigApplicationContext 指定一个默认的配置类：
```java
ApplicationContext context = new AnnotationConfigApplicationContext (MainConfiguration. class);
//这个构造方法可以接收多个配置类（更准确的说是多个组件）
```
那么现在我们该如何配置 Bean 呢？
```java
@Configuration
public class MainConfiguration {
    @Bean ("student")
    public Student student (){
        return new Student ();
    }
}
```
这样写相对于配置文件中的：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns=" http://www.springframework.org/schema/beans"
       xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation=" http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean name = "student" class="com.test.bean.Student"/>
</beans>
```
通过 `@Import` 还可以引入其他配置类：
```java
@Import (LBWConfiguration. class)  //在讲解到 Spring 原理时，我们还会遇到它，目前只做了解即可。
@Configuration
public class MainConfiguration {
```
只不过现在变成了由 Java 代码为我们提供 Bean 配置，这样会更加的灵活，也更加便于控制 Bean 对象的创建。
```java
ApplicationContext context = new AnnotationConfigApplicationContext (MainConfiguration. class);
Student student = context.getBean (Student. class);
System.out.println (student);
```
使用方法是相同的，这跟使用 XML 配置是一样的。
那么肯定就有小伙伴好奇了，我们之前使用的那么多特性在哪里配置呢？首先，初始化方法和摧毁方法、自动装配可以直接在@Bean 注解中进行配置：
```java
@Bean (name = "", initMethod = "", destroyMethod = "", autowireCandidate = false)
public Student student (){
    return new Student ();
}
```
其次，我们可以使用一些其他的注解来配置其他属性，比如：
```java
@Bean
@Lazy (true)     //对应 lazy-init 属性
@Scope ("prototype")    //对应 scope 属性
@DependsOn ("teacher")    //对应 depends-on 属性
public Student student (){
    return new Student ();
}
```
对于那些我们需要通过构造方法或是 Setter 完成依赖注入的 Bean，比如：
```xml
<bean name="teacher" class="com.test.bean.ProgramTeacher"/>
<bean name="student" class="com.test.bean.Student">
    <property name="teacher" ref="teacher"/>
</bean>
```
像这种需要引入其他 Bean 进行的注入，我们可以直接将其作为形式参数放到方法中：
```java
@Configuration
public class MainConfiguration {
    @Bean
    public Teacher teacher (){
        return new Teacher ();
    }
    @Bean
    public Student student (Teacher teacher){
        return new Student (teacher);
    }
}
```
此时我们可以看到，旁边已经出现图标了：
![image-20221123213527325](https://s2.loli.net/2022/11/23/wy5JtiVp8zK1bmG.png)
运行程序之后，我们发现，这样确实可以直接得到对应的 Bean 并使用。
只不过，除了这种基于构造器或是 Setter 的依赖注入之外，我们也可以直接到 Bean 对应的类中使用自动装配：
```java
public class Student {
    @Autowired   //使用此注解来进行自动装配，由 IoC 容器自动为其赋值
    private Teacher teacher;
}
```
现在，我们甚至连构造方法和 Setter 都不需要去编写了，就能直接完成自动装配，是不是感觉比那堆配置方便多了？
当然，@Autowired 并不是只能用于字段，对于构造方法或是 Setter，它同样可以：
```java
public class Student {
    private Teacher teacher;
    @Autowired
    public void setTeacher (Teacher teacher) {
        this. teacher = teacher;
    }
}
```
*@Autowired 默认采用 byType 的方式*进行自动装配，也就是说会使用类型进行配，那么要是出现了多个相同类型的 Bean，如果我们想要指定使用其中的某一个该怎么办呢？
```java
@Bean ("a")
public Teacher teacherA (){
    return new Teacher ();
}
@Bean ("b")
public Teacher teacherB (){
    return new Teacher ();
}
```
此时，我们可以配合 `@Qualifier 进行名称匹配`：
```java
public class Student {
    @Autowired
    @Qualifier ("a")   //匹配名称为 a 的 Teacher 类型的 Bean
    private Teacher teacher;
}
```
这里需要提一下，在我们旧版本的 SSM 教程中讲解了 `@Resource` 这个注解，但是现在它没有了。
随着 Java 版本的更新迭代，某些 javax 包下的包，会被逐渐弃用并移除。在 JDK 11 版本以后，javax. annotation 这个包被移除并且更名为 `jakarta. annotation`（我们在 JavaWeb 篇已经介绍过为什么要改名字了）其中有一个非常重要的注解，叫做@Resource，它的作用与@Autowired 时相同的，也可以实现自动装配，但是在 IDEA 中并不推荐使用@Autowired 注解对成员字段进行自动装配，而是推荐使用@Resource，如果需要使用这个注解，还需要额外导入包：
```xml
<dependency>
    <groupId>jakarta. annotation</groupId>
    <artifactId>jakarta. annotation-api</artifactId>
    <version>2.1.1</version>
</dependency>
```
使用方法一样，直接替换掉就可以了：
```java
public class Student {
    @Resource
    private Teacher teacher;
}
```
只不过，他们两有些机制上的不同：
> - @Resource 默认**ByName**如果找不到则**ByType**，可以添加到 **set 方法、字段**上。
> - @Autowired 默认是**byType**，只会根据类型寻找，可以添加在**构造方法、set 方法、字段、方法参数**上。
> 因为@Resource 的匹配机制更加合理高效，因此官方并不推荐使用@Autowired 字段注入，当然，实际上 Spring 官方更推荐我们使用基于构造方法或是 Setter 的@Autowired 注入，比如 Setter 注入的一个好处是，Setter 方法使该类的对象能够在以后重新配置或重新注入。其实，最后使用哪个注解，还是看你自己，要是有强迫症不能忍受黄标但是又实在想用字段注入，那就用@Resource 注解。
> 除了这个注解之外，还有 `@PostConstruct 和@PreDestroy`，它们效果和 `init-method 和 destroy-method` 是一样的：
```java
@PostConstruct
public void init (){
    System. out. println ("我是初始化方法");
}
@PreDestroy
public void destroy (){
    System. out. println ("我是销毁方法");
}
```
我们只需要将其添加到对应的方法上即可：
```java
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext (MainConfiguration. class);
Student student = context. getBean (Student. class);
context. close ();
```
![image-20221123225232979](https://s2.loli.net/2022/11/23/wXRuAjVF2ykCOJ4.png)
可以看到效果是完全一样的，这些注解都是 jakarta. annotation 提供的
前面我们介绍了使用@Bean 来注册 Bean，但是实际上我们发现，如果只是简单将一个类作为 Bean 的话，这样写还是不太方便，因为都是固定模式，就是单纯的 new 一个对象出来，能不能像之前一样，让容器自己反射获取构造方法去生成这个对象呢？
肯定是可以的，我们可以在需要注册为 Bean 的类上添加 `@Component` 注解来将一个类进行注册（现在最常用的方式），不过要实现这样的方式，我们需要添加一个自动扫描来告诉 Spring，它需要在哪些包中查找我们提供的 `@Component` 声明的 Bean。
```java
@Component ("lbwnb")   //同样可以自己起名字
public class Student {
}
```
要注册这个类的 Bean，只需要添加 `@Component` 即可，然后配置一下包扫描：
```java
@Configuration
@ComponentScan ("com. test. bean")   //包扫描，这样 Spring 就会去扫描对应包下所有的类
public class MainConfiguration {
}
```
Spring 在扫描对应包下所有的类时，会自动将那些添加了@Component 的类注册为 Bean，是不是感觉很方便？只不过这种方式只适用于我们自己编写类的情况，如果是第三方包提供的类，只能使用前者完成注册，并且这种方式并不是那么的灵活。
不过，无论是通过@Bean 还是@Component 形式注册的 Bean，**Spring 都会为其添加一个默认的 name 属性**，比如：
```java
@Component
public class Student {
}
```
它的默认名称生产规则依然是类名并按照首字母小写的驼峰命名法来的，所以说对应的就是 student：
```java
Student student = (Student) context. getBean ("student");   //这样同样可以获取到
System. out. println (student);
```
同样的，如果是通过@Bean 注册的，默认名称是对应的方法名称：
```java
@Bean
public Student artStudent (){
    return new Student ();
}
```
```java
Student student = (Student) context. getBean ("artStudent");
System. out. println (student);
```
相比传统的 XML 配置方式，注解形式的配置确实能够减少我们很多工作量。并且，对于这种使用 `@Component` 注册的 Bean，如果其构造方法不是默认无参构造，那么默认会对其每一个参数都进行自动注入：
```java
@Component
public class Student {
    Teacher teacher;
    public Student (Teacher teacher){   //如果有 Teacher 类型的 Bean，那么这里的参数会被自动注入
        this. teacher = teacher;
    }
}
```
最后，对于我们之前使用的工厂模式，Spring 也提供了接口，我们可以直接实现接口表示这个 Bean 是一个工厂 Bean：
```java
@Component
public class StudentFactory implements FactoryBean<Student> {
    @Override
    public Student getObject () {   //生产的 Bean 对象
        return new Student ();
    }
    @Override
    public Class<?> getObjectType () {   //生产的 Bean 类型
        return Student. class;
    }
    @Override
    public boolean isSingleton () {   //生产的 Bean 是否采用单例模式
        return false;
    }
}
```
实际上跟我们之前在配置文件中编写是一样的，这里就不多说了。
请注意，使用注解虽然可以省事很多，代码也能变得更简洁，但是这并不代表 XML 配置文件就是没有意义的，它们有着各自的优点，在不同的场景下合理使用，能够起到事半功倍的效果，官方原文：
> Are annotations better than XML for configuring Spring?
>
> The introduction of annotation-based configuration raised the question of whether this approach is “better” than XML. The short answer is “it depends.” The long answer is that each approach has its pros and cons, and, usually, it is up to the developer to decide which strategy suits them better. Due to the way they are defined, annotations provide a lot of context in their declaration, leading to shorter and more concise configuration. However, XML excels at wiring up components without touching their source code or recompiling them. Some developers prefer having the wiring close to the source while others argue that annotated classes are no longer POJOs and, furthermore, that the configuration becomes decentralized and harder to control.
>
> No matter the choice, Spring can accommodate both styles and even mix them together. It is worth pointing out that through its [JavaConfig](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-java) option, Spring lets annotations be used in a non-invasive way, without touching the target components source code and that, in terms of tooling, all configuration styles are supported by the [Spring Tools for Eclipse](https://spring.io/tools).
> 至此，关于 Spring 的 IoC 基础部分，我们就全部介绍完了。在最后，有一个问题，现在有两个类：
```java
@Component
public class Student {
    @Resource
    private Teacher teacher;
}
```
```java
@Component
public class Teacher {
    @Resource
    private Student student;
}
```
这两个类互相需要注入对方的实例对象，这个时候 Spring 会怎么进行处理呢？如果 Bean 变成原型模式，Spring 又会怎么处理呢？
这个问题我们会在实现原理探究部分进行详细介绍。
> [!NOTE] 总结
> 通过使用**注解**来注册配置 bean 可以免去 xml 的繁琐配置，步骤如下:
>    - 首先需要写一个配置类并标注 `@Configuration` 注解和需要扫描的用 `@Component` 注解注册的 **bean**
>    - 既可以用 `@Component` 为类注册 bean，也可以手动在 Config 中用 `@Bean` 注册，bean 的属性可以通过 `@Autowire/Resource` 注解进行依赖自动装配，默认注册的 bean 的名称为*首字母小写的类名*
>    - 多个配置文件可以通过 `@Import` 还可以引入**其他配置类**，也可以注册 [[#工厂模式和工厂 Bean]]，具体如下配置：
> ```java
> 	//Config
> 	package org. example. config;  
> 	  
> 	import org. example. entity. ArtTeacher;  
> 	import org. example. entity. ProgramTeacher;  
> 	import org. example. entity. Student;  
> 	import org. example. entity. Teacher;  
> 	import org. springframework. context. annotation.*;  
> 	@Import (LBWConfiguration. class)
> 	@Configuration  
> 	@ComponentScans ({  
> 	        @ComponentScan ("org. example. entity")  
> 	})  
> 	public class MainConfiguration {  
> 	//    手动注册为 bean  
> 	//    @Bean ("art")  
> 	//    public Teacher artteacher () {  
> 	//        return new ArtTeacher ("王老师");  
> 	//    }  
> 	//  
> 	//    @Bean ("program")  
> 	//    public Teacher proteacher () {  
> 	//        return new ProgramTeacher ("赵老师");  
> 	//    }  
> 	//  
> 	//  
> 	//    @Bean ("student")  
> 	////    @DependsOn ("teacher")  
> 	//    public Student student () {  
> 	//        return new Student ();  
> 	//    }  
> 	}
> 	//Student
> 	package org. example. entity;  
> 	  
> 	import jakarta. annotation. PostConstruct;  
> 	import jakarta. annotation. PreDestroy;  
> 	import jakarta. annotation. Resource;  
> 	import lombok. AllArgsConstructor;  
> 	import lombok. Data;  
> 	import lombok. NoArgsConstructor;  
> 	import org. springframework. beans. factory. annotation. Autowired;  
> 	import org. springframework. beans. factory. annotation. Qualifier;  
> 	import org. springframework. context. annotation. Scope;  
> 	import org. springframework. stereotype. Component;  
> 	  
> 	import java. util. List;  
> 	  
> 	@Data  
> 	@AllArgsConstructor  
> 	@NoArgsConstructor  
> 	@Component  //自动注册为 bean，value 参数为 bean 名
> 	@Scope ("prototype")  //作用为设置为原型模式
> 	public class Student {  
> 	    @Qualifier ("artTeacher")  //多个候选依赖 bean 时为避免歧义指定一个
> 	    @Resource  //依赖自动装配，name 参数为依赖的 bean 名
> 	    Teacher teacher;  
> 	    String name;  
> 	  
> 	//    Student (Teacher teacher) {  
> 	//        this. teacher = teacher;  
> 	//    }  
> 	  
> 	    //    public Student (Teacher teacher) {//        this. teacher = teacher;  
> 	//    }  
> 	//  
> 	//    public Student (String name) {  
> 	//        this. name = name;  
> 	//    }  
> 	    @PostConstruct  //构造后初始化方法，类似于 xml 中的 init-method
> 	    public void init () {  
> 	        System. out. println (Student. class. getName () + " 初始化完成");  
> 	    }  
> 	  
> 	    @PreDestroy  //销毁前销毁方法，类似于 xml 中的 destroy-method
> 	    public void destroy () {  
> 	        System. out. println (this. getClass (). getName () + " 销毁完成");  
> 	    }  
> 	  
> 	    public void study () {  
> 	        teacher. teach ();  
> 	    }  
> 	//    public void setTeacher (Teacher teacher) {  
> 	//        this. teacher = teacher;  
> 	//    }  
> 	//  
> 	//    public void setName (String name) {  
> 	//        this. name = name;  
> 	//    }  
> 	}
> ```


***
## Spring 高级特性（选学）
注意：本部分为选学内容，如果 Spring 基础部分学的不是很明白，不建议看这一部分，在理解清楚之后再来看也可以，但也不是说以后就不用学了，这些东西在某些项目中可能会用到，你迟早还是要回来补的。
前面我们介绍了 Spring 的基础部分，我们接着来介绍 Spring 的一些其他高级特性。
### Bean Aware
在 Spring 中提供了一些以 Aware 结尾的接口，实现了 Aware 接口的 bean 在被初始化之后，可以获取相应资源。Aware 的中文意思为感知。**简单来说，他就是一个标识，实现此接口的类会获得某些感知能力，Spring 容器会在 Bean 被加载时，根据类实现的感知接口，会调用类中实现的对应感知方法**。
比如 BeanNameAware 之类的以 Aware 结尾的接口，这个接口获取的资源就是 BeanName：
```java
@Component
public class Student implements BeanNameAware {   //我们只需要实现这个接口就可以了
    @Override
    public void setBeanName (String name) {   //Bean 在加载的时候，容器就会自动调用此方法，将 Bean 的名称给到我们
        System. out. println ("我在加载阶段获得了 Bean 名字："+name);
    }
}
```
又比如 BeanClassLoaderAware，那么它能够使得我们可以在 Bean 加载阶段就获取到当前 Bean 的类加载器：
```java
@Component
public class Student implements BeanClassLoaderAware {
    @Override
    public void setBeanClassLoader (ClassLoader classLoader) {
        System. out. println (classLoader);
    }
}
```
> [!NOTE] Aware 总结
> Aware 特性就是当 bean 加载的过程中通过实现特定的接口对一些信息自动获取或执行特定的操作，eg：`BeanNameAware，BeanFactoryAware，ApplicationContextAware，ResourceAware等`

### 任务调度
为了执行某些任务，我们可能需要一些非常规的操作，比如我们希望使用多线程来处理我们的结果或是执行一些定时任务，到达指定时间再去执行。这时我们首先想到的就是创建一个新的线程来处理，或是使用 TimerTask 来完成定时任务，但是我们有了 Spring 框架之后，就不用这样了，因为 Spring 框架为我们提供了更加便捷的方式进行任务调度。
首先我们来看异步任务执行，需要使用 Spring 异步任务支持，我们需要在配置类上添加 `@EnableAsync` 注解。
```java
@EnableAsync
@Configuration
@ComponentScan ("com. test. bean")
public class MainConfiguration {
}
```
接着我们只需要在需要异步执行的方法上，添加 `@Async` 注解即可将此方法标记为异步，当此方法被调用时，会异步执行，也就是新开一个线程执行，而不是在当前线程执行。我们来测试一下：
```java
@Component
public class Student {
    public void syncTest () throws InterruptedException {
        System. out. println (Thread. currentThread (). getName ()+"我是同步执行的方法，开始...");
        Thread. sleep (3000);
        System. out. println ("我是同步执行的方法，结束！");
    }
    @Async
    public void asyncTest () throws InterruptedException {
        System. out. println (Thread. currentThread (). getName ()+"我是异步执行的方法，开始...");
        Thread. sleep (3000);
        System. out. println ("我是异步执行的方法，结束！");
    }
}
```
现在我们在主方法中分别调用一下试试看：
```java
public static void main (String[] args) throws InterruptedException {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext (MainConfiguration. class);
    Student student = context. getBean (Student. class);
    student. asyncTest ();   //异步执行
    student. syncTest ();    //同步执行
}
```
可以看到，我们的任务执行结果为：
![image-20221125153110860](https://s2.loli.net/2022/11/25/7VKh3dreROJUTcN.png)
很明显，异步执行的任务并不是在当前线程启动的，而是在其他线程启动的，所以说并不会在当前线程阻塞，可以看到马上就开始执行下一行代码，调用同步执行的任务了。
因此，当我们要将 Bean 的某个方法设计为异步执行时，就可以直接添加这个注解。但是需要注意，添加此注解要求方法的返回值只能是 ***void 或是 Future*** 类型才可以（Future 类型我们在 JUC 篇视频教程中有详细介绍）
还有，在使用时，可能还会出现这样的信息：
![image-20221125153426124](https://s2.loli.net/2022/11/25/7RfCIvYAZhMDPJe.png)
虽然出现了这样的信息，但是我们的程序依然可以正常运行，这是因为 Spring 默认会从容器中选择一个 `Executor` 类型（这同样是在 JUC 篇视频教程中介绍的类型）的实例，并使用它来创建线程执行任务，这是 Spring 推荐的方式，当然，如果没有找到，那么会使用自带的 SimpleAsyncTaskExecutor 处理异步方法调用。
肯定会有小伙伴疑惑，什么情况？！这个方法很明显我们并没有去编写异步执行的逻辑，那么为什么会异步执行呢？这里很明显是同步调用的方法啊。的确，如果这个 Bean 只是一个简简单单的 Student 类型的对象，确实做不到。但是它真的只是一个简简单单的 Student 类型对象吗？
```java
Student student = context. getBean (Student. class);
System. out. println (student. getClass ());   //这里我们通过 getClass 来获取一下类型，你会发现惊喜
```
我们来看看结果：
![image-20221125154133618](https://s2.loli.net/2022/11/25/qUlV5hj96YEupQM.png)
？？？这是什么东西？这实际上 Spring 帮助我们动态生成的一个代理类，我们原本的类代码已经被修改了，当然，这只是冰山一角，更多的内容，我们还会再 AOP 面向切片部分中继续为大家进行介绍，能做到这样的操作，这其实都是 AOP 的功劳。
看完了异步任务，我们接着来看定时任务，定时任务其实就是指定在哪个时候再去执行，在 JavaSE 阶段我们使用过 TimerTask 来执行定时任务。Spring 中的定时任务是全局性质的，当我们的 Spring 程序启动后，那么定时任务也就跟着启动了，我们可以在配置类上添加 `@EnableScheduling` 注解：
```java
@EnableScheduling
@Configuration
@ComponentScan ("com.test.bean")
public class MainConfiguration {
}
```
接着我们可以直接在配置类里面编写定时任务，把我们要做的任务写成方法，并添加 `@Scheduled` 注解：
```java
@Scheduled (fixedRate = 2000)   //单位依然是毫秒，这里是每两秒钟打印一次
public void task (){
    System. out. println ("我是定时任务！"+new Date ());
}
```
![image-20221125155352390](https://s2.loli.net/2022/11/25/aGv7f3eBXPsFdYr.png)
我们注意到 `@Scheduled` 中有很多参数，我们需要指定'cron', 'fixedDelay (String)', or 'fixedRate (String)'的其中一个，否则无法创建定时任务，他们的区别如下：
> - fixedDelay：在上一次定时任务执行完之后，间隔多久继续执行。
> - fixedRate：无论上一次定时任务有没有执行完成，两次任务之间的时间间隔。
> - cron：如果嫌上面两个不够灵活，你还可以使用 cron 表达式来指定任务计划。
> 这里简单讲解一下 cron 表达式： https://blog.csdn.net/sunnyzyq/article/details/98597252

> [!NOTE] Spring 异步和定时总结
> - 任务调度中异步和定时任务的用法：
>   1. 在应用配置文件中添加 `@EnableScheduling（定时任务），@EnableAsync （异步任务支持,作用于bean实现异步任务）` 注解
>   2. 在方法前添加 `@Async` 注解实现异步方法，添加 `@Scheduled` 注解实现定时任务（还要为该注解设置定时属性，包括 *cron*，*fixedDelay*，*fixedRate*等）

### 监听器
监听实际上就是等待某个事件的触发，当事件触发时，对应事件的监听器就会被通知，如果你学习过 Java Swing 篇视频教程，应该会深有体会，监听器可是很关键的，只不过在 Spring 中用的不是很频繁罢了。但是这里还是要简单介绍一下：
```java
@Component
public class TestListener implements ApplicationListener<ContextRefreshedEvent> {
    @Override
    public void onApplicationEvent (ContextRefreshedEvent event) {
        System. out. println (event. getApplicationContext ());   //可以直接通过事件获取到事件相关的东西
    }
}
```
要编写监听器，我们只需要让 Bean 继承 ApplicationListener 就可以了，并且将类型指定为对应的 Event 事件，这样，当发生某个事件时就会通知我们，比如 ContextRefreshedEvent，这个事件会在 Spring 容器初始化完成会触发一次：
![image-20221125155804255](https://s2.loli.net/2022/11/25/MZN3eohGmV17vUJ.png)
是不是感觉挺智能的？Spring 内部有各种各样的事件，当然我们也可以自己编写事件，然后在某个时刻发布这个事件到所有的监听器：
```java
public class TestEvent extends ApplicationEvent {   //自定义事件需要继承 ApplicationEvent
    public TestEvent (Object source) {
        super (source);
    }
}
```
```java
@Component
public class TestListener implements ApplicationListener<TestEvent> {
    @Override
    public void onApplicationEvent (TestEvent event) {
        System. out. println ("发生了一次自定义事件，成功监听到！");
    }
}
```
比如现在我们希望在定时任务中每秒钟发生一次这个事件：
```java
@Component
public class TaskComponent  implements ApplicationEventPublisherAware {  
  	//要发布事件，需要拿到 ApplicationEventPublisher，这里我们通过 Aware 在初始化的时候拿到
  	//实际上我们的 ApplicationContext 就是 ApplicationEventPublisher 的实现类，这里拿到的就是
  	//我们创建的 ApplicationContext 对象
    ApplicationEventPublisher publisher;
    @Scheduled (fixedRate = 1000)   //一秒一次
    public void task (){
      	//直接通过 ApplicationEventPublisher 的 publishEvent 方法发布事件
      	//这样，所有这个事件的监听器，都会监听到这个事件发生了
        publisher. publishEvent (new TestEvent (this));
    }
    @Override
    public void setApplicationEventPublisher (ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }
}
```
此时，发布事件旁边出现了图标，说明就可以了：
![image-20221125161224037](https://s2.loli.net/2022/11/25/fDxYEGPWdyMt7XF.png)
点击这个图标快速跳转到哪里监听了这个事件，运行结果：
![image-20221125161125557](https://s2.loli.net/2022/11/25/FKy1jBx3MJvVdDN.png)
这样，我们就实现了自定义事件发布和监听。
> [!NOTE] 监听器用法总结
> - 监听器实现对事件的监听并做出反应，具体使用方法：
>   1. Spring 默认为我们提供了一些**监听事件接口（ContextRefreshedEvent，ContextStartedEvent 等）**，只需要实现需要的接口并完成监听反应逻辑功能即可
>   2. 自定义事件并监听：
>      - 编写自定义事件需要继承 `ApplicationEvent` 类并实现构造方法
>      - 编写自定义监听器并实现 `ApplicationListener<~>` 接口（泛型填自定义事件），并重写 `onApplicationEvent` 响应方法
>      - 在需要应用监听器的类中注入 `ApplicationEventPublisher` 属性，并在需要被监听的方法中进行事件发布（*publisher. publishEvent (new TestEvent (this))*）


***
## SpringEL 表达式
SpEL 是一种强大，简洁的装配 Bean 的方式，它可以通过运行期间执行的表达式将值装配到我们的**属性或构造函数**当中，更可以调用 JDK 中提供的静态常量，获取外部 `Properties` 文件中的的配置。
### 外部属性注入
有些时候，我们甚至可以将一些外部配置文件中的配置进行读取，并完成注入。
我们需要创建以 `.properties` 结尾的配置文件，这种配置文件格式很简单，类似于 Map，需要一个 Key 和一个 Value，中间使用等号进行连接，这里我们在 resource 目录下创建一个 `test.properties` 文件：
```properties
test.name=只因
```
这样，Key 就是 `test. name`，Value 就是 `只因`，我们可以通过一个注解直接读取到外部配置文件中对应的属性值，首先我们需要引入这个配置文件，我们可以在配置类上添加 `@PropertySource` 注解：
```java
@Configuration
@ComponentScan ("com.test.bean")
@PropertySource ("classpath:test.properties")   //注意，类路径下的文件名称需要在前面加上 classpath:
public class MainConfiguration{
}
```
接着，我们就可以开始快乐的使用了，我们可以使用 `@Value` （自动注入基本数据类型）注解结合 *${}占位符* 将外部配置文件中的值注入到任何我们想要的位置，就像我们之前使用 `@Resource` 自动注入依赖 bean 一样：
```java
@Component
public class Student {
    @Value ("${test.name}")   //这里需要在外层套上 ${ }
    private String name;   //String 会被自动赋值为配置文件中对应属性的值
    public void hello (){
        System.out.println ("我的名字是："+name);
    }
}
```
`@Value` 中的 `${...}` 表示占位符，它会读取外部配置文件的属性值装配到属性中，如果配置正确没问题的话，这里甚至还会直接显示对应配置项的值：
![image-20221125164854022](https://s2.loli.net/2022/11/25/HDZ4l3tcreoOGh8.png)
我们来测试一下吧：
![image-20221125165145332](https://s2.loli.net/2022/11/25/g5tBKW4Sm9lXnrR.png)
如果遇到乱码的情况，请将配置文件的编码格式切换成 UTF-8（可以在 IDEA 设置中进行配置）然后在@PropertySource 注解中添加属性 `encoding = "UTF-8"` 这样就正常了，当然，其实一般情况下也很少会在配置文件中用到中文。
除了在字段上进行注入之外，我们也可以在需要注入的方法中使用：
```java
@Component
public class Student {
    private final String name;
  	//构造方法中的参数除了被自动注入外，我们也可以选择使用@Value 进行注入
    public Student (@Value ("${test. name}") String name){
        this. name = name;
    }
    public void hello (){
        System. out. println ("我的名字是："+name);
    }
}
```
当然，如果我们只是想简单的**注入一个常量值，也可以直接填入固定值**：
```java
private final String name;
public Student (@Value ("10") String name){   //只不过，这里都是常量值了，我干嘛不直接写到代码里呢
    this. name = name;
}
```
当然，@Value 的功能还远不止这些，配合 SpringEL 表达式，能够实现更加强大的功能。
### SpEL 简单使用
Spring 官方为我们提供了一套非常高级 SpEL 表达式，通过使用表达式，我们可以更加灵活地使用 Spring 框架。
首先我们来看看如何创建一个 SpEL 表达式：
```java
ExpressionParser parser = new SpelExpressionParser ();
Expression exp = parser. parseExpression ("'Hello World'");  //使用 parseExpression 方法来创建一个表达式
System. out. println (exp. getValue ());   //表达式最终的运算结果可以通过 getValue ()获取
```
这里得到的就是一个很简单的 Hello World 字符串，字符串使用单引号囊括，SpEL 是具有运算能力的。
我们可以像写 Java 一样，对这个字符串进行各种操作，比如调用方法之类的：
```java
Expression exp = parser. parseExpression ("'Hello World'. toUpperCase ()");   //调用 String 的 toUpperCase 方法
System. out. println (exp. getValue ());
```
![image-20221125173157008](https://s2.loli.net/2022/11/25/PZmheYn5EVTvURN.png)
不仅能调用方法、还可以访问属性、使用构造方法等，是不是感觉挺牛的，居然还能这样玩。
对于 `Getter` 方法，我们可以像访问属性一样去使用：
```java
//比如 String. getBytes () 方法，就是一个 Getter，那么可以写成 bytes
Expression exp = parser. parseExpression ("'Hello World'. bytes");
System. out. println (exp. getValue ());
```
表达式可以不止一级，我们可以多级调用：
```java
Expression exp = parser. parseExpression ("'Hello World'. bytes. length");   //继续访问数组的 length 属性
System. out. println (exp. getValue ());
```
我们继续来试试看构造方法，其实就是写 Java 代码，只是可以写成这种表达式而已：
```java
Expression exp = parser. parseExpression ("new String ('hello world'). toUpperCase ()");
System. out. println (exp. getValue ());
```
![image-20221125173157008](https://s2.loli.net/2022/11/25/PZmheYn5EVTvURN.png)
它甚至还支持根据特定表达式，从给定对象中获取属性出来：
```java
@Component
public class Student {
    private final String name;
    public Student (@Value ("${test. name}") String name){
        this. name = name;
    }
    public String getName () {    //比如下面要访问 name 属性，那么这个属性得可以访问才行，访问权限不够是不行的
        return name;
    }
}
```
```java
Student student = context. getBean (Student. class);
ExpressionParser parser = new SpelExpressionParser ();
Expression exp = parser. parseExpression ("name");
System. out. println (exp. getValue (student));    //直接读取对象的 name 属性
```
拿到对象属性之后，甚至还可以继续去处理：
```java
Expression exp = parser. parseExpression ("name. bytes. length");   //拿到 name 之后继续 getBytes 然后 length
```
除了获取，我们也可以调用表达式的 `setValue` 方法来设定属性的值：
```java
Expression exp = parser. parseExpression ("name");
exp. setValue (student, "刻师傅");   //同样的，这个属性得有访问权限且能 set 才可以，否则会报错
```
除了属性调用，我们也可以使用运算符进行各种**高级运算**：
```java
Expression exp = parser. parseExpression ("66 > 77");   //比较运算
System. out. println (exp. getValue ());
```
```java
Expression exp = parser. parseExpression ("99 + 99 * 3");   //算数运算
System. out. println (exp. getValue ());
```
对于那些**需要导入才能使用的类**，我们需要使用一个特殊的语法：`T (java.lang.Math).random ()`：
```java
Expression exp = parser. parseExpression ("T (java.lang.Math).random ()");   //由 T ()囊括，包含完整包名+类名
//Expression exp = parser. parseExpression ("T (System). nanoTime ()");   //默认导入的类可以不加包名
System.out.println (exp. etValue ());
```
### 集合操作相关语法
现在我们的类中存在一些集合类：
```java
@Component
public class Student {
    public Map<String, String> map = Map. of ("test", "你干嘛");
    public List<String> list = List. of ("AAA", "BBB", "CCC");
}
```
我们可以使用 SpEL 快速取出集合中的元素：
```java
Expression exp = parser. parseExpression ("map['test']");  //对于 Map 这里映射型，可以直接使用 map[key]来取出 value
System. out. println (exp. getValue (student));
```
```java
Expression exp = parser. parseExpression ("list[2]");   //对于 List、数组这类，可以直接使用[index]
System. out. println (exp. getValue (student));
```
我们也可以快速创建集合：
```java
Expression exp = parser. parseExpression ("{5, 2, 1, 4, 6, 7, 0, 3, 9, 8}"); //使用{}来快速创建 List 集合
List value = (List) exp. getValue ();
value. forEach (System. out::println);
```
```java
Expression exp = parser. parseExpression (" {{1, 2}, {3, 4}} ");   //它是支持嵌套使用的
```
```java
//创建 Map 也很简单，只需要 key: value 就可以了，怎么有股 JSON 味
Expression exp = parser. parseExpression ("{name: '小明', info: {address: '北京市朝阳区', tel: 10086}}");
System. out. println (exp. getValue ());
```
你以为就这么简单吗，我们还可以直接根据条件获取集合中的元素：
```java
@Component
public class Student {
    public List<Clazz> list = List. of (new Clazz ("高等数学", 4));
    public record Clazz (String name, int score){ }
}
```
```java
//现在我们希望从 list 中获取那些满足我们条件的元素，并组成一个新的集合，我们可以使用.? 运算符
Expression exp = parser. parseExpression ("list.?[name == '高等数学']");
System. out. println (exp. getValue (student));
```
```java
Expression exp = parser. parseExpression ("list.?[score > 3]");   //选择学分大于 3 分的科目
System. out. println (exp. getValue (student));
```
我们还可以针对某个属性创建对应的投影集合：
```java
Expression exp = parser. parseExpression ("list.![name]");   //使用.! 创建投影集合，这里创建的时课程名称组成的新集合
System. out. println (exp. getValue (student));
```
![image-20221130153142677](https://s2.loli.net/2022/11/30/yLNHPJnWkoR3Cb2.png)
我们接着来介绍**安全导航运算符**，安全导航运算符用于避免 NullPointerException，它来自 Groovy 语言。通常，当您有对对象的引用时，您可能需要在访问对象的方法或属性之前验证它是否为空。为了避免这种情况，安全导航运算符返回 null 而不是抛出异常。以下示例显示了如何使用安全导航运算符：
```java
Expression exp = parser. parseExpression ("name. toUpperCase ()");   //如果 Student 对象中的 name 属性为 null
System. out. println (exp. getValue (student));
```
![image-20221130150723018](https://s2.loli.net/2022/11/30/dojeP5kYcM7KHiv.png)
当遇到 null 时很不方便，我们还得写判断：
```java
if (student. name != null)
    System. out. println (student. name. toUpperCase ());
```
Java 8 之后能这样写：
```java
Optional. ofNullable (student. name). ifPresent (System. out::println);
```
但是你如果写过 Kotlin：
```kotlin
println (student. name?. toUpperCase ());
```
类似于这种判空问题，我们就可以直接使用安全导航运算符，SpEL 也支持这种写法：
```java
Expression exp = parser. parseExpression ("name?. toUpperCase ()");
System. out. println (exp. getValue (student));
```
当遇到空时，只会得到一个 null，而不是直接抛出一个异常：
![image-20221130150654287](https://s2.loli.net/2022/11/30/tOf3LFsWE4H8BVc.png)
我们可以将 SpEL 配合 @Value 注解或是 xml 配置文件中的 value 属性使用，比如 XML 中可以这样写：
```xml
<bean id="numberGuess" class="org.spring.samples.NumberGuess">
    <property name="randomNumber" value="#{ T(java.lang.Math).random() * 100.0 }"/>
</bean>
```
或是使用注解开发：
```java
public class FieldValueTestBean {
    @Value ("#{ systemProperties['user. region'] }")
    private String defaultLocale;
}
```
这样，我们有时候在使用配置文件中的值时，就能进行一些简单的处理了。
有关更多详细语法教程，请前往： https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#expressions-language-ref
> [!NOTE] 总结
> - 外部属性注入流程：
> 	1. 为 Class 添加 `@PropertySource ("classpath:test.properties")` 注解
> 	2. 为属性添加 `@Value("${student.name}")` 注解自动注入外部文件中的值
> - SpEL 表达式使用方法：
> 	   1. `ExpressionParser parser = new SpelExpressionParser ();` 创建 ExpressionParser
> 	   2. 书写 `Expression exp = parser. parseExpression ("'Hello World'"`) exp 表达式
> 	   3. `exp.getValue()` 取值，`exp.setValue(Class<?>,value)` 修改值，`parser.parseExpression("T(org.example.entity.Student).test()")` 调用方法
> - 常见 SpEL 表达式集合操作：
> 	1. 取元素：`parser.parseExpression("list[2]")`
> 	2. 创建集合：List：`parser.parseExpression("{{1,2},{3,4}}")`，Map：`parser.parseExpression("{name:'xixi',age:12}")`
> 	3. 条件过滤：*.?* 过滤 `parser.parseExpression("clazzList.?[score>=90 && name== '国学']")`
> 	4. 投影复制：*.!* 复制 `parser.parseExpression("clazzList.![name]")`
> 	5. 安全判空：*?.* 安全导航 `parser.parseExpression("name?.toUpperCase()")`
> 	6. 如影随形：*#{}* 表示 SpEL 表达式，注解中使用：` @Value ("#{ systemProperties['user. region'] }")`，xml 中使用：`<property name="randomNumber" value="#{ T(java.lang.Math).random() * 100.0 }"/>`

***
## AOP 面向切片
又是一个听起来很高大上的名词，AOP（Aspect Oriented Programming）思想实际上就是：在运行时，动态地将代码切入到类的指定方法、指定位置上。也就是说，我们可以使用 AOP 来帮助我们在方法执行前或执行之后，做一些额外的操作，实际上，它就是代理！
通过 AOP 我们可以在保证原有业务不变的情况下，添加额外的动作，比如我们的某些方法执行完成之后，需要打印日志，那么这个时候，我们就可以使用 AOP 来帮助我们完成，它可以批量地为这些方法添加动作。可以说，它相当于将我们原有的方法，在不改变源代码的基础上进行了增强处理。
![image-20221130155358974](https://s2.loli.net/2022/11/30/sJbSrgiAxa8Vhcv.png)
相当于我们的整个业务流程，被直接斩断，并在断掉的位置添加了一个额外的操作，再连接起来，也就是在一个切点位置插入内容。它的原理实际上就是通过动态代理机制实现的，我们在 JavaWeb 阶段已经给大家讲解过动态代理了。不过 Spring 底层并不是使用的 JDK 提供的动态代理，而是使用的第三方库实现，它能够以父类的形式代理，而不仅仅是接口。
### 使用配置实现 AOP
在开始之前，我们先换回之前的 XML 配置模式，之后也会给大家讲解如何使用注解完成 AOP 操作，注意这里我们还加入了一些新的 AOP 相关的约束进来，建议直接 CV 下面的：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns=" http://www.springframework.org/schema/beans"
       xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop=" http://www.springframework.org/schema/aop"
       xsi:schemaLocation=" http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">
</beans>
```
Spring 是支持 AOP 编程的框架之一（实际上它整合了 AspectJ 框架的一部分），要使用 AOP 我们需要先导入一个依赖：
```xml
<dependency>
    <groupId>org. springframework</groupId>
    <artifactId>spring-aspects</artifactId>
    <version>6.0.10</version>
</dependency>
```
要实现 AOP 操作，我们需要知道这些内容：
1. 需要切入的类，类的哪个方法需要被切入
2. 切入之后需要执行什么动作
3. 是在方法执行前切入还是在方法执行后切入
4. 如何告诉 Spring 需要进行切入
比如现在我们希望对这个学生对象的 `study` 方法进行增强，在不修改源代码的情况下，增加一些额外的操作：
```java
public class Student {
    public void study (){
        System. out. println ("室友还在打游戏，我狠狠的学 Java，太爽了"); 
      	//现在我们希望在这个方法执行完之后，打印一些其他的内容，在不修改原有代码的情况下，该怎么做呢？
    }
}
```
```java
<bean class="org.example.entity.Student"/>
```
那么我们按照上面的流程，依次来看，首先需要解决的问题是，找到需要切入的类，很明显，就是这个 Student 类，我们要切入的是这个 `study` 方法。
第二步，我们切入之后要做什么呢？这里我们直接创建一个新的类，并将要执行的操作写成一个方法：
```java
public class StudentAOP {
  	//这个方法就是我们打算对其进行的增强操作
    public void afterStudy () {
        System. out. println ("为什么毕业了他们都继承家产，我还倒给他们打工，我努力的意义在哪里...");
    }
}
```
注意这个类也得注册为 Bean 才可以：
```xml
<bean id="studentAOP" class="org.example.entity.StudentAOP"/>
```
第三步，我们要明确这是在方法执行之前切入还是执行之后切入，很明显，按照上面的要求，我们需要执行之后进行切入。
第四步，最关键的来了，我们怎么才能告诉 Spring 我们要进行切入操作呢？这里我们需要在配置文件中进行 AOP 配置：
```xml
<aop:config>
</aop:config>
```
接着我们需要添加一个新的切点，首先填写 ID，这个随便起都可以：
```xml
<aop:pointcut id="test" expression=""/>
```
然后就是通过后面的 `expression` 表达式来选择到我们需要切入的方法，这个表达式支持很多种方式进行选择，Spring AOP 支持以下 AspectJ 切点指示器（PCD）用于表达式：
- `execution`：用于匹配方法执行连接点。这是使用 Spring AOP 时使用的主要点切割指示器。
- `within`：限制匹配到某些类型的连接点（使用 Spring AOP 时在匹配类型中声明的方法的执行）。
- `this`：限制与连接点匹配（使用 Spring AOP 时方法的执行），其中 bean 引用（Spring AOP 代理）是给定类型的实例。
- `target`：限制匹配连接点（使用 Spring AOP 时方法的执行），其中目标对象（正在代理的应用程序对象）是给定类型的实例。
- `args`：限制与连接点匹配（使用 Spring AOP 时方法的执行），其中参数是给定类型的实例。
- `@target`：限制匹配连接点（使用 Spring AOP 时方法的执行），其中执行对象的类具有给定类型的注释。
- `@args`：限制匹配到连接点（使用 Spring AOP 时方法的执行），其中传递的实际参数的运行时类型具有给定类型的注释。
- `@within`：限制与具有给定注释的类型中的连接点匹配（使用 Spring AOP 时在带有给定注释的类型中声明的方法的执行）。
- `@annotation`：与连接点主体（在 Spring AOP 中运行的方法）具有给定注释的连接点匹配的限制。
更多详细内容请查阅： https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#aop-pointcuts-designators
其中，我们主要学习的 `execution` 填写格式如下：
```xml
修饰符包名. 类名. 方法名称 (方法参数)
```
- 修饰符：public、protected、private、包括返回值类型、static 等等（使用\*代表任意修饰符）
- 包名：如 com. test（* 代表全部，比如 com.\*代表 com 包下的全部包）
- 类名：使用\*也可以代表包下的所有类
- 方法名称：可以使用\*代表全部方法
- 方法参数：填写对应的参数即可，比如 (String, String)，也可以使用\*来代表任意一个参数，使用.. 代表所有参数。
也可以使用其他属性来进行匹配，比如 `@annotation` 可以用于表示标记了哪些注解的方法被切入，这里我们就只是简单的执行，所以说只需要这样写就可以了：
```xml
<aop:pointcut id="test" expression="execution(* org.example.entity.Student.study())"/>
```
这样，我们就指明了需要切入的方法，然后就是将我们的增强方法，我们在里面继续添加 `aop:aspect` 标签，并使用 `ref` 属性将其指向我们刚刚注册的 AOP 类 Bean：
```xml
<aop:config>
    <aop:pointcut id="test" expression="execution(* org.example.entity.Student.study())"/>
    <aop:aspect ref="studentAOP">
    </aop:aspect>
</aop:config>
```
接着就是添加后续动作了，当然，官方支持的有多种多样的，比如执行前、执行后、抛出异常后、方法返回后等等：
![image-20221216155201849](https://s2.loli.net/2022/12/16/uopJ9KyqMvQSwi4.png)
其中 `around 方法` 为环绕方法，自定义度会更高，我们会在稍后介绍。这里我们按照上面的要求，直接添加后续动作，注意需要指明生效的切点：
```xml
<aop:aspect ref="studentAOP">
  	<!--     method就是我们的增强方法，pointcut-ref指向我们刚刚创建的切点     -->
    <aop:after method="afterStudy" pointcut-ref="test"/>
</aop:aspect>
```
这样，我们就成功配置好了，配置正确会在旁边出现图标：
![image-20221216155551779](https://s2.loli.net/2022/12/16/hBaSmuovMzp5iIn.png)
我们来试试看吧：
```java
public static void main (String[] args) {
    ApplicationContext context = new ClassPathXmlApplicationContext ("application. xml");
    Student bean = context. getBean (Student. class);
    bean. study ();
}
```
结果如下：
![image-20221216155616952](https://s2.loli.net/2022/12/16/JlvLe9rgQw2pbXo.png)
可以看到在我们原本的方法执行完成之后，它还继续执行了我们的增强方法，这实际上就是动态代理做到的，实现在不修改原有代码的基础上，对方法的调用进行各种增强，在之后的 SpringMVC 学习中，我们甚至可以使用它来快速配置访问日志打印。
前面我们说了，AOP 是基于动态代理实现的，所以说我们如果直接获取 Bean 的类型，会发现不是原本的类型了：
```java
Student bean = context. getBean (Student. class);
System. out. println (bean. getClass ());
```
![image-20221216172042146](https://s2.loli.net/2022/12/16/8lsiRj6Q9eTLhSI.png)
这里其实是 Spring 通过 CGLib 为我们生成的动态代理类，也就不难理解为什么调用方法会直接得到增强之后的结果了。包括我们前面讲解 Spring 的异步任务调度时，为什么能够直接实现异步，其实就是利用了 AOP 机制实现的方法增强。
虽然这些功能已经非常强大了，但是仅仅只能简单的切入还是不能满足一些需求，在某些情况下，我们可以需求方法执行的一些参数，比如方法执行之后返回了什么，或是方法开始之前传入了什么参数等等，现在我们修改一下 Student 中 `study` 方法的参数：
```java
public class Student {
    public void study (String str){  //现在方法有一个 String 类型的参数
        System. out. println ("都别学 Java 了，根本找不到工作，快去卷"+str);
    }
}
```
我们希望在增强的方法中也能拿到这个参数，然后进行处理：
```java
public class StudentAOP {
    public void afterStudy () {
      	//这个 str 参数我们该从哪里拿呢？
        System. out. println ("学什么"+str+"，Rust 天下第一！");
    }
}
```
这个时候，我们可以为我们切入的方法添加一个 JoinPoint 参数，通过此参数就可以快速获取切点位置的一些信息：
```java
public void afterStudy (JoinPoint point) {   //JoinPoint 实例会被自动传入
    //这里我们直接通过 getArgs ()返回的参数数组获取第 1 个参数
    System. out. println ("学什么"+point. getArgs ()[0]+"，Rust 天下第一！");
}
```
接着我们修改一下刚刚的 AOP 配置（因为方法参数有变动）看看结果吧：
```xml
<aop:pointcut id="test" expression="execution(* org.example.entity.Student.study(String))"/>
```
现在我们来测试一下：
```java
public static void main (String[] args) {
    ApplicationContext context = new ClassPathXmlApplicationContext ("application. xml");
    Student bean = context. getBean (Student. class);
    bean. study ("PHP");
}
```
![image-20221216160501469](https://s2.loli.net/2022/12/16/NrZA49JvpgEyL2O.png)
是不是感觉大部分功能都可以通过 AOP 来完成了？
我们接着来看自定义度更高的环绕方法，现在我们希望在方法执行前和执行后都加入各种各样的动作，如果还是一个一个切点写，有点太慢了，能不能直接写一起呢，此时我们就可以使用环绕方法。
环绕方法相当于完全代理了此方法，它完全将此方法包含在中间，需要我们手动调用才可以执行此方法，并且我们可以直接获取更多的参数：
```java
public Object around (ProceedingJoinPoint joinPoint) throws Throwable {
    System. out. println ("方法开始之前");
    Object value = joinPoint. proceed ();   //调用 process 方法来执行被代理的原方法，如果有返回值，可以使用 value 接收
    System. out. println ("方法执行完成，结果为："+value);
  	return value;
}
```
注意，如果代理方法存在返回值，那么环绕方法也需要有一个返回值，通过 `proceed` 方法来执行代理的方法，也可以修改参数之后调用 `proceed (Object[])`，使用我们给定的参数再去执行：
```java
public Object around (ProceedingJoinPoint joinPoint) throws Throwable {
    System. out. println ("方法开始之前");
    String arg = joinPoint. getArgs ()[0] + "伞兵一号";
    Object value = joinPoint. proceed (new Object[]{arg});
    System. out. println ("方法执行完成，结果为："+value);
    return value;
}
```
这里我们还是以 `study` 方法为例，现在我们希望在调用前修改这个方法传入的参数值，改成我们自己的，然后在调用之后对返回值结果也进行处理：
```java
public String study (String str){
    if (str. equals ("Java"))
        System. out. println ("我的梦想是学 Java");
    else {
        System. out. println ("我就要学 Java，不要修改我的梦想！");
        str = "Java";
    }
    return str;
}
```
现在我们编写一个环绕方法，对其进行全方面处理：
```java
public Object around (ProceedingJoinPoint joinPoint) throws Throwable {
    System. out. println ("我是她的家长，他不能学 Java，必须学 Rust，这是为他好");
    Object value = joinPoint. proceed (new Object[]{"Rust"});
    if (value. equals ("Java")) {
        System. out. println ("听话，学 Rust 以后进大厂！");
        value = "Rust";
    }
    return value;
}
```
同样的，因为方法变动了，现在我们去修改一下我们的 AOP 配置：
```xml
<aop:pointcut id="test" expression="execution(* org.example.entity.Student.study(String))"/>
<aop:aspect ref="studentAOP">
    <aop:around method="around" pointcut-ref="test"/>
</aop:aspect>
```
![image-20221216162003675](https://s2.loli.net/2022/12/16/FPwQjRvsDgTnoWx.png)
细心的小伙伴可能会发现，环绕方法的图标是全包的，跟我们之前的图标不太一样。
现在我们来试试看吧：
```java
public static void main (String[] args) {
    ApplicationContext context = new ClassPathXmlApplicationContext ("application. xml");
    Student bean = context. getBean (Student. class);
    System. out. println ("已报名："+bean. study ("Java"));
}
```
![image-20221216161855358](https://s2.loli.net/2022/12/16/pGl7n8qboe4tuJf.png)
这样，我们就实现了环绕方法，通过合理利用 AOP 带来的便捷，可以使得我们的代码更加清爽和优美。这里介绍一下 AOP 领域中的特性术语，防止自己下来看不懂文章：
- 通知（Advice）: AOP 框架中的增强处理，通知描述了**切面何时执行以及如何执行增强处理**，也就是我们上面编写的方法实现。
- 连接点（join point）: 连接点表示应用执行过程中**能够插入切面的一个点**，这个点可以是方法的调用、异常的抛出，实际上就是我们在方法执行前或是执行后需要做的内容。
- 切点（PointCut）: **可以插入增强处理的连接点**，可以是方法执行之前也可以方法执行之后，还可以是抛出异常之类的。
- 切面（Aspect）: 切面是**通知和切点的结合**，我们之前在 xml 中定义的就是切面，包括很多信息。
- 引入（Introduction）：引入允许我们向现有的类添加**新的方法或者属性**。
- 织入（Weaving）: **将增强处理添加到目标对象中**，并**创建一个被增强的对象**，我们之前都是在将我们的增强处理添加到目标对象，也就是织入（这名字挺有文艺范的）

> [!NOTE] xml 实现 AOP 总结
> - 实现切入类和对应属性和方法
> - 编写 AOP 配置文件，注册相应的 bean，并配置 AOP 切点、切面和切面的操作等
> - 切入方法可以获取被切入的方法的形参并执行被被切入的方法等

### 使用接口实现 AOP
前面我们介绍了如何使用 xml 配置一个 AOP 操作，这节课我们来看看如何使用 `Advice` 实现 AOP。
它与我们之前学习的动态代理更接近一些，比如在方法开始执行之前或是执行之后会去调用我们实现的接口，首先我们需要将一个类实现 Advice 接口，只有实现此接口，才可以被通知，比如我们这里使用 `MethodBeforeAdvice` 表示是一个在方法执行之前的动作：
```java
public class StudentAOP implements MethodBeforeAdvice {
    @Override
    public void before (Method method, Object[] args, Object target) throws Throwable {
        System. out. println ("通过 Advice 实现 AOP");
    }
}
```
我们发现，方法中包括了很多的参数，其中 `args` 代表的是方法执行前得到的**实参列表**，还有 `target` 表示执行此方法的**实例对象**。运行之后，效果和之前是一样的，但是在这里我们就可以快速获取到更多信息。还是以简单的 study 方法为例：
```java
public class Student {
    public void study (){
        System. out. println ("我是学习方法！");
    }
}
```
```xml
<bean id="student" class="org.example.entity.Student"/>
<bean id="studentAOP" class="org.example.entity.StudentAOP"/>
<aop:config>
    <aop:pointcut id="test" expression="execution(* org.example.entity.Student.study())"/>
  	<!--  这里只需要添加我们刚刚写好的advisor就可以了，注意是Bean的名字  -->
    <aop:advisor advice-ref="studentAOP" pointcut-ref="test"/>
</aop:config>
```
我们来测试一下吧：
![image-20221216164110367](https://s2.loli.net/2022/12/16/ofducpb2mLh9XHi.png)
除了此接口以外，还有其他的接口，比如 `AfterReturningAdvice` 就需要实现一个方法执行之后的操作：
```java
public class StudentAOP implements MethodBeforeAdvice, AfterReturningAdvice {
    @Override
    public void before (Method method, Object[] args, Object target) throws Throwable {
        System. out. println ("通过 Advice 实现 AOP");
    }
    @Override
    public void afterReturning (Object returnValue, Method method, Object[] args, Object target) throws Throwable {
        System. out. println ("我是方法执行之后的结果，方法返回值为："+returnValue);
    }
}
```
因为使用的是接口，就非常方便，直接写一起，配置文件都不需要改了：
![image-20221216164242506](https://s2.loli.net/2022/12/16/DUZzqaBSiJKNv8j.png)
我们也可以使用 `MethodInterceptor`（同样也是 Advice 的子接口）进行更加**环绕**那样的自定义的增强，它用起来就真的像代理一样，例子如下：
```java
public class Student {
    public String study (){
        System. out. println ("我是学习方法！");
        return "lbwnb";
    }
}
```
```java
public class StudentAOP implements MethodInterceptor {   //实现 MethodInterceptor 接口
    @Override
    public Object invoke (MethodInvocation invocation) throws Throwable {  //invoke 方法就是代理方法
        Object value = invocation. proceed ();   //跟之前一样，需要手动 proceed ()才能调用原方法
        return value+"增强";
    }
}
```
我们来看看结果吧：
![image-20221216173211310](https://s2.loli.net/2022/12/16/ARcUW2mJrn7Y6f9.png)
> [!NOTE] xml 结合接口实现 AOP 总结
> - AOP 通知类实现需要的接口（`MethodBeforeAdvice前置通知, AfterReturningAdvice后置通知, MethodInterceptor环绕通知`）
> - 编写 AOP 配置文件，设置 `<aop:advisor advice-ref="studentAOP" pointcut-ref="study"/>`

### 使用注解实现 AOP
接着我们来看看如何使用注解实现 AOP 操作，现在变回我们之前的注解开发，首先我们需要在主类添加 `@EnableAspectJAutoProxy` 注解，开启 AOP 注解支持：
```java
@EnableAspectJAutoProxy
@ComponentScan ("org. example. entity")
@Configuration
public class MainConfiguration {
}
```
还是熟悉的玩法，类上直接添加 `@Component` 快速注册 Bean：
```java
@Component
public class Student {
    public void study (){
        System. out. println ("我是学习方法！");
    }
}
```
接着我们需要在定义 AOP 增强操作的类上添加 `@Aspect` 注解和 `@Component` 将其注册为 Bean 即可，就像我们之前在配置文件中也要将其注册为 Bean 那样：
```java
@Aspect
@Component
public class StudentAOP {
}
```
接着，我们可以在里面编写增强方法，并将此方法添加到一个切点中，比如我们希望在 Student 的 study 方法执行之前执行我们的 `before` 方法：
```java
public void before (){
    System. out. println ("我是之前执行的内容！");
}
```
那么只需要添加@Before 注解即可：
```java
@Before ("execution (* org. example. entity. Student. study ())")  //execution 写法跟之前一样
public void before (){
    System. out. println ("我是之前执行的内容！");
}
```
这样，这个方法就会在指定方法执行之前执行了，是不是感觉比 XML 配置方便多了。我们来测试一下：
```java
public static void main (String[] args) {
    ApplicationContext context = new AnnotationConfigApplicationContext (MainConfiguration. class);
    Student bean = context. getBean (Student. class);
    bean. study ();
}
```
![image-20221216165625372](https://s2.loli.net/2022/12/16/KpiXcdNt7BglYQh.png)
同样的，我们可以为其添加 `JoinPoint` 参数来获取切入点信息，使用方法跟之前一样：
```java
@Before ("execution (* org. example. entity. Student. study ())")
public void before (JoinPoint point){
    System. out. println ("参数列表："+ Arrays. toString (point. getArgs ()));
    System. out. println ("我是之前执行的内容！");
}
```
为了更方便，我们还可以直接将参数放入，比如：
```java
public void study (String str){
    System. out. println ("我是学习方法！");
}
```
使用命名绑定模式，可以快速得到原方法的参数：
```java
@Before (value = "execution (* org. example. entity. Student. study (..)) && args (str)", argNames = "str")
//命名绑定模式就是根据下面的方法参数列表进行匹配
//这里 args 指明参数，注意需要跟原方法保持一致，然后在 argNames 中指明
public void before (String str){
    System. out. println (str);   //可以快速得到传入的参数
    System. out. println ("我是之前执行的内容！");
}
```
除了@Before，还有很多可以直接使用的注解，比如@AfterReturning、@AfterThrowing 等，比如@AfterReturning：
```java
public String study (){
    System. out. println ("我是学习方法！");
    return "lbwnb";
}
```
```java
@AfterReturning (value = "execution (* org. example. entity. Student. study ())", argNames = "returnVal", returning = "returnVal")   //使用 returning 指定接收方法返回值的参数 returnVal
public void afterReturn (Object returnVal){
    System. out. println ("返回值是："+returnVal);
}
```
同样的，环绕也可以直接通过注解声明：
```java
@Around ("execution (* com. test. bean. Student. test (..))")
public Object around (ProceedingJoinPoint point) throws Throwable {
    System. out. println ("方法执行之前！");
    Object val = point. proceed ();
    System. out. println ("方法执行之后！");
    return val;
}
```
实际上，无论是使用注解或是 XML 配置，我们要做的流程都是一样的，在之后的学习中，我们还会遇到更多需要使用 AOP 的地方。
> [!NOTE] 注解实现 AOP 总结
> 注解实现 AOP 代理的步骤：
> 1. 首先为**配置主类**添加注解 `@EnableAspectJAutoProxy` 开启 AOP 代理
> 2. 编写**AOP 增强类**并添加 `@Aspect` 和 `@Bean` 注解
> 3. 实现**代理增强方法**并添加需要的注解（`@Before，@After/AfterReturning/AfterThrowing，@Round` 等），并未注解配置 `value` 属性指定代理增强的*目标*，（**可选**）设置 `argsName` 属性指定对应*形参*，eg：
>   `@After(value = "execution(* org.example.entity.Student.study(..)) &&  args(msg)",argNames = "msg")`
> 


***
## 数据库框架整合
学习了 Spring 之后，我们已经了解如何将一个类作为 Bean 交由 IoC 容器管理，这样，我们就可以通过更方便的方式来使用 Mybatis 框架，我们可以直接把 SqlSessionFactory、Mapper 交给 Spring 进行管理，并且可以通过注入的方式快速地使用它们。
因此，我们要学习一下如何将 Mybatis 与 Spring 进行整合，那么首先，我们需要在之前知识的基础上继续深化学习。
### 了解数据源
在之前，我们如果需要创建一个 JDBC 的连接，那么必须使用 `DriverManager. getConnection ()` 来创建连接，连接建立后，我们才可以进行数据库操作。而学习了 Mybatis 之后，我们就不用再去使用 `DriverManager` 为我们提供连接对象，而是直接使用 Mybatis 为我们提供的 `SqlSessionFactory` 工具类来获取对应的 `SqlSession` 通过会话对象去操作数据库。
那么，它到底是如何封装 JDBC 的呢？我们可以试着来猜想一下，会不会是 Mybatis 每次都是帮助我们调用 `DriverManager` 来实现的数据库连接创建？我们可以看看 Mybatis 的源码：
```java
public SqlSession openSession (boolean autoCommit) {
    return this. openSessionFromDataSource (this. configuration. getDefaultExecutorType (), (TransactionIsolationLevel) null, autoCommit);
}
```
在通过 `SqlSessionFactory` 调用 `openSession` 方法之后，它调用了内部的一个私有的方法 `openSessionFromDataSource`，我们接着来看，这个方法里面定义了什么内容：
```java
private SqlSession openSessionFromDataSource (ExecutorType execType, TransactionIsolationLevel level, boolean autoCommit) {
    Transaction tx = null;
    DefaultSqlSession var 8;
    try {
        //获取当前环境（由配置文件映射的对象实体）
        Environment environment = this. configuration. getEnvironment ();
      	//事务工厂（暂时不提，下一板块讲解）
        TransactionFactory transactionFactory = this. getTransactionFactoryFromEnvironment (environment);
      	//配置文件中：<transactionManager type="JDBC"/>
      	//生成事务（根据我们的配置，会默认生成 JdbcTransaction），这里是关键，我们看到这里用到了 environment. getDataSource ()方法
        tx = transactionFactory. newTransaction (environment. getDataSource (), level, autoCommit);
      	//执行器，包括全部的数据库操作方法定义，本质上是在使用执行器操作数据库，需要传入事务对象
        Executor executor = this. configuration. newExecutor (tx, execType);
      	//封装为 SqlSession 对象
        var 8 = new DefaultSqlSession (this. configuration, executor, autoCommit);
    } catch (Exception var 12) {
        this. closeTransaction (tx);
        throw ExceptionFactory. wrapException ("Error opening session.  Cause: " + var 12, var 12);
    } finally {
        ErrorContext. instance (). reset ();
    }
    return var 8;
}
```
也就是说，我们的数据源配置信息，存放在了 `Transaction` 对象中，那么现在我们只需要知道执行器到底是如何执行 SQL 语句的，我们就知道到底如何创建 `Connection` 对象了，这时就需要获取数据库的链接信息了，那么我们来看看，这个 `DataSource` 到底是个什么：
```java
public interface DataSource  extends CommonDataSource, Wrapper {
  Connection getConnection () throws SQLException;
  Connection getConnection (String username, String password)
    throws SQLException;
}
```
我们发现，它是在 `javax. sql` 定义的一个接口，它包括了两个方法，都是用于获取连接的。因此，现在我们可以断定，并不是通过之前 `DriverManager` 的方法去获取连接了，而是使用 `DataSource` 的实现类来获取的，因此，也就正式引入到我们这一节的话题了：
> 数据库链接的建立和关闭是极其耗费系统资源的操作，通过 DriverManager 获取的数据库连接，一个数据库连接对象均对应一个物理数据库连接，每次操作都打开一个物理连接，使用完后立即关闭连接，频繁的打开、关闭连接会持续消耗网络资源，造成整个系统性能的低下。
因此，JDBC 为我们定义了一个数据源的标准，也就是 `DataSource` 接口，告诉数据源数据库的连接信息，并将所有的连接全部交给数据源进行集中管理，当需要一个 `Connection` 对象时，可以向数据源申请，数据源会根据内部机制，合理地分配连接对象给我们。
一般比较常用的 `DataSource` 实现，都是采用池化技术，就是在一开始就创建好 N 个连接，这样之后使用就无需再次进行连接，而是直接使用现成的 `Connection` 对象进行数据库操作。
![image-20221217134119558](https://s2.loli.net/2022/12/17/rk4mcdvYn6osOLW.png)
当然，也可以使用传统的即用即连的方式获取 `Connection` 对象，Mybatis 为我们提供了几个默认的数据源实现，我们之前一直在使用的是官方的默认配置，也就是池化数据源：
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<! DOCTYPE configuration
        PUBLIC "-//mybatis. org//DTD Config 3.0//EN"
        " http://mybatis.org/dtd/mybatis-3-config.dtd">
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
这里的 `type` 属性一共三个选项：
- UNPOOLED   不使用连接池的数据源
- POOLED    使用连接池的数据源
- JNDI     使用 JNDI 实现的数据源
### 解读 Mybatis 数据源实现（选学）
前面我们介绍了 DataSource 数据源，那么我们就来看看，Mybatis 到底是怎么实现的。我们先来看看，不使用池化的数据源实现，它叫做 `UnpooledDataSource`，我们来看看源码：
```java
public class UnpooledDataSource implements DataSource {
    private ClassLoader driverClassLoader;
    private Properties driverProperties;
    private static Map<String, Driver> registeredDrivers = new ConcurrentHashMap ();
    private String driver;
    private String url;
    private String username;
    private String password;
    private Boolean autoCommit;
    private Integer defaultTransactionIsolationLevel;
    private Integer defaultNetworkTimeout;
  	...
```
首先这个类中定义了很多的成员，包括数据库的连接信息、数据库驱动信息、事务相关信息等。我们接着来看，它是如何实现 `DataSource` 中提供的接口方法的：
```java
public Connection getConnection () throws SQLException {
    return this. doGetConnection (this. username, this. password);
}
public Connection getConnection (String username, String password) throws SQLException {
    return this. doGetConnection (username, password);
}
```
实际上，这两个方法都指向了内部的一个 `doGetConnection` 方法，那么我们接着来看：
```java
private Connection doGetConnection (String username, String password) throws SQLException {
    Properties props = new Properties ();
    if (this. driverProperties != null) {
        props. putAll (this. driverProperties);
    }
    if (username != null) {
        props. setProperty ("user", username);
    }
    if (password != null) {
        props. setProperty ("password", password);
    }
    return this. doGetConnection (props);
}
```
这里将用户名和密码配置封装为一个 Properties 对象，然后执行另一个重载同名的方法：
```java
private Connection doGetConnection (Properties properties) throws SQLException {
  	//若未初始化驱动，需要先初始化，内部维护了一个 Map 来记录初始化信息，这里不多介绍了
    this. initializeDriver ();
  	//传统的获取连接的方式，是不是终于找到熟悉的味道了
    Connection connection = DriverManager. getConnection (this. url, properties);
  	//对连接进行额外的一些配置
    this. configureConnection (connection);
    return connection;   //返回得到的 Connection 对象
}
```
到这里，就返回 `Connection` 对象了，而此对象正是通过 `DriverManager` 来创建的，因此，非池化的数据源实现依然使用的是传统的连接创建方式，那我们接着来看池化的数据源实现，它是 `PooledDataSource` 类：
```java
public class PooledDataSource implements DataSource {
    private static final Log log = LogFactory. getLog (PooledDataSource. class);
    private final PoolState state = new PoolState (this);
  	//内部维护了一个非池化的数据源，这是要干嘛？
    private final UnpooledDataSource dataSource;
    protected int poolMaximumActiveConnections = 10;
    protected int poolMaximumIdleConnections = 5;
    protected int poolMaximumCheckoutTime = 20000;
    protected int poolTimeToWait = 20000;
    protected int poolMaximumLocalBadConnectionTolerance = 3;
    protected String poolPingQuery = "NO PING QUERY SET";
    protected boolean poolPingEnabled;
    protected int poolPingConnectionsNotUsedFor;
    private int expectedConnectionTypeCode;
  	//并发相关类，我们在 JUC 篇视频教程中介绍过，感兴趣可以前往观看
    private final Lock lock = new ReentrantLock ();
    private final Condition condition;
```
我们发现，在这里的定义就比非池化的实现复杂得多了，因为它还要考虑并发的问题，并且还要考虑如何合理地存放大量的链接对象，该如何进行合理分配，因此它的玩法非常之高级，但是，再高级的玩法，我们都要拿下。
首先注意，它存放了一个 UnpooledDataSource，此对象是在构造时就被创建，其实创建 Connection 还是依靠数据库驱动创建，我们后面慢慢解析，首先我们来看看它是如何实现接口方法的：
```java
public Connection getConnection () throws SQLException {
    return this. popConnection (this. dataSource. getUsername (), this. dataSource. getPassword ()). getProxyConnection ();
}
public Connection getConnection (String username, String password) throws SQLException {
    return this. popConnection (username, password). getProxyConnection ();
}
```
可以看到，它调用了 `popConnection ()` 方法来获取连接对象，然后进行了一个代理，通过这方法名字我们可以猜测，有可能整个连接池就是一个类似于栈的集合类型结构实现的。那么我们接着来看看 `popConnection` 方法：
```java
private PooledConnection popConnection (String username, String password) throws SQLException {
    boolean countedWait = false;
  	//返回的是 PooledConnection 对象，
    PooledConnection conn = null;
    long t = System. currentTimeMillis ();
    int localBadConnectionCount = 0;
    while (conn == null) {
        synchronized (this. state) {   //加锁，因为有可能很多个线程都需要获取连接对象
            PoolState var 10000;
          	//PoolState 存了两个 List，一个是空闲列表，一个是活跃列表
            if (! this. state. idleConnections. isEmpty ()) {   //有空闲的连接时，可以直接分配 Connection
                conn = (PooledConnection) this. state. idleConnections. remove (0);  //ArrayList 中取第一个元素
                if (log. isDebugEnabled ()) {
                    log. debug ("Checked out connection " + conn. getRealHashCode () + " from pool.");
                }
            //如果已经没有多余的连接可以分配，那么就检查一下活跃连接数是否达到最大的分配上限，如果没有，就 new 一个新的
            } else if (this. state. activeConnections. size () < this. poolMaximumActiveConnections) {
              	//注意 new 了之后并没有立即往 List 里面塞，只是存了一些基本信息
              	//我们发现，这里依靠 UnpooledDataSource 创建了一个 Connection 对象，并将其封装到 PooledConnection 中
              	//所以说内部维护的 UnpooledDataSource 对象其实是为了节省代码，因为创建数据库连接其实都是一样的方式
                conn = new PooledConnection (this. dataSource. getConnection (), this);
                if (log. isDebugEnabled ()) {
                    log. debug ("Created connection " + conn. getRealHashCode () + ".");
                }
              //以上条件都不满足，那么只能从之前的连接中寻找了，看看有没有那种卡住的链接（比如，由于网络问题有可能之前的连接一直被卡住，然而正常情况下早就结束并且可以使用了，所以这里相当于是优化也算是一种捡漏的方式）
            } else {
              	//获取最早创建的连接
                PooledConnection oldestActiveConnection = (PooledConnection) this. state. activeConnections. get (0);
                long longestCheckoutTime = oldestActiveConnection. getCheckoutTime ();
              	//判断是否超过最大的使用时间
                if (longestCheckoutTime > (long) this. poolMaximumCheckoutTime) {
                  	//超时统计信息（不重要）
                    ++this. state. claimedOverdueConnectionCount;
                    var 10000 = this. state;
                    var 10000. accumulatedCheckoutTimeOfOverdueConnections += longestCheckoutTime;
                    var 10000 = this. state;
                    var 10000. accumulatedCheckoutTime += longestCheckoutTime;
                  	//从活跃列表中移除此链接信息
                    this. state. activeConnections. remove (oldestActiveConnection);
                  	//如果开启事务，还需要回滚一下
                    if (! oldestActiveConnection. getRealConnection (). getAutoCommit ()) {
                        try {
                            oldestActiveConnection. getRealConnection (). rollback ();
                        } catch (SQLException var 15) {
                            log. debug ("Bad connection. Could not roll back");
                        }
                    }
                  	//这里就根据之前的连接对象直接 new 一个新的连接（注意使用的还是之前的 Connection 对象，并没有创建新的对象，只是被重新封装了）
                    conn = new PooledConnection (oldestActiveConnection. getRealConnection (), this);
                    conn. setCreatedTimestamp (oldestActiveConnection. getCreatedTimestamp ());
                    conn. setLastUsedTimestamp (oldestActiveConnection. getLastUsedTimestamp ());
                  	//过期
                    oldestActiveConnection. invalidate ();
                    if (log. isDebugEnabled ()) {
                        log. debug ("Claimed overdue connection " + conn. getRealHashCode () + ".");
                    }
                } else {
                  //没有超时，那就确实是没连接可以用了，只能卡住了（阻塞）
                  //然后顺手记录一下目前有几个线程在等待其他的任务搞完
                    try {
                        if (! countedWait) {
                            ++this. state. hadToWaitCount;
                            countedWait = true;
                        }
                        if (log. isDebugEnabled ()) {
                            log. debug ("Waiting as long as " + this. poolTimeToWait + " milliseconds for connection.");
                        }
                      	//最后再等等
                        long wt = System. currentTimeMillis ();
                        this. state. wait ((long) this. poolTimeToWait);
                      	//要是超过等待时间还是没等到，只能放弃了
                      	//注意这样的话 con 就为 null 了
                        var 10000 = this. state;
                        var 10000. accumulatedWaitTime += System. currentTimeMillis () - wt;
                    } catch (InterruptedException var 16) {
                        break;
                    }
                }
            }
          	//经过之前的操作，并且已经成功分配到连接对象的情况下
            if (conn != null) {
                if (conn. isValid ()) {  //首先验证是否有效
                    if (! conn. getRealConnection (). getAutoCommit ()) {  //清理之前可能存在的遗留事务操作
                        conn. getRealConnection (). rollback ();
                    }
                    conn. setConnectionTypeCode (this. assembleConnectionTypeCode (this. dataSource. getUrl (), username, password));
                    conn. setCheckoutTimestamp (System. currentTimeMillis ());
                    conn. setLastUsedTimestamp (System. currentTimeMillis ());
                  	//添加到活跃表中
                    this. state. activeConnections. add (conn);
                    //统计信息（不重要）
                    ++this. state. requestCount;
                    var 10000 = this. state;
                    var 10000. accumulatedRequestTime += System. currentTimeMillis () - t;
                } else {
                  	//无效的连接，直接抛异常
                    if (log. isDebugEnabled ()) {
                        log. debug ("A bad connection (" + conn. getRealHashCode () + ") was returned from the pool, getting another connection.");
                    }
                    ++this. state. badConnectionCount;
                    ++localBadConnectionCount;
                    conn = null;
                    if (localBadConnectionCount > this. poolMaximumIdleConnections + this. poolMaximumLocalBadConnectionTolerance) {
                        if (log. isDebugEnabled ()) {
                            log. debug ("PooledDataSource: Could not get a good connection to the database.");
                        }
                        throw new SQLException ("PooledDataSource: Could not get a good connection to the database.");
                    }
                }
            }
        }
    }
  	//最后该干嘛干嘛，要是之前拿到的 con 是 null 的话，直接抛异常
    if (conn == null) {
        if (log. isDebugEnabled ()) {
            log. debug ("PooledDataSource: Unknown severe error condition.  The connection pool returned a null connection.");
        }
        throw new SQLException ("PooledDataSource: Unknown severe error condition.  The connection pool returned a null connection.");
    } else {
        return conn;   //否则正常返回
    }
}
```
经过上面一顿猛如虎的操作之后，我们可以得到以下信息：
> 如果最后得到了连接对象（有可能是从空闲列表中得到，有可能是直接创建的新的，还有可能是经过回收策略回收得到的），那么连接 (Connection)对象一定会被放在活跃列表中 (state. activeConnections)
那么肯定有一个疑问，现在我们已经知道获取一个链接会直接进入到活跃列表中，那么，如果一个连接被关闭，又会发生什么事情呢，我们来看看此方法返回之后，会调用 `getProxyConnection` 来获取一个代理对象，实际上就是 `PooledConnection` 类：
```java
class PooledConnection implements InvocationHandler {
  private static final String CLOSE = "close";
    private static final Class<?>[] IFACES = new Class[]{Connection. class};
    private final int hashCode;
  	//会记录是来自哪一个数据源创建的的
    private final PooledDataSource dataSource;
  	//连接对象本体
    private final Connection realConnection;
  	//代理的链接对象
    private final Connection proxyConnection;
  	...
```
它直接代理了构造方法中传入的 Connection 对象，也是使用 JDK 的动态代理实现的，那么我们来看一下，它是如何进行代理的：
```java
public Object invoke (Object proxy, Method method, Object[] args) throws Throwable {
    String methodName = method. getName ();
  	//如果调用的是 Connection 对象的 close 方法，
    if ("close". equals (methodName)) {
      	//这里并不会真的关闭连接（这也是为什么用代理），而是调用之前数据源的 pushConnection 方法，将此连接改为为空闲状态
        this. dataSource. pushConnection (this);
        return null;
    } else {
        try {
            if (! Object. class. equals (method. getDeclaringClass ())) {
                this. checkConnection ();
              	//任何操作执行之前都会检查连接是否可用
            }
          	//原方法该干嘛干嘛
            return method. invoke (this. realConnection, args);
        } catch (Throwable var 6) {
            throw ExceptionUtil. unwrapThrowable (var 6);
        }
    }
}
```
这下，池化数据源的大致流程其实就已经很清晰了，那么我们最后再来看看 `pushConnection` 方法：
```java
protected void pushConnection (PooledConnection conn) throws SQLException {
    synchronized (this. state) {   //老规矩，先来把锁
      	//先从活跃列表移除此连接
        this. state. activeConnections. remove (conn);
      	//判断此链接是否可用
        if (conn. isValid ()) {
            PoolState var 10000;
          	//看看闲置列表容量是否已满（容量满了就回不去了）
            if (this. state. idleConnections. size () < this. poolMaximumIdleConnections && conn. getConnectionTypeCode () == this. expectedConnectionTypeCode) {
                var 10000 = this. state;
                var 10000. accumulatedCheckoutTime += conn. getCheckoutTime ();
                if (! conn. getRealConnection (). getAutoCommit ()) {
                    conn. getRealConnection (). rollback ();
                }
              	//把唯一有用的 Connection 对象拿出来，然后重新创建一个 PooledConnection 包装
                PooledConnection newConn = new PooledConnection (conn. getRealConnection (), this);
              	//放入闲置列表，成功回收
                this. state. idleConnections. add (newConn);
                newConn. setCreatedTimestamp (conn. getCreatedTimestamp ());
                newConn. setLastUsedTimestamp (conn. getLastUsedTimestamp ());
                conn. invalidate ();
                if (log. isDebugEnabled ()) {
                    log. debug ("Returned connection " + newConn. getRealHashCode () + " to pool.");
                }
                this. state. notifyAll ();
            } else {
                var 10000 = this. state;
                var 10000. accumulatedCheckoutTime += conn. getCheckoutTime ();
                if (! conn. getRealConnection (). getAutoCommit ()) {
                    conn. getRealConnection (). rollback ();
                }
                conn. getRealConnection (). close ();
                if (log. isDebugEnabled ()) {
                    log. debug ("Closed connection " + conn. getRealHashCode () + ".");
                }
                conn. invalidate ();
            }
        } else {
            if (log. isDebugEnabled ()) {
                log. debug ("A bad connection (" + conn. getRealHashCode () + ") attempted to return to the pool, discarding connection.");
            }
            ++this. state. badConnectionCount;
        }
    }
}
```
这样，我们就已经完全了解了 Mybatis 的池化数据源的执行流程了。只不过，无论 Connection 管理方式如何变换，无论数据源再高级，我们要知道，它都最终都会使用 `DriverManager` 来创建连接对象，而最终使用的也是 `DriverManager` 提供的 `Connection` 对象。
### 整合 Mybatis 框架
通过了解数据源，我们已经清楚，Mybatis 实际上是在使用自己编写的数据源（数据源实现其实有很多，之后我们再聊其他的）默认使用的是池化数据源，它预先存储了很多的连接对象。
那么我们来看一下，如何将 Mybatis 与 Spring 更好的结合呢，比如我们现在希望将 SqlSessionFactory 交给 IoC 容器进行管理，而不是我们自己创建工具类来管理（我们之前一直都在使用工具类管理和创建会话）
```xml
<!-- 这两个依赖不用我说了吧 -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
  	<!-- 注意，对于Spring 6.0来说，版本需要在3.5以上 -->
    <version>3.5.13</version>
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.0.31</version>
</dependency>
<!-- Mybatis针对于Spring专门编写的支持框架 -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>3.0.2</version>
</dependency>
<!-- Spring的JDBC支持框架 -->
<dependency>
     <groupId>org.springframework</groupId>
     <artifactId>spring-jdbc</artifactId>
     <version>6.0.10</version>
</dependency>
```
在 mybatis-spring 依赖中，为我们提供了 SqlSessionTemplate 类，它其实就是官方封装的一个工具类，我们可以将其注册为 Bean，这样我们随时都可以向 IoC 容器索要对象，而不用自己再去编写一个工具类了，我们可以直接在配置类中创建。对于这种别人编写的类型，如果要注册为 Bean，那么只能在配置类中完成：
```java
@Configuration
@ComponentScan ("org. example. entity")
public class MainConfiguration {
  	//注册 SqlSessionTemplate 的 Bean
    @Bean
    public SqlSessionTemplate sqlSessionTemplate () throws IOException {
        SqlSessionFactory factory = new SqlSessionFactoryBuilder (). build (Resources. getResourceAsReader ("mybatis-config. xml"));
        return new SqlSessionTemplate (factory);
    }
}
```
这里随便编写一个测试的 Mapper 类：
```java
@Data
public class Student {
    private int sid;
    private String name;
    private String sex;
}
```
```java
public interface TestMapper {
    @Select ("select * from student where sid = 1")
    Student getStudent ();
}
```
最后是配置文件：
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<! DOCTYPE configuration
        PUBLIC "-//mybatis. org//DTD Config 3.0//EN"
        " http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/study"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
  	<mappers>
        <mapper class="org.example.mapper.TestMapper"/>
    </mappers>
</configuration>
```
我们来测试一下吧：
```java
public static void main (String[] args) {
    ApplicationContext context = new AnnotationConfigApplicationContext (MainConfiguration. class);
    SqlSessionTemplate template = context. getBean (SqlSessionTemplate. class);
    TestMapper testMapper = template. getMapper (TestMapper. class);
    System. out. println (testMapper. getStudent ());
}
```
![image-20221217142651610](https://s2.loli.net/2022/12/17/L83vrESxoXKO7fQ.png)
这样，我们就成功将 Mybatis 与 Spring 完成了初步整合，直接从容器中就能获取到 SqlSessionTemplate，结合自动注入，我们的代码量能够进一步的减少。
虽然这样已经很方便了，但是还不够方便，我们依然需要手动去获取 Mapper 对象，那么能否直接得到对应的 Mapper 对象呢，我们希望让 Spring 直接帮助我们管理所有的 Mapper，当需要时，可以直接从容器中获取，我们可以直接在配置类上方添加注解：
```java
@Configuration
@ComponentScan ("org.example.entity")
@MapperScan ("org.example.mapper")
public class MainConfiguration {
```
这样，Mybatis 就会自动扫描对应包下所有的接口，并直接被注册为对应的 Mapper 作为 Bean 管理，那么我们现在就可以直接通过容器获取了：
```java
public static void main (String[] args) {
    ApplicationContext context = new AnnotationConfigApplicationContext (MainConfiguration. class);
    TestMapper mapper = context. getBean (TestMapper. class);
    System. out. println (mapper. getStudent ());
}
```
在我们后续的 SpringBoot 学习阶段，会有更加方便的方式来注册 Mapper，我们只需要一个 `@Mapper` 注解即可完成，非常简单。
请一定注意，必须存在 `SqlSessionTemplate` 或是 `SqlSessionFactoryBean` 的 Bean，否则会无法初始化（毕竟要数据库的链接信息）我们接着来看，如果我们希望直接去除 Mybatis 的配置文件，完全实现全注解配置，那么改怎么去实现呢？我们可以使用 `SqlSessionFactoryBean` 类：
```java
@Configuration
@ComponentScan ("org.example.entity")
@MapperScan ("org.example.mapper")
public class MainConfiguration {
    @Bean   //单独创建一个 Bean，方便之后更换
    public DataSource dataSource (){
        return new PooledDataSource ("com.mysql.cj.jdbc.Driver",
                "jdbc:mysql://localhost:3306/study", "root", "123456");
    }
    @Bean
    public SqlSessionFactoryBean sqlSessionFactoryBean (DataSource dataSource){  //直接参数得到 Bean 对象
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean ();
        bean. setDataSource (dataSource);
        return bean;
    }
}
```
首先我们需要创建一个数据源的实现类，因为这是数据库最基本的信息，然后再给到 `SqlSessionFactoryBean` 实例，这样，我们相当于直接在一开始通过 IoC 容器配置了 `SqlSessionFactory`，这里只需要传入一个 `DataSource` 的实现即可，我们采用池化数据源。
删除配置文件，重新再来运行，同样可以正常使用 Mapper。从这里开始，通过 IoC 容器，Mybatis 已经不再需要使用配置文件了，在我们之后的学习中，基于 Spring 的开发将不会再出现 Mybatis 的配置文件。
> [!NOTE] **spring 结合 mybatis 使用总结**
> - spring 结合 mybatis 使用步骤：
>   1. 编写实体类（对应于数据库的表），写对应 Mapper 接口注解实现对应的 sql 指令，再编写 mybatis-config. xml 文件配置数据库连接环境并注册 mapper。
>   2. 编写应用配置文件 Configuration 添加 mapper 和 entity 扫描注解，注册 SqlSessionTemplate 的 bean 或 SqlSessionFactoryBean。
>   3. 服务层直接通过 context. getBean ()获取 mapper，调用 mapper 接口的方法。

### 使用 HikariCP 连接池
前面我们提到了数据源还有其他实现，比如 C 3 P 0、Druid 等，它们都是非常优秀的数据源实现（可以自行了解），不过我们这里要介绍的，是之后在 SpringBoot 中还会遇到的 HikariCP 连接池。
> HikariCP 是由日本程序员开源的一个数据库连接池组件，代码非常轻量，并且速度非常的快。根据官方提供的数据，在酷睿 i 7 开启 32 个线程 32 个连接的情况下，进行随机数据库读写操作，HikariCP 的速度是现在常用的 C 3 P 0 数据库连接池的数百倍。在 SpringBoot 3.0 中，官方也是推荐使用 HikariCP。
![image-20221217145126777](https://s2.loli.net/2022/12/17/Q6gPI9RVe1X7Noq.png)
首先，我们需要导入依赖：
```xml
<dependency>
    <groupId>com. zaxxer</groupId>
    <artifactId>HikariCP</artifactId>
    <version>5.0.1</version>
</dependency>
```
要更换数据源实现，非常简单，我们可以直接声明一个 Bean：
```java
@Bean
public DataSource dataSource () {
    HikariDataSource dataSource = new HikariDataSource ();
    dataSource. setJdbcUrl ("jdbc:mysql://localhost: 3306/study");
    dataSource. setDriverClassName ("com. mysql. cj. jdbc. Driver");
    dataSource. setUsername ("root");
    dataSource. setPassword ("123456");
    return dataSource;
}
```
最后我们发现，同样可以得到输出结果，但是出现了一个报错：
```
SLF 4 J: No SLF 4 J providers were found.
SLF 4 J: Defaulting to no-operation (NOP) logger implementation
SLF 4 J: See http://www.slf4j.org/codes.html#noProviders for further details.
```
此数据源实际上是采用了 SLF 4 J 日志框架打印日志信息，但是现在没有任何的日志实现（slf 4 j 只是一个 API 标准，它规范了多种日志框架的操作，统一使用 SLF 4 J 定义的方法来操作不同的日志框架，我们会在 SpringBoot 篇进行详细介绍）我们这里就使用 JUL 作为日志实现，我们需要导入另一个依赖：
```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-jdk14</artifactId>
    <version>1.7.25</version>
</dependency>
```
注意版本一定要和 `slf4j-api` 保持一致，我们可以在这里直接查看：
![image-20221217154216832](https://s2.loli.net/2022/12/17/93OSknRKXwdZsp7.png)
这样，HikariCP 数据源的启动日志就可以正常打印出来了：
```
12 月 17, 2022 3:41:38 下午 com. zaxxer. hikari. HikariDataSource getConnection
信息: HikariPool-1 - Starting...
12 月 17, 2022 3:41:38 下午 com. zaxxer. hikari. pool. HikariPool checkFailFast
信息: HikariPool-1 - Added connection com.mysql.cj.jdbc.ConnectionImpl@4f8969b0
12 月 17, 2022 3:41:38 下午 com. zaxxer. hikari. HikariDataSource getConnection
信息: HikariPool-1 - Start completed.
Student (sid=1, name=小明, sex=男)
```
在 SpringBoot 阶段，我们还会遇到 `HikariPool-1 - Starting...` 和 `HikariPool-1 - Start completed.` 同款日志信息。
当然，Lombok 肯定也是支持这个日志框架快速注解的：
```java
@Slf4j
public class Main {
    public static void main (String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext (MainConfiguration. class);
        TestMapper mapper = context. getBean (TestMapper. class);
        log. info (mapper. getStudent (). toString ());
    }
}
```
> [!NOTE] HikariDataSource 用法总结
> - 使用 HikariPool 数据库连接池步骤：
>   1. 引入 xml 依赖
>   2. 应用配置中注册 DataSource 的 bean 并在内部使用 HikariDataSource

### Mybatis 事务管理
我们前面已经讲解了如何让 Mybatis 与 Spring 更好地融合在一起，通过将对应的 Bean 类型注册到容器中，就能更加方便的去使用 Mapper，那么现在，我们接着来看 Spring 的事务控制。
在开始之前，我们还是回顾一下事务机制。首先事务遵循一个 ACID 原则：
- 原子性（Atomicity）：事务是一个原子操作，由一系列动作组成。事务的原子性确保动作要么全部完成，要么完全不起作用。
- 一致性（Consistency）：一旦事务完成（不管成功还是失败），系统必须确保它所建模的业务处于一致的状态，而不会是部分完成部分失败。在现实中的数据不应该被破坏。类比银行转账，从一个账号扣款，另一个账号增款，必须保证总金额不变。
- 隔离性（Isolation）：可能有许多事务会同时处理相同的数据，因此每个事务都应该与其他事务隔离开来，防止数据损坏。类比多个人同时编辑同一文档，每个人看到的结果都是独立的，不会受其他人的影响，不过难免会存在冲突。
- 持久性（Durability）：一旦事务完成，无论发生什么系统错误，它的结果都不应该受到影响，这样就能从任何系统崩溃中恢复过来。通常情况下，事务的结果被写到持久化存储器中。类比写入硬盘的文件，即使关机重启，文件仍然存在。
简单来说，事务就是要么完成，要么就啥都别做！并且不同的事务之间相互隔离，互不干扰。
那么我们接着来深入了解一下事务的**隔离机制**（在之前数据库入门阶段并没有提到）我们说了，事务之间是相互隔离互不干扰的，那么如果出现了下面的情况，会怎么样呢：
> 当两个事务同时在执行，并且同时在操作同一个数据，这样很容易出现并发相关的问题，比如一个事务先读取了某条数据，而另一个事务此时修改了此数据，当前一个事务紧接着再次读取时，会导致和前一次读取的数据不一致，这就是一种典型的数据虚读现象。
因此，为了解决这些问题，事务之间实际上是存在一些隔离级别的：
- *ISOLATION_READ_UNCOMMITTED*（读未提交）：其他事务会读取当前事务尚未更改的提交（相当于读取的是这个事务暂时缓存的内容，并不是数据库中的内容）
- *ISOLATION_READ_COMMITTED*（读已提交）：其他事务会读取当前事务已经提交的数据（也就是直接读取数据库中已经发生更改的内容）
- *ISOLATION_REPEATABLE_READ*（可重复读）：其他事务会读取当前事务已经提交的数据并且其他事务执行过程中不允许再进行数据修改（注意这里仅仅是不允许修改数据）
- *ISOLATION_SERIALIZABLE*（串行化）：它完全服从 ACID 原则，一个事务必须等待其他事务结束之后才能开始执行，相当于挨个执行，效率很低
我们依次来看看，不同的隔离级别会导致什么问题。首先是 `读未提交` 级别，此级别属于最低级别，相当于各个事务共享一个缓存区域，任何事务的操作都在这里进行。那么它会导致以下问题：
![image-20221217155511058](https://s2.loli.net/2022/12/17/hQpluLA2bFKo1O8.png)
也就是说，事务 A 最后得到的实际上是一个毫无意义的数据（事务 B 已经回滚了）我们称此数据为"脏数据"，这种现象称为**脏读**
我们接着来看 `读已提交` 级别，事务只能读取其他事务已经提交的内容，相当于直接从数据中读取数据，这样就可以避免**脏读**问题了，但是它还是存在以下问题：
![image-20221217155538073](https://s2.loli.net/2022/12/17/K1sJbDNyudOgAcV.png)
这正是我们前面例子中提到的问题，虽然它避免了脏读问题，但是如果事件 B 修改并提交了数据，那么实际上事务 A 之前读取到的数据依然不是最新的数据，直接导致两次读取的数据不一致，这种现象称为**虚读**也可以称为**不可重复读**
因此，下一个隔离级别 `可重复读` 就能够解决这样的问题（MySQL 的默认隔离级别），它规定在其他事务执行时，不允许修改数据，这样，就可以有效地避免不可重复读的问题，但是这样就一定安全了吗？这里仅仅是禁止了事务执行过程中的 UPDATE 操作，但是它并没有禁止 INSERT 这类操作，因此，如果事务 A 执行过程中事务 B 插入了新的数据，那么 A 这时是毫不知情的，比如：
![image-20221217160023674](https://s2.loli.net/2022/12/17/uwiHT8AcobeBjL3.png)
两个人同时报名一个活动，两个报名的事务同时在进行，但是他们一开始读取到的人数都是 5，而这时，它们都会认为报名成功后人数应该变成 6，而正常情况下应该是 7，因此这个时候就发生了数据的**幻读**现象。
因此，要解决这种问题，只能使用最后一种隔离级别 `串行化` 来实现了，每个事务不能同时进行，直接避免所有并发问题，简单粗暴，但是效率爆减，并不推荐。
最后总结三种情况：
> - 脏读：读取到了被回滚的数据，它毫无意义。
> - 虚读（不可重复读）：由于其他事务更新数据，两次读取的数据不一致。
> - 幻读：由于其他事务执行插入删除操作，而又无法感知到表中记录条数发生变化，当下次再读取时会莫名其妙多出或缺失数据，就像产生幻觉一样。
> （对于虚读和幻读的区分：虚读是某个数据前后读取不一致，幻读是整个表的记录数量前后读取不一致
![image-20221217160052616|500](https://s2.loli.net/2022/12/17/nHfV8R1ZUybTSd2.png)
> Mybatis 对于数据库的事务管理，也有着相应的封装。一个事务无非就是创建、提交、回滚、关闭，因此这些操作被 Mybatis 抽象为一个接口：
```java
public interface Transaction {
    Connection getConnection () throws SQLException;
    void commit () throws SQLException;
    void rollback () throws SQLException;
    void close () throws SQLException;
    Integer getTimeout () throws SQLException;
}
```
对于此接口的实现，MyBatis 的事务管理分为两种形式：
1. 使用**JDBC**的事务管理机制：即利用对应数据库的驱动生成的 `Connection` 对象完成对事务的提交（commit ()）、回滚（rollback ()）、关闭（close ()）等，对应的实现类为 `JdbcTransaction`
2. 使用**MANAGED**的事务管理机制：这种机制 MyBatis 自身不会去实现事务管理，而是让程序的容器（比如 Spring）来实现对事务的管理，对应的实现类为 `ManagedTransaction`
3. 如果需要自定义，那么得实现 `org.apache.ibatis.transaction.Transaction` 接口，然后在 `type` 属性中指定其类名。使用自定义的事务管理器可以根据具体需求来实现一些特定的事务管理行为。
而我们之前一直使用的其实就是 JDBC 的事务，相当于直接使用 `Connection` 对象（之前 JavaWeb 阶段已经讲解过了）在进行事务操作，并没有额外的管理机制，对应的配置为：
```xml
<transactionManager type="JDBC"/>
```
那么我们来看看 `JdbcTransaction` 是不是像我们上面所说的那样管理事务的，直接上源码：
```java
public class JdbcTransaction implements Transaction {
    private static final Log log = LogFactory. getLog (JdbcTransaction. class);
    protected Connection connection;
    protected DataSource dataSource;
    protected TransactionIsolationLevel level;
    protected boolean autoCommit;
    public JdbcTransaction (DataSource ds, TransactionIsolationLevel desiredLevel, boolean desiredAutoCommit) {
      	//数据源
        this.dataSource = ds;
      	//事务隔离级别，上面已经提到过了
        this.level = desiredLevel;
      	//是否自动提交
        this.autoCommit = desiredAutoCommit;
    }
  //也可以直接给个 Connection 对象
   public JdbcTransaction (Connection connection) {
        this.connection = connection;
    }
    public Connection getConnection () throws SQLException {
      	//没有就通过数据源新开一个 Connection
        if (this.connection == null) {
            this.openConnection ();
        }
        return this.connection;
    }
    public void commit () throws SQLException {
      	//连接已经创建并且没开启自动提交才可以使用
        if (this.connection != null && !this.connection.getAutoCommit ()) {
            if (log.isDebugEnabled()) {
                log.debug ("Committing JDBC Connection [" + this. connection + "]");
            }
						//实际上使用的是数据库驱动提供的 Connection 对象进行事务操作
            this.connection.commit();
        }
    }
  	...
```
相当于 `JdbcTransaction` 只是为数据库驱动提供的 `Connection` 对象套了层壳，所有的事务操作实际上是直接调用 `Connection` 对象。那么我们接着来看 `ManagedTransaction` 的源码：
```java
public class ManagedTransaction implements Transaction {
    ...
    public void commit () throws SQLException {
    }
    public void rollback () throws SQLException {
    }
    ...
}
```
我们发现，大体内容和 `JdbcTransaction` 差不多，但是它并没有实现任何的事务操作。也就是说，它希望将实现交给其他的管理框架来完成，而 Spring 就为 Mybatis 提供了一个非常好的事务管理实现。
### 使用 Spring 事务管理
现在我们来学习一下 Spring 提供的事务管理（Spring 事务管理分为编程式事务和声明式事务，但是编程式事务过于复杂并且具有高度耦合性，违背了 Spring 框架的设计初衷，因此这里只讲解声明式事务）声明式事务是基于 AOP 实现的。
使用声明式事务非常简单，我们只需要在配置类添加 `@EnableTransactionManagement` 注解即可，这样就可以开启 Spring 的事务支持了。接着，我们只需要把一个事务要做的所有事情封装到 Service 层的一个方法中即可，首先需要在配置文件中注册一个新的 Bean，事务需要执行必须有一个事务管理器：
```java
@Configuration
@ComponentScan ("org.example")
@MapperScan ("org.example.mapper")
@EnableTransactionManagement
public class MainConfiguration {
    @Bean
    public TransactionManager transactionManager (DataSource dataSource){
        return new DataSourceTransactionManager (dataSource);
    }
  	...
```
接着我们来编写一个简单的 Mapper 操作：
```java
@Mapper
public interface TestMapper {
    ...
    @Insert ("insert into student (name, sex) values ('测试', '男')")
    void insertStudent ();
}
```
这样会向数据库中插入一条新的学生信息，接着，假设我们这里有一个业务需要连续插入两条学生信息，首先编写业务层的接口：
```java
public interface TestService {
    void test ();
}
```
接着，我们再来编写业务层的实现，我们可以直接将其注册为 Bean，交给 Spring 来进行管理，这样就可以自动将 Mapper 注入到类中了，并且可以支持事务：
```java
@Component
public class TestServiceImpl implements TestService{
    @Resource
    TestMapper mapper;
    @Transactional   //此注解表示事务，之后执行的所有方法都会在同一个事务中执行
    public void test () {
        mapper. insertStudent ();
        if (true) throw new RuntimeException ("我是测试异常！");
        mapper. insertStudent ();
    }
}
```
我们只需在方法上添加 `@Transactional` 注解，即可表示此方法执行的是一个事务操作，在调用此方法时，Spring 会通过 AOP 机制为其进行增强，一旦发现异常，事务会自动回滚。最后我们来调用一下此方法：
```java
@Slf4j
public class Main {
    public static void main (String[] args) {
        log. info ("项目正在启动...");
        ApplicationContext context = new AnnotationConfigApplicationContext (TestConfiguration. class);
        TestService service = context.getBean (TestService.class);
        service.test();
    }
}
```
得到的结果是出现错误：
```java
12 月 17, 2022 4:09:00 下午 com. zaxxer. hikari. HikariDataSource getConnection
信息: HikariPool-1 - Start completed.
Exception in thread "main" java. lang. RuntimeException: 我是测试异常！
	at org. example. service. TestServiceImpl. test (TestServiceImpl. java:17)
	at java. base/jdk. internal. reflect. NativeMethodAccessorImpl. invoke 0 (Native Method)
	at java. base/jdk. internal. reflect. NativeMethodAccessorImpl. invoke (NativeMethodAccessorImpl. java:77)
	at java. base/jdk. internal. reflect. DelegatingMethodAccessorImpl. invoke (DelegatingMethodAccessorImpl. java:43)
	at java. base/java. lang. reflect. Method. invoke (Method. java:568)
	at org. springframework. aop. support. AopUtils. invokeJoinpointUsingReflection (AopUtils. java:343)
	at org. springframework. aop. framework. ReflectiveMethodInvocation. invokeJoinpoint (ReflectiveMethodInvocation. java:196)
```
我们发现，整个栈追踪信息中包含了大量 aop 包下的内容，也就印证了它确实是通过 AOP 实现的，那么我们接着来看一下，数据库中的数据是否没有发生变化（出现异常回滚了）
![image-20221217161027254](https://s2.loli.net/2022/12/17/TQDbpK2JVP3d9wz.png)
结果显而易见，第一次的插入操作确实被回滚了，数据库中没有任何新增的内容。
我们接着来研究一下 `@Transactional` 注解的一些参数：
```java
@Target ({ElementType. TYPE, ElementType. METHOD})
@Retention (RetentionPolicy. RUNTIME)
@Inherited
@Documented
public @interface Transactional {
    @AliasFor ("transactionManager")
    String value () default "";
    @AliasFor ("value")
    String transactionManager () default "";
    String[] label () default {};
    Propagation propagation () default Propagation. REQUIRED;
    Isolation isolation () default Isolation. DEFAULT;
    int timeout () default -1;
    String timeoutString () default "";
    boolean readOnly () default false;
    Class<? extends Throwable>[] rollbackFor () default {};
    String[] rollbackForClassName () default {};
    Class<? extends Throwable>[] noRollbackFor () default {};
    String[] noRollbackForClassName () default {};
}
```
我们来讲解几个比较关键的属性：
	- *transactionManager*：指定事务管理器
	- *propagation*：事务传播规则，一个事务可以包括 N 个子事务
	- *isolation*：事务隔离级别，不多说了
	- *timeout*：事务超时时间
	- *readOnly*：是否为只读事务，不同的数据库会根据只读属性进行优化，比如 MySQL 一旦声明事务为只读，那么就不允许增删改操作了。
	- *rollbackFor* 和 *noRollbackFor*：发生指定异常时回滚或是不回滚，默认发生任何异常都回滚。
除了事务的传播规则，其他的内容其实已经给大家讲解过了，那么我们就来看看事务的传播。事务传播一共有七种级别：
![image-20221217161156859](https://s2.loli.net/2022/12/17/C1RA4mBEoxNDFGl.png)
Spring 默认的传播级别是 `PROPAGATION_REQUIRED`，那么我们来看看，它是如何传播的，现在我们的 `Service` 类中一共存在两个事务，而一个事务方法包含了另一个事务方法：
```java
@Component
public class TestServiceImpl implements TestService{
    @Resource
    TestMapper mapper;
    @Transactional
    public void test () {
        test 2 ();   //包含另一个事务
        if (true) throw new RuntimeException ("我是测试异常！");  //发生异常时，会回滚另一个事务吗？
    }
    @Transactional
    public void test 2 () {
        mapper. insertStudent ();
    }
}
```
最后我们得到结果，另一个事务也被回滚了，也就是说，相当于另一个事务直接加入到此事务中，也就是表中所描述的那样。如果单独执行 `test 2 ()` 则会开启一个新的事务，而执行 `test ()` 则会直接让内部的 `test 2 ()` 加入到当前事务中。
现在我们将 `test 2 ()` 的传播级别设定为 `SUPPORTS`，那么这时如果单独调用 `test 2 ()` 方法，并不会以事务的方式执行，当发生异常时，虽然依然存在 AOP 增强，但是不会进行回滚操作，而现在再调用 `test ()` 方法，才会以事务的方式执行：
```java
@Transactional
public void test () {
    test 2 ();
}
@Transactional (propagation = Propagation. SUPPORTS)
public void test 2 () {
    mapper. insertStudent ();
    if (true) throw new RuntimeException ("我是测试异常！");
}
```
我们接着来看 `MANDATORY`，它非常严格，如果当前方法并没有在任何事务中进行，会直接出现异常：
```java
@Transactional
public void test () {
    test 2 ();
}
@Transactional (propagation = Propagation. MANDATORY)
public void test 2 () {
    mapper. insertStudent ();
    if (true) throw new RuntimeException ("我是测试异常！");
}
```
直接运行 `test 2 ()` 方法，报错如下：
```java
Exception in thread "main" org. springframework. transaction. IllegalTransactionStateException: No existing transaction found for transaction marked with propagation 'mandatory'
	at org. springframework. transaction. support. AbstractPlatformTransactionManager. getTransaction (AbstractPlatformTransactionManager. java:362)
	at org. springframework. transaction. interceptor. TransactionAspectSupport. createTransactionIfNecessary (TransactionAspectSupport. java:595)
	at org. springframework. transaction. interceptor. TransactionAspectSupport. invokeWithinTransaction (TransactionAspectSupport. java:382)
	at org. springframework. transaction. interceptor. TransactionInterceptor. invoke (TransactionInterceptor. java:119)
	at org. springframework. aop. framework. ReflectiveMethodInvocation. proceed (ReflectiveMethodInvocation. java:186)
	at org. springframework. aop. framework. JdkDynamicAopProxy. invoke (JdkDynamicAopProxy. java:215)
	at com. sun. proxy.$Proxy 29. test 2 (Unknown Source)
	at com. test. Main. main (Main. java:17)
```
`NESTED` 级别表示如果存在外层事务，则此方法单独创建一个子事务，回滚只会影响到此子事务，实际上就是利用创建 Savepoint，然后回滚到此保存点实现的。`NEVER` 级别表示此方法不应该加入到任何事务中，其余类型适用于同时操作多数据源情况下的分布式事务管理，这里暂时不做介绍。
> [!NOTE] Spring 事务管理总结
> - 配置类添加 `@EnableTransactionManagement` 注解开启 Spring 事务管理。
> - 当需要执行一组数据库操作时需要在 service 方法上添加 `@Transactional` 注解表示为该方法开启事务。
> - `@Transactional` 注解包括多个属性（*propagation*，*isolation*，*timeout*，*readOnly*，*rollbackFor*等），设置事务的传播级别，隔离级别，超时时间，是否只读和回滚场景等。

### 集成 JUnit 测试
既然使用了 Spring，那么怎么集成到 JUnit 中进行测试呢，首先大家能够想到的肯定是：
```java
public class TestMain {
    @Test
    public void test (){
        ApplicationContext context = new AnnotationConfigApplicationContext (TestConfiguration. class);
        TestService service = context. getBean (TestService. class);
        service. test ();
    }
}
```
直接编写一个测试用例即可，但是这样的话，如果我们有很多个测试用例，那么我们不可能每次测试都去创建 ApplicationContext 吧？我们可以使用 `@Before` 添加一个测试前动作来提前配置 ApplicationContext，但是这样的话，还是不够简便，能不能有更快速高效的方法呢？
Spring 为我们提供了一个 Test 模块，它会自动集成 Junit 进行测试，我们可以导入一下依赖：
```xml
<dependency>
    <groupId>org. junit. jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.9.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org. springframework</groupId>
    <artifactId>spring-test</artifactId>
    <version>6.0.10</version>
</dependency>
```
这里导入的是 JUnit 5 和 SpringTest 模块依赖，然后直接在我们的测试类上添加两个注解就可以搞定：
```java
@ExtendWith (SpringExtension.class)
@ContextConfiguration (classes = TestConfiguration.class)
public class TestMain {
    @Autowired
    TestService service;
    @Test
    public void test (){
        service. test ();
    }
}
```
`@ExtendWith` 是由 JUnit 提供的注解，等同于旧版本的 `@RunWith` 注解，然后使用 SpringTest 模块提供的 `@ContextConfiguration` 注解来表示要加载哪一个配置文件，可以是 XML 文件也可以是类，我们这里就直接使用类进行加载。
配置完成后，我们可以直接使用 `@Autowired` 来进行依赖注入，并且直接在测试方法中使用注入的 Bean，现在就非常方便了。
至此，SSM 中的其中一个 S（Spring）和一个 M（Mybatis）就已经学完了，我们还剩下一个 SpringMvc 需要去学习，下一章，我们将重新回到 Web 开发，了解在 Spring 框架的加持下，我们如何更高效地开发 Web 应用程序。
***
## 实现原理探究（选学）
注意：本版块难度很大，所有内容都作为选学内容。
### Bean 工厂与 Bean 定义
实际上我们之前的所有操作都离不开一个东西，那就是 IoC 容器，那么它到底是如何实现呢？这一部分我们将详细介绍，首先我们大致了解一下 ApplicationContext 的加载流程：
![image-20221217162656678](https://s2.loli.net/2022/12/17/Un6qjPci2uvkL5X.png)
我们可以看到，整个过程极为复杂，一句话肯定是无法解释的。由于 Spring 的源码非常庞大，因此我们不可能再像了解其他框架那样直接自底向上逐行干源码了（各位可以自己点开看看，代码量非常多）
![image-20221217162821241](https://s2.loli.net/2022/12/17/QXqvO1sGh6d4ZSz.png)
我们只能对几个关键部分进行介绍，在了解这些内容之后，实际上不需要完全阅读所有部分的源码都可以有一个大致的认识。
首先，容器既然要管理 Bean，那么肯定需要一个完善的管理机制，实际上，对 Bean 的管理都是依靠 BeanFactory 在进行，顾名思义 BeanFactory 就是对 Bean 进行生产和管理的工厂，我们可以尝试自己创建和使用 BeanFactory 对象：
```java
public static void main (String[] args) {
    BeanFactory factory = new DefaultListableBeanFactory ();  //这是 BeanFactory 的一个默认实现类
    System. out. println ("获取 Bean 对象："+factory. getBean ("lbwnb"));  //我们可以直接找工厂获取 Bean 对象
}
```
我们可以直接找 Bean 工厂索要对象，只不过在一开始，工厂并不知道自己需要生产什么，可以生产什么，因此我们直接索要一个工厂不知道的 Bean 对象，会直接得到：
![image-20230214193208233](https://s2.loli.net/2023/02/14/n54N3iFQX7awHAl.png)
我们只有告诉工厂我们要生产什么，怎么生产，工厂才能开工：
```java
public static void main (String[] args) {
    DefaultListableBeanFactory factory = new DefaultListableBeanFactory ();  //这是 BeanFactory 的一个默认实现类
    BeanDefinition definition = BeanDefinitionBuilder   //使用 BeanDefinitionBuilder 快速创建 Bean 定义
            .rootBeanDefinition (Student. class)   //Bean 的类型
            .setScope ("prototype")    //设置作用域为原型模式
            .getBeanDefinition ();     //生成此 Bean 定义
    factory. registerBeanDefinition ("lbwnb", definition);   //向工厂注册 Bean 此定义，并设定 Bean 的名称
    System. out. println (factory. getBean ("lbwnb"));  //现在就可以拿到了
}
```
实际上，我们的 ApplicationContext 中就维护了一个 AutowireCapableBeanFactory 对象：
```java
public abstract class AbstractRefreshableApplicationContext extends AbstractApplicationContext {
 	@Nullable
	private volatile DefaultListableBeanFactory beanFactory;   //默认构造后存放在这里的是一个 DefaultListableBeanFactory 对象
  ...
  @Override
  public final ConfigurableListableBeanFactory getBeanFactory () {   //getBeanFactory 就可以直接得到上面的对象了
     DefaultListableBeanFactory beanFactory = this. beanFactory;
     if (beanFactory == null) {
        throw new IllegalStateException ("BeanFactory not initialized or already closed - " +
              "call 'refresh' before accessing beans via the ApplicationContext");
     }
     return beanFactory;
  }
```
我们可以尝试获取一下：
```java
ApplicationContext context = new ClassPathXmlApplicationContext ("application. xml");
//我们可以直接获取此对象
System. out. println (context. getAutowireCapableBeanFactory ());
```
正是因为这样，ApplicationContext 才具有了管理和生产 Bean 对象的能力。
不过，我们的配置可能是 XML、可能是配置类，那么 Spring 要如何进行解析，将这些变成对应的 BeanDefinition 对象呢？使用 BeanDefinitionReader 就可以：
```java
public static void main (String[] args) {
    DefaultListableBeanFactory factory = new DefaultListableBeanFactory ();
    //比如我们要读取 XML 配置，我们直接使用 XmlBeanDefinitionReader 就可以快速进行扫描
    XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader (factory);
    //加载此 XML 文件中所有的 Bean 定义到 Bean 工厂中
    reader. loadBeanDefinitions (new ClassPathResource ("application. xml"));
    //可以看到能正常生产此 Bean 的实例对象
    System. out. println (factory. getBean (Student. class));
}
```
因此，针对于不同类型的配置方式，ApplicationContext 有着多种实现，其中常用的有：
* ClassPathXmlApplicationContext：适用于类路径下的 XML 配置文件。
* FileSystemXmlApplicationContext：适用于非类路径下的 XML 配置文件。
* AnnotationConfigApplicationContext：适用于注解配置形式。
比如 ClassPathXmlApplicationContext 在初始化的时候就会创建一个对应的 XmlBeanDefinitionReader 进行扫描：
```java
@Override
protected void loadBeanDefinitions (DefaultListableBeanFactory beanFactory) throws BeansException, IOException {
   // 为给定的 BeanFactory 创建 XmlBeanDefinitionReader 便于读取 XML 中的 Bean 配置
   XmlBeanDefinitionReader beanDefinitionReader = new XmlBeanDefinitionReader (beanFactory);
   // 各种配置，忽略掉
   beanDefinitionReader. setEnvironment (this. getEnvironment ());
   ...
   // 配置完成后，直接开始加载 XML 文件中的 Bean 定义
   loadBeanDefinitions (beanDefinitionReader);
}
```
```java
protected void loadBeanDefinitions (XmlBeanDefinitionReader reader) throws BeansException, IOException {
   Resource[] configResources = getConfigResources ();   //具体加载过程我就不详细介绍了
   if (configResources != null) {
      reader. loadBeanDefinitions (configResources);
   }
   String[] configLocations = getConfigLocations ();
   if (configLocations != null) {
      reader. loadBeanDefinitions (configLocations);
   }
}
```
现在，我们就已经知道，Bean 实际上是一开始通过 BeanDefinitionReader 进行扫描，然后将所有 Bean 以 BeanDefinition 对象的形式注册到对应的 BeanFactory 中进行集中管理，而我们使用的 ApplicationContext 实际上内部就有一个 BeanFactory 在进行 Bean 管理，这样容器才拥有了最基本的 Bean 管理功能。
当然，BeanFactory 还可以具有父子关系，其中最关键的作用就是继承父容器中所有的 Bean 定义，这样的话，如果我们想要创建一个新的 BeanFactory 并且默认具有其他 BeanFactory 中所有的 Bean 定义外加一些其他的，那么就可以采用这种形式，这是很方便的。
我们可以来尝试一下，创建两个工厂：
```java
public class Main {
    public static void main (String[] args) {
        DefaultListableBeanFactory factoryParent = new DefaultListableBeanFactory ();
        DefaultListableBeanFactory factoryChild = new DefaultListableBeanFactory ();
        //在父工厂中注册 A
        factoryParent. registerBeanDefinition ("a", new RootBeanDefinition (A.class));
      	//在子工厂中注册 B、C
        factoryChild. registerBeanDefinition ("b", new RootBeanDefinition (B.class));
        factoryChild. registerBeanDefinition ("c", new RootBeanDefinition (C.class));
        //最后设定子工厂的父工厂
        factoryChild. setParentBeanFactory (factoryParent);
    }
    static class A{ }
    static class B{ }
    static class C{ }
}
```
现在我们来看看是不是我们想的那样：
```java
System. out. println (factoryChild. getBean (A.class));  //子工厂不仅能获取到自己的，也可以拿到父工厂的
System. out. println (factoryChild. getBean (B.class));
System. out. println (factoryChild. getBean (C.class));
System. out. println (factoryParent. getBean (B.class));   //注意父工厂不能拿到子工厂的，就像类的继承一样
```
同样的，我们在使用 ApplicationContext 时，也可以设定这样的父子关系，效果相同：
```java
public static void main (String[] args) {
    ApplicationContext contextParent = new ClassPathXmlApplicationContext ("parent. xml");
    ApplicationContext contextChild = new ClassPathXmlApplicationContext (new String[]{"child. xml"}, contextParent);  //第一个参数只能用数组，奇怪
}
```
当然，除了这些功能之外，BeanFactory 还提供了很多其他的管理 Bean 定义的方法，比如移除 Bean 定义、拷贝 Bean 定义、销毁单例 Bean 实例对象等功能，这里就不一一列出了，各位小伙伴自己调用一下测试就可以了，很简单。
> [!NOTE] Bean 管理的本质
> 实际上 `bean` 的创建管理是由 `beanFactory` 进行的，而工厂的管理必须依据 `beanDefinition` 定义作为管理手册，只有工厂里注册了对应 bean 的定义才能对其进行管理

### 单例 Bean 的创建与循环依赖
前面我们讲解了配置的 Bean 是如何被读取并加载到容器中的，接着我们来了解一下 Bean 实例对象是如何被创建并得到的，我们知道，如果要得到一个 Bean 的实例很简单，通过 `getBean` 方法就可以直接拿到了：
```java
ApplicationContext context = new ClassPathXmlApplicationContext ("application. xml");
System. out. println (context. getBean (Student. class));   //通过此方法就能快速得到
```
那么，一个 Bean 的实例对象到底是如何创建出来的呢？我们还要继续对我们之前讲解的 BeanFactory 进行深入介绍。
我们可以直接找到 BeanFactory 接口的一个抽象实现 `AbstractBeanFactory` 类，它实现了 `getBean ()` 方法：
```java
public Object getBean (String name) throws BeansException {
  	//套娃开始了，做好准备
    return this. doGetBean (name, (Class) null, (Object[]) null, false);
}
```
那么我们 `doGetBean ()` 接着来看方法里面干了什么，这个方法比较长，我们分段进行讲解：
```java
protected <T> T doGetBean (String name, @Nullable Class<T> requiredType, @Nullable Object[] args, boolean typeCheckOnly) throws BeansException {
    String beanName = this. transformedBeanName (name);   //虽然这里直接传的就是 name，但是万一是别名呢，所以还得要解析一下变成原本的 Bean 名字
    Object sharedInstance = this. getSingleton (beanName);   //首先直接获取单例 Bean 对象
    Object beanInstance;
    if (sharedInstance != null && args == null) {   //判断是否成功获取到共享的单例对象
    ...
```
因为所有的 Bean 默认都是单例模式，对象只会存在一个，因此它会先调用父类的 `getSingleton ()` 方法来直接获取单例对象，如果有的话，就可以直接拿到 Bean 的实例。如果 Bean 不是单例模式，那么会进入 else 代码块。这一部分我们先来看单例模式下的处理，其实逻辑非常简单：
```java
protected <T> T doGetBean (String name, @Nullable Class<T> requiredType, @Nullable Object[] args, boolean typeCheckOnly) throws BeansException {
    ...
    if (sharedInstance != null && args == null) {
        if (this. logger. isTraceEnabled ()) {
          	//这里会判断 Bean 是否为正在创建状态，为什么会有这种状态呢？我们会在后面进行介绍
            if (this. isSingletonCurrentlyInCreation (beanName)) {
                this. logger. trace ("Returning eagerly cached instance of singleton bean '" + beanName + "' that is not fully initialized yet - a consequence of a circular reference");
            } else {
                this. logger. trace ("Returning cached instance of singleton bean '" + beanName + "'");
            }
        }
				//这里 getObjectForBeanInstance 会进行最终处理
      	//因为 Bean 有两个特殊的类型，工厂 Bena 和空 Bean，所以说需要单独处理
      	//如果是普通 Bean 直接原样返回 beanInstance 接收到最终结果
        beanInstance = this. getObjectForBeanInstance (sharedInstance, name, beanName, (RootBeanDefinition) null);
    } else {
       ...
    }
  	//最后还会进行一次类型判断，如果都没问题，直接返回 beanInstance 作为结果，我们就得到 Bean 的实例对象了
  	return this. adaptBeanInstance (name, beanInstance, requiredType);
}
```
实际上整个单例 Bean 的创建路线还是很清晰的，并没有什么很难理解的地方，在正常情况下，其实就是简单的创建对象实例并返回即可。
其中最关键的是它对于循环依赖的处理。我们发现，在上面的代码中，得到单例对象后，会有一个很特殊的判断 `isSingletonCurrentlyInCreation`，这个是干嘛的？对象不应该直接创建出来吗？为什么会有这种正在创建的状态呢？我们来探究一下。
开始之前先给大家提个问题：
> 现在有两个 Bean，A 和 B 都是以原型模式进行创建，而 A 中需要注入 B，B 中需要注入 A，这时就会出现 A 还未创建完成，就需要 B，而 B 这时也没创建完成，因为 B 需要 A，而 A 等着 B，B 又等着 A，这样就只能无限循环下去了（就像死锁那种感觉）所以就出现了循环依赖的问题（同理，一个对象注入自己，还有三个对象之间，甚至多个对象之间也会出现这种情况）
但是，在单例模式下，由于每个 Bean 只会创建一个实例，只要能够处理好对象之间的引用关系，Spring 完全有机会解决单例对象循环依赖的问题。那么单例模式下是如何解决循环依赖问题的呢？
![image-20221217170912302](https://s2.loli.net/2022/12/17/aRjr1968Lc3BkKH.png)
我们回到一开始的 `getSingleton ()` 方法中，研究一下它到底是如何处理循环依赖的，它是可以自动解决循环依赖问题的：
```java
@Nullable
protected Object getSingleton (String beanName, boolean allowEarlyReference) {
    Object singletonObject = this. singletonObjects. get (beanName);
  	//先从第一层列表中拿 Bean 实例，拿到直接返回
    if (singletonObject == null && this. isSingletonCurrentlyInCreation (beanName)) {
      	//如果第一层拿不到，并且已经认定为处于循环状态，看看第二层有没有
        singletonObject = this. earlySingletonObjects. get (beanName);
      	//要是还是没有，继续往下
        if (singletonObject == null && allowEarlyReference) {
            synchronized (this. singletonObjects) {
              	//加锁再执行一次上述流程
                singletonObject = this. singletonObjects. get (beanName);
                if (singletonObject == null) {
                    singletonObject = this. earlySingletonObjects. get (beanName);
                    if (singletonObject == null) {
                      	//仍然没有获取到实例，只能从 singletonFactory 中获取了
                        ObjectFactory<?> singletonFactory = (ObjectFactory) this. singletonFactories. get (beanName);
                        if (singletonFactory != null) {
                            singletonObject = singletonFactory. getObject ();
                          	//丢进 earlySingletonObjects 中，下次就可以直接在第二层拿到了
                            this. earlySingletonObjects. put (beanName, singletonObject);
                            this. singletonFactories. remove (beanName);
                        }
                    }
                }
            }
        }
    }
    return singletonObject;
}
```
看起来很复杂，实际上它使用了三级缓存的方式来处理循环依赖的问题，包括：
- singletonObjects，用于保存实例化、注入、初始化完成的 bean 实例
- earlySingletonObjects，用于保存实例化完成的 bean 实例
- singletonFactories，在初始创建 Bean 对象时都会生成一个对应的单例工厂用于获取早期对象
我们先来画一个流程图理清整个过程：
![image-20221218150012610](https://s2.loli.net/2022/12/18/xFfUuaozLpiVg96.png)
我们在了解这个流程之前，一定要先明确，单例 Bean 对象的获取，会有哪些结果，首先就是如果我们获取的 Bean 压根就没在工厂中注册，那得到的结果肯定是 null；其次，如果我们获取的 Bean 已经注册了，那么肯定就可以得到这个单例对象，只是不清楚创建到哪一个阶段了。
现在我们根据上面的流程图，来模拟一下 A 和 B 循环依赖的情况：
![image-20230214222056632](https://s2.loli.net/2023/02/14/ezkOUv8Wjrb2tVF.png)
有的小伙伴就会有疑问了，看起来似乎两级缓存也可以解决问题啊，干嘛搞三层而且还搞个对象工厂？这不是多此一举吗？实际上这是为了满足 Bean 的生命周期而做的，通过工厂获取早期对象代码如下：
```java
protected Object getEarlyBeanReference (String beanName, RootBeanDefinition mbd, Object bean) {
    Object exposedObject = bean;
  	//这里很关键，会对一些特别的 BeanPostProcessor 进行处理，比如 AOP 代理相关的，如果这个 Bean 是被 AOP 代理的，我们需要得到的是一个经过 AOP 代理的对象，而不是直接创建出来的对象，这个过程需要 BeanPostProcessor 来完成（AOP 产生代理对象的逻辑是在属性填充之后，因此只能再加一级进行缓冲）
    if (! mbd. isSynthetic () && hasInstantiationAwareBeanPostProcessors ()) {
        for (SmartInstantiationAwareBeanPostProcessor bp : getBeanPostProcessorCache (). smartInstantiationAware) {
            exposedObject = bp. getEarlyBeanReference (exposedObject, beanName);
        }
    }
    return exposedObject;
}
```
我们会在后面的部分中详细介绍 BeanPostProcessor 以及 AOP 的实现原理，届时各位再回来看就会明白了。
### 后置处理器与 AOP
接着我们来介绍一下 `PostProcessor`，它其实是 Spring 提供的一种后置处理机制，它可以让我们能够插手 Bean、BeanFactory、BeanDefinition 的创建过程，相当于进行一个最终的处理，而最后得到的结果（比如 Bean 实例、Bean 定义等）就是经过后置处理器返回的结果，它是整个加载过程的最后一步。
而 AOP 机制正是通过它来实现的，我们首先来认识一下第一个接口 `BeanPostProcessor`，它相当于 Bean 初始化的一个后置动作，我们可以直接实现此接口：
```java
//注意它后置处理器也要进行注册
@Component
public class TestBeanProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessAfterInitialization (Object bean, String beanName) throws BeansException {
        System. out. println (beanName);  //打印 bean 的名称
        return bean;
    }
    @Override
    public Object postProcessBeforeInitialization (Object bean, String beanName) throws BeansException {
        return BeanPostProcessor. super. postProcessBeforeInitialization (bean, beanName);
    }
}
```
我们发现，此接口中包括两个方法，一个是 `postProcessAfterInitialization` 用于在 Bean 初始化之后进行处理，还有一个 `postProcessBeforeInitialization` 用于在 Bean 初始化之前进行处理，注意这里的初始化不是创建对象，而是调用类的初始化方法，比如：
```java
@Component
public class TestBeanProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessAfterInitialization (Object bean, String beanName) throws BeansException {
        System. out. println ("我是之后："+beanName);
        return bean;   //这里返回的 Bean 相当于最终的结果了，我们依然能够插手修改，这里返回之后是什么就是什么了
    }
    @Override
    public Object postProcessBeforeInitialization (Object bean, String beanName) throws BeansException {
        System. out. println ("我是之前："+beanName);
        return bean;   //这里返回的 Bean 会交给下一个阶段，也就是初始化方法
    }
}
```
```java
@Component
public class TestServiceImpl implements TestService{
    public TestServiceImpl (){
        System. out. println ("我是构造方法");
    }
    @PostConstruct
    public void init (){
        System. out. println ("我是初始化方法");
    }
    TestMapper mapper;
    @Autowired
    public void setMapper (TestMapper mapper) {
        System. out. println ("我是依赖注入");
        this. mapper = mapper;
    }
  	...
```
而 TestServiceImpl 的加载顺序为：
```xml
我是构造方法
我是依赖注入
我是之前：testServiceImpl
我是初始化方法
我是之后：testServiceImpl
```
现在我们再来总结一下一个 Bean 的加载流程：
[Bean 定义]首先扫描 Bean，加载 Bean 定义 -> [依赖注入]根据 Bean 定义通过反射创建 Bean 实例 -> [依赖注入]进行依赖注入（顺便解决循环依赖问题）-> [初始化 Bean]BeanPostProcessor 的初始化之前方法 -> [初始化 Bean]Bean 初始化方法 -> [初始化 Bean]BeanPostProcessor 的初始化之后方法 -> [完成]最终得到的 Bean 加载完成的实例
利用这种机制，理解 Aop 的实现过程就非常简单了，AOP 实际上也是通过这种机制实现的，它的实现类是 `AnnotationAwareAspectJAutoProxyCreator`，而它就是在最后对 Bean 进行了代理，因此最后我们得到的结果实际上就是一个动态代理的对象（有关详细实现过程，这里就不进行列举了，感兴趣的可以继续深入）因此，实际上之前设计的三层缓存，都是由于需要处理 AOP 设计的，因为在 Bean 创建得到最终对象之前，很有可能会被 PostProcessor 给偷梁换柱！
那么肯定有人有疑问了，这个类没有被注册啊，那按理说它不应该参与到 Bean 的初始化流程中的，为什么它直接就被加载了呢？
还记得 `@EnableAspectJAutoProxy` 吗？我们来看看它是如何定义就知道了：
```java
@Target ({ElementType. TYPE})
@Retention (RetentionPolicy. RUNTIME)
@Documented
@Import ({AspectJAutoProxyRegistrar. class})
public @interface EnableAspectJAutoProxy {
    boolean proxyTargetClass () default false;
    boolean exposeProxy () default false;
}
```
我们发现它使用了 `@Import` 来注册 `AspectJAutoProxyRegistrar`，那么这个类又是什么呢，我们接着来看：
```java
class AspectJAutoProxyRegistrar implements ImportBeanDefinitionRegistrar {
    AspectJAutoProxyRegistrar () {
    }
    public void registerBeanDefinitions (AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
      	//注册 AnnotationAwareAspectJAutoProxyCreator 到容器中
        AopConfigUtils. registerAspectJAnnotationAutoProxyCreatorIfNecessary (registry);
        AnnotationAttributes enableAspectJAutoProxy = AnnotationConfigUtils. attributesFor (importingClassMetadata, EnableAspectJAutoProxy. class);
        if (enableAspectJAutoProxy != null) {
            if (enableAspectJAutoProxy. getBoolean ("proxyTargetClass")) {
                AopConfigUtils. forceAutoProxyCreatorToUseClassProxying (registry);
            }
            if (enableAspectJAutoProxy. getBoolean ("exposeProxy")) {
                AopConfigUtils. forceAutoProxyCreatorToExposeProxy (registry);
            }
        }
    }
}
```
它实现了接口，这个接口也是 Spring 提供的一种 Bean 加载机制，它支持直接向容器中添加 Bean 定义，容器也会加载这个 Bean：
- ImportBeanDefinitionRegistrar 类只能通过其他类@Import 的方式来加载，通常是启动类或配置类。
- 使用@Import，如果括号中的类是 ImportBeanDefinitionRegistrar 的实现类，则会调用接口中方法（一般用于注册 Bean）
- 实现该接口的类拥有注册 bean 的能力。
我们可以看到此接口提供了一个 `BeanDefinitionRegistry` 正是用于注册 Bean 的定义的。
因此，当我们打上了 `@EnableAspectJAutoProxy` 注解之后，首先会通过 `@Import` 加载 AspectJAutoProxyRegistrar，然后调用其 `registerBeanDefinitions` 方法，然后使用工具类注册 AnnotationAwareAspectJAutoProxyCreator 到容器中，这样在每个 Bean 创建之后，如果需要使用 AOP，那么就会通过 AOP 的后置处理器进行处理，最后返回一个代理对象。
我们也可以尝试编写一个自己的 ImportBeanDefinitionRegistrar 实现，首先编写一个测试 Bean：
```java
public class TestBean {
    @PostConstruct
    void init (){
        System. out. println ("我被初始化了！");
    }
}
```
```java
public class TestBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions (AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        BeanDefinition definition = BeanDefinitionBuilder. rootBeanDefinition (Student. class). getBeanDefinition ();
        registry. registerBeanDefinition ("lbwnb", definition);
    }
}
```
观察控制台输出，成功加载 Bean 实例。
与 `BeanPostProcessor` 差不多的还有 `BeanFactoryPostProcessor`，它和前者一样，也是用于我们自己处理后置动作的，不过这里是用于处理 BeanFactory 加载的后置动作，`BeanDefinitionRegistryPostProcessor` 直接继承自 `BeanFactoryPostProcessor`，并且还添加了新的动作 `postProcessBeanDefinitionRegistry`，你可以在这里动态添加 Bean 定义或是修改已经存在的 Bean 定义，这里我们就直接演示 `BeanDefinitionRegistryPostProcessor` 的实现：
```java
@Component
public class TestDefinitionProcessor implements BeanDefinitionRegistryPostProcessor {
    @Override
    public void postProcessBeanDefinitionRegistry (BeanDefinitionRegistry registry) throws BeansException {
        System. out. println ("我是 Bean 定义后置处理！");
        BeanDefinition definition = BeanDefinitionBuilder. rootBeanDefinition (TestBean. class). getBeanDefinition ();
        registry. registerBeanDefinition ("lbwnb", definition);
    }
    @Override
    public void postProcessBeanFactory (ConfigurableListableBeanFactory configurableListableBeanFactory) throws BeansException {
        System. out. println ("我是 Bean 工厂后置处理！");
    }
}
```
在这里注册 Bean 定义其实和之前那种方法效果一样。
最后，我们再完善一下 Bean 加载流程（加粗部分是新增的）：
[Bean 定义]首先扫描 Bean，加载 Bean 定义 -> **[Bean 定义]Bean 定义和 Bean 工厂后置处理** -> [依赖注入]根据 Bean 定义通过反射创建 Bean 实例 -> [依赖注入]进行依赖注入（顺便解决循环依赖问题）-> [初始化 Bean]BeanPostProcessor 的初始化之前方法 -> [初始化 Bean]Bean 初始化方法 -> [初始化 Bean]BeanPostProcessor 的初始化之前后方法 -> [完成]最终得到的 Bean 加载完成的实例
### 应用程序上下文详解
前面我们详细介绍了 BeanFactory 是如何工作的，接着我们来研究一下 ApplicationContext 的内部，实际上我们真正在项目中使用的就是 ApplicationContext 的实现，那么它又是如何工作的呢。
```java
public interface ApplicationContext extends EnvironmentCapable, ListableBeanFactory, HierarchicalBeanFactory, MessageSource, ApplicationEventPublisher, ResourcePatternResolver {
	@Nullable
	String getId ();
	String getApplicationName ();
	String getDisplayName ();
	long getStartupDate ();
	@Nullable
	ApplicationContext getParent ();
	AutowireCapableBeanFactory getAutowireCapableBeanFactory () throws IllegalStateException;
}
```
它本身是一个接口，同时集成了多种类型的 BeanFactory 接口，说明它应该具有这些 BeanFactory 的能力，实际上我们在前面已经提到过，ApplicationContext 是依靠内部维护的 BeanFactory 对象来完成这些功能的，并不是它本身就实现了这些功能。
这里我们就先从构造方法开始走起，以我们常用的 AnnotationConfigApplicationContext 为例：
```java
public AnnotationConfigApplicationContext (Class<?>... componentClasses) {
		this ();                      //1. 首先会调用自己的无参构造
		register (componentClasses);  //2. 然后注册我们传入的配置类
		refresh ();                   //3. 最后进行刷新操作（关键）
}
```
先来看第一步：
```java
public GenericApplicationContext () {
  	//父类首先初始化内部维护的 BeanFactory 对象
		this. beanFactory = new DefaultListableBeanFactory ();
}
```
```java
public AnnotationConfigApplicationContext () {
		StartupStep createAnnotatedBeanDefReader = this. getApplicationStartup (). start ("spring. context. annotated-bean-reader. create");
  	//创建 AnnotatedBeanDefinitionReader 对象，用于后续处理 @Bean 注解
		this. reader = new AnnotatedBeanDefinitionReader (this);
		createAnnotatedBeanDefReader. end ();
  	//创建 ClassPathBeanDefinitionScanner 对象，用于扫描类路径上的 Bean
		this. scanner = new ClassPathBeanDefinitionScanner (this);
}
```
这样，AnnotationConfigApplicationContext 的基本内容就初始化好了，不过这里结束之后会将 ConfigurationClassPostProcessor 后置处理器加入到 BeanFactory 中，它继承自 BeanFactoryPostProcessor，也就是说一会会在 BeanFactory 初始化完成之后进行后置处理：
```java
public AnnotatedBeanDefinitionReader (BeanDefinitionRegistry registry, Environment environment) {
		Assert. notNull (registry, "BeanDefinitionRegistry must not be null");
		Assert. notNull (environment, "Environment must not be null");
		this. registry = registry;
		this. conditionEvaluator = new ConditionEvaluator (registry, environment, null);
  	//这里注册了注解处理配置相关的后置处理器
		AnnotationConfigUtils. registerAnnotationConfigProcessors (this. registry);
}
```
实际上这个后置处理器的主要目的就是为了读取配置类中的各种 Bean 定义以及其他注解，比如@Import、@ComponentScan 等。
同时这里也会注册一个 AutowiredAnnotationBeanPostProcessor 后置处理器到 BeanFactory，它继承自 BeanPostProcessor，用于处理后续生成的 Bean 对象，其实看名字就知道，这玩意就是为了处理@Autowire、@Value 这种注解，用于自动注入，这里就不深入讲解具体实现了。
所以，第一步结束之后，就会有这两个关键的后置处理器放在容器中：
![image-20230719152546148](https://s2.loli.net/2023/07/19/uY4zwEhArUMfP2d.png)
接着是第二步，注册配置类：
```java
@Override
public void register (Class<?>... componentClasses) {
		Assert. notEmpty (componentClasses, "At least one component class must be specified");
		StartupStep registerComponentClass = this. getApplicationStartup (). start ("spring. context. component-classes. register")
				. tag ("classes", () -> Arrays. toString (componentClasses));
  	//使用我们上面创建的 Reader 注册配置类
		this. reader. register (componentClasses);
		registerComponentClass. end ();
}
```
现在配置类已经成功注册到 IoC 容器中了，我们接着来看第三步，到目前为止，我们已知的仅仅是注册了配置类的 Bean，而刷新操作就是配置所有 Bean 的关键部分了，刷新操作是在 AbstractApplicationContext 中实现的：
```java
@Override
public void refresh () throws BeansException, IllegalStateException {
		synchronized (this. startupShutdownMonitor) {
			StartupStep contextRefresh = this. applicationStartup. start ("spring. context. refresh");
			// 准备当前应用程序上下文，进行刷新、设置启动事件和活动标志以及执行其他初始化
			prepareRefresh ();
			// 这个方法由子类实现，对内部维护的 BeanFactory 进行刷新操作，然后返回这个 BeanFactory
			ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory ();
			// 初始化配置 Bean 工厂，比如一些会用到的类加载器和后置处理器。
			prepareBeanFactory (beanFactory);
			try {
				// 由子类实现对 BeanFactory 的其他后置处理，目前没有看到有实现
				postProcessBeanFactory (beanFactory);
				StartupStep beanPostProcess = this. applicationStartup. start ("spring. context. beans. post-process");
				// 实例化并调用所有注册的 BeanFactoryPostProcessor 类型的 Bean
        // 这一步中，上面提到的 BeanFactoryPostProcessor 就开始工作了，比如包扫描、解析 Bean 配置等
        // 这一步结束之后，包扫描到的其他 Bean 就注册到 BeanFactory 中了
				invokeBeanFactoryPostProcessors (beanFactory);
				// 实例化并注册所有 BeanPostProcessor 类型的 Bean，不急着执行
				registerBeanPostProcessors (beanFactory);
				beanPostProcess. end ();
				initMessageSource ();
				initApplicationEventMulticaster ();
				// 依然是提供给子类实现的，目的是用于处理一些其他比较特殊的 Bean，目前似乎也没看到有实现
				onRefresh ();
				// 注册所有的监听器
				registerListeners ();
				// 将剩余所有非懒加载单例 Bean 全部实例化
				finishBeanFactoryInitialization (beanFactory);
				finishRefresh ();
			} catch (BeansException ex) {
				...
				// 发现异常直接销毁所有 Bean
				destroyBeans ();
				// 取消本次刷新操作，重置标记
				cancelRefresh (ex);
				// 继续往上抛异常
				throw ex;
			} finally {
				resetCommonCaches ();
				contextRefresh. end ();
			}
		}
}
```
所以，现在流程就很清晰了，实际上最主要的就是 `refresh` 方法，它从初始化到实例化所有的 Bean 整个流程都已经完成，在这个方法结束之后，整个 IoC 容器基本就可以正常使用了。
我们继续来研究一下 `finishBeanFactoryInitialization` 方法，看看它是怎么加载所有 Bean 的：
```java
protected void finishBeanFactoryInitialization (ConfigurableListableBeanFactory beanFactory) {
		...
		beanFactory. preInstantiateSingletons ();   //套娃
}
```
```java
	@Override
	public void preInstantiateSingletons () throws BeansException {
		...
    // 列出全部 bean 名称
		List<String> beanNames = new ArrayList<>(this. beanDefinitionNames);
		// 开始初始化所有 Bean
		for (String beanName : beanNames) {
      //得到 Bean 定义
			RootBeanDefinition bd = getMergedLocalBeanDefinition (beanName);
      //Bean 不能是抽象类、不能是非单例模式、不能是懒加载的
			if (! bd. isAbstract () && bd. isSingleton () && !bd. isLazyInit ()) {
        //针对于 Bean 和 FactoryBean 分开进行处理
				if (isFactoryBean (beanName)) {
					Object bean = getBean (FACTORY_BEAN_PREFIX + beanName);
					if (bean instanceof SmartFactoryBean<?> smartFactoryBean && smartFactoryBean. isEagerInit ()) {
						getBean (beanName);
					}
				} else {
					getBean (beanName);  //最后都是通过调用 getBean 方法来初始化实例，这里就跟我们之前讲的连起来了
				}
			}
		}
		...
}
```
至此，关于 Spring 容器核心加载流程，我们就探究完毕了，实际单易懂，就是代码量太大了。在后续的 SpringBoot 阶段，我们还会继续深挖 Spring 的某些机制的具体实现细节。
### Mybatis 整合原理
通过之前的了解，我们再来看 Mybatis 的 `@MapperScan` 是如何实现的，现在理解起来就非常简单了。
我们可以直接打开查看：
```java
@Retention (RetentionPolicy. RUNTIME)
@Target ({ElementType. TYPE})
@Documented
@Import ({MapperScannerRegistrar. class})
@Repeatable (MapperScans. class)
public @interface MapperScan {
    String[] value () default {};
    String[] basePackages () default {};
  	...
```
我们发现，和 Aop 一样，它也是通过 Registrar 机制，通过 `@Import` 来进行 Bean 的注册，我们来看看 `MapperScannerRegistrar` 是个什么东西，关键代码如下：
```java
void registerBeanDefinitions (AnnotationMetadata annoMeta, AnnotationAttributes annoAttrs, BeanDefinitionRegistry registry, String beanName) {
    BeanDefinitionBuilder builder = BeanDefinitionBuilder. genericBeanDefinition (MapperScannerConfigurer. class);
    builder. addPropertyValue ("processPropertyPlaceHolders", true);
    ...
}
```
虽然很长很多，但是这些代码都是在添加一些 Bean 定义的属性，而最关键的则是最上方的 `MapperScannerConfigurer`，Mybatis 将其 Bean 信息注册到了容器中，那么这个类又是干嘛的呢？
```java
public class MapperScannerConfigurer implements BeanDefinitionRegistryPostProcessor, InitializingBean, ApplicationContextAware, BeanNameAware {
    private String basePackage;
```
它实现了 BeanDefinitionRegistryPostProcessor，也就是说它为 Bean 信息加载提供了后置处理，我们接着来看看它在 Bean 信息后置处理中做了什么：
```java
public void postProcessBeanDefinitionRegistry (BeanDefinitionRegistry registry) {
    if (this. processPropertyPlaceHolders) {
        this. processPropertyPlaceHolders ();
    }
  	//初始化类路径 Mapper 扫描器，它相当于是一个工具类，可以快速扫描出整个包下的类定义信息
  	//ClassPathMapperScanner 是 Mybatis 自己实现的一个扫描器，修改了一些扫描规则
    ClassPathMapperScanner scanner = new ClassPathMapperScanner (registry);
    scanner. setAddToConfig (this. addToConfig);
    scanner. setAnnotationClass (this. annotationClass);
    scanner. setMarkerInterface (this. markerInterface);
    scanner. setSqlSessionFactory (this. sqlSessionFactory);
    scanner. setSqlSessionTemplate (this. sqlSessionTemplate);
    scanner. setSqlSessionFactoryBeanName (this. sqlSessionFactoryBeanName);
    scanner. setSqlSessionTemplateBeanName (this. sqlSessionTemplateBeanName);
    scanner. setResourceLoader (this. applicationContext);
    scanner. setBeanNameGenerator (this. nameGenerator);
    scanner. setMapperFactoryBeanClass (this. mapperFactoryBeanClass);
    if (StringUtils. hasText (this. lazyInitialization)) {
        scanner. setLazyInitialization (Boolean. valueOf (this. lazyInitialization));
    }
    if (StringUtils. hasText (this. defaultScope)) {
        scanner. setDefaultScope (this. defaultScope);
    }
  	//添加过滤器，这里会配置为所有的接口都能被扫描（因此即使你不添加@Mapper 注解都能够被扫描并加载）
    scanner. registerFilters ();
  	//开始扫描
    scanner. scan (StringUtils. tokenizeToStringArray (this. basePackage, ",; \t\n"));
}
```
开始扫描后，会调用 `doScan ()` 方法，我们接着来看（这是 `ClassPathMapperScanner` 中的扫描方法）：
```java
public Set<BeanDefinitionHolder> doScan (String... basePackages) {
    Set<BeanDefinitionHolder> beanDefinitions = super. doScan (basePackages);
  	//首先从包中扫描所有的 Bean 定义
    if (beanDefinitions. isEmpty ()) {
        LOGGER. warn (() -> {
            return "No MyBatis mapper was found in '" + Arrays. toString (basePackages) + "' package. Please check your configuration.";
        });
    } else {
      	//处理所有的 Bean 定义，实际上就是生成对应 Mapper 的代理对象，并注册到容器中
        this. processBeanDefinitions (beanDefinitions);
    }
  	//最后返回所有的 Bean 定义集合
    return beanDefinitions;
}
```
通过断点我们发现，最后处理得到的 Bean 定义发现此 Bean 是一个 MapperFactoryBean，它不同于普通的 Bean，FactoryBean 相当于为普通的 Bean 添加了一层外壳，它并不是依靠 Spring 直接通过反射创建，而是使用接口中的方法：
```java
public interface FactoryBean<T> {
    String OBJECT_TYPE_ATTRIBUTE = "factoryBeanObjectType";
    @Nullable
    T getObject () throws Exception;
    @Nullable
    Class<?> getObjectType ();
    default boolean isSingleton () {
        return true;
    }
}
```
通过 `getObject ()` 方法，就可以获取到 Bean 的实例了。
注意这里一定要区分 FactoryBean 和 BeanFactory 的概念：
- BeanFactory 是个 Factory，也就是 IOC 容器或对象工厂，所有的 Bean 都是由 BeanFactory ( 也就是 IOC 容器 ) 来进行管理。
- FactoryBean 是一个能生产或者修饰生成对象的工厂 Bean (本质上也是一个 Bean)，可以在 BeanFactory（IOC 容器）中被管理，所以它并不是一个简单的 Bean。当使用容器中 factory bean 的时候，该容器不会返回 factory bean 本身，而是返回其生成的对象。要想获取 FactoryBean 的实现类本身，得在 getBean (String BeanName)中的 BeanName 之前加上&, 写成 getBean (String &BeanName)。
我们也可以自己编写一个实现：
```java
@Component ("test")
public class TestFb implements FactoryBean<Student> {
    @Override
    public Student getObject () throws Exception {
        System. out. println ("获取了学生");
        return new Student ();
    }
    @Override
    public Class<?> getObjectType () {
        return Student. class;
    }
}
```
```java
public static void main (String[] args) {
    log. info ("项目正在启动...");
    ApplicationContext context = new AnnotationConfigApplicationContext (TestConfiguration. class);
    System. out. println (context. getBean ("&test"));   //得到 FactoryBean 本身（得加个&搞得像 C 语言指针一样）
    System. out. println (context. getBean ("test"));   //得到 FactoryBean 调用 getObject ()之后的结果
}
```
因此，实际上我们的 Mapper 最终就以 FactoryBean 的形式，被注册到容器中进行加载了：
```java
public T getObject () throws Exception {
    return this. getSqlSession (). getMapper (this. mapperInterface);
}
```
这样，整个 Mybatis 的 `@MapperScan` 的原理就全部解释完毕了。
在了解完了 Spring 的底层原理之后，我们其实已经完全可以根据这些实现原理来手写一个 Spring 框架了。

---
# SpringMVC
**进入之前：**《Spring 核心内容》《JavaWeb》《JDK 9-17 新特性篇》
此阶段，我们将再次回到 Tomcat 的 Web 应用程序开发中，去感受 Spring 框架为我们带来的巨大便捷。
## MVC 理论基础
在之前，我们给大家讲解了三层架构，包括：
![img](https://s2.loli.net/2023/02/18/2IiK8YrfhF4zyU1.jpg)
每一层都有着各自的职责，其中最关键的当属表示层，因为它相当于就是直接与用户的浏览器打交道的一层，并且所有的请求都会经过它进行解析，然后再告知业务层进行处理，任何页面的返回和数据填充也全靠表示层来完成，因此它实际上是整个三层架构中最关键的一层，而在之前的实战开发中，我们编写了大量的 Servlet（也就是表示层实现）来处理来自浏览器的各种请求，但是我们发现，仅仅是几个很小的功能，以及几个很基本的页面，我们都要编写将近十个 Servlet，如果是更加大型的网站系统，比如淘宝、B 站，光是一个页面中可能就包含了几十甚至上百个功能，想想那样的话写起来得多恐怖。
因此，SpringMVC 正是为了解决这种问题而生的，它是一个非常优秀的表示层框架，采用 MVC 思想设计实现。
MVC 详细解释如下：
- M 是指业务模型（Model）：通俗的讲就是我们之前用于封装数据传递的实体类。
- V 是指用户界面（View）：一般指的是前端页面。
- C 则是控制器（Controller）：控制器就相当于 Servlet 的基本功能，处理请求，返回响应。

![img](https://s2.loli.net/2023/02/18/voy7HYrIbJuw9R3.jpg)
SpringMVC 正是希望这三者之间进行解耦，实现各干各的，更加精细地划分对应的职责。最后再将 View 和 Model 进行渲染，得到最终的页面并返回给前端（就像之前使用 Thymeleaf 那样，把实体数据对象和前端页面都给到 Thymeleaf，然后它会将其进行整合渲染得到最终有数据的页面，而本教程也会使用 Thymeleaf 作为视图解析器进行讲解）

***
## 配置环境并搭建项目
这里我们继续使用之前的 Tomcat 10 服务器，Spring 6 之后要求必须使用 Tomcat 10 或更高版本，跟之前一样，我们直接创建一个新的 JakartaEE 项目。
![image-20230219162053172](https://s2.loli.net/2023/02/19/4IucyfBKsLzASNJ.png)
创建完成后会自动生成相关文件，但是还是请注意检查运行配置中的 URL 和应用程序上下文名称是否一致。
### 传统 XML 配置形式
SpringMvc 项目依然支持多种配置形式，这里我们首先讲解最传统的 XML 配置形式。
首先我们需要添加 Mvc 相关依赖：
```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>6.0.10</version>
</dependency>
```
接着我们需要配置一下 web. xml，将 DispatcherServlet 替换掉 Tomcat 自带的 Servlet，这里 url-pattern 需要写为 `/`，即可完成替换：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee https://jakarta.ee/xml/ns/jakartaee/web-app_5_0.xsd"
         version="5.0">
    <servlet>
        <servlet-name>mvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>mvc</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```
接着需要为整个 Web 应用程序配置一个 Spring 上下文环境（也就是容器），因为 SpringMVC 是基于 Spring 开发的，它直接利用 Spring 提供的容器来实现各种功能，那么第一步依然跟之前一样，需要编写一个配置文件：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>
```
接着我们需要为 DispatcherServlet 配置一些初始化参数来指定刚刚创建的配置文件：
```xml
<servlet>
    <servlet-name>mvc</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
      	<!--     指定我们刚刚创建在类路径下的XML配置文件       -->
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:application.xml</param-value>
    </init-param>
</servlet>
```
这样我们就完成了基本的配置，现在我们可以来测试一下是否配置正确，我们删除项目自带的 Servlet 类，创建一个 Mvc 中使用的 Controller 类，现在还没学没关系，跟着写就行了，这里我们只是测试一下：
```java
@Controller
public class HelloController {
    @ResponseBody
    @RequestMapping("/")
    public String hello(){
        return "HelloWorld!";
    }
}
```
接着我们需要将这个类注册为 Bean 才能正常使用，我们来编写一下 Spring 的配置文件，这里我们直接配置包扫描，XML 下的包扫描需要这样开启：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">
  	<!-- 需要先引入context命名空间，然后直接配置base-package属性就可以了 -->
    <context:component-scan base-package="com.example"/>
</beans>
```
如果可以成功在浏览器中出现 HelloWorld 则说明配置成功：
![image-20230219170637540](https://s2.loli.net/2023/02/19/D1sAFePzj7d49VL.png)
实际上我们上面编写的 Controller 就是负责 Servlet 基本功能的，比如这里我们返回的是 HelloWorld 字符串，那么我们在访问这个地址的时候，得到的就是这里返回的字符串。
### 全注解配置形式
如果你希望完完全全丢弃配置文件，使用纯注解开发，可以直接添加一个类，Tomcat 会在类路径中查找实现 `ServletContainerInitializer` 接口的类，如果发现的话，就用它来配置 Servlet 容器，Spring 提供了这个接口的实现类 `SpringServletContainerInitializer` , 通过 `@HandlesTypes(WebApplicationInitializer.class)` 设置，这个类反过来会查找实现 `WebApplicationInitializer` 的类，并将配置的任务交给他们来完成，因此直接实现接口即可：
```java
public class MainInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{WebConfiguration.class};   //基本的Spring配置类，一般用于业务层配置
    }
    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[0];  //配置DispatcherServlet的配置类、主要用于Controller等配置，这里为了教学简单，就不分这么详细了，只使用上面的基本配置类
    }
    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};    //匹配路径，与上面一致
    }
}
```
接着我们需要再配置类中添加一些必要的注解：
```java
@Configuration
@EnableWebMvc   //快速配置SpringMvc注解，如果不添加此注解会导致后续无法通过实现WebMvcConfigurer接口进行自定义配置
@ComponentScan("com.example.controller")
public class WebConfiguration {
}
```
这样我们同样可以正常访问：
![image-20230219170637540](https://s2.loli.net/2023/02/19/D1sAFePzj7d49VL.png)
之后为了方便，我们就统一使用全注解形式编写。
如果日志科技有报错无法显示 Mvc 相关的日志，请添加以下依赖：
```xml
<dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-api</artifactId>
      <version>1.7.33</version>
</dependency>
<dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-jdk14</artifactId>
      <version>1.7.33</version>
</dependency>
```
添加后就可以正常打印日志了：
![image-20230630162821105](https://s2.loli.net/2023/06/30/7eti1wuU8Bd4RqZ.png)
## Controller 控制器
有了 SpringMVC 之后，我们不必再像之前那样一个请求地址创建一个 Servlet 了，它使用 `DispatcherServlet` 替代 Tomcat 为我们提供的默认的静态资源 Servlet，也就是说，现在所有的请求（除了 jsp，因为 Tomcat 还提供了一个 jsp 的 Servlet）都会经过 `DispatcherServlet` 进行处理。
那么 `DispatcherServlet` 会帮助我们做什么呢？
![img](https://s2.loli.net/2023/02/18/SQNnl3yFjhHbp1G.jpg)
根据图片我们可以了解，我们的请求到达 Tomcat 服务器之后，会交给当前的 Web 应用程序进行处理，而 SpringMVC 使用 `DispatcherServlet` 来处理所有的请求，也就是说它被作为一个统一的访问点，所有的请求全部由它来进行调度。
当一个请求经过 `DispatcherServlet` 之后，会先走 `HandlerMapping`，它会将请求映射为 `HandlerExecutionChain`，依次经过 `HandlerInterceptor` 有点类似于之前我们所学的过滤器，不过在 SpringMVC 中我们使用的是拦截器，然后再交给 `HandlerAdapter`，根据请求的路径选择合适的控制器进行处理，控制器处理完成之后，会返回一个 `ModelAndView` 对象，包括数据模型和视图，通俗的讲就是页面中数据和页面本身（只包含视图名称即可）。
返回 `ModelAndView` 之后，会交给 `ViewResolver`（视图解析器）进行处理，视图解析器会对整个视图页面进行解析，SpringMVC 自带了一些视图解析器，但是只适用于 JSP 页面，我们也可以像之前一样使用 Thymeleaf 作为视图解析器，这样我们就可以根据给定的视图名称，直接读取 HTML 编写的页面，解析为一个真正的 View。
解析完成后，就需要将页面中的数据全部渲染到 View 中，最后返回给 `DispatcherServlet` 一个包含所有数据的成形页面，再响应给浏览器，完成整个过程。
因此，实际上整个过程我们只需要编写对应请求路径的的 Controller 以及配置好我们需要的 ViewResolver 即可，之后还可以继续补充添加拦截器，而其他的流程已经由 SpringMVC 帮助我们完成了。
### 配置视图解析器和控制器
首先我们需要实现最基本的页面解析并返回，第一步就是配置视图解析器，这里我们使用 Thymeleaf 为我们提供的视图解析器，导入需要的依赖：
```xml
<dependency>
    <groupId>org.thymeleaf</groupId>
    <artifactId>thymeleaf-spring6</artifactId>
    <version>3.1.1.RELEASE</version>
</dependency>
```
配置视图解析器非常简单，我们只需要将对应的 `ViewResolver` 注册为 Bean 即可，这里我们直接在配置类中编写：
```java
@Configuration
@EnableWebMvc
@ComponentScan("com.example.controller")
public class WebConfiguration {
    //我们需要使用ThymeleafViewResolver作为视图解析器，并解析我们的HTML页面
    @Bean
    public ThymeleafViewResolver thymeleafViewResolver(SpringTemplateEngine springTemplateEngine){
        ThymeleafViewResolver resolver = new ThymeleafViewResolver();
        resolver.setOrder(1);   //可以存在多个视图解析器，并且可以为他们设定解析顺序
        resolver.setCharacterEncoding("UTF-8");   //编码格式是重中之重
        resolver.setTemplateEngine(springTemplateEngine);   //和之前JavaWeb阶段一样，需要使用模板引擎进行解析，所以这里也需要设定一下模板引擎
        return resolver;
    }
    //配置模板解析器
    @Bean
    public SpringResourceTemplateResolver templateResolver(){
        SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
        resolver.setSuffix(".html");   //需要解析的后缀名称
        resolver.setPrefix("/");   //需要解析的HTML页面文件存放的位置，默认是webapp目录下，如果是类路径下需要添加classpath:前缀
        return resolver;
    }
    //配置模板引擎Bean
    @Bean
    public SpringTemplateEngine springTemplateEngine(ITemplateResolver resolver){
        SpringTemplateEngine engine = new SpringTemplateEngine();
        engine.setTemplateResolver(resolver);   //模板解析器，默认即可
        return engine;
    }
}
```
现在我们就完成了视图解析器的配置，我们接着来创建一个 Controller，创建 Controller 也非常简单，只需在一个类上添加一个 `@Controller` 注解即可，它会被 Spring 扫描并自动注册为 Controller 类型的 Bean，然后我们只需要在类中编写方法用于处理对应地址的请求即可：
```java
@Controller   //直接添加注解即可
public class HelloController {
    @RequestMapping("/index")   //直接填写访问路径
    public ModelAndView index(){
        return new ModelAndView("index");  //返回ModelAndView对象，这里填入了视图的名称
      	//返回后会经过视图解析器进行处理
    }
}
```
接着我们在类路径根目录下创建一个简单 html 文件：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>测试</title>
</head>
<body>
    <p>欢迎来到GayHub全球最大同性交友网站</p>
</body>
</html>
```
我们会发现，打开浏览器之后就可以直接访问我们的 HTML 页面了：
![image-20230220150905300](https://s2.loli.net/2023/02/20/ru4pBgI75JZxG6F.png)
我们在之前，使用 Thymeleaf 解析后端的一些数据时，需要通过 Context 进行传递，而使用 SpringMvc 后，数据我们可以直接向 Model 模型层进行提供：
```java
@RequestMapping(value = "/index")
public ModelAndView index(){
    ModelAndView modelAndView = new ModelAndView("index");
    modelAndView.getModel().put("name", "啊这");   //将name传递给Model
    return modelAndView;
}
```
这样 Thymeleaf 就能收到我们传递的数据进行解析：
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="static/test.js"></script>
</head>
<body>
    HelloWorld！
    <div th:text="${name}"></div>
</body>
</html>
```
当然，为了简便，我们可以直接返回 View 名称，SpringMVC 会将其自动包装为 ModelAndView 对象：
```java
@RequestMapping(value = "/index")
public String index(){
    return "index";
}
```
我们还可以单独添加一个 Model 作为形参进行设置，SpringMVC 通过依赖注入会自动帮助我们传递实例对象：
```java
@RequestMapping(value = "/index")
public String index(Model model){  //这里不仅仅可以是Model，还可以是Map、ModelMap
    model.addAttribute("name", "yyds");
    return "index";
}
```
有了 Spring 框架的加持，相比我们之前编写的 Web 应用程序，简直方便了一个层次，你就说你爱不爱吧，你爱不爱。
注意，一定要保证视图名称下面出现横线并且按住 Ctrl 可以跳转，配置才是正确的（最新版 IDEA）
我们的页面中可能还会包含一些静态资源，比如 js、css，因此这里我们还需要配置一下，让静态资源通过 Tomcat 提供的默认 Servlet 进行解析，我们需要让配置类实现一下 `WebMvcConfigurer` 接口，这样在 Web 应用程序启动时，会根据我们重写方法里面的内容进行进一步的配置：
```java
@Override
public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
    configurer.enable();   //开启默认的Servlet
}
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/static/**").addResourceLocations("/static/");
    //配置静态资源的访问路径
}
```
我们编写一下前端内容：
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>测试</title>
    <!-- 引用静态资源，这里使用Thymeleaf的网址链接表达式，Thymeleaf会自动添加web应用程序的名称到链接前面 -->
    <script th:src="@{/static/test.js}"></script>
</head>
<body>
    <p>欢迎来到交友网站</p>
</body>
</html>
```
创建 `test.js` 并编写如下内容：
```javascript
window.alert("欢迎网站")
```
最后访问页面，页面在加载时就会显示一个弹窗，这样我们就完成了最基本的页面配置。相比之前的方式，这样就简单很多了，直接避免了编写大量的 Servlet 来处理请求。
> [!NOTE] 模板视图使用总结
> - 配置好 `WebConfiguration` 应用配置，若使用前后端耦合借助模板的方式则添加模板相关配置，包括 `ThymeleafViewResolver`、`SpringResourceTemplateResolver`、`SpringTemplateEngine`
> - 实现 `WebMvcConfigurer` 接口的 `addResourceHandlers` 方法处理静态资源访问问题
> - 编写 **controller** 控制器返回模板视图（modelAndView）或者 html 文件名的字符串即可，在 **modelAndView** 中可以添加参数，结合 **Thymeleaf** 模板语法进行参数渲染。

---
### @RequestMapping 详解
前面我们已经了解了如何创建一个控制器来处理我们的请求，接着我们只需要在控制器添加一个方法用于处理对应的请求即可，之前我们需要完整地编写一个 Servlet 来实现，而现在我们只需要添加一个 `@RequestMapping` 即可实现，其实从它的名字我们也能得知，此注解就是将请求和处理请求的方法建立一个映射关系，当收到请求时就可以根据映射关系调用对应的请求处理方法，那么我们就来先聊聊 `@RequestMapping` 吧，注解定义如下：
```java
@Mapping
public @interface RequestMapping {
    String name() default "";
    @AliasFor("path")
    String[] value() default {};
    @AliasFor("value")
    String[] path() default {};
    RequestMethod[] method() default {};
    String[] params() default {};
    String[] headers() default {};
    String[] consumes() default {};
    String[] produces() default {};
}
```
其中最关键的是 path 属性（等价于 value），它决定了当前方法处理的请求路径，注意路径必须全局唯一，任何路径只能有一个方法进行处理，它是一个数组，也就是说此方法不仅仅可以只用于处理某一个请求路径，我们可以使用此方法处理多个请求路径：
```java
@RequestMapping({"/index", "/test"})
public ModelAndView index(){
    return new ModelAndView("index");
}
```
现在我们访问/index 或是/test 都会经过此方法进行处理。
我们也可以直接将 `@RequestMapping` 添加到类名上，表示为此类中的所有请求映射添加一个路径前缀，比如：
```java
@Controller
@RequestMapping("/yyds")
public class MainController {
    @RequestMapping({"/index", "/test"})
    public ModelAndView index(){
        return new ModelAndView("index");
    }
}
```
那么现在我们需要访问 `/yyds/index` 或是 `/yyds/test` 才可以得到此页面。我们可以直接在 IDEA 下方的端点板块中查看当前 Web 应用程序定义的所有请求映射，并且可以通过 IDEA 为我们提供的内置 Web 客户端直接访问某个路径。
路径还支持使用通配符进行匹配：
- ?：表示任意一个字符，比如 `@RequestMapping("/index/x?")` 可以匹配/index/xa、/index/xb 等等。
- *：表示任意 0-n 个字符，比如 `@RequestMapping("/index/*")` 可以匹配/index/lbwnb、/index/yyds 等。
- **：表示当前目录或基于当前目录的多级目录，比如 `@RequestMapping("/index/**")` 可以匹配/index、/index/xxx 等。

我们接着来看下一个 method 属性，顾名思义，它就是请求的方法类型，我们可以限定请求方式，比如：
```java
@RequestMapping(value = "/index", method = RequestMethod.POST)
public ModelAndView index(){
    return new ModelAndView("index");
}
```
现在我们如果直接使用浏览器访问此页面，会显示 405 方法不支持，因为浏览器默认是直接使用 GET 方法获取页面，而我们这里指定为 POST 方法访问此地址，所以访问失败，我们现在再去端点中用 POST 方式去访问，成功得到页面。
![image-20230220152559862](https://s2.loli.net/2023/02/20/JVwN2MhrWBAGni9.png)
我们也可以使用衍生注解直接设定为指定类型的请求映射：
```java
@PostMapping(value = "/index")
public ModelAndView index(){
    return new ModelAndView("index");
}
```
这里使用了 `@PostMapping` 直接指定为 POST 请求类型的请求映射，同样的，还有 `@GetMapping` 可以直接指定为 GET 请求方式，这里就不一一列举了。
我们可以使用 `params` 属性来指定请求必须携带哪些请求参数，比如：
```java
@RequestMapping(value = "/index", params = {"username", "password"})
public ModelAndView index(){
    return new ModelAndView("index");
}
```
比如这里我们要求请求中必须携带 `username` 和 `password` 属性，否则无法访问。它还支持表达式，比如我们可以这样编写：
```java
@RequestMapping(value = "/index", params = {"!username", "password"})
public ModelAndView index(){
    return new ModelAndView("index");
}
```
在 username 之前添加一个感叹号表示请求的不允许携带此参数，否则无法访问，我们甚至可以直接设定一个固定值：
```java
@RequestMapping(value = "/index", params = {"username!=test", "password=123"})
public ModelAndView index(){
    return new ModelAndView("index");
}
```
这样，请求参数 username 不允许为 test，并且 password 必须为 123，否则无法访问。
`header` 属性用法与 `params` 一致，但是它要求的是请求头中需要携带什么内容，比如：
```java
@RequestMapping(value = "/index", headers = "!Connection")
public ModelAndView index(){
    return new ModelAndView("index");
}
```
那么，如果请求头中携带了 `Connection` 属性，将无法访问。其他两个属性：
- consumes： 指定处理请求的提交内容类型（Content-Type），例如 application/json, text/html;
- produces:  指定返回的内容类型，仅当 request 请求头中的 (Accept)类型中包含该指定类型才返回；

### @RequestParam 和@RequestHeader 详解
我们接着来看，如何获取到请求中的参数。
我们只需要为方法添加一个形式参数，并在形式参数前面添加 `@RequestParam` 注解即可：
```java
@RequestMapping(value = "/index")
public ModelAndView index(@RequestParam("username") String username){
    System.out.println("接受到请求参数："+username);
    return new ModelAndView("index");
}
```
我们需要在 `@RequestParam` 中填写参数名称，参数的值会自动传递给形式参数，我们可以直接在方法中使用，注意，如果参数名称与形式参数名称相同，即使不添加 `@RequestParam` 也能获取到参数值。
一旦添加 `@RequestParam`，那么此请求必须携带指定参数，我们也可以将 require 属性设定为 false 来将属性设定为非必须：
```java
@RequestMapping(value = "/index")
public ModelAndView index(@RequestParam(value = "username", required = false) String username){
    System.out.println("接受到请求参数："+username);
    return new ModelAndView("index");
}
```
我们还可以直接设定一个默认值，当请求参数缺失时，可以直接使用默认值：
```java
@RequestMapping(value = "/index")
public ModelAndView index(@RequestParam(value = "username", required = false, defaultValue = "伞兵一号") String username){
    System.out.println("接受到请求参数："+username);
    return new ModelAndView("index");
}
```
如果需要使用 Servlet 原本的一些类，比如：
```java
@RequestMapping(value = "/index")
public ModelAndView index(HttpServletRequest request){
    System.out.println("接受到请求参数："+request.getParameterMap().keySet());
    return new ModelAndView("index");
}
```
直接添加 `HttpServletRequest` 为形式参数即可，SpringMVC 会自动传递该请求原本的 `HttpServletRequest` 对象，同理，我们也可以添加 `HttpServletResponse` 作为形式参数，甚至可以直接将 HttpSession 也作为参数传递：
```java
@RequestMapping(value = "/index")
public ModelAndView index(HttpSession session){
    System.out.println(session.getAttribute("test"));
    session.setAttribute("test", "鸡你太美");
    return new ModelAndView("index");
}
```
我们还可以直接将请求参数传递给一个实体类：
```java
@Data
public class User {
    String username;
    String password;
}
```
注意必须携带 set 方法或是构造方法中包含所有参数，请求参数会自动根据类中的字段名称进行匹配：
```java
@RequestMapping(value = "/index")
public ModelAndView index(User user){
    System.out.println("获取到cookie值为："+user);
    return new ModelAndView("index");
}
```
`@RequestHeader` 与 `@RequestParam` 用法一致，不过它是用于获取请求头参数的，这里就不再演示了。
### @CookieValue 和@SessionAttrbutie
通过使用 `@CookieValue` 注解，我们也可以快速获取请求携带的 Cookie 信息：
```java
@RequestMapping(value = "/index")
public ModelAndView index(HttpServletResponse response,
                          @CookieValue(value = "test", required = false) String test){
    System.out.println("获取到cookie值为："+test);
    response.addCookie(new Cookie("test", "lbwnb"));
    return new ModelAndView("index");
}
```
同样的，Session 也能使用注解快速获取：
```java
@RequestMapping(value = "/index")
public ModelAndView index(@SessionAttribute(value = "test", required = false) String test,
                          HttpSession session){
    session.setAttribute("test", "xxxx");
    System.out.println(test);
    return new ModelAndView("index");
}
```

---
### 重定向和请求转发
重定向和请求转发也非常简单，我们只需要在视图名称前面添加一个前缀即可，比如重定向：
```java
@RequestMapping("/index")
public String index(){
    return "redirect:home";
}
@RequestMapping("/home")
public String home(){
    return "home";
}
```
通过添加 `redirect:` 前缀，就可以很方便地实现重定向，那么请求转发呢，其实也是一样的，使用 `forward:` 前缀表示转发给其他请求映射：
```java
@RequestMapping("/index")
public String index(){
    return "forward:home";
}
@RequestMapping("/home")
public String home(){
    return "home";
}
```

---
### Bean 的 Web 作用域
在学习 Spring 时我们讲解了 Bean 的作用域，包括 `singleton` 和 `prototype`，Bean 分别会以单例和多例模式进行创建，而在 SpringMVC 中，它的作用域被继续细分：
- request：对于每次 HTTP 请求，使用 request 作用域定义的 Bean 都将产生一个新实例，请求结束后 Bean 也消失。
- session：对于每一个会话，使用 session 作用域定义的 Bean 都将产生一个新实例，会话过期后 Bean 也消失。
- global session：不常用，不做讲解。

这里我们创建一个测试类来试试看：
```java
public class TestBean {
}
```
接着将其注册为 Bean，注意这里需要添加 `@RequestScope` 或是 `@SessionScope` 表示此 Bean 的 Web 作用域：
```java
@Bean
@RequestScope
public TestBean testBean(){
    return new TestBean();
}
```
接着我们将其自动注入到 Controller 中：
```java
@Controller
public class MainController {
    @Resource
    TestBean bean;
    @RequestMapping(value = "/index")
    public ModelAndView index(){
        System.out.println(bean);
        return new ModelAndView("index");
    }
}
```
我们发现，每次发起得到的 Bean 实例都不同，接着我们将其作用域修改为 `@SessionScope`，这样作用域就上升到 Session，只要不清理浏览器的 Cookie，那么都会被认为是同一个会话，只要是同一个会话，那么 Bean 实例始终不变。
实际上，它也是通过代理实现的，我们调用 Bean 中的方法会被转发到真正的 Bean 对象去执行。
> [!NOTE] 控制器相关内容总结
> - `@RequestMapping` 进行对视图函数进行映射，指定 *url、method、params、headers* 等
> - `@RequestParam` 用于获取请求参数，可配置 *value、required 和 defaultValue*
> - `@RequestHeader` 用于获取请求头的字段信息，参数同@RequestParam
> - `@CookieValue` 用于获取请求头的 cookie，参数同@RequestParam
> - `@SessionAttribute` 用于获取 session，参数仅有 value、required
> - *重定向*在视图名称前加 `redirect:`，*请求转发*则加 `forward:`
> - Bean 的常用两种 Web 作用域为：`@SessionScope`（同一个会话 Bean 不变） 和 `@RequestScope`（每次请求到的 Bean 都不一样）


***
## RestFul 风格
中文释义为“表现层状态转换”，它不是一种标准，而是一种设计风格。它的主要作用是充分并正确利用 HTTP 协议的特性，规范资源获取的 URI 路径。通俗的讲，RESTful 风格的设计允许将参数通过 URL 拼接传到服务端，目的是让 URL 看起来更简洁实用，并且我们可以充分使用多种 HTTP 请求方式（*POST/GET/PUT/DELETE*），来执行相同请求地址的不同类型操作。
因此，这种风格的连接，我们就可以直接从请求路径中读取参数，比如：
```
http://localhost:8080/mvc/index/123456
```
我们可以直接将 index 的下一级路径作为请求参数进行处理，也就是说现在的请求参数包含在了请求路径中：
```java
@RequestMapping("/index/{str}")
public String index(@PathVariable String str) {
    System.out.println(str);
    return "index";
}
```
注意请求路径我们可以手动添加类似占位符一样的信息，这样占位符位置的所有内容都会被作为请求参数，而方法的形参列表中必须包括一个与占位符同名的并且添加了 `@PathVariable` 注解的参数，或是由 `@PathVariable` 注解指定为占位符名称：
```java
@RequestMapping("/index/{str}")
public String index(@PathVariable("str") String text){
    System.out.println(text);
    return "index";
}
```
如果没有配置正确，方法名称上会出现黄线。
我们可以按照不同功能进行划分：
- POST http://localhost:8080/mvc/index -  添加用户信息，携带表单数据
- GET http://localhost:8080/mvc/index/ {id} -  获取用户信息，id 直接放在请求路径中
- PUT http://localhost:8080/mvc/index -  修改用户信息，携带表单数据
- DELETE http://localhost:8080/mvc/index/ {id} -  删除用户信息，id 直接放在请求路径中

我们分别编写四个请求映射：
```java
@Controller
public class MainController {
    @RequestMapping(value = "/index/{id}", method = RequestMethod.GET)
    public String get(@PathVariable("id") String text){
        System.out.println("获取用户："+text);
        return "index";
    }
    @RequestMapping(value = "/index", method = RequestMethod.POST)
    public String post(String username){
        System.out.println("添加用户："+username);
        return "index";
    }
    @RequestMapping (value = "/index/{id}", method = RequestMethod. DELETE)
    public String delete (@PathVariable ("id") String text){
        System.out.println ("删除用户："+text);
        return "index";
    }
    @RequestMapping (value = "/index", method = RequestMethod. PUT)
    public String put (String username){
        System.out.println ("修改用户："+username);
        return "index";
    }
}
```
这只是一种设计风格而已，各位小伙伴了解即可。

------
## Interceptor 拦截器
拦截器是整个 SpringMVC 的一个重要内容，拦截器与过滤器类似，都是用于拦截一些非法请求，但是我们之前讲解的过滤器是作用于 Servlet 之前，只有经过层层的过滤器才可以成功到达 Servlet，而拦截器并不是在 Servlet 之前，它在 Servlet 与 RequestMapping 之间，相当于 DispatcherServlet 在将请求交给对应 Controller 中的方法之前进行拦截处理，它只会拦截所有 Controller 中定义的请求映射对应的请求（**不会拦截静态资源**），这里一定要区分两者的不同。
![image-20230630194651686](https://s2.loli.net/2023/06/30/6J3D98HdkawAOVK.png)
### 创建拦截器
创建一个拦截器我们需要实现一个 `HandlerInterceptor` 接口：
```java
public class MainInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle (HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println ("我是处理之前！");
        return true;   //只有返回 true 才会继续，否则直接结束
    }
    @Override
    public void postHandle (HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println ("我是处理之后！");
    }
    @Override
    public void afterCompletion (HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
      	//在 DispatcherServlet 完全处理完请求后被调用
        System.out.println ("我是完成之后！");
    }
}
```
接着我们需要在配置类中进行注册：
```java
@Override
public void addInterceptors (InterceptorRegistry registry) {
    registry.addInterceptor (new MainInterceptor ())
      .addPathPatterns ("/**")    //添加拦截器的匹配路径，只要匹配一律拦截
      .excludePathPatterns ("/home");   //拦截器不进行拦截的路径
}
```
现在我们在浏览器中访问 index 页面，拦截器已经生效。
得到整理拦截器的执行顺序：
```
我是处理之前！
我是处理！
我是处理之后！
我是完成之后！
```
也就是说，处理前和处理后，包含了真正的请求映射的处理，在整个流程结束后还执行了一次 `afterCompletion` 方法，其实整个过程与我们之前所认识的 Filter 类似，不过在处理前，我们只需要返回 true 或是 false 表示是否被拦截即可，而不是再去使用 FilterChain 进行向下传递。
那么我们就来看看，如果处理前返回 false，会怎么样：
```
我是处理之前！
```
通过结果发现一旦返回 false，之后的所有流程全部取消，那么如果是在处理中发生异常了呢？
```java
@RequestMapping ("/index")
public String index (){
    System.out.println ("我是处理！");
    if (true) throw new RuntimeException ("");
    return "index";
}
```
结果为：
```
我是处理之前！
我是处理！
我是完成之后！
```
我们发现如果处理过程中抛出异常，那么就不会执行处理后 `postHandle` 方法，但是会执行 `afterCompletion` 方法，我们可以在此方法中获取到抛出的异常。
### 多级拦截器
前面介绍了仅仅只有一个拦截器的情况，我们接着来看如果存在多个拦截器会如何执行，我们以同样的方式创建二号拦截器：
```java
public class SubInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle (HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println ("二号拦截器：我是处理之前！");
        return true;
    }
    @Override
    public void postHandle (HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println ("二号拦截器：我是处理之后！");
    }
    @Override
    public void afterCompletion (HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println ("二号拦截器：我是完成之后！");
    }
}
```
注册二号拦截器：
```java
@Override
public void addInterceptors (InterceptorRegistry registry) {
  	//一号拦截器
    registry.addInterceptor (new MainInterceptor ()). addPathPatterns ("/**"). excludePathPatterns ("/home");
  	//二号拦截器
    registry.addInterceptor (new SubInterceptor ()). addPathPatterns ("/**");
}
```
注意拦截顺序就是注册的顺序，因此拦截器会根据注册顺序依次执行，我们可以打开浏览器运行一次：
```
一号拦截器：我是处理之前！
二号拦截器：我是处理之前！
我是处理！
二号拦截器：我是处理之后！
一号拦截器：我是处理之后！
二号拦截器：我是完成之后！
一号拦截器：我是完成之后！
```
和多级 Filter 相同，在处理之前，是按照顺序从前向后进行拦截的，但是处理完成之后，就按照倒序执行处理后方法，而完成后是在所有的 `postHandle` 执行之后再同样的以倒序方式执行。
那么如果这时一号拦截器在处理前就返回了 false 呢？
```java
@Override
public boolean preHandle (HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    System.out.println ("一号拦截器：我是处理之前！");
    return false;
}
```
得到结果如下：
```
一号拦截器：我是处理之前！
```
我们发现，与单个拦截器的情况一样，一旦拦截器返回 false，那么之后无论有无拦截器，都不再继续。
> [!NOTE] 拦截器用法总结
> 1. 实现拦截器需要实现 `HandlerInterceptor` 接口并重写 `preHandle、postHandle、和afterCompletion` 方法实现处理前、后以及整个完成后
> 2. 在应用配置中重写 `WebMvcConfigurer` 接口的 `addInterceptors` 方法注册拦截器并配置拦截模式和拦截器顺序
> 3. 多个拦截器都需要注册并通过 `order（int）` 方法控制顺序，int 值越小顺序越靠前


---
## 异常处理
当我们的请求映射方法中出现异常时，会直接展示在前端页面，这是因为 SpringMVC 为我们提供了默认的异常处理页面，当出现异常时，我们的请求会被直接转交给专门用于异常处理的控制器进行处理。
我们可以自定义一个异常处理控制器，一旦出现指定异常，就会转接到此控制器执行：
```java
@ControllerAdvice
public class ErrorController {
    @ExceptionHandler (Exception.class)
    public String error (Exception e, Model model){  //可以直接添加形参来获取异常
        e.printStackTrace ();
        model.addAttribute ("e", e);
        return "500";
    }
}
```
接着我们编写一个专门显示异常的页面：
```java
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
  500 - 服务器出现了一个内部错误 QAQ
  <div th:text="${e}"></div>
</body>
</html>
```
接着修改：
```java
@RequestMapping ("/index")
public String index (){
    System.out.println ("我是处理！");
    if (true) throw new RuntimeException ("您的氪金力度不足，无法访问！");
    return "index";
}
```
访问后，我们发现控制台会输出异常信息，同时页面也是我们自定义的一个页面。
> [!NOTE] SpringMVC 异常处理总结
> - SpringMVC 提供了默认的异常处理页面，当出现异常时，我们的请求会被直接转交给专门用于异常处理的控制器进行处理，通过 `@ControllerAdvice` 注解声明错误控制器，并通过 `@ExceptionHandler(Exception.class)` 方法注解声明处理的异常类型。

---
## JSON 数据格式与 Axios 请求
JSON (JavaScript Object Notation, JS 对象简谱) 是一种轻量级的数据交换格式。
我们现在推崇的是前后端分离的开发模式，而不是所有的内容全部交给后端渲染再发送给浏览器，也就是说，整个 Web 页面的内容在一开始就编写完成了，而其中的数据由前端执行 JS 代码来向服务器动态获取，再到前端进行渲染（填充），这样可以大幅度减少后端的压力，并且后端只需要传输关键数据即可（在即将到来的 SpringBoot 阶段，我们将完全采用前后端分离的开发模式）
### JSON 数据格式
既然要实现前后端分离，那么我们就必须约定一种更加高效的数据传输模式，来向前端页面传输后端提供的数据。因此 JSON 横空出世，它非常容易理解，并且与前端的兼容性极好，因此现在比较主流的数据传输方式则是通过 JSON 格式承载的。
一个 JSON 格式的数据长这样，以学生对象为例：
```json
{"name": "杰哥", "age": 18}
```
多个学生可以以数组的形式表示：
```json
[{"name": "杰哥", "age": 18}, {"name": "阿伟", "age": 18}]
```
嵌套关系可以表示为：
```json
{"studentList": [{"name": "杰哥", "age": 18}, {"name": "阿伟", "age": 18}], "count": 2}
```
它直接包括了属性的名称和属性的值，与 JavaScript 的对象极为相似，它到达前端后，可以直接转换为对象，以对象的形式进行操作和内容的读取，相当于以字符串形式表示了一个 JS 对象，我们可以直接在控制台窗口中测试：
```javascript
let obj = JSON.parse ('{"studentList": [{"name": "杰哥", "age": 18}, {"name": "阿伟", "age": 18}], "count": 2}')
//将 JSON 格式字符串转换为 JS 对象
obj. studentList[0]. name   //直接访问第一个学生的名称
```
我们也可以将 JS 对象转换为 JSON 字符串：
```javascript
JSON.stringify (obj)
```
我们后端就可以以 JSON 字符串的形式向前端返回数据，这样前端在拿到数据之后，就可以快速获取，非常方便。
那么后端如何快速创建一个 JSON 格式的数据呢？我们首先需要导入以下依赖：
```xml
<dependency>
      <groupId>com.alibaba.fastjson2</groupId>
      <artifactId>fastjson2</artifactId>
      <version>2.0.34</version>
</dependency>
```
JSON 解析框架有很多种，比较常用的是 Jackson 和 FastJSON，这里我们使用阿里巴巴的 FastJSON 进行解析，这是目前号称最快的 JSON 解析框架，并且现在已经强势推出 FastJSON 2 版本。
首先要介绍的是 JSONObject，它和 Map 的使用方法一样，并且是有序的（实现了 LinkedHashMap 接口），比如我们向其中存放几个数据：
```java
@RequestMapping (value = "/index")
public String index (){
    JSONObject object = new JSONObject ();
    object.put ("name", "杰哥");
    object.put ("age", 18);
    System.out.println (object.toJSONString ());   //以 JSON 格式输出 JSONObject 字符串
    return "index";
}
```
最后我们得到的结果为：
```json
{"name": "杰哥", "age": 18}
```
实际上 JSONObject 就是对 JSON 数据的一种对象表示。同样的还有 JSONArray，它表示一个数组，用法和 List 一样，数组中可以嵌套其他的 JSONObject 或是 JSONArray：
```java
@RequestMapping (value = "/index")
public String index (){
    JSONObject object = new JSONObject ();
    object.put ("name", "杰哥");
    object.put ("age", 18);
    JSONArray array = new JSONArray ();
    array.add (object);
    System.out.println (array.toJSONString ());
    return "index";
}
```
得到的结果为：
```json
[{"name": "杰哥", "age": 18}]
```
当出现循环引用时，会按照以下语法来解析：
![img](https://s2.loli.net/2023/08/14/MjO4awH3X1YnlmR.png)
我们可以也直接创建一个实体类，将实体类转换为 JSON 格式的数据：
```java
@RequestMapping (value = "/index", produces = "application/json")
@ResponseBody
public String data (){
    Student student = new Student ();
    student.setName ("杰哥");
    student.setAge (18);
    return JSON.toJSONString (student);
}
```
这里我们修改了 `produces` 的值，将返回的内容类型设定为 `application/json`，表示服务器端返回了一个 JSON 格式的数据（当然不设置也行，也能展示，这样是为了规范）然后我们在方法上添加一个 `@ResponseBody` 表示方法返回（也可以在类上添加 `@RestController` 表示此 Controller 默认返回的是字符串数据）的结果不是视图名称而是直接需要返回一个字符串作为页面数据，这样，返回给浏览器的就是我们直接返回的字符串内容。
接着我们使用 JSON 工具类将其转换为 JSON 格式的字符串，打开浏览器，得到 JSON 格式数据。
SpringMVC 非常智能，我们可以直接返回一个对象类型，它会被自动转换为 JSON 字符串格式：
```java
@RequestMapping (value = "/data", produces = "application/json")
@ResponseBody
public Student data (){
    Student student = new Student ();
    student.setName ("杰哥");
    student.setAge (18);
    return student;
}
```
注意需要在配置类中添加一下 FastJSON 转换器，这里需要先添加一个依赖：
```xml
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2-extension-spring6</artifactId>
    <version>2.0.34</version>
</dependency>
```
然后编写配置：
```java
@Override
public void configureMessageConverters (List<HttpMessageConverter<?>> converters) {
    converters.add (new FastJsonHttpMessageConverter ());
}
```
再次尝试，内容就会自动转换为 JSON 格式响应给客户端了。
### Axios 异步请求
前面我们讲解了如何向浏览器发送一个 JSON 格式的数据，那么我们现在来看看如何向服务器请求数据。
![img](https://s2.loli.net/2023/08/14/faYcVC6dpIOuJyA.png)
前端为什么需要用到异步请求，这是因为我们的网页是动态的（这里的动态不是指有动画效果，而是能够实时更新内容）比如我们点击一个按钮会弹出新的内容、或是跳转到新的页面、更新页面中的数据等等，这些都需要通过 JS 完成异步请求来实现。
> 前端异步请求指的是在前端中发送请求至服务器或其他资源，并且不阻塞用户界面或其他操作。在传统的同步请求中，当发送请求时，浏览器会等待服务器响应，期间用户无法进行其他操作。而异步请求通过将请求发送到后台，在等待响应的同时，允许用户继续进行其他操作。这种机制能够提升用户体验，并且允许页面进行实时更新。常见的前端异步请求方式包括使用 XMLHttpRequest 对象、Fetch API、以及使用 jQuery 库中的 AJAX 方法，以及目前最常用的 Axios 框架等。

假设我们后端有一个需要实时刷新的数据（随时间而变化）现在需要再前端实时更新展示，这里我们以 axios 框架的简单使用为例子，带各位小伙伴体验如何发起异步请求并更新我们页面中的数据。
首先是前端页面，直接抄作业就行：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>测试</title>
    <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
</head>
<body>
  <p>欢迎来到 GayHub 全球最大同性交友网站</p>
  <p>用户名: <span id="username"></span></p>
  <p>密码: <span id="password"></span></p>
</body>
</html>
```
接着我们使用 axios 框架直接对后端请求 JSON 数据：
```html
<script>
    function getInfo () {
        axios.get ('/mvc/test'). then (({data}) => {
            document.getElementById ('username'). innerText = data. username
            document.getElementById ('password'). innerText = data. password
        })
    }
</script>
```
这样，我们就实现了从服务端获取数据并更新到页面中，前端开发者利用 JS 发起异步请求，可以实现各种各样的效果，而我们后端开发者只需要关心接口返回正确的数据即可，这就已经有前后端分离开发的雏形了（实际上之前，我们在 JavaWeb 阶段使用 XHR 请求也演示过，不过当时是纯粹的数据）
那么我们接着来看，如何向服务端发送一个 JS 对象数据并进行解析，这里以简单的登录为例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>测试</title>
    <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
</head>
<body>
  <p>欢迎来到 GayHub 全球最大同性交友网站</p>
  <button onclick="login()">立即登录</button>
</body>
</html>
```
这里依然使用 axios 发送 POST 请求：
```html
<script>
    function login () {
        axios.post ('/mvc/test', {
            username: 'test',
            password: '123456'
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded '
            }
        }). then (({data}) => {
            if (data. success) {
                alert ('登录成功')
            } else {
                alert ('登录失败')
            }
        })
    }
</script>
```
服务器端只需要在请求参数位置添加一个对象接收即可（和前面是一样的，因为这里也是提交的表单数据）：
```java
@ResponseBody
@PostMapping (value = "/test", produces = "application/json")
public String hello (String username, String password){
    boolean success = "test".equals (user.getUsername ()) && "123456".equals (user.getPassword ());
    JSONObject object = new JSONObject ();
    object.put ("success", success);
    return object.toString ();
}
```
我们也可以将 js 对象转换为 JSON 字符串的形式进行传输，这里需要使用 ajax 方法来处理：
```html
<script>
    function login () {
        axios.post ('/mvc/test', {
            username: 'test',
            password: '123456'
        }). then (({data}) => {
            if (data. success) {
                alert ('登录成功')
            } else {
                alert ('登录失败')
            }
        })
    }
</script>
```
如果我们需要读取前端发送给我们的 JSON 格式数据，那么这个时候就需要添加 `@RequestBody` 注解：
```java
@ResponseBody
@PostMapping (value = "/test", produces = "application/json")
public String hello (@RequestBody User user){
    boolean success = "test".equals (user.getUsername ()) && "123456".equals (user.getPassword());
    JSONObject object = new JSONObject();
    object.put ("success", success);
    return object.toString ();
}
```
这样，我们就实现了前后端使用 JSON 字符串进行通信。
> [!NOTE] Json 和Axios总结
> - 引入 json 格式化和自动转换器 xml 依赖
> - `JsonObject` 为 map，`JsonArray` 为数组
> - 调用 `toString` 方法变为 json 字符串
> - 使用 `@RequestParam` 用于处理URL传参或表单传参
> - 使用 `@RequestBody` 用于json或xml传参

---
## 实现文件上传和下载
利用 SpringMVC，我们可以很轻松地实现文件上传和下载，我们需要在 MainInitializer 中添加一个新的方法：
```java
public class MainInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    ...
    @Override
    protected void customizeRegistration (ServletRegistration. Dynamic registration) {
      	// 直接通过 registration 配置 Multipart 相关配置，必须配置临时上传路径，建议选择方便打开的
        // 同样可以设置其他属性：maxFileSize, maxRequestSize, fileSizeThreshold
        registration.setMultipartConfig (new MultipartConfigElement ("/Users/nagocoler/Download"));
    }
}
```
接着我们直接编写 Controller 即可：
```java
@RequestMapping (value = "/upload", method = RequestMethod. POST)
@ResponseBody
public String upload (@RequestParam MultipartFile file) throws IOException {
    File fileObj = new File ("test. png");
    file.transferTo (fileObj);
    System.out.println ("用户上传的文件已保存到："+fileObj.getAbsolutePath ());
    return "文件上传成功！";
}
```
最后在前端添加一个文件的上传点：
```html
<div>
    <form action="upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file">
        <input type="submit">
    </form>
</div>
```
这样，点击提交之后，文件就会上传到服务器了。
下载其实和我们之前的写法大致一样，直接使用 HttpServletResponse，并向输出流中传输数据即可。
```java
@RequestMapping (value = "/download", method = RequestMethod. GET)
@ResponseBody
public void download (HttpServletResponse response){
    response.setContentType ("multipart/form-data");
    try (OutputStream stream = response.getOutputStream ();
        InputStream inputStream = new FileInputStream ("test. png")){
        IOUtils.copy (inputStream, stream);
    }catch (IOException e){
        e.printStackTrace ();
    }
}
```
在前端页面中添加一个下载点：
```html
<a href="download" download="test.png">下载最新资源</a>
```

---
## 解读 DispatcherServlet 源码
注意：本部分作为选学内容！
到目前为止，关于 SpringMVC 的相关内容就学习得差不多了，但是我们在最后还是需要深入了解一下 DispatcherServlet 底层是如何进行调度的，因此，我们会从源码角度进行讲解。
首先我们需要找到 `DispatcherServlet` 的最顶层 `HttpServletBean`，在这里直接继承的 `HttpServlet`，那么我们首先来看一下，它在初始化方法中做了什么：
```java
public final void init () throws ServletException {
  	//读取配置参数，并进行配置
    PropertyValues pvs = new HttpServletBean.ServletConfigPropertyValues (this.getServletConfig (), this. requiredProperties);
    if (! pvs.isEmpty ()) {
        try {
            BeanWrapper bw = PropertyAccessorFactory.forBeanPropertyAccess (this);
            ResourceLoader resourceLoader = new ServletContextResourceLoader (this.getServletContext ());
            bw.registerCustomEditor (Resource. class, new ResourceEditor (resourceLoader, this.getEnvironment ()));
            this.initBeanWrapper (bw);
            bw.setPropertyValues (pvs, true);
        } catch (BeansException var 4) {
            if (this.logger.isErrorEnabled ()) {
                this.logger.error ("Failed to set bean properties on servlet '" + this.getServletName () + "'", var 4);
            }
            throw var 4;
        }
    }
		//此初始化阶段由子类实现，
    this.initServletBean ();
}
```
我们接着来看 `initServletBean ()` 方法是如何实现的，它是在子类 `FrameworkServlet` 中定义的：
```java
protected final void initServletBean () throws ServletException {
    this.getServletContext (). log ("Initializing Spring " + this.getClass (). getSimpleName () + " '" + this.getServletName () + "'");
    if (this.logger.isInfoEnabled ()) {
        this.logger.info ("Initializing Servlet '" + this.getServletName () + "'");
    }
    long startTime = System.currentTimeMillis ();
    try {
      	//注意：我们在一开始说了 SpringMVC 有两个容器，一个是 Web 容器一个是根容器
      	//Web 容器只负责 Controller 等表现层内容
      	//根容器就是 Spring 容器，它负责 Service、Dao 等，并且它是 Web 容器的父容器。
      	//初始化 WebApplicationContext，这个阶段会为根容器和 Web 容器进行父子关系建立
        this. webApplicationContext = this.initWebApplicationContext ();
        this.initFrameworkServlet ();
    } catch (RuntimeException | ServletException var 4) {
      //... 以下内容全是打印日志
}
```
![img](https://s2.loli.net/2023/06/30/6ZAyRrDw2QMU8Xv.png)
我们来看看 `initWebApplicationContext` 是如何进行初始化的：
```java
protected WebApplicationContext initWebApplicationContext () {
  	//这里获取的是根容器，一般用于配置 Service、数据源等
    WebApplicationContext rootContext = WebApplicationContextUtils.getWebApplicationContext (this.getServletContext ());
    WebApplicationContext wac = null;
    if (this. webApplicationContext != null) {
      	//如果 webApplicationContext 在之前已经存在，则直接给到 wac
        wac = this. webApplicationContext;
        if (wac instanceof ConfigurableWebApplicationContext) {
            ConfigurableWebApplicationContext cwac = (ConfigurableWebApplicationContext) wac;
            if (! cwac.isActive ()) {
                if (cwac.getParent () == null) {
                  	//设定根容器为 Web 容器的父容器
                    cwac.setParent (rootContext);
                }
                this.configureAndRefreshWebApplicationContext (cwac);
            }
        }
    }
    if (wac == null) {
      	//如果 webApplicationContext 是空，那么就从 ServletContext 找一下有没有初始化上下文
        wac = this.findWebApplicationContext ();
    }
    if (wac == null) {
      	//如果还是找不到，直接创个新的，并直接将根容器作为父容器
        wac = this.createWebApplicationContext (rootContext);
    }
    if (! this. refreshEventReceived) {
        synchronized (this. onRefreshMonitor) {
          	//此方法由 DispatcherServlet 实现
            this.onRefresh (wac);
        }
    }
    if (this. publishContext) {
        String attrName = this.getServletContextAttributeName ();
      	//把 Web 容器丢进 ServletContext
        this.getServletContext (). setAttribute (attrName, wac);
    }
    return wac;
}
```
我们接着来看 DispatcherServlet 中实现的 `onRefresh ()` 方法：
```java
@Override
protected void onRefresh (ApplicationContext context) {
    initStrategies (context);
}
protected void initStrategies (ApplicationContext context) {
  	//初始化各种解析器
    initMultipartResolver (context);
    initLocaleResolver (context);
    initThemeResolver (context);
  	//在容器中查找所有的 HandlerMapping，放入集合中
  	//HandlerMapping 保存了所有的请求映射信息（Controller 中定义的），它可以根据请求找到处理器 Handler，但并不是简单的返回处理器，而是将处理器和拦截器封装，形成一个处理器执行链（类似于之前的 Filter）
    initHandlerMappings (context);
  	//在容器中查找所有的 HandlerAdapter，它用于处理请求并返回 ModelAndView 对象
  	//默认有三种实现 HttpRequestHandlerAdapter，SimpleControllerHandlerAdapter 和 AnnotationMethodHandlerAdapter
  	//当 HandlerMapping 找到处理请求的 Controller 之后，会选择一个合适的 HandlerAdapter 处理请求
  	//比如我们之前使用的是注解方式配置 Controller，现在有一个请求携带了一个参数，那么 HandlerAdapter 会对请求的数据进行解析，并传入方法作为实参，最后根据方法的返回值将其封装为 ModelAndView 对象
    initHandlerAdapters (context);
  	//其他的内容
    initHandlerExceptionResolvers (context);
    initRequestToViewNameTranslator (context);
    initViewResolvers (context);
    initFlashMapManager (context);
}
```
DispatcherServlet 初始化过程我们已经了解了，那么我们接着来看 DispatcherServlet 是如何进行调度的，首先我们的请求肯定会经过 `HttpServlet`，然后其交给对应的 doGet、doPost 等方法进行处理，而在 `FrameworkServlet` 中，这些方法都被重写，并且使用 `processRequest` 来进行处理：
```java
protected final void doGet (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    this.processRequest (request, response);
}
protected final void doPost (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    this.processRequest (request, response);
}
```
我们来看看 `processRequest` 做了什么：
```java
protected final void processRequest (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  	//前期准备工作
    long startTime = System.currentTimeMillis ();
    Throwable failureCause = null;
    LocaleContext previousLocaleContext = LocaleContextHolder.getLocaleContext ();
    LocaleContext localeContext = this.buildLocaleContext (request);
    RequestAttributes previousAttributes = RequestContextHolder.getRequestAttributes ();
    ServletRequestAttributes requestAttributes = this.buildRequestAttributes (request, response, previousAttributes);
    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager (request);
    asyncManager.registerCallableInterceptor (FrameworkServlet.class.getName (), new FrameworkServlet.RequestBindingInterceptor ());
    this.initContextHolders (request, localeContext, requestAttributes);
    try {
      	//重点在这里，这里进行了 Service 的执行，不过是在 DispatcherServlet 中定义的
        this.doService (request, response);
    } catch (IOException | ServletException var 16) {
        //...
}
```
请各位一定要耐心，这些大型框架的底层一般都是层层套娃，因为这样写起来层次会更加清晰，那么我们来看看 `DispatcherServlet` 中是如何实现的：
```java
protected void doService (HttpServletRequest request, HttpServletResponse response) throws Exception {
   //...
    try {
      	//重点在这里，这才是整个处理过程中最核心的部分
        this.doDispatch (request, response);
    } finally {
        //...
}
```
终于找到最核心的部分了：
```java
protected void doDispatch (HttpServletRequest request, HttpServletResponse response) throws Exception {
    HttpServletRequest processedRequest = request;
    HandlerExecutionChain mappedHandler = null;
    boolean multipartRequestParsed = false;
    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager (request);
    try {
        try {
            ModelAndView mv = null;
            Object dispatchException = null;
            try {
                processedRequest = this.checkMultipart (request);
                multipartRequestParsed = processedRequest != request;
              	//在 HandlerMapping 集合中寻找可以处理当前请求的 HandlerMapping
                mappedHandler = this.getHandler (processedRequest);
                if (mappedHandler == null) {
                    this.noHandlerFound (processedRequest, response);
                  	//找不到 HandlerMapping 则无法进行处理
                    return;
                }
              	//根据 HandlerMapping 提供的信息，找到可以处理的 HandlerAdapter
                HandlerAdapter ha = this.getHandlerAdapter (mappedHandler.getHandler ());
                String method = request.getMethod ();
                boolean isGet = HttpMethod.GET.matches (method);
                if (isGet || HttpMethod.HEAD.matches (method)) {
                    long lastModified = ha.getLastModified (request, mappedHandler.getHandler ());
                    if ((new ServletWebRequest (request, response)). checkNotModified (lastModified) && isGet) {
                        return;
                    }
                }
              	//执行所有拦截器的 preHandle ()方法
                if (! mappedHandler.applyPreHandle (processedRequest, response)) {
                    return;
                }
              	//使用 HandlerAdapter 进行处理（我们编写的请求映射方法在这个位置才真正地执行了）
              	//HandlerAdapter 会帮助我们将请求的数据进行处理，再来调用我们编写的请求映射方法
              	//最后 HandlerAdapter 会将结果封装为 ModelAndView 返回给 mv
                mv = ha.handle (processedRequest, response, mappedHandler.getHandler ());
                if (asyncManager.isConcurrentHandlingStarted ()) {
                    return;
                }
                this.applyDefaultViewName (processedRequest, mv);
              	//执行所有拦截器的 postHandle ()方法
                mappedHandler.applyPostHandle (processedRequest, response, mv);
            } catch (Exception var 20) {
                dispatchException = var 20;
            } catch (Throwable var 21) {
                dispatchException = new NestedServletException ("Handler dispatch failed", var 21);
            }
          	//最后处理结果，对视图进行渲染等，如果抛出异常会出现错误页面
            this.processDispatchResult (processedRequest, response, mappedHandler, mv, (Exception) dispatchException);
        } catch (Exception var 22) {
            this.triggerAfterCompletion (processedRequest, response, mappedHandler, var 22);
        } catch (Throwable var 23) {
            this.triggerAfterCompletion (processedRequest, response, mappedHandler, new NestedServletException ("Handler processing failed", var 23));
        }
    } finally {
        if (asyncManager.isConcurrentHandlingStarted ()) {
            if (mappedHandler != null) {
                mappedHandler.applyAfterConcurrentHandlingStarted (processedRequest, response);
            }
        } else if (multipartRequestParsed) {
            this.cleanupMultipart (processedRequest);
        }
    }
}
```
所以，根据以上源码分析得出最终的流程图：
![img](https://s2.loli.net/2023/08/14/IzWB8LGjwo1DPml.png)
虽然完成本章学习后，我们已经基本能够基于 Spring 去重新编写一个更加高级的图书管理系统了，但是登陆验证复杂的问题依然没有解决，如果我们依然按照之前的方式编写登陆验证，显然太过简单，它仅仅只是一个登陆，但是没有任何的权限划分或是加密处理，我们需要更加高级的权限校验框架来帮助我们实现登陆操作，下一章，我们会详细讲解如何使用更加高级的 SpringSecurity 框架来进行权限验证。

---
# Spring 常用依赖
```xml
<dependencies>  
    <!--        servlet-->  
    <dependency>  
        <groupId>jakarta.servlet</groupId>  
        <artifactId>jakarta.servlet-api</artifactId>  
        <version>5.0.0</version>  
        <scope>provided</scope>  
    </dependency>  
    <!--        junit测试-->  
    <dependency>  
        <groupId>org.junit.jupiter</groupId>  
        <artifactId>junit-jupiter-api</artifactId>  
        <version>${junit.version}</version>  
        <scope>test</scope>  
    </dependency>  
    <dependency>  
        <groupId>org.junit.jupiter</groupId>  
        <artifactId>junit-jupiter-engine</artifactId>  
        <version>${junit.version}</version>  
        <scope>test</scope>  
    </dependency>  
    <!--        springmvc-->  
    <dependency>  
        <groupId>org.springframework</groupId>  
        <artifactId>spring-webmvc</artifactId>  
        <version>6.0.10</version>  
    </dependency>  
    <!--        slf4j日志-->  
    <dependency>  
        <groupId>org.slf4j</groupId>  
        <artifactId>slf4j-api</artifactId>  
        <version>1.7.33</version>  
    </dependency>  
    <dependency>  
        <groupId>org.slf4j</groupId>  
        <artifactId>slf4j-jdk14</artifactId>  
        <version>1.7.33</version>  
    </dependency>  
    <!--        模板解析器-->  
    <dependency>  
        <groupId>org.thymeleaf</groupId>  
        <artifactId>thymeleaf-spring6</artifactId>  
        <version>3.1.1.RELEASE</version>  
    </dependency>  
    <!--        lombok-->  
    <dependency>  
        <groupId>org.projectlombok</groupId>  
        <artifactId>lombok</artifactId>  
        <version>1.18.28</version>  
        <scope>provided</scope>  
    </dependency>  
    <!--        json格式化-->  
    <dependency>  
        <groupId>com.alibaba.fastjson2</groupId>  
        <artifactId>fastjson2</artifactId>  
        <version>2.0.34</version>  
    </dependency>  
    <!--        json对象自动转换器-->  
    <dependency>  
        <groupId>com.alibaba.fastjson2</groupId>  
        <artifactId>fastjson2-extension-spring6</artifactId>  
        <version>2.0.34</version>  
    </dependency>  
    <!--        IO工具-->  
    <dependency>  
        <groupId>commons-io</groupId>  
        <artifactId>commons-io</artifactId>  
        <version>2.11.0</version>  
    </dependency>  
    <!-- mybatis -->  
    <dependency>  
        <groupId>org.mybatis</groupId>  
        <artifactId>mybatis</artifactId>  
        <!-- 注意，对于Spring 6.0来说，版本需要在3.5以上 -->  
        <version>3.5.13</version>  
    </dependency>  
    <dependency>  
        <groupId>com.mysql</groupId>  
        <artifactId>mysql-connector-j</artifactId>  
        <version>8.0.31</version>  
    </dependency>  
    <!-- Mybatis针对于Spring专门编写的支持框架 -->  
    <dependency>  
        <groupId>org.mybatis</groupId>  
        <artifactId>mybatis-spring</artifactId>  
        <version>3.0.2</version>  
    </dependency>  
    <!-- Spring的JDBC支持框架 -->  
    <dependency>  
        <groupId>org.springframework</groupId>  
        <artifactId>spring-jdbc</artifactId>  
        <version>6.0.10</version>  
    </dependency>  
</dependencies>
```


# Reference

```cardlink
url: https://itbaima.net/
title: "柏码 - 让每一行代码都闪耀智慧的光芒！"
host: itbaima.net
favicon: /favicon.ico
```
[柏码 - 让每一行代码都闪耀智慧的光芒！](https://itbaima.net/)