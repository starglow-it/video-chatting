import { sample } from 'effector';
import { handleGetBackgroundMeeting } from './handlers/handleGetBackground';
import {
    $backgroundMeetingStore,
    $isToggleChangeBackground,
    toggleChangeBackgroundEvent,
    setBackgroundEvent,
    setImagesEvent,
    getBackgroundMeetingFx,
} from './model';

getBackgroundMeetingFx.use(handleGetBackgroundMeeting);

$isToggleChangeBackground.on(toggleChangeBackgroundEvent, toggle => !toggle);

$backgroundMeetingStore.on(
    [setBackgroundEvent, setImagesEvent],
    (state, data) => ({
        ...state,
        ...data,
    }),
);

sample({
    clock: setBackgroundEvent,
    source: $backgroundMeetingStore,
    fn: ({ typeSelected }) => ({ typeSelected }),
    target: getBackgroundMeetingFx,
});
