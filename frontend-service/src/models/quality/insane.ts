import * as THREE from 'three'

const envMapArray = ['512','1k','2k']
const texturesSizeArray = ['256','512','1K','2K','3K','4K']

export const quality = {
    id: 'insane',
    pixel_ratio:2,
    antialias: true,
    smaa:false,
    fxaa:false,
    ambientLight: true,
    keylight: true,
    textures:{
        environment:{
            hdr: false,
            size: envMapArray[2],
            extension: 'jpg'
        },
        diffuse:{
            allow: true,
            size: texturesSizeArray[4],
            extension: 'jpg'
        },
        ao:{
            allow: true,
            size: texturesSizeArray[5],
            extension: 'jpg'
            
        },
        normal:{
            allow: true,
            size: texturesSizeArray[4],
            extension: 'jpg'
            
        },
        gloss:{
            allow: true,
            size: texturesSizeArray[4],
            extension: 'jpg'
            
        },
        disp:{
            allow: true,
            size: texturesSizeArray[3],
            extension: 'jpg'
            
        },
        lightsMap:{
            allow: true,
            size: texturesSizeArray[3],
            extension: 'jpg'
            
        }
    },
    shadows: {
        enable: true,
        mapSize: 4096,
        type: THREE.PCFShadowMap
    }
}