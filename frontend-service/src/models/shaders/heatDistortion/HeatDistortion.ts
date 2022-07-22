import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { config } from '../../config'
import { shadersGui } from '../../gui'


export const HeatDistortionShader = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms:{
        tDiffuse: {value: null},
        uObjectPosition:{value: new THREE.Vector2()},
        uResolution:{value: new THREE.Vector2()},
        uTime:{value: null},
        uSpeed:{value: 1.0},
        uScale:{value: 20.09},
        uMult:{value: 0.002},

        uPosX:{value: 0.19},
        uPosY:{value: 0.45},
        uScaleX:{value: 0.15},
        uScaleY:{value: 1.0},
        uSmooth:{value: -0.32},
        uIntensity1:{value: 3.7},
        uIntensity2:{value: 1.13}


    }
})

export const resizeHeatDistord = (elem, renderer) => {
    elem.uniforms.uResolution.value.x = renderer.domElement.width
    elem.uniforms.uResolution.value.y = renderer.domElement.height
}
