import { MeetingReactionKind } from 'shared-types';
import { ICommonMeetingDTO } from './common-meeting.interface';
import { ISenderDto } from './sender.interface';

export interface IMeetingReaction {
  id: string;
  user: ISenderDto;
  meeting: ICommonMeetingDTO;
//   reactions: { [K in MeetingReactionKind]: string[] };
  reactionName: string,
  createdAt: Date;
}
