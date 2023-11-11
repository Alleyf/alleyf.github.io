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

1. redis 本地安装好需要修改配置文件设置 requirepass `password` 密码，才可以在 idea 里远程连接使用
2. vue 中的 form 表单一定要动态绑定 `:model`，如果添加了字段验证 `:rules`，还必须为每个 `el-form-item` 指定 `prop` 为 `model` 的键
3. 