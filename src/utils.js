import { Quaternion } from "three";

export function getTurnQuaternions(axis) {
  const clockwiseQuaternion = new Quaternion();
  clockwiseQuaternion.setFromAxisAngle(axis, -Math.PI / 2);

  const anticlockwiseQuaternion = new Quaternion();
  anticlockwiseQuaternion.setFromAxisAngle(axis, Math.PI / 2);

  return { clockwiseQuaternion, anticlockwiseQuaternion };
}

export function checkClockwise(layerPosition, rotationSign, rotationAxis) {
  if (layerPosition !== 0) return layerPosition * rotationSign < 0;

  // S follows F, but M and E follow L and D respectively
  if (rotationAxis === "z") {
    return rotationSign < 0;
  } else {
    return -rotationSign < 0;
  }
}
