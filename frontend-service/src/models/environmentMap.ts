import { debugObject } from './gui'
import { config } from './config'

debugObject.envMapIntensity = config.lights.environmentLight.intensity
debugObject.background = true
debugObject.environment = true