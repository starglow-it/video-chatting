import { meetingDomain } from 'src/store/domains';
import { MeetingChatStore } from './type';

export const $meetingChat = meetingDomain.createStore<MeetingChatStore>({
    list: [],
    skip: 0,
    limit: 15,
});

export const $isThereNewMessage = meetingDomain.createStore<number>(0);

export const addMessageToChatEvent = meetingDomain.createEvent<any>(
    'addMessageToChatEvent',
);
