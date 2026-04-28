import {
  BoxGeometry,
  Color,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";

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
  camera.position.z = 4;

  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Objects
  const cube = new Mesh(new BoxGeometry(1, 1, 1), new MeshNormalMaterial());
  scene.add(cube);

  // Updates setup
  renderer.setAnimationLoop(() => {
    update(cube);

    controls.update();
    renderer.render(scene, camera);
  });
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

export default setupWorld;
