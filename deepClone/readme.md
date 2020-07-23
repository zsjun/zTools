# JSON.parse
1 代码
JSON.parse(JSON.stringify(obj));

缺点：
1 不能copy function 还有死循环，比如以下两种
var obj = {
  a: 1,
  b: 2,
  c: obj,
};
let obj = {
  a: 1,
  b: 2,
  c: function() {
    console.log(1)
  },
};

clone 之后的结果都是{a: 1, b: 2}

## 递归
1 问题
1.1 如何处理死循环？



