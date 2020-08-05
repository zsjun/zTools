import React from "react";
import ReactDOM from "react-dom";
import { Button } from "antd";
import "./styles.css";

function useState(initialValue) {
  let state = initialValue;
  function setState(newState) {
    state = newState;
    render(); // 模拟 reRender，这一行不需要关心
  }
  return [state, setState];
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>{count}</div>
      <Button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        点击
      </Button>
    </div>
  );
}

const rootElement = document.getElementById("root");

function render() {
  ReactDOM.render(<App />, rootElement);
}
render();
