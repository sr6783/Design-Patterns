# 发布订阅模式

> 发布订阅模式定义了对象间的一种一对多的依赖关系,当一个对象的状态发生改变时,所有依赖它的对都将得到通知,在js中,用事件模型来替代传统的发布-订阅模式

发布订阅模式中的发布实质就是调用订阅时留下的回调函数(遍历花名册发短信)
发布订阅模式中的订阅实际上就是传入回调函数(留下联系方式)

### 发布订阅模式最重要理清每一个对象的职责
谁发布? => publish
订阅并不需要维护第二个对象,所以订阅指的是接受订阅,因为如果订阅这个行为被定义在订阅者上,则至少需要2个,..更多的对象上动态添加订阅的行为。但是这样的话会不好维护。

### 发布订阅模式的流程
1. 发布者可以接受订阅(订阅者调用发布者对象的方法传入回调函数)
2. 发布者缓存订阅类型和通知方式
3. 当发布时(状态改变时),告知订阅者
**核心:订阅者只知道发生了改变,而不知道是如何引起的改变**

### 对比js中的事件模型
注册事件,添加回调 == 发布订阅中的订阅
server.on('data', function(){});
回调函数何时执行
1. 事件发生时       发布消息时
2. 如何执行?
发布时根据相应的事件类型,遍历循环调用回调函数


### 真实例子——网站登录
  假如我们正在开发一个商城网站,网站里有header头部,nav导航,消息列表,购物车等模块。这几个模块的渲染有一个共同的前提条件,就是必须先用ajax异步请求获取用户的登录信息。这是很正常的,比如用户的名字和头像显示在header模块里,而这两个字段都来自用户登录后返回的消息。
    
  至于ajax请求什么时候能成功返回用户信息,这点我们没有办法确定。现在的清洁看起来像极了售楼处的例子,小明不知道什么时候开发商手里的售楼手续可以办下来。
    
  但现在还不足以说服我们在此使用发布订阅模式,因为异步的问题通常也可以用回调函数来解决。更重要的一点是,**我们不知道除了header头部,nav导航,消息列表,购物车之外,将来还有哪些模块需要使用这些用户信息**。如果它们和用户信息模块产生了强耦合,比如下面这样的形式
  ```
  
   login.succ(function(data) {
     header.setAvatar(data.avatar); //设置header模块的头像
     nav.setAvatar(data.avatar);    //设置导航模块的头像
     message.refresh();             //刷新消息列表
     cart.refresh();                //刷新购物车列表
     }
   );
   
  ```
  现在登录模块是我们编写的,但我们还必须了解header模块里设置头像的方法叫setAvatar,购物车里刷新的方法叫refresh,这种耦合性使程序变得僵硬,header模块不能随意改变setAvatar的方法名,它自身的名字也不能被改为header1,header2。**这是针对具体实现编程的典型例子,针对具体实现编程是不被赞同的。**
  
  等到有一天,项目中又新增一个收货地址管理模块,这个模块本来是另一个同事写的,而此时你正在马来西亚度假,但是他却不得不给你打电话:"HI,登录之后麻烦刷新一下收货地址列表。"于是你又要翻开你三个月以前写的登录模块,在最后加上这行代码:
  ```
  
  login.succ(function(data) {
    header.setAvatar(data.avatar);
    nav.setAvatar(data.avatar);
    message.refresh();
    cart.refresh();
    address.refresh();  //增加这行代码
  })
  
  ```
   
   我们就会疲于应付这种突如其来的业务要求,要么跳槽了事,要么重构这些代码。
  如何每次获得ajax请求的登录信息后,各个模块各自地得到通知,进行处理呢?用发布-订阅模式重写后,对用户信息感兴趣的模块将自行订阅登录成功的消息事件。当登录成功后,登录模块只需要发布登录成功的消息,告知订阅模块,订阅模块接受到消息之后,就会开始进行各自的业务处理,登录模块并不关心业务方要做什么,也不想去了解他们内部的细节。
  
  改善后代码
  ```
  $ajax('http://xxx.com?login', function(data) {   //登录成功
    login.trigger('loginSucc', data); //发布登录成功的消息
  
  var header = (function(){ //header模块
    //接受订阅
    login.listen('loginSucc', function(data) {
      header.setAvatar(data.avatar);
   };
   return {
    setAvatar: function(data) {
      //... setHeaderAvatar
    } 
   }
  })();
  
  //nav 模块
  var nav = (function() {
    //接受订阅
    login.listen('loginSucc', function(data) {
      nav.setAvatar(data.avatar);
     })
     return {
        setAvatar: function(avatar) {
          // ... setNavAvatar
     }
  })()
  }
  
  ```
  
  如上所述,我们随时可以把setAvatar的方法名改成setTouXiang。如果有一天在登录完成之后,又增加了刷新收货地址列表的需求,那么只要在收货地址模块里加上监听消息的方法即可,而这可以让开发该模块的同时自己完成,你作为登录模块的开发者,永远不再关心这些行为了
  
  ```
  
  var adress = (function() {  //adress
    //接受订阅
    login.listen('loginSucc', function(data) {
      adress.refresh(data);  //通知我
    };
    return {
     refresh: function(avatar) {
       // .. refreshAdress;
     }
    }
  })()
  ```