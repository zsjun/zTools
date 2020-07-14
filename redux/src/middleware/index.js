class Store {
  constructor(reducers, initstate) {
    this.listeners = [];
    this.state = initstate;
    this.reducers = reducers;
    console.log(11);
  }
  createStore(reducers, initstate, middlewares) {
    if (Array.isArray(middlewares) && middlewares.length > 0) {
      return this.applyMiddware(middlewares)(this.createStore)(reducers, initstate);
    }
    return new Store(reducers, initstate);
  }
  subscribe(fn) {
    this.listeners.push(fn);
  }
  getState() {
    return this.state;
  }
  combineReducers(reducers) {
    // reducers 类似这种格式
    // reducers = {
    //   1: () = {},
    //   2: ()=>{}
    // }
    // 获得对象的key 数组
    const keys = Object.keys(reducers);
    return function combine(state = {}, action) {
      if (action.reducerKey === "INIT") {
        for (let i = 0; i < keys.length; i++) {
          state[keys[i]] = reducers[keys[i]]("", action);
        }
      } else {
        const preStateForKey = state[action.reducerKey];
        // 对应的reducerFor key 函数
        const reducerForKey = reducers[action.reducerKey];
        state[action.reducerKey] = reducerForKey(preStateForKey, action);
      }
      return state;
    };
  }
  dispatch(action) {
    const reducer = this.combineReducers(this.reducers);
    this.state = reducer(this.state, action);
    for (let i = 0; i < this.listeners.length; i++) {
      listeners[i]();
    }
  }
  applyMiddware(middlewares) {
    return function (createstore) {
      return function newCreater(reducers, initstate) {
        const store = createstore(reducers, initstate);
        // 中间件形式 (store) => next => action => {}
        const chain = middlewares.map(function (middleware) {
          return middleware(store);
        });
        const next = store.dispatch;
        store.dispatch = chain.reduceRight(function (a, b) {
          return a(b(next));
        });
        return store;
      };
    };
  }
}
window.Store = new Store();
