---
title: nacos集群策略
categories:
  - linux
tags:
  - linux
date: 2021-12-15 19:32:25
urlname:
---

> 梦在前方，路在脚下！

### nacos集群策略

##### ACP原则

availability 可用性

consistency 一致性

partion tolernance 分区容错性

一般最多只能支持两种。nacos是AP+CP，默认是AP可用性和分区容错性。

##### 选举算法

采用的是Raft算法，是一种选举算法。分为三种角色：Leader领导者、Follower跟随者、Candidate竞选者。

所有节点启动起来都是跟随者Follower并同时会生成超时时间，在这个超时时间范围内Follower会等待，如果超时，则会转化为竞选者Candidate，会给其他节点发起选举通知，只有该节点超过一半通过投票则会成为领导者Leader。

超时时间短的更高概率成为领导者。如果所有节点超时时间一样，那么作废这次选举，重新选举。如果随机时间一样，得票高的为领导。如果票数一样，作废投票。

如果Follower节点不能及时收到Leader的消息， 那么就会转为竞选者，发起选举。

##### nacos注册服务过程

启动一个微服务程序，向集群发起注册请求。

Follower接受到以后，自己不能处理。而是转发给Leader.

Leader进行注册，并给所有的Follower发起“同步注册日志”指令。

Follower接受以后，进行”ack应答“，通知Leader。

Leader收到了过半的Follower成功响应，就会给微服务响应注册成功。

对于无效的Follower节点，Leader会持续发送消息。

