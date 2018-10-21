-----

title: iTerm终端设置代理
categories: Mac&PC
date: 2018-10-10
tags: [电脑技巧]

-----

某些站点必须爬墙才能访问，但在mac上设置的全局代理，对终端又不起作用，终端需要单独设置代理。
在终端中执行：

```shell
export ALL_PROXY=socks5://127.0.0.1:1086/
```

如果是http的代理:

```shell
export http_proxy=http://127.0.0.1:1087/
export https_proxy=http://127.0.0.1:1087/
```

如果需要开机自动设置，把上面的代码加到~/.bash_profile里

`source  ~/.bash_profile` 使文件生效

测试当前终端标签/窗口是否走代理：

```shell
curl ip.gs
```