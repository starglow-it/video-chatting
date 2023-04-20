import { handleGetMeetingAudio } from './handler/handleGetMeetingAudio';
import { $meetingAudioStore, getMeetingAudioFx } from './model';

getMeetingAudioFx.use(handleGetMeetingAudio);

$meetingAudioStore.on(getMeetingAudioFx.doneData, (state, data) => ({
    ...state,
    audioList: data.list,
    count: data.count,
}));
