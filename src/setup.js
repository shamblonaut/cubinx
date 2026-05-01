import {
  Color,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls";

import Cube from "./cube";
import { checkClockwise } from "./utils";

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

  setupGestures(camera, cube, controls);
  setupUpdates(scene, camera, renderer, controls);
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

function setupGestures(camera, cube, controls) {
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const dragPlane = new Plane();
  const startPoint = new Vector3();
  const endPoint = new Vector3();

  let dragInfo = null;
  let isDragging = false;

  window.addEventListener("pointerdown", (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObject(cube, true);
    if (intersects.length > 0) {
      const hit = intersects[0];
      const faceNormal = hit.face.normal
        .clone()
        .transformDirection(hit.object.matrixWorld)
        .round();
      dragPlane.setFromNormalAndCoplanarPoint(faceNormal, hit.point);
      startPoint.copy(hit.point);

      dragInfo = { cubie: hit.object, normal: faceNormal };
      isDragging = true;
      controls.noRotate = true;
    }
  });

  window.addEventListener("pointerup", (event) => {
    if (!isDragging) return;

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(dragPlane, endPoint);

    const dragVector = endPoint.clone().sub(startPoint);
    if (dragVector.length() < 0.1) {
      isDragging = false;
      controls.noRotate = false;
      return;
    }

    const cross = new Vector3().crossVectors(dragInfo.normal, dragVector);
    const rotationAxis = Object.keys(cross).reduce((a, b) =>
      Math.abs(cross[a]) > Math.abs(cross[b]) ? a : b,
    );

    const rotationSign = Math.sign(cross[rotationAxis]); // -1 or +1
    const layerPosition = Math.round(dragInfo.cubie.position[rotationAxis]); // -1, 0, 1

    const layers = {
      x: { 1: "R", 0: "M", "-1": "L" },
      y: { 1: "U", 0: "E", "-1": "D" },
      z: { 1: "F", 0: "S", "-1": "B" },
    };
    cube.turn(
      layers[rotationAxis][layerPosition],
      checkClockwise(layerPosition, rotationSign, rotationAxis),
    );

    dragInfo = null;
    isDragging = false;
    controls.noRotate = false;
  });
}

function setupUpdates(scene, camera, renderer, controls) {
  renderer.setAnimationLoop(() => {
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
