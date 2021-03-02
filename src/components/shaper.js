import * as THREE from 'three';

export const createShaper = (sizes, texture, heightTexture) => {

  const geom = new THREE.PlaneGeometry(20, 20, 64, 64);
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    displacementMap: heightTexture
  });
  mat.displacementScale = 1;
  const mesh = new THREE.Mesh(geom, mat);

  mesh.position.z = -10;

  return mesh;
}
