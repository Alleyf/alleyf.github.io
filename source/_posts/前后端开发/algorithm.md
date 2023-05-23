---
title: algorithm  
date: 2023-03-17 19:06:15  
tags: [Algorithm]  
sticky: 55
excerpt: some solutions about common algorithms
---
# 1. 基础知识
## 递归
***自顶向下递归
自底向上迭代
***

> 问题特点
> 1. 一个问题的解可以**分解为几个子问题**的解。
> 2. 这个问题与分解之后的子问题，**除了数据规模不同，求解思路完全一样**。
> 3. **存在基线终止条件**。

爬楼梯问题：
![image.png|200](https://s2.loli.net/2023/05/22/tcH9QJ726li3Rng.png)

解法 1：纯递归

```java
class Solution {
private Map<Integer , Integer> storeMap = new HashMap<>();
public int climbStairs(int n) {
if(n == 1) return 1;
if(n == 2) return 2;
else{
return climbStairs(n-1)+climbStairs(n-2);

```

解法 2：递归并采用 HashMap 存储已求值
```java
class Solution {
private Map<Integer , Integer> storeMap = new HashMap<>();
public int climbStairs(int n) {
if(n == 1) return 1;
if(n == 2) return 2;
if(null != storeMap.get(n))
return storeMap.get(n);
else{
int result = climbStairs(n-1)+climbStairs(n-2);
storeMap.put(n,result);
return result;

```

解法 3：迭代自底向上循环累加

```java
public int climbStairs(int n) {
if(n == 1) return 1;
if(n == 2) return 2;
int result = 0;
int pre = 2;
int prePre = 1;
for(inti=3;i<=n;++i){
result = pre + prePre;
prePre = pre;
pre = result;
}
return result;
}


```

总结：
> <span style="background:rgba(240, 107, 5, 0.2)">对于多次重复出现的值，可以通过 HashMap 存储，后续先扫描 HashMap 是否存在再做行动。</span>

