const fs = require("fs");
const path = require("path");
// 创建ast
const babylon = require("babylon");
// 遍历ast
const traverse = require("babel-traverse").default;
// 转成es5
const { transformFromAstSync } = require("@babel/core");

let ID = 0;

// 根据入口形成依赖图
// 自顶向下编程方法
const graph = createGraph("./example/entry.js");
const result = bundle(graph);

//
function createGraph(entry) {
  // 获得单个文件的依赖
  const mainAsset = createAsset(entry);
  // 放到数组中
  const queue = [mainAsset];
  // 遍历数组, 不断的循环，形成一个依赖json 对象
  for (const asset of queue) {
    asset.mapping = {};

    const dirname = path.dirname(asset.filename);

    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path.join(dirname, relativePath);

      const child = createAsset(absolutePath);

      asset.mapping[relativePath] = child.id;

      queue.push(child);
    });
  }
  return queue;
}

// 很简单的一个函数，通过读取文件的内容，然后解析成ast，根据ast的import获取该文件依赖那些文件，

function createAsset(filename) {
  // 读取文件内容
  const content = fs.readFileSync(filename, "utf-8");
  // 解析成ast
  const ast = babylon.parse(content, {
    sourceType: "module",
  });

  const dependencies = [];

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  const id = ID++;

  const { code } = transformFromAstSync(ast, null, {
    presets: ["@babel/preset-env"],
  });

  return {
    id,
    filename,
    dependencies,
    code,
  };
}
// 根据依赖图打包所有文件, 传入的一个依赖的数组
function bundle(graph) {
  let modules = "";

  // mod.mapping 代表是相对路径对应的id
  graph.forEach((mod) => {
    modules += `${mod.id}: [
      function (require, module, exports) { ${mod.code} },
      ${JSON.stringify(mod.mapping)},
    ],`;
  });

  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];

        function localRequire(name) {
          return require(mapping[name]);
        }

        const module = { exports : {} };

        fn(localRequire, module, module.exports);

        return module.exports;
      }

      require(0);
    })({${modules}})
  `;

  return result;
}
