// 模仿传统面向对象语言的实现

// 定义具体策略类
const performanceS = class {
  calculate (salary) {
    return salary * 4;     
  }
}

const performanceA = class {
  calculate (salary) {
    return salary * 3;
  }
}

const performanceB = class {
  calculate(salary) {
    return salary * 2;
  }
}


// 定义奖金类
const Bonus = class {
  constructor() {
    this.salary = null;   
    this.strategy = null;  // 效绩登记对应的策略对象
  }

  setSalary(salary) {
    this.salary = salary;
  }

  setStrategy (strategy) {
    this.strategy = strategy;
  }

  getBonus() {
    return this.strategy.calculate(this.salary); // 把计算奖金的操作委托给对应的策略对象
  }

}

// 使用
let bonus = new Bonus();

bonus.setSalary(10000);
bonus.setStrategy( new performanceS());

console.log(bonus.getBonus());

bonus.setStrategy(new performanceA());

console.log(bonus.getBonus());
