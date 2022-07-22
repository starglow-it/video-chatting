import { canvas, renderer, resizeRenderer } from './renderer'
import { cameraTilt, cameraUpdate, cameraZero } from './camera'
import { passes } from './postProcess';
import { config } from './config';
import { mobileAndTabletCheck, orientationProcess } from './detect_mobile';
import { HeatDistortionShader, resizeHeatDistord } from './shaders/heatDistortion/HeatDistortion';

export const events = () => {

	/**MouseTilt */
	if(!mobileAndTabletCheck()){
		/**Computer */
		canvas.addEventListener('mousemove', (e) =>{
			e.stopPropagation()
			
				cameraTilt(e,canvas)
		})
		canvas.addEventListener('mouseout', (e) =>{
			//camera to zero pos
			cameraZero()
		})
	}else{
		/**Mobile device */
		window.DeviceOrientationEvent?window.addEventListener("deviceorientation", orientationProcess, true):''
        
	}

	
}

/**RESIZE EVENT */
window.addEventListener('resize', () => {
	cameraUpdate()
	resizeRenderer(renderer)
	passes.forEach((child)=> resizeRenderer(child) )
	resizeHeatDistord(HeatDistortionShader, renderer)
})
