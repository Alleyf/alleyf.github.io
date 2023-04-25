---
title: DRF速通
tags: [Django]
categories: Front_end_development
date: 2023-04-25 19:29:25
sticky: 75
excerpt: it is some basic usage of drf .
---

# 1. api 接口

目前市面上大部分公司开发人员使用的接口实现规范主要有：restful、RPC。

RPC（ Remote Procedure Call ）: 翻译成中文:远程过程调用[远程服务调用]. 从字面上理解就是访问/调用远程服务端提供的api接口。这种接口一般以服务或者过程式代码提供。
restful: 翻译成中文: 资源状态转换.(表征性状态转移)

-   把服务端提供的所有的数据/文件都看成资源， 那么通过api接口请求数据的操作，本质上来说就是对资源的操作了.
    
    因此，restful中要求，我们把当前接口对外提供哪种资源进行操作，就把**资源的名称写在url地址**。
    
-   web开发中操作资源，最常见的最通用的无非就是增删查改，所以restful要求在地址栏中声明要操作的资源是什么。然后通过**http请求动词**来说明对该资源进行哪一种操作.

> POST [http://www.xxx.com/api/students/](http://www.xxx.com/api/students/) 添加学生数据
> 
> GET [http://www.xxx.com/api/students/](http://www.xxx.com/api/students/) 获取所有学生
> 
> GET [http://www.xxx.com/api/students/](http://www.xxx.com/api/students/)/ 获取id=pk的学生
> 
> DELETE [http://www.xxx.com/api/students/](http://www.xxx.com/api/students/)/ 删除id=pk的一个学生
> 
> PUT [http://www.xxx.com/api/students/](http://www.xxx.com/api/students/)/ 修改一个学生的全部信息 [id,name,sex,age,]
> 
> PATCH [http://www.xxx.com/api/students/](http://www.xxx.com/api/students/) / 修改一个学生的部分信息[age]

请求方式：***增删改查查***

1. restful 是以资源为主的 api 接口规范，体现在地址上就是资源就是以名词表达。
2. rpc 则以动作为主的 api 接口规范，体现在接口名称上往往附带操作数据的动作。

# 2.Django 的 CBV


```python
# CBV模式,views.py
from django.views import View
class BookView(View) ;
	def get(self, reguest):
		return HttpResponse("View GET请求...")
	def post(self, reguest):
		return HttpResponse("View POST请求...")
	def delete(self,request):
		return HttpResponse("View DELETE请求'''")
		
# urls.py
from django. contrib import admin
from django.urls import path
from book import views

urlpatterns = [
path('admin/', admin. site.urls) ,
# path( 'book/', views.book) ,
path("book/".views . BookView.asTview()) #路由中的“/”不能丢，否则自动重定向为get请求
]
```

# 3. 反射

通过反射 `func = getattr(self,func_name_str)` 可以将**字符串转变为变量 (函数)**，接着就可以直接调用 func () 从而**动态调用函数**。
```python
class Animal(object):
	def __init__(self,name,age,func_str):
		self.name = name
		self.age = age
		func = getattr(self,func_str)
		func() # 等价于self.slepp() 
a = Animal("alleyf",21,"sleep")

```


# 4. Drf

## 1. APIView

1. 重写了 View 的 as_view ()和 dispatch（）方法，构建了新的 request 对象实现**认证、权限和限流**作用。
2. `request. Get ()->request. Query_params ()`获取 get 请求参数
3. `request. Post ()->request. Data ()` 获取 post(put 等)请求体数据，包括 files 都封装在一起反序列化了，支持前端 urlcoded 格式和 json 等其他任何格式。


## 2.Serializer 序列化器

