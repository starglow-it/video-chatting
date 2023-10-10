import { ICommonMeetingDTO } from './common-meeting.interface';
import { ISenderDto } from './sender.interface';

export interface IMeetingChat {
  id: string;
  sender: ISenderDto;
  body: string;
  meeting: ICommonMeetingDTO;
  createdAt: Date;
}
