function deepClone(obj = {}) {
  return JSON.parse(JSON.stringify(obj));
}

// function deepClone(obj = {}) {

// }

window.deepClone = deepClone;
