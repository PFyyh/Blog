---
title: mysql创建新用户并授权
categories:
  - mysql
tags:
  - sql
date: 2021-12-15 19:06:14
urlname: mysql创建新用户
---

> 梦在前方，路在脚下！

```sql
mysql> CREATE USER 'username'@'host' IDENTIFIED BY 'password'; //创建新用户

mysql> grant all privileges on *.* to 'username'@'%'; //赋权限,%表示所有(host) 

mysql> flush privileges //刷新数据库

mysql> update user set password=password(”123456″) where user=’root’;(设置用户名密码) 

mysql> show grants for root@"%"; 查看当前用户的权限
```

