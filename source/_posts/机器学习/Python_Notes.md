---
title: Python_Notes
tags: python
categories: python,program_study
date: 2022-9-10 10:00:00
sticky: 40
excerpt: introducing some package usage of machine_learning. 
---

---

<u>**/**为浮点除，返回一个浮点数</u>

<u>**//**为整除，返回一个向下取整的整数</u>

# math 模块

```python
import math

print(math.ceil(4.1))   #返回数字的上入整数

print(math.floor(4.9))  #返回数字的下舍整数

print(math.fabs(-10))   #返回数字的绝对值

print(math.sqrt(9))     #返回数字的平方根

print(math.exp(1))      #返回e的x次幂

```

---

# random 模块

```python
import random
ran = random.random()#产生0到1直接的浮点数
print(ran)


print ("------- 设置种子 seed -------")
random.seed(10)
print ("Random number with seed 10 : ", random.random())
# 生成同一个随机数
random.seed(10)
print ("Random number with seed 10 : ", random.random())


ran = random.randint(1,20)#生成1到20之间的随机数
print(ran)
```

---

# 字符串

```python
print('''I'm going to the movies''')
#输出结果所见即所得包括所有符号全部打印出来
html = '''
<HTML><HEAD><TITLE>
Friends CGI Demo</TI TLE></HEAD>
<BODY><H3>ERROR</H3>
<B>%s</B><P>
<FORM><INPUT TYPE=button VALUE=Back
ONCLICK="window.history.back()"></FORM>
</BODY></HTML>
'''
print(html)
```

---

# 列表

```python
#声明一个空列表
girls = []

#append(),末尾追加
girls.append('杨超越')
print(girls)
#extend(),一次添加多个。把一个列表添加到另一个列表 ，列表合并。
models = ['刘雯','奚梦瑶']
girls.extend(models)
#girls = girls + models
print(girls)
#insert():指定位置添加
girls.insert(1,'虞书欣')
print(girls)

#列表删除
words = ['cat','hello','pen','pencil','ruler']
del words[1]
words.remove('cat')#删除指定元素
words.pop(1)
print(words)

#列表排序
#默认升序
new_list = sorted(random_list)
print(new_list)
#降序
new_list = sorted(random_list,reverse =True)
print(new_list)
```

---

# 元组

**注意：元组中只有一个元素时，需要在后面加逗号！**

```python
tuple3 = ('hello',)
print(type(tuple3))

#元组修改
t1 = (1,2,3)+(4,5)
t2 = (1,2) * 2
print(t1,t2)

#相关方法
print(max(random_tuple))
print(min(random_tuple))
print(sum(random_tuple))
print(len(random_tuple))
#统计元组中4的个数
print(random_tuple.count(4))
#元组中4所对应的下标，如果不存在，则会报错
print(random_tuple.index(4))

#元组拆包与装包
##当元组中元素个数与变量个数一致时
#定义一个元组
t3 = (1,2,3)
#将元组赋值给变量a,b,c
a,b,c = t3
#打印a,b,c
print(a,b,c)

#当元组中元素个数与变量个数不一致时
#定义一个元组，包含5个元素
t4 = (1,2,3,4,5)
#将t4[0],t4[1]分别赋值给a,b;其余的元素装包后赋值给c
a,b,*c = t4
print(a,b,c)
print(c)
print(*c)
```

---

# 字典

```python
#list可以转成字典，但前提是列表中元素都要成对出现
dict3 = dict([('name','杨超越'),('weight',45)])
print(dict3)

#字典里的函数 items()  keys() values()
dict5 = {'杨超越':165,'虞书欣':166,'上官喜爱':164}
print(dict5.items())
for key,value in dict5.items():
    if value > 165:
        print(key)
        
names = dict5.keys()#返回一个类
print(names)
results = dict5.values()#返回一个类
print(results)

print(dict5.get('赵小棠',170)) #如果能够取到值，则返回字典中的值，否则返回默认值170
```

---

# JSON

- **json.dumps(obj)将python对象编码成json字符串**

  （可选参数）：

  sort_keys=True表示按照字典排序(a到z)输出。

  indent参数，代表缩进的位数

  separators参数的作用是去掉,和:后面的空格，传输过程中数据越精简越好

  ```python
  import json
  data = [ { 'b' : 2, 'd' : 4, 'a' : 1, 'c' : 3, 'e' : 5 } ]
  json = json.dumps(data, sort_keys=True, indent=4,separators=(',', ':'))
  print(json)
  ```

- **json.loads 用于解码JSON数据。该函数返回Python字段的数据类型**

  ```python
  import json
  jsonData = '{"a":1,"b":2,"c":3,"d":4,"e":5}'
  text = json.loads(jsonData)  #将string转换为dict
  print(text)
  ```

---

# 异常处理

- **try/except语句用来检测try语句块中的错误，从而让except语句捕获异常信息并处理**
- **finally中的内容，退出try时总会执行**

```python
try:
    fh = open("filepath", "w")
    fh.write("这是一个测试文件，用于测试异常!!")
except IOError:
    print('Error: 没有找到文件或读取文件失败')
else:
    print ('内容写入文件成功')
    fh.close()
finally:
    print('关闭文件')
    f.close()
```

  

