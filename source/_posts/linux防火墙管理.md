---
title: linux防火墙管理
categories:
  - linux
tags:
  - 防火墙
date: 2021-12-15 19:21:58
urlname: linux防火墙配置
---

> 梦在前方，路在脚下！

## linux防火墙配置

### **基本指令**

##### 启动防火墙

```shell
systemctl start firewalld
```

##### 关闭防火墙

```shell
systemctl stop firewalld
```

##### 重启防火墙

```shell
systemctl restart firewalld
```

##### 查看状态

```shell
systemctl status firewalld
```

##### 开机禁用

```shell
systemctl disable firewalld
```

##### 开机启用

```shell
systemctl enable firewalld
```

##### 查看防火墙是否开机启动

```shell
systemctl is-enabled firewalld.service
```

##### 查看本机已经启用的监听端口

```shell
ss -ant
```

##### 查看防火墙所有信息

```shell
firewall-cmd --list-all
```

##### 查看防火墙开放端口信息

```shell
firewall-cmd --list-ports
```

##### 放行端口

```shell
firewall-cmd --permanent --add-port=<port>/tcp
```

参数介绍：

firewall-cmd：是Linux提供的操作firewall的一个工具；

--permanent：表示设置为持久；

--add-port：标识添加的端口；

还可以加上—zone,表示把端口制定到具体的zone配置文件中，例如--zone=public（这里的public就是在/etc/firewall/zones下边的public.xml）

##### 检查端口状态

```shell
firewall-cmd --query-port=6379/tcp
```

##### 删除端口

```shell
firewall-cmd --zone=public --remove-port=80/tcp --permanent
```

