---
title: Html5+Css+Js
tags: [h5,css,javascript]
categories: Front_end_development
date: 2022-9-10 10:00:00
sticky: 75
excerpt: Web—study about H5、Css、Js
---
# Html5

## 1.表格标签（可以用对齐）

```html
<table>
    <tr>
        <th>表头</th>
        <td>单元格内的文字</td>
        ···
    </tr>
    ···
</table>
```

- tr: 行标签
- td: 单元格标签
- th: 表头标签(自动居中加粗显示)
- thead: 用于定义表格的头部。thead标签内部必须拥有tr标签，一般是位于第一行。
- tbody: 用于定义表格的主体,主要用于放数据本体。
- 属性：<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20220909192737.png" style="zoom:25%;" />

### 合并单元格（td的属性标签）

跨行合并: rowspan=“合并单元格的个数”
跨列合并: colspan=”合并单元格的个数”

目标单元格: (写合并代码)

- 跨行:最上侧单元格为目标单元格,写合并代码
- 跨列:最左侧单元格为目标单元格,写合并代码

## 2.列表标签

### 2.1无序列表

```html
<ul>
    <li>列表项1</li>
    <li>列表项2</li>
    <li>列表项3</li>
</ul>
```

- ul为列表标签（**只能嵌套li标签**）

- li为表项标签（可以放别的标签，相当于一个容器）

### 2.2有序列表（表项排列有序）

```html
<ol>
    <li>列表项1</li>
    <li>列表项2</li>
    <li>列表项3</li>
</ol>
```

- ol标签只能嵌套li标签。
- li标签对相当于一个容器,可以容纳所有元素。
- 有序列表会带有自己样式属性,但在实际使用时,我们会使用CSS来设置。

### 2.3自定义列表

```html
<dl>
	<dt>关于我</dt>
	<dd>博客</dd>
	<dd>发卡网</dd>
    <dd>域名分发</dd>
</dl>	
```

- 在HTML标签中, dl标签用于定义描述列表(或定义列表) , 该标签会与dt (定义项目/名字)和dd( 描述每一个项目/名字)一起使用。

## 表单标签

### 3.1表单的组成

注：<u>在HTML中,一个完整的表单通常由表单域、表单控件(也称为表单元素)和提示信息3个部分构成.</u>

1. <u>表单域</u>： 表单域是一个包含表单元素的区域。在HTML标签中，form标签用于定义表单域,以实现用户信息的收集和传递。form会把它范围内的表单元素信息提交给服务器.

```html
<form action="url地址" method="提交方式" name="表单域名称">
<!-->各种表单元素控件</!-->
</form>
```

2. <u>表单元素</u>：在表单域中可以定义各种表单元素,这些表单元素就是允许用户在表单中输入或者选择的内容控件。

- **input输入表单元素**：

     1. 定义：`<input type="属性值" />`	

     2. input标签为单标签

     3. <u>type属性设置不同的属性值用来指定不同的控件类型</u>

        ![image-20220914211117537](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220914211117537.png)

     4. 其他属性：

        ![image-20220914205332692](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220914205332692.png)

        - <u>name和value是每个表单元素都有的属性值主要给后台人员使用，value为默认值</u>。
        - <u>name表单元素的名字，要求单选按钮和复选框要有相同的name值。</u>
        - <u>只有单选和复选按钮才有checked属性，网页打开默认选中状态。</u>
        - <u>maxlength规定输入字段中的字符的最大长度。</u>

        ```html
        <form method="get" action="https://fcsy.fit.php" name="翻译">
                <!-- text 文本框用户输入任何文字 -->
                用户名：<input type="text" name="username" maxlength="12"> <br>
                <!-- password 密码框 用户看不见输入的密码 -->
                密码：<input type="password" name="password"> <br>
                <!-- radio 单选按钮 可以实现多选一，name是表单元素的名字，相同名字的单选按钮才可以实现多选一 -->
                性别：男<input type="radio" name="gender" value="man" checked="checked">  女<input type="radio" name="gender" value="woman"> <br>
                <!-- checkbox 复选框 可以实现多选 -->
                爱好：吃饭<input type="checkbox" name="hobby">睡觉<input type="checkbox" name="hobby">学习<input type="checkbox" name="hobby" checked="checked"> <br>
                <!-- reset 将表单元素的内容全部清空 -->
                重置：<input type="reset" name="reset" value="重新填写"> <br>
                <!-- submit 提交框 可以将表单提交到服务端 -->
                翻译：<input type="submit" value="免费注册"> <br>
                <!-- 普通按钮 配合JavaScript实现脚本的调用 -->
                     <input type="button" javascript="index.js" value="获取短信验证码"> <br>
                     <!-- file 上传文件到该页面 -->
                上传头像：<input type="file" name="file" value="index">
                    <!-- 为文本框添加标签，以便于点击标签就可以选中文本框填写，for的值必须和id的值相等 -->
                    <label for="text">用户名</label><input type="text" name="text" id="text">
        </form>
        ```
        
     
- **select下拉表单元素**
  
     ```html
     <select>
     <option>选项1</option>
     <option>选项2</option>
     <option>选项3</option>
     <!-->...</!-->
     </select>
     ```
   
     1. `select标签中至少包含一对option标签.`
     
     2. 在option中定义selected=“selected"时，当前项即为默认选中项。
     
   - **textarea文本域元素**
   
     ```html
     今日反馈:
     <textarea>
     pink老师,我知道这个反馈留言是textarea来做的
     </textarea>
     ```
     
     1. `通过textarea标签可以轻松地创建多行文本输入框。`
     
     2. cols= "每行中的字符数” , rows= "显示的行数” ,我们在实际开发中不会使用,都是用CSS来改变大小。
     
## iframe标签

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>iframe</title>
</head>
<body>
    <iframe src="http://www.lvyestudy.com" width="250" height="200"></iframe>
</body>
</html>
```

- <u>在HTML中，我们可以使用iframe标签来实现一个内嵌框架。内嵌框架，就是在当前页面再嵌入另外一个网页。</u>

---

# Css

## ch1 练气

###  1.简介

- CSS是层叠样式表( Cascading Style Sheets )的简称.有时我们也会称之为CSS样式表或级联样式表。

- CSS是也是一种标记语言

- CSS主要用于设置HTML页面中的文本内容(字体、大小对齐方式等)、图片的外形(宽高、边框样式、边距等)以及版面的布局和外观显示样式。

- CSS让我们的网页更加丰富多彩,布局更加灵活自如。简单理解: CSS可以美化HTML,让HTML更漂亮,让页面布局更简单。

#### 1.1CSS语法规范

<u>**CSS规则由两个主要的部分构成:选择器以及一条或多条声明。**</u>

![image-20220917005326815](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220917005326815.png)

- 选择器是用于指定 CSS样式的HTML标签,花括号内是对该对象设置的具体样式

- 属性和属性值以“键值对”的形式出现

- 属性是对指定的对象设置的样式属性,例如字体大小文本颜色等

- 属性和属性值之间用英文 ":" 分开

- 多个“键值对”之间用英文";" 进行区分

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS_Introduction</title>
    <!-- <link rel="stylesheet" href="css/css.css"> -->外联式
    <style> <!--内嵌式-->
        .p1{
            color: lightcoral;
            font:  50% Arial,50% Times New Roman;
            font-size: 12px;
            width: auto;
            height: auto;
        }
        .p2{
            color: aqua;
            font: Times New Roman;
            font-size: 20px;
        }
    </style>
</head>
<body>
    <p class="p1">CSS</p>
    <p class="p2"> i am real person!</p>
</body>
</html>
```

#### 1.2代码风格

1. 紧凑格式

   `h3 { color: deeppink; font-size: 20px; }`

2. 展开格式（更直观）

   ```css
   h3 {
   color: pink;
   font-size: 20px;
   }
   ```

3. 空格规范
   - `属性值前面，冒号后面，保留一个空格`
   - `选择器（标签）和大括号中间保留空格`

### 2.选择器

作用： <u>选择标签设置格式属性</u>

#### 2.1选择器分类

**选择器分为基础选择器和复合选择器两个大类,我们这里先讲解一下基础选择器。**

- 基础选择器是由<u>单个选择器组成的</u>
- 基础选择器包括:<u>标签选择器、类选择器、id 选择器和通配符选择器</u>
- 

##### 2.1.1标签选择器

标签选择器(元素选择器)是指用<u>HTML标签名称</u>作为选择器,按标签名称分类,为页面中某一类标签指定统一的CSS样式。

语法：

```html
标签名 {
	属性1: 属性值1;
	属性2: 属性值2;
	属性3 属性值3; ···
}
```

##### 2.1.2类选择器

如果想要差异化选择不同的标签,单独选一个或者某几个标签 ,可以使用类选择器；<u>**样式点定义，结构类调用，一个或多个，开发最常用**</u>

语法：

```html
.类名 {
	属性1：属性值1；
	···
}
<p class="p1">CSS</p>
```

多类名语法：

`<div class="name1 name2 ···"></div>`

- 在标签class属性中写多个类名,可以同时被调用
- <u>多个类名中间必须用空格分开</u>
- <u>将相同样式放在一个公共样式里，便于调用，提高代码复用率</u>

##### 2.1.3ID选择器

- id选择器可以为标有特定id的HTML元素指定特定的样式。
- HTML元素以<u>id属性来设置id选择器</u>, CSS中id选择器<u>以“#" 来定义</u>。
- id标签格式只能被调用一次，唯一性（常与js使用）

语法：

```html
#ID名 {
	属性1：属性值1；
	···
}
<p id="p1">CSS</p>
```

##### 2.1.4通配符选择器

- 在CSS中,通配符选择器`使用*定义`,它表示选取页面中所有元素(标签)。
- 标签不需要主动调用，自动会给所有元素设置该格式
- 特殊情况才使用,后面讲解使用场景(以下是清除所有的元素标签的内外边距)

语法：

```css
* {
	margin：0；
	padding：0；
}
```
##### 2.1.5属性选择器

- 在CSS中给类选择器**`添加属性修饰`**以设置该属性的标签的样式

语法：

```css
.类名[name="user"] {
	color: pink;
}
```
### 3.字体属性

![image-20220919164322443](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220919164322443.png)

#### 3.1字体类型

- 各种字体之间必须使用英文状态下的<u>逗号隔开</u>
- 一般情况下，如果有<u>空格隔开的多个单词组成的字体加引号</u>.
- 尽量使用系统默认自带字体,保证在任何用户的浏览器中都能正确显示
- 开发常见字体：`‘Microsoft YaHei',tahoma,arial, 'Hiragino Sans GB'`;

语法：

```css
.classname {
font-family: 'Microsoft YaHei',tahoma,arial, 'Hiragino Sans GB';
font-size: 20px;
font-weight: normal/bold/bolder/lighter/number;
font-style: normal/italic;
font: font-styLe font-weight font-size/line-height font-family; 


}
```

#### 3.2字体大小

- px(像素)大小是我们网页的最常用的单位
- 谷歌浏览器默认的文字大小为16px
- 不同浏览器可能默认显示的字号大小不一致,我们尽量给个明确值大小,不要默认大小
- 可以给body指定整个页面文字的大小，但标题标签要单独设置大小
#### 3.3字体粗细

- 100~900（400 等同于normal,而700等同于bold,注意这个数字后面不跟单位)

- bold(字体加粗)
- bolder(字体特粗)
- lighter(字体变细)

#### 3.4文字样式

- normal默认值，浏览器会显示标准的字体样式font-style: normal;
- italic浏览器会显示斜体的字体样式。

#### 3.5字体复合属性

- 使用font属性时,必须按上面语法格式中的顺序书写，<u>`不能更换顺序`</u>，并且各个属性间以`空格隔开`
- 不需要设置的属性可以省略(取默认值) , 但`必须保留font-size和font-family属性`,否则font属性将不起作用


### 4.文本属性

#### 4.1文本颜色

![image-20220919201737750](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220919201737750.png)

#### 4.2对其文本

<u>以本身所占据的空间进行对其调整</u>

![image-20220927225953748](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220927225953748.png)

```css
div {
text-align: center;
}
```

#### 4.3装饰文本

text-decoration属性规定添加到文本的修饰。可以给文本添加下划线、删除线、上划线等。

```css
div {
text- decoration: underline;
}
```

![image-20220927231333931](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220927231333931.png)

#### 4.4文本缩进

- **text-indent**属性用来指定文本的<u>第一行的缩进</u>,通常是将段落的首行缩进。

- **em**是一个相对单位,就是当前元素(font-size) 1个文字的大小，如果当前元素没有设置大小,则会按照父元素的1个文字大小。

```css
P{
text-indent: 2em;//或者10px 
}
```

#### 4.5行间距

**line-height**属性用于设置行间的距离(行高)。可以控制文字行与行之间的距离.

```css
p{
line-height: 26px;
}
```

![image-20220927232624388](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220927232624388.png)







### 5.引入方式

#### 1.行内式

```html
<body style="background-color:black;">

    <h1 style="color:white;padding:30px;">Hostinger Tutorials</h1>

    <p style="color:white;">Something usefull here.</p>

</body>
```

- 行内样式表(内联样式表)是在元素标签内部的style属性中设定CSS样式。**适合于修改简单样式**.
- style实就是标签的属性
- 在双引号中间,写法要符合CSS规范
- 可以控制当前的标签设置样式

#### 2.内嵌式

```html
<head>

  <style type="text/css">

    p {color:white; font-size: 10px;}

    .center {display: block; margin: 0 auto;}

    #button-go, #button-back {border: solid 1px black;}

  </style>

</head>
```

- 标签理论上可以放在HTML文档的任何地方,但一般会放在文档的标签中

- 通过此种方式,可以防便控制当前整个页面中的元素样式设置
- 代码结构清晰,但是并没有实现结构与样式完全分离

#### 3.外联式

```html
<head>

  <link rel="stylesheet" type="text/css" href="style.css" />

</head>
```

### 6.调试工具

- **Ctr|+滚轮** 可以放大开发者工具代码大小。
- 左边是HTML元素结构,右边是CSS样式。
- 右边CSS样式可以改动数值(**左右箭头**或者**直接输入**)和查看颜色。
- **Ctrl + 0**复原浏览器大小。
- 如果点击元素,发现右侧没有样式引入，极有可能是类名或者样式引入错误。
- 如果有样式,但是样式前面有**黄色叹号**提示,则是样式**属性书写错误**。

### 7.综合案例

```html
<!--
 * @Author: Alleyf 3035581811@qq.com
 * @Github: https://github.com/Alleyf
 * @QQ: 3035581811
 * @Signature: You know more，you know less
 * @Date: 2022-10-15 22:52:30
 * @LastEditors: Alleyf 3035581811@qq.com
 * @LastEditTime: 2022-10-16 00:35:46
 * @FilePath: \My_practice\ch3\综合案例\indexdemo.html
 * Copyright (c) 2022 by Alleyf 3035581811@qq.com, All Rights Reserved. 
-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="css/index.css" />
    <style>
        body{
    font: 16px/28px 'Microsoft YaHei';
    text-indent: 2em;
}
    </style>
    <title>cssdemo</title>
</head>
<body>
    <h1 class="tit">北方高温明日达鼎盛 京津冀多地地表温度将超60℃</h1>
    <div class="d1">
        <span class="t">
            2019-07-03 16:31:47 来源:
        </span>
        <span>
            <a href="http://static-3278ff2a-e80b-46df-b1f9-2d88301455e3.bspapp.com/" class="net">黑洞</a>
            <input type="text" name="search" maxlength="12" value="请输入查询条件...">
            <input class="search" type="button" value="搜索">
        </span>
    </div>
    <hr>
    <p class="p1">
        中国天气网讯 今天（3日），华北、黄淮多地出现高温天气，截至下午2点，北京、天津、郑州等地气温突破35℃。预报显示，今后三天（3-5日），这一带的高温天气将继续发酵，高温范围以及强度将在4日达到鼎盛，预计北京、天津、石家庄、济南等地明天的最高气温有望突破38℃，其中北京和石家庄的最高气温还有望创今年以来的新高。
    </p>

    <h4>
        气温41.4℃！地温66.5！北京强势迎七月首个高温日
    </h4>

    <p class="p3">
        <img src="../images/pic.jpeg" /> 
    </p>

    <p class="p1">
        今天，华北、黄淮一带的高温持续发酵，截至今天下午2点，陕西北部、山西西南部、河北南部、北京、天津、山东西部、河南北部最高气温已普遍超过35℃。大城市中，北京、天津、郑州均迎来高温日。
    </p>

    <p class="p1">
        在阳光暴晒下，地表温度也逐渐走高。今天下午2点，华北黄淮大部地区的地表温度都在50℃以上，部分地区地表温度甚至超过60℃。其中，河北衡水地表温度高达68.3℃，天津站和北京站附近的地表温度分别高达66.6℃和66.5℃。
    </p>

    <h4>
        明日热度再升级！京津冀携手冲击38℃+
    </h4>

    <p class="p1">
        中国天气网气象分析师王伟跃介绍，明天（4日），华北、黄淮地区35℃以上的高温天气还将继续升级，并进入鼎盛阶段，高温强度和范围都将发展到最强。 明天，北京南部、天津大部、河北中部和南部、山东中部和西部、山西南部局地、河南北部、东北部分地区的最高气温都将达到或超过35℃。
    </p>

    <p class="p1">
        不过，专家提醒，济南被雨水天气完美绕开，因此未来一周，当地的高温还会天天上岗。在此提醒当地居民注意防暑降温，防范持续高温带来的各种不利影响。（文/张慧 数据支持/王伟跃 胡啸 审核/刘文静 张方丽）
    </p>
    
    <p class="p2">
        本文来源：中国天气网 责任编辑：刘京_NO5631
    </p>
</body>
</html>
```

## ch2 筑基

### 1.Emmet语法

1. 快速生成html标签

- 生成标签直接输入**标签名按tab键**即可比如div 然后tab键，就可以生成<div> </div>
- 如果想要生成多个相同标签加上*就可以了比如**div\*3** 就可以快速生成3个div
- 如果有父子级关系的标签,可以用>比如**ul>li**就可以了
- 如果有兄弟关系的标签,用+就可以了比如**div+p**
- 如果生成带有类名或者id名字的，直接写**.demo**或者**#two** **tab键**就可以了
- 如果生成的div类名是有顺序的，可以用**自增符号$**
- 如果想要在生成的标签**内部写内容可以用{}**表示

2. 快速生成css样式

CSS基本采取**简写形式**即可.

>- 比如w200 按tab可以生成width: 200px;

>- 比如Ih26按tab 可以生成line-height: 26px;

### 2.复合选择器



### 3.元素显示模式



### 4.背景



### 5.三大特性



### 6.注释





---

# Js









[版权归属: Alleyf](https://github.com/Alleyf)
