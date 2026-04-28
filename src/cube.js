import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from "three";

class Cube extends Group {
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
  }
}

export default Cube;
