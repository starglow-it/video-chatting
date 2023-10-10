import { MeetingChat } from 'src/store/types';

export type ChatType = 'time' | 'text' | 'recently';

export type ChatItem = {
    type?: ChatType;
    isBreak?: boolean;
} & MeetingChat;
