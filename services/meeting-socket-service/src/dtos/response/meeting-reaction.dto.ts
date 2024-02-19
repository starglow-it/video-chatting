import { Expose, Transform, Type } from 'class-transformer';
import { CommonUserDTO } from './common-user.dto';
import { ICommonUser } from 'shared-types';
import { IMeetingReaction } from '../../interfaces/meeting-reaction.interface';
import { MeetingReactionDocument } from '../../schemas/meeting-reaction.schema';
import { serializeInstance } from '../serialization';

export class MeetingReactionDTO implements IMeetingReaction {
  @Expose()
  @Transform((data) => data.obj['_id']?.toString())
  id: string;

  @Expose()
  emojiName: string;

  @Expose()
  @Type(() => CommonUserDTO)
  @Transform((data) => data.obj.user?.['_id']?.toString())
  user: ICommonUser['id'];

  @Expose()
  createdAt: string;
}

export const meetingReactionSerialization = (meetingReaction: MeetingReactionDocument) =>
  serializeInstance(meetingReaction, MeetingReactionDTO);
