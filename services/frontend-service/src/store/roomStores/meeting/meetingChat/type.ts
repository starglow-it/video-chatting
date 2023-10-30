import { ChatItem } from '@components/Meeting/MeetingChat/type';

export type MeetingChatStore = {
    list: ChatItem[];
    skip: number;
    limit: number;
};
