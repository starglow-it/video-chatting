import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'


export const FireShader = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    // wireframe:true,
    depthTest: true,
    depthWrite: true,
    transparent:true,
    blending: THREE.AdditiveBlending,
    // opacity:1,
    uniforms:{
        uTime: {value: null},
        uResolution: {value: new THREE.Vector2(1.5,1.5)},
        uDetail: {value: 1.7},
        uAmplitude: {value: 0.47}

    }
})