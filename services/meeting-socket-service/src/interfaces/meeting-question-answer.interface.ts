import { MeetingReactionKind } from 'shared-types';
import { ICommonMeetingDTO } from './common-meeting.interface';
import { ISenderDto } from './sender.interface';

export interface IMeetingQuestionAnswer {
  id: string;
  sender: ISenderDto;
  body: string;
  meeting: ICommonMeetingDTO;
  reactions: { [K in MeetingReactionKind]: string[] };
  createdAt: Date;
}
