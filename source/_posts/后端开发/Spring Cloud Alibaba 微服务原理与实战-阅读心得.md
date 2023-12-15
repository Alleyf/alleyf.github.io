---
title: Spring Cloud Alibaba 微服务原理与实战-阅读心得
date: 2023-11-28 14:41:00
tags:
  - SpringCloud-Alibaba
  - 微服务
  - Java
sticky: 95
excerpt: 关于springcloud-alibaba微服务和中间件的阅读收获。
author: 范财胜
index_img: https://picsum.photos/800/250
lang: zh-CN
keywords:
  - SpringCloud-Alibaba
  - 微服务
  - Java
header-left: "![](D:/开发图片/logo32.png)"
---




<div style="page-break-after:always;"></div>





![](https://picsum.photos/0/700)

# 第一章、微服务发展史
## 单体架构到分布式架构的演变
### 单体架构
通常来说，如果一个 war 包或者 jar 包里面包含一个应用的所有功能，则我们称这种架构为单体架构。

### 集群及垂直化
**单体架构的局限**：

1. 用户量越来越大，网站的访问量不断增大，导致后端服务器的负载越来越高。
2. 用户量大了，产品需要满足不同用户的需求来留住用户，使得业务场景越来越多并且越来越复杂。

**优化方法：**

1. 通过横向增加服务器，把单台机器变成多台机器的集群。
2. 按照业务的垂直领域进行拆分，减少业务的耦合度，以及降低单个 war 包带来的伸缩性困难问题。
![|700](http://qnpicmap.fcsluck.top/pics/202311281458557.png)

总的来说，数据库层面的拆分思想和业务系统的拆分思想是一样的，都是采用==分而治之==的思想。

### SOA
共享业务在多个场景中存在冗余维护困难，就引入了 SOA(Service-Oriented Architecture),也就是面向服务的架构，从语义上说，它和面向过程、面向对象、面向组件的思想是一样的，都是一种软件组建及开发的方式。核心目标是把一些通用的、会被多个上层服务调用的共享业务提取成独立的基础服务，这些被提取出来的共享服务相对来说比较独立，并且可以重用。所以在 SOA 中，服务是最核心的抽象手段，业务被划分为一些粗粒度的业务服务和业务流程。

**解决问题：**

- 信息孤岛
- 共享业务的重用

![|425](http://qnpicmap.fcsluck.top/pics/202311281505375.png)

### 微服务架构
SOA 和微服务的关注点不同，区别如下所示：

- **SOA** 关注的是**服务的重用性及解决信息孤岛**问题。
- **微服务**关注的是**解耦**，虽然解耦和可重用性从特定的角度来看是一样的，但本质上是有区别的，*解耦是降低业务之间的耦合度，而重用性关注的是服务的复用*。
- 微服务会更多地关注在 DevOps 的持续交付上，因为服务粒度细化之后使得开发运维变得更加重要，因此*微服务与容器化技术的结合更加紧密*。

实际上，微服务到底要*拆分到多大的粒度没有统一的标准*，更多的时候是需要在粒度和团队之间找平衡的，微服务的粒度越小，服务独立性带来的好处就越多，但是管理大量的微服务也会越复杂。

![|425](http://qnpicmap.fcsluck.top/pics/202311281523574.png)


## 微服务架构带来的挑战
### 微服务架构的优点
1. **复杂度可控**：通过对共享业务服务更细粒度的拆分，一个服务只需要关注一个特定的业务领域，并通过定义良好的接口清晰表述服务边界。由于体积小、复杂度低，开发、维护会更加简单。
2. **技术选型更灵活**：每个微服务都由不同的团队来维护，所以可以结合业务特性自由选择技术栈。
3. **可扩展性更强**：可以根据每个微服务的性能要求和业务特点来对服务进行灵活扩展,比如通过增加单个服务的集群规模，提升部署了该服务的节点的硬件配置。
4. **独立部署**：由于每个微服务都是一个独立运行的进程，所以可以实现独立部署。当某个微服务发生变更时不需要重新编译部署整个应用，并且单个微服务的代码量比较小，使得发布更加高效。
5. **容错性**：在微服务架构中，如果某一个服务发生故障，我们可以使故障隔离在单个服务中。其他服务可以通过重试、降级等机制来实现应用层面的容错。

### 面临的挑战
1. **故障排查**：一次请求可能会经历多个不同的微服务的多次交互，交互的链路可能会比较长，每个微服务会产生自己的日志，在这种情况下如果出现一个故障，开发人员定位问题的根源会比较困难。
2. **服务监控**：在一个单体架构中很容易实现服务的监控，因为所有的功能都在一个服务中。在微服务架构中，服务监控开销会非常大，可以想象一下，在几百个微服务组成的架构中，我们不仅要对整个链路进行监控，还需要对每一个微服务都实现一套类似单体架构的监控。
3. **分布式架构的复杂性**：微服务本身构建的是一个分布式系统，分布式系统涉及服务之间的远程通信，而网络通信中网络的延迟和网络故障是无法避免的，从而增加了应用程序的复杂度。
4. **服务依赖**：微服务数量增加之后，各个服务之间会存在更多的依赖关系，使得系统整体更为复杂。假设你在完成一个案例，需要修改服务 A、B、C,而 A 依赖 B,B 依赖 C。在单体式应用中，你只需要改变相关模块，整合变化，再部署就好了。对比之下，微服务架构模式就需要考虑相关改变对不同服务的影响。比如，你需要更新服务 C,然后是 B,最后才是 A,幸运的是，许多改变一般只影响一个服务，需要协调多服务的改变很少。
5. **运维成本**：在微服务中，需要保证几百个微服务的正常运行，对于运维的挑战是巨大的比如单个服务流量激增时如何快速扩容、服务拆分之后导致故障点增多如何处理、如何快速部署和统一管理众多的服务等。


## 如何实现微服务架构
架构的本质是对系统进行*有序化重构*，使系统不断进化。在这个进化的过程中除了更好地支撑业务发展，也会带来非常多的挑战，譬如在前文中提到的微服务的挑战，为了解决这些问题就必须引入更多的技术，进而使得微服务架构的实现变得非常复杂。

### 微服务架构图
 微服务架构图通常由多个服务组成，每个服务都是一个独立的单元，负责执行特定的业务功能。这些服务之间通过网络进行通信，并使用轻量级的传输协议（如 HTTP 或 RPC）进行交互。
 ![|500](http://qnpicmap.fcsluck.top/pics/202311281557440.png)

下面是一个简单的微服务架构图示例：
 ```mermaid
graph LR
A[网关] --> B[认证服务]
A --> C[用户服务]
A --> D[订单服务]
B --> E[数据库]
C --> E
D --> E
 ```

其中，网关（Gateway）是整个系统的入口，认证服务（Authentication Service）、用户服务（User Service）和订单服务（Order Service）是三个不同的微服务，它们之间通过网关进行通信。数据库（Database）用于存储数据，被认证服务、用户服务和订单服务共享。

### 微服务架构下的技术挑战
微服务架构主要的目的是实现业务服务的解耦。随着公司业务的高速发展，微服务组件会越来越多，导致服务与服务之间的调用关系越来越复杂。同时，服务与服务之间的远程通信也会因为网络通信问题的存在变得更加复杂，比如需要考虑重试、容错、降级等情况。那么这个时候就需要进行**服务治理**，将服务之间的依赖转化为服务对服务中心的依赖。除此之外，还需要考虑：

- ==分布式配置中心==。
- ==服务路由==。
- ==负载均衡==。
- ==熔断限流==。
- ==链路监控==。


# 第二章、微服务解决方案之 Spring Cloud
## 什么是 Spring Cloud
简单来说，Spring Cloud 提供了一些可以让开发者快速构建微服务应用的工具，比如配置管理、服务发现、熔断、智能路由等，这些服务可以在任何分布式环境下很好地工作。Spring Cloud 主要致力于解决如下问题：

- Distributed/versioned configuration,分布式及版化配置。
- Service registration and discovery,服务注册与发现。
- Routing,服务路由。
- Service-to-service calls,服务调用。
- Load balancing,负载均衡。
- Circuit Breakers,断路器。
- Global locks,全局锁。
- Leadership election and cluster state,Leader 选举及集群状态。
- Distributed messaging,分布式消息。

<font color="#a5a5a5">需要注意的是，Spring Cloud 并不是 Spring 团队全新研发的框架，它只是把一些比较优秀的解决微服务架构中常见问题的开源框架基于 Spring Cloud 规范进行了整合，通过 Spring Boot 这个框架进行再次封装后屏蔽掉了复杂的配置，给开发者提供良好的开箱即用的微服务开发体验。不难看出，Spring Cloud 其实就是一套规范，而 Spring Cloud Netflix、Spring Cloud Consul、Spring Cloud Alibaba 才是 Spring Cloud 规范的实现。</font>


## Spring Cloud Netflix

Spring Cloud Netflix 主要为微服务架构下的服务治理提供解决方案，包括以下组件：

- Eureka,服务注册与发现。
- Zuul,服务网关。（不在进行更新维护->Spring Cloud GateWay）
- Ribbon,负载均衡。（不在进行更新维护->Spring Cloud Loadbalancer）
- Feign,远程服务的客户端代理。
- Hystrix,断路器，提供服务熔断和限流功能。（不在进行更新维护->Resitience4j）
- Hystrix Dashboard,监控面板。（不在进行更新维护->Micrometer Monitoring System）
- Turbine,将各个服务实例上的 Hystrix 监控信息进行统一聚合。


## Spring Cloud Alibaba
Spring Cloud Alibaba 主要为微服务开发提供一站式的解决方案，使开发者通过 Spring Cloud 编程模型轻松地解决微服务架构下的各类技术问题。以下是 Spring Cloud Alibaba 生态下的主要功能组件，这些组件包含开源组件和阿里云产品组件，云产品是需要付费使用的。

- Sentinel,流量控制和服务降级。
- Nacos,服务注册与发现。
- Nacos,分布式配置中心。
- RocketMO,消息驱动。
- Seate,分布式事务。
- Dubbo,RPC 通信。
- OSS,阿里云对象存储（收费的云服务）。

### 优势
相对于 Spring Cloud Netflix 来说，它的优势有很多，简单整理了以下两点：

- Alibaba 的开源组件在没有织入 Spring Cloud 生态之前，已经在各大公司广泛应用，所以集成到 Spring Cloud 生态使得开发者能够很轻松地实现技术整合及迁移。Dubbo 天然支持多协议，因此在迁移和改造过程中并没有投入太多的成本。
- Alibaba 的开源组件在服务治理上和处理高并发的能力上有天然的优势，相比 Spring CloudNetflix 来说，Spring Cloud Alibaba 在服务治理这块的能力更适合于国内的技术场景，同时，Spring Cloud Alibaba 在功能上不仅完全覆盖了 Spring Cloud Netflix 原生特性，而且还提供了更加稳定和成熟的实现，因此笔者很看好 Spring Cloud Alibaba 未来的发展。

### 组件对比

|    组件    | Spring Cloud                                 | Spring Cloud Netflix                   | Spring Cloud Alibaba |
|:----------:| -------------------------------------------- | -------------------------------------- | -------------------- |
|  注册中心  | **Service Registry  <br>Service Discovery**  | Eureka 1.x  <br>Eureka 2.x（停止维护） | **Nacos**            |
|  配置中心  | Spring Cloud Config  <br>Git/ JDBC/ Vault... | Archaius（停止维护）                   | **Nacos**            |
|  服务容错  | **Spring Cloud Circuit Breaker**             | Hystrix（停止维护）                    | **Sentinel**         |
|  服务调用  | **Spring Cloud OpenFeign  <br>RestTemplate** | Feign                                  | **Dubbo**            |
|  负载均衡  | **Spring Cloud LoadBalancer**                | Ribbon（停止维护）                     | **Dubbo**            |
|  服务网关  | **Spring Cloud Gateway**                     | Zuul（停止维护）                       | **Dubbo**            |
|  消息队列  | **Spring Cloud Stream**  <br>RabbitMQ/ Kafka |                                        | **RocketMQ**         |
|  链路追踪  | **Spring Cloud Sleuth**                      |                                        |                      |
| 分布式事务 |                                              |                                        | **Seata**            |


# 第三章、Spring Cloud 的核心之 Spring Boot

简单来说，Spring Boot 是帮助开发者快速构建一个基于 Spring Framework 及 Spring 生态体系的应用解决方案，也是 Spring Framework 对于“约定优于配置(Convention over Configuration)”理念的最佳实践。

## 重新认识 SpringBoot


### Spring IoC/DI

IoC(Inversion of Control)和 DI(Dependency Injection)的全称分别是**控制反转和依赖注入**。

**IoC**

IoC(控制反转)实际上就是把对象的生命周期托管到 Spig 容器中，而反转是指对象的获取方式被反转了，直接从 IoC 容器中获取对象而不需要 new 一个对象。

![|425](http://qnpicmap.fcsluck.top/pics/202311291040243.png)

**DI**

DI(Dependency Inject),也就是依赖注入，简单理解就是 IoC 容器在运行期间，动态地把某
种依赖关系注入组件中。

只需要在 Spring 的配置文件中描述 Bean 之间的依赖关系，IoC 容器在解析该配置文件的时候，会根据 Ban 的依赖关系进行注入，这个过程就是依赖注入。

xml 配置 bean 和依赖关系
```xml
<bean id="user"class="User">
	<property name="userDetail"ref="userDetail"/>
</bean>
<bean id="userDetail"class="UserDetail"/>
```

依赖自动注入到 bean 对象，直接获取 bean 实例
```java
ApplicationContext context=new FileSystemXmlApplicationcontext("...");
User user=context.getBean(User.class);
UserDetail userdetail=user.getUserDetail()
```

> 实现依赖注入的方法有三种，分别是*接口注入、构造方法注入和 setter 方法注入*。不过现在基本上都基于注解的方式来描述 Bean 之间的依赖关系，比如 `@Autowired、@Inject和@Resource`。

### Bean 装配方式的升级

随着 JDK1.5 带来的注解支持，Spring 从 2.x 开始，可以使用注解的方式来对 Bean 进行声明和注入，大大减少了 XML 的配置量。

Spring 升级到 3.x 后，提供了 JavaConfig 的能力，它可以完全取代 XML,通过 Java 代码的方式来完成 Bean 的注入。所以，现在我们使用的 Spring Framework 或者 Spring Boot,已经看不到 XML 配置的存在了。

**注解配置**

基于 JavaConfig 的配置形式，可以通过@Bean 注解来将一个对象注入 IoC 容器中，默认情况下采用方法名称作为该 Bean 的 id。
```java
@Configuration
public class SpringConfigclass{
	@Bean
	public BeanDefine beanDefine(){
		return new BeanDefine();
	}
}
```

**依赖注入**

在 JavaConfig 中，可以这样来表述：
```java
@Configuration
public class SpringConfigclass{
	@Bean
	public BeanDefine beanDefine(){
	BeanDefine beanDefine=new BeanDefine();
	beanDefine.setDependencyBean(dependencyBean());
	return beanDefine;
	}
	@Bean
	public DependencyBean dependencyBean(){
	return new DependencyBean();
	}
}
```

**其他常见配置**

- `@ComponentScan` 对应 XML 形式的 `<context:component-scan base-package-=""/>`,它会扫描指定包路径下带有 `@Service、@Repository、@Controller、@Component` 等注解的类，将这些类装载到 IoC 容器。
- `@Import` 对应 XML 形式的 `<import resource=""/>`,导入其他的配置文件。

虽然通过注解的方式来装配 Bean,可以在一定程度上减少 XML 配置带来的问题，从某一方面来说它只是*换汤不换药*，本质问题仍然没有解决，比如：

- **依赖过多**。Spring 可以整合几乎所有常用的技术框架，比如 JSON、MyBatis、Redis、Log 等，不同依赖包的版本很容易导致版本兼容的问题。
- **配置太多**。以 Spring 使用 JavaConfig 方式整合 MyBatis 为例，需要配置注解驱动、配置数据源、配置 MyBatis、配置事物管理器等，这些只是集成一个技术组件需要的基础配置，在一个项目中这类配置很多，开发者需要做很多类似的重复工作。
- **运行和部署很烦琐**。需要先把项目打包，再部署到容器上。

<font color="#a5a5a5">如何让开发者不再需要关注这些问题，而专注于业务呢？好在，Spring Boot 诞生了。</font>

### Spring Boot 的价值

**如何理解约定优于配置**

*约定优于配置(Convention Over Configuration)是一种软件设计范式，目的在于减少配置的数量或者降低理解难度，从而提升开发效率*。

在 Spring Boot 中，约定优于配置的思想主要体现在以下方面（包括但不限于）：

- Maven 目录结构的约定。
- Spring Boot 默认的配置文件及配置文件中配置属性的约定。
- 对于 Spring MVC 的依赖，自动依赖内置的 Tomcat 容器。
- 对于 Starter 组件自动完成装配。

**Spring Boot 的核心**

Spring Boot 是基于 Spring Framework 体系来构建的，所以它并没有什么新的东西，但是要想学好 Spring Boot,必须知道它的核心：

- Starter 组件，提供开箱即用的组件。
- 自动装配，自动根据上下文完成 Bean 的装配。
- Actuator,Spring Boot 应用的监控。
- Spring Boot CLI,基于命令行工具快速构建 Spring Boot 应用。

其中，最核心的部分应该是**自动装配**，Starter 组件的核心部分也是基于自动装配来实现的。

## 快速构建 SpringBoot 应用

构建 Spring Boot 应用的方式有很多，比如在 https:/start.spring.io 或者 https://start.aliyun.com/ 网站上可以通过图形界面来完成创建。如果大家使用 IntelliJ IDEA 这个开发工具，就可以直接在这个工具上来创建 Spring Boot 项目，默认也是使用 https:/start.spring.io 来构建的。

构建完成后会包含以下核心配置和类。

1. Spring Boot 的启动类 SpringBootDemoApplication:

```java
@SpringBootApplication
public class SpringBootDemoApplication{
	public static void main(String[]args){
	SpringApplication.run(SpringBootDemoApplication.class,args);
	}
}
```

2. resource 目录，包含 static 和 templates 目录，分别存放静态资源及前端模板，以及 application.properties 配置文件。
3. Web 项目的 starter 依赖包：
```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

在不做任何改动的情况下，可以直接运行 SpringBootDemoApplication 中的 main 方法来启动 Spring Boot 项目。当然，由于默认情况下没有任何 URI 映射，所以看不出效果，我们可以增加一个 Controller 来发布 Restful 接口，代码如下：

 ```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class SpringBootDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootDemoApplication.class, args);
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello World!";
    }
}
 ```

当我们运行主类的 main 方法后，Spring Boot 会自动扫描并加载所有带有@Controller 或@RestController 注解的类，并根据其注解配置创建相应的 Bean。此时，我们可以通过访问 http://localhost:8080/hello 来调用刚刚定义的接口，返回结果为"Hello World!"。

> :LiQuote: 以往我们使用 Spring MVC 来构建一个 Web 项目需要很多基础操作：添加很多的 Jar 包依赖、在 web.xml 中配置控制器、配置 Spring 的 XML 文件或者 JavaConfig 等。而 Spring Boot 帮开发者省略了这些烦琐的基础性工作，使得开发者只需要关注业务本身，基础性的装配工作是**由 Starter 组件及自动装配**来完成的。


## SpringBoot 自动装配原理

简单来说，就是自动将 Bean 装配到 IoC 容器中，接下来，我们通过一个 Spring Boot 整合 Redis 的例子来了解一下自动装配。

- 添加 Starter 依赖：
```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

- 在 application.properties 中配置 Redis 的数据源：
```yml
spring:
	redis:
		host: localhost
		port: 6379
```

- 在 HelloController 中使用 RedisTemplate 实现 Redis 的操作：
```java
@RestController
public class HelloController{
	@Autowired
	RedisTemplate<String,String> redisTemplate;
	@GetMapping("/hello")
	public String hello(){
		redisTemplate.opsForValue().set("key","value");
		return "Hello World";
	}
 }
```

在这个案例中，我们*并没有通过 XML 形式或者注解形式把 RedisTemplate 注入 IoC 容器*中，但是在 HelloController 中却*可以直接使用@Autowired 来注入 redisTemplate 实例*，这就说明，IoC 容器中已经存在 RedisTemplate，这就是 Spring Boot 的自动装配机制。

在往下探究其原理前，可以大胆猜测一下，如何*只添加一个 Starter 依赖，就能完成该依赖组件相关 Bean 的自动注入*？不难猜出，这个机制的实现一定基于某种约定或者规范，只要 Starter 组件符合 Spring Boot 中自动装配约定的规范，就能实现自动装配。

### 自动装配的实现

自动装配在 Spring Boot 中是通过 `@EnableAutoConfiguration` 注解来开启的，这个注解的声明在启动类注解@SpringBootApplication 内。

进入@SpringBootApplication 注解，可以看到@EnableAutoConfiguration 注解的声明。
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)}
)
public @interface SpringBootApplication { ...
```


> - @Target({ElementType.TYPE})：指定该注解可以放置在类上。 
> - @Retention(RetentionPolicy.RUNTIME)：指定该注解的保留策略为运行时，即在编译后仍然存在。 
> - @Documented：指示被注解的元素应该在 API 文档中被记录。 
> - @Inherited：指示此注解类型是继承性的，即如果将其放置在父类上，则子类上可以省略该注解。 
> - @SpringBootConfiguration：指示该类是一个 Spring Boot 配置类。 
> - @EnableAutoConfiguration：启用自动配置功能，根据已导入的依赖和应用程序的代码来自动配置 Spring 应用程序。 
> - @ComponentScan：指定要扫描的组件包，以发现和注册 Bean 定义。 
> - excludeFilters：指定要排除的过滤器。 
> - @Filter：自定义过滤器。 
> - type = FilterType.CUSTOM：指定过滤器类型为自定义。 
> - classes={TypeExcludeFilter.class}：指定过滤器所实现的类为 TypeExcludeFilter。 
> - @Filter：自定义过滤器。 
> - type = FilterType.CUSTOM：指定过滤器类型为自定义。 
> - classes = {AutoConfigurationExcludeFilter.class}：指定过滤器所实现的类为 AutoConfigurationExcludeFilter。

这里简单和大家讲解一下@Enable 注解。其实 Spring3.I 版本就己经支持@Enable 注解了，它的主要作用把相关组件的 Bean 装配到 IoC 容器中。@Enable 注解对 JavaConfig 的进一步完善，为使用 Spring Framework 的开发者减少了配置代码量，降低了使用的难度。比如常见的@Enable 注解有@EnableWebMvc、@EnableScheduling 等。

在前面的章节中讲过，如果基于 JavaConfig 的形式来完成 Bean 的装载，则必须要使用@Configuration 注解及@Bean 注解。而@Enable 本质上就是针对这两个注解的封装，所以大家如果仔细关注过这些注解，就不难发现这些注解中都会携带一个@Import 注解，比如：
```java
@EnableScheduling:
@Target({ElementType.TYPE))
@Retention(RetentionPolicy.RUNTIME)
@Import({SchedulingConfiguration.class})
@Documented
public @interface EnableScheduling{
}
```

### EnableAutoConfiguration

进入@EnableAutoConfiguration 注解里，可以看到除@Import 注解之外，还多了一个 `@AutoConfigurationPackage` 注解（它的作用是**把使用了该注解的类所在的包及子包下所有组件扫描到 Spring IoC 容器中**)。并且，@Import 注解中导入的并不是一个 Configuration 的配置类，而是一个 AutoConfigurationImportSelector 类。从这一点来看，它就和其他的@Enable 注解有很大的不同。

```java
@Target({ElementType.TYPE})  
@Retention(RetentionPolicy.RUNTIME)  
@Documented  
@Inherited  
@AutoConfigurationPackage  
@Import({AutoConfigurationImportSelector.class})  
public @interface EnableAutoConfiguration {}
```

不过，不管 AutoConfigurationlmportSelector 是什么，它一定会实现配置类的导入，至于导入的方式和普通的 @Configuration 有什么区别，这就是我们需要去分析的。

### AutoConfigurationlmportSelector

AutoConfigurationlmportSelector 实现了 ImportSelector,它只有一个 selectImports 抽象方法，并且返回一个 *String 数组*，在这个数组中可以指定需要装配到 IoC 容器的类，当在@Import 中导入一个 ImportSelector 的实现类之后，会把该实现类中返回的 Class 名称都装载到 IoC 容器中。
```java
public interface ImportSelector{
	String[]selectImports(AnnotationMetadata varl);
}
```
和@Configuration 不同的是，*ImportSelector 可以实现批量装配，并且还可以通过逻辑处理来实现 Bean 的选择性装配*，也就是可以根据上下文来决定哪些类能够被 IoC 容器初始化。接下来通过一个简单的例子带大家了解 ImportSelector 的使用。

- 首先创建两个类，我们需要把这两个类装配到 IoC 容器中。
```JAVA
public class Firstclass{}
public class Secondclass{}
```
- 创建一个 ImportSelector 的实现类，在实现类中把定义的两个 Bean 加入 String 数组，这意味着这两个 Bean 会装配到 loC 容器中。
```java
public class GpImportSelector implements ImportSelector {  
        @Override  
        public String[] selectImports(AnnotationMetadata importingClassMetadata){  
            return new String[]{Firstclass.class.getName(), Secondclass.class.getName()};  
        }  
}
```

- 为了模拟 EnableAutoConfiguration,我们可以自定义一个类似的注解，通过@Import 导入 GpImportSelector。

```java
@Target(ElementType.TYPE)  
@Retention(RetentionPolicy.RUNTIME)  
@Documented  
@Inherited  
@AutoConfigurationPackage  
@Import(GpImportSelector.class)  
public @interface EnableAutoImport {  
}
```

- 创建一个启动类，在启动类上使用@EnableAutolmport 注解后，即可通过 ca.getBean 从 IoC 容器中得到 FirstClass 对象实例。
```java
@SpringBootApplication  
@EnableAutoImport  
public class MySpringAutoConfigurationApplication {  
  
    public static void main(String[] args) {  
  
        ConfigurableApplicationContext cac = SpringApplication.run(MySpringAutoConfigurationApplication.class, args);  
        System.out.println(cac.getBean(Firstclass.class));  
        System.out.println(cac.getBean(Firstclass.class));  
    }  
  }
```

- 这种实现方式相比 `@Import(*Configuration.class)` 的好处在于装配的灵活性，还可以实现批量比如 **GpImportSelector 还可以直接在 String 数组中定义多个 Configuration 类，由于一个配置类表的是某一个技术组件中批量的 Bean 声明，所以在自动装配这个过程中只需要扫描到指定路径下对应的配置类即可**。
```java
public class GpImportSelector implements ImportSelector {  
    @Override  
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {  
        return new String[]{FirstConfiguration.class.getName(), SecondConfiguration.class.getName()};  
    }  
}
//测试bean自动装配
ConfigurableApplicationContext cac = SpringApplication.run(MySpringAutoConfigurationApplication.class, args);  
System.out.println(cac.getBean("firstclass"));  
System.out.println(cac.getBean(Firstclass.class));  
System.out.println(FirstConfiguration.class.getName());
//输出结果
com.fcs.entity.Firstclass@1c32386d
com.fcs.entity.Firstclass@1c32386d
com.fcs.config.FirstConfiguration
```

### 自动装配原理分析

自动装配的核心是**扫描约定目录下的文件进行解析，解析完成之后把得到的 Configuration 配置类通过 ImportSelector 进行导入，从而完成 Bean 的自动装配过程**。

定位到 AutoConfigurationImportSelector 中的 selectImports 方法，它是 ImportSelector 接口的实现，这个方法中主要有两个功能：

1. AutoConfigurationMetadataLoader.loadMetadata 从 META-INF/spring-autoconfigure-metadata.properties 中加载自动装配的条件元数据，简单来说就是只有满足条件的 Bean 才能够进行装配。
2. 收集所有符合条件的配置类 autoConfigurationEntry.getConfigurations(）,完成自动装配。

```java
public String[] selectImports(AnnotationMetadata annotationMetadata) {  
    if (!this.isEnabled(annotationMetadata)) {  
        return NO_IMPORTS;  
    } else {  
        AutoConfigurationEntry autoConfigurationEntry = this.getAutoConfigurationEntry(annotationMetadata);  
        return StringUtils.toStringArray(autoConfigurationEntry.getConfigurations());  
    }  
}
```

需要注意的是，在 AutoConfigurationImportSelector 中不执行 selectImports 方法，而是通过 ConfigurationClassPostProcessor 中的 **processConfigBeanDefinitions 方法来扫描和注册所有配置类的 Bean,最终还是会调用 getAutoConfigurationEntry 方法获得所有需要自动装配的配置类**。这个方法应该会扫描指定路径下的文件解析得到需要装配的配置类，而这里面用到了 SpringFactoriesLoader，它要做几件事情如下：

- getAttributes 获得@EnableAutoConfiguration 注解中的属性 exclude、excludeName 等。
- getCandidateConfigurations 获得所有自动装配的配置类，后续会重点分析。
- removeDuplicates 去除重复的配置项。
- getExclusions 根据@EnableAutoConfiguration 注解中配置的 exclude 等属性，把不需要自动装配的配置类移除。
- fireAutoConfigurationlmportEvents 广播事件。
- 最后返回经过多层判断和过滤之后的配置类集合。

```java
protected AutoConfigurationEntry getAutoConfigurationEntry(AnnotationMetadata annotationMetadata) {  
    if (!this.isEnabled(annotationMetadata)) {  
        return EMPTY_ENTRY;  
    } else {  
        AnnotationAttributes attributes = this.getAttributes(annotationMetadata);  
        List<String> configurations = this.getCandidateConfigurations(annotationMetadata, attributes);  
        configurations = this.removeDuplicates(configurations);  
        Set<String> exclusions = this.getExclusions(annotationMetadata, attributes);  
        this.checkExcludedClasses(configurations, exclusions);  
        configurations.removeAll(exclusions);  
        configurations = this.getConfigurationClassFilter().filter(configurations);  
        this.fireAutoConfigurationImportEvents(configurations, exclusions);  
        return new AutoConfigurationEntry(configurations, exclusions);  
    }  
}
```

总的来说，它先获得所有的配置类，通过去重、exclude 排除等操作，得到最终需要实现自动装配的配置类。这里需要重点关注的是 getCandidateConfigurations,它是获得配置类最核心的方法。

```java
    // 从AnnotationMetadata和AnnotationAttributes中获取候选配置
    protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
        List<String> configurations = new ArrayList<>(SpringFactoriesLoader.loadFactoryNames(this.getSpringFactoriesLoaderFactoryClass(), this.getBeanClassLoader()));
        // 加载AutoConfiguration类的导入候选者，并将其添加到configurations列表中
        ImportCandidates.load(AutoConfiguration.class, this.getBeanClassLoader()).forEach(configurations::add);
        // 断言configurations列表不为空，如果META-INF/spring.factories和META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports中没有自动配置类，将会抛出异常。如果使用自定义包，则请确保文件正确。
        Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring.factories nor in META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports. If you are using a custom packaging, make sure that file is correct.");
        return configurations;
    }
```

SpringFactoriesLoader 是 Spring 内部提供的一种约定俗成的加载方式，类似于 Java 中的 SPI。简单来说，*它会扫描 classpath 下的 META-INF/spring.factories 文件，spring.factories 文件中的数据以 Key-Value 形式存储，而 SpringFactoriesLoader.loadFactoryNames 会根据 Key 得到对应的 value 值*。因此，在这个场景中，Kcy 对应为 EnableAutoConfiguration,Value 是多个配置类，也就是 getCandidateConfigurations 方法所返回的值。

打开 RabbitAutoConfiguration,可以看到，它就是一个基于 JavaConfig 形式的配置类。
```java
@Configuration(proxyBeanMethods false)
@ConditionalOnclass({RabbitTemplate.class,Channel.class }
@EnableConfigurationProperties(RabbitProperties.class)
@Import(RabbitAnnotationDrivenConfiguration.class)
public class RabbitAutoConfiguration
```

> 除了基本的@Configuration 注解，还有一个@ConditionalOnClass 注解，这个条件控制机制在这里的用途是，判断 classpath 下是否存在 RabbitTemplate 和 Channel 这两个类，如果是，则把当前配置类注册到 IoC 容器。另外，@EnableConfigurationProperties 是属性配置，也就是说我们可以按照约定在 application.properties 中配置 RabbitMQ 的参数，而这些配置会加载到 RabbitProperties 中。实际上，这些东西都是 Spring 本身就有的功能。

**自动装配的原理的核心过程**：

1. 通过@Import(AutoConfigurationlmportSelector)实现配置类的导入，但是这里并不是传统意义上的单个配置类装配。
2. AutoConfigurationlmportSelector 类实现了 ImportSelector 接口，重写了方法 selectlmports,它用于实现**选择性批量配置类的装配**。
3. 通过 Spring 提供的 SpringFactoriesLoader 机制，扫描 classpath 路径下的 META-NF/spring,factories,**读取需要实现自动装配的配置类**。
4. 通过**条件筛选的方式，把不符合条件的配置类移除**，最终完成自动装配。

### @Conditional 条件装配

@Conditional 是 Spring Framework 提供的一个核心注解，这个注解的作用是提供自动装配的
条件约束，一般与@Configuration 和@Bean 配合使用。

简单来说，Spring 在解析@Configuration 配置类时，如果该配置类增加了@Conditional 注解，
那么会根据该注解配置的条件来决定是否要实现 Bean 的装配。

#### @Conditional 的使用

@Conditional 的注解类声明代码如下，该注解可以接收一个 Condition 的数组。
```java
@Target({ElementType.TYPE, ElementType.METHOD})  
@Retention(RetentionPolicy.RUNTIME)  
@Documented  
public @interface Conditional {  
    Class<? extends Condition>[] value();  
}
```

Condition 是一个函数式接口，提供了 matches 方法，它主要提供一个条件匹配规则，*返回 true 表示可以注入 Bean,反之则不注入*。

```java
@FunctionalInterface  
public interface Condition {  
    boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata);  
}
```

**自定义 Condition**

自定义一个 Condition,逻辑很简单，如果当前操作系统是 Windows,,则返回 true,否则返回 false。

```java
public class MyCondition implements Condition {  
    @Override  
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {  
        //此处进行条件判断，如果返回true,表示需要加载该配置类或者Bean  
        //否则，表示不加载  
        String os = context.getEnvironment().getProperty("os.name");  
        if (os != null) {  
            return os.contains("Windows");  
        }  
        return false;  
    }  
}
```

```java
@Target(ElementType.TYPE)  
@Retention(RetentionPolicy.RUNTIME)  
@Documented  
@Inherited  
@Conditional({MyCondition.class})  
@AutoConfigurationPackage  
@Import(MyImportSelector.class)  
public @interface EnableAutoImport {  
}
```

```java
@SpringBootApplication  
@EnableAutoImport  
public class MySpringAutoConfigurationApplication {  
  
    public static void main(String[] args) {  
  
        ConfigurableApplicationContext cac = SpringApplication.run(MySpringAutoConfigurationApplication.class, args);  
        System.out.println(cac.getBean(Firstclass.class));   
    }  
  
}
```

在 Windows 环境中运行，将会输出 Firstclass 这个对象实例。在 Linux 环境中，会出现如下错误：
![](http://qnpicmap.fcsluck.top/pics/202311291513686.png)

以上就是@Conditional 注解的使用方法，为 Bean 的装载提供了上下文的判断。

#### Spring Boot 中的 @Conditional

在 Spring Boot 中，针对@Conditional 做了扩展，提供了更简单的使用形式，扩展注解如下：

- ConditionalOnBean/ConditionalOnMissingBean:容器中存在某个类或者不存在某个 Bean 时进行 Bean 装载。
- ConditionalOnClass/ConditionalOnMissingClass:classpath 下存在指定类或者不存在指定类时进行 Bean 装载。
- ConditionalOnCloudPlatform:只有运行在指定的云平台上才加载指定的 Bcan。
- ConditionalOnExpression:基于 SpEl 表达式的条件判断。
- ConditionalOnJava:只有运行指定版本的 Java 才会加载 Bean。
- ConditionalOnJndi:只有指定的资源通过 JNDI 加载后才加载 Bean。
- ConditionalOn WebApplication/ConditionalOnNot WebApplication:如果是 Wcb 应用或者不是 Web 应用，才加载指定的 Bean。
- ConditionalOnProperty:系统中指定的对应的属性是否有对应的值。
- ConditionalOnResource:要加载的 Bcan 依赖指定资源是否存在于 classpath 中。
- ConditionalOnSingleCandidate:只有在确定了给定 Bean 类的单个候选项时才会加载 Bean.

这些注解只需要**添加到 @Configuration 配置类的类级别或者方法级别，然后根据每个注解的作用来传参就行**。下面演示几种注解类的使用。

1. `@ConditionalOnProperty`
```java
@ConditionalOnProperty
@Configuration
@ConditionalOnProperty(value="gp.bean.enable",havingvalue="true",matchIfMissing=true)
public class ConditionConfig{}
```

在 application.properties 或 application.yml 文件中当 gp.bean.enable-true 时才会加载 ConditionConfig 这个 Bean,如果没有匹配上也会加载，因为 matchIfMissing=true,默认值是 false。

2. `@ConditionalOnBean 和 @ConditionalOnMissingBean`

```java
@Configuration
@ConditionalOnBean(MyBean.class)
public class ConditionConfig{}
```

当 Spring IoC 容器中存在 GpBean 时，才会加载 ConditionConfig。

3. `@ConditionalOnResource`

```java
@ConditionalOnResource
@Configuration
@ConditionalonResource(resource="/gp.properties")
public class Conditionconfig{}
```

在 classpath 中如果存在 gp.properties,则会加载 ConditionConfig

> 这些条件配置在 Spring Boot 的自动装配配置类中出现的频率非常高，它能够很好地为自动装配提供上下文条件判断，来让 Spring 决定是否装载该配置类。

### spring-autoconfigure-metadata

除了@Conditional 注解类，在 SpringBoot 中还提供了 **spring-autoconfigure.properties 文件来实现批量自动装配条件配置**。

它的作用和@Conditional 是一样的，只是将这些条件配置放在了配置文件中。下面这段配置来自 spring-boot-autoconfigure.jar 包中的/META-NF/spring-autoconfigure-.metadata.properties 文件。

同样，这种形式也是“约定优于配置”的体现，通过这种配置化的方式来实现条件过滤必须要遵循两个条件：

- 配置文件的路径和名称必须是 `/META-INF/spring-autoconfigure-metadata.properties`
- 配置文件中 key 的配置格式：自动配置类的类全路径名.条件=值

这种配置方法的好处在于，它可以有效地降低 Spring Boot 的启动时间，通过这种过滤方式可
以减少配置类的加载数量，因为*这个过滤发生在配置类的装载之前，所以它可以降低 Spring Boot 启动时装载 Bean 的耗时*。

## 手写一个 Starter

从 Spring Boot 官方提供的 Starter 的作用来看，Starter 组件主要有三个功能：

- 涉及相关组件的 Jar 包依赖。
- 自动实现 Bean 的装配。
- 自动声明并且加载 application.properties 文件中的属性配置。


### Starter 的命名规范

Starter 的命名主要分为两类，一类是官方命名，另一类是自定义组件命名。这种命名格式并
不是强制性的，也是一种约定俗成的方式，可以让开发者更容易识别。

。**官方命名的格式为**：`spring-boot-starter-模块名称`，比如 spring-boot-starter-web。

。**自定义命名格式为**：`模块名称-spring-boot-starter`,比如 mybatis-spring-boot-starter。

简单来说，官方命名中模块名放在最后，而自定义组件中模块名放在最前面。

### 实现基于 Redis 的 Starter

我们可以基于前面学到的思想实现一个基于 Redis 简化版本的 Starter 组件。

1. 创建一个工程，命名为：`redis-spring-boot-starter`。
2. 添加 Jar 包依赖，Redisson 提供了在 Java 中操作 Redis 的功能，并且基于 Redis 的特性封装了很多可直接使用的场景，比如分布式锁。

```java
<dependency>
	<groupId>org.redisson</groupId>
	<artifactId>redisson</artifactId>
	<version>3.11.1</version>
</dependency>
```

3. 定义属性类，实现在 application.properties 中配置 Redis 的连接参数，由于只是一个简单版
本的 Demo,所以只简单定义了一些必要参数。另外 `@ConfigurationProperties` 这个注解的
作用是*把当前类中的属性和配置文件(properties/yml)中的配置进行绑定*，并且前缀是 fcs.redisson。

```java
@ConfigurationProperties(prefix = "fcs.redisson")  
public class RedissonProperties {  
    private int database = 0;  
    private String host = "localhost";  
    private String password;  
    private int port = 6379;  
    private int timeout;  
    private boolean ssl;  
  
    public String getHost() {  
        return host;  
    }  
  
    public void setHost(String host) {  
        this.host = host;  
    }  
  
    public String getPassword() {  
        return password;  
    }  
  
    public void setPassword(String password) {  
        this.password = password;  
    }  
  
    public int getPort() {  
        return port;  
    }  
  
    public void setPort(int port) {  
        this.port = port;  
    }  
  
    public boolean isSsl() {  
        return ssl;  
    }  
  
    public void setSsl(boolean ssl) {  
        this.ssl = ssl;  
    }  
  
    public int getTimeout() {  
        return timeout;  
    }  
  
    public void setTimeout(int timeout) {  
        this.timeout = timeout;  
    }  
  
    public int getDatabase() {  
        return database;  
    }  
  
    public void setDatabase(int database) {  
        this.database = database;  
    }  
}
```

4. 定义需要自动装配的配置类，主要就是把 RedissonClient 装配到 IoC 容器，值得注意的是
@ConditionalOnClass,它表示一个条件，在当前场景中表示的是：在 classpath 下存在 Redisson 这个类的时候，RedissonAutoConfiguration 才会实现自动装配。另外，这里只演示了一种单机的配置模式，除此之外，Redisson 还支持集群、主从、哨兵等模式的配置，有兴趣的话可以基于当前案例去扩展，建议使用 config.fromYAML 方式，直接加载配置完成不同模式的初始化，这会比根据不同模式的判断来实现配置化的方式更加简单。

```java
@Configuration  
@ConditionalOnClass(Redisson.class)  
@EnableConfigurationProperties(RedissonProperties.class)  
public class RedissonAutoConfiguration {  
    /**  
     * 配置Redisson客户端  
     *  
     * @param redissonProperties Redisson配置属性  
     * @return Redisson客户端  
     */  
    @Bean  
    RedissonClient redissonclient(RedissonProperties redissonProperties) {  
        Config config = new Config();  
        String prefix = "redis://";  
        if (redissonProperties.isSsl()) {  
            prefix = "rediss://";  
        }  
        SingleServerConfig singleServerConfig = config.useSingleServer()  
                .setAddress(prefix + redissonProperties.getHost() + ":" + redissonProperties.getPort())  
                .setConnectTimeout(redissonProperties.getTimeout())  
                .setDatabase(redissonProperties.getDatabase());  
        if (!StringUtils.isEmpty(redissonProperties.getPassword())) {  
            singleServerConfig.setPassword(redissonProperties.getPassword());  
        }  
        return Redisson.create(config);  
    }  
}
```

5. 在 resources 下创建**META-INF/spring.factories**文件，使得 Spring Boot 程序可以扫描到该文件完成自动装配，key 和 value 对应如下：

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=
com.fcs.config.RedissonAutoConfiguration
```

6. 最后一步，使用阶段只需要做两个步骤：添加 Starter 依赖、设置属性配置：

```xml
<dependency>
	<groupId>com.fcs</groupId>  
	<artifactId>redis-spring-boot-starter</artifactId>  
	<version>0.0.1-SNAPSHOT</version>
</dependency>
```

在 application.yml 中配置相应属性,这个属性会自动绑定到 RedissonProperties 中定义的属性上。
```yml
fcs:  
  redisson:  
    password: 123456  
    database: 0  
    host: 127.0.0.1  
    port: 6379  
    timeout: 10000  
    ssl: false
```

7. 编写测试方法测试自己实现的 redisson 是否可用：

```java
@SpringBootTest  
class RedisSpringBootStarterApplicationTests {  
    @Resource  
    RedissonClient redissonClient;  
  
    @Test  
    void myRedissonTest() {  
        redissonClient.getBucket("test").set("123456");  
        System.out.println(redissonClient.getBucket("test").get());  
    }  
  
}
```

![](http://qnpicmap.fcsluck.top/pics/202311300027992.png)

成功设置并获取到 test 键的值为 "123456"

### 小结

> 本章主要分析了 Spring Boot 中的自动装配的基本原理，并且通过实现一个自定义 Starter 的方式加深了我们对于自动装配的理解。由于 Spring Cloud 生态中的组件，都是基于 Spring Boot 框架来实现的，了解 Spring Boot 的基本原理将有助于大家对后续内容的理解，*工欲善其事必先利其器*，读者我感悟到，**比了解技术的基本使用方法更重要的是了解技术产生的背景及核心原理**。


# 第四章、微服务架构下的服务治理

Dubbo 的产生就是为了解决以下问题：

- 如何协调线上运行的服务，以及保障服务的高可用性。
- 如何根据不同服务的访问情况来合理地调控服务器资源，提高机器的利用率。
- 线上出现故障时，如何动态地对故障业务做降级、流量控制等。
- 如何动态地更新服务中的配置信息，比如限流阈值、降级开关等。
- 如何实现大规模服务集群所带来的服务地址的管理和服务上下线的动态感知。

## 如何理解 Apache Dubbo

Apache Dubbo 是一个分布式服务框架，主要**实现多个系统之间的高性能、透明化调用，简单
来说它就是一个 RPC 框架**，但是和普通的 RPC 框架不同的是，它**提供了服务治理功能，比如服
务注册、监控、路由、容错**等。

Apache Dubbo 架构图如下图所示：

![](http://qnpicmap.fcsluck.top/pics/202312052213839.png)

## Spring Boot 集成 Apache Dubbo

dubbo 可以基于 XML 形式进行服务发布和服务消费，但是配置 xml 文件比较烦琐，而且在发布的服务接口比较多的情况下，配置会非常复杂，所以 Apache Dubbo 也提供了对注解的支持，基于 Spring Boot 集成 Apache Dubbo 实现零配置的服务注册与发布。

### 服务提供者开发流程


1. 创建一个普通的 Maven 工程 springboot-provider,并创建两个模块：sample-api 和 sample-provider ,其中 sample-provider 模块是一个 Spring Boot 工程。

2. 在 sample-api 模块中定义一个接口，并且通过 mvn install 安装到本地私服。
```java
public interface IHelloService {
String sayHello(String name);
}
```

3. 在 sample-provider 中引入以下依赖，其中 dubbo-spring-boot-starter 是 Apache Dubbo 官方提供的开箱即用的组件。
```xml
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter</artifactId>
</dependency>
<dependency>
<groupId>org.apache.dubbo</groupId>
<artifactId>dubbo-spring-boot-starter</artifactId>
<version>2.7.6</version>
</dependency>
<dependency>
<groupId>com.gupaoedu.book.dubbo</groupId>
<version>1.0-SNAPSHOT</version>
<artifactId>sample-api</artifactId>
</dependency>
```

4. 在 sample-provider 中实现 IHelloService,并且使用 `Dubbo 中提供的@Service` 注解发布服务。
```java
@Service
public class HelloServiceImpl implements IHelloService {
	@Value("${dubbo.application.name}")
	private String serviceName;
	@Override
	public String sayHello(String name){
	return String.format("[%s]:Hello,%s",serviceName,name);
	}
}
```

5. 在 application.properties 文件中添加 Dubbo 服务的配置信息。
```properties
spring.application.name=springboot-dubbo-demo
dubbo.application.name=springboot-provider
dubbo.protocol.name=dubbo
dubbo.protocol.port=20880
dubbo.registry.address=N/A
```

6. 启动 Spring Boot,需要注意的是，需要在启动方法上添加 `@DubboComponentScan` 注解，它的作用和 Spring Framework 提供的@ComponetScan 一样，只不过这里扫描的是 `Dubbo 中提供的@Service` 注解。
```java
@DubboComponentScan
@SpringBootApplication
public class ProviderApplication
public static void main(String[]args){
SpringApplication.run(ProviderApplication.class,args);
}
```

### 服务调用者的开发流程

服务调用者引入 api 模块作为依赖，调用该接口方法，该接口被调用时会被自动代理执行服务供给者所实现的方法。

1. 创建一个 Spring Boot 项目 springboot-consumer,添加 Jar 包依赖。
```xml
<dependency>
	<groupId>org.apache.dubbo</groupId>
	<artifactId>dubbo-spring-boot-starter</artifactId>
	<version>2.7.6</version>
</dependency>
<dependency>
	<groupId>com.gupaoedu.book.dubbo</groupId>
	<version>1.0-SNAPSHOT</version>
	<artifactId>sample-api</artifactId>
</dependency>
```

2. 在 application.properties 中配置项目名称。
`dubbo.application.name=springboot-consumer`
3. 在 Spring Boot 启动类中，使用 Dubbo 提供的 **@Reference 注解来获得一个远程代理对象**。

```java
@SpringBootApplication
public class SpringbootConsumerApplication {
	
	@Reference(url="dubbo://192.168.13.1:20880/com.gupaoedu.book.dubbo.IHelloService")
	private IHelloService helloService;
	
	public static void main(String[]args){
	SpringApplication.run(SpringbootConsumerApplication.class,args);
	
	@Bean
	public ApplicationRunner runner(){
	return args->System.out.println(helloService.sayHello("Mic"));
	}
}
```

调用链路结果如下图所示：

**服务供给者:**
![](http://qnpicmap.fcsluck.top/pics/202312072253491.png)

**服务消费者:**
![](http://qnpicmap.fcsluck.top/pics/202312072254525.png)

相比基于 XML 的形式来说，基于 `Dubbo-Spring-Boot-Starter` 组件来使用 Dubbo 完成**服务发布和服务消费**会使得开发更加简单。另外，官方还提供了 Dubbo-Spring-Boot-Actuator 模块，可以实现**针对 Dubbo 服务的健康检查**；还可以通过 Endpoints 实现**Dubbo 服务信息的查询和控制**等，为生产环境中对 Dubbo 服务的监控提供了很好的支持。

前面的两个案例中，主要还是使用 Dubbo 以点对点的形式来实现服务之间的通信，Dubbo 可以很好地集成注册中心来实现服务地址的统一管理。早期大部分公司采用的是 ZooKeeper 来实现注册，接下来将学习一下 ZooKeeper,然后基于前面演示的案例整合 ZooKeeper 实现服务的注册和发现。


## 快速上手 ZooKeeper


ZooKeeper 是一个高性能的分布式协调中间件，所谓的分布式协调中间件的作用类似于多线程环境中通过并发工具包来协调线程的访问控制，只是分布式协调中间件主要解决分布式环境中各个服务进程的访问控制问题，比如访问顺序控制。所以，在这里需要强调的是，ZooKeeper 并不是注册中心，只是基于 ZooKeeper 本身的特性可以实现注册中心这个场景而已。

### 分布式锁

用过多线程的应该都知道锁，比如 Synchronized 或者 Lock,它们主要**用于解决多线程环境下共享资源访问的数据安全性问题**，但是它们所处理的范围是线程级别的。在**分布式架构中，多个进程对同一个共享资源的访问，也存在数据安全性问题**，因此也需要使用锁的形式来解决这类问题，而==解决分布式环境下多进程对于共享资源访问带来的安全性问题的方案就是使用分布式锁==。锁的本质是排他性的，也就是避免在同一时刻多个进程同时访问某一个共享资源。

**实现分布式锁**

分布式锁常见的有三种实现方式 :

> 1. 基于 Redis 实现分布式锁.
> 2. 基于 Zookeeper 实现.
> 3. 基于数据库 实现.

### Master 选举

Master 选举是分布式系统中非常常见的场景，在分布式架构中，为了保证服务的可用性，通常会采用**集群模式**，也就是当其中一个机器宕机后，集群中的其他节点会接替故障节点继续工作。这种工作模式有点类似于公司中某些重要岗位的 AB 角，当 A 请假之后，B 可以接替 A 继续工作。在这种场景中，就需要==从集群中选举一个节点作为 Master 节点，剩余的节点都作为备份节点随时待命。当原有的 Master 节点出现故障之后，还需要从集群中的其他备份节点中选举一个节点作为 Master 节点继续提供服务==。


![](http://qnpicmap.fcsluck.top/pics/202312080934999.png)


## Apache Dubbo 集成 ZooKeeper 实现服务注册

大规模服务化之后，在远程 RPC 通信过程中，会遇到两个比较尖锐的问题：
- 服务动态上下线感知。
- 负载均衡。
**服务动态上下线感知**，就是服务调用者要感知到服务提供者上下线的变化。按照以往传统的形式，服务调用者如果要调用服务提供者，必须要知道服务提供者的**地址信息及映射参数**。以 Webservice 为例，服务调用者需要在配置文件中维护一个 `http:ip:port/service?wsdl` 地址，但是如果服务提供者是一个集群节点，那么服务调用者需要维护多个这样的地址。问题来了，一旦服务提供者的 P 故障或者集群中某个节点下线了，服务调用者需要同步更新这些地址，但是这个操作如果人工来做是不现实的，所以需要一个第三方软件来统一管理服务提供者的 URL 地址，服务调用者可以从这个软件中获得目标服务的相关地址，并且第三方软件需要动态感知服务提供者状态的变化来维护所管理的 URL,进而使得服务调用者能够及时感知到变化而做出相应的处理。
**负载均衡**，就是当服务提供者是由多个节点组成的集群环境时，服务调用者需要通过负载均衡算法来动态选择一台目标服务器进行远程通信。负载均衡的主要目的是通过多个节点的集群来均衡服务器的访问压力，提升整体性能。实现负载均衡的前提是，要得到目标服务集群的所有地址，在服务调用者端进行计算，而地址的获取也同样依赖于第三方软件。

![|600](http://qnpicmap.fcsluck.top/pics/202312080945071.png)

当 Dubbo 服务启动时，会去 Zookeeper 服务器上的/dubbo/com.gupaoedu.book.dubbo.IHelloService/providers 目录下创建当前服务的 URL,其中 com.gupaoedu.book.dubbo.IHelloService 是**发布服务的接口全路径名称**，**providers 表示服务提供者的类型**，*dubbo:/ip:port 表示该服务发布的协议类型及访问地址*。其中，URL 是临时节点，其他皆为持久化节点。在这里使用临时节点的好处在于，如果注册该节点的服务器下线了，那么这个服务器的 URL 地址就会从 ZooKeeper 服务器上被移除。
![|600](http://qnpicmap.fcsluck.top/pics/202312080953192.png)

当 Dubbo 服务消费者启动时，会对/dubbo/com.gupaoedu.book.dubbo.HelloService/providers 节点下的子节点注册**Watcher 监听**，这样便可以感知到服务提供方节点的上下线变化，从而防止请求发送到已经下线的服务器造成访问失败。同时，服务消费者会在 dubbo/com.gupaoedu.book,dubbo.HelloService/consumers 下**写入自己的 URL**,这样做的目的是可以在监控平台上看到某个 Dubbo 服务正在被哪些服务调用（*链路追踪*）。最重要的是，Dubbo 服务的消费者如果需要调用 IHelloService 服务，那么它会先去/dubbo/.com.gupaoedu.book.dubbo.IHelloService/providers 路径下==获得所有该服务的提供方 URL 列表，然后通过负载均衡算法计算出一个地址进行远程访问==。

- 基于临时节点的特性，当服务提供者宕机或者下线时，注册中心会自动删除该服务提供者的信息。
- 注册中心重启时，Dubbo 能够自动恢复注册数据及订阅请求。
- 为了保证节点操作的安全性，ZooKeeper 提供了 ACL 权限控制，在 Dubbo 中可以通过 dubbo.registry.username/dubbo.registry.password 设置节点的验证信息。
- 注册中心默认的根节点是/dubbo,如果需要针对不同环境设置不同的根节点，可以使用 dubbo.registry.group 修收根节占名称。


## 实战 Dubbo Spring Cloud

在服务治理方面，Apache Dubbo 有着非常大的优势，并且在 Spring Cloud 出现之前，它就已经被很多公司作为服务治理及微服务基础设施的首选框架。Dubbo Spring Cloud 的出现，使得 Dubbo 既能够完全整合到 Spring Cloud 的技术栈中，享受 SpringCloud 生态中的技术支持和标准化输出，又能够弥补 Spring Cloud 中服务治理这方面的短板。

### 实现 Dubbo 服务提供方

创建一个普通的 Maven 工程，并在该工程中创建两个模块：spring-cloud-dubbo-sample-api、spring-cloud-dubbo-sample-provider。其中 spring-cloud-dubbo-sample-api 是一个普通的 Maven 工程，spring-cloud-dubbo-sample-provider 是一个 Spring Boot 工程。对于服务提供者而言，都会存在一个 API 声明，因为服务的调用者需要访问服务提供者声明的接口，为了确保契约的一致性，Dubbo 官方推荐的做法是把服务接口打成 Jar 包发布到仓库上。服务调用者可以依赖该 Jar 包，通过接口调用方式完成远程通信。对于服务提供者来说，也需要依赖该 Jar 包完成接口的实现。

> 注意：当前案例中使用的 Spring Cloud 版本为 Greenwich.SR2,Spring Cloud Alibaba 的版本为 2.2.2.RELEASE,Spring Boot 的版本为 2.1.11.RELEASE。

1. 在 spring-cloud-dubbo-sample-api 中声明接口，并执行 mvn install 将 Jar 包安装到本地仓库。
```java
public interface IHelloService {
	String sayHello(String name);
}
```

2. 在 spring-cloud-dubbo-sample-provider 中添加依赖:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.fcs</groupId>
        <artifactId>springcloud-dubbo-sample</artifactId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>

    <artifactId>sample-provider</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>sample-provider</name>
    <description>sample-provider</description>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    </properties>
    <dependencies>
        <!--        spring-cloud-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter</artifactId>
        </dependency>
        <!--        dubbo-->
        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-spring-boot-starter</artifactId>
        </dependency>
        <!--        zookeeper-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-zookeeper-discovery</artifactId>
        </dependency>
        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--        sample-api-->
        <dependency>
            <groupId>org.fcs</groupId>
            <artifactId>sample-api</artifactId>
            <version>0.0.1-SNAPSHOT</version>
        </dependency>
    </dependencies>

</project>

```

需要注意的是，上述依赖的 artifact 没有指定版本，所以需要在父 pom 中显式声明 dependencyManagement.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi=" http://www.w3.org/2001/XMLSchema-instance"
         xmlns=" http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation=" http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <!--项目基本信息-->
    <groupId>org.fcs</groupId>
    <artifactId>springcloud-dubbo-sample</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>pom</packaging>
    <!--    项目子模块-->
    <modules>
        <module>sample-api</module>
        <module>sample-provider</module>
        <module>sample-consumer</module>
    </modules>
    <!--    项目说明-->
    <name>alleyf</name>
    <url>https://alleyf.github.io</url>
    <description>拂安 dubbo 微服务供给者</description>
    <!--    声明依赖的版本-->
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <spring-boot.version>2.7.6</spring-boot.version>
        <spring-cloud.version>2021.0.6</spring-cloud.version>
        <spring-cloud-alibaba.version>2021.0.5.0</spring-cloud-alibaba.version>
        <dubbo.version>2.7.6</dubbo.version>
        <lombok.version>1.18.20</lombok.version>
    </properties>

    <!--    版本管理-->
    <dependencyManagement>
        <dependencies>
            <!--            spring-boot-->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!--            spring-cloud-->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!--            spring-cloud-alibaba-->
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>${spring-cloud-alibaba.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!--            lombok-->
            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
                <scope>provided</scope>
            </dependency>
            <!--            dubbo-->
            <dependency>
                <groupId>org.apache.dubbo</groupId>
                <artifactId>dubbo-spring-boot-starter</artifactId>
                <version>${dubbo.version}</version>
            </dependency>
        </dependencies>

    </dependencyManagement>
</project>
```

3. 在 spring-cloud-dubbo-sample-provider 中创建接口的实现类 HelloServiceImpl,其中@Service 是 Dubbo 服务的注解，表示当前服务会发布为一个远程服务。

```java
package com.fcs.service;  
  
import org.apache.dubbo.config.annotation.Service;  
import org.springframework.beans.factory.annotation.Value;  
  
@Service  
public class HelloServiceImpl implements IHelloService {  
    @Value("${dubbo.application.name}")  
    private String serviceName;  
  
    @Override  
    public String sayHello(String name) {  
        return String.format("[%s]:Hello,%s", serviceName, name);  
    }  
}
```

4. 在 application.properties 中配置 Dubbo 相关的信息。
```properties
server.port=8080  
dubbo.protocol.port=20880  
dubbo.protocol.name=dubbo  
dubbo.registry.address=zookeeper://localhost:2181 #dubbo .registry.address=zookeeper://xxx:2181 #tip 远程地址报错  
dubbo.registry.timeout=60000  
dubbo.application.name=spring-cloud-dubbo-provider  
spring.application.name=spring-cloud-dubbo-provider  
spring.cloud.zookeeper.discovery.register=true  
#spring .cloud.zookeeper.connect-string=xxx:2181  
spring.cloud.zookeeper.connect-string=localhost:2181
```

其中 spring.cloud.zookeeper.discovery.register=true 表示服务是否需要注册到注册中心。
spring.cloud.zookeeper.connect-string 表示 ZooKeeper 的连接字符串。

5. 在启动类中声明@DubboComponentScan 注解，并启动服务。

```java
@SpringBootApplication  
@DubboComponentScan  
public class SampleProviderApplication {  
  
    public static void main(String[] args) {  
        SpringApplication.run(SampleProviderApplication.class, args);  
    }  
 }
```

@DubboComponentScan 扫描当前注解所在的包路径下的 @org.apache.dubbo.config.annotationService 注解，实现服务的发布。发布完成之后，就可以在 ZooKeeper 服务器上看一个/services/${project-name}节点，这个节点中保存了服务提供方相关的地址信息。

### 实现 Dubbo 服务调用方

Dubbo 服务提供方 spring-cloud-dubbo-.sample 已经准备完毕，只需要创建一个名为 spring-cloud-dubbo-consumer 的 Spring Boot 项目，就可以实现 Dubbo 服务调用了。

1. 创建一个名为 spring-cloud-dubbo-consumer 的 Spring Boot 工程，添加如下依赖，与服务提供方所依赖的配置没什么区别。为了演示需要，增加了 spring-boot-starter-web 组件，表示这是一个 Web 项目。

```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--        spring-cloud-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter</artifactId>
        </dependency>
        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--        dubbo-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-dubbo</artifactId>
        </dependency>
        <!--        zookeeper-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-zookeeper-discovery</artifactId>
        </dependency>
        <!--        sample-api-->
        <dependency>
            <groupId>org.fcs</groupId>
            <artifactId>sample-api</artifactId>
            <version>0.0.1-SNAPSHOT</version>
        </dependency>
    </dependencies>

```

2. 在 application.properties 文件中添加 Dubbo 相关配置信息。
```properties
server.port=8081  
dubbo.protocol.name=dubbo  
dubbo.application.name=springboot-consumer  
dubbo.cloud.subscribed-services=spring-cloud-dubbo-provider  
spring.application.name=spring-cloud-dubbo-consumer  
spring.cloud.zookeeper.discovery.register=false  
spring.cloud.zookeeper.connect-string=localhost:2181
```

配置信息和 spring-cloud-dubbo-sample 项目的配置信息差不多，有两个配置需要单独说明一下：
- `spring.cloud.zookeeper.discovery.register=false` 表示当前服务不需要注册到 ZooKeeper 上，默认为 true。
- `dubbo.cloud.subscribed.services` 表示服务调用者订阅的服务提供方的应用名称列表，如果有多个应用名称，可以通过“`,`”分割开，默认值为“`*`”，不推荐使用默认值。当 dubbo.cloud.subscribed.services 为默认值时，控制台的日志中会输入一段警告信息。

3. 创建 HelloController 类，暴露一个/say 服务，来消费 Dubbo 服务提供者的 HelloService 服务。
```java
@RestController
public class HelloController{
	@Reference
	private IHelloService iHelloService;
	@GetMapping("/say")
	public String sayHello(){
	return iHelloService.sayHello("Mic");
	}
}
```
4. 启动 Spring Boot 服务。

```java
@SpringBootApplication
public class SpringCloudDubboConsumerApplication {
	public static void main(String[]args){
		SpringApplication.run(SpringCloudDubboConsumerApplication.class,args);
	}
}
```

通过 curl 命令执行 HTTP GET 方法：
`curl http:/127.0.0.1:8080/say` 响应结果为：`[spring-cloud-dubbo-sample]:Hello,Mic`

![](http://qnpicmap.fcsluck.top/pics/202312091105915.png)

## Apache Dubbo 的高级应用

- 支持多种协议的服务发布，默认是 dubbo://，还可以支持 rest://、webservice://、thrift://等。
- 支持多种不同的注册中心，如 Nacos、ZooKeeper、Redis,未来还将会支持 Consul、Eureka、Etcd 等。
- 支持多种序列化技术，如 avro、fst、fastjson、hessian2、kryo 等。

除此之外，Apache Dubbo 在服务治理方面的功能非常完善，比如集群容错、服务路由、负载均衡、服务降级、服务限流、服务监控、安全验证等。接下来带着大家分析一些常用的功能配置，更多的功能可以关注 Apache Dubbo 官网，相比国外的官方资料来说，它最大的优势是支持中文，所以对读者来说也能够很好地理解。

### 集群容错

在分布式架构的网络通信中，容错能力是必须要具备的。什么叫容错呢？从字面来看，就是服务容忍错误的能力。我们都知道网络通信中会存在很多不确定的因素导致请求失败，比如网络延迟、网络中断、服务异常等。当服务调用者（消费者）调用服务提供者的接口时，如果因为上述原因出现请求失败，那对于服务调用者来说，需要一种机制来应对。Dubbo 中提供了集群容错的机制来优雅地处理这种错误。
**容错模式**
Dubbo 默认提供了 6 种容错模式，默认为 Failover Cluster。如果这 6 种容错模式不能满足你的实际需求，还可以自行扩展。这也是 Dubbo 的强大之处，几乎所有的功能都提供了插拔式的扩展。
- `Failover Cluster`,失败自动切换。当服务调用失败后，会切换到集群中的其他机器进行重试，默认重试次数为 2，通过属性 retries=2 可以修改次数，但是重试次数增加会带来更长的响应延迟。这种容错模式通常用于读操作，因为事务型操作会带来数据重复问题。
- `Failfast Cluster`,快速失败。当服务调用失败后，立即报错，也就是只发起一次调用。通常用于一些幂等的写操作，比如新增数据，因为当服务调用失败时，很可能这个请求已经在服务器端处理成功，只是因为网络延迟导致响应失败，为了避免在结果不确定的情况下导致数据重复插入的问题，可以使用这种容错机制。
- `Failsafe Cluster`,失败安全。也就是出现异常时，直接忽略异常。
- `Failback Cluster`,失败后自动回复。服务调用出现异常时，在后台记录这条失败的请求定时重发。这种模式适合用于消息通知操作，保证这个请求一定发送成功。
- `Forking Cluster`,并行调用集群中的多个服务，只要其中一个成功就返回。可以通过 forks=2 来设置最大并行数。
- `Broadcast Cluster`,广播调用所有的服务提供者，任意一个服务报错则表示服务调用失败。这种机制通常用于通知所有的服务提供者更新缓存或者本地资源信息。

**配置方式**
配置方式非常简单，只需要在指定服务的@Service 注解上增加一个参数即可。注意，在没有特殊说明的情况下，后续代码都是基于前面的 Dubbo Spring Cloud 的代码进行改造的。在@Service 注解中增加 cluster-="failfast'"参数，表示当前服务的容错方式为快速失败。

```java
@Service(cluster "failfast")
public class HelloServiceImpl implements IHelloService {
	@Value("${dubbo.application.name}")
	private String serviceName;
	@Override
	public String sayHello(String name){
	return String.format("[%s]:Hello,%s",serviceName,name);
	}
}
```
在实际应用中，查询语句容错策略建议使用默认的 Failover Cluster,而增删改操作建议使用 Failfast Cluster 或者使用 Failover Cluster(retries="0")策略，防止出现数据重复添加等其他问题！建议在设计接口的时候把查询接口方法单独做成一个接口提供查询。

### 负载均衡
负载均衡应该不是一个陌生的概念，在访问量较大的情况下，我们会通过水平扩容的方式增加多个节点来平衡请求的流量，从而提升服务的整体性能。简单来说，如果一个服务节点的 TPS 是 100，那么如果增加到 5 个节点的集群，意味着整个集群的 TPS 可以达到 500。
当服务调用者面对 5 个节点组成的服务提供方集群时，请求应该分发到集群中的哪个节点，取决于负载均衡算法，通过该算法可以让每个服务器节点获得适合自己处理能力的负载。负载均衡可以分为硬件负载均衡和软件负载均衡，硬件负载均衡比较常见的就是 F5,软件负载均衡目前比较主流的是 Nginx。


在 Dubbo 中提供了 4 种负载均衡策略，默认负载均衡策略是 random。同样，如果这 4 种策略不能满足实际需求，我们可以基于 Dubbo 中的 SPI 机制来扩展。
- `Random LoadBalance`,随机算法。可以针对性能较好的服务器设置较大的权重值，权重值越大，随机的概率也会越大。
- `RoundRobin LoadBalance`,轮询。按照公约后的权重设置轮询比例。
- `LeastActive LoadBalance`,最少活跃调用书。处理较慢的节点将会收到更少的请求。
- `ConsistentHash LoadBalance`,一致性 Hash。相同参数的请求总是发送到同一个服务提供者。
**配置方式**
在@Service 注解上增加 loadbalance 参数：
```java
@Service(cluster "failfast",loadbalance "roundrobin")
```

### 服务降级

服务降级是一种系统保护策略，当服务器访问压力较大时，可以根据当前业务情况对不重要的服务进行降级，以保证核心服务的正常运行。所谓的降级，就是把一些非必要的功能在流量较大的时间段暂时关闭，比如在双 11 大促时，淘宝会把查看历史订单、商品评论等功能关闭，从而释放更多的资源来保障大部分用户能够正常完成交易。
降级有多个层面的分类：
- 按照是否自动化可分为**自动降级和人工降级**。
- 按照功能可分为**读服务降级和写服务降级**。

人工降级一般具有一定的前置性，比如在电商大促之前，暂时关闭某些非核心服务，如评价推荐等。而自动降级更多的来自于系统出现某些异常的时候自动触发“兜底的流畅”，比如：

- **故障降级**，调用的远程服务“挂了”，网络故障或者 RPC 服务返回异常。这类情况在业务允许的情况下可以通过设置兜底数据响应给客户端。
- **限流降级**，不管是什么类型的系统，它所支撑的流量是有限的，为了保护系统不被压垮，在系统中会针对核心业务进行限流。当请求流量达到阈值时，后续的请求会被拦截，这类请求可以进入排队系统，比如 12306。也可以直接返回降级页面，比如返回“活动太火爆，请稍候再来”页面。

Dubbo 提供了一种 Mock 配置来实现服务降级，也就是说当服务提供方出现网络异常无法访问时，客户端不抛出异常，而是通过降级配置返回兜底数据，操作步骤如下：
- 在 spring-cloud-dubbo-consumer 项目中创建 MockHelloService 类，这个类只需要实现自动降级的接口即可，然后重写接口中的抽象方法实现本地数据的返回。

```java
public class MockHelloService implements IHelloService {
	@Override
	public String sayHello(String s){
	return"Sorry,服务无法访问，返回降级数据";}
}
```

- 在 HelloController 类中修改@Reference 注解增加 Mock 参数。其中设置了属性 cluster="failfast'",因为默认的容错策略会发起两次重试，等待的时间较长。
```java
@RestController
public class HelloController {
	@Reference(mock="com.gupaoedu.book.springcloud.springclouddubboconsumer.MockHelloService",
	cluster "failfast")
	private IHelloService iHelloService;
	
	@GetMapping("/say")
	public String sayHello(){
	return iHelloService.sayHello("Mic");
	}
}
```
- 在不启动 Dubbo 服务端或者服务端的返回值超过默认的超时时间时，访问/say 接口得到的结构就是 MockHelloService 中返回的数据。

### 主机绑定规则

主机绑定表示的是 Dubbo 服务对外发布的 IP 地址，默认情况下 Dubbo 会按照以下顺序来查找并绑定主机 P 地址：
- 查找环境变量中 DUBBO IP TO BIND 属性配置的 IP 地址。
- 查找 dubbo.protocol.host 属性配置的 IP 地址，默认是空，如果没有配置或者 P 地址不合法，则继续往下查找。
- 通过 LocalHost.getHostAddress 获取本机 IP 地址，如果获取失败，则继续往下查找。
- 如果配置了注册中心的地址，则使用 Socket 通信连接到注册中心的地址后，使用 for 循环通过 socket.getLocalAddress().getHostAddress(扫描各个网卡获取网卡 IP 地址。

上述过程中，任意一个步骤检测到合法的 P 地址，便会将其返回作为对外暴露的服务 P 地址。需要注意的是，获取的 P 地址并不是写入注册中心的地址，默认情况下，写入注册中心的 IP 地址优先选择环境变量中 DUBBO IP TO REGISTRY 属性配置的 P 地址。在这个属性没有配置的情况下，才会选取前面获得的 P 地址并写入注册中心。
使用默认的主机绑定规则，可能会存在获取的 P 地址不正确的情况，导致服务消费者与注册中心上拿到的 URL 地址进行通信。因为 Dubbo 检测本地 P 地址的策略是先调用 LocalHost..getHostAddress,这个方法的原理是通过获取本机的 hostname 映射 IP 地址，如果它指向的是一个错误的 IP 地址，那么这个错误的地址将会作为服务发布的地址注册到 ZooKeeper 节点上，虽然 Dubbo 服务能够正常启动，但是服务消费者却无法正常调用。按照 Dubbo 中 IP 地址的查找规则，如果遇到这种情况，可以使用很多种方式来解决：

- 在/etc/hosts 中配置机器名对应正确的 IP 地址映射。
- 在环境变量中添加 DUBBO IP TO BIND 或者 DUBBO IP TO REGISTRY 属性，Value 值为绑定的主机地址。
- 通过 dubbo.protocol.host 设置主机地址。
除获取绑定主机 P 地址外，对外发布的端口也是需要注意的，Dubbo 框架中针对不同的协议都提供了默认的端口号：
- Dubbo 协议的默认端口号是 20880。
- Webservice 协议的默认端口号是 80。
在实际使用过程中，建议指定一个端口号，避免和其他 Dubbo 服务的端口产生冲突。


## Apache Dubbo 核心源码分析

Apache Dubbo 的源码需要理解以下几个核心点：

- SPI 机制
- 自适应扩展点
- IoC 和 AOP
- Dubbo 如何与 Spring 集成

### Dubbo 的核心之 SPI


在 Dubbo 的源码中，很多地方会存下面这样三种代码，分别是自适应扩展点、指定名称的扩展点、激活扩展点：
```java
ExtensionLoader.getExtensionLoader(XXX.class).getAdaptiveExtension();
ExtensionLoader.getExtensionLoader(XXX.class).getExtension(name);
ExtensionLoader.getExtensionLoader(XXX.class).getActivateExtension(url,key);
```

这种扩展点实际上就是 Dubbo 中的 SPI 机制。在分析 Spring Boot 自动装配的时候提到过 SpringFactoriesLoader,它也是一种 SPI 机制。

#### Java SPI 扩展点实现

SPI 全称是 Service Provider Interface,原本是 JDK 内置的一种服务提供发现机制，它主要用来做服务的扩展实现.SPI 机制在很多场景中都有运用，比如数据库连接，JDK 提供了 java.sql.Driver 接口，这个驱动类在 DK 中并没有实现，而是由不同的数据库厂商来实现，比如 Oracle、MySQL 这些数据库驱动包都会实现这个接口，然后 JDK 利用 SPI 机制从 classpath 下找到相应的驱动来获得指定数据库的连接。这种插拔式的扩展加载方式，也同样遵循一定的协议约定。比如所有的扩展点必须要放在 resources//META-NF/services 目录下，SPI 机制会默认扫描这个路径下的属性文件以完成加载。
1. 创建一个普通的 Maven 工程 Driver,定义一个接口。这个接口只是一个规范，并没有实现，由第三方厂商来提供实现。
```java
public interface Driver{
String connect();
}
```
2. 创建另一个普通的 Maven 工程 Mysql-Driver,添加 Driver 的 Maven 依赖。
```xml
<dependency>
	<groupId>org.fcs.spi</groupId>
	<artifactId>Driver</artifactId>
	<version>1.0-SNAPSHOT</version>
</dependency>
```
3. 创建 MysqlDriver,实现 Driver 接口，这个接口表示一个第三方的扩展实现。
```java
public class MysqlDriver implements Driver{
	@Override
	public String connect(){
	return"连接 ysql 数据库";
	}
}
```

4. 在 spi 实现类的 `resources/META-INF/services` 目录下创建一个以 Driver 接口全路径名命名的文件 org.fcs.spi.Driver,在里面填写这个 Driver 的实现类扩展。
```
org.fcs.spi.MysqlDriver
```
5. 创建一个测试类，使用 ServiceLoader 加载对应的扩展点。从结果来看，MysqlDriver 这个扩展点被加载并且输出了相应的内容。
```java
public class SpiMain {
	public static void main(String[]args){
		ServiceLoader<Driver>serviceLoader=ServiceLoader.load(Driver.class);
		serviceLoader.forEach(driver->System.out.println(driver.connect()));
	}
}
```

![](http://qnpicmap.fcsluck.top/pics/202312091312969.png)

#### Dubbo 自定义协议扩展点

Dubbo 或者 SpringFactoriesLoader 并没有使用 JDK 内置的 SPI 机制，只是利用了 SPI 的思想根据实际情况做了一些优化和调整。Dubbo SPI 的相关逻辑被封装在了 ExtensionLoader 类中，通过 ExtensionLoader 我们可以加载指定的实现类。
Dubbo 的 SPI 扩展有**两个规则**：

- 和 JDK 内置的 SPI 一样，需要在 resources 目录下创建任一目录结构：META-INF/dubbo、META-INF/dubbo/internal、META-INF/services,在对应的目录下创建以接口全路径名命名的文件，Dubbo 会去这三个目录下加载相应扩展点。
- 文件内容和 JDK 内置的 SPI 不一样，内容是一种**Key 和 Value**形式的数据。Key 是一个字符串，Value 是一个对应扩展点的实现，这样的方式可以按照需要加载指定的实现类。

实现步骤如下：
1. 在一个依赖了 Dubbo 框架的工程中，创建一个扩展点及一个实现。其中，扩展点需要声明@SPI 注解。
```java
//org.fcs.spi.dubbo
@SPI //依赖于 dubbo 依赖
public interface Driver{
	String connect();
}
//org.fcs.spi.dubbo.impl
public class MysqlDriver implements Driver {  
    @Override  
    public String connect() {  
        return "连接 Mysql 数据库";  
    }  
}
```

2. 在 resources/META-INF/dubbo 目录下创建以 SPI 接口命名的文件 com.gupaoedu.book.dubbo.spi.Driver.
```java
mysqlDriver=org.fcs.spi.dubbo.impl.MysqlDriver
```
3. 创建测试类，使用 ExtensionLoader.getExtensionLoader.getExtension("mysqlDriver")获得指定名称的扩展点实现。
```java
@Test
public void connectTest(){
	ExtensionLoader<Driver>
	extensionLoader=ExtensionLoader.getExtensionLoader(Driver.class);
	Driver driver=extensionLoader.getExtension("mysqlDriver");
	System.out.println(driver.connect());
}
```

![](http://qnpicmap.fcsluck.top/pics/202312091351862.png)


#### Dubbo SPI 扩展点源码分析

ExtensionLoader.getExtensionLoader
这个方法用于返回一个 ExtensionLoader 实例，主要逻辑如下：
- 先从缓存中获取与扩展类对应的 ExtensionLoader.
- 如果缓存未命中，则创建一个新的实例，保存到 EXTENSION LOADERS 集合中缓存起来
- 在 ExtensionLoader 构造方法中，初始化一个 objectFactory,后续会用到，暂时先不管。

### 无处不在的自适应扩展点

自适应(Adaptive)扩展点也可以理解为**适配器扩展点**。简单来说就是能够根据上下文动态匹配一个扩展类。它的使用方式如下：
```java
ExtensionLoader.getExtensionLoader(class).getAdaptiveExtension();
```
自适应扩展点通过@Adaptive 注解来声明，它有两种使用方式：
- @Adaptive 注解定义在类上面，表示当前类为自适应扩展类。
```java
@Adaptive
public class AdaptiveCompiler implements Compiler{
//省略
}
```
AdaptiveCompiler 类就是自适应扩展类，通过 ExtensionLoader.getExtensionLoader
(Compiler.class).getAdaptiveExtension();可以返回 AdaptiveCompiler 类的实例。

- @Adaptive 注解*定义在方法层面，会通过动态代理的方式生成一个动态字节码*，进行自适应匹配。
```java
@SPI("dubbo")
public interface Protocol{
	int getDefaultPort();
	@Adaptive
	<T> Exporter<T> export(Invoker<T> invoker) throws RpcException;
	@Adaptive
	<T> Invoker<T> refer(Class<T> type,URL url) throws RpcException;
	//省略部分代码
}
```

Protocol 扩展类中的两个方法声明了@Adaptive 注解，意味着这是一个自适应方法。在 Dubbo 源码中很多地方通过下面这行代码来获得一个自适应扩展点：
```java
Protocol protocol= ExtensionLoader.getExtensionLoader(Protocol.class).getAdaptiveExtension();
```
但是，在 Protocol 接口的源码中，自适应扩展点的声明在方法层面上，所以它和类级别的声明不一样。这里的 protocol 实例，是一个动态代理类，基于 javassist 动态生成的字节码来实现方法级别的自适应调用。简单来说，调用 export 方法时，会根据上下文自动匹配到某个具体的实现类的 export 方法中。

基于 Protocol 的自适应扩展点方法 ExtensionLoader.getExtensionLoader(Protocol.class).getAdaptiveExtension()来分析它的源码实现。从源码来看，getAdaptiveExtension 方法非常简单，只做了两件事：

1. 从缓存中获取自适应扩展点实例。
2. 如果缓存未命中，则通过 createAdaptiveExtension 创建自适应扩展点。

### Dubbo 中的 IoC 和 AOP

IoC 中一个非常重要的思想是，在系统运行时，动态地向某个对象提供它所需要的其他对象，这种机制是通过 Dependency Injection(依赖注入)来实现的。

injectExtension 就是依赖注入的实现，整体逻辑比较简单：
- 遍历被加载的扩展类中所有的 set 方法。
- 得到 st 方法中的参数类型，如果参数类型是对象类型，则获得这个 set 方法中的属性名称。
- 使用自适应扩展点加载该属性名称对应的扩展类。
- 调用 set 方法完成赋值。

AOP 全称为 Aspect Oriented Programming,意思是面向切面编程，它是一种思想或者编程范式。它的主要意图是把业务逻辑和功能逻辑分离，然后在运行期间或者类加载期间进行织入。这样做的好处是，可以降低代码的复杂性，以及提高重用性。

```java
instance injectExtension((T)wrapperclass.getConstructor(type).newInstance(instance));
```
其中分别用到了依赖注入和 AOP 思想，AOP 思想的体现是基于 Wrapper 装饰器类实现对原有的扩展类 instance 进行包装。

### Dubbo 和 Spring 完美集成的原理

在 Spring Boot 集成 Dubbo 这个案例中，服务发布主要有以下几个步骤：
1. 添加 dubbo-spring-boot-starter 依赖。
2. 定义 @org.apache.dubbo.config.annotation.Service 注解。
3. 声明@DubboComponentScan,用于扫描@Service 注解。
基于前面的分析，其实不难猜出它的实现原理。@Service 与 Spring 中的@org.springframework,stereotype.Service,用于实现*Dubbo 服务的暴露*。与它相对应的是 *@Reference* ,它的作用类似于 Spring 中的@Autowired。
而@DubboComponentScan 和 Spring 中的@ComponentScan 作用类似，用于扫描@Service、@Reference 等注解。


## 本章小结

前面部分的内容比较好理解，源码部分需要稍微花点时间。笔者建议我们结合本书上的几个关键点，去官网下载源码逐步解读。在笔者看来，**看源码不是目的，它是一种思想上的交流**，好的设计和好的思想在合适的时机我们是可以直接借鉴过来的。



# 第五章、服务注册与发现

在微服务架构下，一个业务服务会被拆分成多个微服务，各个服务之间相互通信完成整体的功能。另外，为了避免单点故障，微服务都会采取集群方式的高可用部署，集群规模越大，性能也会越高，如图 5-1 所示。

![](http://qnpicmap.fcsluck.top/pics/202312091529002.png)


服务消费者要去调用多个服务提供者组成的集群。首先，服务消费者需要在本地配置文件中**维护服务提供者集群的每个节点的请求地址**。其次，服务提供者集群中如果**某个节点下线或者宕机，服务消费者的本地配置中需要同步删除这个节点的请求地址**，防止请求发送到已宕机的节点上造成请求失败。为了解决这类的问题，就需要引入服务注册中心，它主要有以下功能：

- 服务地址的管理
- 服务注册
- 服务动态感知
能够实现这类功能的组件很多，比如 ZooKeeper、Eureka、Consul、Etcd、Nacos 等。

## Alibaba Nacos 概念

Ncos 致力于解决微服务中的统一配置、服务注册与发现等问题。它提供了一组简单易用的特性集，帮助开发者快速实现动态服务发现、服务配置、服务元数据及流量管理，Nacos 的关键特性如下。

1. **服务发现和服务健康监测**
Nacos 支持*基于 DNS 和基于 RPC 的服务发现*。服务提供者使用原生 SDK、OpenAPI 或一个独立的 Agent TODO 注册 Service 后，服务消费者可以使用 DNS 或 HTTP&API 查找和发现服务。
Nacos 提供对服务的实时的健康检查，阻止向不健康的主机或服务实例发送请求。Nacos 支持传输层(PING 或 TCP)和应用层（如 HTTP、MySQL、用户自定义）的健康检查。对于复杂的云环境和网络拓扑环境中（如 VPC、边缘网络等）服务的健康检查，Nacos 提供了**agent 上报和服务端主动检测**两种健康检查模式。Nacos 还提供了统一的健康检查仪表盘，帮助用户根据健康状态管理服务的可用性及流量。

2. **动态配置服务**
业务服务一般都会维护一个本地配置文件，然后把一些常量配置到这个文件中。这种方式在某些场景中会存在问题，比如配置需要变更时要重新部署应用。而动态配置服务可以以中心化、外部化和动态化的方式管理所有环境的应用配置和服务配置，可以使配置管理变得更加高效和敏捷。配置中心化管理让实现无状态服务变得更简单，让服务按需弹性扩展变得更容易。
另外，Nacos 提供了一个简洁易用的 UI(控制台样例 Demo)帮助用户管理所有服务和应用的配置。Nacos 还提供了包括配置版本跟踪、金丝雀发布、一键回滚配置及客户端配置更新状态跟踪在内的一系列开箱即用的配置管理特性，帮助用户更安全地在生产环境中管理配置变更，降低配置变更带来的风险。
3. **动态 DNS 服务**
动态 DNS 服务支持权重路由，让开发者更容易地实现中间层负载均衡、更灵活的路由策略、流量控制，以及数据中心内网的简单 DNS 解析服务。
4. **服务及其元数据管理**
Nacos 可以使开发者从微服务平台建设的视角管理数据中心的所有服务及元数据，包括管理服务的描述、生命周期、服务的静态依赖分析、服务的健康状态、服务的流量管理、路由及安全策略、服务的 SLA 及最重要的 metrics 统计数据。


## Nacos 基本用法

本地直接部署和 docker 部署 nacos 方式详见[各种环境配置](各种环境配置.md).
### Nacos 集成 Spring Boot 实现服务注册与发现

> 单模块打包方式为 jar，多模块打包方式为 pom

```xml
<packaging>pom</packaging> 多模块
<packaging>jar</packaging> 单模块
```

spring-boot 版本为 2.6.13，spring-cloud-alibaba 版本为 2021.0.5.0，本节将使用该版本实现简单的 nacos 服务注册

1. 新建 nacos 的 springboot 项目，设置 pom 配置文件。
*父项目对依赖进行版本管理，其配置文件如下*：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.fcs</groupId>
    <artifactId>SpringCloud_Alibaba</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>SpringCloud_Alibaba</name>
    <description>SpringCloud_Alibaba</description>
    <packaging>pom</packaging>

    <modules>
        <module>nacos</module>
    </modules>

    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <spring-boot.version>2.6.13</spring-boot.version>
        <spring-cloud-alibaba.version>2021.0.5.0</spring-cloud-alibaba.version>
    </properties>
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>${spring-cloud-alibaba.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>

```
*子项目实现 nacos 服务注册，其配置文件如下*：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.fcs</groupId>
        <artifactId>SpringCloud_Alibaba</artifactId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>

    <artifactId>nacos</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>nacos</name>
    <description>nacos</description>
    <packaging>jar</packaging>


    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring-boot.version}</version>
                <configuration>
                    <mainClass>com.fcs.NacosApplication</mainClass>
                    <skip>true</skip>
                </configuration>
                <executions>
                    <execution>
                        <id>repackage</id>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

</project>

```

### Nacos 的高可用部署

在分布式架构中，任何中间件或者应用都不允许单点存在，所以开源组件一般都会自己支持高可用集群解决方案。如图 5-2 所示，Nacos 提供了类似于 ZooKeeper 的集群架构，包含一个 Leader 节点和多个 Follower 节点。和 ZooKeeper 不同的是，它的数据一致性算法采用的是 **Raft**,同样采用了该算法的中间件有 Redis Sentinel 的 Leader 选举、Etcd 等。

![](https://qnpicmap.fcsluck.top/pics/202312131639911.png)

#### 安装环境要求

请确保在环境中安装使用：
- 64 bit OS Linux/UNIX/Mac,推荐使用 Linux 系统。
- 64 bit JDK1.8 及以上，下载并配置。
- Maven3.2.x 及以上，下载并配置。
- 3 个或 3 个以上 Nacos 节点才能构成集群。
- MySQL 数据库。


#### 安装包及环境准备

准备 3 台服务器，笔者采用的是 Centos 7.x 系统。
- 下载安装包，分别进行解压：tar-zxvf nacos-server-1.1.4.tar.gz 或者 unzip nacos-server-1.1.4.zip。
- 解压后会得到 5 个文件夹：bin(服务启动/停止脚本)、conf(配置文件)、logs(日志)、data(derby 数据库存储)、target(编译打包后的文件)。

#### 集群配置

在 conf 目录下包含以下文件。
- application.properties: Spring Boot 项目默认的配置文件。
- cluster.conf.example:集群配置样例文件。
- nacos-mysql.sql:MySQL 数据库脚本。Nacos 支持 Derby 和 MySQL 两种持久化机制，默认采用 Derby 数据库。如果采用 MySQL,需要运行该脚本创建数据库和表。
- nacos-logback.xml:Nacos 日志配置文件。
配置 Nacos 集群需要用到 cluster.conf 文件，我们可以直接重命名提供的 example 文件，修改该配置信息如下：

```conf
192.168.13.104:8848 //ip地址必须是内网ip，不能是localhost/127.0.0.1
192.168.13.106:8848
192.168.13.183:8848
```

这 3 台机器中的 cluster.conf 配置保持一致。由于这 3 台机器之间需要彼此通信，所以在部署的时候需要防火墙对外开放 8848 端口。
具体配置由[各种环境配置](各种环境配置.md)中的 nacos 部分可见，连接外部数据库时新建的 nacos 用户的密码要用 mysql_native_password，否则会报错连不上外部数据库。
集群部署结果如下图所示：

![](https://qnpicmap.fcsluck.top/pics/202312131732523.png)

### Dubbo使用Nacos实现注册中心

Nacos作为Spring Cloud Alibaba中服务注册与发现的核心组件，可以很好地帮助开发者将服务自动注册到Nacos服务端，并且能够动态感知和刷新某个服务实例的服务列表。使用SpringCloud Alibaba Nacos Discovery可以基于Spring Cloud规范快速接入Nacos,实现服务注册与发现功能。
在本节中，我们通过将Spring Cloud Alibaba Nacos Discovery集成到Spring Cloud AlibabaDubbo,完成服务注册与发现的功能。
Dubbo可以支持多种注册中心，比如在前面章节中讲的ZooKeeper,以及Consul、Nacos等。本节主要讲解如何使用Nacos作为Dubbo服务的注册中心，为Dubbo提供服务注册与发现的功能，实现步骤如下。
#### 服务端

1. 创建一个普通Maven项目spring-boot-dubbo-nacos-sample,添加两个模块：nacos-sample-api 和 nacos-sample-provider。其中，nacos-sample-provider是一个Spring Boot工程。
2. 在nacos-sample-api中声明接口。

```java
public interface IHelloService{
String sayHello(String name);
)
```

3. 在nacos-sample-provider中添加依赖。
```xml
    <dependencies>
        <!--        spring-cloud-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter</artifactId>
        </dependency>
        <!--        dubbo-alibaba-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-dubbo</artifactId>
        </dependency>               
        <!--        nacos-discovery-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <!--        sample-api-->
        <dependency>
            <groupId>org.fcs</groupId>
            <artifactId>sample-api</artifactId>
            <version>0.0.1-SNAPSHOT</version>
        </dependency>
    </dependencies>
```

上述依赖包的简单说明如下：
- spring-cloud-starter: Spring Cloud核心包。
- spring-cloud-starter-dubbo,Dubbo的Starter组件，添加Dubbo依赖。
- spring-cloud-starter-alibaba-nacos-discovery,基于Nacos的服务注册与发现。
- nacos-sample-api,接口定义类的依赖。
4. 创建HelloServicelmpl类，实现IHelloService接口。

```java
@Service  
public class HelloServiceImpl implements IHelloService {  
    @Value("${dubbo.application.name}")  
    private String serviceName;  
  
    @Override  
    public String sayHello(String name) {  
        return String.format("[%s]:Hello,%s", serviceName, name);  
    }  
}
```

5. 修改application.yml 配置。仅将dubbo.registry.address中配置的协议改成了 `spring-cloud://${spring.cloud.nacos.discovery.server-addr}`,基于Nacos协议
```yml
server:
  port: 8081
spring:
  main:
    allow-bean-definition-overriding: true #Spring Boot 2.1 需要设定,允许覆盖bean
  application:
    name: spring-boot-dubbo-nacos-provider
  cloud:
    nacos:
      discovery:
        server-addr: 8.130.88.159:8848
dubbo:
  scan:
    base-packages: com.fcs.service  # 指定要扫描远程调用接口实现类的包路径
  registry:
    address: spring-cloud://${spring.cloud.nacos.discovery.server-addr}
    timeout: 60000
  protocol:
    name: dubbo
    port: -1
  application:
    #    name: ${spring.application.name}  #dubbo服务名称供消费者订阅
    name: spring-boot-dubbo-nacos-provider  #dubbo服务名称供消费者订阅
    qos-enable: false #dubbo运维服务是否开启
  consumer:
    check: false # 消费者是否检查版本
```

以上配置的简单说明如下。
- dubbo.scan.base-packages:功能等同于@DubboComponentScan,指定Dubbo*服务实现类的扫描包路径*。
- dubbo.registry.address:Dubbo服务注册中心的配置地址，它的值spring-cloud://localhost表示挂载到Spring Cloud注册中心，不配置的话会提示没有配置注册中心的错误。
- spring.cloud.nacos.discovery.server-addr:Nacos服务注册中心的地址。

6. 运行Spring Boot启动类，注意需要声明DubboComponentScan。
```java
@SpringBootApplication  
@DubboComponentScan  
@EnableDubbo
@EnableDiscoveryClient  
public class SampleProviderApplication {  
    public static void main(String[] args) {  
        SpringApplication.run(SampleProviderApplication.class, args);  
    }  
}
```

服务启动成功之后，访问Ncos控制台，进入“服务管理”→“服务列表”，如图下图所示，可以看到所有注册在Nacos上的服务。

![](https://qnpicmap.fcsluck.top/pics/202312132000943.png)

![](https://qnpicmap.fcsluck.top/pics/202312132036009.png)

细心的读者会发现，基于Spring Cloud Alibaba Nacos Discovery实现服务注册时，元数据中发布的服务接口是com.alibaba.cloud.dubbo.service.DubboMetadataService。那么消费者要怎么去找到IHelloService呢？别急，进入Nacos控制台的“配置列表”，可以看到如图5-8所示的配置信息。
实际上这里把发布的接口信息存储到了配置中心，并且建立了映射关系，从而使得消费者在访问服务的时候能够找到目标接口进行调用。至此，服务端便全部开发完了，接下来我们开始消费端的开发。

#### 消费端开发

1. 创建一个Spring Boot项目spring-cloud-nacos-consumer。
2. 添加相关Maven依赖。
```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--        spring-cloud-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter</artifactId>
        </dependency>
        <!--lombok-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-dubbo</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!--        sample-api-->
        <dependency>
            <groupId>org.fcs</groupId>
            <artifactId>sample-api</artifactId>
            <version>0.0.1-SNAPSHOT</version>
        </dependency>
    </dependencies>
```

3. 在application.yml 中添加配置信息。
```yml
server:  
  port: 8082  
spring:  
  main:  
    allow-bean-definition-overriding: true #Spring Boot 2.1 需要设定,允许覆盖bean  
  application:  
    name: spring-boot-dubbo-nacos-consumer  
  cloud:  
    nacos:  
      discovery:  
        server-addr: 8.130.88.159:8848  
dubbo:  
  registry:  
    address: spring-cloud://${spring.cloud.nacos.discovery.server-addr}  
    timeout: 60000  
  protocol:  
    name: dubbo  
    port: -1  
  application:  
    name: spring-boot-dubbo-nacos-consumer  #dubbo服务名称供消费者订阅  
    qos-enable: false #dubbo运维服务是否开启  
  consumer:  
    check: false # 消费者是否检查版本  
  cloud:  
    subscribed-services: spring-boot-dubbo-nacos-provider
```

4. 定义HelloController,用于测试Dubbo服务的访问。

```java
@RestController  
public class HelloController {  
    @Reference  
    private IHelloService iHelloService;  
  
    @GetMapping("/say")  
    public String sayHello() {  
        return iHelloService.sayHello("Mic");  
    }  
}
```

5. 启动服务

```java
@SpringBootApplication  
public class SampleConsumerApplication {  
    public static void main(String[] args) {  
        SpringApplication.run(SampleConsumerApplication.class, args);  
    }  
}
```

调用结果如下图所示：

![](https://qnpicmap.fcsluck.top/pics/202312132059402.png)

![](https://qnpicmap.fcsluck.top/pics/202312132059201.png)


与第4章中Dubbo Spring Cloud的代码相比，除了注册中心从ZooKeeper变成Nacos,其他基本没什么变化，因为这两者都是基于Spring Cloud标准实现的，而这些标准化的定义都抽象到了Spring-Cloud-Common包中。在后续的组件集成过程中，会以本节中创建的项目进行集成。

### Nacos实现原理分析

#### Nacos架构图

Nacos官方提供的架构图如下所示，我们简单来分析一下它的模块组成。

![|700](https://qnpicmap.fcsluck.top/pics/202312132104508.png)

- Provider APP:服务提供者。
- Consumer APP:服务消费者。
- Name Server:通过VIP(Vritual IP)或者DNS的方式实现Nacos高可用集群的服务路由。
- Nacos Server:Nacos服务提供者，里面包含的Open API是功能访问入口，Config Service、Naming Service是Nacos提供的配置服务、名字服务模块。Consistency Protocol是一致性协议，用来实现Nacos集群节点的数据同步，这里使用的是Raft算法（使用类似算法的中间件还有Etcd、Redis哨兵选举)。
- Nacos Console:Nacos控制台。

整体来说，服务提供者通过VIP(Virtual IP)访问Nacos Server高可用集群，基于Open API完成服务的注册和服务的查询。Nacos Server本身可以支持主备模式，所以底层会采用数据一致性算法来完成从节点的数据同步。服务消费者也是如此，基于Open API从Nacos Server中查询服务列表。

#### 注册中心的原理

服务注册的功能主要体现在：

- 服务实例在**启动时注册到服务注册表，并在关闭时注销**。
- 服务消费者**查询服务注册表，获得可用实例**。
- 服务注册中心需要调用服务实例的健康检查API来验证它是否能够处理请求。

Nacos服务注册与发现的实现原理如下图所示：

![](https://qnpicmap.fcsluck.top/pics/202312132137209.png)











# 第九章、RocketMQ 分布式消息通信


在微服务架构下，一个业务服务会被拆分成多个微服务，各个服务之间相互通信完成整体的功能。系统间的通信协作通常有两种。

- Http/RPC 通信：优点是通信实时，缺点是服务之间的耦合性高。
- 消息通信：优点是降低了服务之间的耦合性，提高了系统的处理能力，缺点是通信非实时。

例如，用户交易完成后发送短信通知，假设交易耗时 5ms,发短信耗时 3ms。如果是实时通信，那么用户收到返回结果耗时 8s,但发短信是非核心步骤，可以从主流程中剥离出来异步处理，那么用户收到返回结果耗时就可以从 8ms 下降到 5ms。

## 初识 RocketMQ

RocketMO 是一个低延迟、高可靠、可伸缩、易于使用的分布式消息中间件（也称消息队列），经过阿里巴巴多年双 I1 的验证，是由阿里巴巴开源捐献给 Apache 的顶级项目。RocketMQ 具有**高吞吐、低延迟、海量消息**堆积等优点，同时提供**顺序消息、事务消息、定时消息、消息重试与追踪**等功能，非常适合在电商、金融等领域广泛使用。

### RocketMQ 的应用场景

RocketMO 的应用场景如下。
- 削峰填谷：诸如秒杀、抢红包、企业开门红等大型活动皆会带来较高的流量脉冲，很可能因没做相应的保护而导致系统超负荷甚至崩溃，或因限制太过导致请求大量失败而影响用户体验，RocketMO 可提供削峰填谷的服务来解决这些问题。
- 异步解耦：交易系统作为淘宝/天猫主站最核心的系统，每笔交易订单数据的产生会引起几百个下游业务系统的关注，包括物流、购物车、积分、流计算分析等，整体业务系统庞大而且复杂，RocketMQ 可实现异步通信和应用解耦，确保主站业务的连续性。
- 顺序收发：细数一下，日常需要保证顺序的应用场景非常多，例如证券交易过程中的时间优先原则，交易系统中的订单创建、支付、退款等流程，航班中的旅客登机消息处理等。与先进先出(First In First Out,缩写 FIFO)原理类似，RocketMQ 提供的顺序消息即保证消息的 FIFO。
- 分布式事务一致性：交易系统、红包等场景需要确保数据的最终一致性，大量引入 RocketMQ 的分布式事务，既可以实现系统之间的解耦，又可以保证最终的数据一致性。
- 大数据分析：数据在“流动”中产生价值，传统数据分析大都基于批量计算模型，无法做到实时的数据分析，利用 RocketMQ 与流式计算引擎相结合，可以很方便地实现对业务数据进行实时分析。
- 分布式缓存同步：天猫双 11 大促，各个分会场琳琅满目的商品需要实时感知价格的变化，大量并发访问会导致会场页面响应时间长，集中式缓存因为带宽瓶颈限制商品变更的访问流量，通过 RocketMQ 构建分布式缓存，可实时通知商品数据的变化。

### RocketMQ 的安装

rocketmq 的安装教程由[各种环境配置](各种环境配置.md)可见。

### RocketMQ 基本用法

#### RocketMQ 发送消息

Spring Cloud Alibaba 已集成 RocketMQ,使用 Spring Cloud Stream 对 RocketMQ 发送和接收消息。
1. 在 pom.xml 中引入 Jar 包。

```xml
<dependency>
<groupId>com.alibaba.cloud</groupId>
<artifactId>spring-cloud-stream-binder-rocketmq</artifactId>
</dependency>
<dependency>
<groupId>org.springframework.boot</groupId>
<artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
2. 配置 application.yml。
```yml
server:  
  port: 8081  
spring:  
  cloud:  
    stream:  
      rocketmq:  
        binder:  
          name-server: 8.130.88.159:9876  
        bindings:
	        producer:  
	            group: demo-group
      bindings:  
        output:  
          destination: TopicTest  
          
```

name-server 指定 RocketMQ 的 NameServer 地址，将指定名称为 output 的 Binding 消息发送到 TopicTest。
3. 使用 Binder 发送消息。

```java
@EnableBinding({Source.class})
@SpringBootApplication
public class ProducerApplication {
	public static void main(String[]args){
	SpringApplication.run(ProducerApplication.class,args);
	}
}	

@RestController
public class SendController {
	@Autowired
	private Source source;
	@GetMapping(value "/send")
	public String send(String msg){
		MessageBuilder builder MessageBuilder.withPayload(msg);
		Messagemessage builder.build();
		source.output().send(message);
		return "Hello RocketMQ Binder,send "msg;
	}
}
```

`@EnableBinding({Source.class})` 表示绑定配置文件中名称为 output 的消息通道 Binding,Source 类中定义的消息通道名称为 output。发送 HTTP 请求 http:/localhost:8081/send?msg=tcever 将消息发送到 RocketMQ 中。
在实际开发场景中会存在多个发送消息通道，可以自定义消息通道的名称，参考 Source 类自定义一个接口，修改通道名称和相关配置即可。








# 参考书籍


1. [Spring Cloud Alibaba 微服务原理与实战 (豆瓣)](https://book.douban.com/subject/35041576/?from=mdouban)
2. [微信公众平台](https://mp.weixin.qq.com/s/G1EE5WSA8DzkRmWvRGr_9w)

```cardlink
url: https://book.douban.com/subject/35041576/?from=mdouban
title: "Spring Cloud Alibaba 微服务原理与实战"
description: "《Spring Cloud Alibaba 微服务原理与实战》针对 Spring Cloud Alibaba 生态下的技术组件从应用到原理进行全面的分析，涉及的技术组件包括分布式服务治理 Dubbo、服务配置..."
host: book.douban.com
image: https://img9.doubanio.com/view/subject/l/public/s33625905.jpg
```

```cardlink
url: https://mp.weixin.qq.com/s/G1EE5WSA8DzkRmWvRGr_9w
title: "别再乱学微服务了，这才使用 Spring Cloud 微服务的正确姿势！"
description: "真香！！"
host: mp.weixin.qq.com
image: http://mmbiz.qpic.cn/mmbiz_jpg/TNUwKhV0JpQ99S3Vc6iaJftFkZwboGpo0YLicON8QuXecf38gmquvF6dk8sDXHOTh5EsfqicCq5UrTdzHfyBliaKKg/0?wx_fmt=jpeg
```