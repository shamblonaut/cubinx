import { Color, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";

import Cube from "./cube";

function setupWorld(update) {
  // World setup
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );

  scene.background = new Color(0x1a1a1a);
  camera.position.set(5, 5, 5);

  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Objects
  const cube = new Cube();
  scene.add(cube);

  // Updates setup
  renderer.setAnimationLoop((time) => {
    update({ cube }, time);

    controls.update();
    renderer.render(scene, camera);
  });
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

export default setupWorld;
