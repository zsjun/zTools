// function deepClone(obj = {}) {
//   return JSON.parse(JSON.stringify(obj));
// }

function deepClone(target, map) {
  let cloneTarget;
  if (!map) {
    map = new WeakMap();
  }
  if (target !== null && (typeof target === "Object" || Array.isArray(target))) {
    cloneTarget = Array.isArray(target) ? [] : {};
    const keys = Object.keys(target);
    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);
    for (let key in keys) {
      cloneTarget[key] = deepClone(target[key], map);
    }
  } else {
    cloneTarget = target;
  }
  return cloneTarget;
}

window.deepClone = deepClone;
