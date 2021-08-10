const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class MyPromise3 {
  // 构造方法接收一个回调
  constructor(executor) {
    this._status = PENDING; // Promise状态
    this._resolveQueue = []; // 成功队列, resolve时触发
    this._rejectQueue = []; // 失败队列, reject时触发

    // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
    let _resolve = (val) => {
      if (this._status !== PENDING) return; // 对应规范中的"状态只能由pending到fulfilled或rejected"
      this._status = FULFILLED; // 变更状态

      // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
      // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
      while (this._resolveQueue.length) {
        const callback = this._resolveQueue.shift();
        callback(val);
      }
    };
    // 实现同resolve
    let _reject = (val) => {
      if (this._status !== PENDING) return; // 对应规范中的"状态只能由pending到fulfilled或rejected"
      this._status = REJECTED; // 变更状态
      while (this._rejectQueue.length) {
        const callback = this._rejectQueue.shift();
        callback(val);
      }
    };
    // new Promise()时立即执行executor,并传入resolve和reject
    executor(_resolve, _reject);
  }

  // then方法,接收一个成功的回调和一个失败的回调
  then(resolveFn, rejectFn) {
    typeof resolveFn !== "function" ? (value) => value : null;
    typeof rejectFn !== "function" ? (reason) 
    return new MyPromise3((resolve, reject) => {
      const fufilledFn = (val) => {
        try {
          const x = resolveFn(val);
          x instanceof MyPromise3 ? x.then(resolve, reject) : resolve(x);
        } catch (err) {
          reject(err);
        }
      };
      this._resolveQueue.push(fufilledFn);
      const rejectedFn = (error) => {
        try {
          let x = rejectFn(error);
          x instanceof MyPromise3 ? x.then(resolve, reject) : resolve(x);
        } catch (error) {
          reject(error);
        }
      };
      this._rejectQueue.push(rejectedFn);
    });
  }
}

window.Promise = MyPromise3;
