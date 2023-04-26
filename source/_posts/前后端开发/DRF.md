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
---

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
---

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

---
# 4. Drf

## 1. APIView

1. 重写了 View 的 as_view ()和 dispatch（）方法，构建了新的 request 对象实现**认证、权限和限流**作用。
2. `request. Get ()->request. Query_params ()`获取 get 请求参数
3. `request. Post ()->request. Data ()` 获取 post(put 等)请求体数据，包括 files 都封装在一起反序列化了，支持前端 urlcoded 格式和 json 等其他任何格式。

## 2.Serializer 序列化器

> [!NOTE] keys
> 
> - 序列化：数据表数据->前端显示的 json 数据 （get 请求，**取数据**）
> - 反序列化：前端提交的 json 数据->数据表数据（post、put、patch、delete 等请求，**存数据**）

### 1.序列化与反序列化

1. 新建模型（反）序列化器

```python
from rest_framework import serializers
class BookSerializers(serializers.Serializer):
"""Book的(反)序列化器"""
	title = serializers.CharField (max_length=3)
	price = serializers.IntegerField(require=True)
	date = serializers.DateField(source="pub_date")

	# 该方法必须被重写否则无法使用serializer.save(),实现view与serializer解耦
	def create(self,validated_data):
		new_book = Book.object.create(**serializer.validated_data)
		return new_book
	```

> 1. （反）序列化器的字段名与数据表的字段名必须一致，否则需要指定 `source` 指向某个字段
> 2. 字段规则要根据数据表的规则设置

2. 新建模型视图类

> - **根据需求重写 get、post、put、delete 等方法**
> - 除了 **delete 返回 none** 外，其他方法都要返回改变的**序列化为 json 后的数据**

```python
from rest_framework.response import Response
from rest_framework import viewsets
class BookView(APIView):
	def get(self,request):
	"""序列化"""
		# query_params = request.query_params() 获取get的url请求参数 
		queryset = Book.object.all() # 当查询过滤得到一个对象时，many=False
		# 构建序列化对象
		serializer = BookSerializer(instance=queryset,many=True)
		return Response(serilaizer.data)
	def post(self,request):
	"""反序列化"""
		# 构建反序列化对象 
		serializer = BookSerializer(data=request.data)
		# 数据校验
		if serializer.is_valid():
			# 校验通过创建新数据，返回新建的json数据 
			serializer.save()
			return Response(serializer.data)
		else:
			# 校验失败，返回错误 
			return Response(serializer.errors) 
class BookDetailView(APIView):
	def get(self,request,id):
	"""
	从数据库获取指定id的数据
	"""
		singleBook = Book.object.get(pk=id)
		# 构建序列化器转为json数据
		serializer = Serializer(instance=singleBook,many=False)
		return Response(serializer.data)
	def put(self,request,id):
		"""修改指定id的数据"""
		update_bookobj = Book.object.get(pk=id)
		# 构建反序列化器
		serializer = Serializer(instance=update_bookobj,data=request.data,many=False)
		# 数据校验
		if serializer.is_valid():
			修改数据Book.object.filter(pk=id).update(**serializer.validated_data)
		# 序列化修改后的对象并返回
		return Response(serializer.data)
		
```

3. 路由配置（urls.py）

```python
from views import Bookview , BookDetailview
urlpatterns = [
		path('book/',Bookview.as_view()),
		re_path('book/(/d+)',BookDetailview.as_view()),
]
```