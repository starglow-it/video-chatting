import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'


export const mainShader = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    // wireframe:true,
    depthTest: true,
    depthWrite: true,
    transparent:true,
    // blending: THREE.AdditiveBlending,
    // opacity:1,
    uniforms:{
        // uVideo:{value: null},
        uTime: {value: null},
        uLight: { value: null },
        uDark: { value: null },
        uMask: { value: null},
        uNormal: {value: null},
        uParallax: {value: null}

    }
})