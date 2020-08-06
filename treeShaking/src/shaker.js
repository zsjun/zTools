const acorn = require("acorn");
const l = console.log;
const JSEmitter = require("./jsemitter");
const fs = require("fs"); // pull in the cmd line args
const args = process.argv[2];

// 获取文件的内容
const buffer = fs.readFileSync(args).toString();
// 转成ast
const body = acorn.parse(buffer).body;
const jsEmitter = new JSEmitter();

// 记录声明的变量和函数
let decls = new Map();
// 记录被调用的变量和函数
let calledDecls = [];

// 其他没有被用过的
let code = [];

body.forEach(function (node) {
  if (node.type == "FunctionDeclaration") {
    const codeFunc = jsEmitter.run([node]);
    // 记录声明的函数
    decls.set(jsEmitter.visitNode(node.id), codeFunc);
    return;
  }

  if (node.type == "VariableDeclaration") {
    const kind = node.kind;
    // 记录变量
    for (const decl of node.declarations) {
      decls.set(jsEmitter.visitNode(decl.id), jsEmitter.visitVariableDeclarator(decl, kind));
    }
    return;
  }

  if (node.type == "ExpressionStatement") {
    if (node.expression.type == "CallExpression") {
      const callNode = node.expression;
      // 记录被调用的函数和变量
      calledDecls.push(jsEmitter.visitIdentifier(callNode.callee));
      const args = callNode.arguments;
      for (const arg of args) {
        if (arg.type == "Identifier") {
          calledDecls.push(jsEmitter.visitNode(arg));
        }
      }
    }
  }

  if (node.type == "Identifier") {
    calledDecls.push(node.name);
  }
  // 如果是执行表达式，执行获取代码
  code.push(jsEmitter.run([node]));
});
code = calledDecls
  .map((c) => {
    return decls.get(c);
  })
  .concat([code])
  .join("");

fs.writeFileSync("example/test.shaked.js", code);
