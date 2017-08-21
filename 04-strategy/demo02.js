
// 使用组合函数重构代码


/*
 * 算法S的实现
 * @param {Number} salary
 * @return {Number}
*/
const performanceS = function(salary) {
    return salary * 4            // 代替1000行真实算法实现
}

/*
 * 算法A的实现
 * @param {Number} salary
 * @return {Number}
*/
const performanceA = function(salary) {
    return salary * 3            // 代替1000行真实算法实现
}

/*
 * 算法B的实现
 * @param {Number} salary
 * @return {Number}
*/
const performanceB = function(salary) {
    return salary * 2            // 代替1000行真实算法实现
}

/*
 * 计算奖金数额
 * @param {String} performanceLevel
 * @param {Number} salary
 * @return {Number}
*/ 
const calculateBonus = function(performanceLevel, salary) {
    if (performanceLevel === 'S') {
      // return salary * 4;
      performanceS(salary);
      
    }
    if (performanceLevel === 'A') {
      // return salary * 3;
      performanceA(salary);
    }
    if (performanceLevel === 'B') {
      // return salary * 2;
      performanceB(salary);
    }
  };



  
  calculateBonus('B', 20000 );  // 输出:40000
  calculateBonus('S', 6000 );   // 输出:24000