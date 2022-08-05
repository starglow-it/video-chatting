import {$windowSizeStore, initWindowListeners, removeWindowListeners, setWindowSizeEvent } from "./model";

const handleResize = () => {
    setWindowSizeEvent({
        width: window.innerWidth,
        height: window.innerHeight
    });
}

$windowSizeStore
    .on(initWindowListeners, (state) => {
        window.addEventListener('resize', handleResize);
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    })
    .on(removeWindowListeners, (state) => {
        window.removeEventListener('resize', handleResize);
        return state;
    })
    .on(setWindowSizeEvent, (state, data) => {
        return data;
    })