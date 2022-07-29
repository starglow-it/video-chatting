import * as THREE from 'three';

const envMapArray = ['256', '512', '1k', '2k'];
const texturesSizeArray = ['256', '512', '1K', '2K', '3K', '4K'];

export let general_quality = {
    id: 'custom',
    pixel_ratio: Math.min(window.devicePixelRatio, 2),
    antialias: false,
    smaa: false,
    fxaa: false,
    ambientLight: true,
    keylight: false,
    textures: {
        environment: {
            hdr: false,
            size: envMapArray[0],
            extension: 'jpg',
        },
        diffuse: {
            allow: true,
            size: texturesSizeArray[2],
            extension: 'jpg',
        },
        ao: {
            allow: true,
            size: texturesSizeArray[2],
            extension: 'jpg',
        },
        normal: {
            allow: true,
            size: texturesSizeArray[0],
            extension: 'jpg',
        },
        gloss: {
            allow: true,
            size: texturesSizeArray[0],
            extension: 'jpg',
        },
        disp: {
            allow: true,
            size: texturesSizeArray[0],
            extension: 'jpg',
        },
        lightsMap: {
            allow: true,
            size: texturesSizeArray[0],
            extension: 'jpg',
        },
    },
    shadows: {
        enable: false,
        mapSize: 2048,
        type: THREE.PCFShadowMap,
    },
};
