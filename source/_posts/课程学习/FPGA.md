---
title: FPGA_Notes
tags: [FPGA]
categories: FPGA
date: 2022-10-3 10:00:00
sticky: 50
excerpt: some notation about FPGA。
---

# FPGA_Notes

## Verilog

### 语法

#### 语句块

- 顺序块：
`begin`
`end`
- 并行块：
`fork`
`join`

#### 多路分支语句

```verilog
case()
    condition1
    condition2
    endcase
casez(sel)
          4'b???1:     sout_t = p0 ;
          4'b??1?:     sout_t = p1 ;
          4'b?1??:     sout_t = p2 ;
          4'b1???:     sout_t = p3 ;  
      default:         sout_t = 2'b0 ;
endcase
```

#### 循环语句

```verilog
while()
 begin
 end
for(initial_assignment; condition ; step_assignment)  
begin
  …
end
repeat(num)
 begin
 end
forever
 begin
 end
```
#### 模块例化

- 不带参数例化

```verilog
//output 端口 Co 悬空
full_adder1  u_adder0(
  .Ai     (a[0]),
  .Bi     (b[0]),
  .Ci     (c==1'b1 ? 1'b0 : 1'b1),
  .So     (so_bit0),
  .Co     ());

//output 端口 Co 删除
full_adder1  u_adder0(
    .Ai     (a[0]),
    .Bi     (b[0]),
    .Ci     (c==1'b1 ? 1'b0 : 1'b1),
    .So     (so_bit0));
```
- 带参数例化

```verilog
//instantiation
defparam     u_ram_4x4.MASK = 7 ;
ram_4x4    u_ram_4x4
    (
        .CLK    (clk),
        .A      (a[4-1:0]),
        .D      (d),
        .EN     (en),
        .WR     (wr),    //1 for write and 0 for read
        .Q      (q)    );
```
#### 函数

函数只能在模块中定义，位置任意，并在模块的任何地方引用，作用范围也局限于此模块。函数主要有以下几个特点：

1. 不含有任何延迟、时序或时序控制逻辑
2. 至少有一个输入变量
3. 只有一个返回值，且没有输出
4. 不含有非阻塞赋值语句
5. 函数可以调用其他函数，但是不能调用任务

Verilog 函数声明格式如下：

```verilog
function [range-1:0]     function_id ;
input_declaration ;
 other_declaration ;
procedural_statement ;
endfunction
```
**模块实例**

```verilog
module endian_rvs
	#(parameter N = 4)
	    (
	        input             en,     //enable control
	        input [N-1:0]     a ,
	        output [N-1:0]    b
	);
	     
	    reg [N-1:0]          b_temp ;
	    always @(*) begin
	    if (en) begin
	            b_temp =  data_rvs(a);
	        end
	        else begin
	            b_temp = 0 ;
	        end
	end
	    assign b = b_temp ;
	     
	//function entity
	    function [N-1:0]     data_rvs ;
	        input     [N-1:0] data_in ;
	        parameter         MASK = 32'h3 ;
	        integer           k ;
	        begin
	            for(k=0; k<N; k=k+1) begin
	                data_rvs[N-k-1]  = data_in[k] ;  
	            end
	        end
	endfunction
endmodule 
```
### 常数函数

常数函数是指在仿真开始之前，在编译期间就计算出结果为常数的函数。常数函数不允许访问全局变量或者调用系统函数，但是可以调用另一个常数函数。

这种函数能够用来引用复杂的值，因此可用来代替常量。

例如下面一个常量函数，可以来计算模块中地址总线的宽度：

```verilog
parameter    MEM_DEPTH = 256 ;
reg  [logb2(MEM_DEPTH)-1: 0] addr ; //可得addr的宽度为8bit
 
    function integer     logb2;
    input integer     depth ;
        //256为9bit，我们最终数据应该是8，所以需depth=2时提前停止循环
    for(logb2=0; depth>1; logb2=logb2+1) begin
        depth = depth >> 1 ;
    end
endfunction
```

### automatic 函数

在 Verilog 中，一般函数的局部变量是静态的，即函数的每次调用，函数的局部变量都会使用同一个存储空间。若某个函数在两个不同的地方同时并发的调用，那么两个函数调用行为同时对同一块地址进行操作，会导致不确定的函数结果。

Verilog 用关键字 automatic 来对函数进行说明，此类函数在调用时是可以自动分配新的内存空间的，也可以理解为是可递归的。因此，automatic 函数中声明的局部变量不能通过层次命名进行访问，但是 automatic 函数本身可以通过层次名进行调用。

下面用 automatic 函数，实现阶乘计算：

>```verilog
>wire [31:0]      results3 = factorial(4);
>function automatic integer    factorial ;
>input integer   data ;
>integer     i ;
>begin
>factorial = (data>=2)? data * factorial(data-1) : 1 ;
>end
>endfunction// factorial
>```





### 常见指令

- $display
(类似于c的print,自动换行,运行时显示)
- $write
(和display功能一样,不换行)
- $monitor
(监视变量的变化，只要变则输出)
- $strobe
(活动结束后显示)
- $stop
(暂停仿真)
- $finish
(结束仿真)
- $time
(返回一个64位整数时间值)
$stime
(返回一个32位整数时间值)
$realtime
(返回-一个实数时间值)
- ( 1) Srandom和$random()
意义一样,都是产生32带符号整数随机数
( 2) $random%100 
在-99到99之间产生随机数
(3) {Srandom}%100 
采用位拼接符,在0到100之间产生随机数
(4) 如seed =10, Srandom(seed) 
根据seed值产生随机数,而后seed值也会更新
- （读取文件中的数据,内容必须为空格、换行、制表格、注释行、二进制或十六进制的数字）
$readmemb(" <数据文件名>", <存贮器名>);
$readmemb("<数据文件名>",<存贮器名>,<起始地址>);
Sreadmemb(" <数据文件名>", <存贮器名>,<起始地址>, <结束地址>);
$readmemh(" <数据文件名>", <存贮器名>);
$readmemh(" <数据文件名>",<存则器名>,<起始地址>);
$readmemh("<数据文件名>",<存贮器名>,<起始地址>, <结束地址>);

## ModelSim



## 分支主题 3

