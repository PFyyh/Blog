---
title: nginx集群策略
categories:
  - nginx
  - linux
tags:
  - 常见题
date: 2021-12-15 19:30:51
urlname: nginx的负载均衡策略
---

> 梦在前方，路在脚下！

### nginx的负载均衡策略

描述：

- 轮询（默认方式）

  每个请求按照时间顺序逐一分配到不同的后端服务器，如果后端服务器死了，能自动剔除。

- 指定权重

  指定轮询几率，weight权重大小和访问比率成正比，用于服务器性能不均的情况。

- ip_hash

  每个请求，按照hash的结果进行分配，这样每个访客会固定访问同一个后端服务器，可以解决session问题。

- fair

  按服务器响应时间分配请求，响应时间端的优先分配。

- url_hash

  按访问url的hash结果来分配请求，每个url定位到同一个后端服务器，后端服务器为缓存比较有效。

- 最少连接

解答：

总共5种，轮询（默认）、权重、IP、响应时间、url。

实现方式

```shell
#轮询
upstream backserver{
	server XXXX1;
	server XXXX2;
	server XXXX3;
}
#权重
upstream backserver{
	server XXXX1 weight=1;
	server XXXX2 weight=2;
	server XXXX3 weight=3;
}
#ip
upstream backserver{
	ip_hash;
	server XXXX1;
	server XXXX2;
	server XXXX3;
}
#fair
upstream backserver{
	fair;
	server XXXX1;
	server XXXX2;
	server XXXX3;
}
#url
upstream backserver{
	hash $request_uri;
	hash_method crc32;
	server XXXX1;
	server XXXX2;
	server XXXX3;
}
#最少连接
upstream backserver{
	least_conn;
	server XXXX1;
	server XXXX2;
	server XXXX3;
}
```

