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
使用weakMap 来处理已经复制过的对象，避免超出函数栈
2 代码
function deepClone(target, map) {
  let cloneTarget;
  if (!map) {
    map = new WeakMap();
  }
  if (target !== null && (typeof target === "object" || Array.isArray(target))) {
    cloneTarget = Array.isArray(target) ? [] : {};
    const keys = Object.keys(target);
    if (map.has(target)) {
      return map.get(target);
    }
    for (let key of keys) {
      cloneTarget[key] = deepClone(target[key], map);
    }
    map.set(target, cloneTarget);
  } else {
    cloneTarget = target;
  }

  return cloneTarget;
}

## 其它的类型

可以通过toString(), 来获得，例如Object.prototype.toString.call(Symbol("ss")) 获得"[object Symbol]"
1 普通类型，比如"Boolean"，"Number"，可以通过它们的constructor来复制，而Symbol类型，可以Object(Symbol.prototype.valueOf.call(targe))
而正则类型，
```
function cloneReg(targe) {
  const reFlags = /\w*$/;
  const result = new targe.constructor(targe.source, reFlags.exec(targe));
  result.lastIndex = targe.lastIndex;
  return result;
}
```
2 数组，对象，以及map，set，同样递归遍历即可








