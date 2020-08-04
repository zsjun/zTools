(function(modules) {
    function require(id) {
      const [fn, mapping] = modules[id];
      function localRequire(relativePath) {
        return require(mapping[relativePath]);
      };
      const module={
        exports: {}
      };
      fn(localRequire, module,module.exports);

      console.log("ww", module.exports)
      return module.exports;
    }
    require(0);
  })({0: [function(require, module, exports) {
        "use strict";

var _a = _interopRequireDefault(require("./a.js"));

var _b = _interopRequireDefault(require("./b.js"));

var _c = _interopRequireDefault(require("./c.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _a["default"])();
(0, _b["default"])();
(0, _c["default"])();
    },
    {"./a.js":1,"./b.js":2,"./c.js":3}],1: [function(require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default() {
  console.log("a");
};

exports["default"] = _default;
    },
    undefined],2: [function(require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default() {
  console.log("b");
};

exports["default"] = _default;
    },
    undefined],3: [function(require, module, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default() {
  console.log("c");
};

exports["default"] = _default;
    },
    undefined],})