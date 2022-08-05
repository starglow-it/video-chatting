import { uiDomain } from "../domain/model";

export const $windowSizeStore = uiDomain.createStore({
    width: 0,
    height: 0,
});

export const initWindowListeners = uiDomain.createEvent('initWindowListeners');
export const removeWindowListeners = uiDomain.createEvent('initWindowListeners');

export const setWindowSizeEvent = uiDomain.createEvent<{ width: number; height: number }>('setWindowSizeEvent');