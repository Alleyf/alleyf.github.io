---
title: QuartusIIUsage
tags: [QuartusII]
categories: QuartusII
date: 2022-9-23 12:00:00
sticky: 55
excerpt: a lot of notes dealing with usage of QuartusII
---

#  The Usage of QuartusII And ModelSim

## 习题3.1

### 问题描述

基于 Quartus Prime 软件，采用原理图设计方式用 D 触发器设计一个 2 分频电路；在此基础上， 设计一个 4 分频和 8 分频电路并进行仿真。（参考设计如图 3.67 所示）

![](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220924165154538.png)

​														图 3.67 2 分频电路

### 电路原理图设计

#### 四分频原理图

![TwoDivF](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/TwoDivF.png)

#### 八分频原理图

![EightDivf](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/EightDivf.png)

### ModelSim仿真结果

#### 四分频波形图

![FourDiv](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/FourDiv.png)

#### 八分频波形图

![EightDiv](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/EightDiv.png)

### 结果分析

首先在QuartusII中绘出原理图，编译后然后生成testbench测试文件，将两者关联后，再次编译，然后联合ModelSim进行波形<u>门级仿真</u>，四分频电路由两个二分频电路<u>级联</u>得到，而八分频电路由三个二分频电路得到；观察波形仿真结果发现四分频和八分频分别将输入的矩形波进行了<u>四分频和八分频</u>，结果与理论一致，但是输出的不是随输入瞬时变化，而是有一小段<u>延时</u>，这是由于门级水平仿真下<u>各逻辑门存在一定的延时</u>导致的。

## 习题3.6

### 问题描述

基于 Quartus Prime，用 74194（4 位双向移位寄存器）设计一个 00011101 序列产生器电路，进 行编译和仿真，查看仿真结果。 参考设计：图 3.72 是序列产生器原理图，序列产生器采用 74194 和 74153（双 4 选 1 数据选择器） 构成。

![image-20220924170739029](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220924170739029.png)

​								图 3.72 00011101 序列产生器原理图

### 电路原理图设计

![SeqGn](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/SeqGn.png)

### ModelSim仿真结果

![SeGn](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/SeGn.png)

### 结果分析

观察仿真结果波形发现输出为周期变化的**00011101序列**，实验结果与预期一致，实现了题目所要求的功能。

## 习题3.12

### 问题描述

设计消抖动电路，并对其功能进行仿真。 参考设计：由 4 个触发器和一个 4 输入与门构成的消抖动电路如图 3.73 所示，消抖动电路实质上就是 一个信号过滤器，能够将信号中的毛刺、抖动等都滤除掉，图 3.74 是其仿真波形，从波形可看出，输出信 号实现了消抖动，同时可以发现如下特点：

- 输出脉宽变小了，它只等于 CLK 的一个周期的宽度。  
- CLK 的频率不能太低，应至少有 4 个上升沿包含在正常信号脉冲中；CLK 的频率也不能太高，其 周期不能太多地小于干扰或者抖动信号的脉宽。
- 增加 D 触发器的数量，可以改善消抖动效果。

![image-20220924171445232](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220924171445232.png)

### 电路原理图设计

![EnShake](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/EnShake.png)

### ModelSim仿真结果

![EmShake](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/EmShake.png)

### 结果分析

将输入和输出对比发现，输出没有了输入的**抖动、毛刺**，消除了这些短暂的脉冲，将其过滤掉了，说明该电路有效地实现了消除抖动的功能，与预期相一致。
