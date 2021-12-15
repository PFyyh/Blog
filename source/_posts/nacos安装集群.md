---
title: nacos安装集群
categories:
  - 微服务
  - nacos
tags:
  - 微服务
  - nacos
date: 2021-12-15 19:23:33
urlname: nacos安装集群
---

> 梦在前方，路在脚下！



# nacos安装集群

##### 准备

四个nacos虚拟机

192.168.50.53
192.168.50.54
192.168.50.55

一台nginx转发虚拟机

192.168.50.56

一台mysql虚拟机

192.168.50.60

##### 导入外置数据库脚本

![image-20210914222933197](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20210914222933197.png)

##### 开启防火墙

nacos开启端口8848

```sh
firewall-cmd --permanent --add-port=8848/tcp
systemctl restart firewalld
firewall-cmd --query-port=8848/tcp
```

##### 修改配置外置数据源

```yaml
#*************** Config Module Related Configurations ***************#
### If use MySQL as datasource:
spring.datasource.platform=mysql

### Count of DB:
db.num=1

### Connect URL of DB:
db.url.0=jdbc:mysql://192.168.50.60:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user.0=root
db.password.0=password

```

##### 修改集群配置

###### 复制文件

```sh
cp cluster.conf.example cluster.conf
```

修改内容如下

```sh
192.168.50.53:8848
192.168.50.54:8848
192.168.50.55:8848
```

将三台服务器都按照上面的步骤进行设置，然后启动

```shell
/usr/local/nacos/bin/startup.sh
```

分别访问 能否进入

![image-20210914222813648](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20210914222813648.png)

![image-20210914224045767](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20210914224045767.png)

##### 设置nginx进行反向代理

```sh
vim nginx.conf
```

内容如下

```
....
    #gzip  on;
    upstream nacosCluster{
        server 192.168.50.53:8848;
        server 192.168.50.54:8848;
        server 192.168.50.55:8848;
    }
    server {
        listen 8848;
        server_name nacos;
        
        add_header backendIP $upstream_addr;
        add_header backendCode $upstream_status;

        location /nacos/ {
            proxy_pass http://nacosCluster/nacos/;
        }
    }

....
```

add_header backendIP $upstream_addr;
add_header backendCode $upstream_status;

可以看出反向代理到了什么地方，可加可不加。

##### 开启nginx端口

```
firewall-cmd --permanent --add-port=8848/tcp
systemctl restart firewalld
firewall-cmd --query-port=8848/tcp
```

##### 测试

访问http://192.168.50.56:8848/nacos/index.html#/login

创建一个测试用户

![image-20210914225141864](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20210914225141864.png)

![image-20210914225150647](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20210914225150647.png)

##### 检查数据库

![image-20210914225203767](https://boot-generate.oss-cn-chengdu.aliyuncs.com/img/image-20210914225203767.png)

