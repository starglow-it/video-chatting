import { otherStoresDomain } from '../domain';

export const $backgroundAudioVolume = otherStoresDomain.createStore<number>(50);
export const $isBackgroundAudioActive = otherStoresDomain.createStore<boolean>(false);

export const setBackgroundAudioVolume = otherStoresDomain.createEvent<number>(
    'setBackgroundAudioVolume',
);
export const setBackgroundAudioActive = otherStoresDomain.createEvent<boolean>(
    'setBackgroundAudioActive',
);
export const toggleBackgroundAudioActive = otherStoresDomain.createEvent<boolean>(
    'toggleBackgroundAudioActive',
);
