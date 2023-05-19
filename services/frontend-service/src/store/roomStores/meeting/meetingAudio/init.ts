import { resetRoomStores } from 'src/store/root';
import { handleGetMeetingAudio } from './handler/handleGetMeetingAudio';
import {
    $isToggleMeetingAudioStore,
    $meetingAudioStore,
    getMeetingAudioFx,
    toggleMeetingAudioEvent,
} from './model';

getMeetingAudioFx.use(handleGetMeetingAudio);

$meetingAudioStore
    .on(getMeetingAudioFx.doneData, (state, data) => ({
        ...state,
        audioList: data.list,
        count: data.count,
    }))
    .reset(resetRoomStores);

$isToggleMeetingAudioStore
    .on(toggleMeetingAudioEvent, toggle => !toggle)
    .reset(resetRoomStores);
