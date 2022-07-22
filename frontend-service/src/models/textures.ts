import * as THREE from "three";
import { textureLoadingManager } from "./loadingManager";

const textureLoader = new THREE.TextureLoader(textureLoadingManager)

export const load_image = (path,sourceToCopy) => {
    // console.log("load" + path)
    return new Promise((resolve, reject) => {
        textureLoader.load(path,
            (txt) => {
                if(txt.image !== null){
                    if(sourceToCopy){
                        const m = sourceToCopy
                        txt.offset = m.offset.clone()
                        txt.repeat = m.repeat.clone()
                        txt.rotation = m.rotation
                        txt.wrapS = m.wrapS
                        txt.wrapT = m.wrapT
                        txt.flipY = false
                    }

                    resolve(txt)
                }
            },
          () => {},
          () => {
              reject("can't load texture !")
          });
    })
    
}