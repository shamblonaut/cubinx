import { Plane, Raycaster, Vector2, Vector3 } from "three";

import { checkClockwise } from "./utils";

function setupGestures(camera, cube, controls, turnQueue) {
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
    if (!isDragging || cube.isTurning) {
      dragInfo = null;
      isDragging = false;
      controls.noRotate = false;
      return;
    }

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
    turnQueue.push({
      layer: layers[rotationAxis][layerPosition],
      clockwise: checkClockwise(layerPosition, rotationSign, rotationAxis),
    });

    dragInfo = null;
    isDragging = false;
    controls.noRotate = false;
  });
}

export default setupGestures;
