import { Expose, Transform, Type } from 'class-transformer';
import { ICommonMeetingUserDTO } from '../../interfaces/common-user.interface';
import { CommonUserDTO } from './common-user.dto';
import { serializeInstance } from '../serialization';
import { IMeetingChat } from 'src/interfaces/meeting-chat.interface';
import { MeetingChatDocument } from 'src/schemas/meeting-chat.schema';
import { ICommonMeetingDTO } from 'src/interfaces/common-meeting.interface';
import { CommonMeetingDTO } from './common-meeting.dto';
import { ISenderDto } from 'src/interfaces/sender.interface';
import { SenderDto } from './sender.dto';

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
  reactionsCount: IMeetingChat['reactionsCount'];

  @Expose()
  createdAt: Date;
}

export const meetingChatSerialization = <
  D extends MeetingChatDocument | MeetingChatDocument[],
>(
  meetingChat: D,
) => serializeInstance(meetingChat, MeetingChatDto);
