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

---
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

---
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
4. 阻塞操作（类似于生产者和消费者，比如我们想要等待列表中有了数据后再进行 poρ操作）:
```sh
--如果列表中没有元素，那么就等待，如果指定时间（秒）内被添加了数据，那么就执行pop操作，如果超时就作废，支持同时等待多个列表，只要其中一个列表有元素了，那么就能执行
blpop <key>...timeout
```
## Set 和 SortedSet
Set 集合其实就像 Java 中的 HashSet 一样（我们在 JavaSE 中已经讲解过了，HashSet 本质上就是利用了一个 HashMap,但是 Value 都是固定对象，仅偃是 Key 不同)它不允许出现重复元素，不支持随机访问，但是能够利用 Hash 表提供极高的查找效率。
1. 添加元素：
```sh
sadd <key> <value> ...
```
2. 查看数量：
```sh
scard <key>
```
3. 判断是否包含：
```sh
--是否包含指定值
sismember <key> <value>
--列出所有值
smembers <key>
```
4. 集合之间的运算：
```sh
--集合之间的差集
sdiff <key1> <key2>
--集合之间的交集
sinter <key1> <key2>
--求并集(自动去重)
sunion <key1> <key2>
--将集合之间的差集存到目标集合中
sdiffstore 目标 <key1> <key2>
--同上
sinterstore 目标 <key1> <key2
--同上
sunionstore 目标 <key1> <key2
```
5. 移动指定值到另一个集合中：
```sh
smove <key> 目标 value
```
6. 删除：
```sh
--随机移除一个幸运儿
spop <key>
--移除指定
srem <key> <value>...
```
> 那么如果我们要求 Set 集合中的数据按照我们指定的顺序进行排列怎么办呢？这时就可以使用 SortedSet,它支持我们为每个值设定一个分数，分数的大小决定了值的位置，所以它是有序的。 

1. 添加有序集合（*根据分数降序排列*）：
```sh
zadd <key> [<value> <score>]...
```
![image.png](http://qnpicmap.fcsluck.top/pics/202311251747202.png)
2. 获取元素：
```sh
zcard key
zrange key start end （withscores）可带分数返回
zrangebyscore key score1 score2 返回指定分数之间的数据
ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count] 自定义参数
```
3. 删除元素：
```sh
zrem key value ...
```
4. 统计分数段内的数量
```sh
zcount <key> start  stop
```
5. 根据分数获取指定值的排名
```sh
zrank <key> <value>
```
> 有关 Bitmap、HyperLogLog 和 Geospatial 等数据类型不常用，如需了解请参考 [redis基本操作命令 - 简书](https://www.jianshu.com/p/32b9fe8c20e1)

---
# 持久化
因为 Redis 是内存数据库，它将自己的数据存储在内存里面，一旦 Redis 服务器进程退出或者运行 Redis 服务器的计算机停机，Redis 服务器中的数据就会丢失。
为了避免数据丢失，所以 Redis 提供了持久化机制，将存储在内存中的数据保存到磁盘中，用于在 Redis 服务器进程退出或者运行 Redis 服务器的计算机停机导致数据丢失时，快速的恢复之前 Redis 存储在内存中的数据。
Redis 持久化不保证数据的完整性，有可能会丢数据。当 Redis 用作 DB 时，DB 数据要完整，所以一定要有一个完整的数据源（文件、mysql），在系统启动时，从这个完整的数据源中将数据 load 到 Redis 中。
Redis 的有两种持久化方式，RDB 和 AOF。
### ROB
RDB（Redis DataBase），是 redis 默认的存储方式，RDB 方式是通过快照（ snapshotting ）完成的。它保存的是某一时刻的数据并不关注过程。*RDB 保存 redis 某一时刻的数据的快照*
**优点**：
1. 写入速度快：由于 ROB 只需要写入键的位图文件和相应的值文件，而不需要写入完整的数据库文件，因此写入速度比传统的 AOF 和 RDB 持久化方式更快。
2. 读取速度快：由于 ROB 只需要读取键的位图信息，并根据位图信息读取相应的值文件，因此读取速度也比传统方式更快。
3. 占用空间小：由于 ROB 只需要保存每个键是否存在的位图信息和相应的值文件，因此占用空间比传统方式更小。

**缺点**：
1. 只适用于适量大小（不超过几千万个键）的数据库。
2. 不支持复制和集群模式。
3. 服务器故障时会丢失最后一次备份之后的数据。
4. Redis 保存 rdb 时， fork 子进程的这个操作期间, Redis 服务会停止响应(一般是毫秒级)，但如果数据量大且 cpu 时间紧张，则停止响应的时间可能长达 1 秒。

总的来说，ROB 持久化是一种在特定场景下可以提供更快速、更省空间的持久化方式，但对于大规模数据集和高可用性要求的场景可能不太适用。
RDB 持久化是将某个时间点上 Redis 中的数据保存到一个 RDB 文件中，如下所示：
保存：
![image.png](http://qnpicmap.fcsluck.top/pics/202311252009138.png)
> 基于 RDB 持久化的上述性质，所以 RDB 持久化也叫做**快照持久化**。
> 该文件是一个经过压缩的二进制文件，通过该文件可以还原生成 RDB 文件时 Redis 中的数据，如下所示：

还原：
![image.png](http://qnpicmap.fcsluck.top/pics/202311252012458.png)
> **触发快照的方式**  
> 1. 符合自定义配置的快照规则；  
> 2. 执行 save 或者 bgsave 命令；  
> 3. 执行 flushall 命令；  
> 4. 执行主从复制操作 (第一次)。

> **配置参数定期执行**  
> 在 `redis.conf` 中配置：save 多少秒内数据变了多少，可以配置多个条件，满足其中一个条件就会触发生成快照，提高性能

**保存过程原理**：
![image.png](http://qnpicmap.fcsluck.top/pics/202311252307029.png)
**相关配置参数：**
```sh
save
--注意上面这个命令是直接保存，会占用一定的时间，也可以单独开一个子进程后台执行保存
bgsave
```
执行后，会在服务端目录下生成一个 dump.rb 文件，而这个文件中就保存了内存中存放的数据，当服务器重后后，云目动加载里面的内容到对应数据库中。保存后我们可以关闭服务器：
```sh
shutdown
```
重启后可以看到数据依然存在。
```conf
################################ SNAPSHOTTING  ################################
# 快照配置
# 注释掉“save”这一行配置项就可以让保存数据库功能失效
# 设置sedis进行数据库镜像的频率。
# 900秒（15分钟）内至少1个key值改变（则进行数据库保存--持久化） 
# 300秒（5分钟）内至少10个key值改变（则进行数据库保存--持久化） 
# 60秒（1分钟）内至少10000个key值改变（则进行数据库保存--持久化）
save 900 1
save 300 10
save 60 10000
#当RDB持久化出现错误后，是否依然进行继续进行工作，yes：不能进行工作，no：可以继续进行工作，可以通过info中的rdb_last_bgsave_status了解RDB持久化是否有错误
stop-writes-on-bgsave-error yes
#使用压缩rdb文件，rdb文件压缩使用LZF压缩算法，yes：压缩，但是需要一些cpu的消耗。no：不压缩，需要更多的磁盘空间
rdbcompression yes
#是否校验rdb文件。从rdb格式的第五个版本开始，在rdb文件的末尾会带上CRC64的校验和。这跟有利于文件的容错性，但是在保存rdb文件的时候，会有大概10%的性能损耗，所以如果你追求高性能，可以关闭该配置。
rdbchecksum yes
#rdb文件的名称
dbfilename dump.rdb
#数据目录，数据库的写入会在这个目录。rdb、aof文件也会写在这个目录
dir /var/lib/redis
```
## **AOF 持久化**
AOF 其实就是将客户端每一次操作记录追加到指定的 aof（日志）文件中，在 aof 文件体积多大时可以自动在后台重写 aof 文件（期间不影响正常服务，中途磁盘写满或停机等导致失败也不会丢失数据）
**优点**
- 充分保证数据的持久化，正确的配置一般最多丢失 1 秒的数据
- aof 文件内容是以 Redis 协议格式保存，易读

**缺点**
- aof 文件通常大于 rdb 文件
- 速度会慢于 rdb, 具体得看具体 fsyn 策略
- 重新启动 redis 时会极低的概率会导致无法将数据集恢复成保存时的原样(概率极低, 但确实出现过)

**AOF 持久化原理：**
![image.png](http://qnpicmap.fcsluck.top/pics/202311252327646.png)
**aof 持久化的 fsync 策略支持**：
- 不执行 fsync：由操作系统保证数据同步到磁盘(linux 默认 30 秒)，速度最快
- 每秒 1 次：每秒钟保存一次，最多丢失最近 1s 的数据（推荐，默认配置）
- 每条命令：每次执行写操作都会保存一次，绝对保证数据持久化（影响性能）

> fsync：同步内存中所有已修改的文件数据到储存设备

aof 文件是一个只追加的文件, 若写入了不完整的命令(磁盘满, 停机...)时, 可用自带的 `redis-check-aof` 工具轻易修复问题：执行 `redis-check-aof --fix`
aof 文件过大时会触发自动重写, 重写后的新 aof 文件包含了恢复当前数据集所需的最少的命令集合.
> 客户端多次对同一个键 incr 时, 操作 N 次则会写入 N 条, 但实际上只需一条 set 命令就可以保存该值, 重建就是生成足够重建当前数据集的最少命令。  
> Redis 重写 aof 操作同样是通过 fork 子进程来处理的.

**命令行临时配置 aof:**
```c
CONFIG SET appendonly yes
```
> 仅当前实例生命周期内有效

**配置文件持久配置 aof：**
```c
#注意得改成也是
appendonly yes
#appendfsync always
appendfsync everysec
#appendfsync no
```
重启服务器后，可以看到服务器目录下多了一个 appendonly.aof 文件，存储的就是我们执行的命令。
AOF 的缺点也很明显，每次服务器启动都需要进行过程重演，相比 RDB 更加耗费时间，并且随着我们的操作变多，不断累计，可能到最后我们的 aof 文件会变得无比巨大，我们需要一个改进方案来优化这些问题。
Redis 有一个 AOF 重写机制进行优化，比如我们执行了这样的语句：
```c
lpush test 666
lpush test 777
lpush test 888
//实际上用一条语句也可以实现：
lpush test 666 777 888
```
正是如此，只要我们能够保证最终的重演结果和原有语句的结果一致，无论语句如何修改都可以，所以我们可以通过这种方式将多条语句进行压缩。
我们可以输入命令来手动执行重写操作：
```c
bgrewriteaof
```
或是在配置文件中配置自动重写
```sh
#百分比计算，这里不多介绍
auto-aof-rewrite-percentage 100
#当达到这个大小时，触发自动重写
auto-aof-rewrite-min-size 64mb
```
**总结:**
- AOF:
	- 优点：存储速度快、消耗资源少、支持实时存储
	- 缺点：加载速度慢、数据体积大
- RDB:
	- 优点：加载速度快、数据体积小
	- 缺点：存储速度慢大量消耗资源、会发生数据丢失

---
# 事务和锁机制
## 事务
和 MySQL 一样，在 Rdis 中也有事务机制，当我们需要保证多条命令一次性完整执行而中途不受到其他命令干扰时，就可以使用事务机制。
1. 开启事务：
```c
multi
```
2. 执行事务：
```c
exec
```
3. 中途取消事务：
```c
discard
```
实际上整个事务是创建了一个*命令队列*，它不像 MySQL 那种在事务中也能单独得到结果，而是我们提前将所有的命令*装在队列中，但是并不会执行*，而是等我们*提交事务的时候再统一执行*。
## 锁
实际上在 Redis 中也会出现多个命令同时竞争同一个数据的情况，比如现在有两条命令同时执行，他们都要去修改的值，那么这个时候就只能动用锁机制来保证同一时间只能有一个命令操作。
虽然 `Redis中也有锁机制，但是它是一种乐观锁`，不同于 MySQL,我们在 MySQL 中认识的锁是悲观锁，那么什么是乐观锁什么是悲观锁呢？
- 悲观锁：时刻认为别人会来抢占资源，==禁止一切外来访问，直到释放锁==，具有强烈的排他性质。
- 乐观锁：并不认为会有人来抢占资源，所以会==直接对数据进行操作，在操作时再去验证是否有其他人抢占资源==。

Redis 中可以使用 watch 来监视一个目标，如果***执行事务之前被监视目标发生了修改，则取消本次事务***：
```c
watch
```
我们可以开两个客户端进行测试。
取消监视可以使用：
```c
unwatch
```
> 乐观锁采用版本号来区分是否被修改，从而避免 ABA（即将 A 修改为 B 再修改为 A）问题。

```image-layout-a
![image.png](http://qnpicmap.fcsluck.top/pics/202311261046338.png)
![image.png](http://qnpicmap.fcsluck.top/pics/202311261046425.png)
```

---
# Java 与 Redis 交互
这里我们需要使用到 Jedis 框架，它能够实现 Java 与 Redis 数据库的交互，依赖：
```xml
<dependencies>
	<dependency>
		<groupId>redis.clients</groupId>
		<artifactId>jedis</artifactId>
		<version>4.0.0</version>
	</dependency>
</dependencies>
```
## 基本操作
我们来看看如何连接 Redis 数据库，非常简单，只需要创建一个对象即可：
```java
public static void main(String[] args) {  
    try (Jedis jedis = new Jedis("127.0.0.1", 6379);  
    ) {  
		jedis.auth("123456");  
		jedis.keys("*").forEach(System.out::println);  
		jedis.set("a", "zhangsan");  
		System.out.println(jedis.get("a")); 
    }  
}
```
通过 Jedis 对象，我们就可以直接调用命令的同名方法来执行 Redis 命令了，比如：
- Hash 类型：
```java
public static void main(String]args){
try(Jedis jedis new Jedis("127.0.0.1",6379)){
jedis.hset("hhh","name","sxc");//等同于hset hhh name sxc
jedis.hset("hhh","sex","19");//等同于hset hhh age19
jedis.hgetAll("hhh").forEach((k,v)->System.out.println(k+":"+v));
}
```
- 列表操作：
```java
public static void main(String]args){
try(Jedis jedis new Jedis("127.0.0.1",6379)){
jedis.lpush("mylist","111","222","333");//等同于lpush my1ist 111 222 333命令
jedis.lrange("mylist",0,-1).forEach(System.out::println);//等同手lrange mylist0-1
}
```
实际上我们只需要按照对应的操作去调用同名方法即可，所有的类型封装 Jedis 已经帮助我们完成了。
## SpringBoot 整合 Redis
1. 导入依赖

```xml
<dependencies>  
    <dependency>        
	    <groupId>org.springframework.boot</groupId>  
        <artifactId>spring-boot-starter-data-redis</artifactId>  
    </dependency>  
</dependencies>
```
2. 填加 spring.data.redis 相关配置
```yml
server:  
  port: 8080 # 主要用于配置Spring Boot应用程序的端口  
spring:  
  application:  
    name: springboot-redis # 主要用于设置Spring Boot应用程序的名称  
  data:  
    redis:  
      host: 127.0.0.1 # 主要用于配置Redis服务器的主机地址  
      port: 6379 # 主要用于配置Redis服务器的端口号  
      password: 123456 # 主要用于配置Redis服务器的密码  
      database: 0 # 主要用于配置Redis服务器的数据库索引（从0开始）  
      timeout: 1000 # 主要用于配置Redis操作的超时时间（以毫秒为单位）
```
3. 依赖默认为我们提供了两个模板类 RedisTemplate 和 StringRedisTemplate 方便操作 redis
```java
@SpringBootTest
class SpringBootRedisApplicationTests {
    @Resource
    StringRedisTemplate stringRedisTemplate;  // Spring Boot 配置文件注入 Redis 的 String 类型模板
    @Test
    void redisTest() {
        stringRedisTemplate.opsForValue().set("user:info:1:name", "zhangSan", 1, TimeUnit.MINUTES);  // 将键值对 "user:info:1:name" 的值设置为 "zhangsan" 存入 Redis
        stringRedisTemplate.opsForValue().set("user:info:1:age", "21", 1, TimeUnit.MINUTES);  // 将键值对 "user:info:1:age" 的值设置为 "21" 存入 Redis
        String name = stringRedisTemplate.opsForValue().get("user:info:1:name");  // 获取键 "user:info:1:name" 对应的值并赋值给变量 name
        String age = stringRedisTemplate.opsForValue().get("user:info:1:age");  // 获取键 "user:info:1:age" 对应的值并赋值给变量 age
        System.out.println("name:" + name + "\nage:" + age);  // 打印变量 name 和 age 的值
        stringRedisTemplate.delete("a");  // 删除键为 "a" 的键值对
        System.out.println(stringRedisTemplate.hasKey("a"));  // 打印 Redis 中是否存在键 "a"
    }
}
```
> 实际上所有的值的操作都被封装到了 ValueOperations 对象中，而普通的键操作直接通过模板对象就可以使用了，大致使用方式其实和 Jedis 一致。

事务操作，由于 Spring 没有专门的 Redis 事务管理器，所以只能借用 JDBC 提供的，只不过无所谓，正常情况下反正我们也要用到这玩意：

- 依赖注入
```xml
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-jdbc</artifactId>  
</dependency>  
<dependency>  
    <groupId>mysql</groupId>  
    <artifactId>mysql-connector-java</artifactId>  
    <version>8.0.28</version>  
</dependency>
```
- 配置数据库
```yml
server:  
  port: 8080 # 主要用于配置Spring Boot应用程序的端口  
spring:  
  application:  
    name: springboot-redis # 主要用于设置Spring Boot应用程序的名称  
  redis:  
    host: 127.0.0.1 # 主要用于配置Redis服务器的主机地址  
    port: 6379 # 主要用于配置Redis服务器的端口号  
    password: 123456 # 主要用于配置Redis服务器的密码  
    database: 0 # 主要用于配置Redis服务器的数据库索引（从0开始）  
    timeout: 1000 # 主要用于配置Redis操作的超时时间（以毫秒为单位）  
  datasource:  
    driver-class-name: com.mysql.cj.jdbc.Driver  
    url: jdbc:mysql://127.0.0.1:3306/spring?useUnicode=true&characterEncoding=utf-8 # 主要用于配置数据库的URL  
    username: root # 主要用于配置数据库的用户名  
    password: 123456 # 主要用于配置数据库的密码
```
- 事务服务调用
```java
@Service  
public class RedisService {  
    @Resource  
    StringRedisTemplate stringRedisTemplate;  
  
    @PostConstruct  
    public void init() {  
        stringRedisTemplate.setEnableTransactionSupport(true);  
    }  
  
    @Transactional  
    public void test() {  
        stringRedisTemplate.multi();  
        stringRedisTemplate.opsForValue().set("a", "123123");  
        stringRedisTemplate.exec();  
    }  
}
```
redis 也可以存实体类,不过首先要对其序列化处理为 json 格式才可以,entity 类要实现 `Serializable` 接口
```java
@Data  
@AllArgsConstructor  
@NoArgsConstructor  
public class Student implements Serializable {  
    String name;  
    int age;  
}
```
存储对象类型:
```java
public void test() {  
    redisTemplate.multi();  
    redisTemplate.opsForValue().set("a", new Student("xiaoShuai", 20));  
    redisTemplate.exec();  
}
```


# 参考
1. [Redis 持久化详解及配置 - 知乎](https://zhuanlan.zhihu.com/p/182972002)
2. [持久化\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1vR4y1o7Z2/?p=6&spm_id_from=pageDriver&vd_source=9c896fa9c3f9023797e8efe7be0c113e)
