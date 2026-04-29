import { Quaternion } from "three";

export function getTurnQuaternions(axis) {
  const clockwiseQuaternion = new Quaternion();
  clockwiseQuaternion.setFromAxisAngle(axis, -Math.PI / 2);

  const anticlockwiseQuaternion = new Quaternion();
  anticlockwiseQuaternion.setFromAxisAngle(axis, Math.PI / 2);

  return { clockwiseQuaternion, anticlockwiseQuaternion };
}
