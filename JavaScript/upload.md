### dataTransfer

### Ajax上传时入参错误
```JavaScript
var fd=new FormData();
fd.append("mypic",fileList[0]);
$.ajax({
  type:"POST",
  url:"upload.php",
  data:fd,
  contentType:undefined,
  processData:false,
  mimeType:"multipart/form-data",
  success:function(){
    console.log("成功");
  }
})
//processData用于对data参数进行序列化处理，默认值是true。
//默认情况下发送的数据将被转换为对象，如果不希望把File转换，需要设置为false
```