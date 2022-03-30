---
title: 使用hexo创建博客
categories:
  - 博客
tags:
  - 博客
date: 2021-12-15 17:50:23
urlname:
---

> 梦在前方，路在脚下！

如果出现了能提交但是没效果 ，重设公钥密码!!!

# [使用 Git Hook 自动部署 Hexo 到个人 VPS](https://www.cnblogs.com/navysummer/p/9842065.html)

## 安装 Hexo

既然我的标题都已经那样写了，当然这个小节就不是本篇文章的重点了。

关于 Hexo 的安装跟配置，其实网上已经有很多很多文章了，随便一搜一大把。这里就有一篇超详细的，大家可以[参考一下](http://ibruce.info/2013/11/22/hexo-your-blog/)。

但是，网上的教程大多数都是直接将 Hexo 部署到 Github Pages 上面的，虽说这种方法很方便，也很主流，但是用别人的东西难免会有各种各样的限制。再加上我已经有一个 VPS 了，当然希望直接使用自己的服务器来部署博客了。

要把 Hexo 部署到自己的 VPS 上面，最直观的做法就是，在本机上先 `hexo generate`，然后再将生成的静态 HTML 文件通过 `ftp` 或者其它工具上传到服务器上。这种方法虽说很直观，但是操作起来其实很繁琐，比之前直接操作 wordpress 后台还要麻烦很多，而且也很容易出错，一不小心就心出于丢失文件等问题。当然，最重要的一点还是，这一点也不 geek。用了 hexo 这么酷的系统来写博客，却要那样来手动部署不是显得弱爆了么。

经过我的一番搜索，终于找到一种很方便的方法，那就是使用 git hooks 来实现自动化部署。

## 配置服务器远程 Git

大家都知道 Git 是分布式的版本控制系统，远程仓库跟本地仓库是没有什么不同的。

我的 VPS 系统是 Ubuntu 14.04 的，在 Ubuntu 上配置 Git 是相当简单的。

### 第一步

安装 `git`：

```shell
$ sudo apt-get install git
```

### 第二步

创建一个 `git` 用户，用来运行 `git` 服务：

```shell
$ sudo adduser git
```



> 虽说现在的仓库只有我们自己在使用，新建一个 `git` 用户显得不是很有必要，但是为了安全起见，还是建议使用单独的 `git` 用户来专门运行 `git` 服务

### 第三步

创建证书登录，把自己电脑的公钥，也就是 `~/.ssh/id_rsa.pub` 文件里的内容添加到服务器的 `/home/git/.ssh/authorized_keys` 文件中，添加公钥之后可以防止每次 push 都输入密码。

> 如果你之前没有生成过公钥，则可能就没有 `id_rsa.pub` 文件，具体的生成方法，可以[参考这里](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)。

### 第四步

初始化 Git 仓库，我是将其放在 `/var/repo/blog.git` 目录下的：

```shell
$ sudo mkdir /var/repo$ cd /var/repo$ sudo git init --bare blog.git
```

使用 `--bare` 参数，Git 就会创建一个裸仓库，裸仓库没有工作区，我们不会在裸仓库上进行操作，它只为共享而存在。

### 第五步

配置 git hooks，关于 hooks 的详情内容可以[参考这里](https://git-scm.com/book/zh/v2/自定义-Git-Git-钩子)。

我们这里要使用的是 `post-receive` 的 hook，这个 hook 会在整个 git 操作过程完结以后被运行。

在 `blog.git/hooks` 目录下新建一个 `post-receive` 文件：

```shell
 cd /var/repo/blog.git/hooks$ vim post-receive
```

在 `post-receive` 文件中写入如下内容：

```shell
#!/bin/sh
git --work-tree=/var/www/hexo --git-dir=/var/repo/blog.git checkout -f
```

注意，`/var/www/hexo` 要换成你自己的部署目录，一般可能都是 `/var/www/html`。上面那句 git 命令可以在我们每次 push 完之后，把部署目录更新到博客的最新生成状态。这样便可以完成达到自动部署的目的了。

不要忘记设置这个文件的可执行权限：

```shell
chmod +x post-receive
```

 

### 第六步

改变 `blog.git` 目录的拥有者为 `git` 用户：

```shell
$ sudo chown -R git:git blog.git
```

### 第七步

禁用 `git` 用户的 shell 登录权限。

出于安全考虑，我们要让 `git` 用户不能通过 shell 登录。可以编辑 `/etc/passwd` 来实现，在 `/etc/passwd`中找到类似下面的一行：

```shell
git:x:1001:1001:,,,:/home/git:/bin/bash
```

将其改为：

```shell
git:x:1001:1001:,,,:/home/git:/usr/bin/git-shell
```

这样 `git` 用户可以通过 ssh 正常使用 git，但是无法登录 sehll。

至此，服务器端的配置就完成了。

## 本地配置

配置你的 hexo 博客可以自动 deploy 到服务器上，再也不用 ftp 上传了。

修改 hexo 目录下的 `_config.yml` 文件，找到 [deploy] 条目，并修改为：

```shell
deploy:type: gitrepo: git@www.swiftyper.com:/var/repo/blog.gitbranch: master
```

要注意切换成你自己的服务器地址，以及服务器端 git 仓库的目录。

本地配置就是如此地简单。至此，我们的 hexo 自动部署已经全部配置好了。

## 使(zhuang)用(bi)

从此以后，要发新博客的步骤不要太简单：

```shell
 hexo new "new-post" # bla..bla..bla.. $ hexo clean && hexo generate --deploy
```

有没有很酷很方便，一条命令就可以将博客自动部署到自己的 VPS 上了，开始快乐地写博客吧。

 