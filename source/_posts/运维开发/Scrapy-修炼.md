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

---
# Scrapy 简介
## 引言
Scrapy 是一个基于 Python 的开源网络爬虫框架，用于快速、高效地从网页中提取数据。它提供了一套强大的工具和库，帮助用户轻松地创建和管理网络爬虫。Scrapy 支持并发请求、异步处理、数据存储和导出等功能，同时还提供了丰富的文档和教程，方便用户学习和使用。
Scrapy 的核心是一个引擎、调度器和下载器组成的架构，用户可以通过编写自定义的 Spider 来指定要抓取的网站和提取规则。同时，Scrapy 还提供了命令行工具和 Web 界面，方便用户监控爬取过程并进行调试。Scrapy 框架架构图如下图所示：
![|600](https://qnpicmap.fcsluck.top/pics/202312121028242.png)
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

---
# Scrapy 快速上手
## 起点中文网小说月票榜数据的爬取
### 爬取流程
在 spider 文件夹下创建的爬虫类按照一下流程进行爬取：
![|205](https://qnpicmap.fcsluck.top/pics/202312121421234.png)
启动爬虫后首先执行 `start_requests` 方法对目标地址发起请求，响应成功后自动调用默认回调函数 `parse` 进行数据解析处理，使用 **css 或者 xpath** 语法进行解析获取目标数据，再进行 `yield` 返回，如需进一步爬取需要发起新的请求并 yield 返回。
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
### 创建爬虫
通过 `scrapy genspider [options] <name> <domain>` 生成爬虫文件，示例代码如下所示：
```sh
scrapy genspider qidian_novel https://www.qidian.com/rank/yuepiao/
```
### 编写爬取逻辑
根据需求分析中分析的待爬取网页的源代码结构，编写爬取逻辑如下所示：
```python
# -*- coding: utf-8 -*-  
import scrapy  
from scrapy.spiders import Spider  
class QidianNovelSpider(Spider):  
    name = "qidian_novel"  # 爬虫名称  
    allowed_domains = ["www.qidian.com"]  # 允许爬取的域名  
    start_urls = ["https://www.qidian.com/rank/yuepiao/"]  # 爬虫起始页面  
    # 爬虫解析  
    def parse(self, response):  # 解析函数  
        # 获取小说信息列表  
        list_selector = response.xpath('//div[@class="book-mid-info"]')  
        for one_selector in list_selector:  
            # 获取小说标题、作者、分类、状态、摘要  
            title = one_selector.xpath('h2/a/text()').extract()[0]  
            author = one_selector.xpath('p[1]/a[1]/text()').extract()[0]  
            category = one_selector.xpath('p[1]/a[2]/text()').extract()[0]  
            status = one_selector.xpath('p[1]/span/text()').extract()[0]  
            abstract = one_selector.xpath('p[2]/text()').extract()[0]  
            # 返回小说信息  
            yield {  
                'title': title,  
                'author': author,  
                'category': category,  
                'status': status,  
                'abstract': abstract  
            }  
        next_page_selector = response.css("li.lbf-pagination-item > a.lbf-pagination-next::attr(href)").extract_first()  
        next_page_url = "https:" + (response.url.replace(response.url, next_page_selector))  
        if next_page_url is not None and next_page_url != "javascript:;":  
            yield scrapy.Request(next_page_url)
```
### 执行爬取
在根目录下使用 `scrapy crawl [options] <spider>` 命令启动爬虫：
```sh
scrapy crawl qidian_novel -o novel.csv #结果保存至根目录的novel.csv文件中
```
爬取结果如下图所示：
![](https://qnpicmap.fcsluck.top/pics/202312121355317.png)
也可以将爬虫文件上传至 ScrapyLab 中执行任务，得到如下结果：
![](https://qnpicmap.fcsluck.top/pics/202312121354684.png)
# Scrapy 基本用法
## 爬虫伪装
`scrapy.Request` 对象的参数和说明如下表所示：
 | 参数       | 说明                                       |
|:------------:|--------------------------------------------|
| url        | 请求的 URL 地址                               |
| callback   | 回调函数，用于处理返回的响应数据           |
| method     | 请求方法，可以是 GET、POST 等                |
| headers    | 请求头信息，字典型                                 |
| body       | 请求体数据，用于 POST 请求                   |
| cookies    | 请求中携带的 cookies                        |
| meta       | 元数据，可以传递一些额外的信息             |
| encoding   | 响应数据的编码方式                         |
| priority   | 请求的优先级                               |
| dont_filter| 是否对该请求进行去重处理                   |
| errback    | 错误处理回调函数，处理请求发生错误时的情况  |
可以重写 `start_requests` 函数设置请求头参数对爬虫进行伪装避免被封禁。
```python
# 自定义start_requests
def start_requests(self):
    headers = {
        'User-Agent': """Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)
                        Chrome/96.0.4664.110 Safari/537.36 Edg/96.0.1054.62"""
    }
    for url in self.start_urls:
	    yield scrapy.Request(url=url, headers=self.headers, callback=self.parse, dont_filter=True)
```
## 响应解析
在执行完请求获取到响应 Response 对象后，需要对其进行解析获取目标数据，scrapy 框架中的 Response 对象的常见参数与说明如下表所示：
 | 参数       | 说明                               |
 | :----------: | ---------------------------------- |
 | url        | 响应的 URL 地址                      |
 | status     | 响应的状态码                       |
 | headers    | 响应的头部信息                     |
 | body       | 响应的内容                         |
 | flags      | 标志位，用于标识响应的一些特殊情况 |
 | request    | 生成响应的请求对象                 |
 | meta       | 存储请求和响应之间传递的元数据     |
 | text       | 将响应内容解码为 Unicode 字符串      |
 | xpath()    | 对响应内容进行 XPath 查询            |
 | css()      | 对响应内容进行 CSS 选择器查询        |
### xpath 解析
Scrapy 框架中的 Response 对象提供了方便的方法来进行 XPath 解析。以下是一个简单的示例，演示如何在 Scrapy 中使用 Response 对象进行 XPath 解析：
```python
import scrapy
class MySpider(scrapy.Spider):
    name = 'myspider'
    start_urls = ['http://example.com']
    def parse(self, response):
        # 使用.xpath()方法进行XPath解析
        titles = response.xpath('//h1/text()').extract()
        for title in titles:
            print(title)
```
在上面的示例中，首先定义了一个名为 MySpider 的 Spider 类，并指定了要爬取的起始 URL。然后在 parse 方法中，使用 response 对象的 xpath 方法对页面进行解析，提取出所有 h1 标签中的文本内容，并将其打印出来。
需要注意的是，在 Scrapy 中使用 response 对象的 xpath 方法时，返回的是一个 SelectorList 对象，可以通过 extract()方法将其转换为 Python 列表，从而获取所需的数据。
除了 xpath 之外，Scrapy 还支持 CSS 选择器和正则表达式等方式进行页面解析。不同的选择器适用于不同情况下的页面结构和数据提取需求。
小说爬取示例中的数据解析方式就采取的是 xpath：
```python
    def parse(self, response):  # 解析函数  
        # 获取小说信息列表  
        list_selector = response.xpath('//div[@class="book-mid-info"]')  
        for one_selector in list_selector:  
            # 获取小说标题、作者、分类、状态、摘要  
            title = one_selector.xpath('h2/a/text()').extract()[0]  
            author = one_selector.xpath('p[1]/a[1]/text()').extract()[0]  
            category = one_selector.xpath('p[1]/a[2]/text()').extract()[0]  
            status = one_selector.xpath('p[1]/span/text()').extract()[0]  
            abstract = one_selector.xpath('p[2]/text()').extract()[0]  
            # 返回小说信息  
            yield {  
                'title': title,  
                'author': author,  
                'category': category,  
                'status': status,  
                'abstract': abstract  
            }  
```
### css 解析
CSS 全称 Cascading Style Sheets，即层叠样式表，用于表现 HTML 或 XML 的样式。CSS 表达式的语法比 XPath 简洁，但是功能不如 XPath 强大，大多作为 XPath 的辅助。
scrapy 中的 css 表达式用法和示例如下表可见：

 | 表达式                          | 说明                                | 示例                               |
 | ------------------------------- | ----------------------------------- | ---------------------------------- |
 | *                               | 选取所有元素                        | *                                  |
 | `tag > subtag` <=> `tag subtag` | 选取 tag 的子标签                     | `div > h1`                         |
 | `tag`                             | 选择所有具有该标签的元素            | `div`                              |
 | `.class`                        | 选择所有具有该类的元素              | `.main-content`                    |
 | `#id`                           | 选择具有该 id 的元素                  | `#header`                          |
 | `[attribute]`                   | 选择具有指定属性的元素              | `[href]`                           |
 | `[attribute=value]`             | 选择具有指定属性值的元素            | `[href="https://www.example.com"]` |
 | :nth-child(n)                   | 选择父元素下第 n 个子元素             | `ul li:nth-child(2)`               |
 | :nth-last-child(n)              | 选取元素是其父元素的倒数第 n 个子元素 | `p:nth-last-child(1)`              |
 | :not(selector)                  | 排除符合选择器条件的元素            | `div:not(.main-content)`           |
 | :first-child                    | 选择第一个子元素                    | `li:first-child`                   |
 | `E::text`                         | 获取 E 元素的文本                     | `h1::text`                                   |
例如，假设我们想要从一个网页中提取所有标题的文本信息，可以这样做：
```python
titles = response.css('h1::text').extract()
```
这个代码将使用 css 选择器找到所有 h1 标签，并提取其文本内容存储在 titles 变量中。如果我们想要找到所有 class 为"article"的 div 标签下的段落文本内容，可以这样做：
```python
paragraphs = response.css('div.article > p::text').extract()
```
这个代码将使用 css 选择器找到所有 class 为"article"的 div 标签下的所有段落标签，并提取其文本内容存储在 paragraphs 变量中。
改写小说信息爬取示例中的解析方式：
```python
def parse(self, response):  # 解析函数  
    # 获取小说信息列表  
    # list_selector = response.xpath('//div[@class="book-mid-info"]')  
    list_selector = response.css('div[class="book-mid-info"]')  
    for one_selector in list_selector:  
        # 获取小说标题、作者、分类、状态、摘要  
        # title = one_selector.xpath('h2/a/text()').extract()[0]  
        title = one_selector.css('h2 a::text').extract_first()  
        # author = one_selector.xpath('p[1]/a[1]/text()').extract()[0]  
        author = one_selector.css('p.author > a::text').extract_first()  
        # category = one_selector.xpath('p[1]/a[2]/text()').extract()[0]  
        category = one_selector.css('p.author > a::text').extract()[1]  
        # status = one_selector.xpath('p[1]/span/text()').extract()[0]  
        status = one_selector.css('p.author > span::text').extract_first()  
        # abstract = one_selector.xpath('p[2]/text()').extract()[0]  
        abstract = one_selector.css('p.intro::text').extract_first()  
        # 返回小说信息  
        yield {  
            'title': title,  
            'author': author,  
            'category': category,  
            'status': status,  
            'abstract': abstract  
        }  
```
## Item 封装数据
前面，我们使用 Spider 从页面中提取数据的方法，并且将提取出来的字段保存于字典中。字典使用虽然方便，但也有它的缺陷：
- 字段名**拼写容易出错且无法检测**到这些错误。
- 返回的数据类型无法**确保一致性**。
- 不便于将**数据传递**给其他组件（如传递给用于数据处理的 pipeline 组件）。

```python
# items.py
class QidiannovelItem(scrapy.Item):  
    # define the fields for your item here like:  
    title = scrapy.Field()  # 标题  
    author = scrapy.Field()  # 作者  
    category = scrapy.Field()  # 分类  
    status = scrapy.Field()  # 状态  
    abstract = scrapy.Field()  # 摘要
# qidian_novel.py
from QiDianNovel.items import QidiannovelItem
# 返回小说信息  
item = QidiannovelItem()  # title, author, category, status, abstract  
item['title'] = title  
item['author'] = author  
item['category'] = category  
item['status'] = status  
item['abstract'] = abstract  
yield item
```
## ItemLoader 填充数据
> *统一解析与封装操作，简化数据封装过程*。

目前为止我们爬取的数据的字段较少，但是当项目很大，提取的字段数以百计时，数据的提取规则也会越来越多，再加上还要对提取到的数据做转换处理，代码就会变得庞大，维护起来十分困难。       
为了解决这个问题，Scrapy 提供了项目加载器(ItemLoader)这样一个填充容器。通过填充容器，可以配置 Item 中各个字段的提取规则，并通过函数分析原始数据，最后对 Item 字段赋值，使用起来非常便捷。
Item 和 ItemLoader 的区别：
1. `Item` 提供保存抓取到数据的容器，需要**手动将数据保存于容器**中。
2. `Itemloader` 提供的是**填充容器的机制**。

```python
def parse(self, response):  # 解析函数  
    # 获取小说信息列表
    list_selector = response.css('div[class="book-mid-info"]')  
    for one_selector in list_selector:  
        novel = ItemLoader(item=QidiannovelItem(), selector=one_selector)  
        novel.add_css("title", 'h2 a::text')  
        novel.add_css("author", 'p.author > a::text')  
        novel.add_css("category", 'p.author > a::text')  
        novel.add_css("status", 'p.author > span::text')  
        novel.add_css("abstract", 'p.intro::text')  
        yield novel.load_item()
```
上面返回值 novel.load_item()是一个字典，字典中包含每个字段的列表，需要进一步处理得到需要的值.
```json 
{
 'abstract': ['一名后世的化妆师，穿越过去，吸收了两个人的记忆。追查日谍，捣毁无数日谍组织，抓捕一名又一名日谍的楚凌云，同时伪装成日本人，深入敌群，套取情报，周旋在日本高层之中。在那个动荡的年代，楚凌云用自己的机智和智慧，为祖国的烽火事业贡献着自己的力量，立下了不可磨灭的功勋。'],
 'author': ['罗飞羽', '军事', '谍战特工'],
 'category': ['罗飞羽', '军事', '谍战特工'],
 'status': ['连载'],
 'title': ['谍影凌云']
}
```
## pipeline 处理数据
当 Spider 将收集到的数据封装为 Item 后，它将会被传递到 Item Pipeline(项目管道)组件中等待进一步处理。
- 清理数据
- 验证数据的有效性
- 查重并丢弃
- 将数据按照自定义的格式存储到文件中
- 将数据保存到数据库中

pipeline 默认是关闭的，需要在 `setting.py` 中开启 ITEM_PIPELINES :
```python
ITEM_PIPELINES = {  
   "QiDianNovel.pipelines.QidiannovelPipeline": 300,  
}
```
接着编写 `pipelines.py` 处理逻辑对爬取返回的每个 item 进行处理：
```python
class QidiannovelPipeline:  
    def __init__(self):  
        self.author_set = set()  
    def process_item(self, item, spider):  
        """  
        对item去重  
        :param item:每个item是解析后的一整条数据  
        :param spider:        :return:  
        """        if item['title'] in self.author_set:  
            raise DropItem("查找到重复标题的项: %s" % item)  # 此处抛出重复项异常,后面必定有对应的异常处理  
        return item
```

---

# 实战案例

## 爬取链家网二手房信息





---
# 参考
1. [Scrapy框架介绍-CSDN博客](https://blog.csdn.net/W_chuanqi/article/details/127718762)
2. [预览Scrapy — Scrapy 文档](https://scrapy-16.readthedocs.io/zh-cn/latest/intro/overview.html)
3. [Python爬虫⚡Python基础→项目实战案例：Scrapy框架、分布式爬虫、数据爬取与项目案例使用教程\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1Wj411B7b2)
4. [小说月票排行榜单\_2023年12月起点小说月票排行-起点中文网](https://www.qidian.com/rank/yuepiao/year2023-month12-/)