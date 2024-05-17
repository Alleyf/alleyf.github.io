---
title: latex手册
date: 2024-05-11 23:00:58
tags:
  - latex
sticky: 80
excerpt: 
author: fcs
index_img: https://picsum.photos/800/250
lang: zh-CN
number headings: auto, first-level 1, max 5, start-at 1, 1.1
---

![](https://picsum.photos/800/250)

# 1 设定区域和正文区域

## 1.1 设定区域

- \documentclass{…}、\usepackage{…}为设定区域，规定论文格式，导入相关依赖包等
- 一般不会对生产的PDF产生影响
- 设定区域会随着我们不断添加新的元素而丰富
- Latex常用宏包(https:/zhuanlan.zhihu..com/p/43981639)

## 1.2 正文区域

- \begin…\end命令中间的这个区域
- 所有在最终PDF文件的可见内容均在此区域添加，包括文字，图表，公式
- 在正文区域，我们需要先输入一篇论文的基本内容，设定论文题目，摘要，关键字等

## 1.3 正文各级标题

- chapter-一章，一般只用于可以成书的文章
- section-节
- subsection一小节
- subsubsection一小小节
- 也就是对应着我们的多级标题

## 1.4 换行、换段、换页、首行缩进等命令

- \\\\(\newline、\linebreak、\\\\[offset]): 换行
- \par: 分段
- \newpage: 分页命令
- \setlength{\parindent}{长度}：首行缩进

# 2 参考文献

[02. 正文\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1Mc411S75c?p=3&vd_source=9c896fa9c3f9023797e8efe7be0c113e)