import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";

import { getTurnQuaternions } from "./utils";

class Cube extends Group {
  static faces = Object.freeze({
    right: {
      condition: (position) => Math.round(position.x) === 1,
      ...getTurnQuaternions(new Vector3(1, 0, 0)),
    },
    left: {
      condition: (position) => Math.round(position.x) === -1,
      ...getTurnQuaternions(new Vector3(-1, 0, 0)),
    },
    up: {
      condition: (position) => Math.round(position.y) === 1,
      ...getTurnQuaternions(new Vector3(0, 1, 0)),
    },
    down: {
      condition: (position) => Math.round(position.y) === -1,
      ...getTurnQuaternions(new Vector3(0, -1, 0)),
    },
    front: {
      condition: (position) => Math.round(position.z) === 1,
      ...getTurnQuaternions(new Vector3(0, 0, 1)),
    },
    back: {
      condition: (position) => Math.round(position.z) === -1,
      ...getTurnQuaternions(new Vector3(0, 0, -1)),
    },
  });

  constructor() {
    super();

    const geometry = new BoxGeometry(1, 1, 1);
    const materials = {
      right: new MeshBasicMaterial({ color: "red" }),
      left: new MeshBasicMaterial({ color: "orange" }),
      up: new MeshBasicMaterial({ color: "white" }),
      down: new MeshBasicMaterial({ color: "yellow" }),
      front: new MeshBasicMaterial({ color: "green" }),
      back: new MeshBasicMaterial({ color: "blue" }),
      inside: new MeshBasicMaterial({ color: "black" }),
    };

    // DEBUG
    // for (const material in materials) {
    //   if (material === "inside") {
    //     materials[material].colorWrite = false;
    //   } else {
    //     materials[material].wireframe = true;
    //   }
    // }

    // Cubies
    const SPACING = 1.05;
    for (let z = -1; z <= 1; z++) {
      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          const cubie = new Mesh(geometry, [
            x === 1 ? materials.right : materials.inside,
            x === -1 ? materials.left : materials.inside,
            y === 1 ? materials.up : materials.inside,
            y === -1 ? materials.down : materials.inside,
            z === 1 ? materials.front : materials.inside,
            z === -1 ? materials.back : materials.inside,
          ]);
          cubie.position.set(x * SPACING, y * SPACING, z * SPACING);
          this.add(cubie);
        }
      }
    }

    // Turning Pivot
    this.turningPivot = new Group();
    this.add(this.turningPivot);
  }

  turnFace(face, clockwise = true) {
    if (!(face in Cube.faces)) throw new Error("Invalid face");

    const turningCubies = this.children.filter(
      (child) =>
        child instanceof Mesh && Cube.faces[face].condition(child.position),
    );

    // Reset pivot
    this.turningPivot.rotation.set(0, 0, 0);
    this.turningPivot.updateMatrixWorld();

    // Attach cubies to pivot
    turningCubies.forEach((cubie) => this.turningPivot.attach(cubie));

    // Rotate the pivot
    this.turningPivot.quaternion.multiply(
      clockwise
        ? Cube.faces[face].clockwiseQuaternion
        : Cube.faces[face].anticlockwiseQuaternion,
    );
    this.turningPivot.updateMatrixWorld();

    // Attach cubies back to cube
    turningCubies.forEach((cubie) => this.attach(cubie));
  }
}

export default Cube;
