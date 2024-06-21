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

Kubernetes（简称 k8s）是一个开源的容器编排平台，用于自动化部署、扩展和管理容器化应用程序。它最初由 Google 设计并捐赠给 Cloud Native Computing Foundation（CNCF）来维护。Kubernetes 的核心功能包括：

1. **服务发现和负载均衡**：Kubernetes 可以使用 DNS 名称或自己的 IP 地址公开容器，并可以在容器之间自动分配负载。
2. **存储编排**：Kubernetes 可以自动挂载所选择的存储系统，无论是本地存储、公共云提供商如 AWS 或 Google Cloud，还是网络存储系统如 NFS、iSCSI 等。
3. **自动部署和回滚**：您可以描述期望的容器状态，Kubernetes 可以自动改变实际状态以达到期望状态。例如，您可以自动化部署更新，并在出现问题时回滚到以前的版本。
4. **自动完成容器的复制**：您可以指定每个容器的副本数，Kubernetes 可以自动复制容器，以确保指定数量的副本始终运行并健康。
5. **自我修复**：Kubernetes 会重启失败的容器、替换并杀死不响应用户定义健康检查的容器，并且在准备好新的容器后替换容器。
6. **密钥和配置管理**：您可以在不重建容器镜像的情况下部署更新的配置和密码。
7. **扩展性**：Kubernetes 的设计支持扩展性，管理成百上千个容器也是可行的。
8. **可用性**：它会确保容器在集群中的不同节点上运行，以确保高可用性。

Kubernetes 通过一组 API 来管理这些功能，这些 API 可以被不同的工具和语言所使用，以实现自动化和集成。它支持多种容器运行时，包括 Docker、containerd、CRI-O 等，并且可以在多种环境中运行，包括本地、云环境和边缘计算。

Kubernetes 已经成为云原生技术栈中一个非常重要的组件，广泛用于生产环境，帮助开发者和系统管理员更高效地部署和管理应用程序。

# 2 系统架构

Kubernetes 提供了一个运行分布式系统的框架，能够无缝地扩展和管理跨主机集群的容器应用。以下是 Kubernetes 的主要系统架构组件：

Master Node（主节点）：

负责集群的管理和控制。
包含以下主要组件：
API Server：Kubernetes API 的前端，对外提供RESTful API。
Scheduler：负责决定将 Pod 放在哪个 Node 上运行。
Controller Manager：运行集群中的各种控制器，例如 Node Controller、Namespace Controller、Deployment Controller 等。
Etcd：一个轻量级、分布式的键值存储系统，用于存储集群的所有数据。
Node（工作节点）：

运行集群中的工作负载。
每个 Node 包含以下组件：
Kubelet：负责启动容器，监控容器运行状态，以及容器健康检查。
Container Runtime：负责容器的生命周期管理，如 Docker、containerd、CRI-O 等。
Kube-proxy：负责网络代理，实现服务发现和负载均衡。

# 3 核心组件

## 3.1 Node

在 Kubernetes 中，一个 Node 是工作节点，负责运行应用程序容器。它是集群中的一个工作机器，可以是**虚拟或物理机器**，负责维护 Pods 的运行状态。每个 Node 都由 Kubernetes 的 master 节点管理，并且包含运行 Pods 所需的服务，比如 docker、kubelet 和 kube-proxy。

## 3.2 Pod

Pod 是 Kubernetes 中的**基本部署单元**，代表集群中运行的一个或多个容器（通常是 Docker 容器）。Pods 是短暂的，它们提供了一种机制来管理容器的生命周期、存储和网络等资源。Pods 可以包含一个或多个紧密相关的容器，这些容器共享网络和存储资源。

## 3.3 Service

Service 定义了一种访问 Pod 的方式，无论 Pod 如何变化，Service 都保持不变。它为一组执行相同功能的 Pod 提供了一个统一的访问接口，通过定义一个 Service，可以为一组具有相同功能的 Pod 提供一个统一的访问地址，从而实现负载均衡。**（类似于网关）**

## 3.4 Ingress

Ingress 是 Kubernetes 的 API 对象，它管理外部访问到集群内服务的 HTTP 和 HTTPS 路由。Ingress 控制外部到集群内服务的访问，一般用来提供 URL 路由、负载均衡、SSL 终止、名称基的虚拟托管等功能。**（类似于 nginx）**

## 3.5 ConfigMap

ConfigMap 是一个 Kubernetes 对象，用于存储非机密性配置数据。你可以将它视为环境变量和配置文件的容器，这些数据可以被 Pods 以键值对的形式使用，或者作为配置文件挂载到容器内部。

## 3.6 Secret

Secret 是 Kubernetes 中用于存储敏感信息的对象，如密码、OAuth 令牌和 SSH 密钥。与 ConfigMap 不同，Secrets 包含的敏感数据会以 base64 编码存储，并且 Kubernetes API server 会对 Secrets 进行加密，以保护敏感数据的安全。Secrets 可以被 Pods 以环境变量或文件的形式使用。

## 3.7 Volumes

在 Kubernetes 中，**Volumes** 是一种存储机制，用于在 Pod 中持久化数据。Volume 是集群级别的资源，它与 Pod 的生命周期无关，即使 Pod 被删除，Volume 中的数据也不会丢失。这使得 Volumes 非常适合用于存储需要跨 Pod 重启或跨多个 Pod 共享的数据。

Volumes 可以是以下几种类型：

1. **emptyDir**：这是一个临时的文件系统，通常用于为 Pod 中的容器提供共享存储。当 Pod 被删除时，emptyDir 中的数据也会被删除。
2. **hostPath**：这种类型的 Volume 允许 Pod 使用指定的文件或目录，这些文件或目录存在于宿主机上。这可以用于访问宿主机上的文件系统。
3. **persistentVolumeClaim** (PVC)：PVC 允许用户申请存储资源，而无需关心具体的底层存储细节。用户可以根据需求申请不同大小和访问模式的存储。
4. **configMap** 和 **secret**：这些 Volume 类型允许将 ConfigMap 或 Secret 对象作为卷挂载到 Pod 中，以便容器可以访问这些配置数据。
5. **persistentVolume** (PV)：PV 是集群中的一块存储，已经被预先配置好，可以被多个 PVCs 使用。PV 可以是 NFS、iSCSI、云存储等。
6. **cephfs**、**rbd**、**glusterfs**：这些 Volume 类型对应于特定的存储系统，允许 Pod 使用 Ceph、Rados Block Device 或 GlusterFS 等存储解决方案。
7. **azureFile**、**azureDisk**、**gcePersistentDisk**：这些 Volume 类型是特定于云服务提供商的存储解决方案，允许 Pod 使用 Azure 或 Google Cloud 上的存储资源。
8. **iscsi**、**fc**（Fibre Channel）：这些 Volume 类型允许使用 iSCSI 或 Fibre Channel 连接到存储系统。
9. **nfs**：允许 Pod 使用网络文件系统（NFS）作为存储。

Volumes 的使用方法非常灵活，可以根据不同的需求选择不同的类型。它们对于保证数据的持久性和共享性至关重要。

## 3.8 Deployment

**Deployment** 是 Kubernetes 中用于管理无状态应用实例（如 web 服务器）的重要资源对象。`它提供了一种声明式的方法来描述期望的Pod状态`，比如运行的副本数量。Deployment 控制器会确保实际运行的 Pod 数量和配置与用户定义的期望状态相匹配，自动处理 Pod 的创建、更新和缩放。当需要更新应用时，如更改镜像版本，Deployment 会以滚动更新、重新部署或其他策略来平滑地进行更新，保证服务的连续性。

## 3.9 StatefulSet

**StatefulSet** 是为了解决 `有状态应用` 在 Kubernetes 中的管理和部署问题而设计的。有状态应用与无状态应用的主要区别在于，有状态应用需要维护持久化数据和身份标识（每个实例都有唯一性）。例如数据库、消息队列等。StatefulSet 确保每个 Pod 都有稳定的网络标识符（DNS 名称）和持久存储卷，即使 Pod 重启或重建，这些标识也会保持不变，从而保证了数据的一致性和可预测的网络拓扑。StatefulSet 还确保 Pod 是有序创建和删除的，这在需要严格顺序操作的应用中至关重要。简而言之，StatefulSet 专为需要保存状态信息的应用场景设计，提供了比 Deployment 更精细的控制和保障。

# 4 架构

## 4.1 关键组件

在 Kubernetes 集群中，`kubelet`、`K-proxy`（即 kube-proxy）和 `container-runtime` 是三个关键的组件，它们共同协作以确保容器化应用程序的高效运行和管理。下面是对这三个组件的简要介绍：

### 4.1.1 Kubelet

`kubelet` 是 Kubernetes 集群中的一个节点代理，负责维护在节点上运行的 Pods。它的作用包括：

- 启动 Pods 中的容器，并确保它们保持运行状态。
- 监控容器的健康状况，根据需要重启容器。
- 收集容器的日志和状态信息，并将其报告给 Kubernetes 的控制平面。
- 负责 Pod 的网络配置。

### 4.1.2 K-proxy (kube-proxy)

`kube-proxy` 是 Kubernetes 的网络代理，负责实现集群内的服务发现和负载均衡。它的主要功能包括：

- 为每个服务维护一个虚拟 IP 地址（ClusterIP）。
- 将 Pod 的网络流量转发到后端的 Pods 上。
- 实现端点发现机制，自动更新服务和 Pods 之间的映射关系。
- 提供服务的负载均衡，支持轮询、随机和最小连接数等策略。

### 4.1.3 Container-runtime

容器运行时（container-runtime）是负责运行容器的软件。在 Kubernetes 中，不同的容器运行时可以被用来执行容器化操作。常见的容器运行时包括：

- Docker：最流行的容器运行时之一，提供了丰富的功能和良好的社区支持。
- containerd：由 Docker 贡献给 CNCF 的项目，是一个开放的容器运行时。
- CRI-O：是一个符合 Kubernetes CRI（容器运行时接口）的容器运行时，专为 Kubernetes 设计。
- frakti：是一个轻量级的容器运行时，由 Kubernetes 社区开发。

每个容器运行时都实现了 Kubernetes 定义的 CRI，以确保与 Kubernetes 集群的兼容性。

这些组件共同构成了 Kubernetes 集群的核心，使得 Kubernetes 能够高效地管理和调度容器化应用程序。

## 4.2 Master 节点

在Kubernetes集群中，Master节点是负责整个集群的控制和管理的节点。它运行着Kubernetes控制平面的组件，这些组件负责调度决策、集群状态的监控以及与集群中其他节点的通信。以下是Master节点上运行的主要组件：

1. **kube-apiserver**：API服务器是Kubernetes控制平面的前端，它是系统的中央管理实体。它处理所有的REST操作，并且是集群内所有通信的核心。
2. **etcd**：这是一个轻量级的、分布式的键值存储系统，用于持久化集群的状态信息。所有的集群数据，包括Pods、服务(Service)、配置数据等，都存储在etcd中。
3. **kube-scheduler**：调度器负责决定将新的Pods调度到哪个节点上运行。它根据资源需求、服务质量要求、亲和性和反亲和性规则以及大量的其他因素进行决策。
4. **kube-controller-manager**：控制器管理器负责运行集群中的各种控制器，包括节点控制器、副本控制器、端点控制器等。
5. **cloud-controller-manager**：如果Kubernetes集群运行在云服务上，cloud-controller-manager负责与云服务提供商的API交互，处理与云相关的操作，如创建负载均衡器、获取节点信息等。
6. **addon-manager**：插件管理器负责管理Kubernetes的插件，如DNS、UI界面(Dashboard)、容器存储接口(CSI)插件等。
7. **kubelet**：虽然kubelet通常在每个工作节点(worker node)上运行，但在某些配置中，Master节点也可能运行kubelet，以便在Master节点上运行Pods。

Master节点的健康对于整个Kubernetes集群的稳定性至关重要。因此，通常建议至少部署三个或更多的Master节点以实现高可用性。在生产环境中，还会使用负载均衡器来分发对kube-apiserver的请求，以确保控制平面的稳定性和可用性。

## 4.3 Worker 节点

在Kubernetes集群中，Master节点和Worker节点扮演着不同的角色，共同确保了集群的正常运行。以下是对Worker节点的介绍：

### 4.3.1 Worker节点

Worker节点，也称为工作节点，是Kubernetes集群中负责运行应用程序容器的机器。它们是执行实际工作负载的节点，主要负责以下功能：

1. **运行Pods**：Worker节点接收来自Master节点的指令，负责启动、停止和管理Pods中的容器。
2. **维护容器运行环境**：Worker节点上的kubelet与容器运行时（如Docker、containerd等）交互，确保容器按照预期运行。
3. **健康检查**：kubelet在Worker节点上执行健康检查，确保Pods中的容器正常运行。如果检测到容器失败，kubelet将根据配置重启容器。
4. **提供节点信息**：Worker节点定期向Master节点报告其状态，包括节点的资源使用情况、Pods的状态等。
5. **网络代理**：Worker节点上的kube-proxy组件负责实现Pods之间的网络通信，包括服务发现和负载均衡。
6. **存储卷管理**：Worker节点负责挂载和卸载持久化存储卷，以便Pods可以访问所需的数据。
7. **扩展和收缩**：根据集群的负载和资源需求，Worker节点可以被动态地添加到集群中，或者从集群中移除。

Worker节点的数量和配置可以根据应用程序的需求进行扩展，以提供所需的计算、存储和网络资源。在生产环境中，通常有多个Worker节点分布在不同的物理或虚拟机器上，以确保高可用性和负载均衡。

Master节点负责管理和调度，而Worker节点则负责执行具体的工作负载。两者的协同工作使得Kubernetes能够高效地运行和管理容器化应用程序。

# 5 参考文献

1. [Kubernetes-win-useage](https://www.yuque.com/xiaoguai-pbjfj/cxxcrs/ocefqltbmbgl5eqg?singleDoc#%20%E3%80%8AKubernetes%E3%80%8B)
2. [Kubernetes一小时入门课程 - 视频配套笔记 | GeekHour](https://geekhour.net/2023/12/23/kubernetes/)
3. [Kubernetes一小时轻松入门\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1Se411r7vY/?spm_id_from=333.788.recommend_more_video.2&vd_source=9c896fa9c3f9023797e8efe7be0c113e)