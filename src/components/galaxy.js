import * as THREE from 'three';
import galaxyVertexShader from '../shaders/galaxy/vertex.glsl';
import galaxyFragmentShader from '../shaders/galaxy/fragment.glsl';
import gsap, { Power2 } from 'gsap';

let geometry;
let material;
let points;

const galaxyState = {
  transitionTime: 0,
  isSphereShape: false
};

export const generateGlaxy = parameters => {

  if (geometry && material && points) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();
  // material = new THREE.PointsMaterial({
  //   size: parameters.size,
  //   sizeAttenuation: true,
  //   depthWrite: false,
  //   blending: THREE.AdditiveBlending,
  //   vertexColors: true
  // });

  material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: galaxyVertexShader,
    fragmentShader: galaxyFragmentShader,
    uniforms: {
      uTransitionTime: { value: galaxyState.transitionTime }
    }
  });

  const positions = new Float32Array(parameters.count * 3);
  const positionsOnShpere = new Float32Array(parameters.count * 3);
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

    // Sphere position
    const angle1 = Math.random() * 2 * Math.PI;
    const angle2 = Math.random() * 2 * Math.PI;
    positionsOnShpere[i3] = Math.cos(angle1) * Math.sin(angle2) * radius;
    positionsOnShpere[i3 + 1] = radius * Math.sin(angle1) * Math.sin(angle2);
    positionsOnShpere[i3 + 2] = Math.cos(angle2) * radius;


    // Color
    const mixedColor = colorInside.clone().lerp(colorOutside, radius / parameters.radius);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aPositionSphere', new THREE.BufferAttribute(positionsOnShpere, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  points = new THREE.Points(geometry, material);
  return points;
};

export const reshapeGalaxy = () => {
  galaxyState.isSphereShape = !galaxyState.isSphereShape;

  const transitionTime = galaxyState.isSphereShape ? 1 : 0;
  gsap
    .to(material.uniforms.uTransitionTime, {
      value: transitionTime,
      duration: 1.2,
      ease: Power2.easeInOut
    });
}