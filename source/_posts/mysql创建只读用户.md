---
title: mysql创建只读用户
categories:
  - mysql
tags:
  - sql
date: 2021-12-15 19:04:57
urlname: mysql创建只读用户
---

> 梦在前方，路在脚下！

建立只读用户

```sql
CREATE USER `reader`@`%` IDENTIFIED BY 'jw@2021@619@reader';

GRANT Select, Show Databases, Show View ON *.* TO `reader`@`%`;
```

修改密码

```sql
SET PASSWORD FOR `reader`@`%` = PASSWORD('jw@2021@619@reader');
```

