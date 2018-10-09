iTerm2和Macbook自带的Terminal差不多，但是功能更强大，强烈推荐使用。

 下面说下，如何让iTerm2记住远程服务器SSH登录账号和密码。

 第一步：打开Finder，在菜单栏找到『前往』→ 『前往文件夹...』，输入：~/.ssh/ 然后回车

 第二步：新建一个文件，命名为example吧，里面写入内容：

```shell
set user root
set host 122.114.12.181
set password WuHaoXcp1990
 
spawn ssh $user@$host
expect "*assword:*"
send "$password\r"
interact
expect eof
```

 第三步：到官方<http://www.iterm2.com/>下载并打开iTerm2，菜单栏找到『Profiles』→『Open Profiles...』,打开面板上，点击右下角『Edit  Profiles...』

 第四步：在打开面板，左边应该是选中默认default，右边找到Command，默认应该是Login shell，选中Command，里面输入：expect ~/.ssh/example

 第五步，下次打开iTerm2，是不是默认就登录上服务器了？极大提升效率。
 按照以上方法，可以配置profile,对应很多个服务器。这样每次启动可以选择默认操作，然后再profile下拉选中中执行对应的VPS profile，则可以实现自动登录！