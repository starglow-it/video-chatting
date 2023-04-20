import { handleGetMeetingAudio } from './handler/handleGetMeetingAudio';
import {
    $isToggleMeetingAudioStore,
    $meetingAudioStore,
    getMeetingAudioFx,
    toggleMeetingAudioEvent,
} from './model';

getMeetingAudioFx.use(handleGetMeetingAudio);

$meetingAudioStore.on(getMeetingAudioFx.doneData, (state, data) => ({
    ...state,
    audioList: data.list,
    count: data.count,
}));

$isToggleMeetingAudioStore.on(toggleMeetingAudioEvent, toggle => !toggle);
