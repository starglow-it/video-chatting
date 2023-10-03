import { MeetingRole } from 'shared-types';
import { ICommonMeetingDTO } from './common-meeting.interface';

export interface ICommonMeetingUserDTO {
  id: string;
  profileId: string;
  socketId: string;
  username: string;
  joinedAt: number;
  accessStatus: string;
  cameraStatus: string;
  micStatus: string;
  isGenerated: boolean;
  isAuraActive: boolean;
  meeting: ICommonMeetingDTO['id'];
  profileAvatar: string;
  meetingAvatarId: string;
  meetingRole: MeetingRole;
  userPosition: { bottom: number; left: number };
  userSize: number;
}
