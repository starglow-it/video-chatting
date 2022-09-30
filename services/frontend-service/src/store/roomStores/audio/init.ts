import { sample } from 'effector-next';
import {
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    toggleBackgroundAudioActive,
} from './model';
import { resetRoomStores } from '../../root';

$backgroundAudioVolume.on(setBackgroundAudioVolume, (state, data) => data).reset(resetRoomStores);

$isBackgroundAudioActive
    .on(toggleBackgroundAudioActive, state => !state)
    .on(setBackgroundAudioActive, (state, data) => data)
    .reset(resetRoomStores);

sample({
    clock: toggleBackgroundAudioActive,
    source: $isBackgroundAudioActive,
    fn: isBackgroundAudioActive => (isBackgroundAudioActive ? 50 : 0),
    target: setBackgroundAudioVolume,
});
