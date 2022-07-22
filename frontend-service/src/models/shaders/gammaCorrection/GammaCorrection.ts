import gammaVertex from './vertex.glsl'
import gammaFragment from './fragment.glsl'

export const GammaCorrectionShader = {
    uniforms:{
        tDiffuse: { value: null},
        tHeatDistortion: {value: null}
    },
    vertexShader: gammaVertex,
    fragmentShader: gammaFragment
}

