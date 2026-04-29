import "./style.css";

import setupWorld from "./setup";

let turned = false;
setupWorld(({ cube }, time) => {
  if (!turned && time > 5000) {
    cube.turnFace("right");
    turned = true;
  }
});
