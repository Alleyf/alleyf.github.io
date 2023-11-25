---
title: NoteBook_notes
tags: [NoteBook]
categories: PaddleIDE
date: 2022-9-10 10:00:00
sticky: 65
excerpt: a lot of notes dealing with notebook
---

# NoteBook

## 1.notebook快捷键

### 命令模式快捷键

<img src="https://ai-studio-static-online.cdn.bcebos.com/3a9f826518cb42e89965641e4eea9a289dbcce74862e4335ba8738d978e37fc2" alt="img" style="zoom: 50%;" />

### 编辑模式快捷键

<img src="https://ai-studio-static-online.cdn.bcebos.com/968cf800086a47129fdda653891c170a1c9b1248296747aeaa766bb5cef2932c" alt="img" style="zoom: 50%;" />

## 2.持久化安装（安装到外部库文件夹）

```shell
#创建文件夹
mkdir /home/aistudio/external-libraries 
#安装BeautifulSoup4包到外部库
pip install beautifulsoup4 -t /home/aistudio/external-libraries
```

```shell
#添加环境变量
import sys
sys.path.append('/home/aistudio/external-libraries')
```

## 3.Magic命令

```python
#显示全部可用的Magic命令
%lsmagic
#%env：设置环境变量
%env OMP_NUM_THREADS=4
#使用Magic命令来统计运行时长
import random

%%timeit

prize = 0 
for i in range(100):
    roll = random.randint(1, 6)
    if roll%2 == 0:
        prize += roll
    else:
        prize -= 1
```

```python
#直接嵌入可视化内容
%matplotlib inline
%config InlineBackend.figure_format = 'retina'

import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0,1,300)
for w in range (2,6,2):
    plt.plot(x, np.sin(np.pi*x)*np.sin(2*w*np.pi*x))
```

```python
#%run或者二!python均可执行指定路径的python文件
%run print.py
!python print.py
```

```python
#%%writefile and %pycat: 导出cell内容/显示外部脚本的内容
%pycat SaveToPythonCode.py #将文件打开展示在cell中
%%writefile SaveToPythonCode.py #重写文件为cell中的内容并保存

from math import sqrt
for i in range(2,10):
    flag=1
    k=int(sqrt(i))
    for j in range(2,k+1):
        if i%j==0:
            flag=0
        break
        if(flag):
            print(i)
```

```python
#PDB调试代码
#Notebook自带一个调试器, 叫The Python Debugger (pdb)，我们来看看它是如何工作的
%pdb

def reverse(x: int) -> int:
    inputnumber = x.__str__()
    reversedStr = inputnumber[::-1]
    strOriLen = len(reversedStr)
    result = list()
    flag = 1
    for i in range(0, strOriLen):
        if i == (strOriLen -1) and reversedStr[i] == '-' :
            flag = -1
        else:
            result.append(reversedStr[i])
    outputs = ''.join(result)
    outputInt = int(outputs)        
     
    outputInt = outputInt * flag
        
    if outputInt > pow(2,31)-1  or outputInt < -1 * pow(2,31):
        outputInt = 0
        
    return outputInt

print(reverse(134))
```

## PDB命令（python3.7及以上自带的调试器，ipdb为彩色的交互）

- **pdb.set_trace():设置断点**

- **n（next）:执行下一步**
- **p（print）data :打印data**
- **l（ls）：显示当前代码**
- **q（quit）：强制中断退出**
- **b（break）LineNumber：调试中给指定位置设置断点**
- **variable = value:动态分配变量**
- **c（continue）：继续运行至结束**
- **r（return）：运行至子程序结束**
- **a（args）：打印当前函数参数**
- **ENTER（回车）：重复上次命令**

