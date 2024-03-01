import { MeetingAvatarRole, MeetingRole } from 'shared-types';

export interface IJoinMeeting {
  userData: {
    profileId?: string;
    meetingRole: MeetingRole;
    avatarRole: MeetingAvatarRole;
  },
  previousMeetingUserId: string
}
