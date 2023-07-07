import {
    $isPortraitLayout,
    checkIsPortraitLayoutEvent,
    initLandscapeListener,
    removeLandscapeListener,
    setIsPortraitLayoutEvent,
} from './model';

const handleChangeLayout = () => {
    const absoluteOrientation =
        window.orientation ?? window?.screen?.orientation?.angle;

    setIsPortraitLayoutEvent(absoluteOrientation === 0);
};

$isPortraitLayout
    .on(initLandscapeListener, state => {
        window.addEventListener('orientationchange', handleChangeLayout);
        return state;
    })
    .on(
        checkIsPortraitLayoutEvent,
        () => (window.orientation ?? window?.screen?.orientation?.angle) === 0,
    )
    .on(removeLandscapeListener, state => {
        window.removeEventListener('orientationchange', handleChangeLayout);
        return state;
    })
    .on(setIsPortraitLayoutEvent, (state, data) => data);
