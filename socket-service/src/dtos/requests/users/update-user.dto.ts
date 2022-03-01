import { ICommonMeetingUserDTO } from '../../../interfaces/common-user.interface';

export class UpdateUserRequestDTO implements Partial<ICommonMeetingUserDTO> {
  id: ICommonMeetingUserDTO['id'];
  meetingUserId: ICommonMeetingUserDTO['meetingUserId'];
  username: ICommonMeetingUserDTO['username'];
}
