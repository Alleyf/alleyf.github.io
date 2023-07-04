---
title: algorithm  
date: 2023-03-17 19:06:15  
tags: [Algorithm]  
sticky: 70
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




# 王道机试指南

# 第二章暴力求解
## 1. 枚举
### 1. abc

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

### 2. 日期

#### 1. 今天是第几天

```c++
//

// Created by alleyf on 2023/6/23.

//

#include<bits/stdc++.h>

using namespace std;

bool isLeap(int year) {

    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;

}

int main() {

  

    int year, month, day;

    while (cin >> year >> month >> day) {

        unordered_map<int, int> monthDay{

            {1, 31}, {2, 28}, {3, 31}, {4, 30}, {5, 31}, {6, 30}, {7, 31}, {8, 31}, {9, 30}, {10, 31}, {11, 30}, {12, 31}

        };

        int sum = 0;

        if (isLeap(year)) {

            monthDay[2] = 29;

        }

        for (int i = 1; i < month; i++) {

            sum += monthDay[i];

        }

        sum += day;

        cout << sum << endl;

    }

}

```

#### 2. 打印日期


```c++
//  
// Created by alleyf on 2023/6/23.  
//  
#include<bits/stdc++.h>  
using namespace std;  
bool isLeap(int year){  
return (year%4==0&&year%100!=0)||year%400==0;  
}  
int main(){  
  
int year,allday;  
string month,day;  
while(cin>>year>>allday){  
unordered_map<int,int> monthDay{  
{1,31},{2,59},{3,90},{4,120},{5,151},{6,181},{7,212},{8,243},{9,273},{10,304},{11,334},{12,365}  
};  
if(isLeap(year)){  
for(int i=2;i<=12;i++){  
monthDay[i]+=1;  
}  
}  
for(int i=1;i<=12;i++){  
if(monthDay[i]>=allday){  
month = i>=10 ? to_string(i): ('0'+to_string(i));  
if(i==1){  
day = allday>=10 ? to_string(allday): ('0'+to_string(allday));  
}else {  
allday = allday - monthDay[i - 1];  
day = allday>=10 ? to_string(allday): ('0'+to_string(allday));  
}  
break;  
};  
}  
cout<<year<<'-'<<month<<'-'<<day<<endl;  
}  
}

```


#### 3. 日期累加

##### 套路

以前大一的时候面对这个题，就是单纯按月份纯算，算的可谓是焦头烂额。现在学习了新的方法：

1. 计算是当年的第几天
2. 这个数值sum加上需要累加的天数
3. 计算进位的多少年，确定年份
4. 根据剩下的第几天反解出这是几月几日
5. 输出

##### 技巧

用到的技巧包括打表、巧用bool。  
提前写出来每个月有多少天、每年有多少天。  
还有判断是否闰年函数，用它能够得到bool值，0和1可以分别对应于平年和闰年，所以上面的可以构造成二维数组。

##### 代码
```c++
#include <bits/stdc++.h>
using namespace std;

bool isLeap(int year){
    if(year%400==0) return true;
    else if(year%4==0&&year%100!=0) return true;
    return false;
}

int main(){
    int days[2][12]={
        {31,28,31,30,31,30,31,31,30,31,30,31},
        {31,29,31,30,31,30,31,31,30,31,30,31},
    };
    int n;
    scanf("%d",&n);
    for(int current = 0; current<n; current++){
        int year,month,date,plus;
        scanf("%d %d %d %d",&year,&month,&date,&plus);
        int y=0,m=1,d=0;
        int sum=0;
        bool leap = isLeap(year);
        for(int i=1;i<month;i++){
            sum+=days[leap][i-1];
        }
        sum+=date;
        sum+=plus;
        y=year;
        //逐年增加，直到sum<对应天数
        int total[2] = {365,366};
        while(sum>total[isLeap(y)]){
            sum-=total[isLeap(y)];
            y++;    
        } 
        //反解为日期 
        leap = isLeap(y);
        for(int i=1;sum>days[leap][i-1];i++){
            m++;
            sum-=days[leap][i-1];
        }
        d=sum;
        printf("%04d-%02d-%02d\n",y,m,d);
    }
}

```

### 3. 其他

#### 1. 剩余的树


```c++
//
// Created by alleyf on 2023/6/24.
//
#include<bits/stdc++.h>

using namespace std;
const int MAXL = 100001;
int main() {
    bool flag[MAXL];
    int l, m, num;
    cin >> l >> m;
    num = l + 1;
    for (int i = 0; i <= l; ++i) {
        flag[i] = true;
    };
    while (m--) {
        int left, right;
        cin >> left >> right;
        for (int i = left; i <= right; ++i) {
            if (flag[i]) {
                flag[i] = false;
                num--;
            }
        }
    }
    cout << num;
}

```

<font color="#ff0000">1. 使用一个 l+1 长度的 array 存储所有树的存在状态，初始化所有树的状态为真；</font>
<font color="#ff0000">2. 根据区间循环判每棵树的状态，若为真则修改树输出总数的状态为假并将树的总数自减；</font>
<font color="#ff0000">3. 输出剩余树的数量。</font>

#### 2. 手机键盘

> 1. 用一个数组按顺序保存每个字母所需要的时间段
> 2. 循环每个输入的字母求和总次数，判断前后两字符是否在一个按键上，若果是则加两个时间段


```c++
//  
// Created by alleyf on 2023/6/24.  
//  
#include<bits/stdc++.h>  
  
using namespace std;  
  
int main() {  
int letter_num[26] = {1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 1, 2, 3, 4};  
string s;  
while (cin >> s) {  
int allNum = 0;  
for (int i = 0; i < s.size(); ++i) {  
allNum += letter_num[s[i] - 'a'];  
if (i != 0 && s[i] - s[i - 1] == letter_num[s[i] - 'a'] - letter_num[s[i - 1] - 'a']) {  
allNum += 2;  
}  
}  
cout << allNum << endl;  
}  
}

```


#### 3.xxx_定律

> 既可递归实现也可 while 迭代迭代实现。
```c++
//  
// Created by alleyf on 2023/6/24.  
//  
#include<bits/stdc++.h>  
  
using namespace std;  
  
int xxx_law(int &num, int &cnt) {  
if (num == 1) {  
return cnt;  
} else if (num % 2 != 0) {  
cnt++;  
num = 3 * num + 1;  
num /= 2;  
return xxx_law(num, cnt);  
} else {  
cnt++;  
num /= 2;  
return xxx_law(num, cnt);  
}  
}  
  
int main() {  
int num;  
while (cin >> num) {  
int cnt = 0;  
cout << xxx_law(num, cnt) << endl;  
}  
}

```


# 第三章排序与查找

## 3.1 排序

### 1. 排序

<span style="background:#b1ffff">> 冒泡排序：</span>
<span style="background:#b1ffff">> 	1. 升序：外层循环递减，内层循环递增直到外层循环变量；</span>
<span style="background:#b1ffff">> 	2. 降序：外层循环递增，内层循环从外层循环变量开始递增。</span>
```c++
//  
// Created by alleyf on 2023/6/25.  
//  
#include<bits/stdc++.h>  
  
using namespace std;  
  
int main() {  
int n;  
cin >> n;  
int array[n];  
for (int i = 0; i < n; ++i) {  
cin >> array[i];  
}  
for (int i = n; i > 0; --i) {  
for (int j = 0; j < i; ++j) {  
if (array[j] > array[j + 1] && j + 1 < n) {  
int tmp = array[j + 1];  
array[j + 1] = array[j];  
array[j] = tmp;  
}  
}  
}  
for (int value: array) {  
cout << value << ' ';  
}  
return 0;  
}

```

#### 大部分排序方法


```c++
//所有基本的排序方法了，桶排序、基数排序暂不写了  
#include<iostream>  
  
using namespace std;  
const int N = 110, MAX = 1e8;  
int a[N];  
int n;  
int h[N], idx;//heap_sort用  
int tmp[N];//merge_sort用  
int bkt[MAX];//counting_sort用  
  
void buble_sort() {  
for (int i = 0; i < n - 1; i++)  
for (int j = 0; j < n - 1 - i; j++) {  
if (a[j] > a[j + 1]) swap(a[j], a[j + 1]);  
}  
}  
  
void quick_sort(int l, int r) {  
if (l >= r) return;  
int x = a[(l + r) / 2];  
int i = l - 1, j = r + 1;  
while (i < j) {  
do i++; while (a[i] < x);  
do j--; while (a[j] > x);  
if (i < j) swap(a[i], a[j]);  
}  
quick_sort(l, j);  
quick_sort(j + 1, r);  
}  
  
void selection_sort() {  
for (int i = 0; i < n - 1; i++) {  
int min_pos = i;  
for (int j = i + 1; j < n; j++)  
if (a[j] < a[min_pos]) min_pos = j;  
swap(a[i], a[min_pos]);  
}  
}  
  
void down(int u) {  
int t = u;  
if (u * 2 <= idx && h[u * 2] < h[t]) t = u * 2;  
if (u * 2 + 1 <= idx && h[u * 2 + 1] < h[t]) t = u * 2 + 1;  
if (t != u) {  
swap(h[t], h[u]);  
down(t);  
}  
}  
  
void heap_sort() {  
for (int i = 1; i <= n; i++) h[i] = a[i - 1];  
idx = n;  
for (int i = idx / 2; i > 0; i--) down(i);  
for (int i = 0; i < n; i++) {  
a[i] = h[1];  
h[1] = h[idx--];  
down(1);  
}  
}  
  
void insertion_sort() {  
for (int i = 1; i < n; i++) {  
int cur_idx = a[i];  
int j;  
for (j = i - 1; j >= 0 && a[j] > cur_idx; j--) {  
a[j + 1] = a[j];  
}  
a[j + 1] = cur_idx;  
}  
}  
  
void binary_insertion_sort() {  
for (int i = 1; i < n; i++) {  
int cur_idx = a[i];  
int l = 0, r = i - 1;  
while (l < r) {  
int mid = (l + r + 1) / 2;  
if (a[mid] <= cur_idx) l = mid;  
else r = mid - 1;  
}  
if (a[l] > cur_idx) l = -1;  
int j;  
for (j = i - 1; j > l; j--) a[j + 1] = a[j];  
a[j + 1] = cur_idx;  
}  
}  
  
void shell_sort() {  
for (int gap = n / 2; gap >= 1; gap /= 2) {  
for (int i = gap; i < n; i++) {  
int cur_idx = a[i];  
int j;  
for (j = i - gap; j >= 0 && a[j] > cur_idx; j -= gap) {  
a[j + gap] = a[j];  
}  
a[j + gap] = cur_idx;  
}  
}  
}  
  
void merge_sort(int l, int r) {  
if (l >= r) return;  
int mid = (l + r) / 2;  
merge_sort(l, mid), merge_sort(mid + 1, r);  
int k = 0, i = l, j = mid + 1;  
while (i <= mid && j <= r) {  
if (a[i] <= a[j]) tmp[k++] = a[i++];  
else tmp[k++] = a[j++];  
}  
while (i <= mid) tmp[k++] = a[i++];  
while (j <= r) tmp[k++] = a[j++];  
for (int i = l, j = 0; i <= r; j++, i++) a[i] = tmp[j];  
}  
  
void counting_sort() {  
int max = 0;  
for (int i = 0; i < n; i++) {  
bkt[a[i]]++;  
if (a[i] > max) max = a[i];  
}  
int j = 0;  
for (int i = 0; i < max + 1; i++) {  
while (bkt[i]) {  
a[j++] = i;  
bkt[i]--;  
}  
}  
}  
  
int main() {  
scanf("%d", &n);  
for (int i = 0; i < n; i++) scanf("%d", &a[i]);  
// buble_sort();  
// quick_sort(0, n - 1);  
// selection_sort();  
// heap_sort();  
// insertion_sort();  
// binary_insertion_sort();  
// shell_sort();  
// merge_sort(0, n - 1);  
counting_sort();  
for (int i = 0; i < n; i++) printf("%d ", a[i]);  
return 0;  
}

```


### 2. 成绩排序


<font color="#f79646">- 定义一个结构体包含学号与成绩</font>
<font color="#f79646">- 写一个比较器 Compare</font>
<font color="#f79646">- 使用内置 sort 算法，设置迭代头和尾（地址）以及比较规则（比较器）</font>
```c++
#include<iostream>  
#include<algorithm>  
  
using namespace std;  
  
//定义学生结构体  
struct Student {  
int number;  
int score;  
  
Student() {}  
  
Student(int n, int s) : number(n), score(s) {}  
};  
  
//定义比较函数  
bool Compare(Student s1, Student s2) {  
//成绩相同比学号  
if (s1.score == s2.score) {  
return s1.number < s2.number; //'<',指按照比较的参数由小到大排序  
} else {  
return s1.score < s2.score; ////'<',指按照比较的参数由小到大排序,同理，如果是'>'，指按照由大到小排序  
}  
}  
  
int main() {  
int n;  
cin >> n;  
//定义数组保存比较学生的基本信息  
Student arr[n];  
for (int i = 0; i < n; ++i) {  
cin >> arr[i].number >> arr[i].score;  
}  
sort(arr, arr + n, Compare);  
for (Student s: arr) {  
cout << s.number << ' ' << s.score << endl;  
}  
return 0;  
}

```


### 3. 成绩排序 2

方法 1：
<font color="#ff0000">sort是不稳定排序，stable_sort才是稳定排序，稳定排序不改变输入的顺序</font>
```c++
//  
// Created by alleyf on 2023/6/25.  
//  
#include<bits/stdc++.h>  
#include<algorithm>  
  
using namespace std;  
int num, sort_flag;  
  
struct Student {  
string name;  
int score;  
  
Student() {};  
  
Student(string n, int s) : name(n), score(s) {}  
};  
  
bool Compare(Student s1, Student s2) {  
return sort_flag ? s1.score < s2.score : s1.score > s2.score;//sort_flag为真则升序否则降序  
}  
  
int main() {  
while (cin >> num >> sort_flag) {  
Student arr[num];  
for (int i = 0; i < num; ++i) {  
cin >> arr[i].name >> arr[i].score;  
}  
stable_sort(arr, arr + num, Compare);//重点：sort是不稳定排序，stable_sort才是稳定排序，稳定排序不改变输入的顺序  
for (Student s: arr) {  
cout << s.name << ' ' << s.score << endl;  
}  
}  
return 0;  
}

```

方法 2：
用一个编号保存每个学生的顺序，排序比较器里成绩相等的按照编号升序排

```c++
#include<iostream>
#include<algorithm>
#include<cstring> 
using namespace std;
struct student{
	string name;
	int score;
	int num; 
};
int flag; //升序还是降序 
bool cmp(student a,student b){
	if(flag==0) {
		if(a.score==b.score) return a.num<b.num;
		else return a.score>b.score;
	}
	else {
		if(a.score==b.score) return a.num<b.num;
		else return a.score<b.score;	//这里必须写else，否则牛客会编译失败 
	} 
}
int main(){
	int n;
	while(cin>>n){
		cin>>flag;
		student stu[n];
		for(int i=0;i<n;i++){
			cin>>stu[i].name>>stu[i].score;
			stu[i].num=i;
		} 
		sort(&stu[0],&stu[n],cmp); //重点：sort是不稳定排序，stable_sort才是稳定排序 
		for(int i=0;i<n;i++) cout<<stu[i].name<<' '<<stu[i].score<<endl;
	}
	return 0;
}


```



## 3.2 查找

### 1. 找 x

方法 1：
用 flag 标志是否找到
```c++
//  
// Created by alleyf on 2023/6/25.  
//  
#include<bits/stdc++.h>  
#include<algorithm>  
  
using namespace std;  
  
int main() {  
int n, t;  
while (cin >> n) {  
int arr[n];  
bool flag = false;  
for (int i = 0; i < n; ++i) {  
cin >> arr[i];  
}  
cin >> t;  
for (int i = 0; i < n; ++i) {  
if (t == arr[i]) {  
cout << i << endl;  
flag = ~flag;  
break;  
}  
}  
if (!flag)  
cout << -1 << endl;  
}  
return 0;  
}

```

方法 2：
设置初始默认为-1，找到则修改状态
```c++
#include<iostream>
#include<cstdio>
using namespace std;
int maxn=200+10;
int main(){
    int arr[maxn];
    int n;
    while(scanf("%d",&n)!=EOF){
        for(int i=0;i<n;i++){
            scanf("%d",&arr[i]);
        }
        int x;
        int answer=-1;
        scanf("%d",&x);
        for(int i=0;i<n;i++){
            if(arr[i]==x){
                answer=i;
                break;
            }
            }
            printf("%d\n",answer);
        }
    return 0;
}


```


### 2. 查找


方法 1：复杂度 O（n）


```c++
#include <iostream>
#include <map>
using namespace std;

int main() {
    int n;
    int m;
    while(cin>>n) {
        map<int,bool> mp;
        for (int i = 0; i < n; i++) {
            int temp;
            cin>>temp;
            mp[temp] = true;
        }
        cin>>m;
        for (int i = 0; i < m; i++) {
            int temp;
            cin>>temp;
            if (mp.find(temp) != mp.end()) {
                cout<<"YES"<<endl;
            } else {
                cout<<"NO"<<endl;
            }
        }
    }
}

```



方法 2：复杂度 O（m·n）
```c++
//  
// Created by alleyf on 2023/6/25.  
//  
#include<bits/stdc++.h>  
  
using namespace std;  
  
int main() {  
int n, m;  
while (cin >> n) {  
int arr[n];  
for (int i = 0; i < n; ++i) {  
cin >> arr[i];  
}  
cin >> m;  
int tar[m];  
for (int i = 0; i < m; ++i) {  
cin >> tar[i];  
}  
for (int i = 0; i < m; ++i) {  
string status = "NO";  
for (int j = 0; j < n; ++j) {  
if (arr[j] == tar[i]) {  
status = "YES";  
break;  
}  
}  
cout << status << endl;  
}  
}  
return 0;  
}

```


### 3.extrenum_index

方法 1：
空间复杂度为 O（1）
```c++
#include <iostream>
using namespace std;
int main() {
	int n, i, left, mid, right;
	while (cin >> n) {
		cin >> mid >> right;
		if (mid != right)
			cout << "0 ";
		for (i = 1; i < n - 1; ++i) {
			left = mid;
			mid = right;
			cin >> right;
			if ((mid - left) * (mid - right) > 0)
				cout << i << ' ';
		}
		if (mid != right)
			cout << i;
		cout << endl;
	}
	return 0;
}

```

方法 2：

```c++
#include<bits/stdc++.h>  
  
using namespace std;  
  
int main() {  
int n;  
while (cin >> n) {  
int arr[n];  
for (int i = 0; i < n; ++i) {  
cin >> arr[i];  
}  
for (int i = 0; i < n - 1; ++i) {  
if (i == 0 && arr[i] != arr[i + 1]) {  
cout << i << ' ';  
} else if ((arr[i] > arr[i - 1] && arr[i] > arr[i + 1]) || (arr[i] < arr[i - 1] && arr[i] < arr[i + 1])) {  
cout << i << ' ';  
}  
if (i == n - 2 && arr[i] != arr[i + 1]) {  
cout << i + 1 << ' ';  
}  
}  
cout << endl;  
}  
return 0;  
}

```

### 4. 找位置


<span style="background:#b1ffff">时间复杂度为 O(n)</span>

<font color="#ff0000">1. 用一个额外的矢量 orderS 不重复的添加字符，以保证输出时字符顺序</font>
<font color="#ff0000">2. 用map的key记录字符，value记录重复出现的次数</font>
<font color="#ff0000">3. 最后按照orderS的顺序遍历输出</font>
```c++
#include<bits/stdc++.h>  
  
using namespace std;  
  
int main() {  
string s;  
map<char, vector<int>> sm;  
vector<char> orderS;  
cin >> s;  
for (int i = 0; i < s.length(); ++i) {  
if (sm.find(s[i]) != sm.end()) {  
sm[s[i]].push_back(i);  
} else {  
sm[s[i]] = vector<int>{i};  
orderS.push_back(s[i]);  
}  
}  
for (char item: orderS) {  
auto tmp = sm.find(item);  
if (tmp != sm.end() && tmp->second.size() > 1) {  
for (int index: tmp->second) {  
if (index != tmp->second.back())  
cout << tmp->first << ':' << index << ',';  
else  
cout << tmp->first << ':' << index << endl;  
}  
}  
}  
}

```


# 第四章字符串

## 1. 字符串处理

### 1. 特殊乘法

```c++
//  
// Created by alleyf on 2023/6/26.  
//  
#include<bits/stdc++.h>  
#include <string>  
#include <iostream>  
  
using namespace std;  
  
int main() {  
string a, b;  
int sum = 0;  
while (cin >> a >> b) {  
for (char i: a) {  
for (char j: b) {  
sum += (i - '0') * (j - '0');  
}  
}  
cout << sum << endl;  
}  
}

```


### 2. 密码翻译


```c++
//  
// Created by alleyf on 2023/6/26.  
//  
#include<bits/stdc++.h>  
  
using namespace std;  
  
int main() {  
string s;  
while (cin >> s) {  
for (int i = 0; i < s.length(); ++i) {  
if ((s[i] >= 'A' && s[i] <= 'Y') || (s[i] >= 'a' && s[i] <= 'y')) {  
s[i] += 1;  
} else if (s[i] == 'z' || s[i] == 'Z') {  
s[i] = s[i] == 'z' ? 'a' : 'A';  
}  
}  
cout << s << ' ';  
}  
}

```



### 3. 简单密码

```c++
// 方法1：

//
// Created by alleyf on 2023/6/26.
//
#include<bits/stdc++.h>
using namespace std;
int main() {
    string s;
    while (getline(cin, s)) {
        if (s != "ENDOFINPUT") {
            if (s != "START" && s != "END") {
                int i = 0;
                for (char item : s) {
                    if ((item >= 'A' && item <= 'Z'))
                       s[i] = 'A' + (item - 'A' + 21) % 26;
                    i++;
                }
                cout << s << endl;
            }
        } else {
            break;
        }
    }
    return 0;
}

// 方法2:

//
// Created by alleyf on 2023/6/26.
//
#include<bits/stdc++.h>
using namespace std;
map<char, char> pwd_map{
    {'A', 'V'},
    {'B', 'W'},
    {'C', 'X'},
    {'D', 'Y'},
    {'E', 'Z'},
    {'F', 'A'},
    {'G', 'B'},
    {'H', 'C'},
    {'I', 'D'},
    {'J', 'E'},
    {'K', 'F'},
    {'L', 'G'},
    {'M', 'H'},
    {'N', 'I'},
    {'O', 'J'},
    {'P', 'K'},
    {'Q', 'L'},
    {'R', 'M'},
    {'S', 'N'},
    {'T', 'O'},
    {'U', 'P'},
    {'V', 'Q'},
    {'W', 'R'},
    {'X', 'S'},
    {'Y', 'T'},
    {'Z', 'U'},
};
int main() {
    string s;
    while (getline(cin, s)) {
        if (s != "ENDOFINPUT") {
            if (s != "START" && s != "END") {
                int i = 0;
                for (char item : s) {
                    if ((item >= 'A' && item <= 'Z'))
                       s[i] = pwd_map[item];
                    i++;
                }
                cout << s << endl;
            }
        } else {
            break;
        }
    }
    return 0;
}

```



### 4. 统计字符


```c++
//  
// Created by alleyf on 2023/6/30.  
//  
#include<bits/stdc++.h>  
  
using namespace std;  
  
int main() {  
string ts, s;  
while (getline(cin, ts)) {  
if (ts == "#")  
break;  
getline(cin, s);  
int cnum[ts.length()];  
for (int i = 0; i < ts.length(); ++i) {  
cnum[i] = 0;  
for (char j: s) {  
if (j == ts[i]) {  
cnum[i]++;  
}  
}  
cout << ts[i] << ' ' << cnum[i] << endl;  
}  
}  
  
}  
/**  
* 方法2：  
* using namespace std;  
//1：注意读题，i ng是当四个字符处理，而非i和ng  
//2：如何持续输入？while持续输入第一个字符，循环体内输入第二个  
//如何捕捉结束字符？在第一个字符串输入时识别  
  
int number[128];  
int main()  
{  
string str1,str2;  
while(getline(cin,str1)){  
if(str1=="#") break;  
getline(cin,str2);  
memset(number,0,sizeof(number)); //number数组记录该字符，出现的次数  
for(int i=0;i<str2.size();i++){  
number[str2[i]]++; //长字符串的字符对应ASCII码的下标+1  
}  
for(int i=0;i<str1.size();i++){  
printf("%c %d\n",str1[i],number[str1[i]]);  
}  
}  
}  
//学到的方法：ASCII码不大，想统计每个字符，直接将其对应的ASCII码下标的元素加1即可！  
  
*/

```



### 5. 字母统计

```c++
//  
// Created by alleyf on 2023/6/30.  
//  
#include<bits/stdc++.h>  
  
using namespace std;  
map<char, int> c_map{  
{'A', 0},  
{'B', 0},  
{'C', 0},  
{'D', 0},  
{'E', 0},  
{'F', 0},  
{'G', 0},  
{'H', 0},  
{'I', 0},  
{'J', 0},  
{'K', 0},  
{'L', 0},  
{'M', 0},  
{'N', 0},  
{'O', 0},  
{'P', 0},  
{'Q', 0},  
{'R', 0},  
{'S', 0},  
{'T', 0},  
{'U', 0},  
{'V', 0},  
{'W', 0},  
{'X', 0},  
{'Y', 0},  
{'Z', 0},  
};  
  
int main() {  
string s;  
getline(cin, s);  
for (char c: s) {  
if (c_map.find(c) != c_map.end()) {  
c_map[c]++;  
}  
}  
for (auto item: c_map) {  
cout << item.first << ':' << item.second << endl;  
}  
}

```







## 2. 字符串匹配



