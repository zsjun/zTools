function Promise(executor) {
  let self = this;

  self.status = "pending"; // Promise当前的状态
  self.data = undefined; // Promise的值
  self.onResolvedCallback = []; // Promise resolve时的回调函数集，因为在Promise结束之前有可能有多个回调添加到它上面
  self.onRejectedCallback = []; // Promise reject时的回调函数集，因为在Promise结束之前有可能有多个回调添加到它上面

  // 执行exec

  function resolve(params) {
    self.status = "fulfilled";
    console.log(1);
  }
  function reject(params) {
    self.status = "rejected";
    console.log(2);
  }
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
Promise.prototype.then = function (params) {
  console.log(112);
};

window.Promise = Promise;
