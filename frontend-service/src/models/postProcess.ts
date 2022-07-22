
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'

// import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { camera } from './camera'

import { renderer } from './renderer'
import { scene } from './scene'
// import { GammaCorrectionShader } from './shaders/gammaCorrection/GammaCorrection'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

import { general_quality } from './quality'
import { config } from './config'

export const passes = []


export const effectComposer = new EffectComposer(renderer)
passes.push(effectComposer)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

// const bloom = new UnrealBloomPass()
// bloom.threshold = 0.9
// bloom.radius = 0.3
// bloom.strength = 0.5
// effectComposer.addPass(bloom)

// export const gammaCorrection = new ShaderPass( GammaCorrectionShader );
// effectComposer.addPass(gammaCorrection)

if(general_quality.fxaa){
    import('three/examples/jsm/shaders/FXAAShader.js').then(({FXAAShader})=>{
        const fxaaPass = new ShaderPass( FXAAShader );
        effectComposer.addPass(fxaaPass)
    })
}

if(general_quality.smaa){
    import('three/examples/jsm/postprocessing/SMAAPass.js').then(({SMAAPass})=>{
        const smaaPass = new SMAAPass( window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio() );
        effectComposer.addPass(smaaPass)
    })
}
