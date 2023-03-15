import { ICommonMeetingUserDTO } from '../../../interfaces/common-user.interface';

export class UpdateUserRequestDTO implements Partial<ICommonMeetingUserDTO> {
  id: ICommonMeetingUserDTO['id'];
  username: ICommonMeetingUserDTO['username'];
  isAuraActive: ICommonMeetingUserDTO['isAuraActive'];
  size: number;
  userPosition: ICommonMeetingUserDTO['userPosition'];
}
