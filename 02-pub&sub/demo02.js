/**
 * Created by sunrui on 2017/4/23.
 */


//如何一步步实现publish-subscribe mode
//首先指定好谁充当发布者
//然后给发布者添加一个缓存列表,用于存放回调函数以便通知订阅者(售楼部的花名册)
//最后发布消息的时候,发布者会遍历这个缓存列表,依次触发里面存放的订阅者的回调函数(遍历花名册,挨个发短信)

//另外 我们还可以往回调函数里填入一些参数,订阅者可以接收这些参数。这是很有必要的,比如售楼部可以再发给订阅者的短信里加上房子的单价,面积,容积率等信息,订阅者接收到这些信息之后可以进行各自的处理



//此时发布者会把所有的消息发布给订阅者,但是如果有些消息是订阅者不需要的,会增加用户的困扰

//如何让订阅者只订阅自己感兴趣的?

//指定发布者
var salesOffices = {};

//给发布者添加缓存列表
//salesOffices.clientList = [];
salesOffices.clientList = {};

//增加订阅者
salesOffices.listen = function(key, fn) {
  if(!this.clientList[key]) {
    this.clientList[key] = [];
  }
    this.clientList[key].push(fn);   //订阅消息被添加进缓存列表

};

//发布消息
//此时发布消息时,不像以前一样发送了,而是分类型发送 类型,消息
salesOffices.trigger = function() {
  var i, len, fn, key, fns;
  key = Array.prototype.shift.call(arguments);//取出消息类型
  console.log(key);
  fns = this.clientList[key];//取出消息类型的值
  len = fns.length; //要通知多少个
  //如果取出来的消息类型不存在或者没人关注就返回,怎么会有没人关注的呢?
  //因为我们的key是从arguments取出来的,也许这个类型不存在于花名册中,也许这个消息存在但没有人关注,此时我们都不用发布了
  if (!fns || len === 0) {
    return false;
  }
  for (i = 0; i < len; i++ ) {
    fn = fns[i];
    fn.apply(this, arguments); //arguments是发布消息时带上的参数
  }
};
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

