const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class MyPromise3 {
  // 构造方法接收一个回调
  constructor(executor) {
    this._status = PENDING; // Promise状态
    this._resolveQueue = []; // 成功队列, resolve时触发
    this._rejectQueue = []; // 失败队列, reject时触发
    this._value = undefined;

    // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
    let _resolve = (val) => {
      const run = () => {
        if (this._status !== PENDING) return; // 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = FULFILLED; // 变更状态
        this._value = val;
        // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
        while (this._resolveQueue.length) {
          const callback = this._resolveQueue.shift();
          callback(val);
        }
      }
      setTimeout(run);

    });
    // 实现同resolve
    let _reject = setTimeout((val) => {
      if (this._status !== PENDING) return; // 对应规范中的"状态只能由pending到fulfilled或rejected"
      this._status = REJECTED; // 变更状态
      this._value = val;
      while (this._rejectQueue.length) {
        const callback = this._rejectQueue.shift();
        callback(val);
      }
    }, 0);
    // new Promise()时立即执行executor,并传入resolve和reject
    executor(_resolve, _reject);
  }

  // then方法,接收一个成功的回调和一个失败的回调
  then(resolveFn, rejectFn) {
    typeof resolveFn !== "function" ? (value) => value : null;
    typeof rejectFn !== "function"
      ? (reason) => {
          return new Error(reason instanceof Error ? reason.message : reason);
        }
      : null;
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
      switch (this._status) {
        case PENDING:
          this._resolveQueue.push(fufilledFn);
          this._rejectQueue.push(rejectedFn);
          break;
        case FULFILLED:
          fufilledFn(this._value);
        case REJECTED:
          rejectedFn(this._value);
          break;
        default:
          break;
      }
    });
  }
  catch(rejectedFn) {
    return this.then(undefined,rejectedFn)
  }
  finally(callback) {
    return this.then(
        value => MyPromise3.resolve(callback()).then(() => value),             // MyPromise.resolve执行回调,并在then中return结果传递给后面的Promise
        reason => MyPromise3.resolve(callback()).then(() => { throw reason })  // reject同理
      )

  }
  static resolve(val) {
    if(val instanceof MyPromise3) {
      return val
    }else {
      return new MyPromise3((resolve,reject) => {
        resolve(val)
      })
    }
  }
  static reject(val) {
    return new MyPromise3((resolve,reject) => {
      reject(val)
    })
  }
  // 静态的all方法
  static all(promiseArr) {
    let index = 0
    let result = []
    return new MyPromise((resolve, reject) => {
      promiseArr.forEach((p, i) => {
        // Promise.resolve(p)用于处理传入值不为Promise的情况
        MyPromise.resolve(p).then(
          val => {
            index++
            result[i] = val
            // 所有then执行后, resolve结果
            if(index === promiseArr.length) {
              resolve(result)
            }
          },
          err => {
            // 有一个Promise被reject时，MyPromise的状态变为reject
            reject(err)
          }
        )
      })
    })
  }
  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
      //同时执行Promise,如果有一个Promise的状态发生改变,就变更新MyPromise的状态
      for (let p of promiseArr) {
        MyPromise.resolve(p).then(  //Promise.resolve(p)用于处理传入值不为Promise的情况
          value => {
            resolve(value)        //注意这个resolve是上边new MyPromise的
          },
          err => {
            reject(err)
          }
        )
      }
    })
  }

}

window.Promise = MyPromise3;
