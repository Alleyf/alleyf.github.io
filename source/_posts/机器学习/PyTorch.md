---
title: PyTorch快速入门
tags: [DL]
date: 2023-05-31 14:27:39
sticky: 20
excerpt: Machine and Deep learning
---
# 心得体会
# 正文
## 1. 数据加载
### 1.1DataSet
> 继承 DataSet 类并重写__getitem__和 __len__ 方法

```python
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
### 1.2 DataLoder

# 参考文献
[PyTorch快速入门（小土堆）](https://www.bilibili.com/video/BV1hE411t7RN?p=6&vd_source=9c896fa9c3f9023797e8efe7be0c113e)