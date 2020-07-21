function Promise(executor) {
  let self = this;

  self.status = "pending";
  self.data = undefined;
  // 状态一直没变的时候，resolve回调
  self.onResolvedCallback = [];
  // 状态一直没变的时候，rejected回调
  self.onRejectedCallback = [];

  try {
    executor(resolve, reject);
  } catch (e) {
    // 如果发生错误，则直接拒绝
    reject(e);
  }

  // 定义resolve
  function resolve(data) {
    let self = this;
    

  }
}

window.Promise = Promise;
