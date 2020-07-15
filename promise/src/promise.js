class Promise {
  constructor(fn) {
    fn(this.resolve, this.reject);
    this.state = "pending";
  }
  resolve() {
    this.state = "fulfilled";
  }
  reject() {
    this.state = "rejected";
  }
  then(onFulfilled, onRejected) {}
}
