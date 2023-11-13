---
title: SpringBoot_Vue项目实战
date: 2023-11-08 13:08:25
tags:
  - SpringBoot
  - vue
  - Mysql
  - Redis
  - RabbiMQ
  - JWT
sticky: 60
excerpt: A Demo for SpringBoot with Vue.
author: 范财胜
---
![](https://picsum.photos/800/250)




## 踩坑

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
8. 


