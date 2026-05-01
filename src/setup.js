import { Color, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls";

import Cube from "./cube";
import setupGestures from "./gestures";
import setupKeybinds from "./keybinds";

function setupWorld() {
  const scene = new Scene();
  scene.background = new Color(0x1a1a1a);

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(5, 5, 5);

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const { cube } = setupObjects(scene);
  const controls = setupTrackballControls(camera, renderer);

  const turnQueue = [];

  setupKeybinds(turnQueue);
  setupGestures(camera, cube, controls, turnQueue);
  setupUpdates(scene, camera, renderer, controls, cube, turnQueue);
}

function setupObjects(scene) {
  const cube = new Cube();
  scene.add(cube);
  return { cube };
}

function setupTrackballControls(camera, renderer) {
  const controls = new TrackballControls(camera, renderer.domElement);

  controls.target.set(0, 0, 0);
  controls.dynamicDampingFactor = 0.1;
  controls.rotateSpeed = 1.25;
  controls.noPan = true;
  controls.noZoom = true;

  return controls;
}

function setupUpdates(scene, camera, renderer, controls, cube, turnQueue) {
  renderer.setAnimationLoop(() => {
    if (turnQueue.length > 0 && !cube.isTurning) {
      const { layer, clockwise } = turnQueue.shift();
      cube.turn(layer, clockwise);
    }

    controls.update();
    renderer.render(scene, camera);
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
  });
}

export default setupWorld;

/* Debug Helpers */
// scene.add(
//   new Line(
//     new BufferGeometry().setFromPoints([raycaster.ray.origin, endPoint]),
//     new LineBasicMaterial({ color: 0xff0000 }),
//   ),
// );
// scene.add(new PlaneHelper(dragPlane, 32));
