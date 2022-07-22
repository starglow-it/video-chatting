import * as THREE from 'three'
import { scene } from './scene'
import { debugObject } from './gui'
import { general_quality } from './quality'
import { load_image } from './textures'
import { uTimeArrays } from './draw'
import { mobileAndTabletCheck } from './detect_mobile'
import { camera, fitCameraToObject } from './camera'
import { orbitControls } from './controls'
import { effectComposer } from './postProcess'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { renderer } from './renderer'


export const candleList = [];

/**Mount Materials */
export const mountMaterials = () => {
    scene.traverse((child)=>{
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
         {
            shaderMount(child);
         }
     })
}

const createVideoTexture = (path, fileName, fileExt, material, speed) =>{
    import('./htmlComponents').then(({createHtmlVideo})=>{
                const video = createHtmlVideo(path, fileName, fileExt, speed)
                const texture = new THREE.VideoTexture( video )
                material.map = texture
                material.flatShading = true
                material.transparent = true
                material.blending = THREE.AdditiveBlending
                material.emissiveMap = texture
    })
}

/**Shader mount */
const shaderMount = (child) => {

    if(child.userData.camera){
        fitCameraToObject(camera, child, 0.3, orbitControls)
    }

    if(child.material.userData.shader){
        const data = child.material.userData.shader

        if(data === 'background'){
            import('./shaders/background/Background').then(({backgroundShader})=>{
            const mat = backgroundShader
            child.material = mat
            load_image('/templates/models/models/static/textures/back512.jpg')
                .then(response =>{
                    response.flipY = false
                    child.material.uniforms.uBackgroundDiffuse.value = response
                    })
            load_image('/templates/models/models/static/textures/background_layers_png.png')
                .then(response =>{
                    response.flipY = false
                    child.material.uniforms.uBackgroundLayers.value = response
                    })
            load_image('/templates/models/models/static/textures/fnoise.png')
                .then(response => {
                    response.wrapS = THREE.RepeatWrapping
                    response.wrapT = THREE.RepeatWrapping
                    child.material.uniforms.uFnoise.value = response 
                    })
            load_image('/templates/models/models/static/textures/cellnoise.png')
                .then(response => {
                    response.wrapS = THREE.RepeatWrapping
                    response.wrapT = THREE.RepeatWrapping
                    child.material.uniforms.uCnoise.value = response 
                })
                uTimeArrays.push(child.material)
            })

        }
        if(data === 'candle'){
            if(!mobileAndTabletCheck()){
                child.visible = false
            } else{
                import('./shaders/candle/CandleShader').then(({candleShader})=>{
                    const mat = candleShader.clone()
                mat.uniforms.uOffset.value = Math.random() * 10
                child.material = mat
                candleList.push(child.material)
                uTimeArrays.push(child.material)
                })
            }
        }

        if(data === 'candle_pc'){
            
            if(!mobileAndTabletCheck()){
                import('./shaders/candle_pc/Candle_pc').then(({candleShader_pc})=>{
                    const mat = candleShader_pc.clone()
                    mat.uniforms.uOffset.value = Math.random() * 10
                    child.material = mat
                    candleList.push(child.material)
                    uTimeArrays.push(child.material)
                })
            }else{
                child.visible = false
            }
        }
        
        if(data === 'fire'){
            if(!mobileAndTabletCheck()){
                import('./shaders/Fire/Fire').then(({FireShader})=>{
                    const mat = FireShader.clone()
                    child.material = mat
                    child.material.index0AttributeName = "position"
                    child.material.uniforms.uDetail.value = child.userData.fireDetail
                    child.material.uniforms.uAmplitude.value = child.userData.fireAmplitude
                    child.position.y += 0.1
                    uTimeArrays.push(child.material)
                })       
            }else{
                //create video html and then catch it
                createVideoTexture("/templates/models/videoTextures/",'fire', 'ogg', child.material, 1)
                }
            }
        if(data === 'main'){
            import('./shaders/main/Main').then(({mainShader})=>{
            const mat = mainShader
            load_image('/templates/models/models/static/textures/texture.png')
            .then(response =>{
                response.flipY = false
                mat.uniforms.uLight.value = response
            })
            load_image('/templates/models/models/static/textures/shadow.jpg')
            .then(response =>{
                response.flipY = false
                mat.uniforms.uDark.value = response
            })
            load_image('/templates/models/models/static/textures/shadow_mask.jpg')
            .then(response =>{
                response.flipY = false
                mat.uniforms.uMask.value = response
            })
            load_image('/templates/models/models/static/textures/passes/uv.jpg')
            .then(response =>{
                response.flipY = false
                mat.uniforms.uNormal.value = response
            })
            load_image('/templates/models/models/static/textures/passes/z_denoise.jpg')
            .then(response =>{
                response.flipY = false
                mat.uniforms.uParallax.value = response
            })

            child.material = mat;

            uTimeArrays.push(child.material)
        })
        }

        if(data === 'smoke'){
            if(!mobileAndTabletCheck()){
                import('./shaders/smoke/Smoke').then(({SmokeShader})=>{
                    const mat = SmokeShader.clone()
                    child.material = mat
                    child.material.index0AttributeName = "position"
                    if(child.userData.smokeIntensity) child.material.uniforms.uIntensity.value = child.userData.smokeIntensity
                    if (child.userData.smokeX) child.material.uniforms.uX.value = child.userData.smokeX
                    if (child.userData.smokeY) child.material.uniforms.uY.value = child.userData.smokeY
                    if (child.userData.offset) child.material.uniforms.uOffset.value = child.userData.offset
                    uTimeArrays.push(child.material)
                })
            }else{
                //create video html and then catch it
                const filename = child.userData.videoSmokeName
                createVideoTexture("/templates/models/videoTextures/",filename, 'ogg', child.material, 0.5)
                child.rotation.z = Math.PI/2
                child.material.map.flipY = false
                if(child.userData.mobilePosX)child.position.x += child.userData.mobilePosX
                if(child.userData.mobilePosY)child.position.y += child.userData.mobilePosY
                
                }
            }

        if(data === 'heatDistortion'){
            import('./shaders/heatDistortion/HeatDistortion').then(({HeatDistortionShader})=>{
                const heatPass = new ShaderPass(HeatDistortionShader)
                heatPass.uniforms.uResolution.value.x = renderer.domElement.width
                heatPass.uniforms.uResolution.value.y = renderer.domElement.height

                effectComposer.addPass(heatPass)
            })
        }
    }
}

/**
 * Update all materials
 */
 export const updateAllMaterials = (lightMapIntensity = 10, aoMapIntensity = 1, emissionMapIntensity = 0.2) =>
 {
     scene.traverse((child)=>
     {
         
         if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
         {
                update_mat(child, lightMapIntensity, aoMapIntensity, emissionMapIntensity)
         }
     })
 }

 const update_mat = (child, lightmapIntensity = 10, aoMapIntensity = 1, emissionMapIntensity = 0.2) => {
    child.material.envMapIntensity = debugObject.envMapIntensity
    child.material.lightMapIntensity = lightmapIntensity
    child.material.aoMapIntensity = aoMapIntensity
    child.material.emissiveIntensity = emissionMapIntensity

    if(child.material.userData.transparent){
        child.material.transparent = true
        child.material.opacity = 0.2
    }
    if (child.material.userData.thickness){
        child.material.thickness = child.material.userData.thickness
    }
    
    child.material.needsUpdate = true;

    child.castShadow = general_quality.shadows.enable;

    child.receiveShadow = general_quality.shadows.enable;

    child.userData.materialSide === 'double'
        ?child.material.side = THREE.DoubleSide
        : child.material.side = THREE.FrontSide;

    child.material.needsUpdate = true;
 }
