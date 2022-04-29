import {
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    toggleBackgroundAudioActive,
} from './model';

$backgroundAudioVolume.on(setBackgroundAudioVolume, (state, data) => data);

$isBackgroundAudioActive
    .on(toggleBackgroundAudioActive, state => !state)
    .on(setBackgroundAudioActive, (state, data) => data);
