---
title: ML_DL
tags: [Numpy,Pandas,PIL,Matplotlib]
categories: MachineLearning
date: 2022-9-11 0:26:00
sticky: 100
excerpt: Deep_learning
---

# 深度学习

## 基本步骤：

1. 模型假设

2. 优化目标

3. 寻解算法

   * 公式法：

   * 梯度下降法:  

     1. 方向
     
     1. 步长
     
     1. 特征缩放
     
     1. 梯度决定步长   
     

![image-20220912142745507](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220912142745507.png)


## 实例：

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220902190129721.png" style="zoom: 33%;" />

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220902190439588.png" style="zoom: 50%;" />

## 常用的库

1. **numpy**是Python科学计算库的基础。包含了强大的N维数组对象和向量运算。

2. **pandas**是建立在numpy基础上的高效数据分析处理库，是Python的重要数据分析库。

3. **Matplotlib**是一个主要用于绘制二维图形的Python库。用途：绘图、可视化

4. **PIL**库是一个具有强大图像处理能力的第三方库。用途：图像处理

---

### Numpy库     

- 可以使用array函数从常规Python**列表或元组**中创建数组。得到的数组的类型是从Python列表中元素的类型推导出来的

```python
  import numpy as np
  
  #将列表转换为二维数组
  array = np.array([[1,2,3],
                   [4,5,6]])
  print(array)
  #将元组转换为二维数组
  array = np.array(((1,2,3),
                   (4,5,6)))
  print(array)
  #将列表或元组转为一维数组
  a = np.array([1,2,3,4]) 
  b = np.array((1,2,3,4))
  print(a,b)
```

#### 1.常用函数

- zeros():可以创建指定长度或者形状的全0数组

- ones():可以创建指定长度或者形状的全1数组

- empty():创建一个数组，其初始内容是随机的,取决于内存的状态

- arange():创建一个指定处末位置和步长的数字数组

```python
  zeroarray = np.zeros((3,3),dtype='int64')
  print(zeroarray)
  onearray = np.ones((3,4),dtype='int64')
  print(onearray)
  emptyarray = np.empty((3,4))
  print(emptyarray)
  array = np.arange( 10, 31,5 )
  print(array)
```

- 输出数组的一些信息，如维度、形状、元素个数、元素类型等

```python
  array = np.array([[1,2,3],[4,5,6],[7,8,9],[10,11,12]])
  print(array)
  #数组维度
  print(array.ndim)
  #数组形状
  print(array.shape)
  #数组元素个数
  print(array.size)
  #数组元素类型
  print(array.dtype)
```

- reshape([m,n])重新定义数字的形状为m行n列。

```python
  array1 = np.arange(6).reshape([2,3])#重塑为2行3列
  print(array1)
  
  
  array2 = np.array([[1,2,3,[4,5,6]],dtype=np.int64).reshape([3,2])#重塑为3行2列
  print(array2)
  
```

#### 2.数组计算

**注:大小相等的数组之间的任何算术运算都会将运算应用到元素级。同样，数组与标量的算术运算也会将那个标量值传播到各个元素.**

1. 矩阵基础运算：

   ```python
   arr1 = np.array([[1,2,3],[4,5,6]])
   arr2 = np.ones([2,3],dtype=np.int64)
   
   print(arr1 + arr2)
   print(arr1 - arr2)
   print(arr1 * arr2)
   print(arr1 / arr2)
   print(arr1 ** 2)
   ```

2. 矩阵乘法：

   ```python
   arr3 = np.array([[1,2,3],[4,5,6]])
   arr4 = np.ones([3,2],dtype=np.int64)
   print(arr3)
   print(arr4)
   print(np.dot(arr3,arr4))
   ```

3. 矩阵其他运算：

   ```python
   print(np.sum(arr3,axis=1)) #axis=1,每一行求和 axie=0,每一列求和
   print(np.max(arr3))
   print(np.min(arr3))
   print(np.mean(arr3))
   print(np.argmax(arr3),axis=0/1)#axis=1,每一行求最大值的索引 axie=0,每一列求最大值索引
   print(np.argmin(arr3),axis=0/1)#axis=1,每一行求最小值的索引 axie=0,每一列求最小值索引
   print(arr3.transpose())#求数组的转置矩阵
   print(arr3.flatten())#将数组降为一维
   ```

#### 3.数组的索引与切片

```python
arr5 = np.arange(0,6).reshape([2,3])
print(arr5)
print(arr5[1])#索引第一行
print(arr5[1][2])#索引第一行第二列
print(arr5[1,2])#索引第一行第二列
print(arr5[1,:])#切片第一行
print(arr5[:,1])#切片第一列
print(arr5[1,0:2])#切片第一行第零列开始向后的两个元素，返回一个列表
```

---

#### 4.线性代数常用库函数

![image-20220911193010646](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220911193010646.png)

### Pandas库

注：提供高性能易用数据类型和分析工具；

​		pandas基于numpy实现，常与numpy和matplotlib一同使用。

**Pandas核心数据结构：**

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/a8c80653f39b479dab9f6867a638b64c405e79d6540c4307a22f43c4b0e228bc" alt="img" style="zoom: 67%;" />

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/c8f06f423acc488fb391bca5dcf8f2b02d7444ef526f41599b6b430ae24659c1" alt="img" style="zoom: 50%;" />

#### 1. Series

注：Series是一种类似于一维数组的对象，它由一维数组（各种numpy数据类    型）以及一组与之相关的数据标签（即索引）组成.可理解为带标签的一维数组，可存储整数、浮点数、字符串、Python 对象等类型的数据。

```python
import pandas as pd
import numpy as np

s = pd.Series(['a','b','c','d','e'])#将列表转为series对象
print(s)
```

注：Series中可以使用index设置索引列表，与字典不同的是，Series允许索引重复。

```python
#与字典不同的是：Series允许索引重复
s = pd.Series(['a','b','c','d','e'],index=[100,200,100,400,500])
print(s)
d = {'b': 1, 'a': 0, 'c': 2}
pd.Series(d)
d = {'b': 1, 'a': 0, 'c': 2}#将字典实例化
pd.Series(d)
print(s.values)#取键值
print(s.index)#取键
#与普通numpy数组相比，可以通过索引的方式选取Series中的单个或一组值
print(s[100])
print(s[[400, 500]])
#对应元素求和
print(s+s)
#对应元素乘
print(s*3)
```

注：Series中最重要的一个功能是它会在算术运算中基于标签自动对齐不同索引的数据。

```python
obj1 = pd.Series({"Ohio": 35000, "Oregon": 16000, "Texas": 71000, "Utah": 5000})
print(obj1)
obj2 = pd.Series({"California": np.nan, "Ohio": 35000, "Oregon": 16000, "Texas": 71000})
print(obj2)
print(obj1 + obj2)

#可以切片，基础运算时没有匹配的键值会被设为NaN
s = pd.Series(np.array([1,2,3,4,5]), index=['a', 'b', 'c', 'd', 'e'])

print(s['a'])
print(s[1:])

print(s[:-1])

print(s[1:] + s[:-1])
```

#### 2. DataFrame

注：

- DataFrame是一个表格型的数据结构，类似于Excel或sql表

它含有一组有序的列，每列可以是不同的值类型（数值、字符串、布尔值等）

DataFrame既有行索引也有列索引，它可以被看做由Series组成的字典（共用同一个索引）。

- **用多维数组字典、列表字典生成 DataFrame。**

```python
#如果指定了列顺序，则DataFrame的列就会按照指定顺序进行排列, 跟原Series一样，如果传入的列在数据中找不到，就会产生NAN值.
data = {'state': ['Ohio', 'Ohio', 'Ohio', 'Nevada', 'Nevada'], 'year': [2000, 2001, 2002, 2001, 2002], 'pop': [1.5, 1.7, 3.6, 2.4, 2.9]}
frame = pd.DataFrame(data,columns=['year', 'state', 'pop', 'debt'])
print(frame)
```

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220910232915712.png" alt="image-20220910232915712"  />

- **用 Series 字典或字典生成 DataFrame, 即Series可以作为DataFrame的子集。**

```python
d = {'one': pd.Series([1., 2., 3.], index=['a', 'b', 'c']),
     'two': pd.Series([1., 2., 3., 4.], index=['a', 'b', 'c', 'd'])}
print(pd.DataFrame(d))

#通过类似字典标记的方式或属性的方式，可以将DataFrame的列获取为一个Series,返回的Series拥有原DataFrame相同的索引
print(frame2['state'])

#列可以通过赋值的方式进行修改,例如，给那个空的“delt”列赋上一个标量值或一组值
frame2['debt'] = 16.5
print(frame2)

#新增一个Series
frame2['new'] = frame2['debt' ]* frame2['pop'] 
print(frame2)

#用numpy数组赋值
frame2['debt'] = np.arange(5.)
print(frame2)
```

#### 3. 索引对象常用方法

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220911193234679.png" alt="image-20220911193234679" style="zoom:50%;" />

---


### PIL库

注：

- PIL库是一个具有强大图像处理能力的第三方库。

- 在命令行下的安装方法: pip install pillow。

- 在使用过程中的弓|入方法: from PIL import Image。

- 图像的组成：由RGB三原色组成,RGB图像中，一种彩色由R、G、B三原色按照比例混合而成。0-255区分不同亮度的颜色。图像的数组表示：图像是一个由像素组成的矩阵，每个元素是一个RGB值。

- Image 是 PIL 库中代表一个图像的类（对象）。

```python
from PIL import Image
import matplotlib.pyplot as plt
#显示matplotlib生成的图形
%matplotlib inline

#读取图片
img = Image.open('/home/aistudio/work/yushuxin.jpg') 

#显示图片
#img.show() #自动调用计算机上显示图片的工具
plt.imshow(img)  
plt.show(img)   

#获得图像的模式和大小
img_mode = img.mode
print(img_mode)
width,height = img.size
print(width,height)

#将图片旋转45度
img_rotate = img.rotate(45) 

#左右镜像
img3_lr = img3.transpose(Image.FLIP_LEFT_RIGHT)
#上下镜像
img3_bt = img3.transpose(Image.FLIP_TOP_BOTTOM)

#缩放
width,height = img2.size
img2_resize_result = img2.resize((int(width*0.6),int(height*0.6)),Image.ANTIALIAS)

#剪切 crop()四个参数分别是：(左上角点的x坐标，左上角点的y坐标，右下角点的x坐标，右下角点的y坐标)
img1_crop_result = img1.crop((126,0,381,300))
#保存图片
img1_crop_result.save('path')
```

---

### Matplotlib库

注：

- Matplotlib库由各种可视化类构成，内部结构复杂。
- matplotlib.pylot是绘制各类可视化图形的命令字库。

```python
import matplotlib.pyplot as plt
import numpy as np 

#显示matplotlib生成的图形
%matplotlib inline

x = np.linspace(-1,1,50) #等差数列，从-1到1生成50个等间距的数的数组
y1 = 2*x + 1
y2 = x**2

#传入x,y,通过plot()绘制出折线图 
plt.figure(figsize=(7,5))#保持图像
plt.plot(x,y1,color='red',linewidth=1)#连续图
plt.plot(x,y2,color='blue',linewidth=5)
plt.legend(handles=[l1,l2],labels=['aa','bb'],loc='best')#图例
plt.xlabel('x',fontsize=20)
plt.ylabel('y',fontsize=20)
plt.xlim((0,1))  #x轴只截取一段进行显示
plt.ylim((0,1))  #y轴只截取一段进行显示
plt.show()#显示图形

#绘制离散图
dots1 =np.random.rand(50)
dots2 =np.random.rand(50)
plt.scatter(dots1,dots2,c='red',alpha=0.5) #c表示颜色，alpha表示透明度
plt.show()

#绘制直方图（柱状图）
x = np.arange(10)
y = 2**x+10
plt.bar(x,y,facecolor='#9999ff',edgecolor='white')
for ax,ay in zip(x,y):#顶部居中标注纵坐标
    plt.text(ax,ay,'%.1f' % ay,ha='center',va='bottom')
plt.show()
```

#### 基础图标函数

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220911193426778.png" alt="image-20220911193426778" style="zoom:67%;" />

![image-20220911193512661](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220911193512661.png)

![](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220911193512661.png)

---

## 数据增强
简介：深层神经网络一般都需要大量的训练数据才能获得比较理想的结果。在数据量有限的情况下，可以通过数据增强( Data Augmentation )来增加训练样本的多样性，提高模型鲁棒性。
目的：

- 增加数据量

- 采集更多的图像特征

- 使网络可见更多的数据变化

- 提高模型的泛化能力

增强方式：

<img src="https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220911194420932.png" alt="image-20220911194420932" style="zoom: 80%;" />

### 1. 随机旋转

注：**使用numpy+ PIL库进行图像的随机旋转**

```python
def rotate_image( img ): 
    """
    图像增强，增加随机旋转角度
    """
    angle = np.random.randint( -14, 15)
    img = img.rotate(angle)
    return img

```

### 2. 随机亮度调整

注：使用numpy+ PIL库进行图像的随机亮度调整

```python
def random_brightness(img): 
    """
    图像增强，亮度调整
    :param img:
    :return:
    """
    prob = np.random.uniform(0, 1)
    if prob < train_parameters['image_enhance_strategy']['brightness_prob']:
        brightness_delta = train_parameters['image_enhance_strategy']['brightness_delta'] 
        delta = np.random.uniform(-brightness_delta, brightness_delta) + 1
        img = ImageEnhance.Brightness(img).enhance(delta)
    return img
```

### 3. 训练过程可视化

注：使用Matplotlib库绘制深度学习训练过程中,随着数据的增加，误差与准确率的变化趋势,从而对模型效果进行评估。观察到模型的误差相对较低,而准确率较高，接下来可以使用该模型进行预测。

![image-20220911195508553](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20220911195508553.png)



[声明]: 上述代码部分为伪代码，本笔记没有配备对应图片，请自己复制到IDE手动尝试运行代码，从而达到练习巩固提高的效果，感谢各位支持！

