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
  InterpolateSmooth
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { tabs } from './tabs';

import { ExtrudeGeometry } from 'three';




function init() {
  tabs('ThreeSimple');

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

  // every object is initially created at ( 0, 0, 0 )
  // move the camera back so we can view the scene
  //camera.position.set(0, 0, 10);

  // create a geometry
  //const geometry = new BoxGeometry(2, 2, 2,)// 200, 200, 200);

  const geometry = new SphereGeometry(2, 20, 20)
  const material = new MeshStandardMaterial({
    flatShading: false,
  });

  // create a Mesh containing the geometry and material
  const cube = new Mesh(geometry, material);

  const cube2 = new Mesh(geometry, material);
  const pointLight = new PointLight(0xffffff, 1, 100);

  const light = new AmbientLight(0x303030);
  scene.add(light);

  // add the mesh to the scene
  scene.add(cube);

  //scene.add(cube2);

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
  camera.position.set(0, 1, 20);
  pointLight.position.x = -6
  pointLight.position.y = 3

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

  }

  animate()

}

init()