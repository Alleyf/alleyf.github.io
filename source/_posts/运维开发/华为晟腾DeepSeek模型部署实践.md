---
title: 华为晟腾DeepSeek模型部署实践
date: 2025-02-26 09:08:46
tags:
  - DeepSeek
  - LLM
sticky: 80
excerpt: 
author: fcs
index_img: https://picsum.photos/800/250
lang: zh-CN
number headings: auto, first-level 1, max 5, start-at 1, 1.1
---

![](https://picsum.photos/800/250)

# 1 环境准备

推荐参考配置如下，部署DeepSeek-V3/R1量化模型至少需要多节点Atlas 800I A2（8*64G）服务器。本方案以DeepSeek-R1为主进行介绍，DeepSeek-V3与R1的模型结构和参数量一致，部署方式与R1相同。

![|475](https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20250226091008107.png)

# 2 免责说明

本博客的部分内容来源于互联网公开资料，包括但不限于文章、图片、视频、音频等素材。这些素材的版权归原作者或版权持有人所有。本博客引用这些素材的目的在于分享知识、传播信息，并非用于商业用途。

## 2.1 引用原则

1. **非商业用途**：本博客为个人非商业性质，所有引用的素材仅用于学习和交流目的。
2. **注明来源**：在引用他人素材时，我会尽量注明出处或来源链接。如果因疏忽未能标注，请联系我，我会及时补充或删除相关内容。
3. **尊重版权**：如果您是相关素材的版权持有人，认为本博客的内容侵犯了您的权益，请通过以下联系方式与我联系，我会第一时间核实并处理。

## 2.2 联系方式

如果您对本博客的内容有任何疑问或建议，或认为某些内容侵犯了您的合法权益，请通过以下方式联系我：
- 邮箱：alleyf@qq.com

## 2.3 免责条款

1. 本博客引用的互联网资料仅供学习和参考，不保证其准确性、完整性或时效性。
2. 对于因使用或引用本博客内容而导致的任何直接或间接损失，本博客不承担任何责任。
3. 本博客保留对免责声明的最终解释权。

感谢您的理解与支持！

# 3 参考来源

1. [DeepSeek-R1-模型库-ModelZoo-昇腾社区](https://www.hiascend.com/software/modelzoo/models/detail/68457b8a51324310aad9a0f55c3e56e3)
2. [DeepSeek-R1 昇腾910B满血版部署避坑指南](https://zhuanlan.zhihu.com/p/24200409101)
3. [华为昇腾 910B 部署 DeepSeek-R1 蒸馏系列模型详细指南-CSDN博客](https://blog.csdn.net/MnivL/article/details/145685134)
4. [DeepSeek模型权重下载太慢？快来魔乐体验加速丝滑下载，和“龟速”说拜拜 \| 社区动态 \| 魔乐社区](https://modelers.cn/updates/zh/modelers/20250213-deepseek%E6%9D%83%E9%87%8D%E4%B8%8B%E8%BD%BD/)
5. [训练-华为 NPU 适配 - LLaMA Factory](https://llamafactory.readthedocs.io/zh-cn/latest/advanced/npu.html#id11)
6. [训练-全流程昇腾实践 — 昇腾开源 文档](https://ascend.github.io/docs/sources/llamafactory/example.html)
7. [部署-昇腾DeepSeek模型部署优秀实践及FAQ](https://mp.weixin.qq.com/s/OA2tfvChRB9fektSI7xWUw)
8. [部署-Ascend/ModelZoo-PyTorch](https://gitee.com/ascend/ModelZoo-PyTorch/tree/master/MindIE/LLM/DeepSeek/DeepSeek-R1#deepseek-r1)
9. [部署-Welcome to vLLM Ascend Plugin — vllm-ascend](https://vllm-ascend.readthedocs.io/en/latest/)
10. [对话-GitHub - open-webui/open-webui: User-friendly AI Interface (Supports Ollama, OpenAI API, ...)](https://github.com/open-webui/open-webui)
11. [对话-GitHub - infiniflow/ragflow: RAGFlow is an open-source RAG (Retrieval-Augmented Generation) engine based on deep document understanding.](https://github.com/infiniflow/ragflow)
12. [对话-GitHub - CherryHQ/cherry-studio: 🍒 Cherry Studio is a desktop client that supports for multiple LLM providers. Support deepseek-r1](https://github.com/CherryHQ/cherry-studio)