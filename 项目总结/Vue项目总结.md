------

title: Vue项目总结
category: Framework
date: 2018-10-31
tags: [vue,项目总结,JS]

------

## 1. 前言

最近做了一个内嵌在APP的H5项目,起初是准备自己选择vue框架和UI库搭建项目框架,后来发现已经有项目组采用了一个muse-ui库.为了APP的页面整体统一性,我只好clone了小伙伴的项目,在其基础上继续开发.

项目开发过程中遇到了不少坑,这个迭代开发结束就来逐步总结下.

<!-- more -->

闲话不多说,开始正题:

## 2. 关于muse-ui

这个框架采用material风格,对vue的支持就很友好,图标也是Google官方推荐的`Material Icons`字体包,用起来也很方便。官方有详细的安装介绍,`import`后采用`Vue.use()`即可:

```JavaScript
import Vue from 'vue'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
Vue.use(MuseUI)
```

我们的项目采用的是muse2.1版本,官方现在已经是3.0版本的了,2.1版本的API文档写的不是详细,所以当遇到坑时就头疼了.

## 3. 基于muse-ui封装表单组件

由于我们项目此次主要是表单,里面有大量的`input`、`textarea`、`select`等表单的应用场景,我们选择了对muse-ui表单组件进行二次封装,以利于ui组件适用于本项目移动端的样式,同时表单组件可随处复用。

#### 3.1 组件数据双向绑定v-model

数据双向绑定是vue中比较实用的一个功能,如:

```JavaScript
Vue.component('formInput', {
   data:{
      return {
      val:""
    }
  },
  template: `<input v-model='val'>`
})
```

而在父组件中,如何去实现实时获取子组件`formInput`的`value`呢?

```JavaScript
Vue.component('parent',{
    data:{
        return{
        	inputVal:""
    	}
    },
    template: `<form-input></form-input>`
})
```

vue的父子组件传递有一个口诀:`props down,events up`即父组件通过`props`向子组件传值,子组件通过`evens`向父组件传值,另外在官方文档中有这样的介绍:

```vue
<input v-model="searchText">
<!-- 等价于 -->
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value">
```

当用在组件上时:

```vue
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event">
</custom-input>
即
<custom-input v-model="searchText"></custom-input>
```

为了能正常传值,组件内的 `<input>` 必须：

- 将其 `value` 特性绑定到一个名叫 `value` 的 prop 上
- 在其 `input` 事件被触发时，将新的值通过自定义的 `input` 事件抛出

这段相当于让自定义组件通过`input`事件触发父组件的自定义事件,并传值给父组件

```JavaScript
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```

这样就能达到我们想要的目的了.

在单选框和复选框这类可能会将`value`用作不同的特性,vue提供了另一种方式:

```JavaScript
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
// 组件上
<base-checkbox v-model="lovingVue"></base-checkbox>
// lovingVue 的值将会传入这个名为 checked 的 prop
// ! 需要在组件的 props 选项里声明 checked 这个 prop。
```

#### 3.2 列表遍历v-for删除指定元素

在做图片上传的时候,需要添加上传进度和删除图片,彼此间互不干扰,这就需要每个组件都需要具备独立的功能:

> - 图片预览
> - 图片自动压缩
> - 图片上传
> - 上传进度动态展示
> - 删除按钮
> - 上传失败错误图标
> - 点击错误图标重传

我写了两个组件,一个是图片`single`组件,一个是图片`list`组件,在实际运行的时候发现,删除某一张图片会自动删除最后一张图片,通过`console.log`控制台打印索引`index`,删除的索引是正确的,百思不得其解!最后百度才发现问题出在了循环`v-for`的`:key`上了

为方便理解,先举个例子:

<iframe width="100%" height="300" src="//jsrun.net/z8hKp/embedded/all/light/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

`single`图片组件具备了上述功能,选择一个图片后在`list`组件及时`push`一个图片的对象`this.fileList.push(item)`,这样页面就能通过`v-for`动态渲染,但使用后发现直接删除`fileList`某个元素就只会删除集合最后一个元素.针对`fileList`添加唯一性的索引就能解决这个问题,`this.fileList.push({ id: this.id, data: item });`,将`:key`绑定到`id`

> 由于v-for循环的是子组件，子组件内部显示数据并未绑定fileList数组里的属性,子组件的显示数据并未按新数组重新渲染,**体现出来的结果**就是最后一个元素被删掉了。

## 4. 移动端拍照图片压缩上传

移动端图片上传存在两个问题:

1. 图片压缩

   当前手机拍出来的照片像素高、尺寸大，而且使用 base64 编码的照片会比原照片大，用 canvas 来渲染这照片的速度会相对比较慢，那么上传的时候进行压缩就非常有必要的

   图片压缩可以有两个阶段可以控制：

   - 控制`canvas`画布大小
   - `canvas`转`blob`对象或`base64`,控制质量比例

   **Tips:**

   1.1 `canvas`转`blob`对象:`canvas.toBlob(callback, type, radio)`
   >  callback: 回调函数，可获得一个单独的[`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)对象参数
   >  type: 指定图片格式，默认格式为`image/png`
   >  radio: 当请求图片格式为`image/jpeg`或者`image/webp`时用来指定图片展示质量

   Blob 对象相当于一个容器，可以用于存放二进制数据。它有两个属性，size 属性表示字节长度，type 属性表示 MIME 类型。

   ```JavaScript
    canvas.toBlob(function(blob) {
      var url = URL.createObjectURL(blob);
      var newImg = new Image();
      newImg.onload = function() {
        URL.revokeObjectURL(url)	// URL.revokeObjectURL():释放一个之前通过调用 URL.createObjectURL() 创建的已经存在的 URL 对象。当你结束使用某个 URL 对象时，应该通过调用这个方法来让浏览器知道不再需要保持这个文件的引用,避免消耗资源
      };
      newImg.src=url;
    };
    //生成JPEG格式的图片
    canvas.toBlob(function(blob){...}, "image/jpeg", 0.95); // JPEG at 95% quality
   ```

   `canvas.toBlob`方法在低版本的`ios`存在兼容性问题,需要添加一下代码实现兼容:

   ```JavaScript
   if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function (callback, type, quality) {
    var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
   len = binStr.length,
   arr = new Uint8Array(len);
    	for (var i=0; i<len; i++ ) {
      arr[i] = binStr.charCodeAt(i);
    	}
   	  callback( new Blob( [arr], {type: type || 'image/png'} ) );
    	}
    });
   }
   ```

   1.2 `canvas`转`base64`:直接调用方法`canvas.toDataURL(type, radio)`

    > type: 图片格式，默认为 `image/png`
    >
    > radio: 当请求图片格式为`image/jpeg`或者`image/webp`时用来指定图片展示质量
    >
    > 与转blob对象不同的是,`canvas.toDataURL`直接返回base64 的图片

   ```JavaScript
   var newImg = new Image();
   newImg.src=canvas.toDataURL("image/png",0.8);
   ```

2. 上传进度展示

   文件上传需要用到`XMLHttpRequest:progress`方法,在`axios`的api中提供了现成的`onUploadProgress`方法

   ```JavaScript
   this.$axios({
     url:'/upload'
     method: "post",
     data: data,
     onUploadProgress: function(event) {
       if (event.lengthComputable) {
         self.radio = (event.loaded / event.total) * 100;
       }
     }
   })
   ```

   当上传存在跨域的时候,浏览器在跨域请求前会默认发个`options`请求来验证是否跨域,这是后端服务器需要处理`options`请求

   > `OPTIONS` 方法用来查询针对请求 URI 指定的资源支持的方法。

   <img src='https://haohome.top/18-11-8/51395595.jpg' width="50%">

   | 请求 | OPTIONS*HTTP/1.1<br />Host:www.zhongguo.com/upload           |
   | :--: | :----------------------------------------------------------- |
   | 响应 | HTTP/1.1 200 OK<br/>Allow: GET, POST, HEAD, OPTIONS
（返回服务器支持的方法） |

   如果后端未对`OPTIONS`请求做处理,前端文件`post`上传文件会失败的

   **当后端对`OPTIONS`请求做出响应200时,前端才会继续发送`post`请求**,这就是我们在调试时看到文件上传时会默认发`OPTIONS`和`post`两个请求的原因

3. 拍照图片旋转

   在手机上通过H5网页` input `标签拍照上传图片，有一些手机会出现图片旋转了90°的问题,这些手机竖着拍的时候才会出现这种问题，横拍出来的照片就正常显示。因此，可以通过获取手机拍照角度来对照片进行旋转，从而解决这个问题。

   `Orientation`:通过这个参数可以识别图片的拍摄角度,手机拍出来的图片会带有这个参数

   | 旋转角度  | 参数值 |
   | :-------: | :----: |
   |    0°     |   1    |
   | 顺时针90° |   6    |
   | 逆时针90° |   8    |
   |   180°    |   3    |

   想要获取 `Orientation` 参数，可以通过 `exif.js` 库来操作

   ```JavaScript
   // vue项目可直接安装
   npm i exif-js -D
   //在图片组件中直接引入
   import Exif from 'exif-js'
   Exif.getData(file, function() {  
     var Orientation = Exif.getTag(this, 'Orientation');
   });
   ```

   在对图片进行`canvas`绘图时,就可以针对`Orientation`参数做判断处理:

   ```JavaScript
   if (Orientation && Orientation != 1) {
     switch (Orientation) {
       case 6:     // 旋转90度
         canvas.width = imgHeight;
         canvas.height = imgWidth;
         ctx.rotate(Math.PI / 2);
         // (0,-imgHeight) 从旋转原理图那里获得的起始点
         ctx.drawImage(img, 0, -imgHeight, imgWidth, imgHeight);
         break;
       case 3:     // 旋转180度
         ctx.rotate(Math.PI);
         ctx.drawImage(img, -imgWidth, -imgHeight, imgWidth, imgHeight);
         break;
       case 8:     // 旋转-90度
         canvas.width = imgHeight;
         canvas.height = imgWidth;
         ctx.rotate(3 * Math.PI / 2);
         ctx.drawImage(img, -imgWidth, 0, imgWidth, imgHeight);
         break;
     }
   }else{
     canvas.width = imgWidth;
     canvas.height = imgHeight;
     ctx.drawImage(img, 0, 0, imgWidth, imgHeight)
   }
   ```

   Demo: [图片上传与压缩](./图片上传与压缩.md)

## 5. -webkit-overflow-scrolling的坑

项目中有一个获取数据后纯展示的页面,在ios平台上滑动不流畅,经过查询才了解到在ios的safari浏览器和app内核浏览器中，当一个h5页面内容超出屏幕高度，我们手指去滑动屏幕的时候，只要手势一离开屏幕，滚动立刻结束,按照教程我按下面设置了:

```Css
*{
   -webkit-overflow-scrolling: touch;
}
```

结果在app中出现了fixed 定位元素失效

