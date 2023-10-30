import { ICommonMeetingUserDTO } from './common-user.interface';

export interface ISenderDto
  extends Pick<
    ICommonMeetingUserDTO,
    'id' | 'meetingAvatarId' | 'username' | 'profileAvatar'
  > {}
