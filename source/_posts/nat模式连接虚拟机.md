---
title: nat模式连接虚拟机
categories:
  - 虚拟机
tags:
  - nat
date: 2021-12-15 19:24:43
urlname: nat模式连接虚拟机
---

> 梦在前方，路在脚下！

# nat模式连接虚拟机

vmare配置

![image-20210326152638148](F:/%25E6%2596%2587%25E6%25A1%25A3/typoraImage/image-20210326152638148.png)

![image-20210326152659985](F:\文档\typoraImage\image-20210326152659985.png)

把DHCP关掉

![image-20210326153430679](F:\文档\typoraImage\image-20210326153430679.png)

进入nat设置

![image-20210326153508673](F:\文档\typoraImage\image-20210326153508673.png)

##### 网卡配置

进入

```shell
vi /etc/sysconfig/network-scripts/ifcfg-ens33
```

需要将ip设置到同一个网段内

```shell
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=no
IPADDR=192.168.72.9
GATEWAY=192.168.72.2
DNS1=8.8.8.8
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33
UUID=43fad4f7-a55f-482e-b90b-28acd5336fcb
DEVICE=ens33
ONBOOT=yes

```

##### 修改wmare8配置

设置到同一网段内

![image-20210326153703255](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20210326153703255.png)

##### 重启网卡

```shell
systemctl restart network
```

![image-20210326154117444](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20210326154117444.png)