1.1 全新安装专业版，不是免费升级到专业版：Centos安装脚本
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_pro.sh && sh install.sh
1.2 免费版升级专业版脚本：Centos安装脚本
wget -O update.sh http://download.bt.cn/install/update_pro.sh && bash update.sh pro
其他系统版本未测试，请用户自行测试。
2. 安装后打开面板输入账号密码后，会提示让你绑定账号，不用理会。
3. 依次打开/www/server/panel/class目录找到common.py文件右键编辑此文件
  还是找到164行或搜索data = panelAuth.panelAuth，不用注释本行了
  data = panelAuth.panelAuth().get_order_status(None);
  并下添加以下内容
  data = {'status' : True,'msg' : {'endtime' : 32503651199 }}
  大概就是这个样子，代码格式一点要按图格式写，不然会报错。

4. 最后一步很重要
  依次打开/www/server/panel/data目录，在本目录下新建userInfo.json文件，内容为空。
5. 重启下bt面板服务，登录面板看看效果吧
  [root@root ~]#service bt restart

