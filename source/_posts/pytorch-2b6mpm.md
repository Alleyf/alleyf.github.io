---
title: PyTorch
date: 2023-08-17T12:10:24Z
lastmod: 2023-08-17T14:59:00Z
---



* [@心得体会](siyuan://blocks/20230817121028-w7nyyc3)

  * [@1.python](siyuan://blocks/20230817121030-n35add1)
* [@正文](siyuan://blocks/20230817121060-tiief1g)

  * [@1.数据加载](siyuan://blocks/20230817121062-iq1quyh)

    * [@1.1DataSet](siyuan://blocks/20230817121063-82dcpx9)
  * [@2.TensorBoard](siyuan://blocks/20230817121071-q3mapen)

    * [@2.1 绘图](siyuan://blocks/20230817121087-t69jfrt)
    * [@2.2 添加图片](siyuan://blocks/20230817121090-ht9sci3)
  * [@3.Transforms](siyuan://blocks/20230817121093-bmk2qob)

    * [@3.1 ToTensor](siyuan://blocks/20230817121094-3y9wxog)
    * [@3.2 Compose](siyuan://blocks/20230817121112-7h31n7i)
* [@参考文献](siyuan://blocks/20230817121113-9ahl3ut)

---

<iframe src="/widgets/metadata" data-src="/widgets/metadata" data-subtype="widget" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

title: PyTorch 快速入门
tags: [DL]
date: 2023-05-31 14:27:39
sticky: 20
excerpt: Machine and Deep learning

---

# 心得体会

---

## 1.python

> Python 类中的双下划线 (double underscore)开头的方法通常被称为"魔法方法" (magic methods)。这些方法可以实现一些特殊的功能或对类进行修改。以下是一些常见的双下划线方法及其作用:

- **init**(): 构造函数, 用于初始化类的实例。
- **str**(): 当使用 print 输出对象时, 打印该方法的返回值。
- **repr**(): 返回对象的机器可读字符串表示形式。
- **del**(): 析构函数, 删除对象时被调用。
- **call**(): 允许将对象视为函数调用。
- **getitem**(): 通过索引访问元素的方法, 使得对象可以像列表那样进行切片。
- **len**(): 返回对象长度的方法, 使得对象可以对 len () 函数生效。
- **eq**(): 判断两个对象是否相等的方法, 使得对象可以使用 == 进行比较。
- **lt**(): 小于比较的方法, 可以使用 < 进行比较。
- **add**(): 实现对象的加法运算。
- **iter**(): 实现迭代器接口, 使得对象可以被用于 for 循环。
- **metaclass**: 元类, 用于创建类对象。

> 所以双下划线方法主要是实现一些内置的功能或魔法方法, 让 Python 类拥有一些特殊的行为。我们自己编写类时, 如果需要实现某些特殊功能, 可以通过编写双下划线方法来实现。

# 正文

---

## 1.数据加载

### 1.1DataSet

> 继承 DataSet 类并重写__getitem__和 **len** 方法

```python
import torch
from PIL import Image
from torch.utils.data import Dataset
import os
# 快捷键ctrl+B快速打开关闭文件编辑区
class CustomDataset(Dataset):
    def __init__(self, root_dir,label_dir):
        self.root_dir = root_dir
        self.label_dir = label_dir
        self.path = os.path.join(self.root_dir,self.label_dir)
        self.img_path = os.listdir(self.path)
    def __getitem__(self, index):
        # 根据索引index获取数据和标签
        img_name = self.img_path[index]
        img_item_path = os.path.join(self.path,img_name)
        img = Image.open(img_item_path)
        label = self.label_dir
        return img,label
    def __len__(self):
        # 返回数据集的长度
        return len(self.img_path)
```

```python
root_dir = 'dataset/train'
ants_label_dir = 'ants_image'
bees_label_dir = 'bees_image'
ants_dataset = CustomDataset(root_dir,ants_label_dir)
bees_dataset = CustomDataset(root_dir,bees_label_dir)
```

> **小数据集可以通过 ➕ 叠加为大数据集**

```python
img,label = ants_dataset[1]
img.show()
img,label = bees_dataset[0]
img.show()
train_dataset = ants_dataset+bees_dataset
img,label = train_dataset[124]
img.show()
```

## 2.TensorBoard

> TensorBoard 是一个用于可视化和监控机器学习模型训练过程的工具。它可以帮助您跟踪实验指标（如损失和准确率）、呈现模型计算图以及将嵌入向量投影到较低维度的空间等[1]。以下是使用 TensorBoard 的一般步骤：

1. 安装 TensorBoard：您可以使用 pip 安装 TensorBoard，例如 `pip install tensorboard`。
2. 导入 TensorBoard：在 Python 代码中，导入 TensorBoard 库，例如 `import tensorflow as tf`。
3. 在代码中添加 TensorBoard 回调：在您的机器学习模型训练代码中，添加 TensorBoard 回调函数。这将允许 TensorBoard 在训练过程中记录指定的指标和数据。
4. 启动 TensorBoard 服务器：在终端中，使用命令 `tensorboard --logdir=<log_directory>` 启动 TensorBoard 服务器。其中，`<log_directory>` 是您保存 TensorBoard 日志文件的目录。
5. 在浏览器中查看 TensorBoard：在浏览器中输入 `http://localhost:6006`，您将能够查看 TensorBoard 的可视化界面。

> 在 TensorBoard 界面中，您可以查看训练过程中的损失曲线、准确率曲线等指标图表。您还可以查看模型计算图、嵌入向量的投影等[1]。

### 2.1 绘图

```python
from torch.utils.tensorboard import SummaryWriter
writer  = SummaryWriter("logs")
for i in range(100):
    writer.add_scalar("y=x",i,i)
writer.close()
```

![image.png|500](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/202308171505777.png)

### 2.2 添加图片

```python
from torch.utils.tensorboard import SummaryWriter
import numpy as np
from PIL import Image
writer  = SummaryWriter("logs")
img_path = "dataset/train/ants_image/1030023514_aad5c608f9.jpg"
img_pil = Image.open(img_path)
img_array = np.array(img_pil)
writer.add_image("ant_test",img_array,2,dataformats='HWC')
writer.close()
```

![image.png|400](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/202308171505077.png)

## 3.Transforms

### 3.1 ToTensor

![image.png|500](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/202308171505136.png)

> 通过 transforms. ToTensor 去看两个问题
>
> 1. transforms 该如何使用 (python)？
> 2. 为什么我们需要 Tensor 数据类型？

```python
from torchvision import transforms
from PIL import Image
import cv2
img_path = "./dataset/train/ants_image/0013035.jpg"
img_PIL=Image.open(img_path)
img_cv = cv2.imread(img_path)
transform_tensor = transforms.ToTensor()
img_tensor = transform_tensor(img_cv)
print(img_tensor.shape)
writer = SummaryWriter("logs")
writer.add_image("tensor_image",img_tensor)
writer.close()
```

![image.png|400](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/202308171505460.png)

> [!NOTE] Tips
>
> 1. **cv 2 的 imread** 读取的图片类型为 `ndarray`
> 2. **PIL 的 Image. open** 读取的图片类型为 `JpegImageFile`

### 3.2 Compose

> Compose类是将多种transforms操作叠加在一起,初始化compose类后,执行`__call__`​方法循环执行组合操作

```python
transform_compose = transforms.Compose([transforms.CenterCrop(10),transforms.ToTensor(),transforms.ConvertImageDtype(torch.float),])
img_compose = transform_compose(img_PIL)
print(type(img_compose))
writer = SummaryWriter("logs")
writer.add_image("compose_tensor_image",img_compose)
writer.close()
```

### 3.3 Normalize

‍

‍

  

‍

> 对图像进行正则化,传参包括**各通道均值和标准差**

```python
trans_normalize = transforms.Normalize([0.5, 0.5, 0.5],[0.5, 0.5, 0.5])
img_norm = trans_normalize(img_tensor)
print(img_norm[0][0][0])
writer.add_image("Normalize",img_norm)
```

![image](![](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/202308171425731.png))

### 3.4 Resize

> 改变PILImage图像尺寸

```python
from torchvision import transforms

# 将图像缩放到256x256
trans_resize= transforms.Resize(256) 

# 将图像按比例缩放,短边为256
trans_resize= transforms.Resize(size=(256, 256), interpolation=Image.BICUBIC)

# 最长边不超过256,短边按2:1的比例缩放 
trans_resize= transforms.Resize(max_size=256, ratio=2)

img_resize = trans_resize(img_tensor)
print(img_resize.shape)
```

### 3.5 RandomCrop

> 随机裁剪图像,指定裁剪后的图像大小进行随机裁剪,支持输入格式为`PILImage和Tensor`​

```python
trans_randomcrop = transforms.RandomCrop(512)
img_randomcrop = trans_randomcrop(img_tensor)
print(img_randomcrop.shape)
writer.add_image("randomcrop",img_randomcrop)
```

​​![](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/202308171458436.png)

‍

​​

‍

‍

‍

# 参考文献

[PyTorch 快速入门（小土堆）](https://www.bilibili.com/video/BV1hE411t7RN?p=6&vd_source=9c896fa9c3f9023797e8efe7be0c113e)

<div>
<iframe src="https://player.bilibili.com/player.html?aid=74281036&bvid=BV1hE411t7RN&cid=134328447&page=7" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
</div>

‍
