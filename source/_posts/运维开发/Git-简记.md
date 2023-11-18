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


# 原理解析

## 工作流程
git 分为三个区，工作流程如下：

![image.png](http://qnpicmap.fcsluck.top/pics/202311162202035.png)

## 文件状态

git 文件有四种状态：
1. 未跟踪：创建但未被 git 管理的文件
2. 未修改：被管理但未修改的文件
3. 已修改：修改后未添加到暂存区的文件
4. 已暂存：添加到暂存区的文件
![image.png](http://qnpicmap.fcsluck.top/pics/202311162206125.png)


# 安装和初始化配置

## 安装

> [git官方地址](https://git-scm.com/)：按需下载对应自己**电脑操作系统**的版本。



## 初始化

查看 git 版本：

```git
git -v
```

![image.png|500](http://qnpicmap.fcsluck.top/pics/202311162135814.png)

首次安装 git 使用以下命令配置全局仓库用户名和邮箱信息：

```git
git config --global user.name "Jasper Yang"  #设置用户名
git config --global user.email geekhall.cn@gmail.com #设置密码
git config --global credential.helper store #保存上述信息
```

查看/清除全局配置信息：

```
git config --global --list #查看
git config --global --unset <entry-name> #清除全局配置
```

![image.png](http://qnpicmap.fcsluck.top/pics/202311162140448.png)

查看隐藏的. git 文件：

![](http://qnpicmap.fcsluck.top/pics/202311162146376.png)

清除隐藏的. git 文件则 git 仓库将被清除：
![image.png](http://qnpicmap.fcsluck.top/pics/202311162149713.png)


# 基础操作
## 创建 git 仓库

### 本地初始化
在本地需要创建 git 仓库的文件夹下打开 **git bash** 执行以下命令：

```git
git init （init_repo_dir_name）#后面可选在当前目录新建目录作为git仓库
```
### 远程克隆

```git
git clone https://github.com/Alleyf/linux-tutorial.git
```

![image.png](http://qnpicmap.fcsluck.top/pics/202311162159698.png)

## 查看仓库状态

```shell
git status
git ls-files #查看暂存区的文件
```

查看状态：
![image.png|575](http://qnpicmap.fcsluck.top/pics/202311162220832.png)
查看暂存区内容：
![|575](http://qnpicmap.fcsluck.top/pics/202311180014236.png)
## 连接云端仓库

![image.png|575](http://qnpicmap.fcsluck.top/pics/202311162229748.png)

添加一个 git URL 作为别名

```shell
git remote add [alias] [url]
```

显示您设置的远程存储库的名称

```shell
git remote
```

显示远程存储库的名称和 URL

```shell
git remote -v
```

删除远程存储库

```shell
git remote rm [remote repo name]
```

更改 git repo 的 URL

```shell
git remote set-url origin [git_url]
```

## 同步仓库文件
### 拉取仓库

```shell
git pull
```
### 提交文件

```shell
git add fileName/.  #"."代表添加当前文件夹下的全部文件到存储区
```

![image.png](http://qnpicmap.fcsluck.top/pics/202311162233770.png)

```shell
git commit -m "提交时的备注信息"
```

git commit 只会提交**存储区中的文件到仓库**，**未跟踪即未添加到存储区的文件不会被提交**到仓库，如下 file 2.md 是新增未跟踪的文件不会被同 file1.md 提交到仓库:
![image.png](http://qnpicmap.fcsluck.top/pics/202311162235693.png)

```shell
git push "远程库名" 
```


## 查看记录

查看提交记录：
```shell
git log
```
![|525](http://qnpicmap.fcsluck.top/pics/202311162257259.png)

查看历史记录：
```shell
git reflog
```

![image.png|525](http://qnpicmap.fcsluck.top/pics/202311180021976.png)


## 回退/溯版本

git reset有三种模式：

```shell
git reset --soft 版本号 #回退版本后的内容保留工作区和暂存区
git reset --hard 版本号 #都不保留
git reset --mixed 版本号 #仅保留工作区内容
```

![image.png](http://qnpicmap.fcsluck.top/pics/202311180007484.png)

不同模式，工作区和暂存区的内容会不同。

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




# 参考文献

```cardlink
url: https://www.bilibili.com/video/BV1HM411377j/
title: "【GeekHour】一小时Git教程_哔哩哔哩_bilibili"
description: "【GeekHour】一小时Git教程共计19条视频，包括：01.课程简介、02.安装和初始化配置、03.新建仓库等，UP主更多精彩视频，请关注UP账号。"
host: www.bilibili.com
image: //i0.hdslb.com/bfs/archive/be265386c6db1da0e1233e9743e02b252ea07b53.jpg@100w_100h_1c.png
```
1. [【GeekHour】一小时Git教程\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1HM411377j/)
```cardlink
url: https://wangchujiang.com/reference/docs/git.html
title: "Git 备忘清单 &  git cheatsheet &  Quick Reference"
host: wangchujiang.com
favicon: data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%221em%22%20width%3D%221em%22%3E%20%3Cpath%20d%3D%22m21.66%2010.44-.98%204.18c-.84%203.61-2.5%205.07-5.62%204.77-.5-.04-1.04-.13-1.62-.27l-1.68-.4c-4.17-.99-5.46-3.05-4.48-7.23l.98-4.19c.2-.85.44-1.59.74-2.2%201.17-2.42%203.16-3.07%206.5-2.28l1.67.39c4.19.98%205.47%203.05%204.49%207.23Z%22%20fill%3D%22%23c9d1d9%22%2F%3E%20%3Cpath%20d%3D%22M15.06%2019.39c-.62.42-1.4.77-2.35%201.08l-1.58.52c-3.97%201.28-6.06.21-7.35-3.76L2.5%2013.28c-1.28-3.97-.22-6.07%203.75-7.35l1.58-.52c.41-.13.8-.24%201.17-.31-.3.61-.54%201.35-.74%202.2l-.98%204.19c-.98%204.18.31%206.24%204.48%207.23l1.68.4c.58.14%201.12.23%201.62.27Zm2.43-8.88c-.06%200-.12-.01-.19-.02l-4.85-1.23a.75.75%200%200%201%20.37-1.45l4.85%201.23a.748.748%200%200%201-.18%201.47Z%22%20fill%3D%22%23228e6c%22%20%2F%3E%20%3Cpath%20d%3D%22M14.56%2013.89c-.06%200-.12-.01-.19-.02l-2.91-.74a.75.75%200%200%201%20.37-1.45l2.91.74c.4.1.64.51.54.91-.08.34-.38.56-.72.56Z%22%20fill%3D%22%23228e6c%22%20%2F%3E%20%3C%2Fsvg%3E
```
2. [Git 备忘清单 & git cheatsheet & Quick Reference](https://wangchujiang.com/reference/docs/git.html)




