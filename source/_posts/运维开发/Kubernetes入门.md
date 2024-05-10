---
title: Kubernetes入门
date: 2024-05-10 23:54:16
tags:
  - K8s
sticky: 80
excerpt: 
author: fcs
index_img: https://picsum.photos/800/250
lang: zh-CN
number headings: auto, first-level 1, max 5, start-at 1, 1.1
---

![](https://picsum.photos/800/250)

# 1 引言

Kubernetes（简称k8s）是一个开源的容器编排平台，用于自动化部署、扩展和管理容器化应用程序。它最初由Google设计并捐赠给Cloud Native Computing Foundation（CNCF）来维护。Kubernetes的核心功能包括：

1. **服务发现和负载均衡**：Kubernetes可以使用DNS名称或自己的IP地址公开容器，并可以在容器之间自动分配负载。
2. **存储编排**：Kubernetes可以自动挂载所选择的存储系统，无论是本地存储、公共云提供商如AWS或Google Cloud，还是网络存储系统如NFS、iSCSI等。
3. **自动部署和回滚**：您可以描述期望的容器状态，Kubernetes可以自动改变实际状态以达到期望状态。例如，您可以自动化部署更新，并在出现问题时回滚到以前的版本。
4. **自动完成容器的复制**：您可以指定每个容器的副本数，Kubernetes可以自动复制容器，以确保指定数量的副本始终运行并健康。
5. **自我修复**：Kubernetes会重启失败的容器、替换并杀死不响应用户定义健康检查的容器，并且在准备好新的容器后替换容器。
6. **密钥和配置管理**：您可以在不重建容器镜像的情况下部署更新的配置和密码。
7. **扩展性**：Kubernetes的设计支持扩展性，管理成百上千个容器也是可行的。
8. **可用性**：它会确保容器在集群中的不同节点上运行，以确保高可用性。

Kubernetes通过一组API来管理这些功能，这些API可以被不同的工具和语言所使用，以实现自动化和集成。它支持多种容器运行时，包括Docker、containerd、CRI-O等，并且可以在多种环境中运行，包括本地、云环境和边缘计算。

Kubernetes已经成为云原生技术栈中一个非常重要的组件，广泛用于生产环境，帮助开发者和系统管理员更高效地部署和管理应用程序。

# 2 核心组件


## 2.1 Node

在Kubernetes中，一个Node是工作节点，负责运行应用程序容器。它是集群中的一个工作机器，可以是**虚拟或物理机器**，负责维护Pods的运行状态。每个Node都由Kubernetes的master节点管理，并且包含运行Pods所需的服务，比如docker、kubelet和kube-proxy。

## 2.2 Pod

Pod是Kubernetes中的**基本部署单元**，代表集群中运行的一个或多个容器（通常是Docker容器）。Pods是短暂的，它们提供了一种机制来管理容器的生命周期、存储和网络等资源。Pods可以包含一个或多个紧密相关的容器，这些容器共享网络和存储资源。

## 2.3 Service

Service定义了一种访问Pod的方式，无论Pod如何变化，Service都保持不变。它为一组执行相同功能的Pod提供了一个统一的访问接口，通过定义一个Service，可以为一组具有相同功能的Pod提供一个统一的访问地址，从而实现负载均衡。**（类似于网关）**

## 2.4 Ingress

Ingress是Kubernetes的API对象，它管理外部访问到集群内服务的HTTP和HTTPS路由。Ingress控制外部到集群内服务的访问，一般用来提供URL路由、负载均衡、SSL终止、名称基的虚拟托管等功能。**（类似于nginx）**

## 2.5 ConfigMap

ConfigMap是一个Kubernetes对象，用于存储非机密性配置数据。你可以将它视为环境变量和配置文件的容器，这些数据可以被Pods以键值对的形式使用，或者作为配置文件挂载到容器内部。

## 2.6 Secret

Secret是Kubernetes中用于存储敏感信息的对象，如密码、OAuth令牌和SSH密钥。与ConfigMap不同，Secrets包含的敏感数据会以base64编码存储，并且Kubernetes API server会对Secrets进行加密，以保护敏感数据的安全。Secrets可以被Pods以环境变量或文件的形式使用。

## 2.7 Volumes

在Kubernetes中，**Volumes** 是一种存储机制，用于在Pod中持久化数据。Volume是集群级别的资源，它与Pod的生命周期无关，即使Pod被删除，Volume中的数据也不会丢失。这使得Volumes非常适合用于存储需要跨Pod重启或跨多个Pod共享的数据。

Volumes可以是以下几种类型：

1. **emptyDir**：这是一个临时的文件系统，通常用于为Pod中的容器提供共享存储。当Pod被删除时，emptyDir中的数据也会被删除。
2. **hostPath**：这种类型的Volume允许Pod使用指定的文件或目录，这些文件或目录存在于宿主机上。这可以用于访问宿主机上的文件系统。
3. **persistentVolumeClaim** (PVC)：PVC允许用户申请存储资源，而无需关心具体的底层存储细节。用户可以根据需求申请不同大小和访问模式的存储。
4. **configMap** 和 **secret**：这些Volume类型允许将ConfigMap或Secret对象作为卷挂载到Pod中，以便容器可以访问这些配置数据。
5. **persistentVolume** (PV)：PV是集群中的一块存储，已经被预先配置好，可以被多个PVCs使用。PV可以是NFS、iSCSI、云存储等。
6. **cephfs**、**rbd**、**glusterfs**：这些Volume类型对应于特定的存储系统，允许Pod使用Ceph、Rados Block Device或GlusterFS等存储解决方案。
7. **azureFile**、**azureDisk**、**gcePersistentDisk**：这些Volume类型是特定于云服务提供商的存储解决方案，允许Pod使用Azure或Google Cloud上的存储资源。
8. **iscsi**、**fc**（Fibre Channel）：这些Volume类型允许使用iSCSI或Fibre Channel连接到存储系统。
9. **nfs**：允许Pod使用网络文件系统（NFS）作为存储。

Volumes的使用方法非常灵活，可以根据不同的需求选择不同的类型。它们对于保证数据的持久性和共享性至关重要。

# 3 参考文献

1. [Kubernetes-win-useage](https://www.yuque.com/xiaoguai-pbjfj/cxxcrs/ocefqltbmbgl5eqg?singleDoc#%20%E3%80%8AKubernetes%E3%80%8B)
2. [Kubernetes一小时入门课程 - 视频配套笔记 | GeekHour](https://geekhour.net/2023/12/23/kubernetes/)
3. [Kubernetes一小时轻松入门\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1Se411r7vY/?spm_id_from=333.788.recommend_more_video.2&vd_source=9c896fa9c3f9023797e8efe7be0c113e)