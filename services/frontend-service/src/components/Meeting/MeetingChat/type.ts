import { MeetingReactionKind } from 'shared-types';
import { MeetingChat } from 'src/store/types';

export type ChatType = 'time' | 'text' | 'recently';

export type ChatItem = {
    type?: ChatType;
    isBreak?: boolean;
    onReaction?: (chatId: string, kind: MeetingReactionKind) => void;
} & MeetingChat;
