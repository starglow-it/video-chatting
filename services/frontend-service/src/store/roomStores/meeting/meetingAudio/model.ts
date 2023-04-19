import { meetingDomain } from 'src/store/domains';

export const $audioMeetingStore = meetingDomain.createStore<{
    audioList: any[];
}>({
    audioList: [],
});
