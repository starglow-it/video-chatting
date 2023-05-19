import { meetingDomain } from 'src/store/domains';
import { IAudioCategory } from './types';
import { EntityList } from 'shared-types';

export const $meetingAudioStore = meetingDomain.createStore<{
    audioList: IAudioCategory[];
    count: number;
}>({
    audioList: [],
    count: 0,
});

export const $isToggleMeetingAudioStore =
    meetingDomain.createStore<boolean>(true);

export const getMeetingAudioFx = meetingDomain.createEffect<
    { userTemplateId: string },
    EntityList<IAudioCategory>
>('getAudioMeetingFx');

export const toggleMeetingAudioEvent =
    meetingDomain.createEvent('toggleMettingAudio');
