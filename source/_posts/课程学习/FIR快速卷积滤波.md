---
title: Fast_Conv Filter Design
tags: [FIR]
categories: DSP
date: 2022-11-13 21:17:00
sticky: 80
excerpt: some ideas about FIR filters and FFT。
---
# FIR滤波器结合快速卷积滤波

## 一、要求

选择子作业１中的音频信号，自行给定滤波器的单位取样响应，采用**快速卷积**实现对音频信号的滤波，比较滤波前后信号的波形和回放的效果。

## 二、实现思路

### 设计FIR滤波器

- 分析原始音频信号的频谱，观察有用信号和噪声的分布，选择滤波器类型（低通、高通、带通、带阻等）
- 设定幅频响应下降三分贝的截止频率和滤波器阶数
- 选择合适的窗函数（包括Rectangular、Hanning、Hamming、Bartlett、Blackman、Kaiser、Gaussian、Flat-top等）
- 获得滤波器的单位采样响应hn

### 快速卷积

- 计算原始音频信号x与滤波器的单位采样响应hn的线性卷积长度，L=length(x)+length(hn)
- 设计FFT的长度N>=L
- 对x和hn分别做N点FFT变换获得Xk、Hk
- 将Xk与Hk相乘得到Yk
- 将Yk做IFFT逆变换得到yn，即完成快速卷积

## 三、实现过程

### FIR滤波器

设FIR滤波器的单位冲激响应h(n)为一个N点序列，0≤n≤N-1，则滤波器的系统函数为：
$$
H(\mathrm{z})=\sum_{k=0}^{N-1}h(\mathrm{k})*\mathrm{z}^{-k}
$$
**直接型FIR滤波器**的差分方程为：
$$
\mathrm{y(n)}=\sum_{m=0}^{N-1}\mathrm{h(m)x(n-m)}
$$
由差分方程可知只需要求出FIR滤波器的单位冲激响应h(n)，设置**滤波阶数**和**3db通带截止频率fc**，采用**汉明窗函数**处理，再使用**fir1函数**将其与待滤波信号卷积即可完成滤波，具体实现代码如下。

```matlab
%% hamming窗低通滤波器设计
fc=7.95e3; %下降3分贝截止频率
hn=fir1(1000,fc*2/Fs,"low");
hn=hn';
Nh=length(hn);
```

FIR滤波器的单位冲击响应如下图所示：

![](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/image-20221013213239697.png)

### 快速卷积

线性卷积在**满足圆周卷积点数大于等于线性卷积长度**的条件下可以用圆周卷积计算，而圆周卷积可以使用DFT计算，而DFT有快速算法FFT，因此可以利用FFT算法减少运算量快速计算线性卷积。先将做卷积的两个信号**补零**到指定长度，然后分别做**FFT变换**，根据卷积定理可得时域上做卷积，就是在频域上做乘积，将两者**频谱相乘后做IFFT**即可实现快速卷积，整个过程如下图所示：

![FFT流程图](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/Fast-linear-convolution-realized-by-circular-convolution-in-the-DFT-domain.png)

实现快速卷积的代码如下所示：

```matlab
%% 快速卷积和线性卷积
L=pow2(nextpow2(Nx+Nh-1));%确定FFT快速卷积的点数
fprintf('快速卷积：');
tic;
Xk=fft(x,L);%计算x的L点FFT,结果为x(k)
Hk=fft(hn,L);%计算y的L点FFT,结果为y(k)
Yk=Xk.*Hk;%计算YK
y1n=ifft(Yk,L);%对YK调用IFFT，求得y1(n)
toc;
fprintf('直接卷积：');
tic;
y2n=conv(x,hn);%计算y2(n)的卷积
toc;
```

## 四、结果展示

### 线性卷积和FFT快速卷积滤波前后对比图

![滤波对比图](https://img.gouka.la/i/2022/11/14/z1xwyl.webp)

### 线性卷积和FFT快速卷积滤波时间对比图

![时间对比图](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/%E6%97%B6%E9%97%B4%E5%AF%B9%E6%AF%94%E5%9B%BE.png)

## 五、结果分析

> - 由上图可知普通线性卷积的结果和快速卷积的结果一样，但快速卷积相比普通线性卷积耗时更短，因此快速卷积可以提高运算速率，减少运算量，提高运算效率。
> - 离散傅立叶变换（DFT)实现了频域的离散化,方便了计算机处理,在数字信号处理中有着非常重要的作用。但直接计算DFT的运算量与变换长度N的平方成正比,计算量太大。而快速傅立叶变换FFT则是快速计算DFT的有效算法，大大提高了DFT的运算效率，在信号频谱的分析、滤波器频率响应的计算，以及线性卷积的快速计算等方面起着非常重要的作用。

## 代码开源

> [源代码ch1和ch2](https://alist.fcsy.fit/d/mobilepan/PicoImages/ch1andch2.zip)[源代码ch3和ch4](https://alist.fcsy.fit/d/mobilepan/PicoImages/ch4andch5.zip)有需要可以自行下载，里面包括源代码、滤波后的音频和PDF参考文档。