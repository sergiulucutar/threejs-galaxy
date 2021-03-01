import './style.css'
import * as THREE from 'three';
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { interestPointTypeSelector } from './interactions';
import { gameState } from './game';

const canvas = document.querySelector('main canvas');
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const datGUI = new dat.GUI({
  closed: true
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000);
camera.position.set(3, 20, 25);
scene.add(camera);

const cameraControls = new OrbitControls(camera, canvas);
cameraControls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: 1
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Generate skyBox
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
  '/stars_bg.jpg',
  '/stars_bg.jpg',
  '/stars_bg.jpg',
  '/stars_bg.jpg',
  '/stars_bg.jpg',
  '/stars_bg.jpg'
]);
scene.background = envMap;


/* Implementation */
const parameters = {};
parameters.count = 50000;
parameters.size = 0.02;
parameters.radius = 10;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.insideColor = '#ff6030';
parameters.outsideColor = '#1b3984';

let geometry;
let material;
let points;

const generateGlaxy = () => {

  if (geometry && material && points) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;

    const branchCount = Math.PI * 2 * ((i % parameters.branches) / parameters.branches);
    const spinAngle = radius * parameters.spin;

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

    positions[i3] = Math.cos(branchCount + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchCount + spinAngle) * radius + randomZ;

    // Color
    const mixedColor = colorInside.clone().lerp(colorOutside, radius / parameters.radius);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  points = new THREE.Points(geometry, material);
  scene.add(points);

}

const interestPoints = [];
const generatePointsOfInterest = () => {
  for (let i = 1; i < 7; i++) {
    const radius = Math.random() * parameters.radius;
    const point = {
      position: new THREE.Vector3(
        Math.cos(2 * Math.PI * Math.random()) * radius,
        Math.round(Math.random() * 2 - 1),
        Math.sin(2 * Math.PI * Math.random()) * radius
      ),
      element: document.querySelector(`.point[data-id="${i}"]`)
    };
    point.element.addEventListener('click', () => interestPointTypeSelector.open(point.element));

    interestPoints.push(point);
  }
}


generateGlaxy();
generatePointsOfInterest();


datGUI.add(parameters, 'count').min(1000).max(1000000).step(100).onFinishChange(generateGlaxy);
datGUI.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGlaxy);
datGUI.add(parameters, 'radius').min(1).max(20).step(1).onFinishChange(generateGlaxy);
datGUI.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGlaxy);
datGUI.add(parameters, 'spin').min(-5).max(5).step(0.1).onFinishChange(generateGlaxy);
datGUI.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGlaxy);
datGUI.add(parameters, 'randomnessPower').min(1).max(10).step(0.1).onFinishChange(generateGlaxy);
datGUI.addColor(parameters, 'insideColor').onFinishChange(generateGlaxy);
datGUI.addColor(parameters, 'outsideColor').onFinishChange(generateGlaxy);


// const clock = new THREE.Clock();
const loop = () => {
  //   const enableTime = clock.getElapsedTime();

  cameraControls.update();

  for (const point of interestPoints) {
    const screenPosition = point.position.clone();
    screenPosition.project(camera);

    point.element.style.transform = `translate(${screenPosition.x * sizes.width * 0.5}px, ${-screenPosition.y * sizes.height * 0.5}px)`
  }


  renderer.render(scene, camera);

  requestAnimationFrame(loop);
}

const pointsDOM = [...document.querySelectorAll('.point')];
const getRoundValues = () => {
  const values = [];
  for(let point of pointsDOM) {
    values.push(point.dataset.type);
    point.classList.add('point-hidden');
  }
  return values;
}

const nextRound = () => {
  interestPointTypeSelector.close();
  const roundValues = getRoundValues();
  gameState.update(roundValues);
}

document.querySelector('.game_controls button').addEventListener('click', nextRound);
gameState.updateUI();

loop();