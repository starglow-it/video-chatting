import { MeetingAvatarRole, MeetingRole } from 'shared-types';

export interface IJoinMeeting {
  profileId?: string;
  meetingRole: MeetingRole;
  avatarRole: MeetingAvatarRole;
}
