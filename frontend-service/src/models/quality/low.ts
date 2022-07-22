import * as THREE from 'three'

const envMapArray = ['512','1k','2k']
const texturesSizeArray = ['256','512','1K','2K','3K','4K']

export const quality = {
    id: 'low',
    pixel_ratio:1,
    antialias: false,
    smaa:false,
    fxaa:true,
    ambientLight: true,
    keylight: true,
    textures:{
        environment:{
            hdr: false,
            size: envMapArray[1],
            extension: 'jpg'
        },
        diffuse:{
            allow: true,
            size: texturesSizeArray[1],
            extension: 'jpg'
        },
        ao:{
            allow: true,
            size: texturesSizeArray[2],
            extension: 'jpg'
        },
        normal:{
            allow: true,
            size: texturesSizeArray[1],
            extension: 'jpg'
        },
        gloss:{
            allow: true,
            size: texturesSizeArray[1],
            extension: 'jpg'
            
        },
        disp:{
            allow: true,
            size: texturesSizeArray[1],
            extension: 'jpg'
            
        },
        lightsMap:{
            allow: true,
            size: texturesSizeArray[1],
            extension: 'jpg'
            
        }
    },
    shadows: {
        enable: true,
        mapSize: 512,
        type: THREE.PCFSoftShadowMap
    }
}