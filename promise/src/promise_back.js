function Promise(executor) {
  let self = this;

  self.status = "pending"; // Promise当前的状态
  self.data = undefined; // Promise的值
  self.onResolvedCallback = []; // Promise resolve时的回调函数集，因为在Promise结束之前有可能有多个回调添加到它上面
  self.onRejectedCallback = []; // Promise reject时的回调函数集，因为在Promise结束之前有可能有多个回调添加到它上面

  // 执行exec

  function resolve(params) {
    if (self.status === "pending") {
      self.status = "fulfilled";
      self.data = params;
      for (let i = 0; i < self.onResolvedCallback.length; i++) {
        self.onResolvedCallback[i](value);
      }
    }
  }
  function reject(params) {
    if (self.status === "pending") {
      self.status = "rejected";
      self.data = params;
      for (let i = 0; i < self.onRejectedCallback.length; i++) {
        self.onRejectedCallback[i](reason);
      }
      console.log(2);
    }
  }
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== "function")
    onFulfilled = function (v) {
      return v;
    };
  if (typeof onRejected !== "function")
    onRejected = function (r) {
      throw r;
    };
  let promise2;
  let self = this;
  if (self.status === "fulfilled") {
    try {
      promise2 = new Promise((resolve, reject) => {
        let x = onFulfilled(self.data);
        if (x instanceof Promise) {
          return x.then(resolve, reject);
        } else {
          resolve(x);
        }
      });
    } catch (e) {
      reject(e);
    }
    return promise2;
  } else if (self.status === "rejected") {
    promise2 = new Promise(function (resolve, reject) {
      try {
        var x = onRejected(self.data);
        if (x instanceof Promise) {
          x.then(resolve, reject);
        }
      } catch (e) {
        reject(e);
      }
    });
    return promise2;
  } else if (self.status === "pending") {
    promise2 = new Promise(function (resolve, reject) {
      self.onResolvedCallback.push(function (value) {
        try {
          var x = onResolved(self.data);
          if (x instanceof Promise) {
            x.then(resolve, reject);
          }
        } catch (e) {
          reject(e);
        }
      });

      self.onRejectedCallback.push(function (reason) {
        try {
          var x = onRejected(self.data);
          if (x instanceof Promise) {
            x.then(resolve, reject);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    return promise2;
  }
};
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

// module.exports = Promise;
// Promise.defer = Promise.deferred = function () {
//   let dfd = {};
//   dfd.promise = new Promise((resolve, reject) => {
//     dfd.resolve = resolve;
//     dfd.reject = reject;
//   });
//   return dfd;
// };
window.Promise = Promise;
