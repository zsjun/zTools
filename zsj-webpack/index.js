const fs = require("fs");
const path = require("path");
// 转成ast
const babylon = require("babylon");
// 遍历ast
const traverse = require("babel-traverse").default;
// 转成es5
const { transformFromAst } = require("babel-core");


