---
title: GPU使用指南
date: 2025-10-23 10:05:00
tags: research
sticky: 80
excerpt: gpu pod的使用方法
author: fcs
index_img: https://picsum.photos/800/250
lang: zh-CN
number headings: auto, first-level 1, max 5, start-at 1, 1.1
---
# 1 创建项目

进入 rancher，点 research 集群，点击 Project/Namespace

![image.png](http://img.fcs.cloudns.ch/pics/20251023102829368.png)


起个名字直接 create

![image.png](http://img.fcs.cloudns.ch/pics/20251023102842963.png)

---
# 2 创建命名空间

找到创建的 project，点击上方 Add Namespace

![image.png](http://img.fcs.cloudns.ch/pics/20251023102936847.png)


添加 Namespace，起个名字（自己的名字缩写）直接点 Create

![image.png](http://img.fcs.cloudns.ch/pics/20251023103052051.png)

---
# 3 添加 Deployment

![image.png](http://img.fcs.cloudns.ch/pics/20251023103207569.png)


1. name 取个名字（自己名字缩写）
2. Docker Image 镜像版本选择基础环境的 `conda:conda:cuda_12.4.0_ubuntu22.04_base_20251023102432` 
3. Port Mapping 端口映射添加一个 `name: ssh;port: 22` 的端口（后面默认为 nodeport 和 Random）
   ![image.png](http://img.fcs.cloudns.ch/pics/20251023103711362.png)
4. Node Scheduling 选择指定的名称为 gpu 的节点（目前有 4 个：gpu，gpu2，gpu3 和 gpu4）
   ![](http://img.fcs.cloudns.ch/pics/20251023103537266.png)
5. 添加工作目录挂载点（**路径必须是/data/name**，name 为名字缩写，**Mount Point 必须是/workspace**）
   ![image.png](http://img.fcs.cloudns.ch/pics/20251023103800741.png)
6. 设置 gpu 数量（**切记不可超过 gpu 物理机显卡数量，一般只需要设置为 1，然后可以成功启动 pod，按照需要再逐渐增大目前都是八卡，所有 pod 都没用的情况下才能设为 8**）
   ![image.png](http://img.fcs.cloudns.ch/pics/20251023104706077.png)

---
# 4 配置 pod 对应的虚拟机的 hostname 和 hosts
   ![image.png](http://img.fcs.cloudns.ch/pics/20251023111849720.png)![](http://img.fcs.cloudns.ch/pics/20251023112507199.png)
```yaml
hostname: gpupod
hostAliases:
- ip: "192.168.88.190"
  hostnames:
  - "gpu"
- ip: "192.168.88.192"
  hostnames:
  - "gpu2"
- ip: "192.168.88.194"
  hostnames:
  - "gpu3"
- ip: "192.168.88.196"
  hostnames:
  - "gpu4"
```

---
# 5 开启 ssh 登录
   ![image.png](http://img.fcs.cloudns.ch/pics/20251023104137613.png)

点击 Execute Shell 进入 pod 控制台，执行以下命令启动 ssh 服务：

```bash
# 启动ssh服务
service ssh start
# 设置ssh连接密码，执行后输入两次密码即可
passwd
```

---
# 6 通过 xshell 或其他 ssh 工具访问 pod

（**主机填 192.168.88.122，端口号填 port 映射的 random 的最终端口，用户名为 root，密码为自己 ssh 那里设置的密码**）
   ![image.png](http://img.fcs.cloudns.ch/pics/20251023105132464.png)

---
# 7 保存 pod 为镜像

（**当有重大变动时最好把当前 pod 保存为一个镜像，不保存的话 pod 一旦关闭就会导致所有的操作丢失包括环境，通过宿主机即物理机下的 home 目录下的 save_docker_image.sh 脚本保存**）
通过以下指令保存镜像（docker 不变，gpu4 根据自己在 Node Scheduling 中选的 gpu 节点的名字决定，运行在哪个上就用哪个名字）

```bash
# 连接宿主机
ssh docker@gpu4
# 保存镜像
bash save_docker_image.sh
```
根据提示输入镜像序号（名称前缀都是 `k8s_Workload名称_pod名称` ）
![image.png](http://img.fcs.cloudns.ch/pics/20251023113237211.png)


> [!NOTE] 温馨提示
> 保存镜像后，如果更新镜像重新启动pod，ssh 服务不会默认启动，要进 shell 手动打开：`service ssh start`