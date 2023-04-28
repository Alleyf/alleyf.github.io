---
title: SpringBoot启示录
tags: [SpringBoot]
categories: Front_end_development
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

> 需要给视图函数形参中添加注解<font color="#245bdb">@RequestBody</font>

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
