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
    } else {
      x.then(resolve, reject);
    }
  } else {
    if (x !== null && (typeof x === "object" || typeof x === "function")) {
      try {
        then = x.then;
        if (typeof then === "function") {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              resolvePromise(promise2, y, resolve, reject);
            },
            (r) => {
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
}
class Promise {
  constructor(exec) {
    this.data = undefined;
    this.status = PENDING;
    // 当then事件的时候，状态还是pending的时候，加入到里边,什么情况下会出现这些呢
    this.onResolveCallback = [];
    this.onRejectedCallback = [];
    try {
      exec(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }
  resolve(data) {
    let self = this;
    let timer = setTimeout(() => {
      clearTimeout(timer);
      if (self.status === PENDING) {
        self.status = FULFILLED;
        self.value = data;
        // 遍历执行成功回调
        self.onResolvedCallbacks.forEach((cb) => cb(self.value));
      }
    });
  }
  reject(data) {
    let self = this;
    let timer = setTimeout(() => {
      clearTimeout(timer);
      if (self.status === PENDING) {
        self.status = REJECTED;
        self.value = reason;
        // 遍历执行失败回调
        self.onRejectedCallbacks.forEach((cb) => cb(self.value));
      }
    });
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (error) => {
            throw error;
          };
    let self = this;
    let promise2;
    if (self.status === FULFILLED) {
      promise2 = new Promise(function (resolve, reject) {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          try {
            onFulfilled(self.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      });
    }
    if (self.status === REJECTED) {
      promise2 = new Promise(function (resolve, reject) {
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
    if (self.state === PENDING) {
      promise2 = new Promise((resolve, reject) => {
        self.onResolvedCallbacks.push((value) => {
          try {
            let x = onFulfilled(value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        self.onRejectedCallbacks.push((reason) => {
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

Promise.deferred = Promise.defer = function () {
  var dfd = {};
  dfd.promise = new Promise(function (resolve, reject) {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
try {
  module.exports = Promise;
  // window.Promise = Promise;
} catch (e) {}
