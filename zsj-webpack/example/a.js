import { get } from "loadsh";
export default () => {
  const obj = { sdsds: 111 };
  console.log(get(obj, "sdsds"));
};
