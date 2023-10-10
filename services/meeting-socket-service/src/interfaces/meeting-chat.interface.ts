import { ICommonMeetingDTO } from './common-meeting.interface';
import { ICommonMeetingUserDTO } from './common-user.interface';

export interface IMeetingChat {
  id: string;
  sender: ICommonMeetingUserDTO;
  body: string;
  meeting: ICommonMeetingDTO;
  createdAt: Date;
}
