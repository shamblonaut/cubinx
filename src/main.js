import "./style.css";

import setupWorld from "./setup";

setupWorld(({ cube }, time) => {
  cube.rotation.x += 0.05;
  cube.rotation.y -= 0.02;
  cube.rotation.z += 0.03;

  cube.position.x = Math.cos(time / 200);
  cube.position.y = Math.sin(time / 500);
  cube.position.z = Math.cos(time / 300);
});
