---
title: SpringCloud Alibaba-微服务进阶
date: 2023-11-16 15:49:01
tags:
  - springcloud
  - SpringCloud-Alibaba
sticky: 75
excerpt: 一些关于springcloud alibaba微服务框架中间件的学习记录。
author: fcs
---
![](https://picsum.photos/800/250)
# 微服务进阶
![image-20230306230950443](https://s2.loli.net/2023/03/06/V1dFqQMR7T2GzSJ.png)
前面我们了解了微服务的一套解决方案，但是它是基于 Netflix 的解决方案，实际上我们发现，很多框架都已经停止维护了，来看看目前我们所认识到的 SpringCloud 各大组件的维护情况：
* **注册中心：** Eureka（属于*Netflix*，2. x 版本不再开源，1. x 版本仍在更新）
* **服务调用：** Ribbon（属于*Netflix*，停止更新，已经彻底被移除）、SpringCloud Loadbalancer（属于*SpringCloud*官方，目前的默认方案）
* **服务降级：** Hystrix（属于*Netflix*，停止更新，已经彻底被移除）
* **路由网关：** Zuul（属于*Netflix*，停止更新，已经彻底被移除）、Gateway（属于*SpringCloud*官方，推荐方案）
* **配置中心：** Config（属于*SpringCloud*官方）

可见，我们之前使用的整套解决方案中，超过半数的组件都已经处于不可用状态，并且部分组件都是 SpringCloud 官方出手提供框架进行解决，因此，寻找一套更好的解决方案势在必行，也就引出了我们本章的主角：**SpringCloud Alibaba**
阿里巴巴作为业界的互联网大厂，给出了一套全新的解决方案，官方网站（中文）： https://spring-cloud-alibaba-group.github.io/github-pages/2021/zh-cn/index.html
> Spring Cloud Alibaba 致力于提供微服务开发的一站式解决方案。此项目包含开发分布式应用服务的必需组件，方便开发者通过 Spring Cloud 编程模型轻松使用这些组件来开发分布式应用服务。
>
> 依托 Spring Cloud Alibaba，您只需要添加一些注解和少量配置，就可以将 Spring Cloud 应用接入阿里分布式应用解决方案，通过阿里中间件来迅速搭建分布式应用系统。

目前 Spring Cloud Alibaba 提供了如下功能:
1. **服务限流降级**：支持 WebServlet、WebFlux, OpenFeign、RestTemplate、Dubbo 限流降级功能的接入，可以在运行时通过控制台实时修改限流降级规则，还支持查看限流降级 Metrics 监控。
2. **服务注册与发现**：适配 Spring Cloud 服务注册与发现标准，默认集成了 Ribbon 的支持。
3. **分布式配置管理**：支持分布式系统中的外部化配置，配置更改时自动刷新。
4. **Rpc 服务**：扩展 Spring Cloud 客户端 RestTemplate 和 OpenFeign，支持调用 Dubbo RPC 服务
5. **消息驱动能力**：基于 Spring Cloud Stream 为微服务应用构建消息驱动能力。
6. **分布式事务**：使用 @GlobalTransactional 注解，高效并且对业务零侵入地解决分布式事务问题。
7. **阿里云对象存储**：阿里云提供的海量、安全、低成本、高可靠的云存储服务。支持在任何应用、任何时间、任何地点存储和访问任意类型的数据。
8. **分布式任务调度**：提供秒级、精准、高可靠、高可用的定时（基于 Cron 表达式）任务调度服务。同时提供分布式的任务执行模型，如网格任务。网格任务支持海量子任务均匀分配到所有 Worker（schedulerx-client）上执行。
9. **阿里云短信服务**：覆盖全球的短信服务，友好、高效、智能的互联化通讯能力，帮助企业迅速搭建客户触达通道。

可以看到，SpringCloudAlibaba 实际上是对我们的 SpringCloud 组件增强功能，是 SpringCloud 的增强框架，可以兼容 SpringCloud 原生组件和 SpringCloudAlibaba 的组件。
开始学习之前，把我们之前打包好的拆分项目解压，我们将基于它进行讲解。

***
![image-20230306230942876](https://s2.loli.net/2023/03/06/pQkSrLx9NZRn8Ub.png)
## Nacos 更加全能的注册中心
Nacos（**Na**ming **Co**nfiguration **S**ervice）是一款阿里巴巴开源的服务注册与发现、配置管理的组件，相当于是 Eureka+Config 的组合形态。
### 安装与部署
Nacos 服务器是独立安装部署的，因此我们需要下载最新的 Nacos 服务端程序，下载地址： https://github.com/alibaba/nacos ，连不上可以到视频下方云盘中下载。
![image-20230306231045825](https://s2.loli.net/2023/03/06/VStPIABaXxMp2N9.png)
可以看到目前最新的版本是 `1.4.3` 版本（2022 年 2 月 27 日发布的），我们直接下载 `zip` 文件即可。
接着我们将文件进行解压，得到以下内容：
![image-20230306231054919](https://s2.loli.net/2023/03/06/wWbuXRGizrQCT8J.png)
我们直接将其拖入到项目文件夹下，便于我们一会在 IDEA 内部启动，接着添加运行配置：
![image-20230306231104823](https://s2.loli.net/2023/03/06/bM8doEZPth7DHfe.png)
其中 `-m standalone` 表示单节点模式，Mac 和 Linux 下记得将解释器设定为 `/bin/bash`，由于 Nacos 在 Mac/Linux 默认是后台启动模式，我们修改一下它的 bash 文件，让它变成前台启动，这样 IDEA 关闭了 Nacos 就自动关闭了，否则开发环境下很容易忘记关：
```bash
# 注释掉 nohup $JAVA ${JAVA_OPT} nacos.nacos >> ${BASE_DIR}/logs/start.out 2>&1 &
# 替换成下面的
$JAVA ${JAVA_OPT} nacos.nacos
```
接着我们点击启动：
![image-20230306231113946](https://s2.loli.net/2023/03/06/O3pMSvDbxPKYT5q.png)
OK，启动成功，可以看到它的管理页面地址也是给我们贴出来了： http://localhost:8848/nacos/index.html ，访问这个地址：
![image-20230306231125828](https://s2.loli.net/2023/03/06/sbKTUqhLViIfrmR.png)
默认的用户名和管理员密码都是 `nacos`，直接登陆即可，可以看到进入管理页面之后功能也是相当丰富：
![image-20230306231150574](https://s2.loli.net/2023/03/06/dom3WpJsiajgCE7.png)
至此，Nacos 的安装与部署完成。
### 服务注册与发现
现在我们要实现基于 Nacos 的服务注册与发现，那么就需要导入 SpringCloudAlibaba 相关的依赖，我们在父工程将依赖进行管理：
```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.2.0</version>
        </dependency>
      	<!-- 这里引入最新的SpringCloud依赖 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>2021.0.1</version>
          	<type>pom</type>
            <scope>import</scope>
        </dependency>
     	  <!-- 这里引入最新的SpringCloudAlibaba依赖，2021.0.1.0版本支持SpringBoot2.6.X -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>2021.0.1.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```
接着我们就可以在子项目中添加**服务发现依赖**了，比如我们以图书服务为例：
```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```
和注册到 Eureka 一样，我们也需要在配置文件中配置 Nacos 注册中心的地址：
```yaml
server:
	# 之后所有的图书服务节点就81XX端口
  port: 8101
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://cloudstudy.mysql.cn-chengdu.rds.aliyuncs.com:3306/cloudstudy
    username: test
    password: 123456
  # 应用名称 bookservice
  application:
    name: bookservice
  cloud:
    nacos:
      discovery:
        # 配置Nacos注册中心地址
        server-addr: localhost:8848
```
接着启动我们的图书服务，可以在 Nacos 的服务列表中找到：
![image-20230306231202683](https://s2.loli.net/2023/03/06/9PLBGOXoaERnUwM.png)
按照同样的方法，我们接着将另外两个服务也注册到 Nacos 中：
![image-20230306231211930](https://s2.loli.net/2023/03/06/K6VBtqEWSLnMp21.png)
接着我们使用 OpenFeign，实现**服务发现远程调用以及负载均衡**，导入依赖：
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
<!-- 这里需要单独导入LoadBalancer依赖 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```
编写接口：
```java
@FeignClient("userservice")
public interface UserClient {
    @RequestMapping("/user/{uid}")
    User getUserById(@PathVariable("uid") int uid);
}
```
```java
@FeignClient("bookservice")
public interface BookClient {
    @RequestMapping("/book/{bid}")
    Book getBookById(@PathVariable("bid") int bid);
}
```
```java
@Service
public class BorrowServiceImpl implements BorrowService{
    @Resource
    BorrowMapper mapper;
    @Resource
    UserClient userClient;
    @Resource
    BookClient bookClient;
    @Override
    public UserBorrowDetail getUserBorrowDetailByUid(int uid) {
        List<Borrow> borrow = mapper.getBorrowsByUid(uid);
        User user = userClient.getUserById(uid);
        List<Book> bookList = borrow
                .stream()
                .map(b -> bookClient.getBookById(b.getBid()))
                .collect(Collectors.toList());
        return new UserBorrowDetail(user, bookList);
    }
}
```
```java
@EnableFeignClients
@SpringBootApplication
public class BorrowApplication {
    public static void main (String[] args) {
        SpringApplication.run (BorrowApplication. class, args);
    }
}
```
接着我们进行测试：
![image-20230306231226300](https://s2.loli.net/2023/03/06/HIGvXAad1EOVPt6.png)
测试正常，可以自动发现服务，接着我们来多配置几个实例，去掉图书服务和用户服务的端口配置：
![image-20230306231234119](https://s2.loli.net/2023/03/06/WZGdJ5BYpmbMuNT.png)
然后我们在图书服务和用户服务中添加一句打印方便之后查看：
```java
@RequestMapping ("/user/{uid}")
public User findUserById (@PathVariable ("uid") int uid){
    System.out.println ("调用用户服务");
    return service.getUserById (uid);
}
```
现在将全部服务启动：
![image-20230306231244149](https://s2.loli.net/2023/03/06/GCrm8wgWXLzYhtK.png)
可以看到 Nacos 中的实例数量已经显示为 `2`：
![image-20230306231251732](https://s2.loli.net/2023/03/06/p6iYrPa8e1btZkl.png)
接着我们调用借阅服务，看看能否负载均衡远程调用：
![image-20230306231259820](https://s2.loli.net/2023/03/06/jCl8RGhaIiUDBgm.png)
![image-20230306231306653](https://s2.loli.net/2023/03/06/2bWdfmnVOyGzlZr.png)
OK，负载均衡远程调用没有问题，这样我们就实现了基于 Nacos 的服务的注册与发现，实际上大致流程与 Eureka 一致。
值得注意的是，Nacos 区分了**临时实例和非临时实例**：
![image-20230306231317971](https://s2.loli.net/2023/03/06/cF5MoVX6vNnzx9j.png)
那么临时和非临时有什么区别呢？
* 临时实例：和 Eureka 一样，采用心跳机制向 Nacos 发送请求保持在线状态，一旦心跳停止，代表实例下线，不保留实例信息。
* 非临时实例：由 Nacos 主动进行联系，如果连接失败，那么不会移除实例信息，而是将健康状态设定为 false，相当于会对某个实例状态持续地进行监控。

我们可以通过配置文件进行修改临时实例：
```yaml
spring:
  application:
    name: borrowservice
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        # 将 ephemeral 修改为 false，表示非临时实例
        ephemeral: false
```
接着我们在 Nacos 中查看，可以发现实例已经不是临时的了：
![image-20230306231328378](https://s2.loli.net/2023/03/06/FdRTjlKszDoOPU3.png)
如果这时我们关闭此实例，那么会变成这样：
![image-20230306231337931](https://s2.loli.net/2023/03/06/R5Jyhl29UcvuOCb.png)
只是将健康状态变为 false，而不会删除实例的信息。
### 集群分区
实际上集群分区概念在之前的 Eureka 中也有出现，比如：
```yaml
eureka:
  client:
		fetch-registry: false
    register-with-eureka: false
    service-url:
      defaultZone: http://localhost:8888/eureka
      # 这个 defaultZone 是个啥玩意，为什么要用这个名称？为什么要要用这样的形式来声明注册中心？
```
在一个分布式应用中，相同服务的实例可能会在不同的机器、位置上启动，比如我们的用户管理服务，可能在成都有 1 台服务器部署、重庆有一台服务器部署，而这时，我们在成都的服务器上启动了借阅服务，那么如果我们的借阅服务现在要调用用户服务，就应该优先选择同一个区域的用户服务进行调用，这样会使得响应速度更快。
![image-20230306231411711](https://s2.loli.net/2023/03/06/szyGRrEfZ1KWmpj.png)
因此，我们可以对部署在不同机房的服务进行分区，可以看到实例的分区是默认：
![image-20230306231402008](https://s2.loli.net/2023/03/06/wlO9dQ1NtKCxFTi.png)
我们可以直接在配置文件中进行修改：
```yaml
spring:
  application:
    name: borrowservice
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        # 修改为重庆地区的集群
        cluster-name: Chongqing
```
当然由于我们这里使用的是不同的启动配置，直接在启动配置中添加环境变量 `spring. cloud. nacos. discovery. cluster-name` 也行，这里我们将用户服务和图书服务两个区域都分配一个，借阅服务就配置为成都地区：
![image-20230306231435388](https://s2.loli.net/2023/03/06/cwIhdCMmATELvlN.png)
修改完成之后，我们来尝试重新启动一下（Nacos 也要重启），观察 Nacos 中集群分布情况：
![image-20230306231443247](https://s2.loli.net/2023/03/06/jrYo3epaLMyQnu4.png)
可以看到现在有两个集群，并且都有一个实例正在运行。我们接着去调用借阅服务，但是发现并没有按照区域进行优先调用，而依然使用的是轮询模式的负载均衡调用。
我们必须要提供 Nacos 的负载均衡实现才能开启区域优先调用机制，只需要在配制文件中进行修改即可：
```yaml
spring:
  application:
    name: borrowservice
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        cluster-name: Chengdu
    # 将 loadbalancer 的 nacos 支持开启，集成 Nacos 负载均衡
    loadbalancer:
      nacos:
        enabled: true
```
现在我们重启借阅服务，会发现优先调用的是同区域的用户和图书服务，现在我们可以将成都地区的服务下线：
![image-20230306231453470](https://s2.loli.net/2023/03/06/s1ko9UcD4mMQ5fW.png)
可以看到，在下线之后，由于本区域内没有可用服务了，借阅服务将会调用重庆区域的用户服务。
除了根据区域优先调用之外，同一个区域内的实例也可以单独设置权重，Nacos 会优先选择权重更大的实例进行调用，我们可以直接在管理页面中进行配置：
![image-20230306231500731](https://s2.loli.net/2023/03/06/1pAckEZN5ltXKWG.png)
或是在配置文件中进行配置：
```yml
spring:
  application:
    name: borrowservice
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        cluster-name: Chengdu
        # 权重大小，越大越优先调用，默认为 1
        weight: 0.5
```
通过配置权重，某些性能不太好的机器就能够更少地被使用，而更多的使用那些网络良好性能更高的主机上的实例。
### 配置中心
前面我们学习了 SpringCloud Config，我们可以通过配置服务来加载远程配置，这样我们就可以在远端集中管理配置文件。
实际上我们可以在 `bootstrap. yml` 中配置远程配置文件获取，然后再进入到配置文件加载环节，而 Nacos 也支持这样的操作，使用方式也比较类似，比如我们现在想要将借阅服务的配置文件放到 Nacos 进行管理，那么这个时候就需要在 Nacos 中创建配置文件：
![image-20230306231534251](https://s2.loli.net/2023/03/06/6j2pAmdfyIGz9Cu.png)
将借阅服务的配置文件全部（当然正常情况下是不会全部 CV 的，只会复制那些需要经常修改的部分，这里为了省事就直接全部 CV 了）复制过来，注意**Data ID**的格式跟我们之前一样，`应用名称-环境. yml`，如果只编写应用名称，那么代表此配置文件无论在什么环境下都会使用，然后每个配置文件都可以进行分组，也算是一种分类方式：
![image-20230306231514151](https://s2.loli.net/2023/03/06/7ACoW3txIsjLzu2.png)
完成之后点击发布即可：
![image-20230306231522828](https://s2.loli.net/2023/03/06/alFpWGfNejImQEw.png)
然后在项目中导入依赖：
```xml
<dependency>
    <groupId>org. springframework. cloud</groupId>
    <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
<dependency>
    <groupId>com. alibaba. cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```
接着我们在借阅服务中添加 `bootstrap. yml` 文件：
```yaml
spring:
  application:
  	# 服务名称和配置文件保持一致
    name: borrowservice
  profiles:
  	# 环境也是和配置文件保持一致
    active: dev
  cloud:
    nacos:
      config:
      	# 配置文件后缀名
        file-extension: yml
        # 配置中心服务器地址，也就是 Nacos 地址
        server-addr: localhost:8848
```
现在我们启动服务试试看：
![image-20230306231605960](https://s2.loli.net/2023/03/06/5J4FfMgtGwZhP3C.png)
可以看到成功读取配置文件并启动了，实际上使用上来说跟之前的 Config 是基本一致的。
Nacos 还支持**配置文件的热更新**，比如我们在配置文件中添加了一个属性，而这个时候可能需要实时修改，并在后端实时更新，那么这种该怎么实现呢？我们创建一个新的 Controller：
```java
@RestController
public class TestController {
    @Value ("${test. txt}")  //我们从配置文件中读取 test. txt 的字符串值，作为 test 接口的返回值
    String txt;
    @RequestMapping ("/test")
    public String test (){
        return txt;
    }
}
```
我们修改一下配置文件，然后重启服务器：
![image-20230306231616512](https://s2.loli.net/2023/03/06/9xthuBpgFs4PTSq.png)
可以看到已经可以正常读取了：
![image-20230306231626447](https://s2.loli.net/2023/03/06/kacrSVGYMpwK2jx.png)
现在我们将配置文件的值进行修改：
![image-20230306231634007](https://s2.loli.net/2023/03/06/YLC2H6yGoVi5z1f.png)
再次访问接口，会发现没有发生变化：
![image-20230306231641913](https://s2.loli.net/2023/03/06/isTaOUQwMVWGCY9.png)
但是后台是成功检测到值更新了，但是值却没改变：
![image-20230306231656905](https://s2.loli.net/2023/03/06/dR4thB5JTk1cGjm.png)
那么如何才能实现配置热更新呢？我们可以像下面这样：
```java
@RestController
@RefreshScope   //添加此注解就能实现自动刷新了
public class TestController {
    @Value ("${test. txt}")
    String txt;
    @RequestMapping ("/test")
    public String test (){
        return txt;
    }
}
```
重启服务器，再次重复上述实验，成功。
### 命名空间
我们还可以将配置文件或是服务实例划分到不同的命名空间中，其实就是区分开发、生产环境或是引用归属之类的：
![image-20230306231706215](https://s2.loli.net/2023/03/06/7itUIhz3NupRdr6.png)
这里我们创建一个新的命名空间：
![image-20230306231713676](https://s2.loli.net/2023/03/06/DC2I1MvVFjYmPEq.png)
可以看到在 dev 命名空间下，没有任何配置文件和服务：
![image-20230306231723164](https://s2.loli.net/2023/03/06/Ek4APjgGcqbitNm.png)
我们在不同的命名空间下，实例和配置都是相互之间隔离的，我们也可以在配置文件中指定当前的命名空间。
### 实现高可用
由于 Nacos 暂不支持 Arm 架构芯片的 Mac 集群搭建，本小节用 Linxu 云主机（Nacos 比较吃内存，2 个 Nacos 服务器集群，至少 2G 内存）环境演示。
通过前面的学习，我们已经了解了如何使用 Nacos 以及 Nacos 的功能等，最后我们来看看，如果像之前 Eureka 一样，搭建 Nacos 集群，实现高可用。
官方方案： https://nacos.io/zh-cn/docs/cluster-mode-quick-start.html
![deployDnsVipMode.jpg](https://s2.loli.net/2023/03/06/H1AvxOK78yspP5k.jpg)
> http://ip1:port/openAPI 直连 ip 模式，机器挂则需要修改 ip 才可以使用。
>
> http://SLB:port/openAPI 挂载 SLB 模式 (内网 SLB，不可暴露到公网，以免带来安全风险)，直连 SLB 即可，下面挂 server 真实 ip，可读性不好。
>
> http://nacos.com:port/openAPI 域名 + SLB 模式 (内网 SLB，不可暴露到公网，以免带来安全风险)，可读性好，而且换 ip 方便，推荐模式

我们来看看它的架构设计，它推荐我们在所有的 Nacos 服务端之前建立一个负载均衡，我们通过访问负载均衡服务器来间接访问到各个 Nacos 服务器。实际上就，是比如有三个 Nacos 服务器做集群，但是每个服务不可能把每个 Nacos 都去访问一次进行注册，实际上只需要在任意一台 Nacos 服务器上注册即可，Nacos 服务器之间会自动同步信息，但是如果我们随便指定一台 Nacos 服务器进行注册，如果这台 Nacos 服务器挂了，但是其他 Nacos 服务器没挂，这样就没办法完成注册了，但是实际上整个集群还是可用的状态。
所以这里就需要在所有 Nacos 服务器之前搭建一个 SLB（服务器负载均衡），这样就可以避免上面的问题了。但是我们知道，如果要实现外界对服务访问的负载均衡，我们就得用比如之前说到的 Gateway 来实现，而这里实际上我们可以用一个更加方便的工具：Nginx，来实现（之前我们没讲过，但是使用起来很简单，放心后面会带着大家使用）
关于 SLB 最上方还有一个 DNS（我们在 `计算机网络` 这门课程中学习过），这个是因为 SLB 是裸 IP，如果 SLB 服务器修改了地址，那么所有微服务注册的地址也得改，所以这里是通过加域名，通过域名来访问，让 DNS 去解析真实 IP，这样就算改变 IP，只需要修改域名解析记录即可，域名地址是不会变化的。
最后就是 Nacos 的数据存储模式，在单节点的情况下，Nacos 实际上是将数据存放在自带的一个嵌入式数据库中：
![image-20230306231744022](https://s2.loli.net/2023/03/06/Fuxq9Dl3rGfnTZA.png)
而这种模式只适用于单节点，在多节点集群模式下，肯定是不能各存各的，所以，Nacos 提供了 MySQL 统一存储支持，我们只需要让所有的 Nacos 服务器连接 MySQL 进行数据存储即可，官方也提供好了 SQL 文件。
现在就可以开始了，第一步，我们直接导入数据库即可，文件在 conf 目录中：
![image-20230306231753589](https://s2.loli.net/2023/03/06/97suBpfdeF54rc2.png)
我们来将其导入到数据库，可以看到生成了很多的表：
![image-20230306231802722](https://s2.loli.net/2023/03/06/cf76RJ9VUiQBlje.png)
然后我们来创建两个 Nacos 服务器，做一个迷你的集群，这里使用 `scp` 命令将 nacos 服务端上传到 Linux 服务器（注意需要提前安装好 JRE 8 或更高版本的环境）：
![image-20230306231811912](https://s2.loli.net/2023/03/06/RW4JIBKVXSbG3lZ.png)
解压之后，我们对其配置文件进行修改，首先是 `application. properties` 配置文件，修改以下内容，包括 MySQL 服务器的信息：
```properties
### Default web server port:
server. port=8801
#*************** Config Module Related Configurations ***************#
### If use MySQL as datasource:
spring. datasource. platform=mysql
### Count of DB:
db. num=1
### Connect URL of DB:
db. url. 0=jdbc:mysql://cloudstudy. mysql. cn-chengdu. rds. aliyuncs. com: 3306/nacos? characterEncoding=utf 8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db. user. 0=nacos
db. password. 0=nacos
```
然后修改集群配置，这里需要重命名一下：
![image-20230306231821488](https://s2.loli.net/2023/03/06/2pe51dHQsJkPVY7.png)
端口记得使用内网 IP 地址：
![image-20230306231828707](https://s2.loli.net/2023/03/06/5CbEGQ7rX2StUkR.png)
最后我们修改一下 Nacos 的内存分配以及前台启动，直接修改 `startup. sh` 文件（内存有限，玩不起高的）：
![image-20230306231836711](https://s2.loli.net/2023/03/06/kQF3lN24vcBqzDi.png)
保存之后，将 nacos 复制一份，并将端口修改为 8802，接着启动这两个 Nacos 服务器。
![image-20230306231845850](https://s2.loli.net/2023/03/06/PQYi69aKZUXrNlJ.png)
然后我们打开管理面板，可以看到两个节点都已经启动了：
![image-20230306231854072](https://s2.loli.net/2023/03/06/Lbf14V39SCdghvO.png)
这样，我们第二步就完成了，接着我们需要添加一个 SLB，这里我们用 Nginx 做反向代理：
> *Nginx* (engine x) 是一个高性能的 [HTTP](https://baike.baidu.com/item/HTTP) 和[反向代理](https://baike.baidu.com/item/反向代理/7793488) web 服务器，同时也提供了 IMAP/POP 3/SMTP 服务。它相当于在内网与外网之间形成一个网关，所有的请求都可以由 Nginx 服务器转交给内网的其他服务器。

这里我们直接安装：
```sh
 sudo apt install nginx
```
可以看到直接请求 80 端口之后得到，表示安装成功：
![image-20230306231903833](https://s2.loli.net/2023/03/06/gVuMlAXcY34Ka2C.png)
现在我们需要让其代理我们刚刚启动的两个 Nacos 服务器，我们需要对其进行一些配置。配置文件位于 `/etc/nginx/nginx. conf`，添加以下内容：
```conf
#添加我们在上游刚刚创建好的两个nacos服务器
upstream nacos-server {
        server 10.0.0.12:8801;
        server 10.0.0.12:8802;
}
server {
        listen   80;
        server_name  1.14.121.107;
        location /nacos {
                proxy_pass http://nacos-server ;
        }
}
```
重启 Nginx 服务器，成功连接：
![image-20230306231912734](https://s2.loli.net/2023/03/06/2hrxcizHPvSq8be.png)
然后我们将所有的服务全部修改为云服务器上 Nacos 的地址，启动试试看。
![image-20230306231925001](https://s2.loli.net/2023/03/06/gdh43ciamLnBRFV.png)
这样，我们就搭建好了 Nacos 集群。
> [!NOTE] Tips
> 1. nacos 集群模式时*cluster.conf*必须配置的**ip 是本地 ip 地址，不能是 127.0.0.1**
> 2. nacos 修改*application.properties*配置文件不生效，原因在于 bin 目录下的 startup 启动文件中设置的**配置文件的位置不对**(不能带 `optional:`)，要改为：
> windows（startup.cmd）：`set "NACOS_CONFIG_OPTS=--spring.config.additional-location=%CUSTOM_SEARCH_LOCATIONS%"`
> linux（startup.sh）: `JAVA_OPT="${JAVA_OPT} --spring.config.additional-location=${CUSTOM_SEARCH_LOCATIONS}"`


***
![image-20230306231932929](https://s2.loli.net/2023/03/06/xnmustzRkFZJWIP.png)
## Sentinel 流量防卫兵
**注意：** 这一章有点小绕，思路理清。
经过之前的学习，我们了解了微服务存在的雪崩问题，也就是说一个微服务出现问题，有可能导致整个链路直接不可用，这种时候我们就需要进行及时的熔断和降级，这些策略，我们之前通过使用 Hystrix 来实现。
SpringCloud Alibaba 也有自己的微服务容错组件，但是它相比 Hystrix 更加的强大。
> 随着微服务的流行，服务和服务之间的稳定性变得越来越重要。Sentinel 以流量为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性。

Sentinel 具有以下特征:
- **丰富的应用场景**：Sentinel 承接了阿里巴巴近 10 年的双十一大促流量的核心场景，例如秒杀（即突发流量控制在系统容量可以承受的范围）、消息削峰填谷、集群流量控制、实时熔断下游不可用应用等。
- **完备的实时监控**：Sentinel 同时提供实时的监控功能。您可以在控制台中看到接入应用的单台机器秒级数据，甚至 500 台以下规模的集群的汇总运行情况。
- **广泛的开源生态**：Sentinel 提供开箱即用的与其它开源框架/库的整合模块，例如与 Spring Cloud、Apache Dubbo、gRPC、Quarkus 的整合。您只需要引入相应的依赖并进行简单的配置即可快速地接入 Sentinel。同时 Sentinel 提供 Java/Go/C++ 等多语言的原生实现。
- **完善的 SPI 扩展机制**：Sentinel 提供简单易用、完善的 SPI 扩展接口。您可以通过实现扩展接口来快速地定制逻辑。例如定制规则管理、适配动态数据源等。

### 安装与部署
和 Nacos 一样，它是独立安装和部署的，下载地址： https://github.com/alibaba/Sentinel/releases
![image-20230306231950297](https://s2.loli.net/2023/03/06/oZdLMAJaCD3Uw9F.png)
注意下载下来之后是一个 `jar` 文件（其实就是个 SpringBoot 项目），我们需要在 IDEA 中添加一些运行配置：
![image-20230306232001525](https://s2.loli.net/2023/03/06/Hjm4Z38s95YiFvI.png)
接着就可以直接启动啦，当然默认端口占用 8080，如果需要修改，可以添加环境变量：
![image-20230306232012301](https://s2.loli.net/2023/03/06/RfVAdtOqJjWlx6E.png)
启动之后，就可以访问到 Sentinel 的监控页面了，用户名和密码都是 `sentinel`，地址： http://localhost:8858/#/dashboard
![image-20230306232020492](https://s2.loli.net/2023/03/06/QpVRTYtBX6kvj2b.png)
这样就成功开启监控页面了，接着我们需要让我们的服务连接到 Sentinel 控制台，老规矩，导入依赖：
```xml
<dependency>
    <groupId>com. alibaba. cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```
然后在配置文件中添加 Sentinel 相关信息（实际上 Sentinel 是本地在进行管理，但是我们可以连接到监控页面，这样就可以图形化操作了）：
```yaml
spring:
  application:
    name: userservice
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
    sentinel:
      transport:
      	# 添加监控页面地址即可
        dashboard: localhost:8858
```
现在启动我们的服务，然后访问一次服务，这样 Sentinel 中就会存在信息了（懒加载机制，不会一上来就加载）：
![image-20230306232031800](https://s2.loli.net/2023/03/06/p4KTaDd1wc5BR92.png)
![image-20230306232038728](https://s2.loli.net/2023/03/06/pzOus21AWqLfr9k.png)
现在我们就可以在 Sentinel 控制台中对我们的服务运行情况进行实时监控了，可以看到监控的内容非常的多，包括时间点、QPS (每秒查询率)、响应时间等数据。
按照上面的方式，我们将所有的服务全部连接到 Sentinel 管理面板中。
### 流量控制
前面我们完成了对 Sentinel 的搭建与连接，接着我们来看看 Sentinel 的第一个功能，流量控制。
我们的机器不可能无限制的接受和处理客户端的请求，如果不加以限制，当发生高并发情况时，系统资源将很快被耗尽。为了避免这种情况，我们就可以添加流量控制（也可以说是限流）当一段时间内的流量到达一定的阈值的时候，新的请求将不再进行处理，这样不仅可以合理地应对高并发请求，同时也能在一定程度上保护服务器不受到外界的恶意攻击。
那么要实现限流，正常情况下，我们该采取什么样的策略呢？
* 方案一：**快速拒绝**，既然不再接受新的请求，那么我们可以直接返回一个拒绝信息，告诉用户访问频率过高。
* 方案二：**预热**，依然基于方案一，但是由于某些情况下高并发请求是在某一时刻突然到来，我们可以缓慢地将阈值提高到指定阈值，形成一个缓冲保护。
* 方案三：**排队等待**，不接受新的请求，但是也不直接拒绝，而是进队列先等一下，如果规定时间内能够执行，那么就执行，要是超时就算了。

针对于是否超过流量阈值的判断，这里我们提 4 种算法：
1. **漏桶算法**

   顾名思义，就像一个桶开了一个小孔，水流进桶中的速度肯定是远大于水流出桶的速度的，这也是最简单的一种限流思路：

   ![image-20230306232054430](https://s2.loli.net/2023/03/06/dMZVz3kDRxYaHg5.png)

   我们知道，桶是有容量的，所以当桶的容量已满时，就装不下水了，这时就只有丢弃请求了。

   利用这种思想，我们就可以写出一个简单的限流算法。

2. **令牌桶算法**

   只能说有点像信号量机制。现在有一个令牌桶，这个桶是专门存放令牌的，每隔一段时间就向桶中丢入一个令牌（速度由我们指定）当新的请求到达时，将从桶中删除令牌，接着请求就可以通过并给到服务，但是如果桶中的令牌数量不足，那么不会删除令牌，而是让此数据包等待。

   ![image-20230306232102462](https://s2.loli.net/2023/03/06/F1RxtgBZNQvWpw8.png)

   可以试想一下，当流量下降时，令牌桶中的令牌会逐渐积累，这样如果突然出现高并发，那么就能在短时间内拿到大量的令牌。

3. **固定时间窗口算法**

   我们可以对某一个时间段内的请求进行统计和计数，比如在 `14:15` 到 `14:16` 这一分钟内，请求量不能超过 `100`，也就是一分钟之内不能超过 `100` 次请求，那么就可以像下面这样进行划分：

   ![image-20230306232111506](https://s2.loli.net/2023/03/06/XRnKgCivsqFE2ax.png)

   虽然这种模式看似比较合理，但是试想一下这种情况：

   * 14:15:59的时候来了 100 个请求
   * 14:16:01的时候又来了 100 个请求

   出现上面这种情况，符合固定时间窗口算法的规则，所以这 200 个请求都能正常接受，但是，如果你反应比较快，应该发现了，我们其实希望的是 60 秒内只有 100 个请求，但是这种情况却是在 3 秒内出现了 200 个请求，很明显已经违背了我们的初衷。

   因此，当遇到临界点时，固定时间窗口算法存在安全隐患。

4. **滑动时间窗口算法**

   相对于固定窗口算法，滑动时间窗口算法更加灵活，它会动态移动窗口，重新进行计算：

   ![image-20230306232118585](https://s2.loli.net/2023/03/06/8MyG3WDo1wSBb5Y.png)

   虽然这样能够避免固定时间窗口的临界问题，但是这样显然是比固定窗口更加耗时的。

好了，了解完了我们的限流策略和判定方法之后，我们在 Sentinel 中进行实际测试一下，打开管理页面的簇点链路模块：
![image-20230306232127628](https://s2.loli.net/2023/03/06/4fPg72OJiwhDycL.png)
这里演示对我们的借阅接口进行限流，点击 `流控`，会看到让我们添加流控规则：
* 阈值类型：QPS 就是每秒钟的请求数量，并发线程数是按服务当前使用的线程数据进行统计的。
* 流控模式：当达到阈值时，流控的对象，这里暂时只用直接。
* 流控效果：就是我们上面所说的三种方案。

这里我们选择 `QPS`、阈值设定为 `1`，流控模式选择 `直接`、流控效果选择 `快速失败`，可以看到，当我们快速地进行请求时，会直接返回失败信息：
![image-20230306232135482](https://s2.loli.net/2023/03/06/Lrw7ZJNzyDUoYG8.png)
这里各位最好自行尝试一下其他的流控效果，熟悉和加深印象。
最后我们来看看这些流控模式有什么区别：
* 直接：只针对于当前接口。
* 关联：当其他接口超过阈值时，会导致当前接口被限流。
* 链路：更细粒度的限流，能精确到具体的方法。

我们首先来看看关联，比如现在我们对自带的 `/error` 接口进行限流：
![image-20230306232145053](https://s2.loli.net/2023/03/06/E9vnJRTPZmzaW8V.png)
注意限流是作用于关联资源的，一旦发现关联资源超过阈值，那么就会对当前的资源进行限流，我们现在来测试一下，这里使用 PostMan 的 Runner 连续对关联资源发起请求：
![image-20230306232239339](https://s2.loli.net/2023/03/06/QgqsxdvYF59P7ne.png)
开启 Postman，然后我们会发现借阅服务已经凉凉：
![image-20230306232253804](https://s2.loli.net/2023/03/06/tnKXB2JUarehk5T.png)
当我们关闭掉 Postman 的任务后，恢复正常。
最后我们来讲解一下链路模式，它能够更加精准的进行流量控制，链路流控模式指的是，当从指定接口过来的资源请求达到限流条件时，开启限流，这里得先讲解一下 `@SentinelResource` 的使用。
我们可以对某一个方法进行限流控制，无论是谁在何处调用了它，这里需要使用到 `@SentinelResource`，一旦方法被标注，那么就会进行监控，比如我们这里创建两个请求映射，都来调用 Service 的被监控方法：
```java
@RestController
public class BorrowController {
    @Resource
    BorrowService service;
    @RequestMapping ("/borrow/{uid}")
    UserBorrowDetail findUserBorrows (@PathVariable ("uid") int uid){
        return service.getUserBorrowDetailByUid (uid);
    }
    @RequestMapping ("/borrow 2/{uid}")
    UserBorrowDetail findUserBorrows 2 (@PathVariable ("uid") int uid){
        return service.getUserBorrowDetailByUid (uid);
    }
}
```
```java
@Service
public class BorrowServiceImpl implements BorrowService{
    @Resource
    BorrowMapper mapper;
    @Resource
    UserClient userClient;
    @Resource
    BookClient bookClient;
    @Override
    @SentinelResource ("getBorrow")   //监控此方法，无论被谁执行都在监控范围内，这里给的 value 是自定义名称，这个注解可以加在任何方法上，包括 Controller 中的请求映射方法，跟 HystrixCommand 贼像
    public UserBorrowDetail getUserBorrowDetailByUid (int uid) {
        List<Borrow> borrow = mapper.getBorrowsByUid (uid);
        User user = userClient.getUserById (uid);
        List<Book> bookList = borrow
                .stream ()
                .map (b -> bookClient.getBookById (b.getBid ()))
                .collect (Collectors.toList ());
        return new UserBorrowDetail (user, bookList);
    }
}
```
接着添加配置：
```yaml
spring:
  application:
    name: borrowservice
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8858
      # 关闭 Context 收敛，这样被监控方法可以进行不同链路的单独控制
      web-context-unify: false
```
然后我们在 Sentinel 控制台中添加流控规则，注意是针对此方法，可以看到已经自动识别到 borrow 接口下调用了这个方法：
![image-20230306232304858](https://s2.loli.net/2023/03/06/FOzJdtoieAxIvPq.png)
最后我们在浏览器中对这两个接口都进行测试，会发现，无论请求哪个接口，只要调用了 Service 中的 `getUserBorrowDetailByUid` 这个方法，都会被限流。注意限流的形式是后台直接抛出异常，至于怎么处理我们后面再说。
那么这个链路选项实际上就是决定只限流从哪个方向来的调用，比如我们只对 `borrow 2` 这个接口对 `getUserBorrowDetailByUid` 方法的调用进行限流，那么我们就可以为其指定链路：
![image-20230306232315010](https://s2.loli.net/2023/03/06/UHbcgSWV2exNCu1.png)
然后我们会发现，限流效果只对我们配置的链路接口有效，而其他链路是不会被限流的。
除了直接对接口进行限流规则控制之外，我们也可以根据当前系统的资源使用情况，决定是否进行限流：
![image-20230306232323438](https://s2.loli.net/2023/03/06/MHiDyU54L3QsNrc.png)
系统规则支持以下的模式：
- **Load 自适应**（仅对 Linux/Unix-like 机器生效）：系统的 load 1 作为启发指标，进行自适应系统保护。当系统 load 1 超过设定的启发值，且系统当前的并发线程数超过估算的系统容量时才会触发系统保护（BBR 阶段）。系统容量由系统的 `maxQps * minRt` 估算得出。设定参考值一般是 `CPU cores * 2.5`。
- **CPU usage**（1.5.0+ 版本）：当系统 CPU 使用率超过阈值即触发系统保护（取值范围 0.0-1.0），比较灵敏。
- **平均 RT**：当单台机器上所有入口流量的平均 RT 达到阈值即触发系统保护，单位是毫秒。
- **并发线程数**：当单台机器上所有入口流量的并发线程数达到阈值即触发系统保护。
- **入口 QPS**：当单台机器上所有入口流量的 QPS 达到阈值即触发系统保护。

这里就不进行演示了。
### 限流和异常处理
现在我们已经了解了如何进行限流操作，那么限流状态下的返回结果该怎么修改呢，我们看到被限流之后返回的是 Sentinel 默认的数据，现在我们希望自定义改如何操作？
这里我们先创建好被限流状态下需要返回的内容，定义一个请求映射：
```java
@RequestMapping ("/blocked")
JSONObject blocked (){
    JSONObject object = new JSONObject ();
    object.put ("code", 403);
    object.put ("success", false);
    object.put ("massage", "您的请求频率过快，请稍后再试！");
    return object;
}
```
接着我们在配置文件中将此页面设定为限流页面：
```yaml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8858
      # 将刚刚编写的请求映射设定为限流页面
      block-page: /blocked
```
这样，当被限流时，就会被重定向到指定页面：
![image-20230306232335949](https://s2.loli.net/2023/03/06/PfVOQWJrTiZGqh7.png)
那么，对于方法级别的限流呢？经过前面的学习我们知道，当某个方法被限流时，会直接在后台抛出异常，那么这种情况我们该怎么处理呢，比如我们之前在 Hystrix 中可以直接添加一个替代方案，这样当出现异常时会直接执行我们的替代方法并返回，Sentinel 也可以。
比如我们还是在 `getUserBorrowDetailByUid` 方法上进行配置：
```java
@Override
@SentinelResource (value = "getBorrow", blockHandler = "blocked")   //指定 blockHandler，也就是被限流之后的替代解决方案，这样就不会使用默认的抛出异常的形式了
public UserBorrowDetail getUserBorrowDetailByUid (int uid) {
    List<Borrow> borrow = mapper.getBorrowsByUid (uid);
    User user = userClient.getUserById (uid);
    List<Book> bookList = borrow
            .stream ()
            .map (b -> bookClient.getBookById (b.getBid ()))
            .collect (Collectors.toList ());
    return new UserBorrowDetail (user, bookList);
}
//替代方案，注意参数和返回值需要保持一致，并且参数最后还需要额外添加一个 BlockException
public UserBorrowDetail blocked (int uid, BlockException e) {
    return new UserBorrowDetail (null, Collections.emptyList ());
}
```
可以看到，一旦被限流将执行替代方案，最后返回的结果就是：
![image-20230306232346185](https://s2.loli.net/2023/03/06/p1Y53LPihOGZjBV.png)
注意 `blockHandler` 只能处理限流情况下抛出的异常，包括下面即将要介绍的热点参数限流也是同理，如果是方法本身抛出的其他类型异常，不在管控范围内，但是可以通过其他参数进行处理：
```java
@RequestMapping ("/test")
@SentinelResource (value = "test",
        fallback = "except",    //fallback 指定出现异常时的替代方案
        exceptionsToIgnore = IOException. class)  //忽略那些异常，也就是说这些异常出现时不使用替代方案
String test (){
    throw new RuntimeException ("HelloWorld！");
}
//替代方法必须和原方法返回值和参数一致，最后可以添加一个 Throwable 作为参数接受异常
String except (Throwable t){
    return t.getMessage ();
}
```
这样，其他的异常也可以有替代方案了：
![image-20230306232354931](https://s2.loli.net/2023/03/06/pk1HjSi9VyxwOJQ.png)
特别注意这种方式会在没有配置 `blockHandler` 的情况下，将 Sentinel 机制内（也就是限流的异常）的异常也一并处理了，如果配置了 `blockHandler`，那么在出现限流时，依然只会执行 `blockHandler` 指定的替代方案（因为限流是在方法执行之前进行的）
### 热点参数限流
我们还可以对某一热点数据进行精准限流，比如在某一时刻，不同参数被携带访问的频率是不一样的：
* http://localhost:8301/test?a=10  访问 100 次
* http://localhost:8301/test?b=10  访问 0 次
* http://localhost:8301/test?c=10  访问 3 次
由于携带参数 `a` 的请求比较多，我们就可以只对携带参数 `a` 的请求进行限流。
这里我们创建一个新的测试请求映射：
```java
@RequestMapping ("/test")
@SentinelResource ("test")   //注意这里需要添加@SentinelResource 才可以，用户资源名称就使用这里定义的资源名称
String findUserBorrows2(@RequestParam(value = "a", required = false) String a,  
                        @RequestParam(value = "b", required = false) String b,  
                        @RequestParam(value = "c", required = false) String c) {  
    return "请求成功！a = " + a + ", b = " + b + ", c = " + c;  
}
```
启动之后，我们在 Sentinel 里面进行热点配置：
![image-20230306232406587](https://s2.loli.net/2023/03/06/fIlhGM3jPxb7wgS.png)
然后开始访问我们的测试接口，可以看到在携带参数 a 时，当访问频率超过设定值，就会直接被限流，这里是直接在后台抛出异常：
![image-20230306232452209](https://s2.loli.net/2023/03/06/hskQVKnE2y5PftO.png)
![image-20230306232500754](https://s2.loli.net/2023/03/06/nC6W5T4OGcJNypA.png)
而我们使用其他参数或是不带 `a` 参数，那么就不会出现这种问题了：
![image-20230306232514532](https://s2.loli.net/2023/03/06/WVguflyZ43NxE7j.png)
除了直接对某个参数精准限流外，我们还可以对参数携带的指定值单独设定阈值，比如我们现在不仅希望对参数 `a` 限流，而且还希望当参数 `a` 的值为 10 时，QPS 达到 5 再进行限流，那么就可以设定例外：
![image-20230306232525342](https://s2.loli.net/2023/03/06/oipjTJBHsMSdDvc.png)
这样，当请求携带参数 `a`，且参数 `a` 的值为 10 时，阈值将按照我们指定的特例进行计算。
### 服务熔断和降级
还记得我们前所说的服务降级吗，也就是说我们需要在整个微服务调用链路出现问题的时候，及时对服务进行降级，以防止问题进一步恶化。
![image-20230306232538279](https://s2.loli.net/2023/03/06/AxrzjvtPWJ2YCZI.png)
那么，各位是否有思考过，如果在某一时刻，服务 B 出现故障（可能就卡在那里了），而这时服务 A 依然有大量的请求，在调用服务 B，那么，由于服务 A 没办法再短时间内完成处理，新来的请求就会导致线程数不断地增加，这样，CPU 的资源很快就会被耗尽。
那么要防止这种情况，就只能进行隔离了，这里我们提两种隔离方案：
1. **线程池隔离**
   线程池隔离实际上就是对每个服务的远程调用单独开放线程池，比如服务 A 要调用服务 B，那么只基于固定数量的线程池，这样即使在短时间内出现大量请求，由于没有线程可以分配，所以就不会导致资源耗尽了。
   ![image-20230306232549778](https://s2.loli.net/2023/03/06/CbYxA3d7w46OlMm.png)
2. **信号量隔离**
   信号量隔离是使用 `Semaphore` 类实现的（如果不了解，可以观看本系列并发编程篇视频教程），思想基本上与上面是相同的，也是限定指定的线程数量能够同时进行服务调用，但是它相对于线程池隔离，开销会更小一些，使用效果同样优秀，也支持超时等。
   Sentinel 也正是采用的这种方案实现隔离的。
好了，说回我们的熔断和降级，当下游服务因为某种原因变得不可用或响应过慢时，上游服务为了保证自己整体服务的可用性，不再继续调用目标服务而是快速返回或是执行自己的替代方案，这便是服务降级。
![image-20230306232602853](https://s2.loli.net/2023/03/06/gY62LD3vw157WiU.png)
整个过程分为三个状态：
* 关闭：熔断器不工作，所有请求全部该干嘛干嘛。
* 打开：熔断器工作，所有请求一律降级处理。
* 半开：尝试进行一下下正常流程，要是还不行继续保持打开状态，否则关闭。
那么我们来看看 Sentinel 中如何进行熔断和降级操作，打开管理页面，我们可以自由新增熔断规则：
![image-20230306232618547](https://s2.loli.net/2023/03/06/7BW6LGXQNl5b1Iv.png)
其中，熔断策略有三种模式：
1. **慢调用比例：** 如果出现那种半天都处理不完的调用，有可能就是服务出现故障，导致卡顿，这个选项是按照最大响应时间（RT）进行判定，如果一次请求的处理时间超过了指定的 RT，那么就被判定为 `慢调用`，在一个统计时长内，如果请求数目大于最小请求数目，并且被判定为 `慢调用` 的请求比例已经超过阈值，将触发熔断。经过熔断时长之后，将会进入到半开状态进行试探（这里和 Hystrix 一致）
   然后修改一下接口的执行，我们模拟一下慢调用：
   ```java
   @RequestMapping ("/borrow 2/{uid}")
   UserBorrowDetail findUserBorrows 2 (@PathVariable ("uid") int uid) throws InterruptedException {
       Thread.sleep (1000);
       return null;
   }
   ```
   重启，然后我们创建一个新的熔断规则：
   ![image-20230306232632385](https://s2.loli.net/2023/03/06/ExWIKFSNpPoksiT.png)
   可以看到，超时直接触发了熔断，进入到阻止页面：
   ![image-20230306232642387](https://s2.loli.net/2023/03/06/CmdPgcqvX4a2u9p.png)
2. **异常比例：** 这个与慢调用比例类似，不过这里判断的是出现异常的次数，与上面一样，我们也来进行一些小测试：
   ```java
   @RequestMapping ("/borrow 2/{uid}")
   UserBorrowDetail findUserBorrows 2 (@PathVariable ("uid") int uid) {
       throw new RuntimeException ();
   }
   ```
   启动服务器，接着添加我们的熔断规则：
   ![image-20230306232652092](https://s2.loli.net/2023/03/06/Dz3EgG9eH4UXTkJ.png)
   现在我们进行访问，会发现后台疯狂报错，然后就熔断了：
   ![image-20230306232702794](https://s2.loli.net/2023/03/06/jSp92ODTRhlxJsn.png)
   ![image-20230306232711467](https://s2.loli.net/2023/03/06/FfhalnZdS2ujm1t.png)
3. **异常数：** 这个和上面的唯一区别就是，只要达到指定的异常数量，就熔断，这里我们修改一下熔断规则：
   ![image-20230306232720801](https://s2.loli.net/2023/03/06/CugOUozGA6inB3R.png)
   现在我们再次不断访问此接口，可以发现，效果跟之前其实是差不多的，只是判断的策略稍微不同罢了：
   ![image-20230306232738961](https://s2.loli.net/2023/03/06/XC1VekDfainIpv6.png)
那么熔断规则如何设定我们了解了，那么，如何自定义服务降级呢？之前在使用 Hystrix 的时候，如果出现异常，可以执行我们的替代方案，Sentinel 也是可以的。
同样的，我们只需要在 `@SentinelResource` 中配置 `blockHandler` 参数（那这里跟前面那个方法限流的配置不是一毛一样吗？没错，因为如果添加了 `@SentinelResource` 注解，那么这里会进行方法级别细粒度的限制，和之前方法级别限流一样，会在降级之后直接抛出异常，如果不添加则返回默认的限流页面，`blockHandler` 的目的就是处理这种 Sentinel 机制上的异常，所以这里其实和之前的限流配置是一个道理，因此下面熔断配置也应该对 `value` 自定义名称的资源进行配置，才能作用到此方法上）：
```java
@RequestMapping ("/borrow2/{uid}")
@SentinelResource (value = "findUserBorrows 2", blockHandler = "test")
UserBorrowDetail findUserBorrows 2 (@PathVariable ("uid") int uid) {
    throw new RuntimeException ();
}
UserBorrowDetail test (int uid, BlockException e){
    return new UserBorrowDetail (new User (), Collections.emptyList ());
}
```
接着我们对进行熔断配置，注意是对我们添加的 `@SentinelResource` 中指定名称的 `findUserBorrows 2` 进行配置：
![image-20230306232759448](https://s2.loli.net/2023/03/06/QkofY5gzwSr6WGn.png)
OK，可以看到熔断之后，服务降级之后的效果：
![image-20230306232809712](https://s2.loli.net/2023/03/06/5kLcAaT6wJgYXGx.png)
最后我们来看一下如何让 Feign 的也支持 Sentinel，前面我们使用 Hystrix 的时候，就可以直接对 Feign 的每个接口调用单独进行服务降级，而使用 Sentinel，也是可以的，首先我们需要在配置文件中开启支持：
```yml
feign:
  sentinel:
    enabled: true
```
之后的步骤其实和之前是一模一样的，首先创建实现类：
```java
@Component
public class UserClientFallback implements UserClient{
    @Override
    public User getUserById (int uid) {
        User user = new User ();
        user.setName ("我是替代方案");
        return user;
    }
}
```
然后直接启动就可以了，中途的时候我们吧用户服务全部下掉，可以看到正常使用替代方案：
![image-20230306232821953](https://s2.loli.net/2023/03/06/M2yZpJLfs1i9adC.png)
这样 Feign 的配置就 OK 了，那么传统的 RestTemplate 呢？我们可以使用 `@SentinelRestTemplate` 注解实现：
```java
  @Bean
  @LoadBalanced
  @SentinelRestTemplate (blockHandler = "handleException", blockHandlerClass = ExceptionUtil. class,
      fallback = "fallback", fallbackClass = ExceptionUtil. class) //这里同样可以设定 fallback 等参数
  public RestTemplate restTemplate () {
    return new RestTemplate ();
  }
```
这里就不多做赘述了。
***
![image-20230306232833262](https://s2.loli.net/2023/03/06/8OCeNap2Vy6X7WH.png)
## Seata 与分布式事务
重难点内容，坑也多得离谱，最好保持跟 UP 一样的版本，**官方文档：** https://seata.io/zh-cn/docs/overview/what-is-seata.html
在前面的阶段中，我们学习过事务，还记得我们之前谈到的数据库事务的特性吗？
* **原子性：** 一个事务（transaction）中的所有操作，要么全部完成，要么全部不完成，不会结束在中间某个环节。事务在执行过程中发生错误，会被回滚（Rollback）到事务开始前的状态，就像这个事务从来没有执行过一样。
* **一致性：** 在事务开始之前和事务结束以后，数据库的完整性没有被破坏。这表示写入的资料必须完全符合所有的预设规则，这包含资料的精确度、串联性以及后续数据库可以自发性地完成预定的工作。
* **隔离性：** 数据库允许多个并发事务同时对其数据进行读写和修改的能力，隔离性可以防止多个事务并发执行时由于交叉执行而导致数据的不一致。事务隔离分为不同级别，包括读未提交（Read uncommitted）、读已提交（read committed）、可重复读（repeatable read）和串行化（Serializable）。
* **持久性：** 事务处理结束后，对数据的修改就是永久的，即便系统故障也不会丢失。
那么各位试想一下，在分布式环境下，有可能出现这样一个问题，比如我们下单购物，那么整个流程可能是这样的：先调用库存服务对库存进行减扣 -> 然后订单服务开始下单 -> 最后用户账户服务进行扣款，虽然看似是一个很简单的一个流程，但是如果没有事务的加持，很有可能会由于中途出错，比如整个流程中订单服务出现问题，那么就会导致库存扣了，但是实际上这个订单并没有生成，用户也没有付款。
![image-20230306233055869](https://s2.loli.net/2023/03/06/AiEXC3wBflPxHGT.png)
上面这种情况时间就是一种多服务多数据源的分布式事务模型（比较常见），因此，为了解决这种情况，我们就得实现分布式事务，让这整个流程保证原子性。
SpringCloud Alibaba 为我们提供了用于处理分布式事务的组件 Seata。
![image-20230306233108567](https://s2.loli.net/2023/03/06/jDAy7osQ5YIqruP.png)
Seata 是一款开源的分布式事务解决方案，致力于提供高性能和简单易用的分布式事务服务。Seata 将为用户提供了 AT、TCC、SAGA 和 XA 事务模式，为用户打造一站式的分布式解决方案。
实际上，就是多了一个中间人来协调所有服务的事务。
### 项目环境搭建
这里我们对我们之前的图书管理系统进行升级：
* 每个用户最多只能同时借阅 2 本不同的书。
* 图书馆中所有的书都有 3 本。
* 用户借书流程：先调用图书服务书籍数量-1 ->  添加借阅记录  ->  调用用户服务用户可借阅数量-1
那么首先我们对数据库进行修改，这里为了简便，就直接在用户表中添加一个字段用于存储用户能够借阅的书籍数量：
![image-20230306232857302](https://s2.loli.net/2023/03/06/TvJL2PiWFU4XoaZ.png)
然后修改书籍信息，也是直接添加一个字段用于记录剩余数量：
![image-20230306232904202](https://s2.loli.net/2023/03/06/WjEcGbtkNrZi1CL.png)
接着我们去编写一下对应的服务吧，首先是用户服务：
```java
@Mapper
public interface UserMapper {
    @Select ("select * from DB_USER where uid = #{uid}")
    User getUserById (int uid);
    @Select ("select book_count from DB_USER where uid = #{uid}")
    int getUserBookRemain (int uid);
    @Update ("update DB_USER set book_count = #{count} where uid = #{uid}")
    int updateBookCount (int uid, int count);
}
```
```java
@Service
public class UserServiceImpl implements UserService {
    @Resource
    UserMapper mapper;
    @Override
    public User getUserById (int uid) {
        return mapper.getUserById (uid);
    }
    @Override
    public int getRemain (int uid) {
        return mapper.getUserBookRemain (uid);
    }
    @Override
    public boolean setRemain (int uid, int count) {
        return mapper.updateBookCount (uid, count) > 0;
    }
}
```
```java
@RestController
public class UserController {
    @Resource
    UserService service;
    @RequestMapping ("/user/{uid}")
    public User findUserById (@PathVariable ("uid") int uid){
        return service.getUserById (uid);
    }
    @RequestMapping ("/user/remain/{uid}")
    public int userRemain (@PathVariable ("uid") int uid){
        return service.getRemain (uid);
    }
    @RequestMapping ("/user/borrow/{uid}")
    public boolean userBorrow (@PathVariable ("uid") int uid){
        int remain = service.getRemain (uid);
        return service.setRemain (uid, remain - 1);
    }
}
```
然后是图书服务，其实跟用户服务差不多：
```java
@Mapper
public interface BookMapper {
    @Select ("select * from DB_BOOK where bid = #{bid}")
    Book getBookById (int bid);
    @Select ("select count from DB_BOOK  where bid = #{bid}")
    int getRemain (int bid);
    @Update ("update DB_BOOK set count = #{count}  where bid = #{bid}")
    int setRemain (int bid, int count);
}
```
```java
@Service
public class BookServiceImpl implements BookService {
    @Resource
    BookMapper mapper;
    @Override
    public Book getBookById (int bid) {
        return mapper.getBookById (bid);
    }
    @Override
    public boolean setRemain (int bid, int count) {
        return mapper.setRemain (bid, count) > 0;
    }
    @Override
    public int getRemain (int bid) {
        return mapper.getRemain (bid);
    }
}
```
```java
@RestController
public class BookController {
    @Resource
    BookService service;
    @RequestMapping ("/book/{bid}")
    Book findBookById (@PathVariable ("bid") int bid){
        return service.getBookById (bid);
    }
    @RequestMapping ("/book/remain/{bid}")
    public int bookRemain (@PathVariable ("bid") int uid){
        return service.getRemain (uid);
    }
    @RequestMapping ("/book/borrow/{bid}")
    public boolean bookBorrow (@PathVariable ("bid") int uid){
        int remain = service.getRemain (uid);
        return service.setRemain (uid, remain - 1);
    }
}
```
最后完善我们的借阅服务：
```java
@FeignClient (value = "userservice")
public interface UserClient {
    @RequestMapping ("/user/{uid}")
    User getUserById (@PathVariable ("uid") int uid);
    @RequestMapping ("/user/borrow/{uid}")
    boolean userBorrow (@PathVariable ("uid") int uid);
    @RequestMapping ("/user/remain/{uid}")
    int userRemain (@PathVariable ("uid") int uid);
}
```
```java
@FeignClient ("bookservice")
public interface BookClient {
    @RequestMapping ("/book/{bid}")
    Book getBookById (@PathVariable ("bid") int bid);
    @RequestMapping ("/book/borrow/{bid}")
    boolean bookBorrow (@PathVariable ("bid") int bid);
    @RequestMapping ("/book/remain/{bid}")
    int bookRemain (@PathVariable ("bid") int bid);
}
```
```java
@RestController
public class BorrowController {
    @Resource
    BorrowService service;
    @RequestMapping ("/borrow/{uid}")
    UserBorrowDetail findUserBorrows (@PathVariable ("uid") int uid){
        return service.getUserBorrowDetailByUid (uid);
    }
    @RequestMapping ("/borrow/take/{uid}/{bid}")
    JSONObject borrow (@PathVariable ("uid") int uid,
                      @PathVariable ("bid") int bid){
        service.doBorrow (uid, bid);
        JSONObject object = new JSONObject ();
        object.put ("code", "200");
        object.put ("success", false);
        object.put ("message", "借阅成功！");
        return object;
    }
}
```
```java
@Service
public class BorrowServiceImpl implements BorrowService{
    @Resource
    BorrowMapper mapper;
    @Resource
    UserClient userClient;
    @Resource
    BookClient bookClient;
    @Override
    public UserBorrowDetail getUserBorrowDetailByUid (int uid) {
        List<Borrow> borrow = mapper.getBorrowsByUid (uid);
        User user = userClient.getUserById (uid);
        List<Book> bookList = borrow
                .stream ()
                .map (b -> bookClient.getBookById (b.getBid ()))
                .collect (Collectors.toList ());
        return new UserBorrowDetail (user, bookList);
    }
    @Override
    public boolean doBorrow (int uid, int bid) {
      	//1. 判断图书和用户是否都支持借阅
        if (bookClient.bookRemain (bid) < 1)
            throw new RuntimeException ("图书数量不足");
        if (userClient.userRemain (uid) < 1)
            throw new RuntimeException ("用户借阅量不足");
      	//2. 首先将图书的数量-1
        if (! bookClient.bookBorrow (bid))
            throw new RuntimeException ("在借阅图书时出现错误！");
      	//3. 添加借阅信息
        if (mapper.getBorrow (uid, bid) != null)
            throw new RuntimeException ("此书籍已经被此用户借阅了！");
        if (mapper.addBorrow (uid, bid) <= 0)
            throw new RuntimeException ("在录入借阅信息时出现错误！");
      	//4. 用户可借阅-1
        if (! userClient.userBorrow (uid))
            throw new RuntimeException ("在借阅时出现错误！");
      	//完成
        return true;
    }
}
```
这样，只要我们的图书借阅过程中任何一步出现问题，都会抛出异常。
我们来测试一下：
![image-20230306233138135](https://s2.loli.net/2023/03/06/MPkZb1dA2Khjcty.png)
再次尝试借阅，后台会直接报错：
![image-20230306233147990](https://s2.loli.net/2023/03/06/H43Fy9z76LIvJGd.png)
抛出异常，但是我们发现一个问题，借阅信息添加失败了，但是图书的数量依然被-1，也就是说正常情况下，我们是希望中途出现异常之后，之前的操作全部回滚的：
![image-20230306233201664](https://s2.loli.net/2023/03/06/l9D8aXBxkvnZejw.png)
而这里由于是在另一个服务中进行的数据库操作，所以传统的 `@Transactional` 注解无效，这时就得借助 Seata 提供分布式事务了。
### 分布式事务解决方案
要开始实现分布式事务，我们得先从理论上开始下手，我们来了解一下常用的分布式事务解决方案。
1. **XA 分布式事务协议 - 2 PC（两阶段提交实现）**
   这里的 PC 实际上指的是 Prepare 和 Commit，也就是说它分为两个阶段，一个是准备一个是提交，整个过程的参与者一共有两个角色，一个是事务的执行者，一个是事务的协调者，实际上整个分布式事务的运作都需要依靠协调者来维持：
   ![image-20230306233211675](https://s2.loli.net/2023/03/06/BWiUzFrjHAao1kJ.png)
   在准备和提交阶段，会进行：
   * **准备阶段：**
     一个分布式事务是由协调者来开启的，首先协调者会向所有的事务执行者发送事务内容，等待所有的事务执行者答复。
     各个事务执行者开始执行事务操作，但是不进行提交，并将 undo 和 redo 信息记录到事务日志中。
     如果事务执行者执行事务成功，那么就告诉协调者成功 Yes，否则告诉协调者失败 No，不能提交事务。
   * **提交阶段：**
     当所有的执行者都反馈完成之后，进入第二阶段。
     协调者会检查各个执行者的反馈内容，如果所有的执行者都返回成功，那么就告诉所有的执行者可以提交事务了，最后再释放锁资源。
     如果有至少一个执行者返回失败或是超时，那么就让所有的执行者都回滚，分布式事务执行失败。
   虽然这种方式看起来比较简单，但是存在以下几个问题：
   * 事务协调者是非常核心的角色，一旦出现问题，将导致整个分布式事务不能正常运行。
   * 如果提交阶段发生网络问题，导致某些事务执行者没有收到协调者发来的提交命令，将导致某些执行者提交某些执行者没提交，这样肯定是不行的。
2. **XA 分布式事务协议 - 3 PC（三阶段提交实现）**
   三阶段提交是在二阶段提交基础上的改进版本，主要是加入了超时机制，同时在协调者和执行者中都引入了超时机制。
   三个阶段分别进行：
   * **CanCommit 阶段：**
     协调者向执行者发送 CanCommit 请求，询问是否可以执行事务提交操作，然后开始等待执行者的响应。
     执行者接收到请求之后，正常情况下，如果其自身认为可以顺利执行事务，则返回 Yes 响应，并进入预备状态，否则返回 No
   * **PreCommit 阶段：**
     协调者根据执行者的反应情况来决定是否可以进入第二阶段事务的 PreCommit 操作。
     如果所有的执行者都返回 Yes，则协调者向所有执行者发送 PreCommit 请求，并进入 Prepared 阶段，执行者接收到请求后，会执行事务操作，并将 undo 和 redo 信息记录到事务日志中，如果成功执行，则返回成功响应。
     如果所有的执行者至少有一个返回 No，则协调者向所有执行者发送 abort 请求，所有的执行者在收到请求或是超过一段时间没有收到任何请求时，会直接中断事务。
   * **DoCommit 阶段：**
     该阶段进行真正的事务提交。
     协调者接收到所有执行者发送的成功响应，那么他将从 PreCommit 状态进入到 DoCommit 状态，并向所有执行者发送 doCommit 请求，执行者接收到 doCommit 请求之后，开始执行事务提交，并在完成事务提交之后释放所有事务资源，并最后向协调者发送确认响应，协调者接收到所有执行者的确认响应之后，完成事务（如果因为网络问题导致执行者没有收到 doCommit 请求，执行者会在超时之后直接提交事务，虽然执行者只是猜测协调者返回的是 doCommit 请求，但是因为前面的两个流程都正常执行，所以能够在一定程度上认为本次事务是成功的，因此会直接提交）
     协调者没有接收至少一个执行者发送的成功响应（也可能是响应超时），那么就会执行中断事务，协调者会向所有执行者发送 abort 请求，执行者接收到 abort 请求之后，利用其在 PreCommit 阶段记录的 undo 信息来执行事务的回滚操作，并在完成回滚之后释放所有的事务资源，执行者完成事务回滚之后，向协调者发送确认消息，协调者接收到参与者反馈的确认消息之后，执行事务的中断。
   相比两阶段提交，三阶段提交的优势是显而易见的，当然也有缺点：
   * 3 PC 在 2 PC 的第一阶段和第二阶段中插入一个准备阶段，保证了在最后提交阶段之前各参与节点的状态是一致的。
   * 一旦参与者无法及时收到来自协调者的信息之后，会默认执行 Commit，这样就不会因为协调者单方面的故障导致全局出现问题。
   * 但是我们知道，实际上超时之后的 Commit 决策本质上就是一个赌注罢了，如果此时协调者发送的是 abort 请求但是超时未接收，那么就会直接导致数据一致性问题。
3. **TCC（补偿事务）**
   补偿事务 TCC 就是 Try、Confirm、Cancel，它对业务有侵入性，一共分为三个阶段，我们依次来解读一下。
   * **Try 阶段：**
     比如我们需要在借书时，将书籍的库存 `-1`，并且用户的借阅量也 `-1`，但是这个操作，除了直接对库存和借阅量进行修改之外，还需要将减去的值，单独存放到冻结表中，但是此时不会创建借阅信息，也就是说只是预先把关键的东西给处理了，预留业务资源出来。
   * **Confirm 阶段：**
     如果 Try 执行成功无误，那么就进入到 Confirm 阶段，接着之前，我们就该创建借阅信息了，只能使用 Try 阶段预留的业务资源，如果创建成功，那么就对 Try 阶段冻结的值，进行解冻，整个流程就完成了。当然，如果失败了，那么进入到 Cancel 阶段。
   * **Cancel 阶段：**
     不用猜了，那肯定是把冻结的东西还给人家，因为整个借阅操作压根就没成功。就像你付了款买了东西但是网络问题，导致交易失败，钱不可能不还给你吧。
   跟 XA 协议相比，TCC 就没有协调者这一角色的参与了，而是自主通过上一阶段的执行情况来确保正常，充分利用了集群的优势，性能也是有很大的提升。但是缺点也很明显，它与业务具有一定的关联性，需要开发者去编写更多的补偿代码，同时并不一定所有的业务流程都适用于这种形式。
### Seata 机制简介
前面我们了解了一些分布式事务的解决方案，那么我们来看一下 Seata 是如何进行分布式事务的处理的。
![image-20230306233227905](https://s2.loli.net/2023/03/06/LsUq3AvrfhQJPCz.png)
官网给出的是这样的一个架构图，那么图中的 RM、TM、TC 代表着什么意思呢？
* RM（Resource Manager）：用于直接执行本地事务的提交和回滚。
* TM（Transaction Manager）：TM 是分布式事务的核心管理者。比如现在我们需要在借阅服务中开启全局事务，来让其自身、图书服务、用户服务都参与进来，也就是说一般全局事务发起者就是 TM。
* TC（Transaction Controller）这个就是我们的 Seata 服务器，用于全局控制，比如在 XA 模式下就是一个协调者的角色，而一个分布式事务的启动就是由 TM 向 TC 发起请求，TC 再来与其他的 RM 进行协调操作。

> TM 请求 TC 开启一个全局事务，TC 会生成一个 XID 作为该全局事务的编号，XID 会在微服务的调用链路中传播，保证将多个微服务的子事务关联在一起；RM 请求 TC 将本地事务注册为全局事务的分支事务，通过全局事务的 XID 进行关联；TM 请求 TC 告诉 XID 对应的全局事务是进行提交还是回滚；TC 驱动 RM 将 XID 对应的自己的本地事务进行提交还是回滚；
> Seata 支持 4 种事务模式，官网文档：[https://seata.io/zh-cn/docs/overview/what-is-seata.html](https://seata.io/zh-cn/docs/overview/what-is-seata.html)

* AT：本质上就是 2 PC 的升级版，在 AT 模式下，用户只需关心自己的 “业务 SQL”
  1. 一阶段，Seata 会拦截“业务 SQL”，首先解析 SQL 语义，找到“业务 SQL”要更新的业务数据，在业务数据被更新前，将其保存成“before image”，然后执行“业务 SQL”更新业务数据，在业务数据更新之后，再将其保存成“after image”，最后生成行锁。以上操作全部在一个数据库事务内完成，这样保证了一阶段操作的原子性。
  2. 二阶段如果确认提交的话，因为“业务 SQL”在一阶段已经提交至数据库，所以 Seata 框架只需将一阶段保存的快照数据和行锁删掉，完成数据清理即可，当然如果需要回滚，那么就用“before image”还原业务数据；但在还原前要首先要校验脏写，对比“数据库当前业务数据”和 “after image”，如果两份数据完全一致就说明没有脏写，可以还原业务数据，如果不一致就说明有脏写，出现脏写就需要转人工处理。
* TCC：和我们上面讲解的思路是一样的。
* XA：同上，但是要求数据库本身支持这种模式才可以。
* Saga：用于处理长事务，每个执行者需要实现事务的正向操作和补偿操作：
  ![image-20230306233328901](https://s2.loli.net/2023/03/06/vLTZFS4yn26uabA.png)
那么，以 AT 模式为例，我们的程序如何才能做到不对业务进行侵入的情况下实现分布式事务呢？实际上，Seata 客户端，是通过对数据源进行代理实现的，使用的是 DataSourceProxy 类，所以在程序这边，我们只需要将对应的代理类注册为 Bean 即可（0.9 版本之后支持自动进行代理，不用我们手动操作）
接下来，我们就以 AT 模式为例进行讲解。
### 使用 file 模式部署
Seata 也是以服务端形式进行部署的，然后每个服务都是客户端，服务端下载地址： https://github.com/seata/seata/releases/download/v1.4.2/seata-server-1.4.2.zip
把源码也下载一下： https://github.com/seata/seata/archive/refs/heads/develop.zip
下载完成之后，放入到 IDEA 项目目录中，添加启动配置，这里端口使用 8868：
![image-20230306233336803](https://s2.loli.net/2023/03/06/ykH1BSPcxlvY4on.png)
Seata 服务端支持本地部署或是基于注册发现中心部署（比如 Nacos、Eureka 等），这里我们首先演示一下最简单的本地部署，不需要对 Seata 的配置文件做任何修改。
Seata 存在着事务分组机制：
- 事务分组：seata 的资源逻辑，可以按微服务的需要，在应用程序（客户端）对自行定义事务分组，每组取一个名字。
- 集群：seata-server 服务端一个或多个节点组成的集群 cluster。应用程序（客户端）使用时需要指定事务逻辑分组与 Seata 服务端集群（默认为 default）的映射关系。
为啥要设计成通过事务分组再直接映射到集群？干嘛不直接指定集群呢？获取事务分组到映射集群的配置。这样设计后，事务分组可以作为资源的逻辑隔离单位，出现某集群故障时可以快速 failover，只切换对应分组，可以把故障缩减到服务级别，但前提也是你有足够 server 集群。
接着我们需要将我们的**各个服务作为 Seate 的客户端**，只需要导入依赖即可：
```xml
<dependency>
    <groupId>com. alibaba. cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
</dependency>
```
然后添加配置：
```yaml
seata:
  service:
    vgroup-mapping:
    	# 这里需要对事务组做映射，默认的分组名为应用名称-seata-service-group，将其映射到 default 集群
    	# 这个很关键，一定要配置对，不然会找不到服务
      bookservice-seata-service-group: default
    grouplist:
      default: localhost:8868
```
> 使用 jdk8才能正常启动，使用 jdk17则报错 `Error creating bean with name 'globalTransactionScanner' defined in class path resource [io/seata/spring/boot/autoconfigure/SeataAutoConfiguration.class]` ，直接启动后只是单纯地连接上，并没有开启任何的分布式事务。
> 接着要**配置开启分布式事务**，首先在**启动类添加注解**，此注解会添加一个后置处理器将数据源封装为支持分布式事务的*代理数据源*（虽然官方表示配置文件中已经默认开启了自动代理，但是实测 1.4.2 版本下只能打注解的方式才能生效）：
```java
@EnableAutoDataSourceProxy
@SpringBootApplication
public class BookApplication {
    public static void main (String[] args) {
        SpringApplication.run (BookApplication. class, args);
    }
}
```
接着我们需要在开启分布式事务的方法上添加 `@GlobalTransactional` 注解：
```java
@GlobalTransactional
@Override
public boolean doBorrow (int uid, int bid) {
  	//这里打印一下 XID 看看，其他的服务业添加这样一个打印，如果一会都打印的是同一个 XID，表示使用的就是同一个事务
    System.out.println (RootContext.getXID ());
    if (bookClient.bookRemain (bid) < 1)
        throw new RuntimeException ("图书数量不足");
    if (userClient.userRemain (uid) < 1)
        throw new RuntimeException ("用户借阅量不足");
    if (! bookClient.bookBorrow (bid))
        throw new RuntimeException ("在借阅图书时出现错误！");
    if (mapper.getBorrow (uid, bid) != null)
        throw new RuntimeException ("此书籍已经被此用户借阅了！");
    if (mapper.addBorrow (uid, bid) <= 0)
        throw new RuntimeException ("在录入借阅信息时出现错误！");
    if (! userClient.userBorrow (uid))
        throw new RuntimeException ("在借阅时出现错误！");
    return true;
}
```
由于 Seata 会分析修改数据的 sql，同时生成对应的反向回滚 SQL，这个回滚记录会存放在 undo_log 表中。所以**要求每一个 Client 都有一个对应的 undo_log 表**（也就是说每个服务连接的数据库都需要创建这样一个表，这里由于我们三个服务都用的同一个数据库，所以说就只用在这个数据库中创建 undo_log 表即可），表 SQL 定义如下：
```sql
CREATE TABLE `undo_log`
(
  `id`            BIGINT (20)   NOT NULL AUTO_INCREMENT,
  `branch_id`     BIGINT (20)   NOT NULL,
  `xid`           VARCHAR (100) NOT NULL,
  `context`       VARCHAR (128) NOT NULL,
  `rollback_info` LONGBLOB     NOT NULL,
  `log_status`    INT (11)      NOT NULL,
  `log_created`   DATETIME     NOT NULL,
  `log_modified`  DATETIME     NOT NULL,
  `ext`           VARCHAR (100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_undo_log` (`xid`, `branch_id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8;
```
创建完成之后，我们现在就可以启动三个服务了，我们来测试一下当出现异常的时候是不是会正常回滚：
![image-20230306233351571](https://s2.loli.net/2023/03/06/NIe9QFW3jf1DdnV.png)
![image-20230306233359914](https://s2.loli.net/2023/03/06/LwcdO2HuWAhFr5p.png)
首先第一次肯定是正常完成借阅操作的，接着我们再次进行请求，肯定会出现异常：
![image-20230306233408870](https://s2.loli.net/2023/03/06/6VOfsp9UxYJzgKD.png)
![image-20230306233417576](https://s2.loli.net/2023/03/06/yEQa2qeiNc5npV9.png)
如果能在栈追踪信息中看到 seata 相关的包，那么说明分布式事务已经开始工作了，通过日志我们可以看到，出现了回滚操作：
![image-20230306233428386](https://s2.loli.net/2023/03/06/VtBlx4U1TzcqKra.png)
并且数据库中确实是回滚了扣除操作：
![image-20230306233436382](https://s2.loli.net/2023/03/06/WXn9UPgxBVhdHmb.png)
这样，我们就通过 Seata 简单地实现了分布式事务，主要通过*使用 **XID** 来识别同一事务*。
### 使用 nacos 模式部署
前面我们实现了本地 Seata 服务的 file 模式部署，现在我们来看看如何让其配合 Nacos 进行部署，利用 Nacos 的配置管理和服务发现机制，Seata 能够更好地工作。
我们先单独为 Seata 配置一个命名空间：
![image-20230306233444767](https://s2.loli.net/2023/03/06/93mXN5dlC2GTLOW.png)
我们打开 `conf` 目录中的 `registry. conf` 配置文件：
```properties
registry {
	# 注册配置
	# 可以看到这里可以选择类型，默认情况下是普通的 file 类型，也就是本地文件的形式进行注册配置
	# 支持的类型如下，对应的类型在下面都有对应的配置
  # file 、nacos 、eureka、redis、zk、consul、etcd 3、sofa
  type = "nacos"
	# 采用 nacos 方式会将 seata 服务端也注册到 nacos 中，这样客户端就可以利用服务发现自动找到 seata 服务
	# 就不需要我们手动指定 IP 和端口了，不过看似方便，坑倒是不少，后面再说
  nacos {
  	# 应用名称，这里默认就行
    application = "seata-server"
    # Nacos 服务器地址
    serverAddr = "localhost:8848"
    # 这里使用的是 SEATA_GROUP 组，一会注册到 Nacos 中就是这个组
    group = "SEATA_GROUP"
    # 这里就使用我们上面单独为 seata 配置的命名空间，注意填的是 ID
    namespace = "89 fc 2145-4676-48 b 8-9 edd-29 e 867879 bcb"
    # 集群名称，这里还是使用 default
    cluster = "default"
    # Nacos 的用户名和密码
    username = "nacos"
    password = "nacos"
  }
  	#...
```
注册信息配置完成之后，接着我们需要将配置文件也放到 Nacos 中，让 Nacos 管理配置，这样我们就可以对配置进行热更新了，一旦环境需要变化，只需要直接在 Nacos 中修改即可。
```properties
config {
	# 这里我们也使用 nacos
  # file、nacos 、apollo、zk、consul、etcd 3
  type = "nacos"
  nacos {
  	# 跟上面一样的配法
    serverAddr = "127.0.0.1:8848"
    namespace = "89 fc 2145-4676-48 b 8-9 edd-29 e 867879 bcb"
    group = "SEATA_GROUP"
    username = "nacos"
    password = "nacos"
    # 这个不用改，默认就行
    dataId = "seataServer. properties"
  }
```
接着，我们需要将配置导入到 Nacos 中，我们打开一开始下载的源码 `script/config-center/nacos` 目录，这是官方提供的上传脚本，我们直接运行即可（windows 下没对应的 bat 就很蛋疼，可以使用 git 命令行来运行一下），这里我们使用这个可交互的版本：
![image-20230306233500474](https://s2.loli.net/2023/03/06/1tPwBFn7u3ScCeY.png)
按照提示输入就可以了，不输入就使用的默认值，不知道为啥最新版本有四个因为参数过长还导入失败了，就离谱，不过不影响。
导入成功之后，可以在对应的命名空间下看到对应的配置（为啥非要一个一个配置项单独搞，就不能写一起吗）：
![image-20230306233510973](https://s2.loli.net/2023/03/06/8yTQGZluYVe1cg2.png)
注意，还没完，我们还需要将对应的事务组映射配置也添加上，DataId 格式为 `service.vgroupMapping.事务组名称`，比如我们就使用默认的名称，值全部依然使用 default 即可：
![image-20230306233521002](https://s2.loli.net/2023/03/06/UBchb4zPjHAfCSs.png)
现在我们就完成了服务端的 Nacos 配置，接着我们需要对客户端也进行 Nacos 配置：
```yaml
seata:
	# 注册
  registry:
  	# 使用 Nacos
    type: nacos
    nacos:
    	# 使用 Seata 的命名空间，这样才能正确找到 Seata 服务，由于组使用的是 SEATA_GROUP，配置默认值就是，就不用配了
      namespace: 89 fc 2145-4676-48 b 8-9 edd-29 e 867879 bcb
      username: nacos
      password: nacos
  # 配置
  config:
    type: nacos
    nacos:
      namespace: 89 fc 2145-4676-48 b 8-9 edd-29 e 867879 bcb
      username: nacos
      password: nacos
```
现在我们就可以启动这三个服务了，可以在 Nacos 中看到 Seata 以及三个服务都正常注册了：
![image-20230306233529255](https://s2.loli.net/2023/03/06/PSbw5TFhm74Wu3n.png)
![image-20230306233538630](https://s2.loli.net/2023/03/06/nZUcuM2kJ86zgBv.png)
接着我们就可以访问一下服务试试看了：
![image-20230306233545257](https://s2.loli.net/2023/03/06/Fn3R2Jrq1YyleCh.png)
可以看到效果和上面是一样的，不过现在我们的注册和配置都继承在 Nacos 中进行了。
我们还可以配置一下事务会话信息的存储方式，默认是 file 类型，那么就会在运行目录下创建 `file_store` 目录，我们可以将其搬到数据库中存储，只需要修改一下配置即可：
![image-20230306233553931](https://s2.loli.net/2023/03/06/Cph9zPF2kaSvKdY.png)
将 `store. session. mode` 和 `store. mode` 的值修改为 `db`
接着我们对数据库信息进行一下配置：
* 数据库驱动
* 数据库 URL
* 数据库用户名密码
其他的默认即可：
![image-20230306233612224](https://s2.loli.net/2023/03/06/dlmYNnARZaxJ5MH.png)
接着我们需要将对应的数据库进行创建，创建 seata 数据库，然后直接 CV 以下语句：
```sql
-- -------------------------------- The script used when storeMode is 'db' --------------------------------
-- the table to store GlobalSession data
CREATE TABLE IF NOT EXISTS `global_table`
(
    `xid`                       VARCHAR (128) NOT NULL,
    `transaction_id`            BIGINT,
    `status`                    TINYINT      NOT NULL,
    `application_id`            VARCHAR (32),
    `transaction_service_group` VARCHAR (128),
    `transaction_name`          VARCHAR (128),
    `timeout`                   INT,
    `begin_time`                BIGINT,
    `application_data`          VARCHAR (2000),
    `gmt_create`                DATETIME,
    `gmt_modified`              DATETIME,
    PRIMARY KEY (`xid`),
    KEY `idx_status_gmt_modified` (`status` , `gmt_modified`),
    KEY `idx_transaction_id` (`transaction_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf 8 mb 4;
-- the table to store BranchSession data
CREATE TABLE IF NOT EXISTS `branch_table`
(
    `branch_id`         BIGINT       NOT NULL,
    `xid`               VARCHAR (128) NOT NULL,
    `transaction_id`    BIGINT,
    `resource_group_id` VARCHAR (32),
    `resource_id`       VARCHAR (256),
    `branch_type`       VARCHAR (8),
    `status`            TINYINT,
    `client_id`         VARCHAR (64),
    `application_data`  VARCHAR (2000),
    `gmt_create`        DATETIME (6),
    `gmt_modified`      DATETIME (6),
    PRIMARY KEY (`branch_id`),
    KEY `idx_xid` (`xid`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf 8 mb 4;
-- the table to store lock data
CREATE TABLE IF NOT EXISTS `lock_table`
(
    `row_key`        VARCHAR (128) NOT NULL,
    `xid`            VARCHAR (128),
    `transaction_id` BIGINT,
    `branch_id`      BIGINT       NOT NULL,
    `resource_id`    VARCHAR (256),
    `table_name`     VARCHAR (32),
    `pk`             VARCHAR (36),
    `status`         TINYINT      NOT NULL DEFAULT '0' COMMENT '0: locked ,1: rollbacking',
    `gmt_create`     DATETIME,
    `gmt_modified`   DATETIME,
    PRIMARY KEY (`row_key`),
    KEY `idx_status` (`status`),
    KEY `idx_branch_id` (`branch_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf 8 mb 4;
CREATE TABLE IF NOT EXISTS `distributed_lock`
(
    `lock_key`       CHAR (20) NOT NULL,
    `lock_value`     VARCHAR (20) NOT NULL,
    `expire`         BIGINT,
    primary key (`lock_key`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf 8 mb 4;
INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('HandleAllSession', ' ', 0);
```
![image-20230306233627086](https://s2.loli.net/2023/03/06/7zvewSLhFmbc8G1.png)
完成之后，重启 Seata 服务端即可：
![image-20230306233752098](https://s2.loli.net/2023/03/06/G7qQoEy8DCX9bLJ.png)
看到了数据源初始化成功，现在已经在使用数据库进行会话存储了。
如果 Seata 服务端出现报错，可能是我们自定义事务组的名称太长了：
![image-20230306233933641](https://s2.loli.net/2023/03/06/qoNhgzM2PXpZU9B.png)
将 `globle_table` 表的字段 `transaction_server_group` 长度适当增加一下即可：
![image-20230306233940850](https://s2.loli.net/2023/03/06/9LnaoUxHzlY1GdV.png)

---
## Dubbo 服务治理与通信
### 1.简介
Apache Dubbo 是一款 **RPC 服务开发框架**，用于解决微服务架构下的**服务治理与通信**问题，官方提供了 Java、Golang 等多语言 SDK 实现。使用 Dubbo 开发的微服务原生具备相互之间的远程地址发现与通信能力，利用 Dubbo 提供的丰富服务治理特性，可以实现诸如*服务发现、负载均衡、流量调度等服务治理*诉求。Dubbo 被设计为高度可扩展，用户可以方便的实现流量拦截、选址的各种定制逻辑。
在云原生时代，Dubbo 相继衍生出了 Dubbo3、Proxyless Mesh 等架构与解决方案，在易用性、超大规模微服务实践、云原生基础设施适配、安全性等几大方向上进行了全面升级。
Dubbo 功能：
	1. **微服务编程范式和工具**
	Dubbo 支持基于 IDL 或语言特定方式的服务定义，提供多种形式的服务调用形式（如同步、异步、流式等）
	2. **高性能的 RPC 通信**
	Dubbo 帮助解决微服务组件之间的通信问题，提供了基于 HTTP、HTTP/2、TCP 等的多种高性能通信协议实现，并支持序列化协议扩展，在实现上解决网络连接管理、数据传输等基础问题。
	3. **微服务监控与治理**
	Dubbo 官方提供的服务发现、动态配置、负载均衡、流量路由等基础组件可以很好的帮助解决微服务基础实践的问题。除此之外，您还可以用 Admin 控制台监控微服务状态，通过周边生态完成限流降级、数据一致性、链路追踪等能力。
	4. **部署在多种环境**
	Dubbo 服务可以直接部署在容器、Kubernetes、Service Mesh 等多种架构下。
![](https://cn.dubbo.apache.org/imgs/v3/concepts/architecture-2.png)
以上是 Dubbo 的工作原理图，从抽象架构上分为两层：**服务治理抽象控制面** 和 **Dubbo 数据面** 。
- **服务治理控制面**：服务治理控制面不是特指如注册中心类的单个具体组件，而是对 Dubbo 治理体系的抽象表达。控制面包含协调服务发现的注册中心、流量管控策略、Dubbo Admin 控制台等，如果采用了 Service Mesh 架构则还包含 Istio 等服务网格控制面。
- **Dubbo 数据面**：数据面代表集群部署的所有 Dubbo 进程，进程之间通过 RPC 协议实现数据交换，Dubbo 定义了微服务应用开发与调用规范并负责完成数据传输的编解码工作。
    - 服务消费者 (Dubbo Consumer)，发起业务调用或 RPC 通信的 Dubbo 进程
    - 服务提供者 (Dubbo Provider)，接收业务调用或 RPC 通信的 Dubbo 进程

### 2.dubbo 使用 nacos
> [!INFO] Tips
> **dubbo** 远程调用传递实体类时必须为实体类添加 `implements Serializable` 接口，以实现嵌套实体传递，否则会报错。

#### 公共调用 api 接口
1. 创建公共模块，将模块作为本地依赖导入需要用到的模块中

![image.png|450](http://qnpicmap.fcsluck.top/pics/202311211438260.png)
```xml
<!--        引入本地公共模块依赖-->  
<dependency>  
    <groupId>com.example</groupId>  
    <artifactId>commons</artifactId>  
    <version>0.0.1-SNAPSHOT</version>  
</dependency>
```
2. 定义远程调用 api 接口

```java
package com.test.api;  
import com.test.entity.Book;  
import com.test.entity.User;  
import com.test.utils.Result;  
// Dubbo 服务提供者接口  
public interface DubboApiService {  
    /**  
     * 调用 Dubbo 服务
     * @param name  
     * @return  
     */  
    Result<String> sayHello(String name);  
}
```
#### 供给者-provider
1.引入相关的 pom 配置
```xml
<!-- Dubbo Spring Cloud Starter -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-dubbo</artifactId>
        </dependency>
```
2.dubbo 相关配置
```yml
dubbo: #dubbo配置  
  application:  
    name: ${spring.application.name}  #dubbo服务名称供消费者订阅
    qos-enable: false #dubbo运维服务是否开启  
  scan:  
    base-packages: com.test.service  # 指定要扫描远程调用接口实现类的包路径  
  protocol:  
    name: dubbo  # 协议名称  
    port: -1  # 协议端口:（ -1 表示自增端口，从 20880 开始）  
  registry:  
    address: spring-cloud://${spring.cloud.nacos.discovery.server-addr}  # 注册中心的地址一定要加“spring-cloud://”才能注册上  
  consumer:  
    check: false  # 消费者是否检查版本  
server:  
  port: 8401  #应用服务端口
spring:  
  main:  
    allow-circular-references: true #Spring Boot 2.0 需要设定,允许循环引用  
    allow-bean-definition-overriding: true #Spring Boot 2.1 需要设定,允许覆盖bean  
  application:  
    name: dubbo-service-provider  #应用服务名称
  cloud:  
    nacos:  
      discovery:  
        # 配置Nacos注册中心地址  
        server-addr: xxx:8848  
#        namespace: 0737357d-c94a-4fff-9661-4257622a83fb #区分nacos命名空间
```
3.启动类加上 `@EnableDubbo` 注解
```java
@EnableShardingJdbc
@EnableDiscoveryClient
@SpringBootApplication
@EnableDubbo
public class DubboServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(DubboServiceApplication.class, args);
    }
}
```
4.实现 api 接口
```java
@DubboService  
public class DubboServiceImpl implements DubboApiService {  
    public Result<String> sayHello(String name) {  
        return Result.success("Hello " + name + ", response from dubbo");  
    }  
}
```
#### 消费者-consumer
1.引入相关的 pom 配置
```xml
<!-- Dubbo Spring Cloud Starter -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-dubbo</artifactId>
        </dependency>
```
2.dubbo 相关配置
```yml
dubbo:
  consumer:
    timeout: 5000
    check: false  #关闭订阅服务是否启动的检查【检查时，没有服务提供者会报错】
  protocol:    #Dubbo 服务暴露的协议配置，其中子属性 name 为协议名称，port 为协议端口（ -1 表示自增端口，从 20880 开始）
    name: dubbo
    port: -1  #dubbo协议缺省端口为20880，rmi协议缺省端口为1099，http和hessian协议缺省端口为80；如果没有配置port，则自动采用默认端口，如果配置为-1，则会分配一个没有被占用的端口。Dubbo 2.4.0+，分配的端口在协议缺省端口的基础上增长，确保端口段可控
  registry:
    #其中前缀spring-cloud说明：挂载到 Spring Cloud注册中心
	address: spring-cloud://${spring.cloud.nacos.discovery.server-addr}
    # address: spring-cloud://localhost  #dubbo服务注册端口，注册中心服务器地址，如果地址没有端口缺省为9090，同一集群内的多个地址用逗号分隔，如：ip:port,ip:port
  cloud:
    subscribed-services: dubbo-service-provider #指定调用的服务名称
```
3.调用 api 接口，实现 dubbo
```java
@Slf4j  
@RestController  
@RequestMapping("/api/borrow")  
public class BorrowController {  
    @Resource  
    BorrowService borrowService;  
    @DubboReference(check = false)  
    DubboApiService dubboApiService;  
    @GetMapping("/testDubbo/{msg}")  
    Result<String> helloMsg(@PathVariable("msg") String msg) {  
        return dubboApiService.sayHello(msg);  
    }
}
```
### 3.服务调用对比
1. REST 和 RPC
在单体应用中，各模块间的调用是通过编程语言级别的方法函数来实现，但分布式系统运行在多台机器上，一般来说，每个服务实例都是一个进程，服务间必须使用进程间通信机制来交互，而常见的通信协议主要有 RPC 和 REST 协议。
（1）REST：REST 是基于 HTTP 实现，使用 HTTP 协议处理数据通信，更加标准化与通用，因为无论哪种语言都支持 HTTP 协议。常见的 http API 都可以称为 Rest 接口。REST 是一种架构风格，指一组架构约束条件和原则，满足 REST 原则的应用程序或设计就是 RESTful，RESTful 把一切内容都视为资源。REST 强调组件交互的扩展性、接口的通用性、组件的独立部署、以及减少交互延迟的中间件，它强化安全，也能封装遗留系统。
**REST（Representational State Transfer）**：
	- **设计哲学：** REST 是一种基于资源的架构风格，强调在分布式系统中的资源的标识和状态。它的设计目标是简化分布式系统的通信和状态管理。
	- **通信方式：** REST 使用 HTTP 协议作为通信协议，通常使用标准的 HTTP 方法（GET、POST、PUT、DELETE 等）来操作资源。
	- **数据传输：** REST 使用通常是基于文本的数据格式，如 JSON 或 XML，用于表示资源和状态。这些数据格式易于理解和处理。
	- **状态：** REST 通信是无状态的，每个请求都包含了足够的信息来理解和处理请求，服务端不需要保留客户端的状态信息。
	- **缓存：** REST 支持缓存，可以使用 HTTP 标准的缓存机制来提高性能。
（2）RPC：是一种进程间通信方式，允许像调用本地服务一样调用远程服务，通信协议大多采用二进制方式。
**RPC（Remote Procedure Call）**：
	- **设计哲学：** RPC 是一种远程调用的机制，其设计目标是使分布式系统中的方法调用就像本地方法调用一样。
	- **通信方式：** RPC 使用自定义的协议来进行通信，它通常需要专门的 RPC 框架来处理请求和响应。常见的 RPC 框架包括 Dubbo、gRPC、Thrift 等。
	- **数据传输：** RPC 框架通常使用二进制协议，这些协议通常比文本协议更高效。
	- **状态：** RPC 通信可以是有状态的，服务端可以保留客户端的状态信息，这在某些场景中可能有用。
	- **缓存：** RPC 框架通常不直接支持缓存，但可以在应用层面进行缓存的处理。
**区别：**
	1. **设计哲学：** REST 是一种基于资源和状态的架构风格，强调简化和通用性，而 RPC 专注于远程方法调用和接口定义。
	2. **通信方式：** REST 使用标准的 HTTP 协议，而 RPC 使用自定义的通信协议。
	3. **数据传输：** REST 通常使用文本格式（如 JSON 或 XML）传输数据，而 RPC 通常使用更高效的二进制协议。
	4. **状态：** REST 是无状态的，每个请求都包含足够信息，而 RPC 可以是有状态的，服务端可以保留客户端的状态信息。
	5. **缓存：** REST 直接支持 HTTP 标准的缓存机制，而 RPC 通常需要应用层面的缓存处理。
2. dubbo 和 feign 的区别与联系: 
- 相同点: <u>Dubbo 与 Feign 都依赖注册中心、负载均衡</u>。
- 不同点:
1. 协议
	**Dubbo**：
	- 支持多传输协议(`Dubbo、Rmi、http、redis` 等等)，可以根据业务场景选择最佳的方式。非常灵活。  
	- 默认的 Dubbo 协议：利用 Netty，TCP 传输，单一、异步、长连接，适合数据量小、高并发和服务提供者远远少于消费者的场景。  
	*Feign*：
	- 基于 Http 传输协议，短连接，不适合高并发的访问。
2. 负载均衡
	**Dubbo**：
	- 支持 4 种算法（`随机、轮询、活跃度、Hash 一致性`），而且算法里面引入权重的概念。  
	- 配置的形式不仅**支持代码配置，还支持 Dubbo 控制台灵活动态配置**。  
	- 负载均衡的算法可以精准到某个服务接口的某个方法。  
	*Feign*：
	- 只支持 N 种策略：`轮询、随机、ResponseTime 加权`。  
	- 负载均衡算法是 Client 级别的。  
3. 容错策略
	**Dubbo**：
	- 支持多种容错策略：`failover、failfast、brodecast、forking` 等，也引入了 retry 次数、timeout 等配置参数。
	*Feign*：
	- 利用*熔断机制来实现容错*的，处理的方式不一样。

|比较项|Feign（RESTful）|Dubbo|
|:---:|:---:|:---:|
|通讯协议|HTTP|默认 Dubbo 协议|
|性能|略低|较高|
|灵活度|高|低|
### 4.Open [Feign](https://so.csdn.net/so/search?q=Feign&spm=1001.2101.3001.7020) 迁移 Dubbo
[Dubbo](https://so.csdn.net/so/search?q=Dubbo&spm=1001.2101.3001.7020) Spring Cloud 提供了方案，即 `@DubboTransported` 注解，支持在类，方法，属性上使用。能够帮助服务消费端的 `Spring Cloud Open Feign` 接口以及 `@LoadBalanced` RestTemplate Bean 底层走 Dubbo 调用（可切换 Dubbo 支持的协议），而服务提供方则只需在原有 @RestController 类上追加  `@DubboServce` 注解（需要抽取接口）即可，换言之，在不调整 Feign 接口以及 RestTemplate URL 的前提下，实现无缝迁移。  
> 前提是为每个服务提供者配置好 `application.yml中的dubbo`，尤其是 `port` 端口配置要不同（配置为 **-1** 自动选择不冲突的端口）。

1. 修改服务提供者
```java
@RestController  
@DubboService  
@RefreshScope //添加此注解就能实现自动刷新了  
@RequestMapping("/api/user")  
public class UserController {  
    @Resource  
    UserService userService;  
    /**  
     * 根据用户ID获取用户信息     *     * @param uid 用户ID  
     * @return 用户信息  
     */    @GetMapping("/{uid}")  
    User getUserById(@PathVariable("uid") Integer uid) {  
        return userService.getUserById(uid);  
    }
}
```
2. 消费端引入依赖

```xml
<dependency> 
	<groupId>com.alibaba.cloud</groupId> 
	<artifactId>spring-cloud-starter-dubbo</artifactId> 
</dependency>
<!--        服务调用-->  
<dependency>  
    <groupId>org.springframework.cloud</groupId>  
    <artifactId>spring-cloud-starter-openfeign</artifactId>  
</dependency>
```
3. feign 的实现，启动类上添加 `@EnableFeignClients`

```java
@SpringBootApplication  
@EnableFeignClients
public class BorrowApplication {  
    public static void main(String[] args) {  
        SpringApplication.run(BorrowApplication.class, args);  
    }  
}
```
4. feign 接口添加 `@DubboTransported` 注解

```java
@DubboTransported(protocol = "dubbo")  
@FeignClient(value = "user-service", fallback = UserClientImpl.class, path = "/api/user/")  
public interface UserClient {  
    @RequestMapping("/uid}")  
    User getUserById(@PathVariable("uid") int uid);  
    @RequestMapping("/remain/{uid}")  
    int userRemain(@PathVariable("uid") int uid);  
    @RequestMapping("/borrow/{uid}")  
    boolean userBorrow(@PathVariable("uid") int uid);  
}
```
5. 调用对象添加 `@DubboTransported` 注解

```java
@Service  
@Slf4j  
public class BorrowServiceImpl implements BorrowService {  
    @Resource  
    BorrowMapper borrowMapper;  
    @Resource  
    @DubboTransported    
    UserClient userClient;
}
```

---
## RabbitMQ 消息队列
![image-20220415163559986](https://s2.loli.net/2023/03/08/9a2q4ZBuWxJs861.jpg)
什么是消息队列呢？
我们之前如果需要进行远程调用，那么一般可以通过发送 HTTP 请求来完成，而现在，我们可以使用第二种方式，就是消息队列，它能够将发送方发送的信息放入队列中，当新的消息入队时，会通知接收方进行处理，一般消息发送方称为生产者，接收方称为消费者。
![image-20220415165805716](https://s2.loli.net/2023/03/08/yknBVt2jGgFSTO8.jpg)
这样我们所有的请求，都可以直接丢到消息队列中，再由消费者取出，不再是直接连接消费者的形式了，而是加了一个中间商，这也是一种很好的解耦方案，并且在高并发的情况下，由于消费者能力有限，消息队列也能起到一个削峰填谷的作用，堆积一部分的请求，再由消费者来慢慢处理，而不会像直接调用那样请求蜂拥而至。
那么，消息队列具体实现有哪些呢：
* RabbitMQ  -  性能很强，吞吐量很高，支持多种协议，集群化，消息的可靠执行特性等优势，很适合企业的开发。
* Kafka - 提供了超高的吞吐量，ms 级别的延迟，极高的可用性以及可靠性，而且分布式可以任意扩展。
* RocketMQ  -  阿里巴巴推出的消息队列，经历过双十一的考验，单机吞吐量高，消息的高可靠性，扩展性强，支持事务等，但是功能不够完整，语言支持性较差。

我们这里，主要讲解的是 RabbitMQ 消息队列。
**官方网站：** https://www.rabbitmq.com
> RabbitMQ 拥有数万计的用户，是最受欢迎的开源消息队列之一，从 [T-Mobile](https://www.youtube.com/watch?v=1qcTu2QUtrU) 到 [Runtastic](https://medium.com/@runtastic/messagebus-handling-dead-letters-in-rabbitmq-using-a-dead-letter-exchange-f070699b952b)，RabbitMQ 在全球范围内用于小型初创企业和大型企业。
>
> RabbitMQ 轻量级，易于在本地和云端部署，它支持多种消息协议。RabbitMQ 可以部署在分布式和联合配置中，以满足大规模、高可用性要求。
>
> RabbitMQ 在许多操作系统和云环境中运行，并为[大多数流行语言](https://www.rabbitmq.com/devtools.html)提供了[广泛的开发者工具](https://www.rabbitmq.com/devtools.html)。

我们首先还是来看看如何进行安装。
### 安装消息队列
**下载地址：** https://www.rabbitmq.com/download.html
由于除了消息队列本身之外还需要 Erlang 环境（RabbitMQ 就是这个语言开发的）所以我们就在我们的 Ubuntu 服务器上进行安装。
首先是 Erlang，比较大，1GB 左右：
```sh
sudo apt install erlang
```
接着安装 RabbitMQ：
```sh
sudo apt install rabbitmq-server
```
安装完成后，可以输入：
```sh
sudo rabbitmqctl status
```
来查看当前的 RabbitMQ 运行状态，包括运行环境、内存占用、日志文件等信息：
```
Runtime
OS PID: 13718
OS: Linux
Uptime (seconds): 65
Is under maintenance?: false
RabbitMQ version: 3.8.9
Node name: rabbit@ubuntu-server-2
Erlang configuration: Erlang/OTP 23 [erts-11.1.8] [source] [64-bit] [smp:2:2] [ds:2:2:10] [async-threads:64]
Erlang processes: 280 used, 1048576 limit
Scheduler run queue: 1
Cluster heartbeat timeout (net_ticktime): 60
```
这样我们的 RabbitMQ 服务器就安装完成了，要省事还得是 Ubuntu 啊。
可以看到默认有两个端口名被使用：
```
Listeners
Interface: [::], port: 25672, protocol: clustering, purpose: inter-node and CLI tool communication
Interface: [::], port: 5672, protocol: amqp, purpose: AMQP 0-9-1 and AMQP 1.0
```
我们一会主要使用的就是 amqp 协议的那个端口 `5672` 来进行连接，25672 是集群化端口，之后我们也会用到。
接着我们还可以将 RabbitMQ 的管理面板开启，这样话就可以在浏览器上进行实时访问和监控了：
```sh
sudo rabbitmq-plugins enable rabbitmq_management
```
再次查看状态，可以看到多了一个管理面板，使用的是 HTTP 协议：
```
Listeners
Interface: [::], port: 25672, protocol: clustering, purpose: inter-node and CLI tool communication
Interface: [::], port: 5672, protocol: amqp, purpose: AMQP 0-9-1 and AMQP 1.0
Interface: [::], port: 15672, protocol: http, purpose: HTTP API
```
我们打开浏览器直接访问一下：
![image-20220415203431587](https://s2.loli.net/2023/03/08/HxtXlqi7BUYWdC2.jpg)
可以看到需要我们进行登录才可以进入，我们这里还需要创建一个用户才可以，这里就都用 admin：
```sh
sudo rabbitmqctl add_user 用户名 密码
```
将管理员权限给予我们刚刚创建好的用户：
```sh
sudo rabbitmqctl set_user_tags admin administrator
```
创建完成之后，我们登录一下页面：
![image-20220415203728664](https://s2.loli.net/2023/03/08/eEJMsxhc5Onpld8.jpg)
进入了之后会显示当前的消息队列情况，包括版本号、Erlang 版本等，这里需要介绍一下 RabbitMQ 的设计架构，这样我们就知道各个模块管理的是什么内容了：
![image-20220416103043845](https://s2.loli.net/2023/03/08/j5kIgD9ZRQiGtd6.jpg)
* **生产者（Publisher）和消费者（Consumer）：** 不用多说了吧。
* **Channel：** 我们的客户端连接都会使用一个 Channel，再通过 Channel 去访问到 RabbitMQ 服务器，注意通信协议不是 http，而是 amqp 协议。
* **Exchange：** 类似于交换机一样的存在，会根据我们的请求，转发给相应的消息队列，每个队列都可以绑定到 Exchange 上，这样 Exchange 就可以将数据转发给队列了，可以存在很多个，不同的 Exchange 类型可以用于实现不同消息的模式。
* **Queue：** 消息队列本体，生产者所有的消息都存放在消息队列中，等待消费者取出。
* **Virtual Host：** 有点类似于环境隔离，不同环境都可以单独配置一个 Virtual Host，每个 Virtual Host 可以包含很多个 Exchange 和 Queue，每个 Virtual Host 相互之间不影响。

### 使用消息队列
我们就从最简的的模型开始讲起：
![image-20220417103647609](https://s2.loli.net/2023/03/08/GWkUJx1g8ZnTV57.jpg)
（一个生产者 -> 消息队列 -> 一个消费者）
生产者只需要将数据丢进消息队列，而消费者只需要将数据从消息队列中取出，这样就实现了生产者和消费者的消息交互。我们现在来演示一下，首先进入到我们的管理页面，这里我们创建一个新的实验环境，只需要新建一个 Virtual Host 即可：
![image-20220419143014974](https://s2.loli.net/2023/03/08/PzehXHuDyFANIKV.jpg)
添加新的虚拟主机之后，我们可以看到，当前 admin 用户的主机访问权限中新增了我们刚刚添加的环境：
![image-20220419143115507](https://s2.loli.net/2023/03/08/9cGyunKrTvjfDRp.jpg)
现在我们来看看交换机：
![image-20220419143338487](https://s2.loli.net/2023/03/08/GDnFoizW86pC5l9.jpg)
交换机列表中自动为我们新增了刚刚创建好的虚拟主机相关的预设交换机，一共7个，这里我们首先介绍一下前面两个 `direct` 类型的交换机，一个是 `（AMQP default）` 还有一个是 `amq.direct`，它们都是直连模式的交换机，我们来看看第一个：
![image-20220419143612318](https://s2.loli.net/2023/03/08/lIpfxGjLPrOatE5.jpg)
第一个交换机是所有虚拟主机都会自带的一个默认交换机，并且此交换机不可删除，此交换机默认绑定到所有的消息队列，如果是通过默认交换机发送消息，那么会根据消息的 `routingKey`（之后我们发消息都会指定）决定发送给哪个同名的消息队列，同时也不能显示地将消息队列绑定或解绑到此交换机。
我们可以看到，详细信息中，当前交换机特性是持久化的，也就是说就算机器重启，那么此交换机也会保留，如果不是持久化，那么一旦重启就会消失。实际上我们在列表中看到 `D` 的字样，就表示此交换机是持久化的，包含一会我们要讲解的消息队列列表也是这样，所有自动生成的交换机都是持久化的。
我们接着来看第二个交换机，这个交换机是一个普通的直连交换机：
![image-20220419144200533](https://s2.loli.net/2023/03/08/DnpENxIPgOUTSbM.jpg)
这个交换机和我们刚刚介绍的默认交换机类型一致，并且也是持久化的，但是我们可以看到它是具有绑定关系的，如果没有指定的消息队列绑定到此交换机上，那么这个交换机无法正常将信息存放到指定的消息队列中，也是根据 `routingKey` 寻找消息队列（但是可以自定义）
我们可以在下面直接操作，让某个队列绑定，这里我们先不进行操作。
介绍完了两个最基本的交换机之后（其他类型的交换机我们会在后面进行介绍），我们接着来看消息队列：
![image-20220419144508881](https://s2.loli.net/2023/03/08/q7WcUvZp8NhMb9f.jpg)
可以看到消息队列列表中没有任何的消息队列，我们可以来尝试添加一个新的消息队列：
![image-20220419144553817](https://s2.loli.net/2023/03/08/D8hv6Kbo3eSNzVp.jpg)
第一行，我们选择我们刚刚创建好的虚拟主机，在这个虚拟主机下创建此消息队列，接着我们将其类型定义为 `Classic` 类型，也就是经典类型（其他类型我们会在后面逐步介绍）名称随便起一个，然后持久化我们选择 `Transient` 暂时的（当然也可以持久化，看你自己）自动删除我们选择 `No`（需要至少有一个消费者连接到这个队列，之后，一旦所有与这个队列连接的消费者都断开时，就会自动删除此队列）最下面的参数我们暂时不进行任何设置（之后会用到）
现在，我们就创建好了一个经典的消息队列：
![image-20220419145109450](https://s2.loli.net/2023/03/08/yGSt4HbT7iX3Nze.jpg)
点击此队列的名称，我们可以查看详细信息：
![image-20220419145238458](https://s2.loli.net/2023/03/08/NGCFKhcUf9lOADX.jpg)
详细相信中包括队列的当前负载状态、属性、消息队列占用的内存，消息数量等，一会我们发送消息时可以进一步进行观察。
现在我们需要将此消息队列绑定到上面的第二个直连交换机，这样我们就可以通过此交换机向此消息队列发送消息了：
![image-20220419145520844](https://s2.loli.net/2023/03/08/NGCFKhcUf9lOADX.jpg)
这里填写之前第二个交换机的名称还有我们自定义的 `routingKey`（最好还是和消息队列名称一致，这里是为了一会演示两个交换机区别用）我们直接点击绑定即可：
![image-20220419145635179](https://s2.loli.net/2023/03/08/u95NJG2YskOBpXl.jpg)
绑定之后我们可以看到当前队列已经绑定对应的交换机了，现在我们可以前往交换机对此消息队列发送一个消息：
![image-20220419145725499](https://s2.loli.net/2023/03/08/MBIDVqzf8oce2L4.jpg)
回到交换机之后，可以卡到这边也是同步了当前的绑定信息，在下方，我们直接向此消息队列发送信息：
![image-20220419145808450](https://s2.loli.net/2023/03/08/htEoZ49zu6mipCM.jpg)
点击发送之后，我们回到刚刚的交换机详细页面，可以看到已经有一条新的消息在队列中了：
![image-20220419145903723](https://s2.loli.net/2023/03/08/nO9eUjMRbCmBqPT.jpg)
我们可以直接在消息队列这边获取消息队列中的消息，找到下方的 Get message 选项：
![image-20220419145936160](https://s2.loli.net/2023/03/08/emrY3SZ98CJRAOh.jpg)
可以看到有三个选择，首先第一个 Ack Mode，这个是应答模式选择，一共有 4 个选项：
![image-20220419150053926](https://s2.loli.net/2023/03/08/nrWPuoGRTp7F36e.jpg)
* Nack message requeue true：拒绝消息，也就是说不会将消息从消息队列取出，并且重新排队，一次可以拒绝多个消息。
* Ack message requeue false：确认应答，确认后消息会从消息队列中移除，一次可以确认多个消息。
* Reject message requeue true/false：也是拒绝此消息，但是可以指定是否重新排队。

这里我们使用默认的就可以了，这样只会查看消息是啥，但是不会取出，消息依然存在于消息队列中，第二个参数是编码格式，使用默认的就可以了，最后就是要生效的操作数量，选择 1 就行：
![image-20220419150712314](https://s2.loli.net/2023/03/08/c6auDXoHFqZT9M2.jpg)
可以看到我们刚刚的消息已经成功读取到。
现在我们再去第一个默认交换机中尝试发送消息试试看：
![image-20220419150913859](https://s2.loli.net/2023/03/08/t5V3yQ8kbOKRpxf.jpg)
如果我们使用之前自定义的`routingKey`，会显示没有路由，这是因为默认的交换机只会找对应名称的消息队列，我们现在向`yyds`发送一下试试看：
![image-20220419151016735](https://s2.loli.net/2023/03/08/LCVPvykIjMox9m1.jpg)
可以看到消息成功发布了，我们来接收一下看看：
![image-20220419151058659](https://s2.loli.net/2023/03/08/9jsdfADB5HRC7wP.jpg)
可以看到成功发送到此消息队列中了。
当然除了在交换机发送消息给消息队列之外，我们也可以直接在消息队列这里发：
![image-20220419151155264](https://s2.loli.net/2023/03/08/cYPwJnbiZlmvqD3.jpg)
效果是一样的，注意这里我们可以选择是否将消息持久化，如果是持久化消息，那么就算服务器重启，此消息也会保存在消息队列中。
最后如果我们不需要再使用此消息队列了，我们可以手动对其进行删除或是清空：
![image-20220419151548923](https://s2.loli.net/2023/03/08/kJE5xwgZOTGWjLq.jpg)
点击 Delete Queue 删除我们刚刚创建好的`yyds`队列，到这里，我们对应消息队列的一些简单使用，就讲解完毕了。
### 使用 Java 操作消息队列
现在我们来看看如何通过 Java 连接到 RabbitMQ 服务器并使用消息队列进行消息发送（这里一起讲解，包括 Java 基础版本和 SpringBoot 版本），首先我们使用最基本的 Java 客户端连接方式：
```xml
<dependency>
    <groupId>com.rabbitmq</groupId>
    <artifactId>amqp-client</artifactId>
    <version>5.14.2</version>
</dependency>
```
依赖导入之后，我们来实现一下生产者和消费者，首先是生产者，生产者负责将信息发送到消息队列：
```java
public static void main(String[] args) {
    //使用 ConnectionFactory 来创建连接
    ConnectionFactory factory = new ConnectionFactory();
    //设定连接信息，基操
    factory.setHost("192.168.0.12");
    factory.setPort(5672);  //注意这里写 5672，是 amqp 协议端口
    factory.setUsername("admin");
    factory.setPassword("admin");
    factory.setVirtualHost("/test");
 		//创建连接
    try(Connection connection = factory.newConnection()){
    }catch (Exception e){
        e.printStackTrace();
    }
}
```
这里我们可以直接在程序中定义并创建消息队列（实际上是和我们在管理页面创建一样的效果）客户端需要通过连接创建一个新的通道（Channel），同一个连接下可以有很多个通道，这样就不用创建很多个连接也能支持分开发送了。
```java
try(Connection connection = factory.newConnection();
    Channel channel = connection.createChannel()){   //通过 Connection 创建新的 Channel
  	//声明队列，如果此队列不存在，会自动创建
    channel.queueDeclare("yyds", false, false, false, null);
  	//将队列绑定到交换机
    channel.queueBind("yyds", "amq.direct", "my-yyds");
  	//发布新的消息，注意消息需要转换为 byte[]
    channel.basicPublish("amq.direct", "my-yyds", null, "Hello World!".getBytes());
}catch (Exception e){
    e.printStackTrace();
}
```
其中`queueDeclare`方法的参数如下：
* **queue**：队列的名称（默认创建后 routingKey 和队列名称一致）
* **durable**：是否持久化。
* **exclusive**：是否排他，如果一个队列被声明为排他队列，该队列仅对首次声明它的连接可见，并在连接断开时自动删除。排他队列是基于 Connection 可见，同一个 Connection 的不同 Channel 是可以同时访问同一个连接创建的排他队列，并且，如果一个 Connection 已经声明了一个排他队列，其他的 Connection 是不允许建立同名的排他队列的，即使该队列是持久化的，一旦 Connection 关闭或者客户端退出，该排他队列都会自动被删除。
* **autoDelete**：是否自动删除。
* **arguments**：设置队列的其他一些参数，这里我们暂时不需要什么其他参数。

其中`queueBind`方法参数如下：
* **queue**：需要绑定的队列名称。
* **exchange**：需要绑定的交换机名称。
* **routingKey**：不用多说了吧。

其中`basicPublish`方法的参数如下：
* **exchange**: 对应的 Exchange 名称，我们这里就使用第二个直连交换机。
* **routingKey**：这里我们填写绑定时指定的 routingKey，其实和之前在管理页面操作一样。
* **props**：其他的配置。
* **body**：消息本体。

执行完成后，可以在管理页面中看到我们刚刚创建好的消息队列了：
![image-20220419153630431](https://s2.loli.net/2023/03/08/baiDgVyoPQ65TMX.jpg)
并且此消息队列已经成功与`amq.direct`交换机进行绑定：
![image-20220419154618613](https://s2.loli.net/2023/03/08/5lENjHswniC4Zg8.jpg)
那么现在我们的消息队列中已经存在数据了，怎么将其读取出来呢？我们来看看如何创建一个消费者：
```java
public static void main(String[] args) throws IOException, TimeoutException {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setHost("10.37.129.4");
    factory.setPort(5672);
    factory.setUsername("admin");
    factory.setPassword("admin");
    factory.setVirtualHost("/test");
    //这里不使用 try-with-resource，因为消费者是一直等待新的消息到来，然后按照
    //我们设定的逻辑进行处理，所以这里不能在定义完成之后就关闭连接
    Connection connection = factory.newConnection();
    Channel channel = connection.createChannel();
    //创建一个基本的消费者
    channel.basicConsume("yyds", false, (s, delivery) -> {
        System.out.println(new String(delivery.getBody()));
        //basicAck 是确认应答，第一个参数是当前的消息标签，后面的参数是
        //是否批量处理消息队列中所有的消息，如果为 false 表示只处理当前消息
        channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
        //basicNack 是拒绝应答，最后一个参数表示是否将当前消息放回队列，如果
        //为 false，那么消息就会被丢弃
        //channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
        //跟上面一样，最后一个参数为 false，只不过这里省了
        //channel.basicReject(delivery.getEnvelope().getDeliveryTag(), false);
    }, s -> {});
}
```
其中`basicConsume`方法参数如下：
* **queue**  -  消息队列名称，直接指定。
* **autoAck** - 自动应答，消费者从消息队列取出数据后，需要跟服务器进行确认应答，当服务器收到确认后，会自动将消息删除，如果开启自动应答，那么消息发出后会直接删除。
* **deliver**  -  消息接收后的函数回调，我们可以在回调中对消息进行处理，处理完成后，需要给服务器确认应答。
* **cancel**  -  当消费者取消订阅时进行的函数回调，这里暂时用不到。
现在我们启动一下消费者，可以看到立即读取到我们刚刚插入到队列中的数据：
![image-20220419155938158](https://s2.loli.net/2023/03/08/rR7eThxXbufjsEo.jpg)
我们现在继续在消息队列中插入新的数据，这里直接在网页上进行操作就行了，同样的我们也可以在消费者端接受并进行处理。
现在我们把刚刚创建好的消息队列删除。
官方文档： https://docs.spring.io/spring-amqp/docs/current/reference/html/
前面我们已经完成了 RabbitMQ 的安装和简单使用，并且通过 Java 连接到服务器。现在我们来尝试在 SpringBoot 中整合消息队列客户端，首先是依赖：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```
接着我们需要配置 RabbitMQ 的地址等信息：
```yaml
spring:
  rabbitmq:
    addresses: 192.168.0.4
    username: admin
    password: admin
    virtual-host: /test
```
这样我们就完成了最基本信息配置，现在我们来看一下，如何像之前一样去声明一个消息队列，我们只需要一个配置类就行了：
```java
@Configuration
public class RabbitConfiguration {
    @Bean("directExchange")  //定义交换机 Bean，可以很多个
    public Exchange exchange(){
        return ExchangeBuilder.directExchange("amq.direct").build();
    }
    @Bean("yydsQueue")     //定义消息队列
    public Queue queue(){
        return QueueBuilder
          				.nonDurable("yyds")   //非持久化类型
          				.build();
    }
    @Bean("binding")
    public Binding binding(@Qualifier("directExchange") Exchange exchange,
                           @Qualifier("yydsQueue") Queue queue){
      	//将我们刚刚定义的交换机和队列进行绑定
        return BindingBuilder
                .bind(queue)   //绑定队列
                .to(exchange)  //到交换机
                .with("my-yyds")   //使用自定义的 routingKey
                .noargs();
    }
}
```
接着我们来创建一个生产者，这里我们直接编写在测试用例中：
```java
@SpringBootTest
class SpringCloudMqApplicationTests {
  	//RabbitTemplate 为我们封装了大量的 RabbitMQ 操作，已经由 Starter 提供，因此直接注入使用即可
    @Resource
    RabbitTemplate template;
    @Test
    void publisher() {
      	//使用 convertAndSend 方法一步到位，参数基本和之前是一样的
      	//最后一个消息本体可以是 Object 类型，真是大大的方便
        template.convertAndSend("amq.direct", "my-yyds", "Hello World!");
    }
}
```
现在我们来运行一下这个测试用例：
![image-20220419221426545](https://s2.loli.net/2023/03/08/UxVemu9B2cGifWv.jpg)
可以看到后台自动声明了我们刚刚定义好的消息队列和交换机以及对应的绑定关系，并且我们的数据也是成功插入到消息队列中：
![image-20220419221532673](https://s2.loli.net/2023/03/08/RjY4JUn7v9pmryx.jpg)
现在我们再来看看如何创建一个消费者，因为消费者实际上就是一直等待消息然后进行处理的角色，这里我们只需要创建一个监听器就行了，它会一直等待消息到来然后再进行处理：
```java
@Component  //注册为 Bean
public class TestListener {
    @RabbitListener(queues = "yyds")   //定义此方法为队列 yyds 的监听器，一旦监听到新的消息，就会接受并处理
    public void test(Message message){
        System.out.println(new String(message.getBody()));
    }
}
```
接着我们启动服务器：
![image-20220419230223151](https://s2.loli.net/2023/03/08/ZjRs8u2cHbBEOaW.jpg)
可以看到控制台成功输出了我们之前放入队列的消息，并且管理页面中也显示此消费者已经连接了：
![image-20220419230315376](https://s2.loli.net/2023/03/08/RwUFdgqXlDKk7AI.jpg)
接着我们再通过管理页面添加新的消息看看，也是可以正常进行接受的。
当然，如果我们需要确保消息能够被消费者接受并处理，然后得到消费者的反馈，也是可以的：
```java
@Test
void publisher() {
  	//会等待消费者消费然后返回响应结果
    Object res = template.convertSendAndReceive("amq.direct", "my-yyds", "Hello World!");
    System.out.println("收到消费者响应："+res);
} 
```
消费者这边只需要返回一个对应的结果即可：
```java
@RabbitListener(queues = "yyds")
public String receiver(String data){
    System.out.println("一号消息队列监听器 "+data);
    return "收到!";
}
```
测试没有问题：
![image-20220421142425891](https://s2.loli.net/2023/03/08/OkV6zN9PJRlwnQF.jpg)
那么如果我们需要直接接收一个 JSON 格式的消息，并且希望直接获取到实体类呢？
```java
@Data
public class User {
    int id;
    String name;
}
```
```java
@Configuration
public class RabbitConfiguration {
  	...
    @Bean("jacksonConverter")   //直接创建一个用于 JSON 转换的 Bean
    public Jackson2JsonMessageConverter converter(){
        return new Jackson2JsonMessageConverter();
    }
}
```
接着我们只需要指定转换器就可以了：
```java
@Component
public class TestListener {
  	//指定 messageConverter 为我们刚刚创建的 Bean 名称
    @RabbitListener(queues = "yyds", messageConverter = "jacksonConverter")
    public void receiver(User user){  //直接接收 User 类型
        System.out.println(user);
    }
}
```
现在我们直接在管理页面发送：
```json
{"id":1,"name":"LB"}
```
!![image-20220416225912100](https://s2.loli.net/2023/03/08/3dXbs5naViUMrDO.jpg)]( https://tva1.sinaimg.cn/large/e6c9d24ely1h1byhcakabj221m0lwac0.jpg )
可以看到成功完成了转换，并输出了用户信息：
![image-20220416225829807](https://s2.loli.net/2023/03/08/aM8SCL12hkKynUu.jpg)
同样的，我们也可以直接发送 User，因为我们刚刚已经配置了 `Jackson2JsonMessageConverter` 为 Bean，所以直接使用就可以了：
```java
@Test
void publisher() {
    template.convertAndSend("amq.direct", "yyds", new User());
}
```
可以看到后台的数据类型为：
![image-20220419232715025](https://s2.loli.net/2023/03/08/xVSpC7KHE1RyOk6.jpg)
![image-20220416231709750](https://s2.loli.net/2023/03/08/Q9tBuprGwfleNLZ.jpg)
这样，我们就通过 SpringBoot 实现了 RabbitMQ 的简单使用。
### 死信队列
消息队列中的数据，如果迟迟没有消费者来处理，那么就会一直占用消息队列的空间。比如我们模拟一下抢车票的场景，用户下单高铁票之后，会进行抢座，然后再进行付款，但是如果用户下单之后并没有及时的付款，这张票不可能一直让这个用户占用着，因为你不买别人还要买呢，所以会在一段时间后超时，让这张票可以继续被其他人购买。
这时，我们就可以使用死信队列，将那些用户超时未付款的或是用户主动取消的订单，进行进一步的处理，以下类型的消息都会被判定为死信：
- 消息被拒绝(basic.reject / basic.nack)，并且 requeue = false
- 消息 TTL 过期
- 队列达到最大长度
![image-20220419112336088](https://s2.loli.net/2023/03/08/itUWySuA9kvcEgs.jpg)
那么如何构建这样的一种使用模式呢？实际上本质就是一个死信交换机+绑定的死信队列，当正常队列中的消息被判定为死信时，会被发送到对应的死信交换机，然后再通过交换机发送到死信队列中，死信队列也有对应的消费者去处理消息。
这里我们直接在配置类中创建一个新的死信交换机和死信队列，并进行绑定：
```java
@Configuration
public class RabbitConfiguration {
    @Bean("directDlExchange")
    public Exchange dlExchange(){
        //创建一个新的死信交换机
        return ExchangeBuilder.directExchange("dlx.direct").build();
    }
    @Bean("yydsDlQueue")   //创建一个新的死信队列
    public Queue dlQueue(){
        return QueueBuilder
                .nonDurable("dl-yyds")
                .build();
    }
    @Bean("dlBinding")   //死信交换机和死信队列进绑定
    public Binding dlBinding(@Qualifier("directDlExchange") Exchange exchange,
                           @Qualifier("yydsDlQueue") Queue queue){
        return BindingBuilder
                .bind(queue)
                .to(exchange)
                .with("dl-yyds")
                .noargs();
    }
		...
    @Bean("yydsQueue")
    public Queue queue(){
        return QueueBuilder
                .nonDurable("yyds")
                .deadLetterExchange("dlx.direct")   //指定死信交换机
                .deadLetterRoutingKey("dl-yyds")   //指定死信 RoutingKey
                .build();
    }
  	...
}
```
接着我们将监听器修改为死信队列监听：
```java
@Component
public class TestListener {
    @RabbitListener(queues = "dl-yyds", messageConverter = "jacksonConverter")
    public void receiver(User user){
        System.out.println(user);
    }
}
```
配置完成后，我们来尝试启动一下吧，注意启动之前记得把之前的队列给删了，这里要重新定义。
![image-20220420103846981](https://s2.loli.net/2023/03/08/AdrS9yxnRojfWgL.jpg)
队列列表中已经出现了我们刚刚定义好的死信队列，并且 yyds 队列也支持死信队列发送功能了，现在我们尝试向此队列发送一个消息，但是我们将其拒绝：
![image-20220420105359931](https://s2.loli.net/2023/03/08/mLokEWYcQ4PXnar.jpg)
可以看到拒绝后，如果不让消息重新排队，那么就会变成死信，直接被丢进死信队列中，可以看到在拒绝后：
![image-20220420105455291](https://s2.loli.net/2023/03/08/rgiWVJMbpKzQX46.jpg)
现在我们来看看第二种情况，RabbitMQ 支持将超过一定时间没被消费的消息自动删除，这需要消息队列设定 TTL 值，如果消息的存活时间超过了 Time To Live 值，就会被自动删除，自动删除后的消息如果有死信队列，那么就会进入到死信队列中。
现在我们将 yyds 消息队列设定 TTL 值（毫秒为单位）：
```java
@Bean("yydsQueue")
public Queue queue(){
    return QueueBuilder
            .nonDurable("yyds")
            .deadLetterExchange("dlx.direct")
            .deadLetterRoutingKey("dl-yyds")
            .ttl(5000)   //如果 5 秒没处理，就自动删除
            .build();
}
```
现在我们重启测试一下，注意修改了之后记得删除之前的 yyds 队列：
![image-20220420110317997](https://s2.loli.net/2023/03/08/u8xboyv3aTJ9ZE6.jpg)
可以看到现在 yyds 队列已经具有 TTL 特性了，我们现在来插入一个新的消息：
![image-20220420110504022](https://s2.loli.net/2023/03/08/2qensPxuf3zLoQ1.jpg)
可以看到消息 5 秒钟之后就不见了，而是被丢进了死信队列中。
最后我们来看一下当消息队列长度达到最大的情况，现在我们将消息队列的长度进行限制：
```java
@Bean("yydsQueue")
public Queue queue(){
    return QueueBuilder
            .nonDurable("yyds")
            .deadLetterExchange("dlx.direct")
            .deadLetterRoutingKey("dl-yyds")
            .maxLength(3)   //将最大长度设定为 3
            .build();
}
```
现在我们重启一下，然后尝试连续插入 4 个消息：
![image-20220420135316458](https://s2.loli.net/2023/03/08/56TsMf24QlhZCYL.jpg)
可以看到 yyds 消息队列新增了 Limit 特性，也就是限定长度：
```java
@Test
void publisher() {
    for (int i = 0; i < 4; i++) 
        template.convertAndSend("amq.direct", "my-yyds", new User());
}
```
![image-20220420135419673](https://s2.loli.net/2023/03/08/d3lEHLPR4VNF92T.jpg)
可以看到因为长度限制为 3，所以有一个消息直接被丢进了死信队列中，为了能够更直观地观察消息队列的机制，我们为 User 类新增一个时间字段：
```java
@Data
public class User {
    int id;
    String name;
    String date = new Date().toString();
}
```
接着每隔一秒钟插入一个：
```java
@Test
void publisher() throws InterruptedException {
    for (int i = 0; i < 4; i++) {
        Thread.sleep(1000);
        template.convertAndSend("amq.direct", "my-yyds", new User());
    }
}
```
再次进行上述实验，可以发现如果到达队列长度限制，那么每次插入都会把位于队首的消息丢进死信队列，来腾出空间给新来的消息。
### 工作队列模式
**注意：** XX 模式只是一种设计思路，并不是指的具体的某种实现，可以理解为实现 XX 模式需要怎么去写。
前面我们了解了最简的一个消费者一个生产者的模式，接着我们来了解一下一个生产者多个消费者的情况：
![image-20220420151258324](https://s2.loli.net/2023/03/08/8AR4H5LbOCrXZmu.jpg)
实际上这种模式就非常适合多个工人等待新的任务到来的场景，我们的任务有很多个，一个一个丢进消息队列，而此时工人有很多个，那么我们就可以将这些任务分配个各个工人，让他们各自负责一些任务，并且做的快的工人还可以做完成一些（能者多劳）。
非常简单，我们只需要创建两个监听器即可：
```java
@Component
public class TestListener {
    @RabbitListener(queues = "yyds")
    public void receiver(String data){   //这里直接接收 String 类型的数据
        System.out.println("一号消息队列监听器 "+data);
    }
    @RabbitListener(queues = "yyds")
    public void receiver2(String data){
        System.out.println("二号消息队列监听器 "+data);
    }
}
```
可以看到我们发送消息时，会自动进行轮询分发：
![image-20220420154602883](https://s2.loli.net/2023/03/08/YgibmNxD9qtHajQ.jpg)
那么如果我们一开始就在消息队列中放入一部分消息在开启消费者呢？
![image-20220420154654901](https://s2.loli.net/2023/03/08/Rv6YkDSTPl83Hmo.jpg)
可以看到，如果是一开始就存在消息，会被一个消费者一次性全部消耗，这是因为我们没有对消费者的 Prefetch count（预获取数量，一次性获取消息的最大数量）进行限制，也就是说我们现在希望的是消费者一次只能拿一个消息，而不是将所有的消息全部都获取。
![image-20220420160253144](https://s2.loli.net/2023/03/08/UNEniupt5cRHz93.jpg)
因此我们需要对这个数量进行一些配置，这里我们需要在配置类中定义一个自定义的 `ListenerContainerFactory`，可以在这里设定消费者 Channel 的 `PrefetchCount` 的大小：
```java
@Resource
private CachingConnectionFactory connectionFactory;
@Bean(name = "listenerContainer")
public SimpleRabbitListenerContainerFactory listenerContainer(){
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    factory.setPrefetchCount(1);   //将 PrefetchCount 设定为 1 表示一次只能取一个
    return factory;
}
```
接着我们在监听器这边指定即可：
```java
@Component
public class TestListener {
    @RabbitListener(queues = "yyds",  containerFactory = "listenerContainer")
    public void receiver(String data){
        System.out.println("一号消息队列监听器 "+data);
    }
    @RabbitListener(queues = "yyds", containerFactory = "listenerContainer")
    public void receiver2(String data){
        System.out.println("二号消息队列监听器 "+data);
    }
}
```
现在我们再次启动服务器，可以看到 PrefetchCount 被限定为 1了：
![image-20220420164702864](https://s2.loli.net/2023/03/08/KgWzOUu8ry2V9Ej.jpg)
再次重复上述的实现，可以看到消息不会被一号消费者给全部抢走了：
![image-20220420164827502](https://s2.loli.net/2023/03/08/vmAfh68GpuQXdUk.jpg)
当然除了去定义两个相同的监听器之外，我们也可以直接在注解中定义，比如我们现在需要 10 个同样的消费者：
```java
@Component
public class TestListener {
    @RabbitListener(queues = "yyds",  containerFactory = "listenerContainer", concurrency = "10")
    public void receiver(String data){
        System.out.println("一号消息队列监听器 "+data);
    }
}
```
可以看到在管理页面中出现了 10 个消费者：
![image-20220420170349298](https://s2.loli.net/2023/03/08/REl1qIaMXLTK6js.jpg)
至此，有关工作队列模式就讲到这里。
### 发布订阅模式
前面我们已经了解了 RabbitMQ 客户端的一些基本操作，包括普通的消息模式，接着我们来了解一下其他的模式，首先是发布订阅模式，它支持多种方式：
![image-20220420172252440](https://s2.loli.net/2023/03/08/fetLjQszH7cTZmO.jpg)
比如我们在阿里云买了云服务器，但是最近快到期了，那么就会给你的手机、邮箱发送消息，告诉你需要去续费了，但是手机短信和邮件发送并不一定是同一个业务提供的，但是现在我们又希望能够都去执行，所以就可以用到发布订阅模式，简而言之就是，发布一次，消费多个。
实现这种模式其实也非常简单，但是如果使用我们之前的直连交换机，肯定是不行的，我们这里需要用到另一种类型的交换机，叫做`fanout`（扇出）类型，这时一种广播类型，消息会被广播到所有与此交换机绑定的消息队列中。
这里我们使用默认的交换机：
![image-20220420225300171](https://s2.loli.net/2023/03/08/Er7RBCjm3nNJZHT.jpg)
这个交换机是一个`fanout`类型的交换机，我们就是要它就行了：
```java
@Configuration
public class RabbitConfiguration {
    @Bean("fanoutExchange")
    public Exchange exchange(){
      	//注意这里是 fanoutExchange
        return ExchangeBuilder.fanoutExchange("amq.fanout").build();
    }
    @Bean("yydsQueue1")
    public Queue queue(){
        return QueueBuilder.nonDurable("yyds1").build();
    }
    @Bean("binding")
    public Binding binding(@Qualifier("fanoutExchange") Exchange exchange,
                           @Qualifier("yydsQueue1") Queue queue){
        return BindingBuilder
                .bind(queue)
                .to(exchange)
                .with("yyds1")
                .noargs();
    }
    @Bean("yydsQueue2")
    public Queue queue2(){
        return QueueBuilder.nonDurable("yyds2").build();
    }
    @Bean("binding2")
    public Binding binding2(@Qualifier("fanoutExchange") Exchange exchange,
                           @Qualifier("yydsQueue2") Queue queue){
        return BindingBuilder
                .bind(queue)
                .to(exchange)
                .with("yyds2")
                .noargs();
    }
}
```
这里我们将两个队列都绑定到此交换机上，我们先启动看看效果：
![image-20220420230954785](https://s2.loli.net/2023/03/08/pFXEmbv7LCMKxwq.jpg)
绑定没有什么问题，接着我们搞两个监听器，监听一下这两个队列：
```java
@Component
public class TestListener {
    @RabbitListener(queues = "yyds1")
    public void receiver(String data){
        System.out.println("一号消息队列监听器 "+data);
    }
    @RabbitListener(queues = "yyds2")
    public void receiver2(String data){
        System.out.println("二号消息队列监听器 "+data);
    }
}
```
现在我们通过交换机发送消息，看看是不是两个监听器都会接收到消息：
![image-20220420231113658](https://s2.loli.net/2023/03/08/k7V1xXyGTPKO6eb.jpg)
可以看到确实是两个消息队列都能够接受到此消息：
![image-20220420231145578](https://s2.loli.net/2023/03/08/vhwydqXr9Ue61t4.jpg)
这样我们就实现了发布订阅模式。
### 路由模式
路由模式实际上我们一开始就已经实现了，我们可以在绑定时指定想要的`routingKey`只有生产者发送时指定了对应的`routingKey`才能到达对应的队列。
![image-20220420232826848](https://s2.loli.net/2023/03/08/52vs9bualApXGMR.jpg)
当然除了我们之前的一次绑定之外，同一个消息队列可以多次绑定到交换机，并且使用不同的`routingKey`，这样只要满足其中一个都可以被发送到此消息队列中：
```java
@Configuration
public class RabbitConfiguration {
    @Bean("directExchange")
    public Exchange exchange(){
        return ExchangeBuilder.directExchange("amq.direct").build();
    }
    @Bean("yydsQueue")
    public Queue queue(){
        return QueueBuilder.nonDurable("yyds").build();
    }
    @Bean("binding")   //使用 yyds1 绑定
    public Binding binding(@Qualifier("directExchange") Exchange exchange,
                           @Qualifier("yydsQueue") Queue queue){
        return BindingBuilder
                .bind(queue)
                .to(exchange)
                .with("yyds1")
                .noargs();
    }
    @Bean("binding2")   //使用 yyds2 绑定
    public Binding binding2(@Qualifier("directExchange") Exchange exchange,
                           @Qualifier("yydsQueue") Queue queue){
        return BindingBuilder
                .bind(queue)
                .to(exchange)
                .with("yyds2")
                .noargs();
    }
}
```
启动后我们可以看到管理面板中出现了两个绑定关系：
![image-20220420233606749](https://s2.loli.net/2023/03/08/n9NxMEsoCeWSaVL.jpg)
这里可以测试一下，随便使用哪个`routingKey`都可以。
### 主题模式
实际上这种模式就是一种模糊匹配的模式，我们可以将`routingKey`以模糊匹配的方式去进行转发。
![image-20220420233721239](https://s2.loli.net/2023/03/08/z45gI7UaKmCipEL.jpg)
我们可以使用`*`或`#`来表示：
- \* - 表示任意的一个单词
- \# - 表示 0 个或多个单词
这里我们来测试一下：
```java
@Configuration
public class RabbitConfiguration {
    @Bean("topicExchange")  //这里使用预置的 Topic 类型交换机
    public Exchange exchange(){
        return ExchangeBuilder.topicExchange("amq.topic").build();
    }
    @Bean("yydsQueue")
    public Queue queue(){
        return QueueBuilder.nonDurable("yyds").build();
    }
    @Bean("binding")
    public Binding binding2(@Qualifier("topicExchange") Exchange exchange,
                           @Qualifier("yydsQueue") Queue queue){
        return BindingBuilder
                .bind(queue)
                .to(exchange)
                .with("*.test.*")
                .noargs();
    }
}
```
启动项目，可以看到只要是满足通配符条件的都可以成功转发到对应的消息队列：
![image-20220421103753962](https://s2.loli.net/2023/03/08/aS37QitoUdf4FZ9.jpg)
接着我们可以再试试看`#`通配符。
除了我们这里使用的默认主题交换机之外，还有一个叫做`amq.rabbitmq.trace`的交换机：
![image-20220421104035463](https://s2.loli.net/2023/03/08/CWfRIwoYLjQrbpH.jpg)
可以看到它也是`topic`类型的，那么这个交换机是做什么的呢？实际上这是用于帮助我们记录和追踪生产者和消费者使用消息队列的交换机，它是一个内部的交换机，那么如果使用呢？首先创建一个消息队列用于接收记录：
![image-20220421104619325](https://s2.loli.net/2023/03/08/s7B38pjkd4EGFLI.jpg)
接着我们需要在控制台将虚拟主机`/test`的追踪功能开启：
```sh
sudo rabbitmqctl trace_on -p /test
```
开启后，我们将此队列绑定到上面的交换机上：
![image-20220421104843224](https://s2.loli.net/2023/03/08/VsD2dYIpHhbt6R9.jpg)
![image-20220421105141144](https://s2.loli.net/2023/03/08/EM4WKHqtyz3vLSk.jpg)
由于发送到此交换机上的`routingKey`为 routing key 为 publish.交换机名称和 deliver.队列名称，分别对应生产者投递到交换机的消息，和消费者从队列上获取的消息，因此这里使用`#`通配符进行绑定。
现在我们来测试一下，比如还是往 yyds 队列发送消息：
![image-20220421105242770](https://s2.loli.net/2023/03/08/vHKPqJFahV8y7l3.jpg)
可以看到在发送消息，并且消费者已经处理之后，`trace`队列中新增了两条消息，那么我们来看看都是些什么消息：
![image-20220421105528532](https://s2.loli.net/2023/03/08/vHKPqJFahV8y7l3.jpg)
通过追踪，我们可以很明确地得知消息发送的交换机、routingKey、用户等信息，包括信息本身，同样的，消费者在取出数据时也有记录：
![image-20220421105638715](https://s2.loli.net/2023/03/08/NApBodythmfjzMV.jpg)
我们可以明确消费者的地址、端口、具体操作的队列以及取出的消息信息等。
到这里，我们就已经了解了 3 种类型的交换机。
### 第四种交换机类型
通过前面的学习，我们已经介绍了三种交换机类型，现在我们来介绍一下第四种交换机类型`header`，它是根据头部信息来决定的，在我们发送的消息中是可以携带一些头部信息的（类似于 HTTP），我们可以根据这些头部信息来决定路由到哪一个消息队列中。
```java
@Configuration
public class RabbitConfiguration {
    @Bean("headerExchange")  //注意这里返回的是 HeadersExchange
    public HeadersExchange exchange(){
        return ExchangeBuilder
                .headersExchange("amq.headers")  //RabbitMQ 为我们预置了两个，这里用第一个就行
                .build();
    }
    @Bean("yydsQueue")
    public Queue queue(){
        return QueueBuilder.nonDurable("yyds").build();
    }
    @Bean("binding")
    public Binding binding2(@Qualifier("headerExchange") HeadersExchange exchange,  //这里和上面一样的类型
                           @Qualifier("yydsQueue") Queue queue){
        return BindingBuilder
                .bind(queue)
                .to(exchange)   //使用 HeadersExchange 的 to 方法，可以进行进一步配置
          			//.whereAny("a", "b").exist();   这个是只要存在任意一个指定的头部 Key 就行
                //.whereAll("a", "b").exist();   这个是必须存在所有指定的的头部 Key
                .where("test").matches("hello");   //比如我们现在需要消息的头部信息中包含 test，并且值为 hello 才能转发给我们的消息队列
      					//.whereAny(Collections.singletonMap("test", "hello")).match();  传入 Map 也行，批量指定键值对
    }
}
```
现在我们来启动一下试试看：
![image-20220421110926077](https://s2.loli.net/2023/03/08/NApBodythmfjzMV.jpg)
结果发现，消息可以成功发送到消息队列，这就是使用头部信息进行路由。
这样，我们就介绍完了所有四种类型的交换机。
### 集群搭建
前面我们对于 RabbitMQ 的相关内容已经基本讲解完毕了，最后我们来尝试搭建一个集群，让 RabbitMQ 之间进行数据复制（镜像模式）稍微有点麻烦，跟着视频走吧。
可能会用到的一些命令：
```sh
sudo rabbitmqctl stop_app
sudo rabbitmqctl join_cluster rabbit@ubuntu-server
sudo rabbitmqctl start_app
```
实现复制即可。
***

---
## SpringCloud 消息组件
前面我们已经学习了如何使用 RabbitMQ 消息队列，接着我们来简单介绍一下 SpringCloud 为我们提供的一些消息组件。
### SpringCloud Stream
**官方文档：** https://docs.spring.io/spring-cloud-stream/docs/3.2.2/reference/html/
前面我们介绍了 RabbitMQ，了解了消息队列相关的一些操作，但是可能我们会遇到不同的系统在用不同的消息队列，比如系统 A 用的 Kafka、系统 B 用的 RabbitMQ，但是我们现在又没有学习过 Kafka，那么怎么办呢？有没有一种方式像 JDBC 一样，我们只需要关心 SQL 和业务本身，而不用关心数据库的具体实现呢？
SpringCloud Stream 能够做到，它能够屏蔽底层实现，我们使用统一的消息队列操作方式就能操作多种不同类型的消息队列。
![image-20220421225215709](https://s2.loli.net/2023/03/08/VWvry9TSDBinatH.jpg)
它屏蔽了 RabbitMQ 底层操作，让我们使用统一的 Input 和 Output 形式，以 Binder 为中间件，这样就算我们切换了不同的消息队列，也无需修改代码，而具体某种消息队列的底层实现是交给 Stream 在做的。
这里我们创建一个新的项目来测试一下：
![image-20220421215534386](https://s2.loli.net/2023/03/08/pJefuIUXzNHhsxP.jpg)
依赖如下：
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-dependencies</artifactId>
    <version>2021.0.1</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```
```xml
<dependencies>
    <!--  RabbitMQ的Stream实现  -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-stream-rabbit</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```
首先我们来编写一下生产者，首先是配置文件：
```yaml
server:
  port: 8001
spring:
  cloud:
    stream:
      binders:   #此处配置要绑定的rabbitmq的服务信息
        local-server: #绑定名称 ，随便起一个就行
          type: rabbit #消息组件类型 ，这里使用的是 RabbitMQ，就填写 rabbit
          environment:  #服务器相关信息 ，按照下面的方式填写就行，爆红别管
            spring:
              rabbitmq:
                host: 192.168.0.6
                port: 5672
                username: admin
                password: admin
                virtual-host: /test
       bindings:
        test-out-0:
          destination: test.exchange
```
接着我们来编写一个 Controller，一会访问一次这个接口，就向消息队列发送一个数据：
```java
@RestController
public class PublishController {
    @Resource
    StreamBridge bridge;  //通过 bridge 来发送消息
    @RequestMapping("/publish")
    public String publish(){
        //第一个参数其实就是 RabbitMQ 的交换机名称（数据会发送给这个交换机，到达哪个消息队列，不由我们决定）
      	//这个交换机的命名稍微有一些规则:
      	//输入:    <名称> + -in- + <index>
      	//输出:    <名称> + -out- + <index>
      	//这里我们使用输出的方式，来将数据发送到消息队列，注意这里的名称会和之后的消费者 Bean 名称进行对应
        bridge.send("test-out-0", "HelloWorld!");
        return "消息发送成功！"+new Date();
    }
}
```
现在我们来将生产者启动一下，访问一下接口：
![image-20220421220955906](https://s2.loli.net/2023/03/08/pvc8udVL9EwMW56.jpg)
可以看到消息成功发送，我们来看看 RabbitMQ 这边的情况：
![image-20220421221027145](https://s2.loli.net/2023/03/08/1fBHoQe6gc7XizO.jpg)
新增了一个`test-in-0`交换机，并且此交换机是 topic 类型的：
![image-20220421221107547](https://s2.loli.net/2023/03/08/mN4EfOehP8Ta2JC.jpg)
但是目前没有任何队列绑定到此交换机上，因此我们刚刚发送的消息实际上是没有给到任何队列的。
接着我们来编写一下消费者，消费者的编写方式比较特别，只需要定义一个 Consumer 就可以了，其他配置保持一致：
```java
@Component
public class ConsumerComponent {
    @Bean("test")   //注意这里需要填写我们前面交换机名称中"名称"，这样生产者发送的数据才会正确到达
    public Consumer<String> consumer(){
        return System.out::println;
    }
}
```
配置中需要修改一下目标交换机：
```yaml
server:
  port: 8002
spring:
  cloud:
    stream:
    	...
      bindings:
      	#因为消费者是输入 ，默认名称为方法名-in-index，这里我们将其指定为我们刚刚定义的交换机
        test-in-0:
          destination: test.exchange
```
接着我们直接启动就可以了，可以看到启动之后，自动为我们创建了一个新的队列：
![image-20220421221733723](https://s2.loli.net/2023/03/08/kUelcRgb7MrGdB6.jpg)
而这个队列实际上就是我们消费者等待数据到达的队列：
![image-20220421221807577](https://s2.loli.net/2023/03/08/lzDjiI9SLH1rVY3.jpg)
可以看到当前队列直接绑定到了我们刚刚创建的交换机上，并且`routingKey`是直接写的`#`，也就是说一会消息会直接过来。
现在我们再来访问一些消息发送接口：
![image-20220421221938730](https://s2.loli.net/2023/03/08/cSPRdoY43gzVNXk.jpg)
![image-20220421221952663](https://s2.loli.net/2023/03/08/8TEv1KQGSNA9luY.jpg)
可以看到消费者成功地进行消费了：
![image-20220421222011924](https://s2.loli.net/2023/03/08/lICtpeK2oAGZynD.jpg)
这样，我们就通过使用 SpringCloud Stream 来屏蔽掉底层 RabbitMQ 来直接进行消息的操作了。
### SpringCloud Bus
**官方文档：** https://cloud.spring.io/spring-cloud-bus/reference/html/
实际上它就相当于是一个消息总线，可用于向各个服务广播某些状态的更改（比如云端配置更改，可以结合 Config 组件实现动态更新配置，当然我们前面学习的 Nacos 其实已经包含这个功能了）或其他管理指令。
这里我们也是简单使用一下吧，Bus 需要基于一个具体的消息队列实现，比如 RabbitMQ 或是 Kafka，这里我们依然使用 RabbitMQ。
我们将最开始的微服务拆分项目继续使用，比如现在我们希望借阅服务的某个接口调用时，能够给用户服务和图书服务发送一个通知，首先是依赖：
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```
接着我们只需要在配置文件中将 RabbitMQ 的相关信息配置：
```yaml
spring:
  rabbitmq:
    addresses: 192.168.0.6
    username: admin
    password: admin
    virtual-host: /test
management:
  endpoints:
    web:
      exposure:
        include: "*"    #暴露端点 ，一会用于提醒刷新
```
然后启动我们的三个服务器，可以看到在管理面板中：
![image-20220421232118952](https://s2.loli.net/2023/03/08/UfTVhAiOnMqoPX7.jpg)
新增了 springCloudBug 这样一个交换机，并且：
![image-20220421232146646](https://s2.loli.net/2023/03/08/2VdCOuPLAb9Qhfx.jpg)
自动生成了各自的消息队列，这样就可以监听并接收到消息了。
现在我们访问一个端口：
![image-20220421233200950](https://s2.loli.net/2023/03/08/H3szAX82xhpWw6j.jpg)
此端口是用于通知别人进行刷新，可以看到调用之后，消息队列中成功出现了一次消费：
![image-20220421233302328](https://s2.loli.net/2023/03/08/LoviBfecC1DbMOg.jpg)
现在我们结合之前使用的 Config 配置中心，来看看是不是可以做到通知之后所有的配置动态刷新了。
## Reference
```cardlink
url: https://itbaima.net/
title: "柏码 - 让每一行代码都闪耀智慧的光芒！"
host: itbaima.net
favicon: /favicon.ico
```
1. [柏码 - 让每一行代码都闪耀智慧的光芒！](https://itbaima.net/)
```cardlink
url: https://cn.dubbo.apache.org/
title: "Apache Dubbo 中文"
description: "Apache Dubbo 官网"
host: cn.dubbo.apache.org
image: https://cn.dubbo.apache.org/zh-cn/featured-background.jpg
```
2. [Apache Dubbo](https://cn.dubbo.apache.org/)
```cardlink
url: https://www.cnblogs.com/1234cjq/p/15740904.html#:~:text=dubbo%3A%20scan%3A%20base%20-%20packages%3A%20com.cloud.rapid.user.service.api.dubbo%20protocol%3A%20%23Dubbo ,%E8%A1%A8%E7%A4%BA%E8%87%AA%E5%A2%9E%E7%AB%AF%E5%8F%A3%EF%BC%8C%E4%BB%8E%2020880%20%E5%BC%80%E5%A7%8B%EF%BC%89%20name%3A%20dubbo%20port%3A%20-1%20%23dubbo%E5%8D%8F%E8%AE%AE%E7%BC%BA%E7%9C%81%E7%AB%AF%E5%8F%A3%E4%B8%BA20880%EF%BC%8Crmi%E5%8D%8F%E8%AE%AE%E7%BC%BA%E7%9C%81%E7%AB%AF%E5%8F%A3%E4%B8%BA1099%EF%BC%8Chttp%E5%92%8Chessian%E5%8D%8F%E8%AE%AE%E7%BC%BA%E7%9C%81%E7%AB%AF%E5%8F%A3%E4%B8%BA80%EF%BC%9B%E5%A6%82%E6%9E%9C%E6%B2%A1%E6%9C%89%E9%85%8D%E7%BD%AEport%EF%BC%8C%E5%88%99%E8%87%AA%E5%8A%A8%E9%87%87%E7%94%A8%E9%BB%98%E8%AE%A4%E7%AB%AF%E5%8F%A3%EF%BC%8C%E5%A6%82%E6%9E%9C%E9%85%8D%E7%BD%AE%E4%B8%BA-1%EF%BC%8C%E5%88%99%E4%BC%9A%E5%88%86%E9%85%8D%E4%B8%80%E4%B8%AA%E6%B2%A1%E6%9C%89%E8%A2%AB%E5%8D%A0%E7%94%A8%E7%9A%84%E7%AB%AF%E5%8F%A3%E3%80%82
title: "springcloud-alibaba 整合 dubbo - 一缕清风丶 - 博客园"
description: "记一次 springcloud-alibaba 框架下整合 spring-cloud-starter-dubbo 现状: 现在微服务之间的相互调用使用 feign 接口都需要注解@FeignClient，例:@FeignClient(contextId = &quot;sysRoleMenuService&"
host: www.cnblogs.com
```
3. [springcloud-alibaba整合dubbo - 一缕清风丶 - 博客园](https://www.cnblogs.com/1234cjq/p/15740904.html#:~:text=dubbo%3A%20scan%3A%20base%20-%20packages%3A%20com.cloud.rapid.user.service.api.dubbo%20protocol%3A%20%23Dubbo,%E8%A1%A8%E7%A4%BA%E8%87%AA%E5%A2%9E%E7%AB%AF%E5%8F%A3%EF%BC%8C%E4%BB%8E%2020880%20%E5%BC%80%E5%A7%8B%EF%BC%89%20name%3A%20dubbo%20port%3A%20-1%20%23dubbo%E5%8D%8F%E8%AE%AE%E7%BC%BA%E7%9C%81%E7%AB%AF%E5%8F%A3%E4%B8%BA20880%EF%BC%8Crmi%E5%8D%8F%E8%AE%AE%E7%BC%BA%E7%9C%81%E7%AB%AF%E5%8F%A3%E4%B8%BA1099%EF%BC%8Chttp%E5%92%8Chessian%E5%8D%8F%E8%AE%AE%E7%BC%BA%E7%9C%81%E7%AB%AF%E5%8F%A3%E4%B8%BA80%EF%BC%9B%E5%A6%82%E6%9E%9C%E6%B2%A1%E6%9C%89%E9%85%8D%E7%BD%AEport%EF%BC%8C%E5%88%99%E8%87%AA%E5%8A%A8%E9%87%87%E7%94%A8%E9%BB%98%E8%AE%A4%E7%AB%AF%E5%8F%A3%EF%BC%8C%E5%A6%82%E6%9E%9C%E9%85%8D%E7%BD%AE%E4%B8%BA-1%EF%BC%8C%E5%88%99%E4%BC%9A%E5%88%86%E9%85%8D%E4%B8%80%E4%B8%AA%E6%B2%A1%E6%9C%89%E8%A2%AB%E5%8D%A0%E7%94%A8%E7%9A%84%E7%AB%AF%E5%8F%A3%E3%80%82)
