---
title: DRF速通
tags: [Django]
categories: Front_end_development
date: 2023-04-25 19:29:25
sticky: 75
excerpt: it is some basic usage of drf .
---

>  其他相关文章-> [[网页开发]]

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

> 安装 drf：

```shell
pip install djangorestframework
```
> 注册 drf app：

```python
INSTALLED_APPS = [
	... ,
	'rest_framework', 
]
```
---
## 1. APIView

1. 重写了 View 的 as_view ()和 dispatch（）方法，构建了新的 request 对象实现**认证、权限和限流**作用。
2. `request. Get ()->request. Query_params ()`获取 get 请求参数
3. `request. Post ()->request. Data ()` 获取 post(put 等)请求体数据，包括 files 都封装在一起反序列化了，支持前端 urlcoded 格式和 json 等其他任何格式。
---
## 2.Serializer （反）序列化器

![（反）序列化器|425](https://s2.loli.net/2023/04/26/VukBIX39lj2Kbx6.png)


> [!NOTE] keys
> 
> - 序列化：数据表数据->前端显示的 json 数据 （get 请求，**取数据**）
> - 反序列化：前端提交的 json 数据->数据表数据（post、put、patch、delete 等请求，**存数据**）

### 1.序列化与反序列化

**常用字段类型**：

| 字段                    | 构造方式                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------ |
| **BooleanField**        | BooleanField()                                                                       |
| **CharField**           | CharField(max_length=None, min_length=None, allow_blank=False, trim_whitespace=True) |
| **EmailField**          | EmailField(max_length=None, min_length=None, allow_blank=False)                      |
| **URLField**            | URLField(max_length=200, min_length=None, allow_blank=False)                         |
| **IPAddressField**      | IPAddressField(protocol=‘both’, unpack_ipv4=False, options)                          |
| **IntegerField**        | IntegerField(max_value=None, min_value=None)                                         |
| **FloatField**          | FloatField(max_value=None, min_value=None)                                           |
| **DateTimeField**       | DateTimeField(format=api_settings.DATETIME_FORMAT, input_formats=None)               |
| **DateField**           | DateField(format=api_settings.DATE_FORMAT, input_formats=None)                       |
| **TimeField**           | TimeField(format=api_settings.TIME_FORMAT, input_formats=None)                       |
| **ChoiceField**         | ChoiceField(choices) choices 与 Django 的用法相同                                    |
| **MultipleChoiceField** | MultipleChoiceField(choices)                                                         |
| **FileField**           | FileField(max_length=None, allow_empty_file=False, use_url=UPLOADED_FILES_USE_URL)   |
| **ImageField**          | ImageField(max_length=None, allow_empty_file=False, use_url=UPLOADED_FILES_USE_URL)  |
| **ListField**           | ListField(child=, min_length=None, max_length=None)                                  |
| **DictField**           | DictField(child=)                                                                    |

**选项参数：**

| 参数名称            | 作用             |
| ------------------- | ---------------- |
| **max_length**      | 最大长度         |
| **min_lenght**      | 最小长度         |
| **allow_blank**     | 是否允许为空     |
| **trim_whitespace** | 是否截断空白字符 |
| **max_value**       | 最小值           |
| **min_value**       |     最大值             |
**通用参数：**

| 参数名称           | 说明                                      |
| ------------------ | ----------------------------------------- |
| **read_only**      | 表明该字段仅用于序列化输出，默认False     |
| **write_only**     | 表明该字段仅用于反序列化输入，默认False   |
| **required**       | 表明该字段在反序列化时必须输入，默认True  |
| **default**        | 反序列化时使用的默认值                    |
| **allow_null**     | 表明该字段是否允许传入 None，默认 False   |
| **validators**     | 该字段使用的验证器                        |
| **error_messages** | 包含错误编号与错误信息的字典              |
| **label**          | 用于 HTML 展示 API 页面时，显示的字段名称 |
| **help_text**      |  用于HTML展示API页面时，显示的字段帮助提示信息                                         |

1. 新建模型（反）序列化器

```python
from rest_framework import serializers
class BookSerializers(serializers.Serializer):
"""Book的(反)序列化器"""
	title = serializers.CharField (max_length=3)
	price = serializers.IntegerField(require=True)
	date = serializers.DateField(source="pub_date")

	# 该方法必须被重写否则无法使用serializer.save()新建数据,实现view与serializer解耦
	def create(self,validated_data):
		new_book = Book.objects.create(**serializer.validated_data)
		return new_book
	# 该方法必须被重写否则无法使用serializer.save()更新数据，实现view与serializer解耦
	def update(self,validated_data):
		# 修改数据
		Book.objects.filter(pk=instance.pk).update(**serializer.validated_data)
			# 设置序列化器的实例为更新后的对象
			updated_book = Book.objects.get(pk=instance.pk)
			return updated_book
		
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
		queryset = Book.objects.all() # 当查询过滤得到一个对象时，many=False
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
		singleBook = Book.objects.get(pk=id)
		# 构建序列化器转为json数据
		serializer = Serializer(instance=singleBook,many=False)
		return Response(serializer.data)
	def put(self,request,id):
		"""修改指定id的数据"""
		update_bookobj = Book.objects.get(pk=id)
		# 构建反序列化器
		serializer = Serializer(instance=update_bookobj,data=request.data,many=False)
		# 数据校验
		if serializer.is_valid():
			serializer.save()
			# 序列化修改后的对象并返回
			return Response(serializer.data)
		else:
			# 校验失败，返回错误 
			return Response(serializer.errors) 
	def delete(self,request,id):
		Book.objects.get(pk=id).delete()
		# 直接返回空
		return Response()
		
```

3. 路由配置（urls.py）

```python
from django.urls import path,re_path ,include
from views import Bookview , BookDetailview
urlpatterns = [
		path('books/',Bookview.as_view()),
		re_path('books/(?P<pk>\d+)/',BookDetailview.as_view()),
]
```

### 2. Response 

> drf 重写后的 response
`Response(data, status=None, template_name=None, headers=None, content_type=None)`

> [!NOTE] 常用参数概念
> 1. `data` ：python 的基本数据类型或者序列化后的数据
> 2. `status`：返回状态码，eg：200，403 etc
> 3. `template_name`: 模板名称，如果使用 `HTMLRenderer` 时需指明；
> 4.  `headers`: 用于存放响应头信息的字典；
> 5.  `content_type`: 响应数据的 Content-Type，通常此参数无需传递，REST framework 会根据前端所需类型数据来设置该参数

### 3. 状态码

> 为了方便设置状态码，REST framewrok在`rest_framework.status`模块中提供了常用http状态码的常量。


```python
# 1）信息告知 - 1xx 
HTTP_100_CONTINUE 
HTTP_101_SWITCHING_PROTOCOLS 
# 2）成功 - 2xx 
HTTP_200_OK 
HTTP_201_CREATED 
HTTP_202_ACCEPTED 
HTTP_203_NON_AUTHORITATIVE_INFORMATION HTTP_204_NO_CONTENT 
HTTP_205_RESET_CONTENT 
HTTP_206_PARTIAL_CONTENT 
HTTP_207_MULTI_STATUS 
# 3）重定向 - 3xx 
HTTP_300_MULTIPLE_CHOICES 
HTTP_301_MOVED_PERMANENTLY 
HTTP_302_FOUND 
HTTP_303_SEE_OTHER 
HTTP_304_NOT_MODIFIED 
HTTP_305_USE_PROXY 
HTTP_306_RESERVED 
HTTP_307_TEMPORARY_REDIRECT 
# 4）客户端错误 - 4xx 
HTTP_400_BAD_REQUEST 
HTTP_401_UNAUTHORIZED 
HTTP_402_PAYMENT_REQUIRED 
HTTP_403_FORBIDDEN 
HTTP_404_NOT_FOUND 
HTTP_405_METHOD_NOT_ALLOWED 
HTTP_406_NOT_ACCEPTABLE HTTP_407_PROXY_AUTHENTICATION_REQUIRED HTTP_408_REQUEST_TIMEOUT 
HTTP_409_CONFLICT 
HTTP_410_GONE 
HTTP_411_LENGTH_REQUIRED 
HTTP_412_PRECONDITION_FAILED HTTP_413_REQUEST_ENTITY_TOO_LARGE HTTP_414_REQUEST_URI_TOO_LONG HTTP_415_UNSUPPORTED_MEDIA_TYPE HTTP_416_REQUESTED_RANGE_NOT_SATISFIABLE HTTP_417_EXPECTATION_FAILED 
HTTP_422_UNPROCESSABLE_ENTITY 
HTTP_423_LOCKED 
HTTP_424_FAILED_DEPENDENCY 
HTTP_428_PRECONDITION_REQUIRED 
HTTP_429_TOO_MANY_REQUESTS HTTP_431_REQUEST_HEADER_FIELDS_TOO_LARGE HTTP_451_UNAVAILABLE_FOR_LEGAL_REASONS 
# 5）服务器错误 - 5xx 
HTTP_500_INTERNAL_SERVER_ERROR 
HTTP_501_NOT_IMPLEMENTED 
HTTP_502_BAD_GATEWAY 
HTTP_503_SERVICE_UNAVAILABLE 
HTTP_504_GATEWAY_TIMEOUT HTTP_505_HTTP_VERSION_NOT_SUPPORTED HTTP_507_INSUFFICIENT_STORAGE HTTP_511_NETWORK_AUTHENTICATION_REQUIRED
```

---
## 3.ModelSerializer

> 模型类序列化器，根据模型简化序列化过程，根据模型表**自动创建序列化字段**，并且内部实现了 **create 方法和 update 方法**，也可以根据实际需要重写逻辑。

```python
class BookModelSerializer(serializers.ModelSerializer):
	class Meta:
		model = Book
		# 对全部字段进行序列化
		fields = '__al__'
		# 对指定字段进行序列化
		fields = ['title','id',···]
		# 排除指定字段不进行序列化
		exclude = ['id']
		extra_kwargs = { 'id': {'min_value': 0, 'required': True}, 'title': {'min_value': 0, 'required': True}, }
```

### 钩子函数

```python
# 全局钩子  
def validate(self, attrs):  
    name = attrs.get('name')  
    if Resume.objects.filter(name=name).exists():  
        raise exceptions.ValidationError(name + '的简历已存在!')  
    else:  
        return attrs  
  
# 局部钩子  
def validate_name(self, value):  
     response = {'status': 200, 'msg': '成功'}  
     res = Resume.objects.filter(name=value)  
     if res:  
         raise exceptions.ValidationError('简历重复!')  
  
     else:  
         return value
```

---
## 4. 视图

### 1. GenericAPIView 

> 在 APIView 上扩展了一些新方法




### 4.扩展视图方法

```python
@action(methods=['get','post'], detail=False, url_path='test')  
def test(self, request):  
    print(request.data)  
    return Response({"code": 200, "data": "成功了"})
```

