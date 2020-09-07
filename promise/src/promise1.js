class Promise {
  constructor(exec) {
    super(props);
    this.data = data;
    this.status = "pending";
    // 当then事件的时候，状态还是pending的时候，加入到里边
    this.onResolveCallback = [];
    this.onRejectedCallback = [];
    exec(this.resolve, this.reject);
  }
  resolve(data) {}
  then() {}
}
