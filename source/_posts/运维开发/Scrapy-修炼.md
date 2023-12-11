---
title: Scrapy-修炼
date: 2023-12-11 14:24:44
tags:
  - Scrapy
  - python
  - 爬虫
sticky: 85
excerpt: 关于Scrapy爬虫框架的知识点。
author: fcs
index_img: https://picsum.photos/800/250
lang: zh-CN
header-left: "![](D:/开发图片/logo32.png)"
---
![](https://picsum.photos/800/250)
# Python 爬虫两个核心语法
## 迭代器（iterator）
迭代器相当于一个函数，每次调用都可以通过 next（）函数返回下一个值，如果迭代结束了，则抛出 StopIteration.异常。从遍历的角度看这和列表没什么区别，但它占用内存更少，因为不需要一下就生成整个列表。
能够使用 for 循环逐项遍历数据的对象，我们把它叫做可迭代对象。例如列表、字典和 rang（）函数都是可迭代对象。可以通过内置的 iter（）函数来获取对应的迭代器对象。如下代码所示，使用迭代器获取列表中的每个元素。
```python
iterList = [1, 2, 3, 4, 5]
iter = iter(iterList) #生成迭代器对象
print(next(iter))
print(next(iter))
```
![](https://qnpicmap.fcsluck.top/pics/202312112109733.png)


## 生成器（generator）
在 Python 中，把使用了 `yield` 的函数称为生成器(generator)。生成器是一种特殊的迭代器，它形式上和函数很像，只是把 return 换成了 yield。函数在遇到 return 关键字时，会返回值并结束函数。而**生成器在遇到 yield 关键字时，会返回迭代器对象，但不会立即结束，而是保存当前的位置，下次执行时会从当前位置继续执行**。
```python
# 列表存储所有斐波那契数列，并返回列表
def get_fibonacci(max_num):
    fibonacci = [0, 1]
    while len(fibonacci) < max_num:
        fibonacci.append(fibonacci[-1] + fibonacci[-2])
    return fibonacci
# 斐波那契数列生成器
def get_fibonacci_generator(max_num):
    v1,v2,num = 0,1,0
    while num < max_num:
        yield v1
        v1,v2 = v2,v1+v2
        num += 1
for m in get_fibonacci_generator(10):
    print(m,end=" ")
```

![|600](https://qnpicmap.fcsluck.top/pics/202312112145953.png)

# Scrapy 简介

## 引言

Scrapy 是一个基于 Python 的开源网络爬虫框架，用于快速、高效地从网页中提取数据。它提供了一套强大的工具和库，帮助用户轻松地创建和管理网络爬虫。Scrapy 支持并发请求、异步处理、数据存储和导出等功能，同时还提供了丰富的文档和教程，方便用户学习和使用。
Scrapy 的核心是一个引擎、调度器和下载器组成的架构，用户可以通过编写自定义的 Spider 来指定要抓取的网站和提取规则。同时，Scrapy 还提供了命令行工具和 Web 界面，方便用户监控爬取过程并进行调试。Scrapy 框架架构图如下图所示：

 ```mermaid
graph TD
A[Scrapy] -->|Spider| B(Crawler)
A -->|Engine| C(Scheduler)
A --> D(Downloader)
B --> E(Pipeline)
C --> F(DupeFilter)
C --> G(Requests Queue)
D --> G
```
其中 Spider 负责从网站上爬取数据，Crawler 负责协调整个爬虫的流程，Scheduler 负责管理请求队列，Downloader 负责下载网页内容，Pipeline 负责处理爬取到的数据，DupeFilter 负责过滤重复的请求。Requests Queue 用于存储待处理的请求。
总而言之，Scrapy 是一个功能强大、灵活性高、易于使用的网络爬虫框架，适用于各种规模和类型的网络数据抓取任务。


## 安装

为了方便管理 python 包，使用 anaconda 创建一个新环境进行 Scrapy 的学习，首先确保已经安装了 anaconda，接着打开 conda cmd 新建一个 python 环境并激活该环境，代码如下所示：

```sh
conda create -n master python=3.9
conda activate master
```

在 master 环境中安装 Scrapy 包：

```sh
pip install scrapy #通过pip安装
conda install -c scrapinghub scrapy #通过conda安装
```

# Scrapy 基本用法

## 起点中文网小说热销榜数据的爬取

### 创建项目

使用 scrapy 命令创建一个 scrapy 项目，代码如下所示：

```sh
scrapy startproject <project_name> [project_dir]
scrapy startproject QiDianNovel
```

创建结果和文件结构如下图所示：

![](https://qnpicmap.fcsluck.top/pics/202312112254375.png)

项目结构解析：

```sh
E:.
|   scrapy.cfg
\---QiDianNovel
    |   items.py #定义爬取保存的一条数据的格式结构（eg：小说标题，标签，作者，类型···）
    |   middlewares.py #中间件配置（爬虫中间件和下载中间件）
    |   pipelines.py #管道配置进行数据处理（过滤去重、持久化等操作）
    |   settings.py #项目全局配置文件（爬取频率、IP代理池、延时等）
    |   __init__.py #初始化文件
    \---spiders
            __init__.py #爬虫初始化文件
```

