import { otherStoresDomain } from '../../domains';

const defaultAudioVolumeState = 50;

export const $backgroundAudioVolume = otherStoresDomain.createStore<number>(
    defaultAudioVolumeState,
);
export const $isBackgroundAudioActive =
    otherStoresDomain.createStore<boolean>(true);
export const setBackgroundAudioVolume = otherStoresDomain.createEvent<number>(
    'setBackgroundAudioVolume',
);
export const setBackgroundAudioActive = otherStoresDomain.createEvent<boolean>(
    'setBackgroundAudioActive',
);
export const toggleBackgroundAudioActive = otherStoresDomain.createEvent(
    'toggleBackgroundAudioActive',
);
