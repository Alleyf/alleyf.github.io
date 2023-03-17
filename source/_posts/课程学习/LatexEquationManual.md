---
title: LatexEquationManual
tags: [LatexEquation]
categories: Latex
date: 2022-10-9 10:00:00
sticky: 55
excerpt: some notation about Latex-equation。
---
# Latex公式手册

## 数学模式

在LaTeX数学模式中，公式有两种形式——行内公式和行间公式。前者公式嵌入在行内，适用于简单短小的公式；后者居中独占一行，适用于比较长或重要的公式。公式中的空格均会被忽略，可以使用命令\quad或\qquad实现
在行间公式中，命令\tag{n}可以进行手动编号

**行内公式**

```latex
$ f(x) = a+b $
```

**行间公式**

```latex
$$ f(x) = a+b $$
```

**手动编号**

```latex
$$ f(x) = a - b \tag{1.1} $$
```

## 数学结构

## 简单运算

拉丁字母、阿拉伯数字和 + - * / = 运算符均可以直接输入获得，命令`\le`和`\ge`分别表示<=和>=，命令`\cdot`表示乘法的圆点，命令`\neq`表示不等号，命令`\equiv`表示恒等于，命令`\bmod`表示取模, 命令`\lvert \rvert`取绝对值.

```latex
$$ x+2-3*4/6=4/y + x\cdot y $$
```

$$
x+2−3∗4/6=4/y+x⋅y \\
x\le{y} \quad q\ge{p}
$$



```latex
$$ 0 \neq 1 \quad x \equiv x \quad 1 = 9 \bmod 2 $$
```

$$
0 \neq 1 \quad x \equiv x \quad 1 = \lvert9\rvert \bmod{2}
$$



## 上下标

语法_表示下标、^表示上标，但上下标内容不止一个字符时，需用大括号括起来。单引号'表示求导

```latex
$$ a_{ij}^{2} + b^3_{2}=x^{t} + y' + x''_{12} $$
```

$$
a_{ij}^{2} + b^3_{2}=x^{t} + y' + x''_{12}
$$



## 根号、分式

命令：`\sqrt`表示平方根，`\sqrt[n]`表示n次方根，`\frac`表示分式

```tex
$$\sqrt{x} + \sqrt{x^{2}+\sqrt{y}} = \sqrt[3]{k_{i}} - \frac{x}{m}$$
```

$$
\sqrt{x} + \sqrt{x^{2}+\sqrt{y}} = \sqrt[3]{k_{i}} - \frac{x}{m}
$$

## 上下标记

命令：`\overline, \underline` 分别在表达式上、下方画出水平线

```tex
$$\overline{x+y} \qquad \underline{a+b}$$
```

$$
\overline{x+y} \qquad \underline{a+b}
$$

命令：`\overbrace, \underbrace` 分别在表达式上、下方给出一个水平的大括号

```tex
$$\overbrace{1+2+\cdots+n}^{n个} \qquad \underbrace{a+b+\cdots+z}_{26}$$
```

$$
\overbrace{1+2+\cdots+n}^{n个} \qquad \underbrace{a+b+\cdots+z}_{26}
$$

## 向量

命令：`\vec`表示向量，`\overrightarrow`表示箭头向右的向量，`\overleftarrow`表示箭头向左的向量

```tex
$$\vec{a} + \overrightarrow{AB} + \overleftarrow{DE}$$
```

$$
\vec{a} + \overrightarrow{AB} + \overleftarrow{DE}
$$

## 积分、极限、求和、乘积

命令：\int表示积分，\lim表示极限， \sum表示求和，\prod表示乘积，^、_表示上、下限

```tex
$$  \lim_{x \to \infty} x^2_{22} - \int_{1}^{5}x\mathrm{d}x + \sum_{n=1}^{20} n^{2} = \prod_{j=1}^{3} y_{j}  + \lim_{x \to -2} \frac{x-2}{x} $$
```

$$
\lim_{x \to \infty} x^2_{22} - \int_{1}^{5}x\mathrm{d}x + \sum_{n=1}^{20} n^{2} = \prod_{j=1}^{3} y_{j}  + \lim_{x \to -2} \frac{x-2}{x}
$$

## 三圆点

命令：\ldots点位于基线上，\cdots点设置为居中，\vdots使其垂直，\ddots对角线排列

```tex
$$ x_{1},x_{2},\ldots,x_{5}  \quad x_{1} + x_{2} + \cdots + x_{n} $$
```

$$
x_{1},x_{2},\ldots,x_{5}  \quad x_{1} + x_{2} + \cdots + x_{n}
$$

## 重音符号

常用命令如下：

```tex
$ \hat{x} $
```

$$
\hat{x}
$$

```tex
$ \bar{x} $
```

$$
\bar{x}
$$

```tex
$ \tilde{x} $
```

$$
\tilde{x}
$$

## 矩阵

其采用矩阵环境实现矩阵排列，常用的矩阵环境有matrix、bmatrix、vmatrix、pmatrix，其区别为在于外面的括号不同：

![img](https://pic1.zhimg.com/v2-684e48900e810dff360c23b4ffe99680_r.jpg)

下列代码中，&用于分隔列，\用于分隔行

```tex
$$\begin{bmatrix}
1 & 2 & \cdots \\
67 & 95 & \cdots \\
\vdots  & \vdots & \ddots \\
\end{bmatrix}$$
```

$$
\begin{matrix}
1 & 2 & \cdots \\
67 & 95 & \cdots \\
\vdots  & \vdots & \ddots \\
\end{matrix}
$$

$$
\begin{bmatrix}
1 & 2 & \cdots \\
67 & 95 & \cdots \\
\vdots  & \vdots & \ddots \\
\end{bmatrix}
$$

$$
\begin{vmatrix}
1 & 2 & \cdots \\
67 & 95 & \cdots \\
\vdots  & \vdots & \ddots \\
\end{vmatrix}
$$

$$
\begin{pmatrix}
1 & 2 & \cdots \\
67 & 95 & \cdots \\
\vdots  & \vdots & \ddots \\
\end{pmatrix}
$$



## 希腊字母

希腊字母无法直接通过美式键盘输入获得。在LaTeX中通过反斜杠\加上其字母读音实现，将读音首字母大写即可输入其大写形式，详见下表

```tex
$$ \alpha^{2} + \beta = \Theta  $$
```

$$
\alpha^{2} + \beta = \theta
$$

![img](https://pic1.zhimg.com/v2-da3e717cf670582fbfbdddee33073524_r.jpg)



## 多行公式

## 公式组合

通过cases环境实现公式的组合，&分隔公式和条件，还可以通过\limits来让x→0位于lim的正下方而非默认在lim符号的右下方显示

```tex
$$D(x) = \begin{cases}
\lim\limits_{x \to 0} \frac{a^x}{b+c}, & x<3 \\
\pi, & x=3 \\
\int_a^{3b}x_{ij}+e^2 \mathrm{d}x,& x>3 \\
\end{cases}$$
```

$$
D(x) = \begin{cases}
\lim\limits_{x \to 0} \frac{a^x}{b+c}, & x<3 \\
\pi, & x=3 \\
\int_a^{3b}x_{ij}+e^2 \mathrm{d}x,& x>3 \\
\end{cases}
$$

## 拆分单个公式

通过split环境实现公式拆分

```tex
$$\begin{split}
\cos 2x &= \cos^2x - \sin^2x \\
&=2\cos^2x-1
\end{split}$$
```

$$
\begin{split}
\cos 2x &= \cos^2x - \sin^2x \\
&=2\cos^2x-1
\end{split}
$$

# 补充

### 上标、下标及积分等

| LaTeX                            | 符号         | 说明       |
| :------------------------------- | ------------ | ---------- |
| `a^2`                            | a2           | 上标       |
| `a_2`                            | a2           | 下标       |
| `a^{2+2}`                        | a2+2         | 组合       |
| `x_2^3`                          | x23          | 结合上下标 |
| `{}_1^2\!X_3^4`                  | 12X34        | 前置上下标 |
| `\bigcap_1^{n} p`                | ⋂1np         | 交集       |
| `\bigcup_1^{k} p`                | ⋃1kp         | 并集       |
| `x'`                             | x′           | 导数       |
| `\dot{x}`                        | x˙           | 导数点     |
| `\ddot{y}`                       | y¨           |            |
| `\vec{c}`                        | c→           | 向量       |
| `\overleftarrow{a b}`            | ab←          |            |
| `\overrightarrow{c d}`           | cd→          |            |
| `\widehat{e f g}`                | efg^         |            |
| `\overset{\frown} {AB}`          | AB⌢          | 上弧       |
| `\overline{h i j}`               | hij¯         | 上划线     |
| `\underline{k l m}`              | klm_         | 下划线     |
| `\overbrace{1+2+\cdots+100}`     | 1+2+⋯+100⏞   | 上括号     |
| `\underbrace{a+b+\cdots+z}`      | a+b+⋯+z⏟     | 下括号     |
| `\sum_{k=1}^N k^2`               | ∑k=1Nk2      | 求和       |
| `\prod_{i=1}^N x_i`              | ∏i=1Nxi      | 求积       |
| `\coprod_{i=1}^N x_i`            | ∐i=1Nxi      | 上积       |
| `\lim_{n \to \infty}x_n`         | limn→∞xn     | 极限       |
| `\int_{-N}^{N} e^x\, dx`         | ∫−NNexdx     | 积分       |
| `\iint_{D}^{W} \, dx\,dy`        | ∬DWdxdy      | 二重积分   |
| `\iiint_{E}^{V} \, dx\,dy\,dz`   | ∭EVdxdydz    | 三重积分   |
| `\oint_{C} x^3\, dx + 4y^2\, dy` | ∮Cx3dx+4y2dy | 曲线积分   |

### 根号

| LaTeX         | 符号 | 说明     |
| ------------- | ---- | -------- |
| `\sqrt{3}`    | 3    | 平方根   |
| `\sqrt[n]{3}` | 3n   | n 次方根 |

### 关系符号

| LaTeX        | 符号 | 说明     |
| ------------ | ---- | -------- |
| `\pm`        | ±    | 加减     |
| `\times`     | ×    | 乘       |
| `\div`       | ÷    | 除       |
| `\neq`       | ≠    | 不等于   |
| `\approx`    | ≈    | 约等于   |
| `\equiv`     | ≡    | 恒等于   |
| `\not\equiv` | ≢    | 不恒等于 |
| `\geq`       | ≥    | 大于等于 |
| `\gg`        | ≫    |          |
| `\leq`       | ≤    | 小于等于 |
| `\ll`        | ≪    |          |
| `\sim`       | ∼    | 相似     |
| `\simeq`     | ≃    |          |
| `\cong`      | ≅    |          |
| `\propto`    | ∝    | 正比于   |
| `\perp`      | ⊥    | 垂直     |
| `\mbox{or}`  | or   |          |

### 几何符号

| LaTeX       | 符号 | 说明   |
| ----------- | ---- | ------ |
| `\Box`      | ◻    | 正方形 |
| `\Diamond`  | ◊    | 菱形   |
| `\triangle` | △    | 三角形 |
| `\angle`    | ∠    | 角     |
| `\perp`     | ⊥    | 垂直   |
| `\mid`      | ∣    |        |
| `\nmid`     | ∤    |        |
| `\|`        | ∥    |        |
| `45^\circ`  | 45∘  | 角度   |

### 函数

| LaTeX                | 符号     | LaTeX            | 符号    |
| -------------------- | -------- | ---------------- | ------- |
| `\sin\theta`         | sin⁡θ     | `\min L`         | minL    |
| `\cos\theta`         | cos⁡θ     | `\inf s`         | infs    |
| `\tan\theta`         | tan⁡θ     | `\sup t`         | supt    |
| `\cot`               | cot      | `\exp\!t`        | expt    |
| `\sec`               | sec      | `\ln X`          | ln⁡X     |
| `\csc`               | csc      | `\lg X`          | lg⁡X     |
| `\arcsin\frac{L}{r}` | arcsin⁡Lr | `\log X`         | log⁡X    |
| `\arccos\frac{T}{r}` | arccos⁡Tr | `f \ker g`       | fker⁡g   |
| `\arctan\frac{L}{T}` | arctan⁡LT | `\log_{10}`      | log10   |
| `\sinh g`            | sinh⁡g    | `\log_\alpha X`  | logα⁡X   |
| `\cosh h`            | cosh⁡h    | `\deg x`         | deg⁡x    |
| `\tanh i`            | tanh⁡i    | `\arg x`         | arg⁡x    |
| `\operatorname{sh}j` | sh⁡j      | `\dim x`         | dim⁡x    |
| `\max H`             | maxH     | `\lim_{t\to n}T` | limt→nT |

### 集合

| LaTeX         | 符号 | LaTeX         | 符号 |
| ------------- | ---- | ------------- | ---- |
| `\forall`     | ∀    | `\exists`     | ∃    |
| `\in`         | ∈    | `\ni`         | ∋    |
| `\subset`     | ⊂    | `\subseteq`   | ⊆    |
| `\supset`     | ⊃    | `\supseteq`   | ⊇    |
| `\sqsupset`   | ⊐    | `\sqsupseteq` | ⊒    |
| `\cup`        | ∪    | `\bigcup`     | ⋃    |
| `\sqcup`      | ⊔    | `\bigsqcup`   | ⨆    |
| `\cap`        | ∩    | `\bigcap`     | ⋂    |
| `\sqsubset`   | ⊏    | `\sqsubseteq` | ⊑    |
| `\varnothing` | ∅    | `\biguplus`   | ⨄    |
| `\emptyset`   | ∅    | `\sqcap`      | ⊓    |
| `\notin`      | ∉    | `\setminus`   | ∖    |

### 逻辑与箭头

| LaTeX             | 符号 | LaTeX                 | 符号 |
| ----------------- | ---- | --------------------- | ---- |
| `\And`            | &    | `\land`               | ∧    |
| `\bar{q}`         | q¯   | `\lor`                | ∨    |
| `\lnot`           | ¬    | `\neg q`              | ¬q   |
| `\wedge`          | ∧    | `\bigwedge`           | ⋀    |
| `\vee`            | ∨    | `\bigvee`             | ⋁    |
| `\setminus`       | ∖    | `\smallsetminus`      | ∖    |
| `\leftarrow`      | ←    | `\gets`               | ←    |
| `\to`             | →    | `\rightarrow`         | →    |
| `\leftrightarrow` | ↔    | `\longleftarrow`      | ⟵    |
| `\longrightarrow` | ⟶    | `\mapsto`             | ↦    |
| `\longmapsto`     | ⟼    | `\hookrightarrow`     | ↪    |
| `\hookleftarrow`  | ↩    | `\nearrow`            | ↗    |
| `\searrow`        | ↘    | `\swarrow`            | ↙    |
| `\nwarrow`        | ↖    | `\uparrow`            | ↑    |
| `\downarrow`      | ↓    | `\updownarrow`        | ↕    |
| `\Leftarrow`      | ⇐    | `\Rightarrow`         | ⇒    |
| `\Leftrightarrow` | ⇔    | `\Longleftarrow`      | ⟸    |
| `\Longrightarrow` | ⟹    | `\Longleftrightarrow` | ⟺    |

### 括号

| LaTeX                                      | 符号       | 说明   |
| ------------------------------------------ | ---------- | ------ |
| `\left ( \frac{a}{b} \right )`             | (ab)       | 小括号 |
| `\left[ \frac{a}{b} \right]`               | [ab]       | 中括号 |
| `\left \langle \frac{a}{b} \right \rangle` | ⟨ab⟩       | 尖括号 |
| `\left\{ \frac{a}{b} \right\}`             | {ab}       | 大括号 |
| `\overbrace{ 1+2+\cdots+100 }`             | 1+2+⋯+100⏞ | 上括号 |
| `\underbrace{ a+b+\cdots+z }`              | a+b+⋯+z⏟   | 下括号 |

### 分数、矩阵、多行列式

| LaTeX                                                        | 符号                                   | 说明               |
| ------------------------------------------------------------ | -------------------------------------- | ------------------ |
| `\frac{1}{2}=0.5`                                            | 12=0.5                                 | 分数               |
| `\tfrac{1}{2} = 0.5`                                         | 12=0.5                                 | 小型分数           |
| `\dfrac{k}{k-1} = 0.5`                                       | kk−1=0.5                               | 大型分数           |
| `\dfrac{ \tfrac{1}{2}[1-(\tfrac{1}{2})^n] }{ 1-\tfrac{1}{2} } = s_n` | 12[1−(12)n]1−12=sn                     | 大小型分数嵌套     |
| `\cfrac{2}{ c + \cfrac{2}{ d + \cfrac{1}{2} } } = a \qquad \dfrac{2}{ c + \dfrac{2}{ d + \dfrac{1}{2} } } = a` | 2c+2d+12=a2c+2d+12=a                   | 连续分数           |
| `\binom{n}{k}`                                               | (nk)                                   | 二项式分数         |
| `\tbinom{n}{k}`                                              | (nk)                                   | 小型二项式系数     |
| `\dbinom{n}{k}`                                              | (nk)                                   | 大型二项式系数     |
| `\begin{matrix} x & y \\ z & v \end{matrix}`                 | xyzv                                   | 矩阵               |
| `\begin{vmatrix} x & y \\ z & v \end{vmatrix}`               | \|xyzv\|                               |                    |
| `\begin{Vmatrix} x & y \\ z & v \end{Vmatrix}`               | ∥xyzv∥                                 |                    |
| `\begin{bmatrix} 0 & \cdots & 0 \\ \vdots & \ddots & \vdots \\ 0 & \cdots & 0 \end{bmatrix}` | [0⋯0⋮⋱⋮0⋯0]                            |                    |
| `\begin{Bmatrix} x & y \\ z & v \end{Bmatrix}`               | {xyzv}                                 |                    |
| `\begin{pmatrix} x & y \\ z & v \end{pmatrix}`               | (xyzv)                                 |                    |
| `\bigl( \begin{smallmatrix} a&b\\ c&d \end{smallmatrix} \bigr)` | (abcd)                                 |                    |
| `\begin{array}{|c|c||c|} a & b & S \\ \hline 0&0&1\\ 0&1&1\\ 1&0&1\\ 1&1&0 \end{array}` | abS001011101110                        | 数组               |
| `f(n) = \begin{cases} n/2, & \mbox{if }n\mbox{ is even} \\ 3n+1, & \mbox{if }n\mbox{ is odd} \end{cases}` | f(n)={n/2,if n is even3n+1,if n is odd | 条件定义           |
| `\begin{cases} 3x + 5y + z &= 1 \\ 7x - 2y + 4z &= 2 \\ -6x + 3y + 2z &= 3 \end{cases}` | {3x+5y+z=17x−2y+4z=2−6x+3y+2z=3        | 方程组             |
| `\begin{align} f(x) & = (a+b)^2 \\ & = a^2+2ab+b^2 \end{align}` | f(x)=(a+b)2=a2+2ab+b2                  | 多行公式           |
| `\begin{alignat}{2} f(x) & = (a-b)^2 \\ & = a^2-2ab+b^2 \end{alignat}` | f(x)=(a−b)2=a2−2ab+b2                  |                    |
| `\begin{array}{lcl} z & = & a \\ f(x,y,z) & = & x + y + z \end{array}` | z=af(x,y,z)=x+y+z                      | 多行公式（左对齐） |
| `\begin{array}{lcr} z & = & a \\ f(x,y,z) & = & x + y + z \end{array}` | z=af(x,y,z)=x+y+z                      | 多行公式（右对齐） |

### 希腊字母

| LaTeX         | 符号 | LaTeX       | 符号 |
| ------------- | ---- | ----------- | ---- |
| `\Gamma`      | Γ    | `\Delta`    | Δ    |
| `\Theta`      | Θ    | `\Lambda`   | Λ    |
| `\Xi`         | Ξ    | `\Pi`       | Π    |
| `\Sigma`      | Σ    | `\Upsilon`  | Υ    |
| `\Phi`        | Φ    | `\Psi`      | Ψ    |
| `\Omega`      | Ω    | ``          |      |
| `\alpha`      | α    | `\beta`     | β    |
| `\gamma`      | γ    | `\delta`    | δ    |
| `\epsilon`    | ϵ    | `\zeta`     | ζ    |
| `\eta`        | η    | `\theta`    | θ    |
| `\iota`       | ι    | `\kappa`    | κ    |
| `\lambda`     | λ    | `\mu`       | μ    |
| `\nu`         | ν    | `\xi`       | ξ    |
| `\omicron`    | ο    | `\pi`       | π    |
| `\rho`        | ρ    | `\sigma`    | σ    |
| `\tau`        | τ    | ``          |      |
| `\upsilon`    | υ    | `\phi`      | ϕ    |
| `\chi`        | χ    | `\psi`      | ψ    |
| `\omega`      | ω    | ``          |      |
| `\varepsilon` | ε    | `\digamma`  | ϝ    |
| `\vartheta`   | ϑ    | `\varkappa` | ϰ    |
| `\varpi`      | ϖ    | `\varrho`   | ϱ    |
| `\varsigma`   | ς    | `\varphi`   | φ    |

### 声调

| LaTeX       | 符号 | LaTeX       | 符号 |
| ----------- | ---- | ----------- | ---- |
| `\acute{a}` | a´   | `\grave{a}` | a`   |
| `\hat{a}`   | a^   | `\tilde{a}` | a~   |
| `\breve{a}` | a˘   | ``          |      |
| `\check{a}` | aˇ   | `\bar{a}`   | a¯   |
| `\ddot{a}`  | a¨   | `\dot{a}`   | a˙   |

### 特殊符号

| LaTeX            | 符号 | LaTeX           | 符号 |
| ---------------- | ---- | --------------- | ---- |
| `\And`           | &    | `\eth`          | ð    |
| `\S`             | §§   | ``              |      |
| `\%`             | %    | `\dagger`       | †    |
| `\ddagger`       | ‡    | `\ldots`        | …    |
| `\cdots`         | ⋯    | `\colon`        | :    |
| `\smile`         | ⌣    | `\frown`        | ⌢    |
| `\wr`            | ≀    | `\triangleleft` | ◃    |
| `\triangleright` | ▹    | `\infty`        | ∞    |
| `\bot`           | ⊥    | `\top`          | ⊤    |
| `\vdash`         | ⊢    | `\vDash`        | ⊨    |
| `\Vdash`         | ⊩    | `\models`       | ⊨    |
| `\lVert`         | ‖    | `\rVert`        | ‖    |
| `\imath`         | ı    | `\hbar`         | ℏ    |
| `\ell`           | ℓ    | `\mho`          | ℧    |
| `\Finv`          | Ⅎ    | `\Re`           | ℜ    |
| `\Im`            | ℑ    | `\wp`           | ℘    |
| `\complement`    | ∁    | ``              |      |
| `\diamondsuit`   | ♢    | `\heartsuit`    | ♡    |
| `\clubsuit`      | ♣    | `\spadesuit`    | ♠    |
| `\Game`          | ⅁    | `\flat`         | ♭    |
| `\natural`       | ♮    | `\sharp`        | ♯    |

[更多 LaTeX 数学符号](https://meta.wikimedia.org/w/index.php?title=Help:Displaying_a_formula/zh&uselang=zh)

## 示例数学方程

\1. 有部分数学符号可以直接从键盘上输入，例如 + - = / ( ) 等等。形成一个有效公式，需要相关的数学符号组合成对应的命令。

| `\forall x \in X, \quad \exists y \leq \epsilon` | ∀x∈X,∃y≤ϵ |
| ------------------------------------------------ | --------- |
|                                                  |           |

\2. 运算符是一个用单词组成的函数，例如三角函数（正弦，余弦，正切），对数和指数（log，exp），极限（lim）以及迹线和行列式（tr，det）。

| `\cos (2\theta) = \cos^2 \theta - \sin^2 \theta` | cos⁡(2θ)=cos2⁡θ−sin2⁡θ |
| ------------------------------------------------ | ------------------- |
| `\lim\limits_{x \to \infty} \exp(-x) = 0`        | limx→∞exp⁡(−x)=0     |

\3. 幂函数和指数函数在公式命令中，通过上标和下标符号来表示。如果上标或者下标内容包含多个字符，需要使用大括号来将其区分。

| `k_{n+1} = n^2 + k_n^2 - k_{n-1}` | kn+1=n2+kn2−kn−1    |
| --------------------------------- | ------------------- |
| `f(n) = n^5 + 4n^2 + 2 |_{n=17}`  | f(n)=n5+4n2+2\|n=17 |

\4. 通过使用 \frac{numerator}{denominator} 命令可以创建分数。同时可以使用 \binom 来显示二项式系数。

| `\frac{n!}{k!(n-k)!} = \binom{n}{k}` | n!k!(n−k)!=(nk) |
| ------------------------------------ | --------------- |
|                                      |                 |

\5. 连续分数可以使用 \cfrac 命令。

| `\begin{equation} x = a_0 + \cfrac{1}{a_1 + \cfrac{1}{a_2 + \cfrac{1}{a_3 + \cfrac{1}{a_4} } } } \end{equation}` | x=a0+1a1+1a2+1a3+1a4 |
| ------------------------------------------------------------ | -------------------- |
|                                                              |                      |

\6. 通过使用 \sqrt 命令可以创建一个 n 次方根，你可以在中括号 [ ] 和 大括号 { } 中定义方程具体内容。

| `\sqrt[n]{1+x+x^2+x^3+\dots+x^n}` | 1+x+x2+x3+⋯+xnn |
| --------------------------------- | --------------- |
|                                   |                 |

\7. 同情情况下，数学公式的表达会因为大小而不同，所以表达式周围的定界符应当相应变化。你可以使用\left, \right 和 \middle 命令来完成操作。

| `P\left(A=2\middle|\frac{A^2}{B}>4\right)` | P(A=2\|A2B>4) |
| ------------------------------------------ | ------------- |
| `\left.\frac{x^3}{3}\right|_0^1`           | x33\|01       |

\8. 你可以通过矩阵环境来创建基础的矩阵公式：与其他类似表格结构的命令一样，通过双反斜杠创建新的行，& 符号分割来创建列。

| `A_{m,n} = \begin{pmatrix} a_{1,1} & a_{1,2} & \cdots & a_{1,n} \\ a_{2,1} & a_{2,2} & \cdots & a_{2,n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m,1} & a_{m,2} & \cdots & a_{m,n} \end{pmatrix}` | Am,n=(a1,1a1,2⋯a1,na2,1a2,2⋯a2,n⋮⋮⋱⋮am,1am,2⋯am,n) |
| ------------------------------------------------------------ | -------------------------------------------------- |
|                                                              |                                                    |
