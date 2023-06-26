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
  tabs('ThreeMaterial');

  // Get a reference to the container element that will hold our scene
  const container = document.querySelector('#scene-container');

  if (!container) return;
  console.log("WE HAVE CONTAINER")
  // create a Scene
  const scene = new Scene();

  const bricks_color_texture = new TextureLoader().load('./public/stoneWall/StoneBricksBeige015_COL_2K.jpg')
  const bricks_normal_texture = new TextureLoader().load('./public/stoneWall/StoneBricksBeige015_NRM_2K.jpg')
  const bricks_roughness_texture = new TextureLoader().load('./public/stoneWall/StoneBricksBeige015_Roughness_2K.jpg')
  const bricks_displacement_texture = new TextureLoader().load('./public/stoneWall/StoneBricksBeige015_DISP_2K.jpg')

  // Set the background color
  scene.background = new Color('skyblue');

  // Create a camera
  const fov = 35; // AKA Field of View
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1; // the near clipping plane
  const far = 100; // the far clipping plane

  const camera = new PerspectiveCamera(fov, aspect, near, far);

  // create a geometry
  const geometry = new BoxGeometry(2, 2, 2, 200, 200, 200);

  //const geometry = new SphereGeometry(2,200,200)
  const material = new MeshStandardMaterial({
    map: bricks_color_texture,
    //normalMap: bricks_normal_texture,

    //roughnessMap: bricks_roughness_texture,
    //roughness: 0.6,

    //displacementMap: bricks_displacement_texture,
    //displacementBias: -0.18,
    //displacementScale: 0.6,
    //wireframe: true
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
  const controls = new OrbitControls(camera, renderer.domElement);

  //controls.update() must be called after any manual changes to the camera's transform
  camera.position.set(0, 1, 20);
  controls.update();
  pointLight.position.x = 6
  pointLight.position.y = 3
  const clock = new Clock()

  function animate() {

    const delta = clock.getDelta();
    requestAnimationFrame(animate);

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render(scene, camera);

    //var rotatedX = Math.cos(angle) * (point.x - center.x) - Math.sin(angle) * (point.y-center.y) + center.x;
    //var rotatedY = Math.sin(angle) * (point.x - center.x) + Math.cos(angle) * (point.y - center.y) + center.y;  }
    const translationAngle = 0.4
    const newX = Math.cos(translationAngle * delta) * (pointLight.position.x) - Math.sin(translationAngle * delta) * (pointLight.position.z)
    const newZ = Math.sin(translationAngle * delta) * (pointLight.position.x) + Math.cos(translationAngle * delta) * (pointLight.position.z)

    pointLight.position.x = newX
    pointLight.position.z = newZ
    pointLight.updateMatrix();
    pointLight.updateMatrixWorld();
  }

  animate()

}

init()