import {sample} from "effector-next";
import {
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    toggleBackgroundAudioActive,
} from './model';

$backgroundAudioVolume.on(setBackgroundAudioVolume, (state, data) => data);

$isBackgroundAudioActive
    .on(toggleBackgroundAudioActive, (state) => !state)
    .on(setBackgroundAudioActive, (state, data) => data);

sample({
    clock: toggleBackgroundAudioActive,
    source: $isBackgroundAudioActive,
    fn: (isBackgroundAudioActive) => isBackgroundAudioActive ? 50 : 0,
    target: setBackgroundAudioVolume,
});

