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

# 2. LeetCode

## 1. 两数之和


```c++
import java.util.HashMap;  
  
class Solution {  
public int[] twoSum(int[] nums, int target) {  
HashMap<Integer, Integer> storeNums = new HashMap<Integer, Integer>(nums.length);  
int[] results = new int[2];  
for (int i = 0; i < nums.length; i++) {  
int residue = target - nums[i];  
Integer index = storeNums.get(residue);  
if (index != null) {  
results[0] = index;  
results[1] = i;  
break;  
} else {  
storeNums.put(nums[i], i);  
}  
}  
return results;  
}  
  
};  
//runtime:1 ms  
//memory:42.6 MB

```


## 2. 合并两个有序数组


```c++
//leetcode submit region begin(Prohibit modification and deletion)  
#include<bits/stdc++.h>  
using namespace std;  
class Solution {  
public:  
// 方法1（直插排序法）  
void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {  
auto iter1 = nums1.begin()+m;  
auto iter2 = nums1.end();  
nums1.erase(iter1,iter2);  
for (int i = 0; i < n; ++i) {  
nums1.push_back(nums2[i]);  
}  
// nums1.erase(iter1,iter2);  
// nums1.insert(nums1.end(),nums2.begin(),nums2.end());  
sort(nums1.begin(), nums1.end());  
}  
//方法2（前向双指针法）  
void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {  
int l = m+n,j=0,index1 = 0,index2 = 0;  
vector<int> temp(l);  
for (int i = 0; i < l; ++i) {  
if (index1>=m){  
temp[i]=nums2[index2++];  
}  
else if(index2>=n){  
temp[i]=nums1[index1++];  
}  
else if(nums1[index1]<nums2[index2]){  
temp[i]=nums1[index1++];  
}  
else {  
temp[i]=nums2[index2++];  
}  
}  
for(int item:temp){  
nums1[j++]=item;  
}  
}  
//方法3（反向双指针）  
void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {  
int l = m+n,index1 = m-1,index2 = n-1;  
for (int i = l-1; i >= 0; i--) {  
if (index1<0){  
nums1[i]=nums2[index2--];  
}  
else if(index2<0){  
// nums1[i]=nums1[index1--];  
break;  
}  
else if(nums1[index1]>=nums2[index2]){  
nums1[i]=nums1[index1--];  
}  
else {  
nums1[i]=nums2[index2--];  
}  
}  
}  
};  
//leetcode submit region end(Prohibit modification and deletion)

```

## 3. 移动零


```c++
//双指针
#include<vector>  
  
using namespace std;  
class Solution {  
public:  
void moveZeroes(vector<int>& nums) {  
if(!nums.size()){  
return;  
}  
int j = 0;  
for(int item:nums){  
if (item!=0)  
nums[j++]=item;  
}  
while (j<nums.size()){  
nums[j++]=0;  
}  
}  
};
```


## 4. 找到所有数组中消失的数字


```c++
/、
#include<vector>  
using namespace std;  
//leetcode submit region begin(Prohibit modification and deletion)  
class Solution {  
public:  
vector<int> findDisappearedNumbers(vector<int>& nums) {  
vector<int> disnums;  
// for(int item:nums){  
// item = item>0 ? item : -item;  
// nums[item-1] = nums[item-1]>0 ? nums[item-1] : -nums[item-1];  
// nums[item-1]=-nums[item-1];  
// }  
// for(int i=0;i<nums.size();i++){  
// if (nums[i]>0)  
// disnums.push_back(i+1);  
// }  
int n = nums.size();  
for(int item:nums){  
int x = (item-1)%n;  
nums[x]+=n;  
}  
for(int i=0;i<n;i++){  
if (nums[i]<=n)  
disnums.push_back(i+1);  
}  
return disnums;  
}  
};

```
