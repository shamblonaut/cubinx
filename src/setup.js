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
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

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

  const controls = new TrackballControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.dynamicDampingFactor = 0.1;
  controls.rotateSpeed = 1.25;
  controls.noPan = true;
  controls.noZoom = true;

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

    controls.handleResize();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Setup gestures
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
      controls.noRotate = true;

      const hit = intersects[0];
      const faceNormal = hit.face.normal
        .clone()
        .transformDirection(hit.object.matrixWorld)
        .round();
      dragPlane.setFromNormalAndCoplanarPoint(faceNormal, hit.point);

      isDragging = true;
      dragInfo = {
        cubie: hit.object,
        normal: faceNormal,
      };
      startPoint.copy(hit.point);
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

    const face =
      rotationAxis === "x"
        ? layerPosition === 1
          ? "right"
          : layerPosition === -1
            ? "left"
            : null
        : rotationAxis === "y"
          ? layerPosition === 1
            ? "up"
            : layerPosition === -1
              ? "down"
              : null
          : rotationAxis === "z"
            ? layerPosition === 1
              ? "front"
              : layerPosition === -1
                ? "back"
                : null
            : null;
    const clockwise = rotationSign * layerPosition < 0;

    if (face) {
      cube.turnFace(face, clockwise);
    } else {
      console.warn("Turn not supported");
    }

    isDragging = false;
    dragInfo = null;

    controls.noRotate = false;
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
