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
		serializer = Serializer(instance=update_bookobj,data=request.data)
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
导入 `GenericAPIView`
> `from rest_framework.viewsets import generics`

> 在 APIView 上扩展了一些新方法

可设置的属性变量：
-   **pagination_class** 指明分页控制类
-   **filter_backends** 指明过滤控制后端

#### 1. 常用方法
##### （1）get_serializer_class(self)
> 当出现一个视图类中调用多个序列化器时,那么可以通过条件判断在get_serializer_class方法中通过返回不同的序列化器类名就可以让视图方法执行不同的序列化器对象了。
> 返回序列化器类，默认返回`serializer_class`，可以重写

##### （2）get_serializer(self, *args, \*\*kwargs)
> 返回序列化器对象，主要用来提供给Mixin扩展类使用，如果我们在视图中想要获取序列化器对象，也可以直接调用此方法。
> 
> **注意，该方法在提供序列化器对象的时候，会向序列化器对象的context属性补充三个数据：request、format、view，这三个数据对象可以在定义序列化器时使用。**
> -   **request** 当前视图的请求对象
> -   **view** 当前请求的类视图对象
> -   **format** 当前请求期望返回的数据格式

##### （3）get_queryset(self)
> 返回视图使用的查询集，主要用来提供给 Mixin 扩展类使用，是列表视图与详情视图获取数据的基础，默认返回 `queryset` 属性，可以重写.

##### （4）get_object(self)
> 返回详情视图所需的模型类数据对象，主要用来提供给Mixin扩展类使用。
> 
> 在试图中可以调用该方法获取详情信息的模型类对象。
> 
> **若详情访问的模型类对象不存在，会返回404。**
> 
> 该方法会默认使用APIView提供的check_object_permissions方法检查当前对象是否有权限被访问。

#### 1. 方法重写
`设置urls.py中的普通路由，正则路由指定参数为pk`
```python
urlpatterns = [
	path('books/',views.BookView.as_view()),
	re_path('books/(?P<pk>\d+)',views.BookDetailView.as_view()),
]
```
**get：**
```python
def get(self, request):  
    """获取所有岗位信息"""  
    serializer = self.get_serializer(instance=self.get_queryset(), many=True)  
    return Response(serializer.data)
```
**<font color="#f79646">post</font>：**
```python
def post(self, request):  
    """  
    添加岗位信息  
    :param request:    :return: 添加后的岗位信息  
    """    serializer = self.get_serializer(data=request.data)  
    if serializer.is_valid():  
        serializer.save()  
        return Response(serializer.data)  
    else:  
        return Response(serializer.errors)
```
**<font color="#2DC26B">get（单个数据）</font>：**
```python
def get(self, request, pk):  
    """获取指定id的岗位信息"""  
    serializer = self.get_serializer(instance=self.get_object(), many=True)  
    return Response(serializer.data)
```
<font color="#00b0f0">put（单个数据）：</font>
```python
def put(self, request, pk):  
    """  
    修改指定id的岗位信息  
    :param request:    :return: 添加后的岗位信息  
    """    serializer = self.get_serializer(instance=self.get_object(), data=request.data)  
    if serializer.is_valid():  
        serializer.save()  
        return Response(serializer.data)  
    else:  
        return Response(serializer.errors)
```
<font color="#7030a0">delete (单个数据)：</font>
```python
def delete(self,request,id):
	self.get_object().delete()
	# 直接返回空
	return Response()
```
### 2. ViewSet
#### 1. 引言
继承自 `APIView` 与 `ViewSetMixin`，作用也与 APIView 基本类似，提供了身份认证、权限校验、流量管理等。
**ViewSet主要通过继承ViewSetMixin来实现在调用as_view()时传入字典{“http请求”：“视图方法”}的映射处理工作，如{‘get’:’list’}，**
> 1. 通过路由指定不同请求执行不同视图函数，从而修改路由分配方法。
> 2. 项目加载时执行 `as_view ()` 函数，当发起请求时才执行 `view` 函数根据反射获取重写的**函数变量**，设置**请求映射**到该函数变量，进而根据不同请求分发匹配不同的视图函数。

在 ViewSet 中，没有提供任何动作 action 方法，需要我们自己实现 action 方法。
使用视图集ViewSet，可以将一系列视图相关的代码逻辑和相关的http请求动作封装到一个类中：
<font color="#4bacc6">> -   list() 提供一组数据</font>
<font color="#4bacc6">> -   retrieve() 提供单个数据</font>
<font color="#4bacc6">> -   create() 创建数据</font>
<font color="#4bacc6">> -   update() 保存数据</font>
<font color="#4bacc6">> -   destory() 删除数据</font>
> ViewSet视图集类不再限制视图方法名只允许get()、post()等这种情况了，而是实现允许开发者根据自己的需要定义自定义方法名，例如 list() 、create() 等，然后经过路由中使用http和这些视图方法名进行绑定调用。

### 3. GenericViewSet
> 继承了 GenericAPIView 和 ViewSetMixin，即继承了增删改查查方法，也修改了视图分发方法。

**GenericViewSet**就帮助我们完成了这样的继承工作，继承自`GenericAPIView`与`ViewSetMixin`，在实现了调用as_view()时传入字典（如`{'get':'list'}`）的映射处理工作的同时，还提供了`GenericAPIView`提供的基础方法，可以直接搭配Mixin扩展类使用。
url. py:
```python
from django.urls import path, re_path 
from vset.views import BookView 
urlpatterns = [ 
# path("set", views.BookView.as_view({"http请求":"视图方法"})), 
path("books/", BookView.as_view({ 
								 "get": "list", "post": "create" 
								 })), re_path("^books/(?P<pk>\d+)$", BookView.as_view({
								  "get": "retrieve", 
								  "put": "update", 
								  "delete": "delete", })), ]
```
views. py:
```python
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, \ DestroyModelMixin
class BookView(GenericViewSet, ListModelMixin, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin): 
	queryset = Book.objects 
	serializer_class = BookSerializer
```
### 4. ModelViewSet
> 进一步封装，继承了五个 Mixin 类和 GenericViewSet。

源代码：
```python
class ModelViewSet(mixins.CreateModelMixin,  
                   mixins.RetrieveModelMixin,  
                   mixins.UpdateModelMixin,  
                   mixins.DestroyModelMixin,  
                   mixins.ListModelMixin,  
                   GenericViewSet):
            """  
			A viewset that provides default `create()`, `retrieve()`, `update()`,  
			`partial_update()`, `destroy()` and `list()` actions.  
			"""  
			pass
```
> [!NOTE] 局限：
	不够灵活，直接自带了六个增删改改查查视图函数，需要其他处理需要重写对应方法。

### 5. 扩展视图方法
> 根据需要扩展其他视图函数接口，匹配对应的 get、put、post、delete 等请求，并将接口注册到路由，

#### 1. 路由注册
<font color="#6425d0">views. py:</font>
```python
def 函数名(self, request):  
        '''
        自定义action  
        return: JSON数据  
        '''        pass#示例：  
def latest(self, request):  
    '''获取最后一条记录'''  
    # 获取模型数据  
    book = BookInfo.objects.latest('id')    # 获取序列化器对象  
    s = BookInfoModelSerializer(instance=book)    return Response(s.data)
```
<font color="#4bacc6">urls. py:</font>
```python
urlpatterns = [
			   # url(r'^books/$',views.BookInfoViewSet.as_view({'get':'action函数名'})),  
#示例：  
url(r'^books/$', views.BookInfoViewSet.as_view({'get':'latest'})),  
]
```
#### 装饰器注册
```python
from rest_framework.decorators import action
@action(methods=['get','post'], detail=False, url_path='test')  
def test(self, request):  
    print(request.data)  
    return Response({"code": 200, "data": "成功了"})
```
**参数说明：**
- methods: 声明该 action 对应的请求方式，列表传递  
- detail: 声明该 action 路径是否为单一资源对应(False 查询所有数据接口，True 查询单条数据接口)，生成路由时是否拼接 **pk** 参数，detail为`True`，表示路径名格式应该为 `book/{pk}/login/`
- url_path：**路由名称**，不设置默认为函数名

## 5. 路由
> 对于视图集 ViewSet，我们除了可以自己手动指明请求方式与动作 action 之间的对应关系外，还可以使用 Routers 来帮助我们快速实现路由信息。


REST framework提供了两个router
-   **SimpleRouter**
-   **DefaultRouter**

### 1. 用法

<span style="background:rgba(240, 200, 0, 0.2)">1. 创建 router 对象，并注册视图集</span>

```python
from rest_framework import routers 
router = routers.DefaultRouter() router.register('book', BookView, base_name='book')
```

register(prefix, viewset, base_name)

> -   prefix 该视图集的路由前缀
> -   viewset 视图集
> -   base_name 路由别名的前缀

如上述代码会形成的路由如下：

```python
^book/$    name: book-list
^book/{pk}/$   name: book-detail
```

<span style="background:rgba(136, 49, 204, 0.2)">2. 添加路由数据：</span>

- 方式 1
```python
urlpatterns = [
    ...
]
urlpatterns += router.urls
```

- 方式 2
```python
urlpatterns = [
    ...
    path('^', include(router.urls))
]
```

<span style="background:#40a9ff">3. 完整 demo：</span>
> 附带了 `swagger` 的接口路由和 `django-admin` 后台管理路由
```python
from django.conf.urls import url  
from django.contrib import admin  
from django.urls import include, path, re_path  
from django.views.static import serve  
from rest_framework import routers  
from rest_framework.documentation import include_docs_urls  
from rest_framework.schemas import get_schema_view  
from rest_framework_swagger.renderers import SwaggerUIRenderer, OpenAPICodec  
from AIResume import settings  
from smartresume.views import auth_user_api, platform_user_api, resume_api, job_api  
  
schema_view = get_schema_view(title='智能简历平台接口文档', renderer_classes=[SwaggerUIRenderer, OpenAPICodec])  
  
router = routers.DefaultRouter()  
  
router.register(r'users', auth_user_api.UserViewSet, basename="auth_users_api")  
router.register(r'groups', auth_user_api.GroupViewSet, basename="auth_groups_api")  
router.register(r'platform_users', platform_user_api.PuserViewSet, basename="platform_users_api")  
router.register(r'resumes', resume_api.ResumeViewSet, basename="resume_api")  
router.register(r'jobs', job_api.JobViewSet, basename="job_api")  
urlpatterns = [  
    re_path(r"^static/(?P<path>.*)$", serve, {"document_root": settings.STATIC_ROOT}, name='static'),  # 新增的路径  
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}, name='media'),  
    path(r'', include(router.urls)),  
    path(r'api-auth/', include('rest_framework.urls')),  
    url(r'^admin/', admin.site.urls),  
    path('docs2/', schema_view, name='docs'),  
    path('docs/', include_docs_urls(title='智能简历平台接口文档')),  
]  
  
urlpatterns += router.urls
```

## 2. 视图集中附加 action 的声明

> 在视图集中，如果想要让 Router 自动帮助我们为自定义的动作生成路由信息，需要使用 `rest_framework.decorators.action` 装饰器。
> 
	以 action 装饰器装饰的方法名会作为 action 动作名，与 list、retrieve 等同。

action装饰器可以接收两个参数：

-   **methods**: 声明该action对应的请求方式，列表传递
    
-   **detail**: 声明该action的路径是否与单一资源对应
    
    ```
    路由前缀/<pk>/action方法名/
    ```
    
    -   True 表示路径格式是`xxx/<pk>/action方法名/`
    -   False 表示路径格式是`xxx/action方法名/`
-   url_path：声明该 action 的路由尾缀。

demo：
```python
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

class BookView(ModelViewSet):
    queryset = Book.objects
    serializer_class = BookSerializer
    """
    action装饰器的作用：告诉路由类给视图集的自定义方法生成路由信息
    methods, 列表，允许哪些http请求能访问当前视图方法
    detail，布尔，生成路由时是否拼接pk参数
            detail为True，表示路径名格式应该为 book/{pk}/login/
    url_path，字符串，生成路由时末尾路由路径，如果没有声明，则自动以当前方法名作为路由尾缀
    
    """
    @action(methods=['get'], detail=True,url_path="login")
    def login(self, request,pk):
        """登录"""
        return Response({"msg":request.method})

    # detail为False 表示路径名格式应该为 book/get_new_5/
    @action(methods=['get'], detail=False)
    def get_new_5(self, request):
        """获取最新添加的5本书"""
        ...
```

上述方法自动为此视图集自定义 action 方法形成的路由会是如下内容：
```python
^book/get_new_5/$    name: book-get_new_5
^book/{pk}/login/$   name: book-login
```

---
## 6. 其它组件

### 1. 认证

### 2. 权限

### 3. 限流

### 4. 过滤

### 5. 排序

### 6. 分页

### 7. 异常处理

### 8. 自动生成接口文档





# 参考文献

> <font color="#ff0000">本文参考了一下文档和视频结合个人感悟记录，若有侵权无意冒犯，及时联系进行处理。如果有看不懂本文的，可以移步查看更加详细的教程文档或者观看相关视频，支持原创作者。 </font>

 1. [DRF | YUAN](http://www.yuan316.com/post/DRF/)
 2. [21 DRF应用的认证组件\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1z5411D7BQ/?p=21&spm_id_from=pageDriver&vd_source=9c896fa9c3f9023797e8efe7be0c113e)

{% mmedia "meting" "auto= https://y.qq.com/n/ryqq/song/003kIhRR4Vr0cV.html" "autoplay: true" %}
