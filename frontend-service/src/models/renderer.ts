import * as THREE from 'three';
import { config } from './config';
import { general_quality } from './quality';
import { sizes } from './scene';

export const canvas = document.createElement('canvas');

/**
 * Renderer
 */
export const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: 'high-performance',
    antialias: general_quality.antialias,
});

export const resizeRenderer = (passe, pr = true) => {
    passe.setSize(sizes.width, sizes.height);
    if (pr) passe.setPixelRatio(general_quality.pixel_ratio);
};

resizeRenderer(renderer);

renderer.physicallyCorrectLights = config.scene.physicallyCorrectLight; //realism
renderer.outputEncoding = THREE.sRGBEncoding; //realism
