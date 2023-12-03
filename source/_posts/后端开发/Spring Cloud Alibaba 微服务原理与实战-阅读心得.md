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
<div style="width=100%;height=100%">
    <a 
      class="book-container"
      href="https://online.fliphtml5.com/hysru/xbji/"
      target="_blank"
      rel="noreferrer noopener"
    >
      <div class="book">
        <img
          alt="fcs"
          src="https://orly.nanmu.me/api/generate?g_loc=BR&g_text=%E5%88%9D%E8%A7%81%E6%97%B6%E6%83%8A%E9%B8%BF&color=f9bc00&img_id=40&author=fcs&top_text=%E5%BE%AE%E6%9C%8D%E5%8A%A1%E6%9E%B6%E6%9E%84%E6%A6%82%E5%BF%B5%E4%BB%8E0%E5%88%B01&title=%E5%BE%AE%E6%9C%8D%E5%8A%A1What%3F" />
      </div>
    </a>
</div>





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
![|725](http://qnpicmap.fcsluck.top/pics/202311281458557.png)

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

> 本章主要分析了Spring Boot中的自动装配的基本原理，并且通过实现一个自定义Starter的方式加深了我们对于自动装配的理解。由于Spring Cloud生态中的组件，都是基于Spring Boot框架来实现的，了解Spring Boot的基本原理将有助于大家对后续内容的理解，*工欲善其事必先利其器*，读者我感悟到，**比了解技术的基本使用方法更重要的是了解技术产生的背景及核心原理**。


# 第四章、微服务架构下的服务治理









# 参考书籍


1. [Spring Cloud Alibaba 微服务原理与实战 (豆瓣)](https://book.douban.com/subject/35041576/?from=mdouban)
2. [微信公众平台](https://mp.weixin.qq.com/s/G1EE5WSA8DzkRmWvRGr_9w)

```cardlink
url: https://book.douban.com/subject/35041576/?from=mdouban
title: "Spring Cloud Alibaba 微服务原理与实战"
description: "《Spring Cloud Alibaba微服务原理与实战》针对Spring Cloud Alibaba生态下的技术组件从应用到原理进行全面的分析，涉及的技术组件包括分布式服务治理Dubbo、服务配置..."
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