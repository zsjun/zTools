class Store {
  constructor(initstate) {
    this.listeners = [];
    this.state = initstate;
  }
  createStore(initstate) {
    return new Store(initstate);
  }
  subscribe(fn) {
    this.listeners.push(fn);
  }
  getState() {
    return this.state;
  }
  plan(state, action) {
    switch (action.type) {
      case "INCREMENT":
        return {
          ...state,
          count: state.count + 1,
        };
      case "DECREMENT":
        return {
          ...state,
          count: state.count - 1,
        };
      default:
        return state;
    }
  }
  changeState(action) {
    this.state = this.plan(this.state, action);
    for (let i = 0; i < this.listeners.length; i++) {
      listeners[i]();
    }
  }
}
window.Store = new Store();
