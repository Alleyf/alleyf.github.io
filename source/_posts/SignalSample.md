---
title: SignalSample
tags: [Signal,Sample]
categories: DSP
date: 2022-9-22 15:44:00
sticky: 75
excerpt: SignalSample`s results about different sample_frequency
---

# Signal Sample And Rebuild

## 第一题

### 要求

固定采样频率500 kHz，分别对100 kHz、250 kHz、400 kHz的正弦波信号（幅度，相位自定义）进行采样和重建，分析比较原信号与重建信号的波形；

### Matlab程序设计

```matlab
%% 100khz信号的采样与恢复
%原信号生成
clear;
fs=500e3;%采样率
f1=100e3;%信号频率
T=10/f1;%采样20个周期
dt=1/fs;
t=linspace(-T,T-dt,20*1e3);%时域横坐标
x = cos(2*pi*f1*t);
subplot(411);
plot(t,x);%画原始信号时域图
xlabel("t/s")
title("100kHz信号时域图")
grid on

%进行采样
n=-T:dt:T-dt;
xs=cos(2*pi*f1*n);
subplot(412);
stem(n,xs,"filled");
xlabel("t/s")
title("采样信号时域图")
grid on
%快速傅里叶变换绘出频谱图
f=n*fs/length(xs)+0.5;
X=fft(xs,length(xs));
subplot(413);
plot(f*fs/1e3,abs(X));
xlabel("f/kHz")
title("采样信号幅频图")
grid on

%滤波恢复原信号
y=[];
for i = 1 : length(t)
    a=t(i)-n;
    Sa=sinc(fs.*a);
    g=dot(xs,Sa);
    y = [y,g];
end
subplot(414);
plot(y);
xlabel("t/s")
title("恢复信号时域图")
```

### 实验结果

1. 100kHz原始信号的采样与恢复

   ![sample100](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/sample100.png)

2. 250kHz原始信号的采样与恢复

   ![sample250](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/sample250.png)

3. 400kHz原始信号的采样与恢复

   ![sample400](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/sample400.png)

### 结果分析

- 根据是实验结果观察波形可知，当采样频率固定为500kHz时，对100kHz采样后恢复的信号与原始信号基本一致，依据**奈奎斯特采样定理**<u>采样频率需要大于信号的最高频率的两倍</u>可知，此时为**过采样**；对250kHz采样后恢复的信号在边界附近幅度有一定变化但近似可以恢复出原信号，依据奈奎斯特采样定理可知此时为**临界采样**；对400kHz采样后恢复的信号频率为原始信号的四倍发生了**非线性失真**，无法恢复出原始信号，依据奈奎斯特采样定理可知此时为**欠采样**。



---

## 第二题

### 要求

采集一段音频信号，分别用欠采样、临界采样和过采样对信号进行重采样，并重建原音频信号，分析比较重建信号与原信号的差别。

### Matlab程序设计

```matlab
%% 信号的采样与恢复
clear all;close;clc;
%% 原信号采样及对比
[x,fm]=audioread("D:/Libai.wav");
x=x(:,1);%由于x是双声道，所以取它的左声道
Fs=18e3;
x = resample(x,Fs,fm);%将读取信号重采样为18kHz作为原始信号
N=length(x); %信号的长度
t=(0:N-1)/Fs;%时域范围
figure(1);
subplot(421);
plot(t,x); %音频信号时域图
title("原信号音频时域图");
xlabel("Time"); 
Y=fft(x,N);
df=Fs/length(t); %计算谱线间隔
f=t*df;
Ys=abs(Y); %幅度响应
% Ys=Ys(1:length(Ys)/2); %由于幅度响应是偶函数，所以截取一半
subplot(422);
plot(f.*Fs./1e3,Ys); %音频信号频谱图
title("原信号音频频谱图");
xlabel("f/kHz");
%% 进行过采样、临界采样和欠采样三种采样
i=3;
fso=Fs/1.5;
fsc=Fs/2;
fsu=Fs/4;
for n = [1.5, 2, 4]
if n==1.5
    yso =  resample(x,fso,Fs);
elseif n==2
    ysc =  resample(x,fsc,Fs);
else
    ysu =  resample(x,fsu,Fs);
end
subplot(4,2,i);
i=i+1;
xlabel("t/s")
if n==1.5
    tso=linspace(t(1),t(end),length(yso));%时域横坐标
    plot(tso,yso);%画采样信号时域图
    title("过采样采样信号时域图")
    grid on
    Y=fft(yso,length(yso));
    subplot(4,2,i);
    i=i+1;
    df=fso/length(tso); %计算谱线间隔
    fo=tso*df;
    Ys=abs(Y); %幅度响应
    plot(fo.*fso./1e3,Ys); %音频信号频谱图
    xlabel("f/kHz"); 
    title("过采样音频频谱图");
    grid on
elseif n==2
    tsc=linspace(t(1),t(end),length(ysc));%时域横坐标
    plot(tsc,ysc);%画采样信号时域图
    title("临界采样采样信号时域图")
    grid on
    Y=fft(ysc,length(ysc));
    subplot(4,2,i);
    i=i+1;
    df=fsc/length(tsc); %计算谱线间隔
    fc=tsc*df;
    Ys=abs(Y); %幅度响应
    plot(fc.*fsc./1e3,Ys); %音频信号频谱图
    xlabel("f/kHz");
    title("临界采样音频频谱图");
    grid on
elseif n==4 
    tsu=linspace(t(1),t(end),length(ysu));%时域横坐标
    plot(tsu,ysu);%画采样信号时域图
    title("欠采样采样信号时域图")
    grid on
    Y=fft(ysu,length(ysu));
    subplot(4,2,i);
    i=i+1;
    df=fsu/length(tsu); %计算谱线间隔
    fu=tsu*df;
    Ys=abs(Y); %幅度响应
    plot(fu.*fsu./1e3,Ys); %音频信号频谱图
    xlabel("f/kHz");
    title("欠采样音频频谱图");
    grid on
end
end
%% 低通滤波恢复原信号
yo=zeros(1,length(x));
for i = 1 : length(x)
        a=t(i)-tso;
        Sa=sinc(fso.*a);
        g=0;
        for k = 1:1:length(yso)
            s = yso(k)*Sa(k);
            g=g+s;
        end
        yo(i) = g;
end
yc=zeros(1,length(x));
for i = 1 : length(t)
        b=t(i)-tsc;
        Sb=sinc(fsc.*b);
        g=0;
        for k = 1:1:length(ysc)
            s = ysc(k)*Sb(k);
            g=g+s;
        end
        yc(i) = g;
end
yu=zeros(1,length(x));
for i = 1 : length(t)
        c=t(i)-tsu;
        Sc=sinc(fsu.*c);
        g=0;
        for k = 1:1:length(ysu)
            s = ysu(k)*Sc(k);
            g=g+s;
        end
        yu(i) = g;
end
%% 信号对比及保存
%画出还原时域图
m=2;
figure(2);
subplot(421);
plot(t,x); 
title("原信号音频时域图");
xlabel("Time");
grid on
s="原信号音频频谱图";
FFT(x,N,Fs,t,m,s);
m=m+2;
subplot(423);
plot(t,yo);
xlabel("t/s")
title("过采样恢复信号时域图");
grid on
so="过采样信号音频频谱图";
FFT(yo,length(yo),fso,t,m,so);
m=m+2;
subplot(425);
plot(t,yc);
xlabel("t/s")
title("临界采样恢复信号时域图");
grid on
sc="临界采样信号音频频谱图";
FFT(yc,length(yc),fsc,t,m,sc);
m=m+2;
subplot(427);
plot(t,yu);
xlabel("t/s")
title("欠采样恢复信号时域图");
grid on
su="欠采样信号音频频谱图";
FFT(yu,length(yu),fsu,t,m,su);
%保存信号
name = ["over_sampling.wav","critical_sampling.wav","under_sampling.wav"];
audiowrite(name(1),yo,Fs);
audiowrite(name(2),yc,Fs);
audiowrite(name(3),yu,Fs);
end
%% 傅里叶变换函数
function FourierTransform = FFT(signal,N,fs,t,m,s)
Y=fft(signal,N);
df=fs/length(t); %计算谱线间隔
f=t*df;
Ys=abs(Y); %幅度响应
subplot(4,2,m);
plot(f.*fs./1e3,Ys); %音频信号频谱图
xlabel("f/kHz");
title(s);
end
```

### 实验结果

1. 三种采样后的信号与原信号的对比

   ![sampleorigin](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/sampleorigin.png)

2. 重建信号与原信号的对比

   ![rebuild](https://raw.githubusercontent.com/Alleyf/PictureMap/main/web_icons/rebuild.png)


### 结果分析

- 先读取音频信号，matlab默认读取音频时的采样频率为44.1kHz，而人类能够听到的声音的频率为**20~20kHz**左右，为了加快运算速度将采集的信号重采样为18kHz作为原始信号，然后对其分别进行过采样(频率为12kHz)、临界采样(频率为9kHz)、欠采样(频率为4.5kHz)，采样后对其进行**插值重建**。
- 对比原始信号与重建信号的时域图和频谱图发现，过采样和临界采样恢复的信号和原始信号基本一致，没有发生较大的畸变，而欠采样信号发生了较大的失真，与原始信号有较大的的区别，由此可知，**采样必须满足奈奎斯特采样定理**才能不失真的恢复出原始信号。

   ​																												
   
   
   
   
   
   
   
   ​																												[原文已上传博客](https://alleyf.github.io/2022/09/22/SignalSample/)