import {
    $isPortraitLayout,
    checkIsPortraitLayoutEvent,
    initLandscapeListener,
    removeLandscapeListener,
    setIsPortraitLayoutEvent,
} from './model';
import { isSafari } from '../../../utils/browser/detectBrowser';

const handleChangeLayout = (event: Event) => {
    const typedTarget = event?.target as Window;

    if (isSafari()) {
        setIsPortraitLayoutEvent(typedTarget.orientation === 0);
    } else {
        setIsPortraitLayoutEvent(typedTarget?.screen?.orientation.angle === 0);
    }
};

$isPortraitLayout
    .on(initLandscapeListener, state => {
        window.addEventListener('orientationchange', handleChangeLayout);
        return state;
    })
    .on(
        checkIsPortraitLayoutEvent,
        () => (isSafari() ? window.orientation : window?.screen?.orientation.angle) === 0,
    )
    .on(removeLandscapeListener, state => {
        window.removeEventListener('orientationchange', handleChangeLayout);
        return state;
    })
    .on(setIsPortraitLayoutEvent, (state, data) => data);
