---
title: Kubernetes入门
date: 2024-05-10 23:54:16
tags:
  - K8s
sticky: 100
excerpt: k8s入门（基础介绍，核心概念，实战演练）
author: fcs
index_img: https://picsum.photos/800/250
lang: zh-CN
number headings: auto, first-level 1, max 5, start-at 1, 1.1
---

![](https://picsum.photos/800/250)

# 1 🚩引言

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
![|575](https://qnpicmap.fcsluck.top/pics/202406220059961.png)

# 2 ⛪系统架构

Kubernetes 提供了一个运行分布式系统的框架，能够无缝地扩展和管理跨主机集群的容器应用。以下是 Kubernetes 的主要系统架构组件：
**Master Node（主节点）**：
负责集群的管理和控制。
包含以下主要组件：
1. `API Server`：Kubernetes API 的前端，对外提供 RESTful API。
2. `Scheduler`：负责决定将 Pod 放在哪个 Node 上运行。
3. `Controller Manager`：运行集群中的各种控制器，例如 Node Controller、Namespace Controller、Deployment Controller 等。
4. `Etcd`：一个轻量级、分布式的键值存储系统，用于存储集群的所有数据。

**Node（工作节点）**：
运行集群中的工作负载。
每个 Node 包含以下组件：
1. `Kubelet`：负责启动容器，监控容器运行状态，以及容器健康检查。
2. `Container Runtime`：负责容器的生命周期管理，如 Docker、containerd、CRI-O 等。
3. `Kube-proxy`：负责网络代理，实现服务发现和负载均衡。

## 2.1 Master 节点

在 Kubernetes 集群中，Master 节点是负责整个集群的控制和管理的节点。它运行着 Kubernetes 控制平面的组件，这些组件负责调度决策、集群状态的监控以及与集群中其他节点的通信。以下是 Master 节点上运行的主要组件：
1. **kube-apiserver**：API 服务器是 Kubernetes 控制平面的前端，它是系统的中央管理实体。它处理所有的 REST 操作，并且是集群内所有通信的核心。
2. **etcd**：这是一个轻量级的、分布式的键值存储系统，用于持久化集群的状态信息。所有的集群数据，包括 Pods、服务(Service)、配置数据等，都存储在 etcd 中。
3. **kube-scheduler**：调度器负责决定将新的 Pods 调度到哪个节点上运行。它根据资源需求、服务质量要求、亲和性和反亲和性规则以及大量的其他因素进行决策。
4. **kube-controller-manager**：控制器管理器负责运行集群中的各种控制器，包括节点控制器、副本控制器、端点控制器等。
5. **cloud-controller-manager**：如果 Kubernetes 集群运行在云服务上，cloud-controller-manager 负责与云服务提供商的 API 交互，处理与云相关的操作，如创建负载均衡器、获取节点信息等。
6. **addon-manager**：插件管理器负责管理 Kubernetes 的插件，如 DNS、UI 界面(Dashboard)、容器存储接口(CSI)插件等。
7. **kubelet**：虽然 kubelet 通常在每个工作节点(worker node)上运行，但在某些配置中，Master 节点也可能运行 kubelet，以便在 Master 节点上运行 Pods。

Master 节点的健康对于整个 Kubernetes 集群的稳定性至关重要。因此，通常建议至少部署三个或更多的 Master 节点以实现高可用性。在生产环境中，还会使用负载均衡器来分发对 kube-apiserver 的请求，以确保控制平面的稳定性和可用性。

## 2.2 Worker 节点

在 Kubernetes 集群中，Master 节点和 Worker 节点扮演着不同的角色，共同确保了集群的正常运行。以下是对 Worker 节点的介绍：

Worker 节点，也称为工作节点，是 Kubernetes 集群中负责运行应用程序容器的机器。它们是执行实际工作负载的节点，主要负责以下功能：
1. **运行 Pods**：Worker 节点接收来自 Master 节点的指令，负责启动、停止和管理 Pods 中的容器。
2. **维护容器运行环境**：Worker 节点上的 kubelet 与容器运行时（如 Docker、containerd 等）交互，确保容器按照预期运行。
3. **健康检查**：kubelet 在 Worker 节点上执行健康检查，确保 Pods 中的容器正常运行。如果检测到容器失败，kubelet 将根据配置重启容器。
4. **提供节点信息**：Worker 节点定期向 Master 节点报告其状态，包括节点的资源使用情况、Pods 的状态等。
5. **网络代理**：Worker 节点上的 kube-proxy 组件负责实现 Pods 之间的网络通信，包括服务发现和负载均衡。
6. **存储卷管理**：Worker 节点负责挂载和卸载持久化存储卷，以便 Pods 可以访问所需的数据。
7. **扩展和收缩**：根据集群的负载和资源需求，Worker 节点可以被动态地添加到集群中，或者从集群中移除。

Worker 节点的数量和配置可以根据应用程序的需求进行扩展，以提供所需的计算、存储和网络资源。在生产环境中，通常有多个 Worker 节点分布在不同的物理或虚拟机器上，以确保高可用性和负载均衡。
Master 节点负责管理和调度，而 Worker 节点则负责执行具体的工作负载。两者的协同工作使得 Kubernetes 能够高效地运行和管理容器化应用程序。

## 2.3 关键组件

在 Kubernetes 集群中，`kubelet`、`K-proxy`（即 kube-proxy）和 `container-runtime` 是三个关键的组件，它们共同协作以确保容器化应用程序的高效运行和管理。下面是对这三个组件的简要介绍：

### 2.3.1 Kubelet

`kubelet` 是 Kubernetes 集群中的一个节点代理，负责维护在节点上运行的 Pods。它的作用包括：
- 启动 Pods 中的容器，并确保它们保持运行状态。
- 监控容器的健康状况，根据需要重启容器。
- 收集容器的日志和状态信息，并将其报告给 Kubernetes 的控制平面。
- 负责 Pod 的网络配置。

### 2.3.2 K-proxy (kube-proxy)

`kube-proxy` 是 Kubernetes 的网络代理，负责实现集群内的服务发现和负载均衡。它的主要功能包括：
- 为每个服务维护一个虚拟 IP 地址（ClusterIP）。
- 将 Pod 的网络流量转发到后端的 Pods 上。
- 实现端点发现机制，自动更新服务和 Pods 之间的映射关系。
- 提供服务的负载均衡，支持轮询、随机和最小连接数等策略。

### 2.3.3 Container-runtime

容器运行时（container-runtime）是负责运行容器的软件。在 Kubernetes 中，不同的容器运行时可以被用来执行容器化操作。常见的容器运行时包括：
- Docker：最流行的容器运行时之一，提供了丰富的功能和良好的社区支持。
- containerd：由 Docker 贡献给 CNCF 的项目，是一个开放的容器运行时。
- CRI-O：是一个符合 Kubernetes CRI（容器运行时接口）的容器运行时，专为 Kubernetes 设计。
- frakti：是一个轻量级的容器运行时，由 Kubernetes 社区开发。

每个容器运行时都实现了 Kubernetes 定义的 CRI，以确保与 Kubernetes 集群的兼容性。
这些组件共同构成了 Kubernetes 集群的核心，使得 Kubernetes 能够高效地管理和调度容器化应用程序。

# 3 💻核心组件

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

# 4 😀核心概念

## 4.1 应用分类

### 4.1.1 有状态应用

会对本地环境产生依赖，例如需要存储数据到本地磁盘或内存
代表应用：MySQL，Redis
- 优点：可以独立存储，实现数据管理
- 缺点：集群环境下需要实现主从、数据同步、备份、水平扩容复杂。

### 4.1.2 无状态应用

不会对本地环境产生任务依赖，例如不会存储数据到本地磁盘或内存
代表应用：Nginx，Apache
- 优点：对客户端透明，无依赖关系，可以高效实现扩容、迁移
- 缺点：不能存储数据，需要额外的数据服务支撑

## 4.2 😆资源和对象

### 4.2.1 资源分类

#### 4.2.1.1 元数据型

对于资源的元数据描述，每一个资源都可以使用元空间的数据。

##### 4.2.1.1.1 Horizontal Pod Autoscaler（HPA）

Horizontal Pod Autoscaler（HPA）是 Kubernetes 集群中的一个功能，`它根据当前的CPU使用率或其他选择的度量标准，自动扩展Pod的数量`。HPA 可以确保应用程序始终有足够的资源来处理工作负载，同时避免在不需要时浪费资源。
以下是 HPA 的一些关键点：
1. **自动扩展**：HPA 会自动增加或减少 Pod 副本的数量，以维持所需的资源使用率。
2. **基于度量的扩展**：HPA 可以基于多种度量来触发扩展，如 CPU 使用率、内存使用率或自定义度量。
3. **最小和最大限制**：HPA 允许设置最小和最大 Pod 副本数的限制，以防止过度扩展。
4. **冷却期**：HPA 具有冷却期，以防止在短时间内频繁地扩展和缩减，这可能会导致不稳定。
5. **与 Metrics Server 集成**：HPA 依赖于 Metrics Server 来收集和提供集群中资源使用情况的度量数据。
6. **使用场景**：HPA 适用于需要根据流量或工作负载动态调整资源的应用程序。
7. **配置**：HPA 通过定义一个 HPA 资源来配置，其中包括目标资源（如 Deployment）、度量标准、目标值和最小/最大副本数。
8. **与 Cluster Autoscaler 交互**：HPA 可以与 Cluster Autoscaler 一起工作，后者可以根据节点资源使用情况自动扩展或缩减节点的数量。
9. **API 和控制器**：HPA 是 Kubernetes API 的一部分，由 HPA 控制器实现，该控制器监视资源使用情况并相应地调整 Pod 副本数。
10. **安全性**：HPA 控制器运行在 Kubernetes 集群中，需要适当的 RBAC（基于角色的访问控制）配置以确保安全。

使用 HPA 可以提高应用程序的可用性和响应性，同时优化资源使用和成本效率。

##### 4.2.1.1.2 PodTemplate

在 Kubernetes 中，`PodTemplate` 是一个定义了一组用于创建 Pod 的规范的 API 对象。它本身并不直接创建 Pod，而是作为一个模板，可以被其他 Kubernetes 对象使用来生成 Pod。以下是 `PodTemplate` 的一些关键特性和用途：
1. **模板定义**：`PodTemplate` 包含一个 Pod 的完整定义，包括容器、卷、环境变量、标签等。
2. **复用性**：由于 `PodTemplate` 定义了 Pod 的规范，它可以被不同的 Kubernetes 控制器复用，以创建和管理 Pod 的副本。
3. **控制器使用**：`PodTemplate` 主要与以下几种类型的 Kubernetes 控制器一起使用：
   - `Deployment`：提供声明式的更新能力，可以用来声明 PodTemplate，并管理 Pod 副本的生命周期。
   - `StatefulSet`：用于管理有状态应用的 Pod 副本，每个副本有自己的唯一网络标识和持久存储。
   - `DaemonSet`：确保所有或某些节点上运行一个 Pod 副本。
   - `Job`：用来创建一个或多个 Pod，并确保它们运行到完成。

4. **更新和扩展**：使用 `PodTemplate`，可以轻松地更新 Pod 的配置，并根据需要扩展或缩减副本数量。
5. **声明式 API**：`PodTemplate` 作为声明式 API 的一部分，允许用户声明期望的集群状态，Kubernetes 会自动将实际状态更改为期望状态。
6. **生命周期管理**：与 `PodTemplate` 一起使用的控制器负责 Pod 的生命周期管理，包括创建、更新和删除。
7. **模板继承**：在某些场景下，可以基于一个 `PodTemplate` 创建另一个模板，实现配置的继承和重用。
8. **配置管理**：`PodTemplate` 可以与 ConfigMaps 和 Secrets 等配置管理资源一起使用，以集中管理应用程序的配置和敏感信息。
9. **应用部署**：`PodTemplate` 是 Kubernetes 应用部署的核心组件，它定义了应用运行所需的所有细节。
10. **YAML 和 JSON 格式**：`PodTemplate` 通常在 YAML 或 JSON 格式的清单文件中定义，然后通过 `kubectl` 命令行工具或 Kubernetes API 应用到集群中。

`PodTemplate` 提供了一种灵活的方式来定义和管理 Kubernetes 集群中的 Pod，使得应用部署和扩展变得更加简单和高效。

##### 4.2.1.1.3 LimitRange

在 Kubernetes 中，`LimitRange` 是一种资源对象，用于定义在特定命名空间内创建的资源（如 Pods、PersistentVolumeClaims 等）所应遵守的约束条件。`LimitRange` 确保资源使用在预定义的范围内，有助于防止资源的过度分配和浪费。
以下是 `LimitRange` 的一些关键特性：
1. **命名空间级别**：`LimitRange` 在命名空间级别上定义，只对同一命名空间内的资源有效。
2. **资源类型**：可以对不同类型的资源设置限制，如 `Pods`、`Containers`、`PersistentVolumeClaims` 等。
3. **限制类型**：可以设置两种类型的限制：
   - `Min` 和 `Max`：定义资源请求和限制的最大和最小值。
   - `Default` 和 `DefaultRequest`：为未明确设置请求和限制的容器提供默认值。
   - `MaxLimitRequestRatio`：定义最大资源比率（限制与请求的比值）。

4. **强制执行**：当创建或更新资源时，Kubernetes 会自动检查它们是否符合 `LimitRange` 定义的约束。
5. **配置**：通过 YAML 或 JSON 格式的清单文件来配置 `LimitRange`，然后使用 `kubectl` 命令行工具或 Kubernetes API 应用到集群中。
6. **使用场景**：
   - 防止 Pod 请求过多资源。
   - 防止 Pod 限制过少资源，导致可能的资源不足。
   - 确保 Pods 在资源请求和限制之间保持合理的比率。

7. **示例**：一个简单的 `LimitRange` 配置示例可能如下所示：

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: example-limit-range
spec:
  limits:
  - max:
      cpu: "4"
      memory: 1Gi
    min:
      cpu: "250m"
      memory: 100Mi
    type: Container
```

在这个示例中，我们定义了一个 `LimitRange`，它限制了容器的 CPU 和内存使用，最小 CPU 请求为 250 毫核，最小内存请求为 100MiB，最大 CPU 限制为 4 核，最大内存限制为 1GiB。
8. **资源配额**：与 `ResourceQuota` 一起使用，`LimitRange` 可以帮助集群管理员管理资源分配和使用。
9. **动态调整**：`LimitRange` 可以在集群运行时动态更新，以响应资源使用模式的变化。

`LimitRange` 是 Kubernetes 资源管理的重要组成部分，有助于维护集群的稳定性和效率。

#### 4.2.1.2 集群型

作用于集群之上，集群下的所有资源都可以共享使用。

##### 4.2.1.2.1 Namespace

在 Kubernetes（K8s）中，`Namespace` 是一种集群级别的资源，用于将集群内部的对象分组，并提供一种在多个用户和应用之间分割集群资源的方法。以下是关于 Kubernetes `Namespace` 的一些关键点：
1. **资源分割**：`Namespace` 允许集群管理员将资源分配给不同的用户、组织或应用，实现资源的逻辑分割。
2. **名称唯一性**：在同一个 `Namespace` 中，资源名称（如 Pods、Services 等）必须是唯一的，但在不同的 `Namespace` 中可以重复。
3. **权限控制**：通过 `Namespace`，可以为不同的用户或组设置不同的访问权限，控制他们对资源的访问。
4. **资源配额**：可以为每个 `Namespace` 设置资源配额（`ResourceQuota`），限制该 `Namespace` 内所有资源的总消耗。
5. **限制范围**：可以在 `Namespace` 级别设置 `LimitRange`，定义资源使用的约束条件。
6. **网络策略**：可以为 `Namespace` 定义网络策略（`NetworkPolicy`），控制 Pod 间的网络流量。
7. **插件和控制器**：某些 Kubernetes 插件和控制器可以在 `Namespace` 级别运行，为该 `Namespace` 提供特定的功能。
8. **生命周期管理**：`Namespace` 有自己的生命周期状态，包括 `Active`、`Terminating` 等，可以被创建、删除或暂停。
9. **资源清理**：当 `Namespace` 被删除时，它内的所有资源也会被自动清理。
10. **命名约定**：通常建议使用有意义的命名约定来区分不同的 `Namespace`，如按环境（`development`、`staging`、`production`）或按应用（`app1`、`app2`）。
11. **默认 `Namespace`**：Kubernetes 集群中有一个默认的 `Namespace`，名为 `default`，如果没有指定 `Namespace`，则资源会被创建在这个 `Namespace` 中。
12. **命令行操作**：使用 `kubectl` 命令行工具可以方便地对 `Namespace` 进行操作，如创建、查看、切换和删除。

创建一个新的 `Namespace` 的示例 YAML 文件如下：

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-namespace
```

使用 `kubectl` 创建 `Namespace`：

```bash
kubectl create -f my-namespace.yaml
```

`Namespace` 是 Kubernetes 集群中实现多租户和资源管理的重要概念，有助于提高集群的组织性和安全性。

##### 4.2.1.2.2 Node

在 Kubernetes 中，`Node` 是集群中的一个工作节点，它对应物理或虚拟的机器。Node 是运行 Pods 和其他 Kubernetes 对象的主机。以下是关于 Kubernetes `Node` 的一些关键特性：
1. **计算资源**：每个 Node 都有自己的计算资源，如 CPU、内存和磁盘，这些资源被用来运行 Pods。
2. **注册**：Node 必须在 Kubernetes 集群中注册，以便集群可以管理和调度 Pods 到这些节点。
3. **标签（Labels）**：可以给 Node 设置标签，这些标签可以用来组织 Node，或者作为 Pods 调度的依据。
4. **污点和容忍（Taints and Tolerations）**：Node 可以设置污点，用来排斥某些 Pods。Pods 可以通过设置容忍来容忍这些污点。
5. **亲和性（Affinity）**：Pods 可以设置亲和性规则，以指定它们应该或不应该调度到哪些 Node。
6. **节点选择器（Node Selector）**：在创建 Pod 时，可以使用节点选择器指定 Pod 应该运行在具有特定标签的 Node 上。
7. **资源配额（Resource Quotas）**：可以为 Node 设置资源配额，限制在该 Node 上运行的 Pods 可以使用的资源量。
8. **节点条件**：Node 具有多种条件，如 `Ready`、`OutOfDisk`、`MemoryPressure` 等，这些条件用于指示 Node 的状态。
9. **节点问题**：如果 Node 出现问题，比如无法访问 API Server，它将被视为 NotReady，集群将不会向其调度新的 Pods。
10. **维护模式**：Node 可以进入维护模式，此时，集群将逐步迁移该 Node 上的 Pods，以便进行系统维护或升级。
11. **节点端点**：Node 资源定义了如何访问 Node 上的服务，例如，每个 Node 都会运行一个 kubelet 服务，用于管理 Pods。
12. **节点 CIDR**：在某些网络模型中，Node 可以有一个分配给它的 CIDR（Classless Inter-Domain Routing）范围，用于 Pods 的 IP 地址分配。
13. **kubelet**：Node 上的 kubelet 组件负责启动容器、监控容器健康和资源使用情况，以及向 API Server 报告 Node 和 Pod 的状态。
14. **Drain 节点**：在需要安全地关闭 Node 进行维护时，可以使用 `kubectl drain` 命令，它会逐个安全地删除 Node 上的 Pods。
15. **节点的生命周期**：Node 的生命周期包括从注册、运行、变为 NotReady、进入维护模式、到最终可能的注销。

Node 是 Kubernetes 集群中执行工作负载的基础，它们的状态和配置对集群的稳定性和效率至关重要。集群管理员需要监控 Node 的状态，确保它们健康并具有足够的资源来运行应用程序。

##### 4.2.1.2.3 ClusterRole

在 Kubernetes 中，`ClusterRole` 是一种基于角色的访问控制（Role-Based Access Control, RBAC）资源，它定义了一组权限，可以在集群范围内的资源上进行操作。`ClusterRole` 可以被用来授予用户或服务账户（ServiceAccount）对 Kubernetes API 的访问权限。以下是关于 Kubernetes `ClusterRole` 的一些关键特性：
1. **集群范围**：与 `Role` 不同，`ClusterRole` 授予的权限是在整个 Kubernetes 集群中生效的，而不是局限于某个特定的命名空间（Namespace）。
2. **权限定义**：`ClusterRole` 可以包括对多种资源的访问权限，例如对 Pods、Services、ConfigMaps、Secrets 等的读取（get）、列出（list）、创建（create）、更新（update）、删除（delete）等操作。
3. **聚合（Aggregation）**：某些 `ClusterRole` 可以聚合其他 `ClusterRole` 的权限，提供一种将多个角色组合在一起的方式。
4. **与 ClusterRoleBinding 关联**：`ClusterRole` 需要通过 `ClusterRoleBinding` 与用户或服务账户绑定，才能授予实际的访问权限。
5. **规则（Rules）**：在 `ClusterRole` 中定义的规则指定了权限的详细范围，包括 API 组（APIGroups）、资源类型（Resources）、资源名称（ResourceNames）和动词（Verbs）。
6. **命名空间不敏感**：由于 `ClusterRole` 是集群级别的，它不关心命名空间的划分，不像 `Role` 那样只对特定命名空间内的资源有效。
7. **预定义的 ClusterRoles**：Kubernetes 提供了一些预定义的 `ClusterRole`，例如 `cluster-admin`，它拥有对集群所有资源的完全访问权限。
8. **灵活的权限控制**：`ClusterRole` 可以精细地控制权限，例如只允许对特定命名空间的资源进行操作，或者只允许对特定类型的资源进行特定的操作。
9. **API 资源**：`ClusterRole` 本身也是一个 Kubernetes API 资源，可以通过 YAML 或 JSON 格式定义，并使用 `kubectl` 命令行工具进行操作。
10. **与 Role 的配合使用**：在实际使用中，`ClusterRole` 常常与 `Role` 结合使用，`Role` 可以为特定命名空间内的资源设置权限，而 `ClusterRole` 可以提供跨命名空间或集群级别的权限。

创建一个简单的 `ClusterRole` 的示例 YAML 文件如下：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: example-clusterrole
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "watch"]
```

使用 `kubectl` 创建 `ClusterRole`：

```bash
kubectl create -f example-clusterrole.yaml
```

`ClusterRole` 是 Kubernetes 中实现细粒度访问控制的重要工具，它为集群管理员提供了一种灵活的方式来管理用户和服务账户的权限。

##### 4.2.1.2.4 ClusterRoleBinding

`ClusterRoleBinding` 是 Kubernetes 中的 RBAC（Role-Based Access Control，基于角色的访问控制）资源之一。它用于将 `ClusterRole` 或者 `Role` 与一组用户、服务账户（ServiceAccount）、或者组（Group）绑定，从而授予它们相应的权限。以下是关于 Kubernetes `ClusterRoleBinding` 的一些关键特性：
1. **集群范围的绑定**：`ClusterRoleBinding` 可以用来在整个 Kubernetes 集群范围内授予权限，因为它绑定的是 `ClusterRole`。
2. **用户、服务账户或组**：`ClusterRoleBinding` 可以将权限授予单个用户、服务账户或者用户组。
3. **命名空间不敏感**：由于 `ClusterRoleBinding` 与 `ClusterRole` 关联，它授予的权限适用于整个集群，而不是特定的命名空间。
4. **角色引用**：在 `ClusterRoleBinding` 中，你可以指定一个 `ClusterRole` 或者 `Role`，以及需要被授予该角色权限的用户或服务账户。
5. **权限的累加**：如果一个用户或服务账户被多个 `ClusterRoleBinding` 或 `RoleBinding` 引用，它们所拥有的权限是累加的。
6. **API 资源**：`ClusterRoleBinding` 是 Kubernetes API 的一部分，可以通过 YAML 或 JSON 文件定义，并使用 `kubectl` 命令行工具进行操作。
7. **示例 YAML 文件**：创建一个 `ClusterRoleBinding` 来授予用户或服务账户 `ClusterRole` 的示例如下：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: example-clusterrolebinding
subjects:
- kind: User
  name: <EMAIL>
  apiGroup: rbac.authorization.k8s.io
- kind: ServiceAccount
  name: myserviceaccount
  namespace: mynamespace
roleRef:
  kind: ClusterRole
  name: example-clusterrole
  apiGroup: rbac.authorization.k8s.io
```

在这个示例中，`example-clusterrole` 是被绑定的 `ClusterRole`，它授予了 `<EMAIL>` 用户和 `myserviceaccount` 服务账户在 `mynamespace` 命名空间中的权限。
8. **使用 `kubectl` 创建**：使用以下命令创建 `ClusterRoleBinding`：

```bash
kubectl create -f example-clusterrolebinding.yaml
```

9. **权限审查**：`ClusterRoleBinding` 可以用于审查和审计，帮助确定谁拥有对集群资源的访问权限。

`ClusterRoleBinding` 是 Kubernetes 权限管理的核心组件之一，它为集群管理员提供了一种灵活的方式来控制对集群资源的访问。通过合理使用 `ClusterRoleBinding`，可以确保集群的安全性和资源的合理分配。

#### 4.2.1.3 命名空间级

作用在命名空间之上，通常只能在该命名空间范围内使用。

##### 4.2.1.3.1 工作负载

###### Pod

![](https://qnpicmap.fcsluck.top/pics/202407060942715.png)
Pod 是 Kubernetes 集群中的**最小部署单元**，它可以**包含一个或多个容器**，这些容器**共享网络和存储资源**。Pod 的概念设计是为了解决容器的单进程模型限制，允许一组紧密协作的进程共享某些资源和文件，提高效率。Pod 内的容器通过 localhost 进行通信，共享网络命名空间和存储卷，使得它们可以高效地共享数据和通信。
Pod 的设计允许容器之间共享某些资源，例如，一个容器生成的数据可以被另一个容器处理，因为它们可以挂载共享的存储卷。Pod 还具有自己的生命周期，如果 Pod 中的容器失败或终止，Kubernetes 会根据定义的重启策略自动重启 Pod。
Pod 是 Kubernetes**分配资源的单位，也是原子调度单位**，确保 Pod 内的容器在同一节点上调度，并通过共享网络和存储资源来提高应用程序性能和可靠性。Pod 的这种设计模式，被称为“Sidecar”，在 Pod 中定义专门的容器来执行主业务容器所需的辅助工作，例如日志收集或配置管理。
每个 Pod 被分配了**唯一的 IP 地址**，Pod 内的容器共享一个网络空间，**包括 IP 和端口**。不同 Pod 之间的通信则通过 IP+端口的形式来访问到 Pod 内的具体服务（容器）。
Kubernetes 集群中的 Pod 存在如下两种使用途径：
1. 一个 Pod 中只运行一个容器。"one-container-per-pod" 是 Kubernetes 中最常见的使用方式。此时，您可以认为 Pod 容器组是该容器的 wrapper，Kubernetes 通过 Pod 管理容器，而不是直接管理容器。
2. 一个 Pod 中运行多个需要互相协作的容器。您可以将多个紧密耦合、共享资源且始终在一起运行的容器编排在同一个 Pod 中.

> [!NOTE] replicas
> 1. 一个 Pod 可以被复制成多份，每一份可被称之为一个**副本**，这些副本除了一些 `描述性的信息(Pod的名字、uid等)` 不一样以外，其它信息都是一样的，譬如 Pod 内部的容器、容器数量、容器里面运行的应用等的这些信息都是一样的，这些副本提供同样的功能。
> 2. Pod 的“**控制器**”通常包含一个名为"replicas"的属性。"replicas"属性则指定了特定 Pod 的副本的数量，当当前集群中该 Pod 的数量与该属性指定的值不一致时，k8s 会采取一些策路去使得当前状态满足配置的要求。

> [!hint] 控制器
> 1. 概念：在 Kubernetes 中，Pod 的控制器（Controller）是一种**高级抽象**，用于对一组 Pod 进行管理，确保它们始终运行在用户期望的状态，对 Pod 的进一步包装。
> 2. 特点：
>    - **自我修复（Self-healing）**：如果 Pod 由于某些原因失败或终止，控制器会替换失败的 Pod，通常是通过重新启动 Pod 或在其他节点上创建一个新的 Pod 副本。
>    - **水平扩展（Horizontal scaling）**：控制器可以根据需求自动增加或减少 Pod 的数量，以应对负载变化。
>     
>    - **滚动更新（Rolling updates）**：控制器可以管理 Pod 的更新过程，确保在更新应用程序时，服务的可用性不会受到影响。
>     
>    - **声明式部署（Declarative updates）**：用户可以定义 Pod 的期望状态，控制器会负责将当前状态更改为期望状态。

3. 分类：
**Deployment（无状态）**：用于运行无状态应用程序，提供声明式的更新能力，可以指定 Pod 副本的数量，并确保始终运行指定数量的 Pod 副本，提供功能（**创建 Replica Set/Pod，滚动升级/回滚，平容和缩容，暂停与恢复 Deployment**）
![|400](https://qnpicmap.fcsluck.top/pics/202407061019309.png)
**ReplicaSet（无状态）**（在 **Deployment** 中内部使用）：确保 Pod 副本的精确数量始终运行。Deployment 控制器使用 **ReplicaSet 来确保 Pod 副本的一致性**，通过 `selector` 来选择对哪些 Pod（`label`）生效，动态更新 Pod 的副本数。

---
**StatefulSet（有状态）**：用于运行有状态的应用程序，如数据库。StatefulSet 为每个 Pod 提供持久化标识、顺序部署、扩展和滚动更新，以及存储的持久化。
1. 主要特点：
	- 稳定的持久化存储
	- 稳定的网络标志
	- 有序部署，有序扩展：即 Pod 是有顺序的，在*部署或者扩展的时候要据定义的顺序依次依次进行（即从 0 到 N-1,在下一个 Pod 运行之前所有之前的 Pod 必须都是 Running 和 Ready 状态)，是于 init containers 来实现*
	- 有序收缩，有序删除
1. 组成：
   - **Headless Service**：StatefulSet 中每个 Pod 的 DNS 格式为 `statefulSetName-{0~N-1).serviceName.namespace.svc.cluster.local`
	1. **serviceName**：Headless Service 的名字
	2. **0~N-1**：Pod 所在的序号，从 0 开始到 N-1
	3. **statefulSetName**：StatefulSet 的名字
	4. **namespace**：服务所在的 namespace,Headless Servic 和 StatefulSet 必须在相同的 namespace
	5. **.cluster.local**：Cluster Domain
  - **volumeClaimTemplate**：用于动态供应存储卷（PersistentVolume）的模板，它定义了存储卷的要求和特性，但并不直接创建存储卷。
    1. **PersistentVolume (PV)**：预配置的存储卷，已经由管理员设置好并可供使用。
	2. **PersistentVolumeClaim (PVC)**：类似于对 PV 的请求，用户根据需要请求存储，Kubernetes 会自动匹配合适的 PV。
	3. **volumeClaimTemplate**：是一个模板，用于在 StatefulSet 等控制器中动态创建 PVC。

---
**DaemonSet（守护进程）**：确保在集群中的**所有（或某些）节点上运行一个 Pod 副本**，通常用于运行日志收集器、监控代理等。
DaemonSet 保证在**每个匹配的 Node 上都运行一个容器副本**，常用来部署一些集群的日志、监控或者其他系统管理应用。典型的应用包括：
- *日志收集*，比如 fluentd,logstash 等
- *系统监控*，比如 Prometheus Node Exporter,.collectd,New Relic agent,Ganglia gmond
- *系统程序*，比如 kube-proy,kube-dns,glusterd,ceph 等
![|600](https://qnpicmap.fcsluck.top/pics/202407061118025.png)

---
**Job（任务）**：负责批处理任务的 Pod，确保指定数量的 Pod 成功完成任务。

---
**CronJob（定时任务）**：基于时间表创建 Job 对象，用于定时任务。

##### 4.2.1.3.2 服务发现

![|350](https://qnpicmap.fcsluck.top/pics/202407061726447.png)

###### Service

Service 简写"svc"。Pod 不能直接提供给外网访问，而是应该使用 service。Service 就是把 Pod 暴露出来提供服务，Service 才是真正的“服务”，它的中文名就叫“服务”。
可以说 Service 是一个**应用服务的抽象**，定义了 Pod 逻辑集合和访问这个 Pod 集合的策路。Service 代理 Pod 集合，对外表现为一个访问入口，访问该入口的请求将经过负载均衡，转发到后端 Pod 中的容器。
![](https://qnpicmap.fcsluck.top/pics/202407062213550.png)

###### Ingress

在 Kubernetes 中，Ingress 是一个 API 对象，它管理外部访问集群内服务的 HTTP 和 HTTPS 路由。Ingress 可以提供 URL 路由、负载均衡、SSL/TLS 终止，以及名称基的虚拟托管。Ingress 允许你定义基于请求的路由规则，将外部请求转发到集群内的适当服务。

##### 4.2.1.3.3 存储

###### Volume

数据卷，共享 Pod 中容器使用的数据。用来放持久化的数据，比如数据库数据。

###### CSI

Container Storage Interface 是由来自 Kubernetes、Mesos、Docker 等社区成员联合制定的一个行业标准接口规范，旨在将任意存储系统暴露给容器化应用程序。
CSI 规范定义了存储提供商实现 CSI 兼容的 Volume Plugin 的最小操作集和部署建议。CSI 规范的主要焦点是声明 Volume Plugin 必须实现的接口。

##### 4.2.1.3.4 特殊类型配置

###### ConfigMap

ConfigMap 是 Kubernetes 中的一个 API 资源，用于**存储配置数据**，这些数据可以被 Pods 以多种方式使用。ConfigMap 通常用于存储应用的配置信息，比如**环境变量、配置文件等**，使得这些信息与应用程序代码分离，便于管理和更新。
ConfigMap 可以**包含键值对，这些键值对可以被映射到容器的环境变量中**，或者作为配置文件挂载到容器的文件系统中。ConfigMap 的数据可以以多种格式存储，比如 JSON、YAML、属性文件等。

###### Secret

Secret 是 Kubernetes 中用于**存储敏感信息的 API 资源，例如密码、OAuth 令牌、SSH 密钥等**。与 ConfigMap 类似，Secret 也用于**存储键值对**，但 Secret 提供了额外的安全特性来保护这些敏感数据。
在 Kubernetes 中，Secret 可以有几种不同的类型，每种类型都定义了如何存储和处理 Secret 中的数据。以下是一些常见的 Secret 类型：
1. **Opaque**：这是默认的 Secret 类型，用于存储不特定于任何类型的敏感数据。例如，密码、令牌或密钥。Opaque 类型的 Secret 没有特定的结构要求。
2. kubernetes.io/service-account-token ：这种类型的 Secret 自动由 API 服务器创建和管理，用于存储服务账户的访问令牌。Pod 使用服务账户时，这个类型的 Secret 会自动挂载到 Pod 中。
3. kubernetes.io/dockerconfigjson：用于存储私有 Docker 注册表的认证信息。这种类型的 Secret 允许 Pod 从私有 Docker 注册表中拉取镜像。
4. kubernetes.io/tls：用于存储 TLS 证书和私钥。这种类型的 Secret 通常用于配置服务的 TLS 通信。
5. kubernetes.io/basic-auth：用于存储 HTTP 基本认证的用户名和密码。
6. kubernetes.io/ssh-auth：用于存储 SSH 私钥，用于 SSH 认证。
7. kubernetes.io/azure-disks：用于存储 Azure 磁盘的认证信息。
8. kubernetes.io/azure-file：用于存储 Azure 文件的认证信息。
9. kubernetes.io/gcp-secrets：用于存储 Google Cloud Platform 的机密信息。
10. kubernetes.io/flocker：用于存储 Flocker 卷的认证信息。

每种类型的 Secret 都有其特定的用途和存储方式。例如，`kubernetes.io/tls` 类型的 Secret 会自动将证书和私钥挂载到 Pod 中，并配置为服务的 TLS 证书。而 `kubernetes.io/dockerconfigjson` 类型的 Secret 允许 Kubernetes 集群访问私有 Docker 注册表。
在创建 Secret 时，可以通过 `type` 字段指定 Secret 的类型。如果不指定类型，默认为 `Opaque`。不同类型的 Secret 可能会影响 Kubernetes 如何处理和挂载这些 Secret。

###### DownwardAPI

DownwardAPI 是 Kubernetes 中的一种资源类型，**它允许 Pod 中的容器访问有关其环境（Pod）的信息**。这些信息包括但不限于：

- Pod 的名称
- Pod 的命名空间
- Pod 的 IP 地址
- Pod 标签（Labels）
- Pod 注解（Annotations）

downwardAPI 提供了两种方式用于将 pod 的信息注入到容器内部：
1. **环境变量**：用于单个变量，可以将 Pod 信息和容器信息直接注入容器内部
2. **volume 挂载**：将 pod 信息生成为文件，直接挂载到容器内部中去

使用 DownwardAPI 可以使得容器在运行时能够自省其环境，这在某些场景下非常有用，比如*日志记录、监控或者配置管理*。

##### 4.2.1.3.5 其他

###### Role

在 Kubernetes 中，Role 和 RoleBinding 是基于角色的访问控制（Role-Based Access Control，RBAC）的两种资源对象，它们用于定义权限和分配权限。

Role 是一个资源对象，它定义了一组权限，这些权限可以被应用到一个或多个 Kubernetes 资源上。Role 通常与特定的命名空间（Namespace）相关联，这意味着它的作用域限制在命名空间内。Role 定义了一组规则，这些规则指定了用户可以对哪些资源执行哪些操作。

Role 的定义通常包括：

- **API 组（API Groups）**：指定 Role 适用的 API 组。
- **资源类型（Resources）**：指定可以操作的资源类型，如 pods, services 等。
- **资源名称（Resource Names）**：可以指定特定资源的名称。
- **动词（Verbs）**：指定可以对资源执行的操作，如 get, list, watch, create, update, patch, delete 等。

###### RoleBinding

RoleBinding 是一个资源对象，它将一个或多个 Role 分配给一组用户、用户组或服务账户。RoleBinding 也与特定的命名空间相关联，这意味着它的作用域限制在命名空间内。

RoleBinding 的定义通常包括：

- **RoleRef**：指定要绑定的 Role。
- **Subjects**：指定 Role 要分配给哪些用户或用户组。

### 4.2.2 资源清单

### 4.2.3 对象的规约和状态

在 Kubernetes 中，对象的规约（Spec）和状态（Status）是资源对象的两个重要部分，它们定义了对象的期望配置和当前状态。

#### 4.2.3.1 规约

spec 是规约、规格的意思，spec 是必需的。它描述了对象的期望状态(Desired State ）即希望对象所具有的特征，当创建 Kubernetes 的对象时，必须得供对象的规约，用来描述该对象的期望状态，以及关于对象的一些基本信息（例如名称）。

- **定义**：规约是 Kubernetes 资源对象的一部分，它定义了**用户期望的配置或行为**。规约是用户对资源的期望声明，Kubernetes 系统会尝试将资源的实际状态与规约匹配。
- **用途**：规约通常用于**定义资源的配置**，例如 Pod 的规约定义了**容器的镜像、环境变量、存储卷**等。
- **不可变性**：规约通常是不可变的，**一旦创建，用户不应该直接修改它**。如果需要更新资源的配置，应该创建一个新的规约对象。

#### 4.2.3.2 状态

表示对象的实际状态，该属性由 K8s 自己维护。
- **定义**：状态是 Kubernetes 资源对象的一部分，它记录了**资源的当前状态**。状态由 Kubernetes 系统维护，用户不应该手动修改。
- **用途**：状态**提供了资源的运行时信息**，例如 Pod 的状态可以是 `Running、Pending、Succeeded 或 Failed`。
- **可变性**：状态是可变的，Kubernetes 控制器会*根据资源的实际运行情况更新状态*。

# 5 💡实战操作篇

## 5.1 K8s 集群搭建

### 5.1.1 搭建方案

#### 5.1.1.1 Minikube

##### 5.1.1.1.1 服务器要求

3 台服务器（一主两从：1master，2node）
最低配置：2 核心，2GB 内存，20G 硬盘
最好能联网，不能联网的话需要有提供对应境像的私有仓库

##### 5.1.1.1.2 环境配置

操作系统：CentOS7
Docker：20+
k8s：1.23.6（1.24+以后由于 CRI 不支持 docker 作为容器运行时）

##### 5.1.1.1.3 安装步骤

###### 初始操作（所有节点）

- #配置静态ip
	- [【Linux】为 VMware 的 Linux 系统（CentOS 7）设置静态IP地址](https://blog.csdn.net/m0_50513629/article/details/139055933)
	- [centOS 7下无法启动网络（service network start）错误解决办法](https://www.cnblogs.com/zhizhao/p/9442487.html)
	- 注意有个命令需要把 interface=ens33 改成你对应的网卡,可以使用 ifconfig 查看到你的网卡信息如果你的网阿卡是 ens192 只需要把上面的命令改成 interface=ens192
	- 配置完静态 ip 后要重启网络：
	  1. systemctl stop NetworkManager
	  2. systemctl disable NetworkManager
	  3. service network restart
	  4. ip addr
- #关闭防火墙
	- systemctl stop firewalld
	- systemctl disable firewalld
- #关闭selinux
	- sudo sed -i 's/enforcing/disabled/' /etc/selinux/config #永久
	- setenforce 0 #临时
- #关闭swap
	- swapoff -a #临时
	- sed -ri 's/.*swap.*/#&/' /etc/fstab #永久
	- #关闭完swap后 ，一定重启一下虚拟机！！I
- #根据规划设置主机名
	- `hostnamectl set-hostname <hostname>`
- #在master添加hosts

```sh
cat >> /etc/hosts << EOF
192.168.19.100 centos7-100-master
192.168.19.101 centos7-101-node1
192.168.19.102 centos7-102-node2
EOF
```

- #将桥接的IPv4流量传远划iptables的链

```sh
cat > /etc/sysctl.d/k8s.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF
```

- sysctl --system #生校
- #时间同步
	- yum install ntpdate -y
	- ntpdate time.windows.com
- [配置yum国内镜像源](https://blog.csdn.net/m0_49605975/article/details/120039048)
	1. 备份源文件：mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
	2. 下载国内 yum 源配置文件到/etc/yum.repos.d/：
		- 阿里源（推荐）：curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
		- 网易源：curl -o  /etc/yum.repos.d/CentOS-Base.repo http://mirrors.163.com/.help/CentOS7-Base-163.repo
	3. 清理 yum 缓存，并生成新的缓存：
	   - yum clean all
	   - yum makecache
	4. 更新 yum 源检查是否生效：yum update

> [!TIP] 温馨提示
> 一个节点设置完成后，可为其新建一个快照，然后通过 VMware 的克隆功能克隆两个一样的虚拟机；然后只需要调整静态 ip 和主机名称即可（`vi /etc/sysconfig/network-scripts/ifcfg-ens33`，`hostnamectl set-hostname <hostname>`）

###### 安装基础软件（所有节点）

1. 安装 docker：
   - [各种环境配置#Docker](source/_posts/运维开发/各种环境配置.md#Docker)，docker 版本和 k8s 有兼容关系，版本对应才行，具体看 [kubernetes/CHANGELOG/CHANGELOG-1.23.md at master · kubernetes/kubernetes · GitHub](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.23.md)。

>      docker 版本降级：
>      1. yum downgrade --setopt=obsoletes=0 -y docker-ce-20.10.0-3.el7 docker-ce-cli-20.10.0-3.el7 containerd.io
>      2. systemctl start docker
>      3. docker version

   - 修改 `cgroup`:

```sh
cat > /etc/docker/daemon.json << EOF { "exec-opts": ["native.cgroupdriver=systemd"] } EOF
```

1. 配置阿里云镜像源:

```sh
cat << EOF > /etc/yum.repos.d/kubernetes.repo 
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

3. 安装 kubeadm、kubelet、kubectl，并添加开机启动

```sh
yum install -y kubelet-1.23.6 kubeadm-1.23.6 kubectl-1.23.6
systemctl enable kubelet
```

###### 部署 Kubernetes Master

1. #在Master节点下执行

```sh
kubeadm init \
--apiserver-advertise-address=192.168.19.100 \
--image-repository registry.aliyuncs.com/google_containers \
--kubernetes-version v1.23.6 \
--service-cidr=10.96.0.0/12 \
--pod-network-cidr=10.244.0.0/16
```

 ![|500](https://qnpicmap.fcsluck.top/pics/202407080128851.png)
2. #安装成功后 ，复制如下配置并执行

```sh
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

3. 检查是否安装成功
   kubectl get nodes：
`NAME                 STATUS     ROLES                  AGE   VERSION`
`centos7-100-master   NotReady   control-plane,master   11m   v1.23.6`

###### 加入 Kubernetes Node

> 分别在 centos7-101-node1 和 centos7-102-node2 执行

1. #下方命令可以在 k8s master 控制台初始化成功后复制 join 命令

```sh
kubeadm join 192.68.19.100:6443 --token <master控制台的token>
 --discovery-token-ca-cert-hash <master控制台的hash>


kubeadm join 192.68.19.100:6443 --token xnnhf0.1mebzdx2hzrlqqtk  --discovery-token-ca-cert-hash sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

#如果初始化的token不小心清空了 ，可以通过如下命令获取或者里新申请
#如果token已经过期 。就重新申请:

```sh
kubeadm token create
```

#token没有过期可以通过如下命令获取

```sh
kubeadm token list
```

#获取 --discovery-token-ca-cert-hash 值，得到值后需要在前面拼接上 sha256:

```sh
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl
rsa -pubin -outform der 2>/dev/null |\
openssl dgst -sha256 -hex | sed 's/^.* //'
```

#或者直接新建新token和cert -hash：

```sh
sudo kubeadm token create --print-join-command
```

###### 部署 CNI 网络插件

#在master节点上执行
1. #下载calico配置文件 ，可能会网络超时

```sh
curl -O https://calico-v3-25.netlify.app/archive/v3.25/manifests/calico.yaml
```

2. #修改calico .yaml 文件中的 `CALICO_IPV4POOL_CIDR` 配置，修改为与部署 master 初始化的 cidr 相同（即：`--pod-network-cidr=10.244.0.0/16`）
3. #修改 `IP_AUTODETECTION_METHOD` 下的网卡名称
4. #删除镜像 `docker.io/` 前缀，避免下载过慢导致失败

```sh
sed -i 's#docker.io/##g' calico.yaml

grep image calico.yaml #查看去除docker.io镜像源后的镜像
```

5. 应用执行 calico.yml

```sh
kubectl apply -f calico.yaml
```

![](https://qnpicmap.fcsluck.top/pics/202407131502094.png)

![](https://qnpicmap.fcsluck.top/pics/202407131501885.png)

> [!Warning] Tips
> 执行上述命令后会自动运行一些 pod，但是可能会由于**镜像被墙而无法拉取**，因此需要**配置可用镜像源或者指定镜像源 pull 后再 docker save 和 load 转移到其他节点**上。

###### 测试 Kubernetes 集群

1. #创建部署

```sh
kubectl create deployment nginx --image=nginx
```

2. #暴露端口

```sh
kubectl expose deployment nginx --port=80 --type=NodePort
```

3. #查看Pod以及服务信息

```sh
kubectl get pod,svc
```

### 5.1.2 命令行工具 Kubectl

#### 5.1.2.1 自动补全

#### 5.1.2.2 任意节点使用 Kubectl

1. #将master节点中/etc/kubemnetes/admin .conf 拷贝到需要运行的服务器的/etc/kubernetes 目录中

```sh
scp /etc/kubernetes/admin.conf root@centos7-101-nodel:/etc/kubernetes
```

2. #在对应的服务器上配置环境变量

```sh
echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> ~/.bash_profile
source ~/.bash_profile
```

#### 5.1.2.3 资源操作

##### 5.1.2.3.1 查询

```sh
#查看pod详细信息，包含pod状态，数量，所在节点，ip和名称等
kubectl get po -o wide
#查看deploy详细信息，包含名称，数量，容器名称，镜像名称和选择器等
kubectl get deploy -o wide
#查看service详细信息，包含服务名称，类型，ip，端口和选择器等
kubectl get svc -o wide
#查看namespace详细信息，包含名称，状态
kubectl get ns -o wide
#查看node详细信息，包含名称，状态，角色，版本，ip，os，内核和容器版本等
kubectl get no -o wide
```

#### 5.1.2.4 Pod 与集群

##### 5.1.2.4.1 新建 Pod

指定 yml 配置文件（类似于 docker-compose.yml 配置文件）启动资源（deployment、pod 等）

```sh
kubectl apply -f <nginx-demo.yml>
```

#### 5.1.2.5 资源类型与别名

| 资源类型        | 别名     |
| ----------- | ------ |
| pods        | po     |
| deployments | deploy |
| services    | svc    |
| namespace   | ns     |
| nodes       | no     |

#### 5.1.2.6 格式化输出

- 输出 json 格式 -o json
- 仅打印资源名称 -o name
- 以纯文本格式输出所有信息 -o wide
- 输出 yaml 格式 -o yaml `eg:kubectl get deploy nginx -o yaml`

### 5.1.3 API 概述

#### 5.1.3.1 类型

Kubernetes（通常简称为 k8s）是一个开源的容器编排系统，用于自动化应用程序的部署、扩展和管理。Kubernetes 版本通常分为几个阶段，以反映其成熟度和稳定性。以下是三种主要版本的概述：

1. **Alpha（阿尔法）版本**：
   - 这是 Kubernetes 功能开发的最早期阶段。
   - Alpha 功能通常是实验性的，可能包含许多漏洞和不稳定性。
   - 它们可能在 API 或功能上发生重大变化，甚至可能在后续版本中被完全移除。
   - Alpha 版本不推荐用于生产环境，仅供开发和测试使用。

2. **Beta（贝塔）版本**：
   - Beta 版本是功能开发的进一步成熟阶段，比 Alpha 版本更稳定。
   - 它们在功能上可能已经相对完整，但仍然可能包含一些未解决的问题或需要进一步测试的地方。
   - Beta 功能在 API 和功能上的变化风险较低，但仍然可能发生一些不兼容的更改。
   - Beta 版本可以用于更广泛的测试，但仍然不建议在生产环境中使用。

3. **Stable（稳定）版本**：
   - 稳定版本是 Kubernetes 功能开发的最终阶段，具有高度的可靠性和成熟度。
   - 这些功能已经经过广泛的测试和验证，API 和功能的变化非常有限。
   - 稳定版本是推荐用于生产环境的，因为它们提供了最低的风险和最好的支持。
   - Kubernetes 的稳定版本通常会定期发布，并且会提供长期的维护和安全更新。

在 Kubernetes 的开发过程中，新功能首先作为 Alpha 版本引入，然后逐步发展到 Beta，最终成为稳定版本。这个过程允许社区和用户有足够的时间来测试新功能，并在它们被广泛采用之前提供反馈。

#### 5.1.3.2 访问控制

##### 5.1.3.2.1 认证（Authentication）

认证是确定用户或服务账户身份的过程。在 Kubernetes 中，认证机制确保只有经过验证的用户和系统才能访问集群资源。Kubernetes 支持多种认证方式，包括但不限于：

- **客户端证书**：使用 TLS 证书进行认证。
- **令牌**：使用 JSON Web Tokens (JWT) 或服务账户令牌进行认证。
- **密码**：使用用户名和密码进行基本认证。
- **OpenID Connect**：使用 OpenID Connect 令牌进行认证。
- **Webhook**：通过远程服务器进行认证。

认证通常是通过 Kubernetes API 服务器来完成的，API 服务器配置了认证机制，以验证所有进入的请求。

##### 5.1.3.2.2 授权（Authorization）

授权是在认证之后进行的，它决定了经过认证的用户或服务账户可以执行哪些操作。Kubernetes 提供了几种授权策略，包括：

- **Node**：授权节点可以访问 API 服务器。
- **RBAC（基于角色的访问控制）**：定义角色和角色绑定，控制用户可以访问的资源和执行的操作。
- **ABAC（基于属性的访问控制）**：基于属性（如用户属性、资源属性等）进行访问控制。
- **Webhook**：通过远程服务器进行授权决策。

RBAC 是 Kubernetes 中最常用的授权机制，它允许管理员创建精细的权限策略，将权限分配给用户、组或服务账户。RBAC 通过定义角色（Role）和集群角色（ClusterRole），以及将这些角色分配给用户的机制来实现。

在 Kubernetes 中，认证和授权通常一起工作，以确保用户和系统能够安全地访问和管理集群资源。管理员需要根据组织的安全需求和最佳实践来配置这些机制。

#### 5.1.3.3 废弃 API 说明

在 Kubernetes 中，API 版本遵循语义版本控制（Semantic Versioning），通常表示为 `MAJOR.MINOR.PATCH` 的形式。随着 Kubernetes 的发展，某些 API 可能会被标记为废弃（Deprecated），这意味着这些 API 将在未来的版本中被移除或替换。以下是废弃 API 的一些说明：

1. **废弃的阶段**：
   - Kubernetes 通常会在 API 被完全移除前的几个版本中标记 API 为废弃。
   - 废弃的 API 通常会经历几个阶段，如 "Deprecated"、"Removed in upcoming release" 等。

2. **废弃的原因**：
   - API 可能因为安全问题、性能问题、更好的替代方案出现或不符合设计原则而被废弃。
   - 废弃也可能是为了简化 API 表面或推动用户迁移到更稳定、更安全、更高效的 API。

3. **废弃的通告**：
   - Kubernetes 社区会在发布新版本时，通过官方文档、博客、邮件列表等方式通告 API 的废弃信息。
   - 用户可以通过 Kubernetes 的官方文档或 API 文档来查找有关 API 废弃的详细信息。

4. **废弃的 API 的使用**：
   - 即使 API 被标记为废弃，它可能仍然在当前版本中可用，但社区强烈建议用户停止使用并迁移到推荐的替代 API。
   - Kubernetes 通常会提供迁移指南和工具，以帮助用户平滑过渡到新的 API。

5. **替代方案**：
   - 当 API 被废弃时，Kubernetes 会推荐使用新的 API 版本或不同的 API 来实现相同的功能。
   - 用户应该根据官方文档的指导，评估替代方案并进行必要的代码和配置更新。

6. **社区反馈**：
   - 用户可以通过 Kubernetes 的社区渠道，如 GitHub 仓库、邮件列表、论坛等，提供关于废弃 API 的反馈和建议。

7. **长期支持（LTS）版本**：
   - 对于需要长期稳定运行的环境，用户可能会选择使用 Kubernetes 的长期支持版本，这些版本通常会有更长的支持周期和更慢的 API 更新速度。

废弃 API 是 Kubernetes 发展过程中的一个自然现象，它有助于推动技术的进步和维护生态系统的健康。用户应该密切关注 Kubernetes 的更新和通告，以确保他们的应用程序和集群配置能够适应这些变化。

### 5.1.4 深入 Pod

#### 5.1.4.1 Pod 配置文件

以一个 nginx 的 pod demo 的配置文件为例：

```yml
apiVersion: v1 #Api 文档版本
kind: Pod # 资源对象类型，Deployment，Statefulset等
metadata: #Pod相关元数据，描述Pod信息
    name: nginx-demo #定义Pod的名称
    labels: #定义Pod的标签
      type: app # 自定义的label标签
      version: 1.0.0 # 自定义的版本号
    namespace: 'web' # 命名空间配置
spec: # 期望 Pod 按照这里的描述进行创建
  containers: # 对于pod中容器的描述
  - name: nginx # 容器的名称
    image: nginx:1.7.9 # 可拉取得镜像名称
    imagePullPolicy: IfNotPresent # 镜像拉取策略：本地有则用无责拉取远程
    command: # 指定容器启动时执行的命令
    - nginx
    - -g
    - 'daemon off;' #nginx -g 'daemon off;'
    workingDir: /usr/share/nginx/html # 定义容器启动后的工作目录
    ports:
    - name: http # 端口名称
      containerPort: 80 # 容器内要暴露的端口
      protocol: TCP # 端口通信协议
    env: # 环境变量
    - name: JVM_OPTS # 环境变量名称
      value: 'Xms128m -Xmx128m' # 环境变量值
    
    resources:
        requests: # 最少需要的资源
          cpu: 100m # 限制cpu最少使用100毫核，0.1核心
          memory: 128Mi # 限制内存最少使用128M
        limits:
          cpu: 200m # 限制cpu最多使用200毫核，0.2核心
          memory: 256Mi # 限制内存最多使用256M

  restartPolicy: OnFailure # 重启策略，非正常退出运行失败时进行重启
```

#### 5.1.4.2 探针

容器内应用的监视机制，根据不同的探针来判断容器应用当前的状态

##### 5.1.4.2.1 类型

1. StartupProbe
   k8s 1.16 版本新增的深针，用于判断应用程序是香已经启动了。当配置了 startupProbe 后，会先禁用其他探针，直到 startupProbe 成功后，其他探针才会继续。
作用：由于有时候不能准确预估应用一定是多长时间启动成功，因比配置另外两种方式不方便配置初始化时长来检测，而配置了 statupProbe 后，只有在应用启动成功了，才会执行另外两种探针，可以更加方使的结合使用另外两种探针使用。

```yaml
startupProbe:
	httpGet:
		path: /api/startup
		port: 80
```

2. LivenessProbe
   用于深测容器中的应用是否运行，如果探测失败，kubelet 会根据配置的重启策路进行重启，若没有配置，默认就认为容器启动成功，不会执行重启策略。

```yaml
livenessProbe:
	failureThreshold: 5
	httpGet:
		path: /health
		port: 8080
		scheme: HTTP
	initialDelaySeconds: 60
	periodSeconds: 10
```

3. ReadinessProbe
用于探测容器内的程序是否健康，它的返回值如果返回 success，那么认为该容器已经完全启动，并且该容器是可以接收外部流量的。

```yaml
readinessProbe:
	failureThreshold: 3 #错误次数
	httpGet:
		path: /ready
		port: 8181
		scheme: HTTP
	periodSeconds: 10 #间隔时i间
	successThreshold: 1
```

##### 5.1.4.2.2 探测方式

1. ExecAction
   在容器内部执行一个命令，如果返回值为 0，则认为容器是健康的。

```yml
livenessProbe:
exec:
	command:
		- cat
		- ·/health
```

2. TCPSocketAction
   通过 tcp 连接监测容器内端口是否开放，如果开放则证明该容器健康。

```yml
livenessProbe:
	tcpSocket:
		port: 80
```

3. HTTPGetAction
生产环境用的较多的方式，发送 HTTP 请求到容器内的应用程序，如果接口返回的状态码在 200~400 之间，则认为容器健康。(eg: java 应用)

```yml
livenessProbe:
	failureThreshold: 5
	httpGet:
		path: /health
		port: 8080
		scheme: HTTP
		httpHeaders:
			- name: xxx
			- value: xxx
```

##### 5.1.4.2.3 参数配置

- initialDelaySeconds: 60 #初始化时间 （写死了，不确定）
- timeoutSeconds: 2 #超时时间
- periodSeconds: 5 #间隔时间
- successThreshold: 1 #检查1次成功就表示成功
- failureThreshold: 2 #监测失败2次就表示失败

#### 5.1.4.3 生命周期

![](https://qnpicmap.fcsluck.top/pics/202407291453761.png)
方向：从左到右，从上到下。

##### 5.1.4.3.1 Pod 退出流程

1. Endpoint 别除 pod 的 ip 地址
2. Pod 变成 Terminating 状态
   变为删除中的状态后，会给 pod 一个宽限期，让 pod 去执行一些清理或销毁操作。
配置参数：
#作用与pod中的所有容器
terminationGracePeriodSeconds: 30
containers:
    - xxx
3. 执行 preStop 钩子函数

##### 5.1.4.3.2 PreStop 的应用

1. 注册中心下线
2. 数据清理
3. 数据销毁

### 5.1.5 资源调度

#### 5.1.5.1 Label 和 Selector

##### 5.1.5.1.1 标签(Label)

###### 配置文件

在名类资源的 `sepc.metadata.labels` 中进行配置

###### Kubectl

临时创建 label：`kubectl label po <资源名称> app=hello -n <命名空间>`
修改已经存在的标签：
1. `kubectl label po <资源名称> app=hello -n <命名空间> --overwrite`
2. `kubectl edit po <资源名称> -n <命名空间>`，修改 label 配置
查看 label：`kubectl get po -n <命名空间> --show-labels`

##### 5.1.5.1.2 选择器(Selector)

###### 配置文件

在各对象的配置 spec.selector 或其他可以写 selector 的属性中编写

###### Kubectl

1. 单值匹配：`kubectl get po -n web -l type=app`
2. 介于匹配：`kubectl get po -n web -l 'version in (1.0.0,1.1.0,1.2.0)' --show-labels`
3. 多值匹配（与的关系）：`kubectl get po -n web -l version!=1.2.0,type=app --show-labels`
4. 混合匹配：`kubectl get po -n web -l 'target!=cs,type=app,version in (1.0.0,1.1.0,1.2.0)' --show-labels`

#### 5.1.5.2 Deployment

##### 5.1.5.2.1 功能

###### 创建

创速-个 deployment

```sh
kubectl create deploy nginx-deploy --image=nginx:1.7.9
```

或执行

```sh
kubectl create -f xxx.yaml --record
```

> --record 会在 annotation 中记录当前命令创建或升级了资源，后续可以查看做过哪些变动操作

查看部署信息

```sh
kubectl get deployments
```

查看 rs

###### 滚动更新

*一个 deployment 多个 replicaset 对应多个 pod*，**修改 pod 配置后就会进行滚动更新**（`只修改deployment配置并不会出发滚动更新`），根据滚动更新策略（eg：新增后删除：先新建一个新的 replicaset 然后新建一个与之关联的 pod，然后对旧 replicaset 的 pod 缩容删除一个，循环此过程直到所有旧的 pod 全部删除，新的 replicaset 里含有等量的新 pod）

多个滚动更新并行：**多个滚动更新并发时新的更新会覆盖旧的更新，旧的更新失效，新的更新依旧对最原始的 deployment 进行更新**。

###### 回滚

有时候你可能想回退一个 Deployment,例知，当 Deployment 不稳定时，比如一直 crash looping.
默认情况下，kubernetes 会在系统中保存前两次的 Deployment 的 rollout 历史记录，以便你可以随时会退（你可以修改 revision history limit 来更改保存的 revision 数)。

案例：
更新 deployment 时参数不小心写错，如 nginx:1.9.1 写成了 nginx:1.91
`kubectl set deployment/nginx-deployment nginx=nginx:1.91`
监控滚动升级状态，由于镜像名称错误，下载镜像失败，因此更新过程会卡住
`kubectl rollout status deployments nginx-deployment`
查看历史滚动更新的 deploy 的版本：
`kubectl rollout history deployment/nginx-deploy`
查看历史版本信息：
`kubectl rollout history deployment/nginx-deploy --revision=2`
回退到指定版本：
`kubectl rollout undo deployment/nginx-deploy -n app --to-revision=2`

> [!Warning] 注意
> 可以通过设置 `spec.revisonHistoryLimit`，来指定 deployment 保留多少 revison，如果设置为*0*，则不允许 deployment 回退了.

###### 扩容缩容

通过 kube scale 命令可以进行自动扩容/缩容，以及通过 kube edit 编辑 repli cas 也可以实现扩容/缩容
扩容与缩容只是直接创建副本数，没有更新 pod template 因此不会创建新的 rs

```bash
subectl scale replicas=3 deploy nginx-deploy
```

###### 暂停与恢复

由于每次对 pod template 中的信息发生修改后，都会触发更新 deployment 操作，那么此时如果频繁修改信息，就会产生多次更新，而实际上只需要执行最后一次更新即可，当出现此类情况时我们就可以暂停 deployment 的 rollout
通过 `kubectl rollout pause deployment<name>` 就可以实现暂停，直到你下次恢复后才会继续进行滚动更新
尝试对容器进行修改。然后查看是否发生更新操作了

```bash
kubectl set image deploy <name> nginx=nginx:1.17.9
kubectl get po
```

通过以上操作可以看到实际并没有发生修改，此时我们再次进行修改一些属性，如限制 nginx 容器的最大 cpu 为 0.2 核，最大内存为 128M,最小内存为 64M,最小 cpu 为 0.1 核

```bash
kubectl set resources deploy <deploy_name> -c <container_name> --limits=cpu=200m,memory=128Mi --requests=cpu100m,memory=64Mi
```

通过格式化输出 `kubectl get deploy <name> -oyaml`, 可以看到配置确实发生了修改，再通过 `kubectl get po` 可以看到 pod 没有被更新

1. 暂停：`kubectl rollout pause deploy nginx-deploy`
2. 恢复：`kubectl rollout resume deploy nginx-deploy`

##### 5.1.5.2.2 配置文件

#### 5.1.5.3 StatefulSet

##### 5.1.5.3.1 功能

###### 创健

```yaml
---
apiversion: v1 # 版本号
kind: Service # Service类型的资源
metadata:
	name: nginx # Service 对象名称
	labels: 
		app: nginx # 标签
spec:
	ports:
	- port: 80 # 对外端口号
	  name: web # 端口名称
	clusterIP: None # 集群IP
	selector: 
		app: nginx # 选择器
---
apiVersion: apps/v1 # 版本号
kind: StatefulSet # StatefulSet类型的资源
metadata:
	name: web # StatefulSet对象的名字
spec:
	serviceName: "nginx" # 使用哪个service来管理
	replicas: 2
	selector:
		matchLabels:
			app: nginx
	template: # pod模板
		metadata:
			labels:
				app: nginx
	spec: # 规格
		containers:
		- name: nginx # 容器名称
		  image: nginx:1.7.9 # 镜像名称和版本
		  ports: # 容器内部要暴露的端口
		  - containerPort: 80 # 具体暴露的端口号
			name: web # 端口名称
		  volumeMounts: # 加载存储卷
		  - name: www # 指定加载哪个数据卷
				mountPath: /usr/share/nginx/html # 加载到容器中的哪个目录
	volumeclaimTemplates: # 数据卷模板
	  - metadata: # 数据卷描述
			name: www # 数据卷名称
				annotations: #数据卷注解
					volume.alpha.kubernetes.io/storage-class: anything
		spec: # 数据卷期望配置（规约）
			accessModes: ["ReadWriteOnce"] # 访问模式
			resources:
				requests:
					storage: 1Gi # 请求1G存储资源
```

###### 扩容缩容

1. 扩容

```sh
kubectl scale statefulset web --replicas=5
```

1. 缩容

```sh
kubectl patch statefulset web -p '{"spec":{"replicas":3}}'
```

###### 镜像更新

```sh
kubectl patch statefulset web --type='json' -p='[{"op": "replace",
"path": "/spec/template/spec/containers/0/image",
"value": "nginx:1.9.1"}]'
```

1. **RollingUpdate -->灰度发布**

利用滚动更新中的 `partition` 属性，可以实现简易的灰度发布效果。

> 例如我们有 5 个 pod，如果当前 partition 设置为 3，那么此时滚动更新时，只会更新那些序号 `>= 3 的 pod`
利用该机制，找们可以通过控制 partition 的值，来决定只更新其中一部分 pod，确认设有问题后再主健增大更新的 pod 数量，最将实现全部 pod 更新。

###### 金丝雀发布/灰度发布

**灰度发布**和**金丝雀发布**都是指在软件开发和运维中，分阶段将新版本或新功能发布给用户，以减少风险和确保系统的稳定性。这两种发布策略通常用于快速发现问题并将影响控制在较小范围内。

---

1. **灰度发布**
灰度发布，也称渐进发布，是指将新版本分阶段发布给用户群体，逐步扩大使用范围。这样可以通过观察和收集一部分用户的反馈来判断是否存在问题，并避免一次性发布给所有用户带来的风险。

**特点：**
- **控制范围**：通过用户群体的逐步扩展控制风险范围。
- **受控发布**：新功能逐步对更大范围的用户开放，可以提前识别潜在问题。
- **版本回滚**：如果出现问题，可以及时回滚版本，影响较小。

**应用场景**：
适用于新功能不确定是否会影响系统稳定性的场景，尤其是用户规模较大的系统。

---

2. **金丝雀发布**
金丝雀发布（Canary Release）源自煤矿工人在矿井放置金丝雀的做法，以测试矿井空气是否安全。它指的是在发布新版本时，先让一小部分用户使用新版本，类似于灰度发布，但通常用户范围较小，常被称为“试水”。

**特点：**
- **小范围验证**：仅对少数用户（如测试用户或早期用户）开放，以验证新版本的稳定性。
- **动态调整**：如果小范围用户反馈良好，可以逐步扩大范围。
- **灵活性强**：比灰度发布更加保守，但灵活性更高。

**应用场景**：
适合高风险功能的发布，比如涉及核心业务、用户数量大、系统复杂的场景。

**区别**：
- 灰度发布通常是逐步扩大用户群体，持续进行不同阶段的测试；金丝雀发布则偏向于初期的小范围验证。
- 金丝雀发布通常风险更小，用户数量受控严格，灰度发布在成功后会逐步推广到全量用户。

总的来说，这两种方法都旨在降低发布新版本的风险，确保系统的稳定性和用户体验。

---

2. OnDelete

更新策略为（UpdateStrategy：OnDelete）时，只有当删除 pod 后才进行更新。

###### 删除

1. 删除 statefulset 和 Headless Service
   级联删除：删除 statefulset 时会同时删除 pods

```bash
kubectl delete statefulset web
```

非级联删除：删除 statefulset 时不会删除 pods，删除 sts 后，pod：

```bash
kubectl deelte sts web --cascade=false
```

2. 删除service

```bash
kubectl delete service nginx
```

###### 删除 Pvc

StatefulSet删除后PVC还会保留，数据不再使用的话也需要删除

```bash
kubectl delete pvc www-web-0 www-web-1
```

##### 5.1.5.3.2 配置文件

```yml
---
apiversion: v1 # 版本号
kind: Service # Service类型的资源
metadata:
	name: nginx # Service 对象名称
	labels: 
		app: nginx # 标签
spec:
	ports:
	- port: 80 # 对外端口号
	  name: web # 端口名称
	clusterIP: None # 集群IP
	selector: 
		app: nginx # 选择器
---
apiVersion: apps/v1 # 版本号
kind: StatefulSet # StatefulSet类型的资源
metadata:
	name: web # StatefulSet对象的名字
spec:
	serviceName: "nginx" # 使用哪个service来管理
	replicas: 2
	selector:
		matchLabels:
			app: nginx
	template: # pod模板
		metadata:
			labels:
				app: nginx
	spec: # 规格
		containers:
		- name: nginx # 容器名称
		  image: nginx:1.7.9 # 镜像名称和版本
		  ports: # 容器内部要暴露的端口
		  - containerPort: 80 # 具体暴露的端口号
			name: web # 端口名称
		  volumeMounts: # 加载存储卷
		  - name: www # 指定加载哪个数据卷
				mountPath: /usr/share/nginx/html # 加载到容器中的哪个目录
	volumeclaimTemplates: # 数据卷模板
	  - metadata: # 数据卷描述
			name: www # 数据卷名称
				annotations: #数据卷注解
					volume.alpha.kubernetes.io/storage-class: anything
		spec: # 数据卷期望配置（规约）
			accessModes: ["ReadWriteOnce"] # 访问模式
			resources:
				requests:
					storage: 1Gi # 请求1G存储资源
```

---

#### 5.1.5.4 DaemonSet

> 作用：为每一个匹配的Node都部署一个守护进程。



# 6 📖参考文献

1. [Kubernetes-win-useage](https://www.yuque.com/xiaoguai-pbjfj/cxxcrs/ocefqltbmbgl5eqg?singleDoc#%20%E3%80%8AKubernetes%E3%80%8B)
2. [Kubernetes一小时入门课程 - 视频配套笔记 | GeekHour](https://geekhour.net/2023/12/23/kubernetes/)
3. [Kubernetes一小时轻松入门\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1Se411r7vY/?spm_id_from=333.788.recommend_more_video.2&vd_source=9c896fa9c3f9023797e8efe7be0c113e)
4. [Kubernetes（K8S）全套入门+微服务实战项目，带你一站式深入掌握K8S核心能力](https://www.bilibili.com/video/BV1MT411x7GH)
5. [【Linux】为 VMware 的 Linux 系统（CentOS 7）设置静态IP地址-CSDN博客](https://blog.csdn.net/m0_50513629/article/details/139055933)
6. [Kubernetes 安装部署(国内源)-阿里云开发者社区](https://developer.aliyun.com/article/1147479#:~:text=%E5%A4%8D%E5%88%B6%E6%89%A7%E8%A1%8C%E5%8D%B3%E5%8F%AF%20%E5%AE%89%E8%A3%85%E4%BE%9D%E8%B5%96%E5%8C%85%2C%E6%B7%BB%E5%8A%A0docker%E6%BA%90%E4%BB%93%E5%BA%93%2C%E5%AE%89%E8%A3%85%2C%E5%90%AF%E5%8A%A8%2C%E6%B7%BB%E5%8A%A0%E5%BC%80%E6%9C%BA%E5%90%AF%E5%8A%A8%2C%E6%9F%A5%E7%9C%8B%E7%89%88%E6%9C%AC%EF%BC%88%E9%AA%8C%E8%AF%81%E6%98%AF%E5%90%A6%E5%AE%89%E8%A3%85%E6%88%90%E5%8A%9F%EF%BC%89%20yum%20install%20yum-utils%20-y,%26%26%20%20yum-config-manager%20--add-repo%20http%3A%2F%2Fmirrors.aliyun.com%2Fdocker-ce%2Flinux%2Fcentos%2Fdocker-ce.repo%20%26%26%20%5C)
