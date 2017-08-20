/**
 * Created by sunrui on 2017/4/24.
 */

//之前存在的问题:
// 1.给每一个发布者对象都添加了listen和trigger还有remove方法,以及一个缓存列表,这其实是一种资源的浪费。
// 2.小明跟售楼部对象还是存在一定的耦合性,小明至少要知道售楼处对象对象的名字是salesOffice,才能顺利的订阅到事件

//如果小明还关心300平方米的房子,而这套房子的卖家是salesOffice2,这意
// 味着小明要开始订阅salesOffice2对象。见如下代码
// salesOffices2.listen('squareMeter300', function (price) {
//   console.log('价格是 ' + price);
// });

//那假如还关注更多300平方米的房子呢?
//其实在现实生活中,买房子未必亲自要去售楼部,我们只要把订阅的请求交给中介公司,而各大房产公司也只需要通过中介公司来发布房子消息。这样一来,我们不用关心消息是来自哪个房产公司,我们在意的是能否顺利收到消息。当然,为了保证订阅者和发布者能顺利通信,订阅者和发布者都必须知道这个中介公司。

//同样,在程序中,发布-订阅模式可以用一个全局的Event对象来实现,订阅者不需要了解消息来自哪个发布者,发布者也不知道消息会推送给哪些订阅者,Event作为一个类似"中介者"的角色,把订阅者和发布者联系起来。


//全局的发布-订阅对象


//整体是 变量声明和赋值表达式的结合,按照优先级,先声明变量Event,然后计算右侧表达式的值,最后将表达式的值赋值给变量,但在计算表达式的值时,匿名函数立即执行。
var Event = (function() {
  //私有变量
  var clientList = {},
      listen,
      trigger,
      remove;

  // 接收订阅
  listen = function(type, fn) {
    //判断该类型是否存在,不存在就创建一个
    if(!clientList[type]) {
      clientList[type] = [];
    }
    //添加进去
    clientList[type].push(fn);
  };

  //发布
  trigger = function() {
    //取出类型
    let type = Array.prototype.shift.call(arguments);
    //如果类型不存在 返回
    if (!type) {
      return false;
    }
    //取出类型的所有回调
    let fns = clientList[type];
    let len = fns.length;
    //判断此类型是否是否存在,是否有人订阅
    if(!fns || len === 0) {
      return false;
    }
    //发布
    for(let i = 0; i < len; i++) {
      let fn = fns[i];
      fn.apply(this,arguments);
    }
  };

  //退订
  remove = function(type, fn) {
    let fns = clientList[type];
    let len = fns.length;
    //判断退订类型是否存在
    if(!fns) {
      return false;
    }
    //判断fn是否传入,如果单传type且type有类型,说明是退订全部
    if(!fn) {
      fns && (fns.length = 0);
    }else {  //如果传入了type和fn,说明只是一个人退订
      for (let i = 0; i < len; i++) {
          let _fn = fns[i];
        if (_fn === fn) {
          //退订
          fns.splice(i,1);
        }
      }
    }
  };

  //暴露对外接口,此时k的name可以随便取,
  return {
    listen: listen,
    trigger: trigger,
    remove: remove
  }
}) ();

//接受小红的订阅
Event.listen('squareMeter88', function (price) {
  console.log('价格是 ' + price);
});

//发布          type            data
Event.trigger('squareMeter88',20000);

//和之前的event有什么区别?

