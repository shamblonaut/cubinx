import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";

import { getTurnQuaternions } from "./utils";

class Cube extends Group {
  static moves = Object.freeze({
    R: { axis: "x", layer: 1, ...getTurnQuaternions(new Vector3(1, 0, 0)) },
    M: { axis: "x", layer: 0, ...getTurnQuaternions(new Vector3(-1, 0, 0)) },
    L: { axis: "x", layer: -1, ...getTurnQuaternions(new Vector3(-1, 0, 0)) },

    U: { axis: "y", layer: 1, ...getTurnQuaternions(new Vector3(0, 1, 0)) },
    E: { axis: "y", layer: 0, ...getTurnQuaternions(new Vector3(0, -1, 0)) },
    D: { axis: "y", layer: -1, ...getTurnQuaternions(new Vector3(0, -1, 0)) },

    F: { axis: "z", layer: 1, ...getTurnQuaternions(new Vector3(0, 0, 1)) },
    S: { axis: "z", layer: 0, ...getTurnQuaternions(new Vector3(0, 0, -1)) },
    B: { axis: "z", layer: -1, ...getTurnQuaternions(new Vector3(0, 0, -1)) },
  });

  constructor() {
    super();

    const geometry = new BoxGeometry(1, 1, 1);
    const materials = {
      right: new MeshBasicMaterial({ color: "red" }),
      left: new MeshBasicMaterial({ color: "orange" }),
      top: new MeshBasicMaterial({ color: "white" }),
      bottom: new MeshBasicMaterial({ color: "yellow" }),
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
            y === 1 ? materials.top : materials.inside,
            y === -1 ? materials.bottom : materials.inside,
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

  turn(layer, clockwise = true) {
    const move = Cube.moves[layer];
    if (!move) throw new Error("Invalid move");

    const turningCubies = this.children.filter(
      (child) =>
        child instanceof Mesh &&
        Math.round(child.position[move.axis]) === move.layer,
    );

    // Reset pivot
    this.turningPivot.rotation.set(0, 0, 0);
    this.turningPivot.updateMatrixWorld();

    // Attach cubies to pivot
    turningCubies.forEach((cubie) => this.turningPivot.attach(cubie));

    // Rotate the pivot
    this.turningPivot.quaternion.multiply(
      clockwise ? move.clockwiseQuaternion : move.anticlockwiseQuaternion,
    );
    this.turningPivot.updateMatrixWorld();

    // Attach cubies back to cube
    turningCubies.forEach((cubie) => this.attach(cubie));
  }
}

export default Cube;
