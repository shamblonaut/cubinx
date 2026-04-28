import "./style.css";

import setupWorld from "./setup";

setupWorld((cube) => {
  cube.rotation.x += 0.05;
  cube.rotation.y += 0.02;
});
