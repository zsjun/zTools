const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("循环引用"));
  }
  let then;
  let called = false;
  if (x instanceof Promise) {
    if (x.status == PENDING) {
      x.then(
        (y) => resolvePromise(promise2, y, resolve, reject),
        (r) => reject(r)
      );
    } else x.then(resolve, reject);
  } else if (x != null && (typeof x == "object" || typeof x == "function")) {
    try {
      then = x.then;
      if (typeof then == "function") {
        then.call(
          x,
          (y) => {
            //防止promise会同时执行成功和失败的回调
            //如果promise2已经成功或失败了，则不会再处理了
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            //防止promise会同时执行成功和失败的回调
            //如果promise2已经成功或失败了，则不会再处理了
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

class Promise {
  constructor(executor) {
    // 设置状态
    this.status = PENDING;
    this.value = undefined;
    // 定义存放 成功后 执行的回调数组
    this.onResolvedCallbacks = [];
    // 定义存放 失败后 执行的回调数组
    this.onRejectedCallbacks = [];

    let resolve = (data) => {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        if (this.status === PENDING) {
          this.status = FULFILLED;
          this.value = data;
          this.onResolvedCallbacks.forEach((cb) => cb(this.value));
        }
      });
    };
    let reject = (reason) => {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        if (this.status === PENDING) {
          this.status = REJECTED;
          this.value = reason;
          this.onRejectedCallbacks.forEach((cb) => cb(this.value));
        }
      });
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected == "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    let promise2;

    if (this.status === FULFILLED) {
      promise2 = new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      });
    }
    if (this.status === REJECTED) {
      promise2 = new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          try {
            let x = onRejected(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      });
    }
    if (this.status === PENDING) {
      promise2 = new Promise((resolve, reject) => {
        this.onResolvedCallbacks.push((value) => {
          try {
            let x = onFulfilled(value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push((reason) => {
          try {
            let x = onRejected(reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    return promise2;
  }
}

// 测试
Promise.deferred = Promise.defer = function () {
  var defer = {};
  defer.promise = new Promise(function (resolve, reject) {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
};
try {
  module.exports = Promise;
} catch (e) {}
