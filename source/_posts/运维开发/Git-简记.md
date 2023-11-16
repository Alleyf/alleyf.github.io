---
title: Git-简记
date: 2023-11-16 17:29:36
tags:
  - Git
sticky: 85
excerpt: 一些关于 git 的常用操作。
author: fcs
---
![](https://picsum.photos/800/250)
# 基础操作
## 创建 git 本地仓库
在本地需要创建 git 仓库的文件夹下打开 **git bash** 执行 `git init`
## 连接云端仓库

## 拉取仓库

```shell
git pull
```
## 提交文件


```shell
git commit -m "提交时的备注信息"
```

```shell
git push "远程库名" 
```
# 分支

## 查询/切换/新建分支

1. 查询分支，使用以下指令：

```shell
git branch #查询本地分支
git branch -r #查询远程分支
```

2. 切换或新建分支，使用以下指令：

```shell
git chechout "branchName" #切换分支
git checkout -b "branchName" #新建分支并切换到该分支
```
## 分支合并
## 删除分支

1. 删除**本地分支**，删除前会进行检查是否*本分支内容已经合并到主分支*，使用以下指令：

```shell
git branch -d "branchName"
```

> 强制删除分支使用 `-D` 参数。

2. 删除**远程分支**，使用以下指令：

```shell
git push "远程库名" -d "branch name" 
```

> 强制删除分支使用 `-D` 参数。

