---
title: Scrapy-修炼手册
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
 | `tag > subtag` <=> `tag subtag` | 选取 tag 的子标签                     | `div > h1 / div h1`                         |
 | `tag`                             | 选择所有具有该标签的元素            | `div`                              |
 | `.class`                        | 选择所有具有该类的元素              | `.main-content / .base.default(多个class使用.拼接)`                    |
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

## 链家网二手房信息

### 需求分析

链接地址： https://wh.lianjia.com/ershoufang/

使用 Scrapy 爬取链家网中武汉市二手房交易数据并保存于 CSV 文件中。

![|500](https://qnpicmap.fcsluck.top/pics/202312132225168.png)
目标信息：
- 房屋名称
- 房屋户型
- 建筑面积
- 房屋朝向
- 装修情况
- 有无电梯
- 房屋总价
- 房屋单价
- 房屋年限

要求：
1. 房屋面积、总价和单价只需要具体的数字，不需要单位名称。
2. 删除字段不全的房屋数据，如有的房屋朝向会显示“暂无数据”，应该剔除。
3. 保存到 CSV 文件中的数据，字段要按照如下顺序排列：房屋名称，房屋户型，建筑面积，房屋朝向，装修情况，有无电梯，房屋总价，房屋单价，房屋年限。

**流程图**：

![|500](https://qnpicmap.fcsluck.top/pics/202312132240109.png)

**实现流程**：

> 1. 创建项目 scrapy startproject lianjia_home
> 2. 使用 ltem 封装数据
> 3. 创建 Spideri 源文件及 Spider 类
> 4. 获取初始请求(start requests())
> 5. 实现主页面解析函数(parse0)
> 6. 实现详细页解析函数使用 Pipeline 实现数据的处理
> 7. 启用 Pipeline
> 8. 运行爬虫

### 初步爬取

在 `items.py` 中定义数据格式：

```python
class LianjiaHomeItem(scrapy.Item):
    # define the fields for your item here like:
    name = scrapy.Field()#房屋名称
    type = scrapy.Field()#户型
    area = scrapy.Field()#面积
    direction = scrapy.Field()#朝向
    fitment = scrapy.Field()#装修情况
    elevator = scrapy.Field()#有无电梯
    total_price = scrapy.Field()#总价
    unit_price = scrapy.Field()#单价
    age = scrapy.Field()#年限
```

在 spiders 文件夹下创建 `lianjia_spider.py` 文件编写爬取解析逻辑，具体代码如下所示：

```python
# -*- coding: utf-8 -*-
from scrapy import Spider
from scrapy import Request
from lianjia_home.items import LianjiaHomeItem

class LianjiaSpider(Spider):
    name = 'home'
    start_url = 'https://wh.lianjia.com/ershoufang/'
    current_page = 1

    def start_requests(self):
        yield Request(url=self.start_url, callback=self.parse)

    def parse(self, response):
        """
      解析房源列表页面
      """
        list_selector = response.css('ul.sellListContent > li')
        for each in list_selector:
            try:
                name = each.css('div.positionInfo a::text').extract_first()  # 房屋名称
                other = each.css(
                    'div.houseInfo::text').extract_first()  # 其他信息:3室2厅 | 112.41平米 | 南 北 | 精装 | 中楼层(共12层)  | 板塔结合
                other_list = other.split('|')
                type = other_list[0].strip(" ")  # 户型
                area = other_list[1].strip(" ")  # 面积
                direction = other_list[2].strip(" ")  # 朝向
                fitment = other_list[3].strip(" ")  # 装修情况
                total_price = each.css('div.totalPrice span::text').extract_first()  # 总价
                unit_price = each.css('div.unitPrice span::text').extract_first()  # 单价
                item = LianjiaHomeItem()
                item['name'] = name
                item['type'] = type
                item['area'] = area
                item['direction'] = direction
                item['fitment'] = fitment
                item['total_price'] = total_price
                item['unit_price'] = unit_price
                # 生成详细页
                detail_url = each.css('div.info > div.title > a::attr(href)').extract_first()
                yield Request(url=detail_url, callback=self.parse_detail, meta={'item': item})
            except:
                pass
        # 获取下一页
        self.current_page += 1
        #print(response.css('div.contentBottom.clear > a[data-page="100"]::text').extract_first()) #页码和总页数为js动态数据无法直接获取到
        total_page = 100
        if self.current_page <= total_page:
            next_page = self.start_url+ 'pg{}'.format(self.current_page)
            print("下一页地址为："+next_page)
            yield Request(url=next_page, callback=self.parse)

    def parse_detail(self, response):
        """
      解析详细页
      """
        item = response.meta['item']
        item['elevator'] = response.css('div.base div.content ul li:nth-last-child(1)::text').extract_first()
        item['age'] = response.css(
            'div.transaction div.content ul li:nth-child(5) span:nth-last-child(1)::text').extract_first()
        yield item #返回数据

```

在终端执行 `scrapy crawl home -o home.csv` 命令进行爬取，爬取结果保存于 home.csv 文件中，部分内容如下图所示：

![](https://qnpicmap.fcsluck.top/pics/202312141047710.png)

### 数据过滤

对于房屋面积、单价只保留数字即可取出多余的文字，对于缺失房屋朝向字段的数据进行删除。

1. 在 `pipelines.py` 文件中编写数据清洗过滤和保存逻辑，具体代码如下所示：

```python
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem
import re

class LianjiaHomePipeline:
    def process_item(self, item, spider):
        """
        数据清洗过滤
        """
        item["area"] = re.findall(r"\d+\.?\d*", item["area"])[0] # 面积
        item["unit_price"] = re.findall(r"\d+\,?\d*", item["unit_price"])[0].replace(',', '') # 单价
        if item["direction"] == "暂无数据": # 房屋朝向没有数据则去除
            raise DropItem("房屋朝向没有数据，抛弃此条数据项: %s"%item)
        return item

class CSVPipeline(object):
    """
    将数据写入csv文件中
    """
    file = None
    index = 0
    column_name_list = ['name','type','area','direction','fitment','elevator','total_price','unit_price','age']

    def open_spider(self, spider): # 爬虫开始时调用
        self.file = open('lianjia_home.csv', 'a', encoding='utf-8')

    def process_item(self, item, spider): # 处理每一个item
        if self.index == 0: # 写入csv文件时先写入列名
          column_name = ','.join(self.column_name_list)
          self.file.write(column_name + '\n')
          self.index = 1
        # 写入具体数据
        line = ','.join([str(item.get(field, '')) for field in self.column_name_list])
        self.file.write(line + '\n')
        return item
    
    def close_spider(self, spider): # 爬虫结束时调用
       self.file.close()
```

2. 开启 `settings.py` 中的 `ITEM_PIPELINES` 管道，首先进行数据清洗过滤，再进行数据持久化存储：

```python
ITEM_PIPELINES = {
   "lianjia_home.pipelines.LianjiaHomePipeline": 300, #先进行数据清洗
   "lianjia_home.pipelines.CSVPipeline": 400, #再进行数据存储
}
```

3. 为了避免每次都要手动再命令行开启爬虫，编写 `start.py` 文件执行爬取命令，简化操作，文件内容如下所示：

```python
from scrapy import cmdline

cmdline.execute("scrapy crawl lianjia_home".split())
```

运行 `start.py` 文件爬取结果保存于 csv 文件中如下所示：

![](https://qnpicmap.fcsluck.top/pics/202312141145611.png)


### 持久存储（数据库）

#### Mysql 数据库

1. python 安装 mysql 库便于使用 python 直接操作 mysql 数据库，首先需要安装 mysqlclient 第三方库：

```sh
pip install mysqlclient
```

2. 保存 qidianNovel 项目中爬取的数据到 mysql 数据库，首先新建 mysql 数据库和数据表定义数据结构：

![](https://qnpicmap.fcsluck.top/pics/202312141456882.png)

3. 编写 pipeline 将数据持久化存储到 mysql 数据库：
```python
import MySQLdb
class MysqlPipeline(object): #处理item的管道，将item插入数据库中
      
    def open_spider(self, spider): #在爬虫开始时调用
        db_name = spider.settings.get('MYSQL_DBNAME', 'qidian')
        user = spider.settings.get('MYSQL_USER', 'root')
        password = spider.settings.get('MYSQL_PASSWORD', '123456')
        host = spider.settings.get('MYSQL_HOST', 'localhost')
        self.db_pool = MySQLdb.connect(host=host,user=user,passwd=password,db=db_name,charset='utf8') #连接数据库
        self.db_cursor = self.db_pool.cursor() #获取游标

    def process_item(self, item, spider): #在爬虫解析到item时调用
        item_values = (item['title'],item['author'],item['category'],item['status'],item['abstract']) #将item中的数据转为元组
        sql = "INSERT INTO novel(title,author,category,status,abstract) VALUES(%s,%s,%s,%s,%s)" #插入数据的sql语句
        self.db_cursor.execute(sql,item_values) #执行sql语句
        return item
    def close_spider(self, spider): #在爬虫结束时调用
        self.db_pool.commit() #提交数据
        self.db_cursor.close() #关闭游标
        self.db_pool.close() #关闭数据库
```

4. 修改 `setting.py` 启用 `item_pipelines`:
```python
   ITEM_PIPELINES = {
   "QiDianNovel.pipelines.QidiannovelPipeline": 300, #首先数据清洗过滤
   "QiDianNovel.pipelines.MysqlPipeline": 400, #再进行持久化存储到MySQL数据库
}
# 数据库配置
MYSQL_HOST = 'localhost'
MYSQL_PORT = 3306
MYSQL_USER = 'root'
MYSQL_PASSWORD = '123456'
MYSQL_DB = 'qidian'
```

启动爬虫，存储于 MySQL 数据库的结果如图所示：

![](https://qnpicmap.fcsluck.top/pics/202312141500420.png)

#### MongoDB 数据库


**基础用法：**

```python
import pymongo #导入pymongo库
1. #连接MongoDB数据库
- #方式一：使用默认host和port
db_client=pymongo.MongoClient()
- #方式二：自定义host和port
db_client =pymongo.MongoClient(host="localhost",port=27017)
- #方式三：使用标准的URI连接语法
db_client =pymongo.MongoClient('mongodb://localhost:27017/)
2. #指定集合
db_collection db["hot"]
3. #插入数据
novel-={'name':'太初',#名称
'author':'高楼大厦',#作者
'form':'连载',#形式
'type':'玄幻' #类型}
4. #调用db_collection的insert_one/many方法将新文档插入到集合
result = db_collection.insert_one(novel)
result = db_collection.insert_many([novel1,novel2])
print(result)
print(result.inserted id)
5. #查询数据
result = db_collection.find_one({"name":"帝国的崛起"})
print(result)
cursor = db_collection.find()
cursor = db_collection.find({"type":"历史"})
6. #可以使用集合的update oneO和update many()方法实现文档的更新。前者仅更新一个文档；后者可以批量更新多个文档。
7. #删除数据
result = db_collection.delete_one({"name":"太初"})
result = db_collection.delete_many({"type":"历史"})
8. #关闭数据库
db_client.close()
```


1. python 安装 mongodb 库便于使用 python 直接操作 mongodb 数据库，首先需要安装 pymongo 第三方库：

```sh
pip install pymongo
```

mongodb 操作流程：
![](https://qnpicmap.fcsluck.top/pics/202312141506781.png)

2. 编写 pipeline 将数据持久化存储到 mongodb 数据库：

```python
import pymongo
class MongoDBPipeline(object):
    def open_spider(self, spider): #在爬虫开始时调用,初始化数据库
        host = spider.settings.get('MONGODB_HOST', 'localhost')
        port = spider.settings.get('MONGODB_PORT', 27017)
        db_name = spider.settings.get('MONGODB_DATABASE', 'qidian')
        collection_name = spider.settings.get('MONGODB_COLLECTION', 'novel')
        self.db_client = pymongo.MongoClient(host=host,port=port) #连接数据库
        self.db = self.db_client[db_name] #获取数据库
        self.db_collection = self.db.get_collection(collection_name) #获取集合

    def process_item(self, item, spider): #在爬虫解析到item时调用
        item_dict = dict(item)
        self.db_collection.insert_one(item_dict) #插入一条数据
        return item
    def close_spider(self, spider): #在爬虫结束时调用
        self.db_client.close()
```

3. 修改 `setting.py` 启用 `item_pipelines`:

```python
ITEM_PIPELINES = {
   "QiDianNovel.pipelines.QidiannovelPipeline": 300,
   "QiDianNovel.pipelines.MongoDBPipeline": 400,
}
# MongoDB 数据库配置
MongoDB = {
    'MONGODB_HOST': 'localhost',
    'MONGODB_PORT': 27017,
    'MONGODB_DATABASE': 'qidian',
    'MONGODB_COLLECTION': 'novel',
}
```

启动爬虫，存储于 MongoDB 数据库的结果如图所示：

![|600](https://qnpicmap.fcsluck.top/pics/202312141632051.png)


#### Redis 数据库

1. python 安装 redis 库便于使用 python 直接操作 redis 数据库，首先需要安装 redis 第三方库：

```sh
pip install redis
```


2. 编写 pipeline 将数据持久化存储到 redis 数据库：

```python
import redis
class RedisPipeline(object):
    def open_spider(self, spider): #在爬虫开始时调用,初始化数据库
        host = spider.settings.get('REDIS_HOST', 'localhost')
        port = spider.settings.get('REDIS_PORT', 6379)
        db_index = spider.settings.get('REDIS_DB', 1)
        password = spider.settings.get('REDIS_PASSWORD', '123456')
        self.redis_client = redis.StrictRedis(host=host,port=port,db=db_index,password=password) #连接数据库

    def process_item(self, item, spider): #在爬虫解析到item时调用
        item_json = json.dumps(dict(item)) #redis大于3.0版本后不支持直接插入字典数据，必须是字符串、字节或者数字，因此转为json字符串保存
        self.redis_client.rpush('novel',item_json) #将json字符串插入到redis列表中
        return item
    def close_spider(self, spider): #在爬虫结束时调用
        self.redis_client.connection_pool.disconnect() #关闭数据库
```

3. 修改 `setting.py` 启用 `item_pipelines`:

```python
ITEM_PIPELINES = {
   "QiDianNovel.pipelines.QidiannovelPipeline": 300,
   "QiDianNovel.pipelines.RedisPipeline": 400,
}
# Redis 数据库配置
Redis = {
    'REDIS_HOST': 'localhost',
    'REDIS_PORT': 6379,
    'REDIS_DB': 1,
    'REDIS_PASSWORD': '123456',
}
```

启动爬虫，存储于 Redis 数据库的结果如图所示：

![](https://qnpicmap.fcsluck.top/pics/202312151113256.png)
![|975](https://qnpicmap.fcsluck.top/pics/202312151113905.png)

---
## QQ 音乐榜单歌曲

[流行指数榜 - QQ音乐-千万正版音乐海量无损曲库新歌热歌天天畅听的高品质音乐平台！](https://y.qq.com/n/ryqq/toplist/4)的数据以 js 动态渲染，可以直接采用开发者提供的 https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?&topid=4 访问该接口可以直接返回排行榜 `json` 数据。

### 定义数据结构

在 `items.py` 中定义需要爬取的数据的结构：

```python
class KwmusicItem(scrapy.Item):
    # define the fields for your item here like:
    song_name = scrapy.Field() # 歌曲名
    singer_name = scrapy.Field() # 歌手名
    album_name = scrapy.Field() # 专辑名
    interval = scrapy.Field() # 时长
```

### 编写爬取逻辑

在 `spiders` 文件夹下新建 `music_spider.py` 编写爬虫类和爬取解析逻辑：

```python
# -*- coding: utf-8 -*-
from typing import Any, Iterable
from scrapy import Request
from scrapy.http import Request, Response
from scrapy.spiders import Spider
from KWMusic.items import KwmusicItem
import json

class MusicSpider(Spider):
    name ='music'
    allowed_domains = ['c.y.qq.com']
    def __init__(self, *args, **kwargs):
        super(MusicSpider, self).__init__(*args, **kwargs)
        self.start_urls = ['https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?&topid=4']

    def start_requests(self) -> Iterable[Request]:
        yield Request(url=self.start_urls[0], callback=self.parse)

    def parse(self, response: Response, **kwargs: Any) -> Any:
        json_text = response.text
        music_dict = json.loads(json_text)
        for music in music_dict['songlist']:
            item = KwmusicItem()
            item['song_name'] = music['data']['songname'] # 歌曲名
            item['album_name'] = music['data']['albumname'] # 专辑名
            item['singer_name'] = music['data']['singer'][0]['name'] # 歌手名
            item['interval'] = music['data']['interval'] # 时长/s
            yield item
```

### 数据存储与启动

将获取的信息保存为 `music.json` 文件，编写 `start.py` 脚本进行爬取并保存：

```python
from scrapy.cmdline import execute

if __name__ == "__main__":
    execute("scrapy crawl music -o music.json".split())
```

---
# Selenium 实现动态页面爬取

**对于 js 动态渲染的数据且请求链接经过参数加密动态生成毫无规律时无法通过指定地址进行爬取时，使用 Selenium 进行爬取。**

## Selenium 安装

1. 安装 python 库 selenium
```sh
pip install selenium
```

2. 安装浏览器驱动程序
需要下载一个 Selenium 调用浏览器的驱动文件。我们以 Chrome 浏览器为例，看一下载 Chrome 浏览器的驱动文件的步骤。
(1) 查看 Chrome 浏览器的版本
首先要查看当前安装的 Chrome 浏览器的版本，以便下载与浏览器版本对应的驱动文件。打开 Chrome 浏览器，点击菜单中的“帮助”→“关于 Google Chrome”,查看 Chromel 的版本号.

(2)下载 Chromedriver
Chromedriver 的下载地址如下所示：
- 官方下载地址：
https://chromedriver.storage.googleapis.com/index.html
- 其他下载地址：
http://npm.taobao.org/mirrors/chromedriver/
火狐浏览器驱动：
[Releases · mozilla/geckodriver](https://github.com/mozilla/geckodriver/releases)

（3）配置环境变量。
需要将驱动文件配置到环境变量中。在 Windows 下，将下载得到的 chromedriver.exe 文件放到 Anaconda3 的 Scripts 目录下就可以了
3. 下载 [Download PhantomJS](https://phantomjs.org/download.html) 无头浏览器，提高爬虫效率

---
## 爬取豆瓣中国大陆电影

#### 需求分析
豆瓣电影网址为 [选电影](https://movie.douban.com/explore) 。页面默认显示 20 条电影信息，将页面拉到最底端，会再加载 20 条信息。因此，如果想要查看更多电影，就必须不断下拉页面。本项目希望使用网络爬虫技术，将尽量多的热点新闻爬取下来保存于 CSV 文件中。
爬取的字段有：电影标题、年份、评分、导演、演员、来源、影评。

#### 方案设计

![|550](https://qnpicmap.fcsluck.top/pics/202312151546447.png)

由于 PhantomJS 浏览器在新版本的 selenium 中已经被弃用，因此采用 firefox 浏览器进行爬取
#### 逻辑实现

1. **定义数据结构**：

```python
class DoubanmovieItem(scrapy.Item):
    # define the fields for your item here like:
    url = scrapy.Field() # 电影链接
    title = scrapy.Field() # 电影标题
    year = scrapy.Field() # 电影年份
    type = scrapy.Field() # 电影类型
    rating = scrapy.Field() # 电影评分
    director = scrapy.Field() # 导演
    actors = scrapy.Field() # 演员
    source = scrapy.Field() # 电影来源
```

2. **实现下载中间件：**

```python
import time
from scrapy.http import HtmlResponse
from selenium.webdriver.common.by import By #By模块
from selenium.webdriver.support.wait import WebDriverWait #等待模块
from selenium.webdriver.support import expected_conditions as EC #顶期条件的模块
from selenium.common.exceptions import TimeoutException, NoSuchElementException #异常模块

class DoubanmovieDownloaderMiddleware:
	def process_request(self, request, spider):
        # Called for each request that goes through the downloader
        # middleware.
        if spider.name == 'doubanmovie':
          spider.driver.get(request.url)
          try:
            WebDriverWait(spider.driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div.playable-filter-title')))
            player_btn = spider.driver.find_element(By.CSS_SELECTOR,'div.playable-filter-title') #获取可播放控件
            player_btn.click() #点击可播放控件，页面会渲染出20条电影数据，并在底部出现加载更多按钮
            # 等待5s页面直到类名为'article'的元素加载完成
            WebDriverWait(spider.driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div.article')))
            # WebDriverWait(spider.driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, 'rating_num')))
            # 此处为点击展开按钮逻辑，还有使用js的scrol1To方法实现将页面向下滚动逻辑等
            explore_more_btn = spider.driver.find_element(By.CSS_SELECTOR,'div.explore-more > button') #获取加载更多按钮
            for i in range(5): #点击5次加载更多按钮，共爬取100条电影数据
              explore_more_btn.click()
              time.sleep(5)
            #获取加载完成的页面代码
            origin_code = spider.driver.page_source
            #将源代码构造成为一个Response对象，并返回
            res = HtmlResponse(url=request.url,encoding='utf-8',body=origin_code,request=request)
            return res
          except TimeoutException:
            print("time out -> 访问超时")
          except NoSuchElementException:
            print("no such element -> 没有此元素")
        return None
```

3. **编写 pipelines 管道进行数据清洗**：

```python
class DoubanmoviePipeline:
    def process_item(self, item, spider):
        #对数据进行清洗，取出多余空格
        for key in item.keys():
            if isinstance(item[key], str):
                item[key] = item[key].strip()
        return item
```

4. **实现 spider 爬取解析逻辑**：

```python
from typing import Any, Iterable, Optional
from scrapy.http import Request
from scrapy.spiders import Spider
from scrapy import Request
from DoubanMovie.items import DoubanmovieItem
from selenium import webdriver

class DoubanSpider(Spider):
    name = 'doubanmovie'
    allowed_domains = ['movie.douban.com']


    def __init__(self, **kwargs: Any):
        options = webdriver.FirefoxOptions()
        options.add_argument('-headless')
        self.start_urls = ['https://movie.douban.com/explore']
        self.driver = webdriver.Firefox(options=options)
        

    def start_requests(self) -> Iterable[Request]:
        yield Request(url=self.start_urls[0], callback=self.parse)


    def parse(self, response):
      item = DoubanmovieItem()
      movie_li_selector = response.css('ul.explore-list li') # 获取电影列表
      for movie in movie_li_selector:
          url = movie.css('a::attr(href)').extract_first()
          title = movie.css('div.drc-subject-info div:nth-child(1) span::text').extract_first()
          rating = movie.css('div.drc-subject-info div:nth-last-child(1) span.drc-rating-num::text').extract_first()
          others = movie.css('div.drc-subject-info div:nth-child(1) div::text').extract_first()
          others_ls = others.split("/")
          item['url'] = url
          item['title'] = title
          item['rating'] = rating
          item['year'] = others_ls[0]
          item['source'] = others_ls[1]
          item['type'] = others_ls[2]
          item['director'] = others_ls[3]
          item['actors'] = others_ls[4]
          yield item
```

5. **修改 setting 开启代理、下载中间件和项目管道**：

```python
ROBOTSTXT_OBEY = False
DEFAULT_REQUEST_HEADERS = {
   "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
   "Accept-Language": "en",
   "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0"
}
DOWNLOADER_MIDDLEWARES = {
   "DoubanMovie.middlewares.DoubanmovieDownloaderMiddleware": 543,
}
ITEM_PIPELINES = {
   "DoubanMovie.pipelines.DoubanmoviePipeline": 300,
}
```

6. **编写 start.py 文件执行命令行命令快速开启爬虫：**

```python
from scrapy.cmdline import execute

if __name__ == "__main__":
    execute("scrapy crawl doubanmovie -o doubanmovie.json".split())
```

爬取结果如下图所示：

![](https://qnpicmap.fcsluck.top/pics/202312151800702.png)

---
# Splash 实现动态页面爬取


## Splash 简介

Splash 提供了一个 HTTP API，可以接收 URL 和一些可选参数，并返回渲染后的 HTML。Scrapy 可以利用 Splash 的 API 来请求页面并处理 JavaScript 渲染，实现对动态网页的爬取和数据提取。

通过将 Scrapy 和 Splash 结合使用，可以更轻松地处理需要 JavaScript 渲染的页面，并且可以在爬虫中模拟用户操作，如点击按钮或填写表单。这使得对于动态网页的爬取和数据提取变得更加灵活和高效。

Splash 支持以下功能：
- 异步方式并行处理多个网页的渲染过程。
- 获取渲染后的 HTML 源代码或屏幕截图。
- 通过关闭图片渲染或者使用 Adblock 规则来加快页面渲染速度。
- 可执行特定的 JavaScript 脚本。
- 可通过 Lua 脚本来控制页面的渲染过程。
- 获取渲染的详细过程并通过 HAR(HTTP Archive)格式呈现。
在使用 Splash 前，需要安装以下 3 个工具或模块：

1. Splash: 一个 Javascript 的渲染服务，带有 HTTP API 的轻量级 Web 浏览器。
2. Docker: 一种容器引擎，Splash 需要在 Docker 中安装和运行。
3. Scrapy-Splash: 实现 Scrapy 中使用 Splash 的模块。

## 环境搭建
1. 安装 Docker
2. 运行 Docker
3. 拉取和开启 Splash:
输入如下命令，就可以拉取 Splash 镜像：
`docker pull scrapinghub/splash`
`docker run -d --name splash -p 8050:8050 scrapinghub/splash`
打开浏览器输入 http:/192.168.199.100:8050 (Docker for Windows,是 http:/localhost:8050)
安装

4. Scrapy-Splash 的安装
Splash 成功安装后，最后就要安装 Splash 对应的 Python 库了，命令如下：
`pip install scrapy-splash`

![|600](https://qnpicmap.fcsluck.top/pics/202312152155132.png)


## 爬取苏宁易购中的 iphone 手机信息

### 需求分析

苏宁易购的首页如下图左所示，网址为 [苏宁易购(Suning.com)-家电家装成套购，专注服务省心购！](https://www.suning.com/)。在页面的搜索栏中输入“iphone”,回车，就会跳转到 iphone 手机的商品销售页面，网址为 https://search.suning.com/iphone/ 如下图右所示。页面默认显示一定条手机信息，将页面往下拉，会不断加载更多手机信息，一页最多有 119 个 ipone 手机的商品信息。本项目希望使用 Splash,将尽量多的 iphone 商品销售信息爬取下来保存于 CSV 文件中。爬取的字段有：商品标题、价格、好评率和店铺名称。

![](https://qnpicmap.fcsluck.top/pics/202312152154460.png)

### 逻辑实现











---
# 参考
1. [Scrapy框架介绍-CSDN博客](https://blog.csdn.net/W_chuanqi/article/details/127718762)
2. [预览Scrapy — Scrapy 文档](https://scrapy-16.readthedocs.io/zh-cn/latest/intro/overview.html)
3. [Python爬虫⚡Python基础→项目实战案例：Scrapy框架、分布式爬虫、数据爬取与项目案例使用教程\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1Wj411B7b2)
4. [小说月票排行榜单\_2023年12月起点小说月票排行-起点中文网](https://www.qidian.com/rank/yuepiao/year2023-month12-/)