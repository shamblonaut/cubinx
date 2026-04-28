import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";

class Cube extends Mesh {
  constructor() {
    const geometry = new BoxGeometry(1, 1, 1);
    const materials = [
      new MeshBasicMaterial({ color: "blue" }),
      new MeshBasicMaterial({ color: "green" }),
      new MeshBasicMaterial({ color: "white" }),
      new MeshBasicMaterial({ color: "yellow" }),
      new MeshBasicMaterial({ color: "red" }),
      new MeshBasicMaterial({ color: "orange" }),
    ];
    super(geometry, materials);
  }
}

export default Cube;
