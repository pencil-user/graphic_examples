import {
  BoxBufferGeometry,
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  SphereGeometry,
  Scene,
  WebGLRenderer,
  Clock,
  PointLight,
  AmbientLight,
  Texture,
  TextureLoader,
  Group,
  Vector3
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { tabs } from './tabs';
//import rock_color from './assets/rock035/Rock035_1K_Color.jpg'
//src/assets/rock035/Rock035_1K_Color.jpg
//import RoundedBoxGeometry from 'three-rounded-box'
import { ExtrudeGeometry } from 'three';
// bricks

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();

function init(gltf: GLTF) {
  tabs('indexThree3');

  // Get a reference to the container element that will hold our scene
  const container = document.querySelector('#scene-container');

  if (!container) return;
  console.log("WE HAVE CONTAINER")
  // create a Scene
  const scene = new Scene();


  // Set the background color
  scene.background = new Color('skyblue');

  // Create a camera
  const fov = 35; // AKA Field of View
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1; // the near clipping plane
  const far = 100; // the far clipping plane

  const camera = new PerspectiveCamera(fov, aspect, near, far);

  const pointLight = new PointLight(0xffffff, 1, 100);

  const light = new AmbientLight(0x303030);

  const model = gltf.scene

  scene.add(light);

  scene.add(model);

  scene.add(pointLight)

  // create the renderer
  const renderer = new WebGLRenderer();

  // next, set the renderer to the same size as our container element
  renderer.setSize(container.clientWidth, container.clientHeight);

  // finally, set the pixel ratio so that our scene will look good on HiDPI displays
  renderer.setPixelRatio(window.devicePixelRatio);

  // add the automatically created <canvas> element to the page
  container.append(renderer.domElement);

  // render, or 'create a still image', of the scene
  renderer.render(scene, camera);

  //controls.update() must be called after any manual changes to the camera's transform
  camera.position.set(0, 1, 30);
  pointLight.position.x = -6
  pointLight.position.y = 3
  const clock = new Clock()

  function animate() {
    const delta = clock.getDelta();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  (document.querySelector('#reset') as any).onclick = () => {
    model.rotation.x = 0;
    model.rotation.y = 0;
    model.rotation.z = 0;

    model.position.x = 0;
    model.position.y = 0;
    model.position.z = 0;

    model.scale.x = 1;
    model.scale.y = 1;
    model.scale.z = 1;
  };

  (document.querySelector('#rotateX') as any).onclick = () => {
    //model.rotation.x += 0.3 
    model.rotateOnAxis(new Vector3(1, 0, 0), 0.1 * Math.PI)
  };
  (document.querySelector('#rotateXminus') as any).onclick = () => {
    model.rotateOnAxis(new Vector3(1, 0, 0), - 0.1 * Math.PI)
  };
  (document.querySelector('#rotateY') as any).onclick = () => {
    model.rotateOnAxis(new Vector3(0, 1, 0), 0.1 * Math.PI)
  };
  (document.querySelector('#rotateYminus') as any).onclick = () => {
    model.rotateOnAxis(new Vector3(0, 1, 0), - 0.1 * Math.PI)

  };
  (document.querySelector('#rotateZ') as any).onclick = () => {
    model.rotateOnAxis(new Vector3(0, 0, 1), 0.1 * Math.PI)
  };
  (document.querySelector('#rotateZminus') as any).onclick = () => {
    model.rotateOnAxis(new Vector3(0, 0, 1), - 0.1 * Math.PI)
  };


}

loader.load('./public/airplane2/F-16D.gltf',
  init
)

//init()