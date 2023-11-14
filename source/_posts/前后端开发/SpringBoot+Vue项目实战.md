---
title: SpringBoot_Vue项目实战
date: 2023-11-08 13:08:25
tags:
  - SpringBoot
  - Vue
  - Mysql
  - Redis
  - RabbiMQ
  - JWT
sticky: 90
excerpt: A Demo for SpringBoot with Vue.
author: 范财胜
---
# Spingboot+Vue 前后端分离实战项目  
![](https://picsum.photos/800/250)  
## 项目简介  
> 采用 SpringBoot 3 + Vue 3 实现的前后端分离模版项目，集成多种技术栈，并且基于 JWT 校验方案。  
  
## 后端功能  
用户注册、用户登录、重置密码等基础功能以及对应接口  
## 技术栈  
1. 前端  
  
- Vue 前端框架  
- ElementUI 前端 UI 组件库  
- Vue-Router 路由管理  
- Axios 异步请求框架  
- VueUse 适配黑暗模式  
- unplugin-auto-import 按需引入，减少打包后体积  
  
2. 后端  
  
- SpringBoot 后端框架  
- Mybatis 数据持久层框架  
- Redis 验证码存储、限流 IP、请求次数存储  
- Knife 4 j 接口文档生成  
- SpringSecurity 权限认证校验  
- JWT 生成 token 鉴权  
- RabbitMQ 积压邮件发送，由监听器统一处理  
- FastJson 后端统一用 Json 格式返回信息  
- Slf 4 j 日志打印实现  
  
## 核心要点
### 限流
添加如下 filter，此处实现根据 ip 限流 3 秒内请求超过 10 次则限制访问 30 秒：
```java
@Component  
@Order(Const.ORDER_LIMIT)  
public class FlowLimitFilter extends HttpFilter {  
    @Resource  
    StringRedisTemplate stringRedisTemplate;  
    @Override  
    public void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {  
        String ip = request.getRemoteAddr();  
        if (this.limitFlowByIp(ip))  
            chain.doFilter(request, response);  
        else {  
            this.writeBlockMessage(response);  
        }  
    }  
    private void writeBlockMessage(HttpServletResponse response) throws IOException {  
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);  
        response.setContentType("application/json;charset=UTF-8");  
        response.getWriter().write(Result.forbidden("操作频繁，请稍后再试").toJson());  
    }  
    /**  
     * 根据IP进行限流，同一IP三秒内超出10次拉入限流名单30秒     *     * @param ip 限流IP  
     * @return 是否限流布尔值，为真则通过，为假则限制访问  
     */    private boolean limitFlowByIp(String ip) {  
        synchronized (ip.intern()) {  
            String countKey = Const.FLOW_LIMIT_COUNT + ip;  
            String blockKey = Const.FLOW_LIMIT_BLOCK + ip;  
            if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(blockKey))) {  
                return false;  
            } else {  
//            ip限流检查  
                if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(countKey))) {  
                    long increment = Optional.ofNullable(stringRedisTemplate.opsForValue().increment(countKey)).orElse(0L);  
                    if (increment > 10) {  
                        stringRedisTemplate.opsForValue().set(blockKey, "", 30, TimeUnit.SECONDS);  
                        return false;  
                    }  
                } else {  
//                3s内连续请求将计数请求次数进行限流  
                    stringRedisTemplate.opsForValue().set(countKey, "1", 3, TimeUnit.SECONDS);  
                }  
                return true;  
            }  
        }  
    }  
}
```

---
### 接口文档
#### Swagger
springboot 3 使用 swagger 版本接口文档配置：
1. `pom.xml` 引入依赖：
```xml
<!--    Swagger文档生成框架    -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.1.0</version>
        </dependency>
```
2. `application.yml` 配置静态资源：
```yml
springdoc:
  paths-to-match: /api/**
  swagger-ui:
    operations-sorter: alpha
```
3. `SecurityConfiguration.java` 设置接口文档相关静态资源放行:
```java
return http
                .authorizeHttpRequests(conf -> conf
                        .requestMatchers("/api/auth/**", "/error").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .anyRequest().hasAnyRole(Const.ROLE_DEFAULT)
                )
```
4. 添加 `SwaggerConfig.java` swagger 相关配置文件：
```java
/**
 * Swagger开发文档相关配置
 */
@Configuration
@SecurityScheme(type = SecuritySchemeType.HTTP, scheme = "Bearer",
        name = "Authorization", in = SecuritySchemeIn.HEADER)
@OpenAPIDefinition(security = { @SecurityRequirement(name = "Authorization") })
public class SwaggerConfiguration {
    /**
     * 配置文档介绍以及详细信息
     * @return OpenAPI
     */
    @Bean
    public OpenAPI springShopOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("示例项目 API 文档")
                        .description("欢迎来到本示例项目API测试文档，在这里可以快速进行接口调试")
                        .version("1.0")
                        .license(new License()
                                .name("项目开源地址")
                                .url("https://github.com/Ketuer/SpringBoot-Vue-Template-Jwt")
                        )
                )
                .externalDocs(new ExternalDocumentation()
                        .description("我们的官方网站")
                        .url("https://itbaima.net")
                );
    }
    /**
     * 配置自定义的OpenApi相关信息
     * @return OpenApiCustomizer
     */
    @Bean
    public OpenApiCustomizer customerGlobalHeaderOpenApiCustomizer() {
        return api -> this.authorizePathItems().forEach(api.getPaths()::addPathItem);
    }
    /**
     * 登录接口和退出登录接口手动添加一下
     * @return PathItems
     */
    private Map<String, PathItem> authorizePathItems(){
        Map<String, PathItem> map = new HashMap<>();
        map.put("/api/auth/login", new PathItem()
                .post(new Operation()
                        .tags(List.of("登录校验相关"))
                        .summary("登录验证接口")
                        .addParametersItem(new QueryParameter()
                                .name("username")
                                .required(true)
                        )
                        .addParametersItem(new QueryParameter()
                                .name("password")
                                .required(true)
                        )
                        .responses(new ApiResponses()
                                .addApiResponse("200", new ApiResponse()
                                        .description("OK")
                                        .content(new Content().addMediaType("*/*", new MediaType()
                                                .example(RestBean.success(new AuthorizeVO()).asJsonString())
                                        ))
                                )
                        )
                )
        );
        map.put("/api/auth/logout", new PathItem()
                .get(new Operation()
                        .tags(List.of("登录校验相关"))
                        .summary("退出登录接口")
                        .responses(new ApiResponses()
                                .addApiResponse("200", new ApiResponse()
                                        .description("OK")
                                        .content(new Content().addMediaType("*/*", new MediaType()
                                                .example(RestBean.success())
                                        ))
                                )
                        )
                )
        );
        return map;
    }
}
```
#### knife 4 j
springboot 3 使用 knife 4.1.0 版本接口文档配置：
1. `pom.xml` 引入依赖：
```xml
	      <!--        knife4j接口文档模块-->  
	<dependency>  
	    <groupId>com.github.xiaoymin</groupId>  
	    <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>  
	    <version>4.1.0</version>  
	</dependency>
```
2. `application.yml` 配置静态资源:
```yml
	   # springdoc-openapi项目配置，访问地址：http://127.0.0.1:8080/doc.html
	springdoc:  
	  swagger-ui:  
	    path: /swagger-ui.html  
	    tags-sorter: alpha  
	    operations-sorter: alpha  
	  api-docs:  
	    path: /v3/api-docs  
	  group-configs:  
	    - group: 'default'  
	      paths-to-match: '/**'  
	      packages-to-scan: com.example  
	# knife4j的增强配置，不需要增强可以不配  
	knife4j:  
	  enable: true  
	  setting:  
	    language: zh_cn
	``` 
 3. `SecurityConfiguration.java` 设置接口文档相关静态资源放行:
```java
	      return http  
	                .authorizeHttpRequests(conf -> {  
	                    //配置请求路径，允许所有请求  
	                    conf.requestMatchers("/api/auth/**", "/error", "/doc.html", "/webjars/**", "/v3/api-docs/**").permitAll()  
	                            //其他请求需要认证  
	                            .anyRequest().authenticated();  
	                })  
```
4. 添加 `Knife4jConfig.java` knife 4 j 相关配置文件：
```java
/*  
 * Copyright (c) alleyf 2023-11. 适度编码益脑，沉迷编码伤身，合理安排时间，享受快乐生活。 */  
package com.example.config;  
import io.swagger.v3.oas.models.ExternalDocumentation;  
import io.swagger.v3.oas.models.OpenAPI;  
import io.swagger.v3.oas.models.info.Info;  
import io.swagger.v3.oas.models.info.License;  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
@Configuration  
public class Knife4jConfig {  
    @Bean  
    public OpenAPI springShopOpenAPI() {  
        return new OpenAPI()  
                .info(new Info().title("SPDemoGo")  
                        .description("SPDemoGoAPI文档")  
                        .version("v1")  
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")))  
                .externalDocs(new ExternalDocumentation()  
                        .description("外部文档")  
                        .url("https://springshop.wiki.github.org/docs"));  
    }  
}
```

---
### 踩坑
1. redis 本地安装好需要修改配置文件设置 requirepass `password` 密码，才可以在 idea 里远程连接使用。
2. vue 中的 form 表单一定要动态绑定 `:model`，如果添加了字段验证 `:rules`，还必须为每个 `el-form-item` 指定 `prop` 为 `model` 的键。
3. *RabbitMQ 发送 Map*等复杂消息时，需要添加（反）序列化消息转换器，否则刷屏消息转换报错，添加消息转换器步骤如下：
   - 添加 jackson 依赖：
	```xml
	   <!--        jackson-->  
	<dependency>  
	    <groupId>com.fasterxml.jackson.core</groupId>  
	    <artifactId>jackson-databind</artifactId>  
	</dependency>
	```
   - 在 `MailQueueListener` 中注册 `MessageConverter` bean：
	```java
	     @Bean  
	public MessageConverter messageConverterer() {  
	    // 创建一个Jackson2JsonMessageConverter对象  
	    return new Jackson2JsonMessageConverter();  
	}
	```
4. **Bean** 不要被循环或重复导入。
5. 使用 **mybatis** 时由于没有给 `DTO` 实体的**属性添加与数据表对应的字段注释**，因此**属性名必须与字段名**一致。
6. `@RequestParam` 一般用于 **Get** 请求路径传参，`@RequestBody` 一般用于 **Post** 请求 *Json* 传递请求体数据（*也可以用@RequestParam 传参但必须请求头注明 url 编码为表单格式*）。
7. 内部结束 **setInterval** 定时器：
	```js
	const coldTimer = setInterval(() => {  
	  coldTime.value > 0 ? coldTime.value-- : clearInterval(coldTimer)  	}, 1000)
	```
8. *fastjson 2* 在使用时，要注意返回 json 格式化的工具类 `Result` 必须加上`@Data、@AllArgsConstructor` 注解才能使用，否则返回的 json 格式化数据一直为**空（null）**
9. springboot 最大并发数：[SpringBoot 最大连接数及最大并发数是多少？？？ - 知乎](https://zhuanlan.zhihu.com/p/654602186)
```cardlink
url: https://zhuanlan.zhihu.com/p/654602186
title: "SpringBoot 最大连接数及最大并发数是多少？？？"
description: "每个Spring Boot版本和内置容器不同，结果也不同，这里以Spring Boot 2.7.10版本 + 内置Tomcat容器举例。 概序 在SpringBoot2.7.10版本中内置Tomcat版本是9.0.73，SpringBoot内置Tomcat的默认设置如下： Tomcat的…"
host: zhuanlan.zhihu.com
```
## 效果
### 首页
![image.png](http://qnpicmap.fcsluck.top/pics/202311131742836.png)
### 注册
![image.png](http://qnpicmap.fcsluck.top/pics/202311131744814.png)
### 重置密码
![image.png](http://qnpicmap.fcsluck.top/pics/202311131744882.png)
### 黑暗模式
![image.png](http://qnpicmap.fcsluck.top/pics/202311131745890.png)
## 未来计划
- [ ] 实现用户管理
- [ ] 实现权限管理
- [ ] 实现菜单管理
- [ ] 实现日志管理
- [ ] 发挥想象，完善为一个有创意的平台