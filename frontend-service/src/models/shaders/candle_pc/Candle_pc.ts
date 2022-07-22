import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'


export const candleShader_pc = new THREE.RawShaderMaterial({
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
        uSpeed : {value: 10},
        uOffset : {value: 0},
        uAlpha : {value: 1.0},
        uResolution : {value: new THREE.Vector2(1,1)}
    }
})
