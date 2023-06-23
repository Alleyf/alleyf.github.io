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
//数组 哈希表
#include<vector>  
using namespace std;
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



## 5.


# 王道机试指南

## 1. 枚举
### 1.abc

**三重循环暴力求解**
```c++
#include<iostream>
using namespace std;
int main() {
    int a, b, c;
    for (a = 0; a <= 9; a++) {
        for (b = 0; b <= 9; b++) {
            for (c = 0; c <= 9; c++) {
                if ((a * 100 + b * 10 + c) + (b * 100 + c * 10 + c) == 532) {
                    printf("%d %d %d\n", a, b, c);
                }
            }
        }
    }
}
```

### 2. 反序数


```c++
#include <iostream>

using namespace std;

  

int main() {

    for (int i = 1000; 9 * i <= 9999; i++) {

        int k = 9 * i;

        if (k / 1000 == i % 10 && k % 1000 / 100 == i % 100 / 10 &&

                k % 100 / 10 == i % 1000 / 100 &&

                k % 10 == i / 1000) {

            printf("%d\n", i);

        }

    }

}

```

### 3. 对称平方数

判断一个数是否为对称数核心:
<font color="#ff0000">while (j) {</font>
<font color="#ff0000">sum = sum * 10 + j % 10;</font>
<font color="#ff0000">j /= 10;</font>
<font color="#ff0000">}</font>
<span style="background:#affad1">j 为对称数则 sum 等于 j\*j </span>
```c++
#include <iostream>

using namespace std;

  

int main() {

    for(int i = 0;i <= 256 ; i++) {

        int j = i * i, sum = 0;

        while(j) {

            sum = sum * 10 + j % 10;

            j /= 10;

        }

        if(sum == i * i) {

            cout << i << endl;

        }

    }

    return 0;

}

```

### 4. 与 7 无关的数

```c++
#include <iostream>

using namespace std;

  

int main() {

    int b, c, x, sum;

    cin >> x;

    for (int i = 0; i <= x; ++i) {

        b = i % 10;

        c = (i / 10) % 10;

        if (i % 7 != 0 && b != 7 && c != 7) {

            sum = sum + i * i;

        }

    }

    cout << sum << endl;

}

```

### 5. 百鸡问题


```c++
#include <iostream>

using namespace std;

  

int main() {

    int n;

    cin >> n;

    for (int x = 0; x <= 100; ++x) {

        for (int y = 0; y <= 100; ++y) {

            for (int z = 0; z <= 100; ++z) {

                if (x + y + z == 100 && ((5 * x + 3 * y + z / 3.0) <= n)) {

                    printf("x=%d,y=%d,z=%d\n", x, y, z);

                }

            }

        }

    }

}

```



### 6.Old Bill


```c++
#include <iostream>  
#include "title.h"  
  
using namespace std;  
  
  
int main() {  
int n, x, y, z;  
vector<int> buff;  
cin >> n;  
cin >> x >> y >> z;  
for (int i = 1; i < 100000.0 / n; ++i) {  
int sum = i * n;  
if (sum < 10000)  
continue;  
int a = sum % 10;  
int z1 = sum / 10 % 10;  
int y1 = sum / 100 % 10;  
int x1 = sum / 1000 % 10;  
int b = sum / 10000;  
if (x == x1 && y == y1 && z == z1) {  
buff.push_back(b);  
buff.push_back(a);  
buff.push_back(i);  
}  
}  
if (buff.empty())  
printf("0");  
else {  
printf("%d %d %d\n", buff[buff.size() - 3], buff[buff.size() - 2], buff[buff.size() - 1]);  
}  
}

```

方法 2：

```c++
#include <iostream>
#include <cstdio>
using namespace std;
int main(){
    int n, x, y, z;//n火鸡数、xyz原价格中间三位
    while(~scanf("%d", &n)){
        scanf("%d %d %d", &x, &y, &z);
        int tot, f = 0;//tot原价格、f标记是否存在能够整除火鸡数n的价格
        //这里选择从9枚举到1是为了第一次输出就是最高价格
        for(int a = 9; a >= 1; a--){//a控制原价格的万位[1,9]
            for(int b = 9; b >= 0; b--){//b控制原价格的个位[0,9]
                tot = a * 10000 + x * 1000 + y * 100 + z * 10 + b;
                if(tot % n == 0){//如果原价格tot能够整除火鸡数n
                    f = 1;//则将整除标记置1
                    printf("%d %d %d\n", a, b, tot / n);
                    break;
                }          
            }
            if(f) break;//如果已经整除，则跳出枚举
        }
        if(!f) printf("0\n");//如果没有可以整除的价格，则打印0
    }
    return 0;
}

```


## 2. 模拟
### 1. 图形排版

#### 1. 输出梯形


```c++
#include <iostream>  
#include "title.h"  
  
using namespace std;  
  
  
int main() {  
int h;  
while (scanf("%d", &h) != EOF) //高度h  
{  
int b = h + 2 * (h - 1), t = h; //下底边长，上底边长  
for (int i = 1; i <= h; i++) {  
for (int j = 1; j <= b; j++) {  
if (j > b - t - 2 * (i - 1))  
printf("*");  
else  
printf(" ");  
}  
printf("\n");  
}  
}  
return 0;  
}

```


#### 2. 叠筐

```c++
#include<iostream>
using namespace std;
int main(){
    int n;
    char a,b;
    char S[80][80];
    while(cin>>n>>a>>b){
        int mid=n/2;
        bool flag=true;
        S[mid][mid]=a;
        for(int i=1;i<=mid;i++){
                if(flag){
                    for(int j=0;j<2*i+1;j++){
                    S[mid-i][mid-i+j]=b;
                    S[mid+i][mid-i+j]=b;
                    S[mid-i+j][mid-i]=b;
                    S[mid-i+j][mid+i]=b;
                    flag=false;
                    }
                }
                else{
                    for(int j=0;j<2*i+1;j++){
                    S[mid-i][mid-i+j]=a;
                    S[mid+i][mid-i+j]=a;
                    S[mid-i+j][mid-i]=a;
                    S[mid-i+j][mid+i]=a;
                    flag=true;
                    }
                }
        }
        S[0][0]=S[0][n-1]=S[n-1][0]=S[n-1][n-1]=' ';
        for(int i=0;i<n;i++){
                for(int j=0;j<n;j++)
                    cout<<S[i][j];
                cout<<endl;
            }
 
            cout<<endl;
    }
    return 0;
}

```

