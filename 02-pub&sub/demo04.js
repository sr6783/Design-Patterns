/**
 * Created by sunrui on 2017/4/24.
 */
//增加功能,取消订阅模式


/* 需求1 */
//如何一步步实现publish-subscribe mode
//首先指定好谁充当发布者
//然后给发布者添加一个缓存列表,用于存放回调函数以便通知订阅者(售楼部的花名册)
//最后发布消息的时候,发布者会遍历这个缓存列表,依次触发里面存放的订阅者的回调函数(遍历花名册,挨个发短信)

//另外 我们还可以往回调函数里填入一些参数,订阅者可以接收这些参数。这是很有必要的,比如售楼部可以再发给订阅者的短信里加上房子的单价,面积,容积率等信息,订阅者接收到这些信息之后可以进行各自的处理

//不足:
//此时发布者会把所有的消息发布给订阅者,但是如果有些消息是订阅者不需要的,会增加用户的困扰


/* 需求2 */
//如何让订阅者只订阅自己感兴趣的?


/* 需求3 */
//有没有什么办法让所有的对象都拥有发布-订阅的功能?
//抽象出一个publish对象,具有接受订阅和发布的能力
//给对象动态添加职能在js中是理所当然


/*  需求4  */
//取消订阅事件
var event = {
  // 缓存列表
  clientList: {},

  // 订阅
  listen: function (type, fn) {
    if(!this.clientList[type]){
      this.clientList[type] = []; //没有这类消息就创建
    }
    this.clientList[type].push(fn);
  },

  //发布
  //发布
  trigger: function () {
    var i, len, fn, fns, type;
    //获取发送消息的类型
    type = Array.prototype.shift.call(arguments);
    //判断类型是否存在或者是否有人订阅
    if (!type || type.length === 0) {
      return false;
    }
    //发布
    fns = this.clientList[type];
    len = fns.length;
    for(i = 0; i < len; i++) {
      fn = fns[i];
      fn.apply(this, arguments);
    }
  }

};

//给对象动态安装发布-订阅功能
var installEvent = function(obj) {
  for(let key in event) {
    obj[key] = event[key];
  }
  console.log(obj);
};

var salesOffices = {};
installEvent(salesOffices);



//因为发布者每次发布消息的时候,发布的信息内容和个数是不确定的,如何把这些消息发给订阅者?订阅者怎么接收?
//通过arguments来替代每次发布时的消息内容

//简单测试
salesOffices.listen('squareMeter88', function(price){
  console.log('价格 ' + price);

});//小明订阅消息

salesOffices.listen('squareMeter110', function(price){
  console.log('价格 ' + price);

});//小红订阅消

salesOffices.listen('price30000',function(squareMeter){
  console.log(squareMeter);

});//小白订阅消息,此时因为小白订阅时因为传输传少了,造成获取消息丢失
//此时发布者必须明确地告诉订阅者,会发送什么消息,有几条(发送两条消息,第一条是价格,第二条是大小)这样订阅者才会留下相应的参数,否则消息会不被接收
//怎么解决?

salesOffices.trigger('squareMeter88', 200000);
//salesOffices.trigger(300000, 110);
//发布者发布消息的时候怎么通知订阅者? 调用回调函数
//订阅者怎么知道回调函数被调用了并作出反应?


// 取消订阅
// 包括取消某一个人的通知 取消整个类型
event.remove = function (type, fn) {
  let fns;
  fns = this.clientList[type];
  if (!fns) {  //要取消的这一类型根本就不存在
    return false;
  }
  //只传了类型,表示取消整个类型
  if (!fn) {
    // fns存在的情况下就全部清空
    fns && (fns.length = 0);
  }else{
    //涉及到了
    for(let i = 0, len = fns.length; i < len; i++) {
      let _fn = fns[i];
      if(_fn === fn) {
        //数组删除元素的方法
        //splice方法:从index开始删,1代表howmany
        fns.splice(i,1); //删除指定的回调
      }
    }
  }

};


