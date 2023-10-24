import { meetingDomain } from 'src/store/domains';
import { MeetingYoutubeStore } from './type';

export const $meetingYoutubeStore =
    meetingDomain.createStore<MeetingYoutubeStore>({
        volume: 0,
        url: '',
        muted: false,
    });

export const updateVolumeYoutubeEvent = meetingDomain.createEvent<number>(
    'updateVolumeYoutubeEvent',
);

export const updateUrlYoutubeEvent = meetingDomain.createEvent<string>(
    'updateUrlYoutubeEvent',
);

export const toggleMuteYoutubeEvent = meetingDomain.createEvent<void>(
    'toggleMuteYoutubeEvent',
);
