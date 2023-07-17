import { uiDomain } from '../domain/model';

export const $isPortraitLayout = uiDomain.createStore<boolean>(false);

export const initLandscapeListener = uiDomain.createEvent(
    'initLandscapeListener',
);
export const removeLandscapeListener = uiDomain.createEvent(
    'removeLandscapeListener',
);

export const setIsPortraitLayoutEvent = uiDomain.createEvent<boolean>(
    'setIsPortraitLayoutEvent',
);
export const checkIsPortraitLayoutEvent = uiDomain.createEvent<void>(
    'checkIsPortraitLayoutEvent',
);
