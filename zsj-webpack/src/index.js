const fs = require("fs");
const path = require("path");
// 创建ast
const babylon = require("babylon");
// 遍历ast
const traverse = require("babel-traverse").default;
// 转成es5
const { transformFromAstSync } = require("@babel/core");

let ID = 0;

// 自顶向下
const graph = createGraph("./example/entry.js");
// 形成out文件
const res = bundle(graph);
writeFile(res);

function writeFile(res) {
  fs.writeFileSync("./example/bundle.js", res);
}
// console.log("111", res);
function createGraph(entry) {
  const asset = createAsset(entry);
  const res = [asset];
  res.forEach((asset) => {
    asset.mapping = {};
    const dirname = path.dirname(asset.filename);
    asset.dependencies.forEach((element) => {
      const absolutePath = path.join(dirname, element);
      const child = createAsset(absolutePath);
      asset.mapping[element] = child.id;
      res.push(child);
    });
  });
  return res;
}

function getCode(filename, content) {
  const dependencies = [];
  // 解析成ast
  const ast = babylon.parse(content, {
    sourceType: "module",
  });
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });
  const { code } = transformFromAstSync(ast, null, {
    presets: ["@babel/preset-env"],
  });
  return { code, dependencies };
}
function createAsset(filename) {
  // 读取文件内容
  // const content = fs.readFileSync("./example/entry.js", "utf-8");
  const content = fs.readFileSync(filename, "utf-8");

  const { code, dependencies } = getCode(filename, content);
  const id = ID++;
  return {
    id,
    filename,
    dependencies: [...dependencies],
    code,
  };
}
// 根据依赖图打包所有文件, 传入的一个依赖的数组
function bundle(graph) {
  let modules = ``;

  graph.forEach((element) => {
    modules += `${element.id}: [function(require, module, exports) {
        ${element.code}
    },
    ${JSON.stringify(element.mapping)}],`;
  });
  return `(function(modules) {
    function require(id) {
      const [fn, mapping] = modules[id];
      function localRequire(relativePath) {
        return require(mapping[relativePath]);
      };
      const module={
        exports: {}
      };
      fn(localRequire, module,module.exports);

      return module.exports;
    }
    require(0);
  })({${modules}})`;
}
