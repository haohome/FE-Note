- apache-maven-3.1.1
- maven helper
- tinyui

- 配置文件搜索器路径
```bank-deploy>bank-deploy-supplychain>src>main>resources>application.xml```
- 参考  Biz:
``` bank-supplychain>supplychain-biz>src>main>java>com>hundsun>tbsp>web>bank>supcn>biz>pattern>impl>patternQueryBizlmpl```

data-formatter:
格式化单元格内容，function(value, row, index), value：该cell本来的值，row：该行数据，index：该行序号（从0开始）

- controller:
只要改动controller,就要重新打包:单击controller文件夹,右键run Maven 选择clean install
再 jetty debug


- #tsbpUploadFileCheck  上传附件检查

新项目配置修改
- 配置maven setting
- 配置configuration
- .iml是intellij idea的工程配置文件，里面是当前projec的一些配置信息
