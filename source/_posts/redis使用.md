---
title: redis使用
categories:
  - redis
tags:
  - redis
date: 2021-12-16 09:06:59
urlname: redis使用教程
---

> 梦在前方，路在脚下！

# redis使用教程

### 安装

redis使用版本6.2.6

安装环境linux

##### 前置环境

```shell
yum install gcc-c++
yum install tcl
```

##### 安装位置

移动到/opt下面并进行解压

```shell
mv redis-6.2.6.tar.gz /opt/
tar -zxvf /opt/redis-6.2.6.tar.gz
```

##### 编译和安装

```redis
make 
make install
```

##### 准备运行

进入/usr/local/bin目录，创建redis配置文件夹并且把redis的配置文件拷贝过来

```shell
cd /usr/local/bin/
mkdir redisConfig
cp /opt/redis-6.2.6/redis.conf redisConfig/
```

##### 设置后台运行

```shell
vim redis.conf
```

将daemonize设置为yes,设置为后台启动。

在/usr/local/redis/bin目录下面执行

```
redis-server ./redis.conf
```

##### 连接

redis-cli -h是连接ip,ip端口，--raw防止中文乱码

```shell
redis-cli -p 6379 --raw
```

##### 测试

![image-20211012193910622](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20211012193910622.png)

##### 关闭

```shell
shutdown
```

##### 压力测试

![image-20211012194212882](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20211012194212882.png)

### 基础知识

##### 选择数据库

```shell
select <数据库编号>
```

##### 查看用量

```
DBSIZE
```

##### 查看所有键

```
keys *
```

##### 清除当前

```
flushdb
```

清楚所有

```
flushall
```

### Redis很快

基于内存操作，CPU不是redis的性能瓶颈，而是机器的内存和网络带宽。使用单线程。

C语言写的,QPS10w+

##### 原因

误区：高性能≠多线程。多线程不一定比单线程效率高(上下文切换

1. redis是存在内存里面的，单线程效率高，而且没有锁。
2. 数据结构简单。
3. 使用了多路I/O复用模型，非阻塞IO

### 五大基础类型

#### 键操作

```shell
keys * #获取所有
set name YYH #设置键值
get name #根据键获取值
exists name #是否存在
del name #根据键删除值
expire name 10 #设置有效期（单位秒）
ttl name #键的有效期
type name #查看键类型
```

#### String操作

```shell
set name YYH #设置键值
get name #根据键获取值
exists name #是否存在
append name "字符串" #追加或则新增
strlen name #字符串长度
###计算相关操作##
set key 0 #设置初始浏览量0，如果不设置默认0
incr key #键加1，没有值就0+1
incrby key 10 #键加10
decr key #键减1
decrby key 10 #键减10
###字符串范围
getrange name 0 2 #获取name字符串的0到2下标的字符串
getrange name 0 -1 #获取整个字符串
setrange name 0 "新知" #从下标0开始替换字符串

setex name 30 wwww #设置30秒过期的键值
setnx name "中文" #如果不存在，则创建键值（常用于分布式锁），如果有创建失败。

mset name yyh age 23#批量创建键值对
msetnx name yyh age 23#（保证原子操作）如果所有键不存在，批量创建键值对

#存储对象
#使用json
set cas_person:1 {"name":"yyh","age":23}
get cas_person:1
#使用：
msetnx cas_person:1:name "张三" cas_person:1:age 65
mget cas_person:1:name cas_person:1:age

getset name yyh#获取旧值，设置新值。可以理解容量1的队列?,如果是新值，则返回nil。

```

#### List操作

```shell
lpush music music1 #左进
lpush music music2 #左进
lpush music music3 #左进

rpush music music0 #右进
lpop music#左弹出（移除）
rpop music#右弹出（移除）


lrange music 0 -1#list range获取所有
lrange music 0 1#从左边开始，获0..1的值
lindex music 0 #通过下标获取值
llen music #获取list长度

lrem movie 0 you2 #在movie 里面移除所有值为you2
lrem movie 1 you2 #在movie 里面移除所有值为you2，从左往右
ltrim music 1 2 #截取并保存1..2的数据
```

特别注意，组合命令

```shell
rpoplpush movie music #准备两个list,将右边的值弹出，放到第二个list左边。都是为了原子性
```

![image-20211016115343685](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20211016115343685.png)

如果两个list是同一个list,就相当于把尾巴放在头上。

![image-20211016115719205](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20211016115719205.png)

如果list是空的，那么就没有值过去。

```shell
lset music 99 value #将list里99下标值更新为value.需要判断list存不存在，下标是否越界。
linsert movie before 345 test#向movice的list里面在345的值前面插入test值
```

![image-20211016120536567](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20211016120536567.png)

需要注意的时候，如果存在多个符合条件的值，左边第一个值的前后插入。

##### 小总结

本质是链表，两端都可以插入（lpush rpush）两端都可以弹出（lpop rpop）

如果没有键就新建链表。如果有就插入。

如果list的值都弹出去了，那么list也就不见了。

消息队列 lpush rpop。栈lpush lpop。

#### Set操作

```shell
sadd myset "1" #集合增加值
smembers myset #查询所有set
sismember myset "1"#1是否在myset里面
scard myset#获取集合里面元素个数
srem my DDD#移除my集合的DDD元素
SRANDMEMBER my 1#随机获取一个元素
spop my #随机弹出集合元素
SMOVE set1 set2 1#将集合的一个值，移动到另一个集合
SDIFF set1 set2#set1里面有的set2没有的
SINTER set1 set2#交集
SUNION set1 set2#交集

```

微博，将所有关注的人、粉丝分别放在集合中。

交集可以得出共同关注，和共同粉丝。

#### Hash操作

Map集合，key-map

```shell
hset cas_person:1 name yyh #设置值
hset cas_person:1 age 23#设置值
hget cas_person:1 age#获取值
HMSET cas_person:1 card_id 234234 group_id 123123 #批量设置值
HMGET cas_person:1 card_id group_id#获取值 
HGETALL cas_person:1#获取全部数据
HDEL cas_person:1 group_id#删除指定的key
HLEN cas_person:1#hash里面长度
HEXISTS cas_person:1 id#是否存在id属性
hkeys cas_person:1#只获取key
hvals cas_person:1#只获取值
HINCRBY cas_person:1 id 1#计算值，只有这个
HSETNX cas_person:1 id 23#如果不存在就创建
```

常用于变更数据 user对象的相关属性

#### ZSet操作

有序集合

```shell
zadd music_sort 1000 letter#在有序集合music_sort里面追加letter权重1000	
zcard music_sort#有序集合数量
zcount music_sort 500 1000#权重区间500-1000的元素
zrange music_sort 0 -1#从小到大获取元素，0 -1所有
zrevrange music_sort 0 3#从大到小，前四个元素
zrangebyscore music_sort -inf +inf #获取负无穷，到正无穷的值
zrevrangebyscore music_sort +inf -inf #获取负无穷，到正无穷的值
zrem music_sort 123 #移除123元素
zrembyscore music_sort 123 400 #移除权重123-400的元素
```

### 三大特殊类型

#### Hyperloglog操作

用来基数统计，优点固定内存，相比较set，不会存储元素本身。但是会存在误差。

```shell
pfadd ip 192.168.50.1#添加
pfadd ip 192.168.50.2
pfadd ip 192.168.50.3
pfadd ip 192.168.50.3
pfcount ip #得到值3
pfmerge ip ip2#合并ip和ip2
```

##### 小结

常用于访问量设计与实现

#### GEO操作

主要用于存储地理信息

```shell
geoadd sichuan 80 100 nanchong 100 100 mianyang#添加两个节点
geopos sichuan nanchong#获取南充位置
geodist sichuan nanchong mianyang km#计算两地距离单位km
georadius sichuan 100 100 100 km#经纬度（100，100）为中心，半径100km的城市
georadiusBymember sichuan nanchong 100 km#以四川南充为中心，100km
gethash sichuan nanchong#得到四川南充一维hash

```

##### 小结

附近的人，城市距离等等。

#### Bitmap操作

常用于出勤打卡等等。

```shell
setbit key 0 1#第一天出勤
setbit key 1 0#第二天未出勤
setbit key 2 1#第三天出勤
getbit key 2#获取第二天出勤情况
bitcount key#获取为1的打卡天数
```

### 事务

本质就是一组有序的命令集合。所有命令都会被序列化，按顺序执行。

一次性，顺序性，排他性。

redis没有像mysql一样的隔离级别。单个命令存在原子性，但是事务不存在原子性。

##### 步骤

开始事务（multi）

命令入队（。。。）

执行事务（exec）

放弃事务   (discard)

##### 错误

- 编译时错误：会提示，所有命令执行不了。
- 运行时错误：错误的命令，会提示异常。但是不会影响其他的命令。

##### 乐观锁

```shell
watch name #监控name值
```

使用watch监控name值。事务执行完了，就解除监控。

![image-20211018162107612](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20211018162107612.png)

```shell
发现事务执行失败，就解除锁
unwatch
然后再锁
watch name
在执行的时候，比较值。
```

## jedis

开启防火墙6379

```shell
firewall-cmd --permanent --add-port=6379/tcp
systemctl restart firewalld
```

在redis.conf中，关闭bind 127.0.0.1并修改protected-mode为no，将daemonize改为yes。

```java
Jedis jedis = new Jedis("192.168.50.60", 6379);
String s = jedis.ping().toString();
String set = jedis.set("name", "yyh");
String name = jedis.get("name");
System.out.println(name);
System.out.println(s);
```

## Springboot整合redis

##### 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

##### 配置redis

##### 测试

##### 自定义RedisTemplate

```java
@Configuration
public class RedisConfig {
    /**
     * 自定义redisTemplate
     * 防止出现redis序列化问题
     * @param redisConnectionFactory
     * @return
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        //设置连接工厂
        template.setConnectionFactory(redisConnectionFactory);
        //设置具体的序列化方式
        //解析所有对象
        final Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);
        final ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance,ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(objectMapper);
        //String的序列化
        final StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        template.setStringSerializer(stringRedisSerializer);
        //String key
        template.setKeySerializer(stringRedisSerializer);
        //Hash key
        template.setHashKeySerializer(stringRedisSerializer);
        //value
        template.setValueSerializer(jackson2JsonRedisSerializer);
        //hash value
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }
}
```

##### RedisUtil

自己网上找多的是。

## redis配置详解

### 单位

单位大小写不敏感。

```sh
# 1k => 1000 bytes
# 1kb => 1024 bytes
# 1m => 1000000 bytes
# 1mb => 1024*1024 bytes
# 1g => 1000000000 bytes
# 1gb => 1024*1024*1024 bytes
```

### 包含

```shell
# include /path/to/local.conf
# include /path/to/other.conf
```

和yaml有点类似。

### 网络

```shell
bind 127.0.0.1 -::1 192.168.50.60
```

这个意思不是说某个ip能够访问redis,redis没有限制ip的能力。而是说通过bind后面的ip来访问redis。

如果注释`bind 127.0.0.1 -::1`然后redis服务器执行  `redis-cli -p 6379`会提示错误。

```shell
Could not connect to Redis at 127.0.0.1:6379: Connection refused
```

![image-20211020190842196](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20211020190842196.png)

```
port 6379 #端口号
```

### 通用

```shell
daemonize yes #守护进程启动
supervised no#可以通过upstart和systemd管理Redis守护进程，这个参数是和具体的操作系统相关的。
pidfile /var/run/redis_6379.pid#如果开启了守护进程，就需要指定pid文件。
loglevel notice #日志等级，默认生产环境使用debug和verbose很类似。
logfile /usr/local/bin/redisConfig/log_redis.log#日志地址
databases 16#数据库数量
```

### 快照

持久化，在规定的时间内，执行了多少次操作，就会进行持久化到文件rdb aof

redis是内存数据库，如果没有持久化，那么就会丢失。

```shell
save 3600 1   #3600秒内1次操作，进行持久化
save 300 100  #300秒内100次操作，进行持久化
save 60 10000 #60秒内10000次操作，进行持久化
stop-writes-on-bgsave-error yes#持久化错误了，还是会继续工作。
rdbcompression yes#是否压缩rdb文件，需要消耗cpu资源。
rdbchecksum yes#rdb文件错误校验
dir /var/lib/redis/6379#rdb文件存储位置
REPLICATION#主从复制
dbfilename dump.rdb#文件名
```

### 密码

```shell
requirepass foobared#设置密码(使用的话就是auth password),通过配置文件，需要重启。
```

### 限制客户端

客户端限制

```sh
maxclients 10000 #最大连接数
maxmemory <bytes>#最大内存
maxmemory-policy noeviction#达到最大内存策略，淘汰机制很重要！
1、volatile-lru：只对设置了过期时间的key进行LRU（默认值） 
2、allkeys-lru ： 删除lru算法的key   
3、volatile-random：随机删除即将过期key   
4、allkeys-random：随机删除   
5、volatile-ttl ： 删除即将过期的   
6、noeviction ： 永不过期，返回错误

```

### APPEND ONLY MODE(AOF配置)

```shell
appendonly no#默认不开启,在大部分情况下rdb够用了。
appendfilename "appendonly.aof"#默认文件
# appendfsync always  每次修改就会sync
appendfsync everysec #每秒执行一次sync,可能会丢失1s的数据！！
# appendfsync no  系统自己同步数据

```

## 持久化

#### RDB

在主从复制中rdb，就是备用。

```shell
save 3600 1   #3600秒内1次操作，进行持久化
save 300 100  #300秒内100次操作，进行持久化
save 60 10000 #60秒内10000次操作，进行持久化
stop-writes-on-bgsave-error yes#持久化错误了，还是会继续工作。
rdbcompression yes#是否压缩rdb文件，需要消耗cpu资源。
rdbchecksum yes#rdb文件错误校验
dir /var/lib/redis/6379#rdb文件存储位置
REPLICATION#主从复制
dbfilename dump.rdb#文件名
```

##### 触发机制

1. save条件满足，会自动触发rdb。
2. flushall\flushdb，会自动触发rdb。
3. 关闭redis，会自动触发rdb。

##### 如何恢复rdb文件

1. 找到配置文件里面的dir配置目录，放入rdb文件
2. /usr/local/bin目录

##### 优点

1. 适合大规模恢复，dump.rdb
2. 对数据完整性要求不高的话，可以使用

##### 缺点

1. 需要时间一定的间隔，如果意外宕机，在间隔内的数据就没了。
2. fork进程会占用内存空间。

##### 小细节

在生产环境，会备份dump.rdb.

#### AOF

```shell
appendonly no#默认不开启,在大部分情况下rdb够用了。
appendfilename "appendonly.aof"#默认文件
# appendfsync always  每次修改就会sync
appendfsync everysec #每秒执行一次sync,可能会丢失1s的数据！！
# appendfsync no  系统自己同步数据
#重写 rewrite,默认无限制追加。
auto-aof-rewrite-precentage 100
auto-aof-rewrite-min-size 64mb
```

将所有执行的命令都记录下来，history，恢复的时候，走一遍。

在大数据情况下，恢复性很低。默认不开启。



如果aof存在问题，可以说使用`redis-check-aop --fix`

##### 优点

1. 每次修改都会同步，文件完整性更好
2. 默认每秒同步一次，可能会丢一秒数据
3. 从不同步，效率最高

##### 缺点

1. 文件本身，aof大于rdb。
2. aof效率低于rdb，所以默认是rdb。

##### 扩展

1. RDB方式就是在指定的时间间隔内对数据进行快照存储
2. AOF方式记录每次写，当服务器重启的时候会重新执行这些命令恢复初始的数据，AOP命令以redis协议追加保存每次写操作到文件末尾，Redis还能对AOF文件进行后台重写，让文件不至于过大。
3. 只做缓存，就可以不使用任何持久化
4. 同时开启两种持久化方式
   1. redis重启优先加载AOF文件恢复原始数据。因此在通常情况AOF保存的数据集比RDB文件完整
   2. RDB数据不实时，同时使用两者服务器重启也只会找aof文件。但是RDB也很重要，它更适合备份数据库，快速重启，而且没有隐藏bug.
5. 性能建议
   1. RDB只做后备用途，只在slave上持久化RDB文件，而且只要十五分钟备份一次就够了。只保留save 900 1这条规则。
   2. 如果开启了AOF,优点在于最多丢失2s数据，而且只需要load自己的aof文件，代价一是带来了持续的IO，二是rewrite过程中产生的新数据写新文件造成的阻塞无法避免。只要硬盘许可，应该减少AOF rewrite频率。AOF重写基础值64m太小了，可以设置到5G以上，默认超过原大小100%大小重写可以改到适当的数值。
   3. 如果不开启aof，仅靠master-slave repllcation实现高可用，能省掉很多IO，减少了rewrite带了的系统波动。代价是如果都死了，就会丢掉十多分钟的数据，启动也要比较两个master/slave的rdb文件，载入较新的，微博设计结构。

## 集群构建

### 主从复制

最低要求一主二从。主机进行写操作，从机进行读操作，完成读写分离。

#### 创建步骤

##### 准备redis进程

注意修改一下几个配置。

1. port
2. pidfile
3. logfile
4. dbfilename

##### 主机创建

redis启动默认就是主机，不需要修改。可以通过`info replication`进行查看。集群状态。

##### 从机创建

需要额外修改配置

```shell
slaveof host port#我是谁谁的仆从。
masterauth "password"#如果主机有密码的话，需要设置密码
```

##### 使用

只有主机能写，从机写会报错。

当主机宕机以后，从机只能写。如果不配置哨兵模式，只有手动改配置。当主机宕机恢复以后，从机依然可以获取数据。就算是新来的redis从机或者重启的从机，都会有一样的数据。



从机连上以后，主机会全量复制给从机。

主机后面新增的写操作，会增量复制给从机。

#### 注意

一主多从、层层链路，在实际中都不会使用。（层层链路：口->口->口,中间又是主，又是从。中间节点只能写，前面掉了后面会断掉）

如果主机断了，从机就可以执行`slaveof no one`,这就是手动设置老大。 后面主机回来了，也只是光杆司令。

## 哨兵模式

自动选取老大 。

一般是由多个哨兵组成。哨兵不只是检测一个集群的reids,而且还要监控其他哨兵，防止哨兵死掉。

如果master死掉了，不会马上进行故障转移，而是该哨兵主观认为主服务器不可用，这叫主观下线。当后面的哨兵也发现主服务器不可用到一定的数量，就会进行投票，然后由一个哨兵发起，进行故障转移failover。切换成功以后就会通过发布订阅模式，让各个哨兵把自己监控的从服务器切换到主服务器，这叫客观下线。

##### 创建过程

###### 创建sentinel.config

```shell
#sentinel monitor 被监控名称 host port 当有一个哨兵认为主机宕机，就开始选举
sentinel monitor myredisname 127.0.0.1 6379 1
```

###### 启动哨兵

```shell
redis-sentinel /usr/sentinel.conf
```

多个端口需要写多个配置文件，（暂时没实现）。

主机宕机以后，一个哨兵监测到master死掉了，就会开始选举，然后随机投票，选择slave作为master，这几failover（故障转移）。

主机连回来以后，会成为slave。

###### 优点

1. 哨兵集群，基于主从复制模式，所有主从配置优点，他都有。
2. 主从可以切换，故障可以转移，系统的可用性更好
3. 哨兵模式就是主从模式的升级，手动到自动，更加健壮。

###### 缺点

1. 不好在线扩容，集群容量一旦达到上限，在线扩展十分麻烦。
2. 实现哨兵配置麻烦，里面有很多选择。

## Redis穿透、击穿、雪崩

### 穿透

是因为过多访问缓存不存在的key,直接打在了数据库。

#### 解决方案

##### 布隆过滤器

是一种数据结构，对所有可能查询的参数以hash形式存储，在控制层进行校验，不符合就丢弃，避免了直接直接访问。当缓存没有命中，即使返回空对象也会将其缓存起来，同时设置过期时间，子啊此访问就会从缓存中获取，保护了数据库。

###### 存在问题

1. 以为没有命中的原因导致缓存里面存储了过多的键，而且值都是空的。
2. 即使空值设置了过期时间，也会导致缓存层和数据库的数据有个有效时间差，这对需要保持一致性的业务有影响。

### 击穿

这是因为某一个key被过多的访问，在访问过程没什么。但是当这个key失效的一瞬间，会有大量的请求打到数据库上面，导致数据库瞬间压力过大。

##### 解决方案

1. 热点数据不过期
   - 这是因为只要没有过期时间，就不会存在失效问题
2. 加互斥锁
   - 使用分布式锁，保证对每一个key同时只有一个线程查询后端服务，其他没有分布式锁的权限，因此只要等待即可。这种方式将高并发的压力转移到了分布式锁，因此对分布式锁要求很高。

### 雪崩

##### 原因

这是因为在访问高峰期间，如双十一或者双十二的时候，在零点涌入了大量的请求，并放到了缓存里面，假设过期1小时。1点的时候，访问就会打在数据库上面，这样就会产生周期性压力，这种自然的雪崩数据库还是能够顶住的。但是就怕缓存节点宕机，这对数据库伤害就大了，很有可能把数据库压垮。

##### 解决方案

###### redis高可用

为了减少缓存服务节点宕机带来的影响，那就redis集群。

###### 限流降级

在缓存失效以后，通过加锁或者队列来控制数据库写缓存的线程数量。比如某个key只允许一个线程查询和写，其他线程等待。

###### 数据预热

在正式部署之前，先把可能访问的数据先访问一遍。先加载到缓存里面，在即将发生大并发以前加载缓存，设置失效时间，让缓存失效时间都均匀一点。



