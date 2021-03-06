---
title: redis常见面试题
categories:
  - redis
tags:
  - redis
  - 面试
date: 2021-12-16 09:07:35
urlname: Redis常见题型
---

> 梦在前方，路在脚下！

## Redis常见题型

##### 什么是Redis?

Redis是高性能Key-Value内存型数据库。

##### Redis的特点能说说看吗？

1. Redis高性能（11万并发读，8w写）
2. 支持丰富的数据类型，包括5大基础类型String,list,hash,Set和ZSet，3个特殊类型，hyperloglog、GEO、bitMap。
3. Redis支持集群部署，主从同步。
4. Redis虽然是内存数据库，但是支持两种持久化，RDB和AOF。

##### 为什么使用Redis？

从两个角度考虑：性能和并发。（虽然能用分布式锁这个功能）

1. 性能

   在数据库访问量少的时候，用不用Redis都无所谓。但是随着数据库的访问量逐渐增多，mysql性能会越来越差，出现连接异常。为了减少越来越频繁的mysql的IO操作，让准备进入数据库的数据先进入缓存，然后进入MySQL。在读的时候，缓存如果能够命中条件，那么就能减少mysql的读操作，迅速响应。

2. 并发

   在高并发的情况下，如果没有redis缓存，就会直接打在数据库，导致数据库崩溃。

##### 为什么单线程的Redis这么快呢？

单线程其实是指执行客户端命令的线程是单线程的。持久化用的是新的进程。

1. 错误的理解：高性能≠多线程

   多线程带来高速的同时也带来了很多问题，比如锁、上下文切换等等。

   单线程没有多线程的缺点，而且是纯内存操作，没有CPU这一个瓶颈，而是内存和网络带宽。

2. 非阻塞I/O多路复用

##### 能详细说说多路复用吗，通俗易懂点？

redis利用epoll来实现IO多路复用，将连接信息和事件放到队列中，依次放到 文件事件分派器，事件分派器将事件分发给事件处理器。

也叫异步阻塞IO,描述的是用户态和内核态的交互方式，异步就会让用户态请求内核态，但是用户态的线程不会等待，内核态IO处理完了，以后会通知用户态的线程。

![image-20211028172418988](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20211028172418988.png)

##### Redis的应用场景有什么地方?

String：存储用户令牌，计数器，分布式锁（这里面知识点恐怖）

哈希表：可以用来存储key-value对，更适合存储对象

列表：可用于队列，堆的使用，缓存类似的公众号，微博等消息流

Set：存储共同好友、共同粉丝，集合的交并差操作。

ZSet：用于排行榜

##### Redis淘汰策略有哪些？

对于有三种清除策略。

读或者写已经过期的key的时候，会触发惰性删除策略，直接删除过期key。

因为惰性删除无法保证冷数据被及时删除会定期主动淘汰一批已过期的key。

当超过了maxmemory限定值的时候，会触发主动清除策略。

###### 主动清除策略

1. volatile-lfu：针对设置过期时间的key，使用LFU算法筛选删除键值对。
2. volatile-lru：针对设置过期时间的key，使用LRU算法筛选删除键值对。
3. volatite-random：针对设置过期时间的key，随机删除键值对。
4. all-lfu：针对所有的key，使用LFU算法删除键值对。
5. all-lru：针对所有的key，使用LRU算法删除键值对。
6. all-random：针对所有key，随机删除键值对。
7. novation：不删除任何数据，拒绝所有写入操作并返回客户端错误信息。
8. volatile-ttl： 针对设置过期时间的键值对，根据过期时间的先后进行删除，越早过期的越先删除。

###### LRU（least recently Used，最近最少使用）

淘汰很久没有访问过的数据，以最近一次访问时间作为参考。

###### LFU(Least Frequently Used,最近不经常使用)

淘汰最近一段时间访问最少的数据，以次数为参考。

热点数据使用LRU

周期性、偶发性使用LFU。

推荐使用volatile-LRU。如果不设置最大内存，超过了物理内存限制，就会频繁swap，让redis性能下降。

##### Redis肯定也不是完美的，Redis的缺点能简单说一下吗？

会有Redis缓存和数据库数据不一致。

存在缓存穿透，缓存击穿，缓存雪崩等问题。

##### Redis缓存穿透详细说一下？

原因：客户端访问缓存没有命中，直接访问了数据库但是数据库也没有。当次数过多以后，数据库负荷就会增大。或者说恶意攻击、爬虫造成了大量的空命中。

解决方法：

1.缓存空对象，简单说一下就是缓存和数据库都没有命中的时候，手动设置会过期的空对象。

2.布隆过滤器，在访问数据库之前，访问缓存。当布隆过滤器说某个值存在时，这个值可能不存在；当它说不存在时，那就肯定不存在。使用以前需要把数据库所有的数据存入布隆过滤器，获取数据的时候如果缓存命中就返回，如果无法命中就从数据库获取，如果都无法命中。那么就会设置一个空对象到布隆过滤器里面。

##### Redis击穿详细说一下?

原因：大批量的redis同一时间失效，会导致大量请求直接打在数据库里面。

解决方法：在过期时间的基础上，增加随机时间。

##### Redis缓存雪崩详细说一下？

原因：这是因为Redis顶不住压力了，导致请求直接打在数据库。（超大并发过来，redis支撑不住，或者缓存设计问题，访问大量的bigkey）随后数据库也会崩溃。

解决方法：保证缓存的高可用，使用哨兵模式或者集群。或者依赖隔离组件为后端限流熔断并降级。使用sentinel或者hystrix限流降级组件。比如服务降级，针对不同的数据采用不同的处理方式。访问非核心数据的时候，暂定从缓存查询，而是预定义的默认降级信息，空值或者错误信息。核心数据就继续访问缓存。

提前预热，在上线以前，先演练缓存宕机以后，应用和后端的负载情况，进行预案设定。

##### Redis的持久化能说说看吗？

持久化分为两种RDB和AOF,RDB是默认的持久化方式，AOF没有开启。RDB作为默认的方式，只要触发了存储机制就会进行持久化，这也会导致如果在两次触发存储间隔内，如果Redis出现了错误或挂掉了，那么这期间的数据也就没了。这时候就可以使用AOF，它的特点就是每一次操作都会存储到文件里面，最多丢失1s内的数据，数据的完整性最好，但是占用空间相比RDB大，也不需要RDB那样进行同步，但是每次写都会影响到redis。两者同时开启的时候，redis启动优先使用aof恢复数据。

##### Redis主从工作原理知道吗？

- 只有一个master启动的时候，按照单机执行。当一个slave连接到了master以后，slave会发起一次psync命令请求复制数据。
- master收到以后会进行bgsave持久化，在生成期间，master会接受客户端请求，同时也会写缓存到内存。然后master把数据集发给slave,slave再进行持久化生成rdb。
- slave然后加载到内存里面。然后，master再把生成rdb期间，产生的数据命令发送给slave。
- 当两者断开了，如果master收到了多个slave并发连接请求，只会进行一次持久化。
- 后续的复制的话，只会部分复制断电续传。

##### Redis为什么使用哨兵模式?

Redis的master死了以后，slave模式是只能读不能写。这时候就只能手动修改配置，操作很麻烦。使用哨兵模式就可以自动修改master提高redis的可用性。使用了哨兵模式就可以监听master的状态，当监听到master死了以后，就会将slave升级为master。不过一般都会使用哨兵集群，防止哨兵也死了。当一个哨兵发现master死了，这时候哨兵还不会切换，这时候会主观下线。当超过配置数的哨兵都发现掉线以后，就会重新投票选择slave。掉线的master连接上来以后，也只是slave。

