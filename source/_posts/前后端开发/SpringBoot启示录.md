---
title: SpringBoot启示录
tags: [SpringBoot]
categories: Java
date: 2023-04-28 16:37:54
sticky: 75
excerpt: it is some basic usage of SpringBoot .
---

# 1.开发环境热部署

## 1. 说明

> 1. 在实际的项目开发调试过程中会频繁地修改后台类文件，导致需要重新编译、重新启动，整个过程非常麻烦，影响开发效率。
> 2. Spring Boot 提供了 spring-boot-devtools 组件，使得无须手动重启 SpringBoot 应用即可重新编译、启动项目，大大缩短编译启动的时间。devtools 会监听 classpath 下的文件变动，触发 Restart 类加载器重新加载该类,从而实现类文件和属性文件的热部署。
> 3. 并不是所有的更改都需要重启应用 (如静态资源、视图模板)，可以通过设置spring. devtools. restart. exclude 属性来指定一些文件或目录的修改不用重启应用

## 2. 配置

> 在 **pom. xml** 配置文件中添加 **dev-tools 依赖**。
> 使用 **optional=true** 表示依赖**不会传递**，即该项目依赖 devtools; 其他项目如果引入此项目生成的 JAR 包，则不会包含 devtools

### 1.pom. xml

```java
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-devtools</artifactId>
	<optional>true</optional>
</dependency>
```
### 2. application. properties

> 在 application. properties 中配置 **devtools.**
```java
#热部署生效
spring.devtools.restart.enabLed=true
#设置重启目录
spring.devtooLs.restart.additional-paths=src/main/java
#设置classpath目录下的 WEB-INF 文件夹内容修改不重启
spring.devtooLs.restart.exclude=static/**
```

- 如果使用了<span style="background:rgba(240, 200, 0, 0.2)"> Eclipse</span>, 那么在修改完代码并保存之后，项目将自动编译并触发重启，而如果使用了 <span style="background:rgba(160, 204, 246, 0.55)">IntelliJ IDEA</span>, 还需要配置项目自动编译。
- 打开<font color="#245bdb"> Settings </font>页面，在左边的菜单栏依次找到Build, Execution, Deployment-→Compile, 勾选 <font color="#ffc000">Build project automatically</font>
- 按 <font color="#4bacc6">Ctrl+ Shift+ Alt+ /</font>快捷键调出 Maintenance 页面，单击 <font color="#9bbb59">Registry</font>, 勾选<font color="#8064a2">compiler.automake.allow.when.app.running </font>复选框 (可能找不到，修改设置为下图即可解决)。
- 做完这两步配置之后，若开发者再次在 IntelliJ IDEA 中修改代码，则项目会自动重启。

![image.png|425](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/20230428173445.png)

# 2. 控制器

> 1. Spring Boot 提供了<font color="#f79646">@Controller</font> 和<font color="#c0504d">@RestController</font> 两种注解来标识此类负责<span style="background:rgba(240, 107, 5, 0.2)">接收和处理 HTTP 请求</span>。
> 2. 如果请求的是<font color="#00b0f0">页面和数据</font>，使用<font color="#0070c0">@Controller </font>注解即可; 如果只是请求<font color="#ff0000">数据</font>,则可以使用<font color="#c00000">@RestController </font>注解。

## 1.demo
@ RestController 的用法
默认情况下，@RestController 注解会将返回的对象数据转换为 **JSON 格式**。
```java
@RestController
public class HelloController {
	@RequestMapping ("/user")
	public User getUser (){
		User user = new User();
		user.setUsername ("zhangsan");
		user.setPassword ("123") ;
		return user;
	}
}
```

## 2.路由映射

> @RequestMapping 注解主要负责 URL 的路由映射。它可以添加Controller类或者具体的方法上。
> 如果添加在 Controller 类上，则这个 Controller 中的所有路由映射都将会加上此映射规则，如果添加在方法上，则只对当前方法生效。
> @RequestMapping 注解包含很多属性参数来定义 HTTP 的请求映射规则。常用的属性参数如下:
<span style="background:#d3f8b6">- value: 请求 URL 的路径, 支持 URL 模板、正则表达式</span>
<span style="background:#d3f8b6">- method: HTTP 请求方法</span>
- consumes:请求的媒体类型 (Content- Type)，如 application/json
- produces: 响应的媒体类型
<span style="background:#d3f8b6">- params, headers: 请求的参数及请求头的值</span>

### 1. 路由规则

1. @RequestMapping 的 <font color="#0070c0">value </font>属性用于<font color="#0070c0">匹配 URL 映射</font>，value 支持简单表达式
2. @RequestMapping ("/user")
3. @RequestMapping 支持使用通配符匹配 URL，用于统一映射某些 URL 规则类似的请求: @RequestMapping ("/getJson/\*. json"), 当在浏览器中请求/getJson/a.json 或者/getJson/b.json 时都会匹配到后台的 Json 方法
4. @RequestMapping 的通配符匹配非常简单实用，支持**<span style="background:#b1ffff">“\*"  "?" "\*\*"</span>** 等通配符
5. 符号<font color="#ffc000"> "\*" </font>匹配<font color="#ffc000">任意字符</font>，符号 <font color="#00b050">"\*\*"</font> 匹配<font color="#00b050">任意路径</font>，符号<font color="#00b0f0"> "?" </font>匹配<font color="#0070c0">单个字符</font>。有通配符的优先级低于没有通配符的，比如/user/addjson 比/user/* .json 优先匹配。有“\*\*” 通配符的优先级低于有"\*" 通配符的。

### 2. Method 匹配

- HTTP 请求 Method 有 <span style="background:#affad1">GET、POST、 PUT、DELETE </span>等方式。HTTP 支持的全部Method
- @RequestMapping 注解提供了 method 参数指定请求的 Method 类型，包括<span style="background:rgba(205, 244, 105, 0.55)">RequestMethod. GET、RequestMethod. POST、RequestMethod.DELETE、RequestMethod. PUT</span> 等值，分别对应 HTTP 请求的 Method
```java
@RequestMapping (value = "/getData" , method = RequestMethod.GET)
public String getData (){
	return "hello";
}
```
Method 匹配也可以使用<span style="background:rgba(3, 135, 102, 0.2)">@GetMapping、@PostMapping </span>等注解代替。

### 3. 参数传递

#### 1. get 请求

> 视图函数定义 query_params 路由参数，函数体内可以直接获取该参数。

demo：

方式 1 同参（参数可有可无都能成功响应）
```java
@RestController  
public class HelloController {  
// get注解  
@RequestMapping(value = "/index1",method = RequestMethod.GET)
// @GetMapping("/index1")  
public String hello1(String name){  
	return "欢迎您："+name;  
}  
}
```

方式 2 不同参（参数必须携带，否则 400 错误响应）
> 将参数 usrname 映射为 name，默认<font color="#0070c0"> require=true</font>（必须携带参数否则报错），设置为 false 可以<font color="#6425d0">不携带参数访问</font>
> `public String hello2(@RequestParam(value = "usrname",required = false) String name)`
```java
@RequestMapping(value = "/index2",method = RequestMethod.GET)  
// @GetMapping("/index")  
public String hello2(@RequestParam("usrname") String name){  
return "欢迎您："+name;  
}
```

通配符匹配路由：
```java
@GetMapping("test/*")  // 匹配同级任何路由
@GetMapping("test/**")  // 匹配任何路由（包括子级）
public String test() {  
	return "匹配同级任意路径";  
}
```



#### 2.Post 请求


##### 1. urlencode 格式数据

方式 1 直接传数据：
> 适合参数少的情景
```java
@PostMapping("login/")  
	public String login(String name,String pwd){  
	System.out.println("name:"+name);  
	System.out.println("pwd:"+pwd);  
	return name!=null && pwd!=null ? "登陆成功" : "登陆失败";  
}
```

方式 2 对象传数据：
> 适合参数多的情景，<font color="#6425d0">User 为实体类</font>

```java
@PostMapping("login2/")  
public String login2(User user) {  
System.out.println("name:" + user.getUsername());  
System.out.println("pwd:" + user.getPassword());  
System.out.println(user);  
return user.getUsername() != null && user.getPassword() != null ? "登陆成功" : "登陆失败";  
}
```

> [!NOTE] Tips
> <span style="background:#ff4d4f">上述两种方式，发送的 data 数据必须经过 urlencode 编码，否则接收不到。</span>

##### 2. json 格式数据

> 需要给视图函数形参中添加注解<font color="#245bdb">@RequestBody</font>，且 json data 中的参数键名需要与后端中的实体类的属性并一致。

```java
@PostMapping("login3/")  
public String login3(@RequestBody User user) {  
	System.out.println("name:" + user.getUsername());  
	System.out.println("pwd:" + user.getPassword());  
	System.out.println(user);  
	return user.getUsername() != null && user.getPassword() != null ? "登陆成功" : "登陆失败";  
}
```

![image.png|500](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/20230428185132.png)


# 3. 文件上传

## 1. 静态资源访问

1. 使用 IDEA 创建 Spring Boot 项目，会默认创建出 <font color="#245bdb">classpath:/static/</font>目录, 静态资源一般放在这个目录下即可。
2. 如果默认的静态资源过滤策略不能满足开发需求，也可以自定义静态资源过滤策略。
3. 在 <span style="background:#d3f8b6">application. properties </span>中直接定义过滤规则和静态资源位置: 
- `spring.mvc.static-path-pattern=/static/\*\*` 
- `spring.web.resources.static-locations=classpath:/static/`
4. 过滤规则为<font color="#00b0f0">/static/**</font>，静态资源位置为<font color="#00b0f0"> classpath:/static/</font>

```properties
#设置静态路径过滤规则  
spring.mvc.static-path-pattern=images/**  
spring.web.resources.static-locations=classpath:/static/images/
```

## 2. 文件上传

### 1. 文件上传原理

- 表单的<font color="#ffff00"> enctype 属性</font>规定在发送到服务器之前对表单数据的<font color="#ffff00">编码方式</font>。
- 当表单的 enctype="<font color="#ffc000">application/x-www-form-urlencoded</font>" (默认)时,
form 表单中的数据格式为: <font color="#ffc000">key=value&key=value</font>
- 当表单的 enctype="<font color="#00b0f0">multipart/form-data</font>"时，其传输数据形式如下：
![image.png|425](https://s2.loli.net/2023/04/28/jh6pWVrx2yZSB43.png)

### 2. 配置文件大小

- Spring Boot 工程嵌入的 tomcat 限制了请求的文件大小，每个文件的配置最大为 1 Mb，单次请求的文件的总数不能大于 10 Mb.
- 要更改这个默认值需要在配置文件 (如<font color="#00b0f0"> application.properties</font>) 中加入两个配置
```java
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

> 当表单的 enctype= "<font color="#9bbb59">multipart/form-data</font>“时, 可以使用<font color="#9bbb59"> MultipartFile </font>获取上传的文件数据，再通过 <font color="#9bbb59">transferTo </font>方法将其写入到磁盘中

demo：
```java
package com.alleyf.helloworld.controller;  
  
import jakarta.servlet.http.HttpServlet;  
import jakarta.servlet.http.HttpServletRequest;  
import jakarta.servlet.http.HttpServletResponse;  
import org.springframework.web.bind.annotation.PostMapping;  
import org.springframework.web.bind.annotation.RestController;  
import org.springframework.web.multipart.MultipartFile;  
  
import java.io.File;  
import java.io.IOException;  
  
@RestController  
public class FileUploadController {  
@PostMapping("/upload")  
public String upload(String name, MultipartFile avatar, HttpServletRequest request) throws IOException {  
System.out.println(name);  
System.out.println("filename:" + avatar.getOriginalFilename());  
// 获取文件类型  
System.out.println(avatar.getContentType());  
// 获取当前程序运行路径，部署时动态改变  
// String path = request.getServletContext().getRealPath("/upload/");  
// 固定为本地地址便于测试
String path = "E:\\IDEAProjects\\helloworld\\src\\main\\resources\\static\\images\\";  
System.out.println(path);  
saveFile(avatar, path);  
return "上传成功";  
}  
  
private void saveFile(MultipartFile avatar, String path) throws IOException {  
// 获取上传文件夹  
File dir = new File(path);  
// 判断文件夹是否存在，不存在则创建  
if (!dir.exists()) {  
dir.mkdir();  
}  
// 实例化上传文件  
File file = new File(path + avatar.getOriginalFilename());  
System.out.println(file.getPath());  
// 保存上传的文件  
avatar.transferTo(file);  
}  
}
```


## 3. 拦截器

简介：
> 1. 拦截器在 Web 系统中非常常见，对于某些全局统一-的操作，我们可以把它提取到拦截器中实现。总结起来，拦截器大致有以下几种使用场景:
> 2. <font color="#7030a0">权限检查:</font> 如登录检测，进入处理程序检测是否登录，如果没有，则直接返回登录页面。
> 3<font color="#7030a0">. 性能监控: </font>有时系统在某段时间莫名其妙很慢，可以通过拦截器在进入处理程序之前记录开始时间，在处理完后记录结束时间，从而得到该请求的处理时间
> 4. <font color="#548dd4">通用行为: </font>读取 cookie 得到用户信息并将用户对象放入请求，从而方便后续流程使用，还有提取 Locale、Theme 信息等，只要是多个处理程序都需要的，即可使用拦截器实现。


> [!NOTE] tips
> 1. Spring Boot 定义了 <span style="background:#d2cbff">HandlerInterceptor 接口</span>来实现自定义拦截器的功能
> 2. HandlerInterceptor 接口定义了<span style="background:#40a9ff"> preHandle、postHandle、 afterCompletion</span> 三种方法，通过重写这三种方法实现请求前、请求后等操作
![image.png|375](https://s2.loli.net/2023/04/29/dvnpCAF81RxlBK5.png)

### 1. 拦截器定义

> 类似于 django 的<font color="#4bacc6"> Midleware </font>中间件，控制请求。

```java
pub1ic class LoginInterceptor extends HandlerInterceptor {
/**
*在请求处理之前进行调用(Control1er方法调用之前)
*/
@override
pub1ic boolean preHandle(HttpServ1etRequest request, HttpServ1etResponse response, object handTer)
throws Exception {
	if (条件) {
	System.out.print1n("通过");
	return true;
	}else{
	System.out.print1n("不通过");
	return false;
}
}
}

```

> 返回为 true 则进入下一个拦截器，否则拒绝通过。

### 2. 拦截器注册

- <span style="background:#affad1"> addPathPatterns </span>方法定义拦截的地址
- <span style="background:#b1ffff">excludePathPatterns </span>定义排除某些地址不被拦截
- 添加的一个拦截器没有 addPathPattern 任何一个 url 则<font color="#92d050">默认拦截所有请求</font>
- 如果没有 excludePathPatterns 任何一个请求，则<font color="#92cddc">默认不放过任何一个请求</font>

```java
@Configuration  
public class WebConfig implements WebMvcConfigurer {  
@Override  
public void addInterceptors(InterceptorRegistry registry) {  
// 只拦截user路由下的所有路由  
// registry.addInterceptor(new LoginInterceptor()).addPathPatterns("/admin/**");  
// 拦截所有路由  
registry.addInterceptor(new LoginInterceptor());  
  
}  
}
```


# 4. RESTful

## 1.RESTful 介绍

1. HTTP 提供了<font color="#4bacc6"> POST、GET、 PUT、DELETE</font> 等操作类型对某个 Web 资源进行 <font color="#4bacc6">Create、Read、 Update 和 Delete </font>操作。
2. 一个 HTTP 请求除了利用 URI 标志目标资源之外，还需要通过 HTTP Method 指定针对该资源的操作类型，一些常见的 HTTP 方法及其在 RESTful 风格下的使用:

![image.png|425](https://s2.loli.net/2023/04/29/wokjgHNQVc4TCSW.png)

### HTTP 状态码

- HTTP 状态码就是服务向用户返回的状态码和提示信息，客户端的每一次请求，服务都必须给出回应，回应包括<font color="#8064a2"> HTTP 状态码和数据</font>两部分。
- HTTP 定义了 40 个标准状态码，可用于传达客户端请求的结果。状态码分为以下
<font color="#f79646">5 个类别:</font>
> 1 xx: 信息，通信传输协议级信息
> 2 xx: 成功，表示客户端的请求已成功接受
> 3 xx: 重定向，表示客户端必须执行一些其他操作才能完成其请求
> 4 xx: 客户端错误，此类错误状态码指向客户端
> 5 xx: 服务器错误，服务器负责这写错误状态码

## 2. 构建 RESTful 应用接口

Spring Boot 提供的<span style="background:rgba(240, 107, 5, 0.2)"> spring-boot-starter-web </span>组件完全支持开发 RESTful API, 提供了与 REST 操作方式 (GET、POST、 PUT、DELETE) 对应的注解。
1. `@GetMapping:` 处理 GET 请求，获取资源。
2. `@PostMapping:` 处理 POST 请求，新增资源。
3. `@PutMapping:` 处理 PUT 请求，更新资源。
4. `@DeleteMapping:` 处理 DELETE 请求，删除资源。
5. `@PatchMapping:` 处理 PATCH 请求，用于部分更新资源。

> 类似于 django 的视图装饰器

```java
@RestController
public cLass UserController {
@GetMapping("/user/{id}")
public String getUserById (@PathVariable int id){
return "根据ID获取用户";
}
@PostMapping("/user" )
public String save(User user){
return "添加用户";
}
@PutMapping("/user")
public String update(User user){
return "更新用户";
}
@DeleteMapping("/user/{id}")
public String deleteById(@PathVariable int id){
return " 根据ID删除用户";
1}
}

```

## 3. Swagger 生成 API 接口文档

> 1. Swagger 是一个规范和完整的框架，用于生成、描述、调用和可视化 RESTful 风格的 Web 服务，是非常流行的 API 表达工具。
> 2. Swagger 能够自动生成完善的 RESTful API 文档，同时并根据后台代码的修改同步更新，同时提供完整的测试页面来调试 APl。


<font color="#f79646">pom. xml 依赖配置:</font>
```xml
<!-- swagger依赖-->  
<dependency>  
<groupId>io.springfox</groupId>  
<artifactId>springfox-swagger2</artifactId>  
<version>2.9.2</version>  
</dependency>  
<dependency>  
<groupId>io.springfox</groupId>  
<artifactId>springfox-swagger-ui</artifactId>  
<version>2.9.2</version>  
</dependency>
```

添加配置类：
```java
package com.alleyf.helloworld.config;  
  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
import springfox.documentation.builders.ApiInfoBuilder;  
import springfox.documentation.builders.PathSelectors;  
import springfox.documentation.builders.RequestHandlerSelectors;  
import springfox.documentation.service.ApiInfo;  
import springfox.documentation.spi.DocumentationType;  
import springfox.documentation.spring.web.plugins.Docket;  
import springfox.documentation.swagger2.annotations.EnableSwagger2;  
  
@Configuration //告诉Spring容器， 这个类是一个配置类  
@EnableSwagger2 //启用Swagger2功能  
public class SwaggerConfig {  
@Bean  
public Docket createRestApi() {  
return new Docket(DocumentationType.SWAGGER_2)  
.apiInfo(apiInfo())  
.select()  
// com 包下所有API都交给Swagger2管理  
.apis(RequestHandlerSelectors.basePackage("com"))  
.paths(PathSelectors.any()).build();  
}  
  
// API文档页面显示信息  
private ApiInfo apiInfo() {  
return new ApiInfoBuilder()  
.title("演示项目API") //标题  
.description("学习Swagger2的演示项目") //描述  
.version("1.0")  
.build();  
}  
}
```


spring 3 的依赖：
```xml
<!--spring3版本的swagger依赖-->  
<dependency>  
<groupId>org.springdoc</groupId>  
<artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>  
<version>2.0.2</version>  
</dependency>  
  
<dependency>  
<groupId>org.springdoc</groupId>  
<artifactId>springdoc-openapi-starter-webmvc-api</artifactId>  
<version>2.0.2</version>  
</dependency>
```

配置文件：
```java
package com.alleyf.helloworld.config;  
  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
  
import io.swagger.v3.oas.models.OpenAPI;  
import io.swagger.v3.oas.models.info.Info;  
  
  
@Configuration  
public class OpenApiConfig {  
  
@Bean  
public OpenAPI springOpenAPI() {  
return new OpenAPI().info(new Info() //  
.title("SpringDoc API Test") //  
.description("SpringDoc Simple Application Test") //  
.version("0.0.1"));  
}  
  
}
```


### 1.注解

swagger 常用注解如下图所示：

![image.png|375](https://s2.loli.net/2023/05/02/sgfWcYZxHa2rJKm.png)


从 Springfox 迁移过来的，需要修改注解：

<span style="background:rgba(3, 135, 102, 0.2)">> 1. @Api → @Tag</span>
<span style="background:rgba(3, 135, 102, 0.2)">> 2. @ApiIgnore → @Parameter (hidden = true) or @Operation (hidden = true) or @Hidden</span>
<span style="background:rgba(3, 135, 102, 0.2)">> 3. @ApiImplicitParam → @Parameter</span>
<span style="background:rgba(3, 135, 102, 0.2)">> 4. @ApiImplicitParams → @Parameters</span>
<span style="background:rgba(3, 135, 102, 0.2)">> 5. @ApiModel → @Schema</span>
<span style="background:rgba(3, 135, 102, 0.2)">> 6. @ApiModelProperty (hidden = true) → @Schema (accessMode = READ_ONLY)</span>
<span style="background:rgba(3, 135, 102, 0.2)">> 7. @ApiModelProperty → @Schema</span>
<span style="background:rgba(3, 135, 102, 0.2)">> 8. @ApiOperation (value = "foo", notes = "bar") → @Operation (summary = "foo", description = "bar")</span>
<span style="background:rgba(3, 135, 102, 0.2)">> 9. @ApiParam → @Parameter</span>
<span style="background:rgba(3, 135, 102, 0.2)">> 10. @ApiResponse (code = 404, message = "foo") → @ApiResponse (responseCode = "404", description = "foo")</span>

### 2.访问 swagger

1. swagger 2： http://localhost:8080/swagger-ui.html
2. swagger 3: 
	  - http://localhost:8080/swagger-ui/index.html
	  - http://localhost:8080/doc.html

# 5. MybatisPlus

## 1.ORM 介绍

- ORM，（Object Relational Mapping，对象关系映射）是为了解决面向对象与关系数据库存在的互不匹配现象的一种技术。

- ORM 通过使用描述对象和数据库之间映射的元数据将程序中的对象自动持久化到关系数据库中。

- ORM 框架的本质是简化编程中操作数据库的编码。


![image.png|350](https://s2.loli.net/2023/05/29/PcG5L8ZYouWhyp6.png)


## 2.MyBatis-Plus 介绍

- MyBatis 是一款优秀的数据持久层 ORM 框架，被广泛地应用于应用系统。
- MyBatis 能够非常灵活地实现动态 SQL，可以使用 XML 或注解来配置和映射原生信息，能够轻松地将 Java 的 POJO（PlainOrdinaryJavaObject，普通的Java 对象）与数据库中的表和字段进行映射关联。
- MyBatis-Plus 是一个 MyBatis 的增强工具，在 MyBatis 的基础上做了增强，简化了开发。

<font color="#8db3e2">添加依赖：</font>

```java
<! MyBatisPlus依赖
<dependency>
   <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.2</version>
</dependency>
<!--mysql驱动依赖
<dependency>
    <groupId>mysql</groupId>
     <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>
<!-- 数据连接池druid
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.1.20</version>
</dependency>
```

<font color="#f79646">全局配置：</font>
- 配置数据库相关信息（application.properties）：

```java
spring.datasource.type=com.alibaba.druid.pool.DruidDatasource
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.ur1=jdbc:mysql://1ocalhost:3306/mydb?usessL=false
spring.datasource.username=root
spring.datasource.password=123456
mybatis-plus.configuration.1og-impl=org.apache.ibatis.logging.stdout.stdoutImp1

```

- 添加@MapperScan 注解：

```java
@springBootApplication
@Mapperscan("com.xx.mapper")
public class MybatisplusDemoApplication 
   public static void main(string[] args){
       SpringApplication.run(MybatisplusDemoApplication.class,args);

```

Mybitis CRUD 注解：
注解功能
<font color="#00b0f0">@Insert     实现插入</font>
<font color="#00b0f0">@Update   实现更新</font>
<font color="#00b0f0">@Delete    实现删除</font>
<font color="#00b0f0">@Select    实现查询</font>
<font color="#00b0f0">@Result    实现结果集封装</font>
<font color="#00b0f0">@Results  可以与@Result 一起使用，封装多个结果集</font>
<font color="#00b0f0">@One       实现一对一结果集封装</font>
<font color="#00b0f0">@Many     实现一对多结果集封装</font>



## 3.MyBatis-Plus CRUD 操作


<font color="#ffc000">mybatis 的 Mapper 操作方法</font>
```java
@Mapper
public interface UserMapper {
   @Insert("insert into user values(#{id),#(username},#(password),#(birthday)")//id,username等属性为user对象的属性
    int add(User user);

   @update("update user set username=#(username},password=#(password),birthday=#(birthday} where id=#{id}")
    int update(User user);

   @Delete("delete from user where id=#(id")
    int delete(int id);

   @select("select * from user where id=#(id")
   User findByid(int id);

   @select("select * from user")
   List<User> getA11();
```


<font color="#ff0000">mybatis-plus 的操作方法</font>
> BaseMapper 泛型类里已经实现了基本的增删改查任务
```java
@Mapper  
public interface UserMapper extends BaseMapper<User> {  
}

```

> [!NOTE] 注意
> Mybatis-plus 有一些对 entity 里的实体类的**注解**，标识对应的表名、主键和字段名等，如果不进行注解则实体类的类名必须与数据表名一致，属性必须与数据表的字段名一致。
[注解细节](https://baomidou.com/pages/24112f/#特性)


## 4. 多表查询

> 实现复杂关系映射，可以使用@Results 注解，@Result 注解，@One 注解，
> @Many 注解组合完成复杂关系的配置。

![注解说明|325](https://s2.loli.net/2023/06/01/Z6TuNLREyqGFazH.png)


示例：
**任务表**

entity：
```java
package com.alleyf.airesume.entity;  
  
import com.baomidou.mybatisplus.annotation.IdType;  
import com.baomidou.mybatisplus.annotation.TableField;  
import com.baomidou.mybatisplus.annotation.TableId;  
import com.baomidou.mybatisplus.annotation.TableName;  
  
import java.sql.Date;  
import java.time.LocalDateTime;  
  
@TableName(value = "u_task")  
public class Task {  
    @TableId(value = "id", type = IdType.AUTO)  
    private int id;  
    private int uid;  
    private String name;  
    private String content;  
    @TableField(value = "b_date")  
    private LocalDateTime b_date;  
    @TableField(value = "e_date")  
    private LocalDateTime e_date;  
    @TableField(exist = false)  
    private User user;  
}

```

Mapper：
```java
@Mapper  
public interface TaskMapper extends BaseMapper<Task> {  
    @Select("select * from task where uid = #{uid}")  
    List<Task> selectByUid(int uid);  

	@Select("select * from task")  
@Results(  
        {  
                @Result(column = "id", property = "id"),  
                @Result(column = "name", property = "name"),  
                @Result(column = "content", property = "content"),  
                @Result(column = "b_date", property = "b_date", javaType = LocalDateTime.class, jdbcType = JdbcType.TIMESTAMP),  
                @Result(column = "e_date", property = "e_date", javaType = LocalDateTime.class, jdbcType = JdbcType.TIMESTAMP),  
                @Result(column = "uid", property = "user", javaType = User.class,  
                        one = @One(select = "com.alleyf.airesume.mapper.UserMapper.selectById")),  
        }  
)  
List<Task> queryAllTaskAndUser();
}
```

**用户表**

entity：
```java
package com.alleyf.airesume.entity;  
  
import com.baomidou.mybatisplus.annotation.IdType;  
import com.baomidou.mybatisplus.annotation.TableField;  
import com.baomidou.mybatisplus.annotation.TableId;  
import com.baomidou.mybatisplus.annotation.TableName;  
  
import java.util.List;  
  
@TableName(value = "user")  
public class User {  
    @TableId(value = "id", type = IdType.AUTO)  
    private int id;  
    private String username;  
    private String password;  
    @TableField(exist = false)  
    private List<Task> tasks;  
}

```

mapper：
```java
public interface UserMapper extends BaseMapper<User> {  
  
    @Select("select * from user")  
    @Results(  
            {  
                    @Result(column = "id", property = "id"),  
                    @Result(column = "username", property = "username"),  
                    @Result(column = "password", property = "password"),  
                    @Result(column = "id", property = "tasks", javaType = List.class,  
                            many = @Many(select = "com.alleyf.airesume.mapper.TaskMapper.selectByUid")),  
            }  
    )  
    List<User> queryAllUserAndTasks();  
}

```



> [!NOTE] 注意
> 查询用户的同时查出与用户相关联的所有任务
> Result 中的 column 的字段为查询到的数据库字段值，用来赋值给后面类对象的属性 property，对应的属性与字段相同，含有不存在的属性则使用外键间接查询。


## 5. 条件查询

<span style="background:#affad1">Mybatis 实现：</span>

> 在 mapper 的接口中写 sql 语句进行条件查询。

示例：
mapper：
```java
/**  
 * 按照任务名查询用户 * * @param username 用户名  
 * @return 所有用户列表  
 */@Select("select * from user where username = #{username}")  
@Results({  
        @Result(column = "id", property = "id"),  
        @Result(column = "username", property = "username"),  
        @Result(column = "password", property = "password"),  
        @Result(column = "id", property = "tasks", javaType = List.class,  
                many = @Many(select = "com.alleyf.airesume.mapper.TaskMapper.selectByUid")),  
})  
User selectByName(String username);

```

controller：
```java
    @ApiOperation("按照用户名查询用户")  
    @GetMapping("/queryByMName")  
    public User queryByMName(@RequestParam("username") String username) {  
//        return userMapper.selectList(null);  
        return userMapper.selectByName(username);  
    }

```

<span style="background:rgba(136, 49, 204, 0.2)">Mybatis-Plus 实现：</span>

> - 使用 **QueryWrapper** （条件查询）和 **UpdateWrapper**（条件更新） 两个条件查询类进行条件查询。
> - 可选条件有：eq（等于），lt（大于），st（小于），le（大于等于），se（小于等于）等

示例：

```java
@ApiOperation("按照用户名查询用户(MP)")  
@GetMapping("/queryByMPName")  
public User queryByMPName(@RequestParam("username") String username) {  
    return userMapper.selectOne(new QueryWrapper<User>().eq("username", username));  
}

```


## 6. 分页查询

编写配置文件

```java
package com.alleyf.airesume.config;  
  
import com.baomidou.mybatisplus.annotation.DbType;  
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;  
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
  
@Configuration  
public class PaginationConfig {  
    @Bean  
    public MybatisPlusInterceptor paginationInterceptor() {  
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();  
        PaginationInnerInterceptor paginationInterceptor = new PaginationInnerInterceptor(DbType.MYSQL);  
        interceptor.addInnerInterceptor(paginationInterceptor);  
        return interceptor;  
    }  
}

```

controller:

```java
//查询所有用户：1oca1host：8080/findA11
@GetMapping("findAll")
public IPage findAl1()t
   //设置起始值及每页条数
   Page<User> page = new Page<>(0,2);
   return userMapper.selectPage(page,nul1);

@ApiOperation("按照页码查询用户(MP)")  
@GetMapping("/queryByPage/{page}")  
public IPage queryByPage(@PathVariable("page") int page) {  
    Page<User> page1 = new Page<>(page, 5);  
    IPage iPage = userMapper.selectPage(page1, null);  
    return iPage;  
}

```


# 6.Vue 框架快速上手

[[Vue]]

## 1. 前端环境准备
Vscode 或者WebStorm


## 2.Vue 框架介绍

尤雨溪制作的渐进式 js 框架

## 3.Vue 快速入门

   - 导入 vue. js 的 script 脚本文件

 `<script src="https://unpkg.com/vue@next"></script>`

   - 在页面中声明一个将要被 vue 所控制的 DOM 区域，既 MVVM 中的 View

	`<div id="app">
	  {{ message }}
	</div>`

   - 创建 vm 实例对象 (vue 实例对象)

`const hello = {
   //指定数据源，既 MVVM 中的 Mode1
   data: function () {
      return {
         message: 'Hello Vue!'
      }
}
const app = Vue.createApp (hello)
app. mount（' #app '）/／指定当前 vue 实例要控制页面的哪个区域`










# 参考文献

1. [1天搞定SpringBoot+Vue全栈开发\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1nV4y1s7ZN/)
2. [Springdoc和Springfox](https://blog.csdn.net/javaDeveloper2010/article/details/129119489)
