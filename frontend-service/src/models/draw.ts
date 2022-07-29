import * as THREE from 'three';
import { effectComposer } from './postProcess';
import { renderer } from './renderer';
import { scene } from './scene';
import { camera } from './camera';
import { config } from './config';
// import { orbitControls } from './controls'
import { candleList } from './materials';
import { HeatDistortionShader } from './shaders/heatDistortion/HeatDistortion';

/**Array of uniforms to animate */
export const uTimeArrays = [];

let stats;

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;
let halfTime = false;
export const tick = () => {
    if (stats) stats.begin();
    halfTime = !halfTime;
    const elapsedTime = clock.getElapsedTime();
    //  const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime;

    uTimeArrays.forEach(mat => (mat.uniforms.uTime.value = elapsedTime));
    HeatDistortionShader.uniforms.uTime.value = elapsedTime;
    if (halfTime) {
        candleList.forEach(candle => {
            const number = Math.floor(Math.random() * 200);
            number === 5
                ? (candle.uniforms.uAlpha.value = 0)
                : (candle.uniforms.uAlpha.value = 0.9);
        });
    }

    // Update controls
    //  orbitControls.update()

    if (effectComposer.passes.length > 1) {
        renderer.setRenderTarget(null);
        effectComposer.render();
    } else {
        renderer.render(scene, camera);
    }

    // Call tick again on the next frame
    if (stats) stats.end();
    requestAnimationFrame(tick);
};
