// function deepClone(obj = {}) {
//   return JSON.parse(JSON.stringify(obj));
// }

function deepClone(target, map) {
  let cloneTarget;
  if (!map) {
    map = new WeakMap();
  }
  if (target !== null && (typeof target === "object" || Array.isArray(target))) {
    cloneTarget = Array.isArray(target) ? [] : {};
    const keys = Object.keys(target);
    if (map.has(target)) {
      return map.get(target);
    }
    for (let key of keys) {
      cloneTarget[key] = deepClone(target[key], map);
    }
    map.set(target, cloneTarget);
  } else {
    cloneTarget = target;
  }

  return cloneTarget;
}

window.deepClone = deepClone;
