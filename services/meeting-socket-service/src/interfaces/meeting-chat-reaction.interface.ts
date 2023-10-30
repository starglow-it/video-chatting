import { MeetingReactionKind } from 'shared-types';
import { IMeetingChat } from './meeting-chat.interface';
import { ISenderDto } from './sender.interface';

export interface IMeetingChatReaction {
  id: string;
  meetingChat: IMeetingChat;
  user: ISenderDto;
  kind: MeetingReactionKind;
}
