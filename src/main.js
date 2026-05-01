import "./style.css";

import setupWorld from "./setup";

let timer = 0;
setupWorld(({ cube }, time) => {
  if (time - timer > 2000) {
    // cube.turnFace("right");

    timer = time;
  }
});
