import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { camera } from './camera';
import { config } from './config';
import { canvas } from './renderer';

// OrbitControls
export const orbitControls = new OrbitControls(camera, canvas);

const cCam = config.camera;
orbitControls.enableDamping = cCam.enableDamping;
orbitControls.enablePan = cCam.enablePan;
orbitControls.enableZoom = cCam.enableZoom;
orbitControls.enableRotate = cCam.enableRotate;

orbitControls.target = new THREE.Vector3(cCam.lookAt.x, cCam.lookAt.y, cCam.lookAt.z);

/**Constraints */
if (config.camera.constraint.horizontal) {
    orbitControls.maxAzimuthAngle = -Math.PI / 2 + config.camera.constraint.horizontalMin;
    orbitControls.minAzimuthAngle = Math.PI / 2 - config.camera.constraint.horizontalMax;
}
if (config.camera.constraint.vertical) {
    orbitControls.minPolarAngle = Math.PI / 2 - config.camera.constraint.verticalMax;
    orbitControls.maxPolarAngle = Math.PI / 2 + config.camera.constraint.verticalMin;
}
