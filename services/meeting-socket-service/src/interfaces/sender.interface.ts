import { ICommonMeetingUserDTO } from './common-user.interface';

export type ISenderDto = Pick<
  ICommonMeetingUserDTO,
  'id' | 'meetingAvatarId' | 'username' | 'profileAvatar'
>;
