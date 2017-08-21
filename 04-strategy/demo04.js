// JavaScript版的策略模式
// 1.让strategy对象从各个策略类中创建出来，这是模拟一些传统面向对象语言的实现。JavaScript中函数也是对象，所以最简单的做法是把strategy直接定义为函数：

// 这里用一个对象字面量的作用是管理 算法族/行为族
const strategies = {
  "S": function(salary) {
    return salary * 4;
  },
  "A": function(salary) {
    return salary * 3;
  },
  "B": function(salary) {
    return salary * 2;
  }
}

// 同样，Context（应用场景/需求）也没必要用Bonus类来表示，我们依然用calculateBonus函数来充当Context来接受用户的请求。
/*
 * 计算奖金
 * @param {String} level
 * @param {Number} salary
 * @return {Number}
 * */
const calculateBonus = function(level, salary) {
  return strategies[level](salary);
}