import { ICommonMeetingDTO } from './common-meeting.interface';

export interface ICommonMeetingUserDTO {
  id: string;
  profileId: string;
  socketId: string;
  username: string;
  accessStatus: string;
  cameraStatus: string;
  micStatus: string;
  isGenerated: boolean;
  isAuraActive: boolean;
  meeting: ICommonMeetingDTO['id'];
  profileAvatar: string;
  userPosition: { bottom: number; left: number };
}
