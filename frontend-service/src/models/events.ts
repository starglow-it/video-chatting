import { renderer, resizeRenderer } from './renderer';
import { cameraUpdate } from './camera';
import { passes } from './postProcess';
import { mobileAndTabletCheck, orientationProcess } from './detect_mobile';
import { HeatDistortionShader, resizeHeatDistord } from './shaders/heatDistortion/HeatDistortion';

export const events = () => {
    /**MouseTilt */
    if (!mobileAndTabletCheck()) {
        window.addEventListener('resize', () => {
            cameraUpdate();
            resizeRenderer(renderer);
            passes.forEach(child => resizeRenderer(child));
            resizeHeatDistord(HeatDistortionShader, renderer);
        });
    } else {
        /**Mobile device */
        window.DeviceOrientationEvent
            ? window.addEventListener('deviceorientation', orientationProcess, true)
            : '';
    }
};

