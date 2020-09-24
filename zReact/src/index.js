function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => (typeof child === "object" ? child : createTextElement(child))),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
function render(params, container) {
  const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type);
  params.props.children.map((item) => {
    return render(item, dom);
  });
  container.appendChild(dom);
}
const zreact = {
  createElement,
};
const zreactDom = {
  render,
};

const element = zreact.createElement(
  "div",
  { id: "foo" },
  zreact.createElement("a", null, "bar"),
  zreact.createElement("b")
);
const container = document.getElementById("root");
zreactDom.render(element, container);
