import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { renderer } from './renderer';
import { debugObject } from './gui';
import { updateAllMaterials } from './materials';
import { config } from './config';
import { general_quality } from './quality';

debugObject.envMapIntensity = config.lights.environmentLight.intensity;
debugObject.background = true;
debugObject.environment = true;

const cubeTextureLoader = new THREE.CubeTextureLoader(); //realism
const rgbeLoader = new RGBELoader().setDataType(THREE.UnsignedByteType);
const pmremGenerator = new THREE.PMREMGenerator(renderer);
/**
 * ENVIRONNEMENT MAP //realism
 */
export const environment_object = {
    hdrOrnot: general_quality.textures.environment.hdr,
    envMap: null,
    path: {
        env_hdr: `./textures/hdr/${general_quality.textures.environment.size}.hdr`,
        env_front: `./textures/environmentMaps/${general_quality.textures.environment.extension}/${general_quality.textures.environment.size}/cube_tile_0001.${general_quality.textures.environment.extension}`,
        env_left: `./textures/environmentMaps/${general_quality.textures.environment.extension}/${general_quality.textures.environment.size}/cube_tile_0002.${general_quality.textures.environment.extension}`,
        env_back: `./textures/environmentMaps/${general_quality.textures.environment.extension}/${general_quality.textures.environment.size}/cube_tile_0003.${general_quality.textures.environment.extension}`,
        env_down: `./textures/environmentMaps/${general_quality.textures.environment.extension}/${general_quality.textures.environment.size}/cube_tile_0004.${general_quality.textures.environment.extension}`,
        env_up: `./textures/environmentMaps/${general_quality.textures.environment.extension}/${general_quality.textures.environment.size}/cube_tile_0005.${general_quality.textures.environment.extension}`,
        env_right: `./textures/environmentMaps/${general_quality.textures.environment.extension}/${general_quality.textures.environment.size}/cube_tile_0006.${general_quality.textures.environment.extension}`,
    },
};
const clean_obj = () => {
    environment_object.path.env_hdr = '';
    environment_object.path.env_front = '';
    environment_object.path.env_back = '';
    environment_object.path.env_up = '';
    environment_object.path.env_down = '';
    environment_object.path.env_left = '';
    environment_object.path.env_right = '';
};

const refresh_env_scs = val => {
    environment_object.envMap = val;
    clean_obj();
};

export const update_environment = () => {
    let environmentMap;

    if (environment_object.hdrOrnot) {
        rgbeLoader.load(environment_object.path.env_hdr, (hdrEquiRect, textureData) => {
            environmentMap = pmremGenerator.fromEquirectangular(hdrEquiRect);
            pmremGenerator.compileCubemapShader();

            refresh_env_scs(environmentMap.texture);
            renderer.toneMappingExposure = 1;
        });
    } else {
        environmentMap = cubeTextureLoader.load(
            [
                environment_object.path.env_front,
                environment_object.path.env_back,
                environment_object.path.env_up,
                environment_object.path.env_down,
                environment_object.path.env_left,
                environment_object.path.env_right,
            ],
            texture => {
                texture.encoding = THREE.sRGBEncoding;
                // texture.intensity = 1.5
                refresh_env_scs(texture);
            },
        );
    }
};
update_environment();

if (window.location.href.includes(config.debug.commandLine)) {
    import('./gui').then(({ gui }) => {
        // const gui = require('./gui')
        /**
         * gui.gui
         */

        const envgui = gui.addFolder('EnvironmentLight');
        envgui
            .add(debugObject, 'envMapIntensity')
            .min(0)
            .max(10)
            .step(0.001)
            .onChange(updateAllMaterials);

        envgui
            .add(debugObject, 'background')
            .name('env_visibility')
            .onChange(value =>
                value
                    ? update_sceneBackground(environment_object.envMap)
                    : update_sceneBackground(config.scene.background),
            );
        envgui
            .add(debugObject, 'environment')
            .name('env_effect')
            .onChange(value =>
                value
                    ? update_environmentBackground(environment_object.envMap)
                    : update_environmentBackground(null),
            );
    });
}
