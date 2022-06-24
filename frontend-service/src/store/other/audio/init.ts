import {
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
    $isSettingsBackgroundAudioActive,
    $settingsBackgroundAudioVolume,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    setSettingsBackgroundAudioVolume,
    toggleBackgroundAudioActive,
    toggleSettingsBackgroundAudioEvent,
} from './model';
import {sample} from "effector-next";

$backgroundAudioVolume.on(setBackgroundAudioVolume, (state, data) => data);
$settingsBackgroundAudioVolume.on(setSettingsBackgroundAudioVolume, (state, data) => data);

sample({
    clock: toggleBackgroundAudioActive,
    source: $isBackgroundAudioActive,
    fn: (isBackgroundAudioActive) => isBackgroundAudioActive ? 50 : 0,
    target: setBackgroundAudioVolume,
});

$isBackgroundAudioActive
    .on(toggleBackgroundAudioActive, (state) => !state)
    .on(setBackgroundAudioActive, (state, data) => data);

$isSettingsBackgroundAudioActive
    .on(toggleSettingsBackgroundAudioEvent, state => !state)
