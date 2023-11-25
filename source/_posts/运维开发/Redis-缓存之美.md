---
title: Redis-缓存之美
date: 2023-11-25 10:45:31
tags:
  - Redis
sticky: 60
excerpt: 一些关于 redis 作为缓存数据库的学习笔记
author: fcs
index_img: https://picsum.photos/800/250
---
![](https://picsum.photos/800/250)
# NoSQL 综述
NoSQL 是一个用于描述非关系型数据库的术语。它代表了一类数据库管理系统，这些系统不使用传统的关系型数据库模型，而是采用其他数据模型来存储和检索数据。
NoSQL 数据库的特点包括：
1. *非结构化数据存储*：NoSQL 数据库不要求固定的表结构，可以灵活地存储和处理非结构化或半结构化数据。
2. *水平扩展性*：NoSQL 数据库通常支持水平扩展，可以在需要时添加更多的服务器来处理增加的负载。
3. *高性能*：由于不使用复杂的关系模型和查询语言，NoSQL 数据库通常具有高性能和低延迟。
4. 分布式计算：NoSQL 数据库通常使用分布式计算技术，在多个服务器上进行并行处理和存储数据。
5. *丰富的数据模型*：NoSQL 数据库支持多种数据模型，如键值对、文档、列族、图形等。

根据数据模型的不同，NoSQL 数据库可以分为几种类型：
1. ==键值对存储==：最简单的 NoSQL 数据库类型，以键值对方式存储数据。例如 Redis 、Memcached 等。
2. ==文档存储==：以类似 JSON 格式的文档方式存储数据。例如 MongoDB、CouchDB 等。
3. ==列族存储==：以列族方式存储数据，适用于大数据和分布式环境。例如 HBase、Cassandra 等。
4. ==图形存储==：以图形结构方式存储数据，适用于复杂的关系查询。例如 Neo4j、OrientDB 等。

NoSQL 数据库在大数据、实时分析、云计算等领域具有广泛的应用。它们可以处理海量的非结构化数据，并提供高性能的读写操作。与传统的关系型数据库相比，NoSQL 数据库具有更好的横向扩展性和高可用性，可以在集群中分布数据并实现数据的自动复制和故障恢复。
在大数据领域，NoSQL 数据库可以处理海量的数据，并支持并行计算和分布式存储。它们通常采用分布式架构，可以将数据存储在多个节点上，并通过并行计算来处理查询和分析任务。
在实时分析领域，NoSQL 数据库可以提供低延迟的查询和分析能力。它们通常采用内存存储或者基于索引的存储方式，可以快速地查找和处理数据。
在云计算领域，NoSQL 数据库可以轻松地扩展和部署。它们通常具有自动化管理和弹性伸缩的功能，可以根据需求来增加或减少资源。
总之，NoSQL 数据库在大数据、实时分析、云计算等领域具有广泛应用，并且不断发展创新。它们能够有效地处理海量数据，并提供高性能和可靠性。
# 基本操作
## 切换数据库
通过 select 语句进行切换数据库，默认有 0 到 15 号数据库。
```shell
select index #index为redis数据库的序号，默认有16个（0~15）
```
## 数据操作
redis 的基本数据操作
1. 设置键值对：使用 SET 命令可以设置一个键值对，例如：`SET key value`。
2. 获取值：使用 GET 命令可以获取指定键的值，例如：`GET key`。
3. 删除键值对：使用 DEL 命令可以删除指定的键值对，例如：`DEL key`。
4. 检查键是否存在：使用 EXISTS 命令可以检查指定的键是否存在，例如：`EXISTS key`。
5. 设置过期时间：使用 EXPIRE 命令可以为指定的键设置过期时间，例如：`EXPIRE key seconds`。
6. 查看剩余过期时间：使用 TTL 命令可以查看指定键的剩余过期时间，例如：`TTL key`。
7. 自增和自减操作：使用 INCR 和 DECR 命令可以对指定的数值进行自增和自减操作，例如：`INCR key`, `DECR key`。
8. 列表操作：Redis 提供了一系列列表操作命令，如 LPUSH、RPUSH、LPOP、RPOP 等，用于在列表头部或尾部插入、删除元素等操作。
9. 哈希表操作：Redis 提供了一系列哈希表操作命令，如 HSET、HGET、HDEL 等，用于在哈希表中设置、获取、删除字段等操作。
10. 集合操作：Redis 提供了一系列集合操作命令，如 SADD、SREM、SMEMBERS 等，用于添加、删除、获取集合中的元素等操作。
11. 有序集合操作：Redis 提供了一系列有序集合操作命令，如 ZADD、ZREM、ZRANGE 等，用于添加、删除、获取有序集合中的元素等操作。

**详细介绍：**
1. 添加数据: 

```sh
set <key> <value> -- 一次多个
mset <key1> <value1> <key2> <value2> ...
```
所有存入的改据默认会以**字符串**的形式保存，键值具有一定的命名规范，以方便我们可以快速定位我们的数据属于哪一个部分，比如用户的数据：
```sh
-- 使用冒号来进行板块分划，比如下面表示用户XXX的信息中的name属性，值为lbw
set user:info:用户ID:name lbw
```
2. 添加数据并设置过期时间：
```sh
set key value ex/px seconds #ex：对应秒；px：对应毫秒
setex key seconds value
```
3. 获取数据：
```sh
get <key> --获取指定键数据
keys * --获取所有键
randomkey --随机获取一个键
```
4. 设置过期时间：
```sh
expire key seconds
```
5. 查看过期时间：
```sh
ttl key -- 以秒为单位显示剩余有效存储时间
pttl key -- 以毫秒为单位
persist key --转为永久存储
```
6. 判断键是否存在：
```sh
exists key --存在则返回1，不存在则返回0
```
7. 迁移键到其他数据库：
```sh
move key index
```
8. 修改键名：
```sh
rename oldKey newKey --不会检查newKey是否存在
renamex oldKey newKey --会检查newKey是否存在
```
9. 自增/减数字：
```sh
incr key --返回自增1后的值
incrby key increment --返回自增increment后的值
decr key --返回自减1后的值
decrby key decrement --返回自减increment后的值
```
10. 查看数据类型：
```sh
type key
```
11. 删除数据：
```sh
del key [key ...] --删除一个或多个键
```
# 数据类型
Redis 支持多种数据类型，包括：
1. **字符串（String）**：最基本的数据类型，可以存储任何类型的数据，如文本、二进制数据等。
2. **列表（List）**：有序的字符串列表，可以在列表的两端插入和删除元素，还可以根据索引获取元素。
3. **集合（Set）**：无序的字符串集合，不允许有重复元素，可以进行交集、并集、差集等操作。
4. **散列（Hash）**：键值对的无序散列表，适用于存储对象。
5. **有序集合（Sorted Set）**：类似于集合，但每个元素都关联一个分数（score），可以按照分数排序。
6. **Bitmaps**：位图数据类型，可以对位图进行位操作。
7. **HyperLogLogs**：基数估算算法实现的数据结构，用于计算一个集合中不重复元素的个数。
8. **地理空间索引（Geospatial Indexes）**：存储地理位置信息，并支持地理位置相关的查询操作。

这些数据类型具有丰富而灵活的功能，在使用 Redis 时能够满足各种不同的需求。

## Hash

这种类型本质上就是一个 HashMap,也就是嵌套了一个 HashMap 罢了，在 Java 中就像这样：
```java
//Redis默认存String类似于这样：
Map<string,String>hash new HashMap;
//Redisi存Hash类型的政据类似于这样：
Map<String,Map<String,String>>hash new HashMap();
```
它比较适合存储类这样的数据，由于值本身又是一个 Map,因此我们可以在此 Map 中放入类的各种属性和值，以实现一个 Hsh 数据类型存储一个类的数据。
1. 添加：
```sh
hset <key> <field> <value> --添加hash数据（只能指定一个字段和值）
hmset <key> <field> <value> [field value ...] --添加多对字段和值
```
2. 获取键值：
```sh
hget key 字段 --获取指定字段
hmget key field [field ...] --获取多个指定字段
hgetall key --如果想要一次性获取所有的字段和值
hvals key --获取键的所有值
```
3. 判存：
```sh
hexists key field --存在则返回1，否则返回0
```
4. 删除：
```sh
hdel key field [field ...] --删除一个或多个字段
```
5. 获取长度：
```sh
hlen key
```
> 难一需要注意的是，==Hash 中只能存放字符串值==，不允许出现嵌套的的情况。

## List

List 类型就是一个列表，而列表中存放一系列的字符串，它支持随机访问，支持双端操作，就像我们使用 Java 中的 LinkedList 一样。
我们可以直接向一个已存在或是不存在的 List 中添加数据，如果不存在，会自动创建：
1. 添加：
```sh
--向列表头部添加元素
lpush <key> <element>...
--向列表尾部添加元素
rpush <key> <element>...
--在指定元素前面/后面插入元素
linsert <key> before/after <指定元素> <element>
```
2. 获取：
```sh
--根据下标获取元素
lindex <key> <index>
--获取并移除头部元素
lpop <key>
--获取并移除尾部元素
rpop <key>
--获取指定范围内的
lrange <key> start stop
注意下标可以使用负数来表示从后到前数的数字
--获取列表Q中的全部元素
lrange a 0 -1
```
3. 取尾置头：
```sh
-- 从前一个数组的最后取一个数出来放到另一个数组的头部，并返回元素
rpoplpush source destination
```
4. 阻塞操作（类似于生产者和消费者，比如我们想要等待列表中有了数据后再进行poρ操作）:
```sh
--如果列表中没有元素，那么就等待，如果指定时间（秒）内被添加了数据，那么就执行pop操作，如果超时就作废，支持同时等待多个列表，只要其中一个列表有元素了，那么就能执行
blpop <key>...timeout
```
## Set和SortedSet

