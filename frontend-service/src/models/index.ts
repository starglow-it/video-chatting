import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { scene } from './scene';
import { config } from './config';
import { mountMaterials } from './materials';
import { general_quality } from './quality';
import {events} from "./events";
import {canvas} from "./renderer";

const end_load = () => {
    setTimeout(() => {
        const animation = require('./draw');
        animation.tick()
        events()
    },100)
}

export const startModel = (draco, model) => {
    if(config.lights.ambientLight.enable && general_quality.ambientLight) {
        const ambientLight = new THREE.AmbientLight(0xffffff, config.lights.ambientLight.intensity);

        scene.add(ambientLight);
    }

    const objectLoadingManager = new THREE.LoadingManager(
        () => {
            mountMaterials();
            end_load();
        },
    )
    /**
     * LOADERS
     */
    const dracoLoader = new DRACOLoader(objectLoadingManager);
    const gltfLoader = new GLTFLoader(objectLoadingManager);

    dracoLoader.setDecoderPath(draco);
    gltfLoader.setDRACOLoader(dracoLoader);
    /**
     * Models
     */
    gltfLoader.load(
        model,
        (gltf)=> {
            scene.add(gltf.scene);
        }
    )

    return canvas;
}