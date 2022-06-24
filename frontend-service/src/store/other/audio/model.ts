import { otherStoresDomain } from '../domain/model';

const defaultAudioVolumeState = 50;

export const $backgroundAudioVolume = otherStoresDomain.createStore<number>(defaultAudioVolumeState);
export const $settingsBackgroundAudioVolume = otherStoresDomain.createStore<number>(defaultAudioVolumeState);

export const $isSettingsBackgroundAudioActive = otherStoresDomain.createStore<boolean>(false);
export const $isBackgroundAudioActive = otherStoresDomain.createStore<boolean>(false);

export const setBackgroundAudioVolume = otherStoresDomain.createEvent<number>(
    'setBackgroundAudioVolume',
);

export const setSettingsBackgroundAudioVolume = otherStoresDomain.createEvent<number>(
    'setSettingsBackgroundAudioVolume',
);

export const setBackgroundAudioActive = otherStoresDomain.createEvent<boolean>(
    'setBackgroundAudioActive',
);

export const toggleSettingsBackgroundAudioEvent = otherStoresDomain.createEvent<boolean>(
    'toggleSettingsBackgroundAudioEvent',
);

export const toggleBackgroundAudioActive = otherStoresDomain.createEvent(
    'toggleBackgroundAudioActive',
);