---
title: MarkDown-真经
date: 2023-11-21 23:39:43
tags:
  - markdown
  - mermaid
sticky: 60
excerpt: 一些关于markdown的用法教程
author: fcs
index_img: https://picsum.photos/800/250
---

![](https://picsum.photos/800/250)

mermaid语法教程

 Mermaid是一种用于生成流程图、时序图、甘特图和类似图表的文本描述语法。它采用简洁的语法，使得用户可以轻松地用文本编辑器创建复杂的图表。

以下是一些常用的Mermaid语法示例：

1. 流程图：

```mermaid
graph LR
    A-->B
    B-->C
    C-->D
```

这段代码将生成一个简单的流程图，其中A连接到B，B连接到C，C连接到D。

2. 时序图：

```mermaid
sequenceDiagram
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I'm good, thanks!
```

这段代码将生成一个简单的时序图，其中Alice发送消息给Bob并收到回复。

3. 甘特图：

```mermaid
gantt
    title 项目计划表

    section 设计
    需求分析     :a1, 2022-01-01, 10d
    概要设计     :after a1, 10d

    section 开发
    编码         :2022-01-20, 15d

    section 测试
    单元测试     :2022-02-05, 5d

```

这段代码将生成一个简单的甘特图，其中包含了项目计划表中的设计、开发和测试阶段。

4. 类似图表：

```mermaid
classDiagram
    class Animal{
        +name: string
        +eat(): void
    }
    class Dog{
        +bark(): void
    }
    class Cat{
        +meow(): void
    }

    Animal <|-- Dog
    Animal <|-- Cat
```

这段代码将生成一个简单的类似图表，其中包含了Animal、Dog和Cat类以及它们之间的继承关系。
