import { meetingDomain } from 'src/store/domains';
import { MeetingChat } from 'src/store/types';
import { MeetingChatStore } from './type';

export const $meetingChat = meetingDomain.createStore<MeetingChatStore>({
    list: [],
    skip: 0,
    limit: 15,
});

export const $isThereNewMessage = meetingDomain.createStore<number>(0);

export const $isHaveNewMessage = meetingDomain.createStore<number>(0);

export const addMessageToChatEvent = meetingDomain.createEvent<any>(
    'addMessageToChatEvent',
);

export const reactionMessageEvent = meetingDomain.createEvent<{
    message: MeetingChat;
}>('reactionMessageEvent');

export const resetHaveNewMessageEvent = meetingDomain.createEvent(
    'resetHaveNewMessageEvent',
);

export const setCountNewMessageEvent = meetingDomain.createEvent<number>(
    'setCountNewMessageEvent',
);
