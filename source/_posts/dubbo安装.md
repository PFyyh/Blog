---
title: dubbo安装
categories:
  - linux
tags:
  - linux
date: 2022-02-15 20:07:22
urlname:
---

> 梦在前方，路在脚下！

# dubbo安装

### 注册中心zookeeper

#### 安装解压zookeeper

[zookeeper下载地址]([Apache Downloads](https://www.apache.org/dyn/closer.lua/zookeeper/))

解压到路径下面

```
/opt/zookeeper
```

#### 配置zookeeper

进入文件夹

```bash
/opt/zookeeper/conf
```

拷贝配置文件

```bash
cp zoo_sample.cfg zoo.cfg
```

##### 修改zookeeper数据存储目录

创建数据存储文件夹

```bash
mkdir /opt/zookeeperData
```

修改配置文件里面的配置dataDir

```bash
# The number of milliseconds of each tick
tickTime=2000
# The number of ticks that the initial 
# synchronization phase can take
initLimit=10
# The number of ticks that can pass between 
# sending a request and getting an acknowledgement
syncLimit=5
# the directory where the snapshot is stored.
# do not use /tmp for storage, /tmp here is just 
# example sakes.
dataDir=/opt/zookeeperData
# the port at which the clients will connect
clientPort=2181
```

##### （可选）开启防火墙端口2181

端口根据自己设置

```bash
firewall-cmd --permanent --add-port=2181/tcp
```

重启防火墙

```bash
systemctl restart firewalld
```

检查端口是否开启

```bash
firewall-cmd --list-ports
```

##### (可选)注册服务

注册服务方便自动启动

```bash
vim /usr/lib/systemd/system/zookeeper.service
```

内容如下,注意**需要设置环境变量**，十分重要!!!

```bash
[Unit]
Description=zookeeper.service
After=network.target
ConditionPathExists=/opt/zookeeper/conf/zoo.cfg
[Service]
Type=forking
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin://opt/jdk1.8.0_161/bin"
User=root
Group=root
ExecStart=/opt/zookeeper/bin/zkServer.sh start
ExecStop=/opt/zookeeper/bin/zkServer.sh stop
[Install]
WantedBy=multi-user.target

```

