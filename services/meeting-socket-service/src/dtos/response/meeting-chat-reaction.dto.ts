import { Expose, Transform, Type } from 'class-transformer';
import { serializeInstance } from '../serialization';
import { IMeetingChat } from '../../interfaces/meeting-chat.interface';
import { ISenderDto } from '../../interfaces/sender.interface';
import { IMeetingChatReaction } from '../../interfaces/meeting-chat-reaction.interface';
import { MeetingReactionKind } from 'shared-types';
import { MeetingChatDto } from './meeting-chat.dto';
import { MeetingChatReactionDocument } from '../../schemas/meeting-chat-reaction.schema';
import { SenderDto } from './sender.dto';

export class MeetingChatReactionDto implements IMeetingChatReaction {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  @Type(() => MeetingChatDto)
  meetingChat: IMeetingChat;

  @Expose()
  @Type(() => SenderDto)
  user: ISenderDto;

  @Expose()
  kind: MeetingReactionKind;
}

export const meetingChatReactionSerialization = <
  D extends MeetingChatReactionDocument | MeetingChatReactionDocument[],
>(
  meetingChatReaction: D,
) => serializeInstance(meetingChatReaction, MeetingChatReactionDto);
