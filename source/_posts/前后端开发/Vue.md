---
title: 初识Vue
tags: [vue]
categories: Front_end_development
date: 2023-04-16 16:29:16
sticky: 75
excerpt: it is some basic usage of vue.
---
# 生命周期函数

| 生命周期钩子函数 | 实例处于阶段 | 描述                                                                                  | 能否获取到 el(this.$el) | 能否获取到 data (this.xxx) | 能否使用 methods 中的方法 (this.xxx()) |
| ---------------- | ------------ | ------------------------------------------------------------------------------------- | ----------------------- | -------------------------- | -------------------------------------- |
| beforeCreate     | 创建前       | 实例已初始化，但数据观测，watch/event 事件回调还未配置                                | 获取不到                | 不能                       | 不能                                   |
| created          | 创建后       | 已完成如下配置，数据观测 (data observer)，property 和方法的运算，watch/event 事件回调 | 获取不到                | 能                         | 能                                     |
| beforeMount      | 挂在前             |                                                                                       |                         |                            |                                 