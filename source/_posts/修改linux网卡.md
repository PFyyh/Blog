---
title: 修改linux网卡
categories:
  - linux
tags:
  - 网卡
  - linux
date: 2021-12-15 19:27:20
urlname: 修改Linux网卡
---

> 梦在前方，路在脚下！

### 修改Linux网卡

##### 进入指定文件夹

```shell
cd /etc/sysconfig/network-scripts
```

##### 修改文件内容

```
TYPE="Ethernet"
PROXY_METHOD="none"
BROWSER_ONLY="no"
BOOTPROTO="static"
DEFROUTE="yes"
IPV4_FAILURE_FATAL="no"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
IPV6_DEFROUTE="yes"
IPV6_FAILURE_FATAL="no"
IPV6_ADDR_GEN_MODE="stable-privacy"
NAME="ens33"
UUID="58c56b31-b278-420d-9c85-d389fb29b6e0"
DEVICE="ens33"
ONBOOT="yes"
IPADDR="192.168.72.14"
GATEWAY="192.168.72.2"
NETMASK="255.255.255.0"
```

##### 重启网卡服务

```shell
systemctl restart network
```

