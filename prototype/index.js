function Father(name, age) {
  this.name = name;
  this.page = page;
}

Father.prototype.addAge = function (age) {
  this.age += age;
};
Father.prototype.getAge = function (age) {
  console.log(this.age);
};

