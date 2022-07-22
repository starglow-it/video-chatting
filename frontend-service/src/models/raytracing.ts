import { renderer } from "./renderer";


export const touchConvert = (touch,window) => {
    const rect = renderer.domElement.getBoundingClientRect();
 return {
    x: ((touch.clientX - rect.left) / rect.width) * 2 - 1, 
    y: -((touch.clientY - rect.top)/ (rect.bottom - rect.top)) * 2 + 1
       }
 }

 export const pointerConvert = (pointer,window) => {
    const rect = renderer.domElement.getBoundingClientRect();
 return {
    x: ((pointer.x - rect.left) / rect.width) * 2 - 1, 
    y: -((pointer.y - rect.top)/ (rect.bottom - rect.top)) * 2 + 1
       }
 }

