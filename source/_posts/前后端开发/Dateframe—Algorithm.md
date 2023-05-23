---
title: algorithm  
date: 2023-03-17 19:06:15  
tags: [Dataframe-Algorithm] 
sticky: 65
excerpt: some key points with respect to dataframe-algorithm
---

# 1.线性表

> 无论哪种数据结构，都存在<font color="#ff0000">增删改查 (按值查找)查（按位查找）</font>操作，对应不同操作的<font color="#4bacc6">时间复杂度不同</font>，要根据实际数据的形式选择合适的数据结构进行存储，再选择合适算法进行处理。



## 顺序表（sequence list）
### 1初始化

### 2增加元素

### 3删除元素

### 4修改元素

### 5查找元素

#### 按值查找


#### 按位查找

## 链表（link list）
### 1初始化

### 2增加元素

#### 头插

#### 尾插

### 3删除元素

### 4修改元素

### 5查找元素


#### 按值查找


#### 按位查找

# 2.栈
> 栈是一种<font color="#8064a2">后进先出（LIFO）</font>的线性表结构。

<span style="background:rgba(240, 107, 5, 0.2)">顺序栈：</span>
```c
typedef struct {SElemType *base;
				SElemType *top;
				int stacksize;} SgStack;
```

<span style="background:#b1ffff">链栈：</span>

```c
typedef struct StackNode{
SElemType data;
struct StackNode *next;}StackNode,*LinkStack;

```


## 1初始化

<span style="background:rgba(240, 107, 5, 0.2)">顺序栈：</span>
```c
Status InitStack(SgStack &S,int MAXSIZE{
S.base =new SElemType [MAXSIZE]；
if(!S.base） 
   return OVERFLOW;
   S.top = S.base;
   S.stacksize = MAXSIZE；
   return OK;
```

<span style="background:#b1ffff">链栈：</span>

**不带头节点：**
```c
void Initstack (LinkStack &S)
{
	S=NULL;
}

```


## 2 入栈

<span style="background:rgba(240, 107, 5, 0.2)">顺序栈：</span>
时间复杂度：O（1）
```c

Status Push(SqStack &S,SElemType e)
{
if(S.top - S.base==S.stacksize）return ERROR;
*S.top++=e;
return OK;
}
```

这段代码是一个名为 `Push` 的函数，它接受两个参数：一个指向栈 `S` 的指针引用和要入栈的元素 `e`。`SqStack` 表示栈的类型，在这里推测它是由结构体或类定义的。`&S` 表示将栈变量的地址传递给函数，通过引用来修改栈的内容。在 C/C++中，引用有时候也被称为别名(alias)，它允许我们使用类似于指针的语法来操作对象，但是具有更好的安全性和易读性。`SElemType` 是栈元素的数据类型，可以是任何合法的数据类型。

这个函数的作用是将元素e压入到栈S中，如果栈已满则返回ERROR，否则在栈顶插入元素e并返回OK。其中`S.top - S.base` 表示当前栈中已有元素的个数，如果这个值等于`S.stacksize`就意味着栈已经满了。`*S.top++=e`表示将元素e存储在栈顶，并将栈指针往上移动一位，准备接收下一个元素。最后，函数返回插入操作的结果，OK表示成功，ERROR表示失败。

<span style="background:#b1ffff">链栈：</span>
**头插**
```c
Status Push (LinkStack&S,ElemType e){
p=new StackNode;//生成新结点p
if (!p)return OVERFLOW;
p->data=e;
p->next=S;
S=p;//S始终指向当前第一个节点(栈顶节点)
return OK;

```


## 3 出栈

<span style="background:rgba(240, 107, 5, 0.2)">顺序栈：</span>
```c
Status Pop(SqStack &S,SElemType &e)
{
if(S.top == S.base）return ERROR;
e=*--S.top;
return OK;
}

```

<span style="background:#b1ffff">链栈：</span>

```c
Status Pop (LinkStack &S,SElemType &e)
{
	if (S==NULL)
		return ERROR;
	e = S->data;
	p = S;
	S = S->next;
	delete p;
	return OK;
}

```


# 3. 队列
> 队列是一种先进先出（FIFO）的线性表，只允许在表的一端插入，另一端删除。

<font color="#8064a2">顺序队列：</font>
```c
Typedef struct {
QElemType *base;//初始化的动态分配存储空间
int front;//头指针
int rear;//尾指针
}SgQueue;

```


<font color="#f79646">链队列：</font>

```c
typedef struct QNode
{
	QElemType data;
	struct Qnode *next;
}Qnode,*QueuePtr;
typedef struct 
{
	QueuePtr front;//队头指针
	QueuePtr rear;//队尾指针
}LinkQueue;

```


## 1 初始化

<span style="background:#d3f8b6">顺序队列：</span>

```c
Status InitQueue (SgQueue &Q)
{
Q.base = new QElemType[MAXQSIZE];
if (!Q.base)
	exit (OVERFLOW);
Q.front=Q.rear=0;
return OK;
}

```


<span style="background:#fdbfff">链队列：</span>
**有头节点**
```c
Status InitQueue (LinkQueue &Q){
Q.front=(QueuePtr)malloc(sizeof(QNode));
if(!Q.front)
exit(OVERFLOW);
Q.rear=Q.front;
Q.front->next=NULL;
return OK;
}

```



<span style="background:#d3f8b6">队空标志：front==rear</span>
<span style="background:#d3f8b6">队满标志：（rear+1）%M=front</span>（循环队列）

## 2 入队
**链接新节点，更新队尾节点**

<span style="background:#d3f8b6">顺序队列：</span>
```c
Status EnQueue(SqQueue &Q,QElemType e)
{	if((Q.rear+1)%MAXQSIZE==Q.front)
		return ERROR;
	Q.base[Q.rear]=e;
	Q.rear=(Q.rear+1)%MAXQSIZE;
	return OK;
}

```


<span style="background:#fdbfff">链队列：</span>
```c
Status EnQueue (LinkQueue &Q,QElemType e){
p=(QueuePtr)malloc(sizeof (QNode));
if(!p)
	exit(OVERFLOW);
p->data=e;
p->next=NULL;
Q.rear->next=p;
Q.rear=p;
return OK;
}
```

## 3 出队
**临时存储首元节点，队头节点指向首元节点的下一个节点，删除释放首元节点**

<span style="background:#d3f8b6">顺序队列：</span>
```c
Status DeQueue (LinkQueue &Q,QElemType &e)
{
if(Q.front==Q.rear)
	return ERROR;
e=Q.base[Q.front];
Q.front=(Q.front+1)%MAXQSIZE;
return OK;
}
```


<span style="background:#fdbfff">链队列：</span>
```c
Status DeQueue (LinkQueue &Q,QElemType &e{
if(Q.front==Q.rear)
	return ERROR;
p=Q.front->next;
e=p->data;
Q.front->next=p->next;
if(Q.rear==p)
	Q.rear=Q.front;
free(p);
return OK;
}
```
<span style="background:rgba(240, 200, 0, 0.2)">最后一个节点的时候，不删除，要让队头等于队尾节点。</span>

## 4 取队列长度

<span style="background:#d3f8b6">顺序队列：</span>
```c
int QueueLength(SqQueue Q)
{
	return (Q.rear-Q.front+MAXQSIZE)%MAXQSIZE;
}

```

<span style="background:#fdbfff">链队列：</span>
```c


```





# 4. 串、数组和广义表




# 5. 树





# 6. 图






# 7.