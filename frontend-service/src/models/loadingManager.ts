import * as THREE from 'three'
import { updateAllMaterials } from './materials';

import {events} from "./events";

const end_load = () => {
    setTimeout(()=>{
        const animation = require('./draw');
        animation.tick()
        events()
    },100)
}

export const textureLoadingManager = new THREE.LoadingManager(
    ()=>{
        updateAllMaterials();
        end_load()
    }
)

