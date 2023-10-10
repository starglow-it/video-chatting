import { ICommonMeetingDTO } from './common-meeting.interface';
import { ICommonMeetingUserDTO } from './common-user.interface';

export interface IMeetingChat {
  id: string;
  senderId: ICommonMeetingUserDTO['id'];
  body: string;
  meetingId: ICommonMeetingDTO['id'];
  createdAt: Date;
}
