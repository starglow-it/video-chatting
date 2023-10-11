import { Expose, Transform, Type } from 'class-transformer';
import { IMeetingChat } from '../../interfaces/meeting-chat.interface';
import { MeetingChatDocument } from '../../schemas/meeting-chat.schema';
import { ICommonMeetingDTO } from '../../interfaces/common-meeting.interface';
import { CommonMeetingDTO } from './common-meeting.dto';
import { ISenderDto } from '../../interfaces/sender.interface';
import { SenderDto } from './sender.dto';
import { mapToArray } from '../../utils/mapToArray';
import { serializeInstance } from '../serialization';

export class MeetingChatDto implements IMeetingChat {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  body: string;

  @Expose()
  @Type(() => SenderDto)
  sender: ISenderDto;

  @Expose()
  @Type(() => CommonMeetingDTO)
  meeting: ICommonMeetingDTO;

  @Expose()
  @Transform(({ obj }) => mapToArray(obj['reactionsCount']))
  reactionsCount: IMeetingChat['reactionsCount'];

  @Expose()
  createdAt: Date;
}

export const meetingChatSerialization = <
  D extends MeetingChatDocument | MeetingChatDocument[],
>(
  meetingChat: D,
) => serializeInstance(meetingChat, MeetingChatDto);
