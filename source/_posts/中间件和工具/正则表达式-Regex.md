---
title: 正则表达式-Regex
date: 2023-12-01 21:05:12
tags:
  - 正则表达式
  - Regex
sticky: 60
excerpt: 一些关于正则表达式的知识。
author: fcs
index_img: https://picsum.photos/800/250
lang: zh-CN
header-left: "![](D:/开发图片/logo32.png)"
---

![](https://picsum.photos/800/250)



# 第一章、校验工具

[regex101: build, test, and debug regex](https://regex101.com/) 是一个多语言在线校验正则表达式的平台，可以对输入按照用户编写的正则表达式进行匹配并高亮匹配到的对象。

```cardlink
url: https://regex101.com/
title: "regex101: build, test, and debug regex"
description: "Regular expression tester with syntax highlighting, explanation, cheat sheet for PHP/PCRE, Python, GO, JavaScript, Java, C#/.NET, Rust."
host: regex101.com
favicon: https://regex101.com/static/assets/icon-16.png
image: https://regex101.com/preview/
```

# 第二章、特殊字符

| 特别字符 | 描述                                                                                                                                                                                                                                                          |                                                                                        示例                                                                                         |
|:--------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|   `$`    | 匹配**输入字符串的结尾位置**。如果设置了 RegExp 对象的 Multiline 属性，则 $ 也匹配 '\n' 或 '\r'。要匹配 $ 字符本身，请使用 \$。                                                                                                                               |                                                              ![](http://qnpicmap.fcsluck.top/pics/202312020011471.png)                                                              |
|          |                                                                                                                                                                                                                                                               |                                                                                                                                                                                     |
|  `( )`   | 优先级运算符，标记一个子表达式的**开始和结束位置**（*用于多字符匹配*）。子表达式可以获取供以后使用。要匹配这些字符，请使用 \( 和 \)。                                                                                                                         | ![](http://qnpicmap.fcsluck.top/pics/202312020013867.png)
                                                                                                                                                                                    |
|   `*`    | 匹配前面的子表达式**零次或多次**。要匹配 * 字符，请使用 \*。                                                                                                                                                                                                  |                                                                                                                                                                                     |
|   `+`    | 匹配前面的子表达式**一次或多次(包括一次)**。要匹配 + 字符，请使用 \+。                                                                                                                                                                                        |                                                                                                                                                                                     |
|   `.`    | 匹配**除换行符 \n 之外的任何单字符**。要匹配 . ，请使用 \. 。                                                                                                                                                                                                 |                                                              ![](http://qnpicmap.fcsluck.top/pics/202312020003528.png)                                                              |
|          |                                                                                                                                                                                                                                                               |                                                                                                                                                                                     |
|   `[`    | 给定方括号中的范围进行匹配，标记一个**中括号表达式的开始**。要匹配 \[，请使用 \[。                                                                                                                                                                            |                             ![\|550](http://qnpicmap.fcsluck.top/pics/202312012333847.png)<br>![](http://qnpicmap.fcsluck.top/pics/202312012254132.png)                             |
|          |                                                                                                                                                                                                                                                               |                                                                                                                                                                                     |
|   `?`    | 匹配前面的子表达式**零次或一次**，或指明一个非贪婪限定符。要匹配 ? 字符，请使用 \?。                                                                                                                                                                          |                                                                                                                                                                                     |
|   `\`    | 将**下一个字符标记为或特殊字符、或原义字符、或向后引用、或八进制转义符**。例如，*'\d'匹配任意数字,'\w'匹配任意字符数字和下划线,'\s'匹配空白字符（Tab和换行符）,'\n' 匹配换行符，所有字母转为大写即变成匹配相反含义*。序列 '\\' 匹配 "\"，而 '\(' 则匹配 "("。 | ![](http://qnpicmap.fcsluck.top/pics/202312012353253.png)<br>![](http://qnpicmap.fcsluck.top/pics/202312012342578.png)<br>![](http://qnpicmap.fcsluck.top/pics/202312012341395.png) |
|          |                                                                                                                                                                                                                                                               |                                                                                                                                                                                     |
|   `^`    | 匹配**输入字符串的开始位置**，除非在方括号表达式中使用，**当该符号在方括号表达式中使用时，表示不接受该方括号表达式中的字符集合**。要匹配 ^ 字符本身，请使用 \^。                                                                                              |                               ![](http://qnpicmap.fcsluck.top/pics/202312020008754.png)<br>![](http://qnpicmap.fcsluck.top/pics/202312012337245.png)                                |
|          |                                                                                                                                                                                                                                                               |                                                                                                                                                                                     |
|   `{`    | 标记**限定符表达式的开始**。要匹配 {，请使用 \{。                                                                                                                                                                                                             |                                                                                                                                                                                     |
|    \|    | 或运算符，指明**两项之间的一个选择**。要匹配 \|，请使用 \。                                                                                                                                                                                                   |                                                              ![](http://qnpicmap.fcsluck.top/pics/202312012250643.png)                                                              |

# 第三章、限定符


| 限定符  | 描述                                           |                           示例                            |
|:-------:| ---------------------------------------------- |:---------------------------------------------------------:|
|  `？`   | 匹配前面的子表达式**零次或一次**。             | ![](http://qnpicmap.fcsluck.top/pics/202312012158366.png) |
|   `*`   | 匹配前面的子表达式**任意次**。                 | ![](http://qnpicmap.fcsluck.top/pics/202312012201477.png) |
|   `+`   | 匹配前面的子表达式**至少一次**。               | ![](http://qnpicmap.fcsluck.top/pics/202312012202938.png) |
|  `{n}`  | 匹配前面的子表达式**确定次数为 n 次**          | ![](http://qnpicmap.fcsluck.top/pics/202312012204195.png) |
| `{n,m}` | 范围匹配前面的子表达式**次数为 n~m 次**        | ![](http://qnpicmap.fcsluck.top/pics/202312012205441.png) |
| `{n,}`  | 范围匹配前面的子表达式**次数为 n~$\infty$ 次** | ![](http://qnpicmap.fcsluck.top/pics/202312012207096.png) |


# 第四章、贪婪与懒惰匹配














# 参考

1. [10分钟快速掌握正则表达式\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1da4y1p7iZ/?spm_id_from=333.337.search-card.all.click&vd_source=9c896fa9c3f9023797e8efe7be0c113e)
2. [正则表达式 – 语法 | 菜鸟教程](https://www.runoob.com/regexp/regexp-syntax.html)

```cardlink
url: https://www.runoob.com/regexp/regexp-syntax.html
title: "正则表达式 – 语法 | 菜鸟教程"
description: "正则表达式 - 语法  正则表达式是一种用于匹配和操作文本的强大工具，它是由一系列字符和特殊字符组成的模式，用于描述要匹配的文本模式。 正则表达式可以在文本中查找、替换、提取和验证特定的模式。 例如：  runoo+b，可以匹配 runoob、runooob、runoooooob 等，+ 号代表前面的字符必须至少出现一次（1次或多次）尝试一下 »。   runoo*b，可以匹配 runob、runoob、runoooooob 等，* 号.."
host: www.runoob.com
```

```cardlink
url: https://www.bilibili.com/video/BV1da4y1p7iZ/?spm_id_from=333.337.search-card.all.click&vd_source=9c896fa9c3f9023797e8efe7be0c113e
title: "10分钟快速掌握正则表达式_哔哩哔哩_bilibili"
description: "正则表达式在线测试工具：https://regex101.com/, 视频播放量 466178、弹幕量 1125、点赞数 20277、投硬币枚数 14222、收藏人数 27313、转发人数 2917, 视频作者 奇乐编程学院, 作者简介 ，相关视频：正则表达式30分钟入门40分钟进阶（绝对能学会），女朋友学了一个月Python，就做出了个这，大家觉得还有必要学下去吗？，编程语言鄙视链现状，Python编程：正则表达式，正则表达式教程【完整版】，在高铁上偶遇一个电脑高手，程序员之间的鄙视链，我妈眼中的我 vs 真实的我，js正则表达式实战，推荐一个正则表达式神器，可视化正则表达式工具。"
host: www.bilibili.com
image: https://i2.hdslb.com/bfs/archive/ba08c0c474deb63b844219f19630bed91e9f51a0.jpg@100w_100h_1c.png
```
