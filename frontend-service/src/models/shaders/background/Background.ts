import * as THREE from 'three';
import vertex from './vertex.glsl';
import fragment from './fragment.glsl';
import { shadersGui } from '../../gui';
import { config } from '../../config';

export const backgroundShader = new THREE.RawShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    // transparent:true,
    uniforms: {
        uTime: { value: null },
        uWaterSpeed: { value: 2 },
        u_resolution: { value: new THREE.Vector2(1, 1) },
        uBackgroundDiffuse: { value: null },
        uBackgroundLayers: { value: null },
        uFnoise: { value: null },
        uCnoise: { value: null },
        // uTreeStrength: {value: 0.05},
        uTreeStrength: { value: 0.012 },
        uWaterStrength: { value: 0 },
    },
});
