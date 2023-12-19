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
## 起点中文网小说月票榜数据的爬取（静态网页入门）
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

## 文件和图片下载

基于文件下载在爬虫中的普遍性和实用性，Scrapy 提供了文件管道 `FilesPipeline` 用于实现文件的下载。你也可以扩展 FilesPipeline,实现自定义的文件管道功能。
1. 在 Spider 中，将想要下载的文件 URL 地址保存到一个列表中，并赋给 key 为 file_urls 的 Item 字段中(`item["file_urls"]`)。
2. 引擎将 Item 传入到 FilesPipeline 管道中。
3. FilesPipeline 获取 Item 后，会读取 Item 中 key 为 file urls 的字段(item["file_urls"]),再根据获得的 URL 地址下载文件。Item 在 FilesPipeline 管道中处于“锁定”状态，直到所有文件全部下载完(或者某种原因下载失败)。
4. 所有文件下载完后，会将各个文件下载的结果信息收集到一个列表中，并赋给 key 为 files 的 Item 字段中(`item[“files]`)。
下载的信息主要包含以下内容：
- 文件下载的路径
- 文件的 URL 地址
- 文件的校验和(Checksum)

![|500](https://qnpicmap.fcsluck.top/pics/202312172000836.png)

### 文件下载
#### 爬取 seaborn 案例源文件

人工智能、大数据领域的学习者和开发者，对 seaborn 一定不会感到陌生。它是一个免费的、基于 Python 的数据统计可视化库，它提供的高级界面，能够绘制极富吸引力且信息丰富的统计图形。图中就是通过 seaborn,展示的统计图形。
爬取地址为：[Example gallery — seaborn 0.9.0 documentation](http://seaborn.pydata.org/archive/0.9/examples/) 本项目要求实现将 seaborn 中所有应用案例的源文件下载到本地。

1. 定义数据结构：
```python
   class SeabornItem(scrapy.Item):
    # define the fields for your item here like:
    file_urls = scrapy.Field() # 下载的文件地址
    files = scrapy.Field() # 下载的文件信息（文件名，下载路径）

```
2. 爬取解析逻辑实现：
```python
from scrapy import Request
from scrapy.http import Request
from scrapy.spiders import Spider
from Seaborn.items import SeabornItem

class SeabornSpider(Spider):
    name ='seaborn'
    allowed_domains = ['seaborn.com']
    start_urls = ['http://seaborn.pydata.org/archive/0.9/examples/index.html']
    # proxy = 'http://127.0.0.1:7890'
    def start_requests(self):
        yield Request(url=self.start_urls[0], callback=self.parse)
    
    def parse(self, response):
        rel_urls = response.css('div.figure.align-center a::attr(href)').extract()
        for href in rel_urls:
            abs_url = response.urljoin(href)
            yield Request(url=abs_url, callback=self.parse_file)

    def parse_file(self, response):
        item = SeabornItem()
        rel_down_url = response.css('a.reference.download.internal::attr(href)').extract_first()
        abs_down_url = response.urljoin(rel_down_url)
        print(abs_down_url)
        item['file_urls'] = [abs_down_url]
        yield item

```

3. 执行上述爬虫，由于网络问题，目标网站是外网，因此无法访问成功。

#### 爬取国家法律法规数据库

为了方便学习查阅国家法律法规，合理获取法条信息，用于学习研究，以[国家法律法规数据库](https://flk.npc.gov.cn/fl.html)为目标获取法律法规文件。

1. 定义数据结构
```python
  class LawItem(scrapy.Item):
    # define the fields for your item here like:
    file_urls = scrapy.Field() # 下载的文件地址
    files = scrapy.Field() # 下载的文件信息（文件名，下载路径，下载状态）
    file_name = scrapy.Field() # 文件名
    file_type = scrapy.Field() # 文件类型 
```
2. 定义文件下载保存 pipeline
```python
from scrapy.pipelines.files import FilesPipeline
from scrapy import Request
class SaveFilePipeline(FilesPipeline):
    #重写设定文件名的方法，file_path返回的值就是文件名
    def file_path(self, request, response=None, info=None, *, item=None):
        file_name = item['file_name'] + '.' + item['file_type'] # 保存的文件名
        folder_name = item['file_type'] # 保存的文件夹：根据文件类型分类保存
        return folder_name + '/' + file_name
```
3. 修改全局配置文件
```python
   USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0"
ROBOTSTXT_OBEY = True
"""文件下载存储路径"""
FILES_STORE ='./laws'
ITEM_PIPELINES = {
   "Seaborn.pipelines.SaveFilePipeline": 300,
}
```
4. 编写爬取解析逻辑
```python
from scrapy.http import Request,FormRequest
from scrapy.spiders import Spider
from Seaborn.items import LawItem
import requests,re,json

class LawSpider(Spider):
    name ='law'
    allowed_domains = ['flk.npc.gov.cn']
    start_urls = ['https://flk.npc.gov.cn/api/?type=flfg&searchType=title%3Bvague&sortTr=f_bbrq_s%3Bdesc&gbrqStart=&gbrqEnd=&sxrqStart=&sxrqEnd=&sort=true&size=10&_=1702872631228']
    proxy = 'http://127.0.0.1:7890'
    concurrent_page = 1


    def test_proxy(self,proxy):
        try:
            r = requests.get(url='http://httpbin.org/get',proxies={'http':proxy},timeout=10)
            print(r.text)
        except Exception as e:
            print(e)

    def start_requests(self):
        first_url = self.start_urls[0]+"&page=%d"%self.concurrent_page
        yield Request(url=self.start_urls[0], callback=self.parse,errback=self.errback,meta={'proxy':self.proxy,'timeout':10})
    
    def errback(self, failure):
        print(failure)

    def parse(self, response):
        result = json.loads(response.text)['result']
        data = result['data']
        self.total_page = result['totalSizes']/10
        for info in data:
            file_name = info['title']
            print(file_name)
            id = info['id']
            api_url = 'https://flk.npc.gov.cn/api/detail'
            yield FormRequest(url=api_url,method="POST",formdata={'id': id},callback=self.parse_file,meta={'file_name':file_name,'proxy':self.proxy,'timeout':10},dont_filter=True)
        # 继续下一页
        self.concurrent_page += 1
        if self.concurrent_page <= 2:
            next_url = self.start_urls[0]+"&page=%d"%self.concurrent_page
            yield Request(url=next_url, callback=self.parse,errback=self.errback,meta={'proxy':self.proxy,'timeout':10})


    def parse_file(self, response):
        item = LawItem()
        item['file_name'] = response.meta['file_name']
        json_text = response.text
        law_file_dict = json.loads(json_text)
        rel_url = law_file_dict['result']['body'][0]['path']
        abs_url = 'https://wb.flk.npc.gov.cn'+rel_url
        item['file_urls'] = [abs_url]
        item['file_type'] = rel_url.split('.')[-1]
        yield item
```

5. 爬取结果如下所示：

![|500](https://qnpicmap.fcsluck.top/pics/202312181414603.png)


### 图片下载

Scrapy 还提供了图片管道 ImagesPipeline 用于实现图片的下载，也可以扩展 ImagesPipeline,实现自定义的图片管道功能。
图片也是文件，下载图片的本质也是下载文件，ImagesPipeline 继承于 FilesPipeline,使用上和 FilesPipeline 基本一致，只是在使用的 item 字段和配置选项上有所差别，如下表所示。

![](https://qnpicmap.fcsluck.top/pics/202312181422225.png)

下载图片必须安装 Pillow 依赖才可以使用：
```sh
pip install Pillow
```


#### 爬取彼岸图网图片

##### 需求分析

1. 下载彼岸图网中不同主题的第一页图片
2. 下载后的图片名称不变
3. 相同主题的图片放于同一文件夹中，且文件夹按照主题命名
4. 每张图片同时生成两张大小不同的缩略图
5. 忽略尺寸过小的图片（高或宽低于 10 像素）


##### 逻辑实现

1. 数据结构定义：
```python
class BianimageItem(scrapy.Item):
    # define the fields for your item here like:
    image_urls = scrapy.Field() # 图片链接
    images = scrapy.Field() # 图片信息
    subject = scrapy.Field() # 图片主题   
```

2. 图片下载 pipeline 自定义设置：
```python
from scrapy.pipelines.images import ImagesPipeline
class SaveImagePipeline(ImagesPipeline):
        
    def get_media_requests(self, item, info):
        """传递图片主题"""
        urls = ItemAdapter(item).get(self.images_urls_field, [])
        return [Request(u, meta={'subject': item['subject']}) for u in urls]

    def file_path(self, request, response=None, info=None, *, item=None):
        """图片重命名"""
        image_subject = request.meta['subject']
        image_name = request.url.split('/')[-1]
        return "%s/%s" % (image_subject, image_name)
    
    def thumb_path(self, request, thumb_id, response=None, info=None, *, item=None):
        """设置缩略图路径及名称"""
        image_subject = request.meta['subject']
        image_name = request.url.split('/')[-1]
        return "%s/%s/%s" % (image_subject,thumb_id,image_name)
```

3. 全局配置文件设置：
```python
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0"

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# 图片下载路径
IMAGES_STORE = "./images"
# 设置缩略图大小
IMAGES_THUMBS = {
    "small": (50, 50),
    "big": (270, 270),
}
# 设置图片最小尺寸
IMAGES_MIN_HEIGHT = 20
IMAGES_MIN_WIDTH = 20  
ITEM_PIPELINES = {
   "BianImage.pipelines.SaveImagePipeline": 300,
}
```

4. 爬取解析逻辑：
```python
# -*- coding: utf-8 -*-
from scrapy import Spider,Request
from BianImage.items import BianimageItem

class ImageSpider(Spider):
    name = 'bianimage'
    def start_requests(self):
        url =  'https://pic.netbian.com'
        yield Request(url, callback=self.parse_subject)
    
    def parse_subject(self, response): # 请求每个主题详情页
        subjects = response.css('div.classify.clearfix a')
        for subject in subjects:
            subject_rel_url = subject.css('::attr(href)').extract_first()
            subject_name = subject.css('::text').extract_first()
            subject_url = response.urljoin(subject_rel_url)
            yield Request(subject_url, callback=self.parse_image,meta={'subject_name':subject_name})
    def parse_image(self, response): # 一个主题下的一整页图片,一个item中包含一个主题一页的所有图片
        item = BianimageItem()
        item['image_urls'] = []
        item['subject'] = response.meta['subject_name']
        image_li = response.css('div.slist ul li:not(.nextpage)')
        for image in image_li:
            image_rel_url = image.css('a img::attr(src)').extract_first()
            image_url = response.urljoin(image_rel_url)
            item['image_urls'].append(image_url)
        yield item
```

5. 爬取结果如下所示：

```json
{
    "image_urls": [
      "https://pic.netbian.com/uploads/allimg/231216/234451-170274149161e1.jpg",
      "https://pic.netbian.com/uploads/allimg/231216/234033-1702741233387f.jpg"
      ···
    ],
    "subject": "4K美女",
    "images": [
      {
        "url": "https://pic.netbian.com/uploads/allimg/231216/234451-170274149161e1.jpg",
        "path": "4K美女/234451-170274149161e1.jpg",
        "checksum": "14ce6e92e874a8ad7c80e639e9e6f367",
        "status": "uptodate"
      },
      {
        "url": "https://pic.netbian.com/uploads/allimg/231216/234033-1702741233387f.jpg",
        "path": "4K美女/234033-1702741233387f.jpg",
        "checksum": "4243357f475f2e820f4c1c2e5d330e51",
        "status": "uptodate"
      }
      ···
    ]
  },
```

![](https://qnpicmap.fcsluck.top/pics/202312181656520.png)



---
# 实战案例

## 链家网二手房信息（列表--->详情多页面数据传递爬取）

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
        #print (response.css('div.contentBottom.clear > a[data-page="100"]::text').extract_first()) #页码和总页数为js动态数据无法直接获取到
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
    将数据写入 csv 文件中
    """
    file = None
    index = 0
    column_name_list = ['name','type','area','direction','fitment','elevator','total_price','unit_price','age']

    def open_spider(self, spider): # 爬虫开始时调用
        self.file = open('lianjia_home.csv', 'a', encoding='utf-8')

    def process_item(self, item, spider): # 处理每一个 item
        if self.index == 0: # 写入 csv 文件时先写入列名
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
class MysqlPipeline(object): #处理item的管道 ，将 item 插入数据库中
      
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
- #方式一 ：使用默认 host 和 port
db_client=pymongo.MongoClient()
- #方式二 ：自定义 host 和 port
db_client =pymongo.MongoClient(host="localhost",port=27017)
- #方式三 ：使用标准的 URI 连接语法
db_client =pymongo.MongoClient('mongodb://localhost:27017/)
2. #指定集合
db_collection db["hot"]
3. #插入数据
novel-={'name':'太初', #名称
'author':'高楼大厦', #作者
'form':'连载', #形式
'type':'玄幻' #类型 }
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
6. #可以使用集合的update oneO 和 update many()方法实现文档的更新。前者仅更新一个文档；后者可以批量更新多个文档。
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
    def open_spider(self, spider): #在爬虫开始时调用 ,初始化数据库
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
    def open_spider(self, spider): #在爬虫开始时调用 ,初始化数据库
        host = spider.settings.get('REDIS_HOST', 'localhost')
        port = spider.settings.get('REDIS_PORT', 6379)
        db_index = spider.settings.get('REDIS_DB', 1)
        password = spider.settings.get('REDIS_PASSWORD', '123456')
        self.redis_client = redis.StrictRedis(host=host,port=port,db=db_index,password=password) #连接数据库

    def process_item(self, item, spider): #在爬虫解析到item时调用
        item_json = json.dumps(dict(item)) #redis大于3 .0 版本后不支持直接插入字典数据，必须是字符串、字节或者数字，因此转为 json 字符串保存
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
## QQ 音乐榜单歌曲（访问 json 数据接口解析）

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
        self.start_urls = [' https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?&topid=4 ']

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
## 爬取豆瓣中国大陆电影（js 动态渲染或者需要手动下滑等操作网页）

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
            player_btn.click() #点击可播放控件 ，页面会渲染出 20 条电影数据，并在底部出现加载更多按钮
            # 等待 5s 页面直到类名为'article'的元素加载完成
            WebDriverWait(spider.driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div.article')))
            # WebDriverWait(spider.driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, 'rating_num')))
            # 此处为点击展开按钮逻辑，还有使用 js 的 scrol1To 方法实现将页面向下滚动逻辑等
            explore_more_btn = spider.driver.find_element(By.CSS_SELECTOR,'div.explore-more > button') #获取加载更多按钮
            for i in range(5): #点击5次加载更多按钮 ，共爬取 100 条电影数据
              explore_more_btn.click()
              time.sleep(5)
            #获取加载完成的页面代码
            origin_code = spider.driver.page_source
            #将源代码构造成为一个Response对象 ，并返回
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
        #对数据进行清洗 ，取出多余空格
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
        self.start_urls = [' https://movie.douban.com/explore ']
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
或者 `docker run -d --name splash -p 8050:8050 --memory=2G  scrapinghub/splash --maxrss 500`
打开浏览器输入 http:/192.168.99.100:8050 (Docker for Windows,是 http:/localhost:8050)
docker toolbox 通过 `docker-machine ip default` 查看 ip
4. Scrapy-Splash 的安装
Splash 成功安装后，最后就要安装 Splash 对应的 Python 库了，命令如下：
`pip install scrapy-splash`

![|600](https://qnpicmap.fcsluck.top/pics/202312152155132.png)


## 爬取苏宁易购中的 iphone 手机信息（利用 Splash 爬取 js 动态内容）

### 需求分析

苏宁易购的首页如下图左所示，网址为 [苏宁易购(Suning.com)-家电家装成套购，专注服务省心购！](https://www.suning.com/)。在页面的搜索栏中输入“iphone”,回车，就会跳转到 iphone 手机的商品销售页面，网址为 https://search.suning.com/iphone/ 如下图右所示。页面默认显示一定条手机信息，将页面往下拉，会不断加载更多手机信息，一页最多有 119 个 ipone 手机的商品信息。本项目希望使用 Splash,将尽量多的 iphone 商品销售信息爬取下来保存于 CSV 文件中。爬取的字段有：商品标题、价格、好评率和店铺名称。

![](https://qnpicmap.fcsluck.top/pics/202312152154460.png)

### 逻辑实现

1. setting.py 配置 splash 的 spider 中间件和下载中间件：
```python
# 支持 cache args
SPIDER_MIDDLEWARES = {
  #  "Suningyigo.middlewares.SuningyigoSpiderMiddleware": 543,
   "scrapy_splash.SplashDeduplicateArgsMiddleware": 100,
}

# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
# 开启 splash 下载中间件
DOWNLOADER_MIDDLEWARES = {
  #  "Suningyigo.middlewares.SuningyigoDownloaderMiddleware": 543,
   "scrapy_splash.SplashCookiesMiddleware": 723,
   "scrapy_splash.SplashMiddleware": 725,
   "scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware": 810
}
"""Splash 设置"""
# 设置 Splash 服务器的地址
SPLASH_URL = " http://192.168.99.100:8050"
# 设置缓存
HTTPCACHE_STORAGE = "scrapy_splash.SplashAwareFSCacheStorage"
# 设置去重过滤器
DUPEFILTER_CLASS = "scrapy_splash.SplashAwareDupeFilter"
```
2. 定义数据结构：
```python
class SuningyigoItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field() # 标题
    price = scrapy.Field() # 价格
    comment_count = scrapy.Field() # 评论数
    store_name = scrapy.Field() # 店铺名称
```
3. 实现爬取解析逻辑：
```python
#iphone_spider .py
from scrapy import Request
from scrapy.spiders import Spider
from Suningyigo.items import SuningyigoItem
from scrapy_splash import SplashRequest


# splash 的语法都为：号,lua_script 脚本中 runjs 函数的作用是执行 js 脚本将页面滚动到底部直到分页栏出现
lua_script = """
        function main(splash, args)
            splash:go(args.url)
            splash:wait(args.wait)
            splash:runjs('document.getElementById("bottom_pager").scrollIntoView(true)')
            splash:wait(args.wait)
            return splash:html()
        end
            """

class IphoneSpider(Spider):
    name = 'iphone'
    allowed_domains = [' www.suning.com ']
    start_urls = [' https://search.suning.com/iphone/ ']
    current_page = 1

    def start_requests(self):
        yield SplashRequest(url=self.start_urls[0], callback=self.parse, endpoint='execute',args={
            'wait': 3,
            'lua_source': lua_script, # 加载 lua 脚本: 执行模拟鼠标向下滑动
            'timeout': 10, # 超时时间
            'images': 0 # 0 表示不返回图片
            },
            cache_args=['lua_source'])

    def parse(self, response):
        item = SuningyigoItem()
        list_selector = response.css('div #product -list > ul > li')
        for li in list_selector:
          try:
            item['price'] = li.css('div.res-info > div.price-box span::text').extract_first()
            item['title'] = li.css('div.res-info > div.title-selling-point > a::text').extract_first().strip()
            item['comment_count'] = li.css('div.res-info > div.info-evaluate > i::text').extract_first()
            item['store_name'] = li.css('div.res-info > div.store-stock > a::text').extract_first()
            yield item
          except Exception as e:
            print(e)
            continue
        # 获取下一页请求
        total_page = int(response.css('div #bottom_pager > div > a:nth-last-child(3)::attr(pagenum)').extract_first())
        next_page = response.css('div #bottom_pager > div > a #nextPage ::attr(href)').extract_first().replace('/iphone/','')
        next_page = response.urljoin(next_page)
        if next_page:
            self.current_page += 1
            if self.current_page <= total_page:
                yield SplashRequest(url=next_page, callback=self.parse, endpoint='execute',args={
                          'wait': 3,
                          'lua_source': lua_script, # 加载 lua 脚本: 执行模拟鼠标向下滑动
                          'timeout': 10, # 超时时间
                          'images': 0 # 0 表示不返回图片
                          },
                          cache_args=['lua_source'])
```

由于 splash 在 scrapy 新版中被弃用，因此出现以下错误，连接 splash 超时，无法进行爬取：

![|700](https://qnpicmap.fcsluck.top/pics/202312161129156.png)


## 起点个人书架书籍爬取（携带 cookie 自动登录）

### 需求分析

图为登录起点中文网后，“我的书架”页面，地址为： https:/my.qidian.com/bookcase 。书架中罗列了用户加入书架的小说信息，有：类别、书名、更新时间、作者等。本项目的目标就是要将“我的书架”中的所有小说信息爬取下来。字段有：类别、书名、更新时间和作者。

### 依赖安装

1. cookie 获取库
```sh
pip install browsercookie #旧版
pip install browser_cookie3 -U #新版 （推荐）
```
2. 密码加密库
```sh
pip install pycryptodome #旧版
pip install pycryptodomex #新版 （推荐）
```

### 逻辑实现

1. 数据结构定义：
```python
class QidianloginItem(scrapy.Item):
    # define the fields for your item here like:
    category = scrapy.Field() # 分类
    title = scrapy.Field() # 标题
    author = scrapy.Field() # 作者
    update_time = scrapy.Field() # 更新时间
```
2. spider 爬取解析逻辑实现（**核心在于携带 cookie 免除登录，适合可以自动登录的网站**）：

```python
# -*- coding: utf-8 -*-
from typing import Any, Iterable, Optional
from scrapy import Request
from scrapy.http import Request
from scrapy.spiders import Spider
from QidianLogin.items import QidianloginItem
import browser_cookie3 as browsercookie

class QidianLoginSpider(Spider):
    name = 'bookcase'
    allowed_domains = ['.qidian.com']
    start_urls = [' https://my.qidian.com/bookcase ']

    def __init__(self):
        cookie_jar = browsercookie.firefox() #共获取chrome浏刘览器中的cookie
        self.cookies_dict = {}
        #遍历chrome中所有的cookie
        for cookie in cookie_jar:
            # print(cookie)
            if cookie.domain == '.qidian.com':
                if cookie.name in ['_csrfToken','_ga','_ga_FZMMH98S83','_ga_PFYW0QLV3P','_gid','e1','e2','fu','Hm_lpvt_f00f67093ce2f38f215010b699629083'
                                   ,'Hm_lvt_f00f67093ce2f38f215010b699629083','listStyle','newstatisticUUID','supportwebp','traffic_utm_referer','ywguid','ywkey','ywopenid']:
                  self.cookies_dict[cookie.name] = cookie.value


    def start_requests(self) -> Iterable[Request]:
        yield Request(url=self.start_urls[0], cookies=self.cookies_dict, callback=self.parse)
    
    def parse(self, response):
        item = QidianloginItem()
        tr_selector = response.css('table #shelfTable tbody tr')
        print(len(tr_selector))
        for tr in tr_selector:
            item['category'] = tr.css('td.col2 a.fen-category::text').extract_first()
            item['title'] = tr.css('td.col2 span.shelf-table-name b a:nth-child(2)::text').extract_first()
            item['author'] = tr.css('td.col4 a.shelf-table-author::text').extract_first()
            item['update_time'] = tr.css('td:nth-child(3)::text').extract_first()
            yield item  
```

爬取结果如下 json 文件所示：

```json
[
  {
    "category": "「仙侠」",
    "title": "仙父",
    "author": "言归正传",
    "update_time": "7 分钟前"
  },
  {
    "category": "「科幻」",
    "title": "说好军转民，这煤气罐什么鬼？",
    "author": "那年回响",
    "update_time": "33 分钟前"
  },
  {
    "category": "「玄幻」",
    "title": "宿命之环",
    "author": "爱潜水的乌贼",
    "update_time": "55 分钟前"
  },
  {
    "category": "「科幻」",
    "title": "黄昏分界",
    "author": "黑山老鬼",
    "update_time": "1 小时前"
  },
  {
    "category": "「都市」",
    "title": "都重生了谁谈恋爱啊",
    "author": "错哪儿了",
    "update_time": "3 小时前"
  },
  {
    "category": "「玄幻」",
    "title": "道爷要飞升",
    "author": "裴屠狗",
    "update_time": "4 小时前"
  },
  {
    "category": "「历史」",
    "title": "晋末长剑",
    "author": "孤独麦客",
    "update_time": "5 小时前"
  },
  {
    "category": "「都市」",
    "title": "逼我重生是吧",
    "author": "幼儿园一把手",
    "update_time": "12 小时前"
  },
  {
    "category": "「轻小说」",
    "title": "我的超能力每周刷新",
    "author": "一片雪饼",
    "update_time": "13 小时前"
  },
  {
    "category": "「轻小说」",
    "title": "不许没收我的人籍",
    "author": "可怜的夕夕",
    "update_time": "16 小时前"
  }
]
```

---

# 反爬虫反制措施

## 降低请求频率

降低请求频率的做法，不仅仅是为了避开网站的侦测，更重要的是体现出了一个爬虫专家基本的素质。我们应该对能够获取免费数据心怀感恩，而不是恶意攻击网站，致其带来很大的带宽压力，甚至瘫痪。毕竟还是有许多网站，对爬虫还是比较宽容的。
对于 Scrapy 框架来说，设置请求的频率（即下载延迟时间）非常简单。在配置文件 settings.py 中设置 DOWNLOAD DELAY 即可，以下代码设置下载延迟时间为 3 秒，即两次请求间隔 3 秒。
`DOWNLOAD DELAY=3 #设置下载延迟时间为3秒 `

## 修改请求头

网站可能会对 HTTP 请求头的每个属性做“是否具有人性”的检查。

| 属性            | 内容                                                                                  |
| --------------- | ------------------------------------------------------------------------------------- |
| `Host`            | www.baidu.com                                                                         |
| `Connection`      | Keep-Alive                                                                            |
| `Accept`          | text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8 |
| `User-Agent`      | Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0      |
| `Accept-Encoding` | gzip, deflate, br                                                                     |
| `Accept-Language` | zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2                           | 

## 禁用 Cookie

有些网站会通过 Cookie 来发现爬虫的轨迹。网站会通过 Cookie 跟踪你的访问过程，如果发现了爬虫异常行为就会中断你的访问，比如极为快速地填写表单，或者浏览大量页面。虽然这些行为可以通过关闭并重新连接或者改变 IP 地址来伪装，但是如果 Cookie 暴露了你的身份，再多努力也是白费。因此，如果不是特殊需要（如需要保持持续登录的状态，Cookie 还是需要的)，可以禁用 Cookie,这样网站就无法通过 Cookie 来侦测到爬虫了。Scrapy 中禁止 Cookie 功能也非常简单，在配置文件 `settings.py` 中将 COOKIES_ENABLED 设置为 False 即可（默认是 True),如下代码所示：
```python
Disable cookies (enabled by default)
COOKIES ENABLED False
```

## 伪装成随机浏览器

前面我们都是通过 User-Agent 将爬虫伪装成固定浏览器，但是对于警觉性高的网站，会侦测到这一反常现象，即持续访问网站的是同一种浏览器。因此，每次请求时，可以随机伪装成不同类型的浏览器。Scrapy 中的中间件 UserAgentMiddleware 就是专门用于设置 User-Agent 的。

1. **手动指定 user-agent 池**：
```python
#setting .py
My_USER_AGENT = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.407",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 Edg/58.0.2987.100",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 Vivaldi/1.11.1117.40",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 YaBrowser/18.10.2.1100 Yowser/2.5 Safari/537.36",
]
DOWNLOADER_MIDDLEWARES = {
  #  "QiDianNovel.middlewares.QidiannovelDownloaderMiddleware": 543,
   "QiDianNovel.middlewares.QidiannovelUserAgentMiddleware": 543,
}
#middlewares .py
from scrapy.downloadermiddlewares.useragent import UserAgentMiddleware
import random 
from QiDianNovel.settings import My_USER_AGENT
class QidiannovelUserAgentMiddleware(UserAgentMiddleware):
    def process_request(self, request, spider):
        agent = random.choice(list(My_USER_AGENT))
        print("user-agent:",agent)
        request.headers.setdefault("User_Agent",agent)
```

2. **使用随机生成 user-agent 的库**：

* **fake-useragent**：该库提供了一个 `UserAgent` 类，可以生成随机的 user-agent。

**fake-useragent** 库的使用方法如下：

```python
from scrapy.downloadermiddlewares.useragent import UserAgentMiddleware
from fake_useragent import UserAgent
class QidiannovelUserAgentMiddleware(UserAgentMiddleware):
    def process_request(self, request, spider):
        agent = UserAgent().random
        print("user-agent:",agent)
        request.headers.setdefault("User_Agent",agent)
```

fake-useragent 会随机给出一个 user-agent：
`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36`

## 更换 IP 地址

建立网络爬虫的第一原则是：所有信息都可以伪造。你可以使用非本人的邮箱发送邮件，通过命令自动化控制鼠标的行为，或者通过某个浏览器耗费网站流量来吓唬网管。但是有一件事是不能作假的，那就是你的 IP 地址。封杀 IP 地址这种行为，也许是网站的最后一步棋，不过有效。为了避免 IP 地址被封杀的方法：HTTP 代理。

ip 代理服务器分类：

![](https://qnpicmap.fcsluck.top/pics/202312161726358.png)


### 代理中间件（只需要设置代理地址即可）

1. 安装依赖库：
```sh
pip install scrapy-user-agents scrapy-rotating-proxies
```
2. 获取 HTTP 代理地址和端口号：
通过购买代理服务商的服务获取
3. 配置 Scrapy 设置
   - 添加 `DOWNLOADER_MIDDLEWARES` 代理中间件：
```python
     DOWNLOADER_MIDDLEWARES = {
   "scrapy.contrib.downloaderniddleware.useragent.UserAgentMiddleware": None,
   "scrapy_user_agents.middlewares.RandomUserAgentHiddleware": 400,
   "scrapy_rotating_proxies.middlewares.RotatingProxyMiddleware": 610,
   "scrapy_rotating_proxies.mdddlewares.BanDetectionMiddleware": 628.
}
```
   - 添加 `ROTATING_PROXY_LIST`，并将其值设置为你的 HTTP 代理地址和端口号的列表
```python
"""代理 IP 池"""
ROTATING_PROXY_LIST = [
  " http://123.456.789.123:8888" ,
  " http://456.789.123.456:8888" ,
]
```

4. spider 爬取解析类应用代理,继承 `RotatingProxyMixin` 类
```python
from scrapy.spiders import CrawlerSpider
from scrapy_rotating_proxies import RotatingProxyMixin

class QidianNovelSpider(RotatingProxyMixin,CrawlerSpider):
```


### 免费代理获取

爬取站大爷站点的免费 ip 代理：

```python
# -*- coding: utf-8 -*-
from typing import Any, Optional
from scrapy import Request
from scrapy.spiders import Spider
from QiDianNovel.items import PDYProxyItem

class QidianNovelSpider(Spider):
    name = "pdyproxy"  # 爬虫名称
    allowed_domains = [" www.zdaye.com" ]  # 允许爬取的域名
    
    # 爬虫起始页面
    start_urls = [" https://www.zdaye.com/free/" ]  # 爬虫起始页面
    current_page = 1

    def __init__(self, url=" https://www.qidian.com/" ):
        self.test_url = url # 测试代理 ip 能否访问的站点

    # 自定义 start_requests
    def start_requests(self):
        for url in self.start_urls:
            yield Request(url=url, callback=self.parse, dont_filter=True)

    # 爬虫解析
    def parse(self, response):  # 解析函数
        """获取免费代理 ip 列表"""
        # list_selector = response.xpath('//div[@class="book-mid-info"]')
        list_selector = response.css('table #ipc tbody tr')
        for one_selector in list_selector:
            try:
              # 返回小说信息
              item = PDYProxyItem()  
              item['ip'] = one_selector.css('td:nth-child(1)::text').extract_first().strip()
              item['port'] = one_selector.css('td:nth-child(2)::text').extract_first().strip()
              item['response_time'] = one_selector.css('td:nth-last-child(2) span::text').extract_first().strip()
              item['last_checked'] = one_selector.css('td:nth-child(5)::text').extract_first().strip()
              # 共拼接形成一个完整的代理 url
              url = "({}://{}:{}".format("http",item['ip'],item['port'])
              item["url"]=url
              yield Request(url=self.test_url,callback=self.test_proxy,
                          errback=self.error_back,
                          meta={"proxy":url,
                          "dont_retry":True,
                          "download_timeout":10,
                          "item":item},
                          dont_filter=True)
            except Exception as e:
                print(e)
                continue
        # 获取下一页的 url
        """爬取前十页数据"""
        if self.current_page < 10:
          self.current_page += 1
          next_page_url = response.css('a[title="下一页"]::attr(href)').extract_first()
          next_page_url = response.urljoin(next_page_url)
          # next_page_url = self.start_urls[0] + next_page_url
          yield Request(url=next_page_url, callback=self.parse)


def test_proxy(self,response): #使用代理访问目标网站
    """测试代理 ip"""
    print(response.meta["item"]["url"])
    yield response.meta["item"]

def error_back(self,failure):
    """错误处理"""
    self.logger.error((repr(failure)))
```

### 静态代理（指定 ip pool 写死）

scrapy 使用静态代理 ip

 在 Scrapy 中使用静态代理 IP，可以通过在 middlewares 中添加一个 IP 代理中间件来实现。以下是一个简单的示例：

```python
# 创建一个 IP 代理中间件
class ProxyMiddleware(object):
    def __init__(self, proxy_list):
        self.proxy_list = proxy_list

    @classmethod
    def from_crawler(cls, crawler):
        settings = crawler.settings
        return cls(
            proxy_list=settings.get('PROXY_LIST')
        )

    def process_request(self, request, spider):
        # 从代理列表中随机选择一个代理 IP
        proxy = random.choice(self.proxy_list)
        request.meta['proxy'] = f'http://{proxy}'
```

在 settings.py 文件中添加以下配置：

```python
# 启用自定义的 IP 代理中间件
DOWNLOADER_MIDDLEWARES = {
    'myproject.middlewares.ProxyMiddleware': 543,
}

# 静态代理 IP 列表
PROXY_LIST = [
    'ip1:port1',
    'ip2:port2',
    ...
]
```

这样当 Scrapy 发送请求时，会随机选择一个静态代理 IP 来发起请求。注意需要确保你拥有合法的静态代理 IP，并且能够成功连接到目标网站。


### 动态代理（从代理池数据库中获取代理）

代理地址存储于 redis 数据库中，数据类型为 set 集合，每一条数据类似：` http://xxx.xxx.xxx.xxx:port`
下面举例说明如何动态随机获取代理池中的代理地址去请求目标访问地址：

```python
# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import Spider
# from scrapy.loader import ItemLoader
from QiDianNovel.items import QidiannovelItem
import json
import redis
# from scrapy_rotating_proxies import RotatingProxyMixin

from QiDianNovel import settings

class QidianNovelSpider(Spider):
    name = "qidian_novel_getProxy_byRedis"  # 爬虫名称
    allowed_domains = [" www.qidian.com" ]  # 允许爬取的域名
    start_urls = [" https://www.qidian.com/rank/yuepiao/year2023-month12-page1/" ]  # 爬虫起始页面
    current_page = 1 # 当前页码

    def get_proxy(self):
        """
        获取代理 ip
        :return:
        """
        proxy = self.redis_client.srandmember("proxy_pool") # 从 redis 数据库代理池中随机获取一个代理 ip
        print("proxy:",proxy)
        return proxy
    
    def close_redis(self):
        """
        爬虫结束时关闭 redis 连接
        :param spider:
        :return:
        """
        self.redis_client.close()
   
    # 初始化 redis 连接
    def __init__(self, *args, **kwargs):
        myredis = settings.Redis
        if myredis:
            host = myredis.get("REDIS_HOST","localhost")
            port = myredis.get("REDIS_PORT",6379)
            password = myredis.get("REDIS_PASSWORD","123456")
            db = myredis.get("REDIS_DB",1)
            self.redis_client = redis.StrictRedis(host=host,port=port,password=password,db=db,decode_responses=True)


    def errback(self, failure):
        """
        错误回调函数
        :param failure:
        :return:
        """
        self.logger.error(repr(failure))
        request = failure.request
        print("当前正在访问的请求："+request.url,repr(failure))
        # 从 redisi 中删除无效的代理
        self.redis_client.srem("proxy_pool",request.meta["proxy"])
        # 再次随机获取一个代理 ip 重新发起原请求
        yield scrapy.Request(url=request.url, callback=self.parse, errback=self.errback, meta={"proxy":self.get_proxy(),
                          "dont_retry":True,
                          "download_timeout":10},
                          dont_filter=True)



    # 自定义 start_requests
    def start_requests(self):
        print("""--------------------开始爬取小说信息--------------------
 ██      ██          ██  ██           ████████         ██      ██               
░██     ░██         ░██ ░██          ██░░░░░░  ██████ ░░      ░██               
░██     ░██  █████  ░██ ░██  ██████ ░██       ░██░░░██ ██     ░██  █████  ██████
░██████████ ██░░░██ ░██ ░██ ██░░░░██░█████████░██  ░██░██  ██████ ██░░░██░░██░░█
░██░░░░░░██░███████ ░██ ░██░██   ░██░░░░░░░░██░██████ ░██ ██░░░██░███████ ░██ ░ 
░██     ░██░██░░░░  ░██ ░██░██   ░██       ░██░██░░░  ░██░██  ░██░██░░░░  ░██   
░██     ░██░░██████ ███ ███░░██████  ████████ ░██     ░██░░██████░░██████░███   
░░      ░░  ░░░░░░ ░░░ ░░░  ░░░░░░  ░░░░░░░░  ░░      ░░  ░░░░░░  ░░░░░░ ░░░    
              """)
        yield scrapy.Request(url=self.start_urls[0], callback=self.parse, errback=self.errback , meta={"proxy":self.get_proxy(),
                          "dont_retry":True,
                          "download_timeout":10},
                          dont_filter=True)

    # 爬虫解析
    def parse(self, response):  # 解析函数
        """获取小说信息列表"""
        print("""--------------------开始解析小说信息--------------------
                                    //\\ .. //\\
                                    //\((  ))/\\
                                    /  < `' >  \\
                                    \  /   \  /
                                     \/     \/
              """)
        print("response:",response.text)
        list_selector = response.css('div[class="book-mid-info"]')
        print("list_selector:",list_selector)
        for one_selector in list_selector:
            # novel = ItemLoader(item=QidiannovelItem(), selector=one_selector)
            # novel.add_css("title", 'h2 a::text')
            # novel.add_css("author", 'p.author > a::text')
            # novel.add_css("category", 'p.author > a::text')
            # novel.add_css("status", 'p.author > span::text')
            # novel.add_css("abstract", 'p.intro::text')
            """获取小说标题、作者、分类、状态、摘要"""
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
            item = QidiannovelItem()  # title, author, category, status, abstract
            item['title'] = title
            item['author'] = author
            item['category'] = category
            item['status'] = status
            item['abstract'] = abstract
            yield item
            # 获取下一页的 url
            """爬取月票榜前十页数据"""
            if self.current_page < 10:
                self.current_page += 1
                next_page_url = self.start_urls[0].replace('page1', 'page%d' % self.current_page)
                yield scrapy.Request(url=next_page_url, callback=self.parse,errback=self.errback , meta={"proxy":self.get_proxy(),
                          "dont_retry":True,
                          "download_timeout":10},
                          dont_filter=True)
```

---

# 分布式爬虫
## Scrapy-Redis 实现分布式爬虫

### 分布式爬虫爬取彼岸图网图片

#### 需求分析

上一章我们实现了彼岸图网图片的下载，但是由于下载的图片量较大，单机独立执行的效率就会比较低。因此需要将其改造为分布式爬虫，实现多机联合，共同完成图片下载任务。


#### 方案设计

![](https://qnpicmap.fcsluck.top/pics/202312181742418.png)

![](https://qnpicmap.fcsluck.top/pics/202312182040531.png)


#### 逻辑实现

修改原项目部分代码即可实现分布式多机对协作执行同一爬虫任务。

1. 全局配置文件
```python
# 设置调度器
SCHEDULER = "scrapy_redis.scheduler.Scheduler"
# 设置去重过滤器
DUPEFILTER_CLASS = "scrapy_redis.dupefilter.RFPDupeFilter"
# 设置连接的redis的URL
REDIS_URL = "redis://8.130.88.159:6379/"   
ITEM_PIPELINES = {
  "scrapy_redis.pipelines.RedisPipeline": 200,
  "BianImage.pipelines.SaveImagePipeline": 300,
}
```
2. 爬取解析逻辑取消 start_requests 方法（**从 redis 中获取起始请求**）
```python
# -*- coding: utf-8 -*-
from scrapy import Spider,Request
from BianImage.items import BianimageItem
from scrapy_redis.spiders import RedisSpider
import re

class ImageSpider(RedisSpider):
    name = 'bianimage'
    current_page = 1
    # def start_requests(self): # 初始请求
    #     url =  'https://pic.netbian.com'
    #     yield Request(url, callback=self.parse_subject)
    
    def parse(self, response): # 请求每个主题详情页
        subjects = response.css('div.classify.clearfix a')
        for subject in subjects:
            subject_rel_url = subject.css('::attr(href)').extract_first()
            subject_name = subject.css('::text').extract_first()
            subject_url = response.urljoin(subject_rel_url)
            yield Request(subject_url, callback=self.parse_image,meta={'subject_name':subject_name})
    def parse_image(self, response): # 一个主题下的一整页图片,一个item中包含一个主题一页的所有图片
        item = BianimageItem()
        item['image_urls'] = []
        item['subject'] = response.meta['subject_name']
        image_li = response.css('div.slist ul li:not(.nextpage)')
        for image in image_li:
            image_rel_url = image.css('a img::attr(src)').extract_first()
            image_url = response.urljoin(image_rel_url)
            item['image_urls'].append(image_url)
        yield item
        
        # 继续获取下一页
        next_rel_url = response.css('div.page a:nth-last-child(1)::attr(href)').extract_first()
        total_page = response.css('div.page a:nth-last-child(2)::text').extract_first()
        next_url = response.urljoin(next_rel_url)
        self.current_page += 1
        # if next_url and total_page and self.current_page <= int(total_page):
        if next_url and total_page and self.current_page <= 5:
            # print("下一页:"+next_url,"总页数："+total_page)
            yield Request(next_url, callback=self.parse_image,meta={'subject_name':item['subject']})
```

3. 在 redis 中添加起始请求信息（键名为 `bianimage:start_urls` 的列表，先 `lpush bianimage:start_urls 123` 后在修改 123 为以下 json 字符串信息---> `LPUSH "bianimage:start_urls" "{\"url\":\"https://pic.netbian.com\",\"meta\":{\"job-id\":\"123img\",\"start-date\":\"dd/mm/yy\"}}"`）
```json
  {
    "url": "https://pic.netbian.com",
    "meta": {
        "job-id": "123img",
        "start-date": "dd/mm/yy"
    }
} 
```


![](https://qnpicmap.fcsluck.top/pics/202312182125893.png)

每次启动爬虫后，`bianimage:start_urls` 键将会被消费掉不复存在，新增 `bianimage:items` 和 `bianimage:duplicate` 键记录条目和重复信息。

*本地爬取结果，缺少部分分类，且已有分类不全*：
![](https://qnpicmap.fcsluck.top/pics/202312182218379.png)

*云端爬取结果*：
![](https://qnpicmap.fcsluck.top/pics/202312182219620.png)

---
## 使用 Scrapyd 部署分布式爬虫

Scrapyd 是一个部署和管理 Scrapy 爬虫的工具，它可以通过一系列 HTTP 接口实现远程部署、启动、停止和删除爬虫程序。Scrapyd 还可以管理多个爬虫项目，每个项目可以上传多个版本，但只执行最新版。
此外，Scrapyd 还提供了一个简洁的 Web 页面，用于监视正在运行的爬虫进程和查看访问日志，访问地址为 http://localhost:6800 

### Scrapyd 的安装及运行

1. 准备工作
在安装 Scrapyd 之前，要确保爬虫服务器已经搭建好运行分布式爬虫需要的环境，这里安装的是：
- Anaconda
- Scrapy
- Scrapy-Redis
2. 安装 Scrapyd
使用 pip 命令安装 Scrapyd
```sh
pip install scrapyd
```

3. 配置文件
安装完 Scrapyd 后，需要在目录 `C:\scrapyd\` 中新建一个配置文件 scrapyd.conf。Scrapyd 在运行时会读取此路径下的配置文件，但 Scrapyd 不会自动生成 scrapyd.conf 文件，需要手动生成并添加内容。配置件的内容可以从官方文档（地址为 https://scrapyd.readthedocs..io/en/stable/config.html#config-example )中拷贝下来，再做简单的修改即可。

```conf
[scrapyd]
eggs_dir    = eggs
logs_dir    = logs
items_dir   =
jobs_to_keep = 5
dbs_dir     = dbs
max_proc    = 0
max_proc_per_cpu = 4
finished_to_keep = 100
poll_interval = 5.0
bind_address = 127.0.0.1
http_port   = 6800
username    =
password    =
prefix_header = x-forwarded-prefix
debug       = off
runner      = scrapyd.runner
jobstorage  = scrapyd.jobstorage.MemoryJobStorage
application = scrapyd.app.application
launcher    = scrapyd.launcher.Launcher
spiderqueue = scrapyd.spiderqueue.SqliteSpiderQueue
webroot     = scrapyd.website.Root
eggstorage  = scrapyd.eggstorage.FilesystemEggStorage

[services]
schedule.json     = scrapyd.webservice.Schedule
cancel.json       = scrapyd.webservice.Cancel
addversion.json   = scrapyd.webservice.AddVersion
listprojects.json = scrapyd.webservice.ListProjects
listversions.json = scrapyd.webservice.ListVersions
listspiders.json  = scrapyd.webservice.ListSpiders
delproject.json   = scrapyd.webservice.DeleteProject
delversion.json   = scrapyd.webservice.DeleteVersion
listjobs.json     = scrapyd.webservice.ListJobs
daemonstatus.json = scrapyd.webservice.DaemonStatus
```

4. 启动 Scrapyd 服务
在 anaconda 命令行对应环境中输入 `scrapyd`,如果访问 http://localhost:6800 出现如下所示信息，说明 Scrapyd 服务启动成功。

![|500](https://qnpicmap.fcsluck.top/pics/202312191042297.png)

![|500](https://qnpicmap.fcsluck.top/pics/202312191040373.png)


### Scrapyd 功能介绍

1. addversion.json:上传 Scrapy 项目或者更新项目版本到爬虫服务器
2. daemonstatus.json:查看 Scrapyd 当前的服务和任务状态
3. schedule.json:调度一个爬虫项目的运行
4. cancel.json:取消爬虫任务
5. listprojects..json:获取部署到 Scrapyd,服务上的项目列表
6. listversions.json:获取某个项目的版本号列表
7. listspiders.json:获取某项目最新版中所有 Spider 名称列表
8. listjobs.json:获取某个正在等待、运行或运行完的任务列表
9. delversion.json:删除某个项目的某个版本
10. delproject.json:删除指定项目

### 使用 Scrapyd-Clinet 批量部署

Scrapyd-Client 的功能主要有两个：
- 将项目打包成 egg 文件。
- 将 egg 文件通过 Scrapyd 的 addversion.json 接口上传到目标服务器。
1. 安装 Scrapyd-Client
使用 pip 命令安装 Scrapyd-Client。
```sh
pip install scrapyd-client
pip install pywin32
#pip install scrapyd-deploy
```

2. 推送项目到 scrapyd 中
修改 `scrapy.cfg` 文件配置推送目标地址：
```python
[settings]
default = BianImage.settings

[deploy]
url = http://localhost:6800/
project = BianImage

#可以推送到多个安装了scrapyd的爬虫服务器
[deploy:myslave1]
url=http://192.168.0.108:6800/
project = BianImage
[deploy:myslave2]
url=http://192.168.0.107:6800/
project = BianImage
```
在 anaconda 的 `master` 环境下在启动 scrapyd 后**切换到爬虫项目根目录**下执行以下命令：
```sh
scrapyd-deploy #默认推送deploy项
scrapyd-deploy myslave1/myslave2 #推送到其他爬虫服务器
```

3. 启动爬虫项目
   下面就可以使用 Scrapyd 提供的 HTTP 接口 schedule.json,启动爬虫了。命令如下：
```sh
curl http://127.0.0.1:6800/schedule.json -d project=BianImage -d spider=bianimage
```
执行命令后返回如下结果则表明启动成功：
`{"node_name": "Alleyf", "status": "ok", "jobid": "2b7fa8179e4111ee8991004238aafa7c"}`
![](https://qnpicmap.fcsluck.top/pics/202312191543963.png)

![](https://qnpicmap.fcsluck.top/pics/202312191543569.png)

---
## 使用 Docker 部署分布式爬虫

### 问题
1. 环境搭建问题：每台服务器的系统环境各不相同，在配置 Python 和 Scrpayd 环境时，难免会遇到各种兼容性和版本冲突的问题。
2. 服务启动问题：Scrapyd 服务需要手动启动，一旦目标服务器将其关闭，需要登录服务器，重新启动。

### docker
Docker 提供了一个公共的容器镜像存储库 Docker Hub,它包含了上百万个容器镜像，用户可以免费访问和共享这些公共镜像，也可以发布自己的镜像。我们可以通过 docker pull 命令，从 Docker Hub 中下载了公共的镜像 splash,然后就可以直接启动 Splash 服务了。Docker Hub 的网址为 https:/hub.docker.com/ ,如图所示。


### 制作自己的 Docker 容器镜像
制作容器镜像，需要用到三个文件，并且这三个文件都要处于同一个文件夹中。
- `scrapyd.conf`
该文件是 Scrapyd 的配置文件，Scrapyd 运行时会读取此文件，配置文件内容如下：
```conf
[scrapyd]
eggs_dir    = eggs
logs_dir    = logs
items_dir   =
jobs_to_keep = 5
dbs_dir     = dbs
max_proc    = 0
max_proc_per_cpu = 4
finished_to_keep = 100
poll_interval = 5.0
bind_address = 0.0.0.0
http_port   = 6800
username    =
password    =
prefix_header = x-forwarded-prefix
debug       = off
runner      = scrapyd.runner
jobstorage  = scrapyd.jobstorage.MemoryJobStorage
application = scrapyd.app.application
launcher    = scrapyd.launcher.Launcher
spiderqueue = scrapyd.spiderqueue.SqliteSpiderQueue
webroot     = scrapyd.website.Root
eggstorage  = scrapyd.eggstorage.FilesystemEggStorage

[services]
schedule.json     = scrapyd.webservice.Schedule
cancel.json       = scrapyd.webservice.Cancel
addversion.json   = scrapyd.webservice.AddVersion
listprojects.json = scrapyd.webservice.ListProjects
listversions.json = scrapyd.webservice.ListVersions
listspiders.json  = scrapyd.webservice.ListSpiders
delproject.json   = scrapyd.webservice.DeleteProject
delversion.json   = scrapyd.webservice.DeleteVersion
listjobs.json     = scrapyd.webservice.ListJobs
daemonstatus.json = scrapyd.webservice.DaemonStatus
```
- `requirements.txt` 文件（文件名可以自定义）
新建文件 requirements.txt,罗列 Scrapy 项目中要用到的库。
可以安装 `pip install pipreqs` 使用 `pipreqs . --encoding=utf8 --force` 命令一键生成项目依赖文件，但是不一定全还需要自己补充修改。
```txt
scrapyd
Pillow
scrapyd-client
itemadapter==0.8.0
Scrapy==2.11.0
scrapy_redis==0.7.3
setuptools==63.2.0
```
- `Dockerfile`:新建文件 Dockerfile(注意，文件名没有后缀)。
```Dockerfile
FROM python:3.9.8
ADD . /code
WORKDIR /code
COPY ./scrapyd.conf /etc/scrapyd/
EXPOSE 6800
RUN pip3 config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip3 install -r requirements.txt
CMD scrapyd
```

> 也可以用其他 pip 安装源（eg 豆瓣源： http://pypi.douban.com/simple ）

> **参数说明**
> Dockerfile 是一种由 Docker 用户创建的文本文件，其中包含了一系列用来生成镜像的命令。以下是一些常用参数的说明： 
> 1. `FROM`： 定义了将会被使用的基础镜像，在开始编写 Dockerfile 前必须先指定。 
> 2. `MAINTAINER`：定义了镜像创建者的信息。 
> 3. `RUN`：在新创建的镜像层上执行命令，用于安装应用程序及其相关依赖。你可以使用多个 RUN 命令，Docker 会创建相应的镜像层。 
> 4. `CMD`：为启动的容器指定默认要运行的程序，包括相关参数。 
> 5. `EXPOSE`： 通知 Docker 服务端应该监听与运行该应用程序相关的网络端口。 
> 6. `ENV`： 定义了将在镜像构建过程中被使用的环境变量。 
> 7. `ADD` 和 `COPY`： 将文件从 Docker 宿主机复制/添加到镜像中。 `ADD` 具有处理在线 URL 和解压 tar 文件的功能。 
> 8. `ENTRYPOINT`： 用于指定容器启动的程序及参数。 
> 9. `VOLUME`： 是用来为镜像提供持久化数据功能，可以在容器间共享数据。 
> 10. `WORKDIR`： 在镜像内设定一个工作目录，所有后续的操作（CMD、RUN、ENTRYPOINT、COPY、ADD）都会在该目录下进行。 以上是 Dockerfile 的主要使用参数，每一个参数对应的都是 Docker 镜像构建时的一个动作，多个参数能组合起来用于创建自定义 Docker 镜像。


- 执行以下命令构建**docker 镜像文件**
```sh
docker build -t alleyf/scrapyd:0.0.1 .
#说明：docker build -t username/respository:tag .
```
- 首先在命令行执行以下命令**登录 dockerhub**验证身份
```sh
docker login -u "username" -p "password" docker.io
```
- 上传镜像文件到 dockerhub 仓库
```sh
docker push alleyf/scrapyd:0.0.1
```

![|600](https://qnpicmap.fcsluck.top/pics/202312191735852.png)

### 拉取运行镜像

我们将自己制作的 Scrapyd 镜像上传到了 Docker Hub 中后，任何人都可以将该镜像拉取到本地，启用 Scrapyd 服务了。
在爬虫服务器中，输入如下命令，将镜像拉取到本地：
```sh
docker pull alleyf/scrapyd:0.0.1
```

拉取镜像后执行以下命令启动容器：
```sh
docker run -d --name scrapyd -p 6800:6800 alleyf/scrapyd:0.0.1
```

启动容器后打开服务器安全组端口，访问 6800 端口即可看到以下页面：
![|500](https://qnpicmap.fcsluck.top/pics/202312191914587.png)

### 推送运行 scrapy 爬虫
修改配置文件 scrapy.cfg 设置推送目标地址等信息：
```python
[settings]
default = BianImage.settings

# 本地环境
[deploy]
url = http://localhost:6800/
project = BianImage

# 阿里云环境
[deploy:aliyun]
url = http://xxxx:6800/
project = BianImage
```
然后在本地执行以下命令将爬虫项目推送到 docker 容器所在的云端环境中：
```sh
scrapyd-deploy aliyun
```
接着执行以下命令启动云端刚刚推送的爬虫项目：
```sh
curl http://xxxx:6800/schedule.json -d project=BianImage -d spider=bianimage
```
运行成功后在 6800 端口 Jobs 中可以看到正在运行的爬虫项目：
![](https://qnpicmap.fcsluck.top/pics/202312191918177.png)

**docker 启动容器实例后，容器实例就相当于一个基础的 linux 环境，并且包含了 docker 镜像打包时添加的文件**，具体如下图所示：

![](https://qnpicmap.fcsluck.top/pics/202312191950167.png)


> `scrapy v2.10.0` 不再支持将蜘蛛参数传递给 scrapy.core.engine.ExecutionEngine 的 crawl()方法。也就是说**新版本将不在支持启动 scrapy-redis 爬虫后再向 redis 中添加初始请求信息，必须项目启动前添加，或者 scrapy 降级到 2.9.0 版本**


---
## 使用 Gerapy 管理分布式爬虫

### 问题

1. 制作 Python 和 Scrapyd 环境的 Docker 镜像，上传到 Docker Hub 中。
2. 所有爬虫服务器中安装 Docker,并从 Docker Hub 中拉取镜像，启动 Scrapyd 服务。
3. 使用 Scrapyd-Client 命令将 Scrpay:项目部署到爬虫服务器中。
4. 使用 Scrapyd 命令管理爬虫，如启动、停止、删除爬虫，管理版本，查看日志等。

### Gerapy 介绍
Gerapy 是一款分布式爬虫管理框架，支持 Python3，基于 Scrapy、Scrapyd、Scrapyd-Client、Scrapy-Redis、Scrapyd-APl、Scrapy-Splash、Jinjia2、Django、Vue.js 开发。
![|600](https://qnpicmap.fcsluck.top/pics/202312191956807.png)

### Gerapy 使用方法
1. 安装 Gerapy
使用 pip 命令安装 Gerapy。
```sh
pip3 install -U gerapy
```
2. 初始化 Gerapy
Gerapy 需要执行初始化工作，用于生成 Gerapy 的框架目录。首先，通过命令行定位到想要生成 Gerapy 框架的路径，如：`E:\gerapy`；然后，执行初始化命令，如下所示：
```sh
gerapy init
```
生成的目录结构如下：
```c
E:\gerapy
├─logs
└─projects
```

3. 初始化数据库
Gerapy 需要在本地生成一个 SQLite 数据库，用于保存各个主机的配置信息、部署版本等。在 `E:\gerapy` 目录下，执行初始化数据库的命令，如下所示：

```sh
cd gerapy
gerapy migrate
```
4. 创建管理员用户
   使用以下命令新建一个管理原用户默认用户名和密码均为 `admin`
```sh
gerapy initadmin #用户名和密码：admin
gerapy createsuperuser #新建自定义用户名和密码的用户
```
5. 启动 Gerapy 服务
通过如下命令启动 Gerapy 服务
```sh
gerapy runserver
```
在浏览器中访问 http:/127.0.0.1:8000(或 http:/localhost:8000)，就可以访问 Gerapy 管理界面了。
### 项目部署
1. 主机管理 
   首先在主机管理中添加分布式爬虫主机，配置和结果如下图所示：
   ![|375](https://qnpicmap.fcsluck.top/pics/202312192045822.png)
   ![](https://qnpicmap.fcsluck.top/pics/202312192046305.png)
2. 项目管理
   可以直接将本地项目拷贝到 `gerpy/projects/` 目录下刷新即可看到项目，也可以通过上传文件的方式添加爬虫项目。
![](https://qnpicmap.fcsluck.top/pics/202312192048774.png)
上传项目后，首先点击部署进去将项目打包为 egg 文件，便于后面部署到主机上运行，打包结果如下图所示：
![](https://qnpicmap.fcsluck.top/pics/202312192050085.png)

3. 启动项目
   回到主机管理点击主机节点的调度，进去后可以看到运行和任务运行状态日志等信息，可以点击运行即可启动爬虫项目，结果如下图所示：
   
![](https://qnpicmap.fcsluck.top/pics/202312192043239.png)


---
# 参考
1. [Scrapy框架介绍-CSDN博客](https://blog.csdn.net/W_chuanqi/article/details/127718762)
2. [预览Scrapy — Scrapy 文档](https://scrapy-16.readthedocs.io/zh-cn/latest/intro/overview.html)
3. [Python爬虫⚡Python基础→项目实战案例：Scrapy框架、分布式爬虫、数据爬取与项目案例使用教程\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1Wj411B7b2)
4. [小说月票排行榜单\_2023年12月起点小说月票排行-起点中文网](https://www.qidian.com/rank/yuepiao/year2023-month12-/)
5. [傻瓜式教程超详细Scrapy设置代理方法-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/2315098)